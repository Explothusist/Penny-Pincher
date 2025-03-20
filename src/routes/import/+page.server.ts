import { Income, Expense, Balance, Category } from '$lib/db.server';
import { redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load(  { cookies, url }) {
    const STUPIDHACK = url.pathname;
    /*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
    load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
    It must be url.pathname too, not just url.  */

    return {
    };
};

export const actions = {

    importCSV: async ({ cookies, request, url }) => {

        const hack = url.pathname;
        const data = await request.formData();
        const asIncome = data.get("asIncome") as String;
        const asExpense = data.get("asExpense") as String;

        const CSVfile = data.get("CSVfile") as File;
        const contents = await CSVfile.text();
        
        let curr_balance = Balance.current();

        if (Boolean(asIncome)) {
            console.log(contents);
            let incomes = contents.split("\n").map((income) => Income.fromCSV(income));
            incomes.pop();

            for (let i = 0; i < incomes.length; i++) {
                db.prepare("INSERT INTO income (amount, date, source) VALUES (?, ?, ?)").run(incomes[i].amountUsd, incomes[i].date, incomes[i].category);
                curr_balance.amountUsd += incomes[i].amountUsd;
            }
        }else {
            let expenses = contents.split("\n").map((expense) => Expense.fromCSV(expense));
            expenses.pop();

            for (let i = 0; i < expenses.length; i++) {
                db.prepare("INSERT INTO expense (amount, date, source) VALUES (?, ?, ?)").run(expenses[i].amountUsd, expenses[i].date, expenses[i].category);
                curr_balance.amountUsd -= expenses[i].amountUsd;
            }
        }

        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(curr_balance.amountUsd, 1);

        throw redirect(303, '/');
    }

};
