import { Income, Expense, Balance, Category, adaptiveFromCSV } from '$lib/db.server';
import { redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load(  { cookies, url }) {
    const STUPIDHACK = url.pathname;
    /*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
    load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
    It must be url.pathname too, not just url.  */

    const categories = Category.get_all().map(x => x.toJSON());

    return {
        categories: categories
    };
};

export const actions = {

    importCSV: async ({ cookies, request, url }) => {

        const hack = url.pathname;
        const data = await request.formData();
        const importType = data.get("importType") as String;
        const importCategory = data.get("importCategory") as String;

        const CSVfile = data.get("CSVfile") as File;
        const contents = await CSVfile.text();
        
        let curr_balance = Balance.current();

        let override_category = Boolean(Number(importCategory) !== -1);

        if (Number(importType) === 1) {
            // As Income
            let incomes = contents.split("\n").map((income) => Income.fromCSV(income));
            incomes.pop();

            if (override_category) {
                incomes.forEach((income) => income.category = Number(importCategory));
            }

            for (let i = 0; i < incomes.length; i++) {
                db.prepare("INSERT INTO income (amount, date, source) VALUES (?, ?, ?)").run(incomes[i].amountUsd, incomes[i].date, incomes[i].category);
                curr_balance.amountUsd += incomes[i].amountUsd;
            }
        }else if (Number(importType) === 2) {
            // As Expense
            let expenses = contents.split("\n").map((expense) => Expense.fromCSV(expense));
            expenses.pop();

            if (override_category) {
                expenses.forEach((expense) => expense.category = Number(importCategory));
            }

            for (let i = 0; i < expenses.length; i++) {
                db.prepare("INSERT INTO expense (amount, date, source) VALUES (?, ?, ?)").run(expenses[i].amountUsd, expenses[i].date, expenses[i].category);
                curr_balance.amountUsd -= expenses[i].amountUsd;
            }
        }else {
            // As Indicated (Penny Pincher export only)
            let objects = contents.split("\n").map((object) => adaptiveFromCSV(object));
            objects.pop();

            if (override_category) {
                objects.forEach((object) => object.category = Number(importCategory));
            }

            for (let i = 0; i < objects.length; i++) {
                console.log(objects[i]);
                console.log(objects[i] instanceof Income);
                console.log(objects[i] instanceof Expense);
                if (objects[i] instanceof Income) {
                    db.prepare("INSERT INTO income (amount, date, source) VALUES (?, ?, ?)").run(objects[i].amountUsd, objects[i].date, objects[i].category);
                    curr_balance.amountUsd += objects[i].amountUsd;
                }else {
                    db.prepare("INSERT INTO expense (amount, date, source) VALUES (?, ?, ?)").run(objects[i].amountUsd, objects[i].date, objects[i].category);
                    curr_balance.amountUsd -= objects[i].amountUsd;
                }
            }
        }

        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(curr_balance.amountUsd, 1);

        throw redirect(303, '/');
    }

};
