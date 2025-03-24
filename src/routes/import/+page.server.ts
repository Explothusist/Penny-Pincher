import {
    Income,
    Expense,
    Balance,
    Category,
    adaptiveFromCSV,
} from "$lib/db.server";
import { redirect } from "@sveltejs/kit";
import Database from "better-sqlite3";

const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load({ cookies, url }) {
    const STUPIDHACK = url.pathname;
    /*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
    load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
    It must be url.pathname too, not just url.  */

    const categories = Category.get_all().map((x) => x.toJSON());

    return {
        categories: categories,
    };
}

export const actions = {
    importCSV: async ({ cookies, request, url }) => {
        /* HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
        load functions will not run when changing pages unless something referenced in the function, such as url,
        changes. Maybe could be replaced with invalidateAll()? It must be url.pathname too, not just url. */
        const _ = url.pathname;

        // Decode metadata
        const data = await request.formData();
        const importType = Number(data.get("importType"));
        const importCategory = Number(data.get("importCategory"));

        // Decode CSV file as text
        const csvFile = data.get("CSVfile") as File;
        const contents = await csvFile.text();

        const currentBalance = Balance.current();

        // -1 as sentinel to keep previous
        const overrideCategory = importCategory !== -1;

        // Will be corresponding constructor, or adaptiveFromCSV if unapplicable.
        const csvConstructor =
            {
                1: Income.fromCSV,
                2: Expense.fromCSV,
            }[importType] || adaptiveFromCSV;

        // Transactions will be objects of their respective types, `Income` or `Expense`.
        const transactions = contents
            .split("\n")
            .map(csvConstructor)
            .filter((x) => x);

        if (overrideCategory) {
            transactions.forEach(
                (transaction) => (transaction.category = importCategory)
            );
        }

        for (const transaction of transactions) {
            // SECURITY: Ensure `table` is of known values to avoid SQL injection
            const table = transaction instanceof Income ? "income" : "expense";
            db.prepare(
                `INSERT INTO ${table} (amount, date, source) VALUES (?, ?, ?)`
            ).run(
                transaction.amountUsd,
                transaction.date,
                transaction.category
            );

            // Subtract if an expense
            currentBalance.amountUsd +=
                transaction.amountUsd *
                (transaction instanceof Income ? 1 : -1);
        }

        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(
            currentBalance.amountUsd,
            1
        );

        // Redirect to home
        throw redirect(303, "/");
    },
};
