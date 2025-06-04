import type ShowMoreButton from '$lib/components/ShowMoreButton.svelte';
import { Income, Expense, Balance, Category } from '$lib/db.server';
import { error } from '@sveltejs/kit';
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

function check_name_length(name) {
    const Anything_At_All = 1;
    const Longest_Word_Rounded = 50; // Longest word in most English dictionaries is 45 rounded

    if (name < Anything_At_All) {
        return false;
    }else if (name > Longest_Word_Rounded) {
        return false;
    }
    return true;
};

export const actions = {

    addCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const name = data.get("name") as String;
        const color = data.get("color") as String;

        let valid = check_name_length(name);
        if (valid) {
            db.prepare("INSERT INTO categories (name, color) VALUES (?, ?)").run(name, color);
        }else {
            error(400, "Request Could Not Be Processed: Inputs Out of Valid Range");
        }
    },

    editCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const id = data.get("id") as String;
        const name = data.get("name") as String;
        const color = data.get("color") as String;

        // console.log(data);

        let valid = check_name_length(name);
        if (valid) {
            db.prepare("UPDATE categories SET name = ?, color = ? WHERE id = ?").run(name, color, Number(id));
        }else {
            error(400, "Request Could Not Be Processed: Inputs Out of Valid Range");
        }
    },

    deleteCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const id = data.get("id") as String;
        const cleanup = data.get("cleanup") as String;

        if (Number(cleanup) === -1) {
            let curr_balance = Balance.current();
            let incomes = Income.ofCategory(Number(id));
            let expenses = Expense.ofCategory(Number(id));

            incomes.forEach((income) => curr_balance.amountUsd -= income.amountUsd);
            expenses.forEach((expense) => curr_balance.amountUsd += expense.amountUsd);

            db.prepare("DELETE FROM income WHERE source = ?").run(Number(id));
            db.prepare("DELETE FROM expense WHERE source = ?").run(Number(id));
            db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(curr_balance.amountUsd, 1);
        }else {
            db.prepare("UPDATE income SET source = ? WHERE source = ?").run(Number(cleanup), Number(id));
            db.prepare("UPDATE expense SET source = ? WHERE source = ?").run(Number(cleanup), Number(id));
        }
        
        db.prepare("DELETE FROM categories WHERE id = ?").run(Number(id));
    }

};
