import type ShowMoreButton from '$lib/components/ShowMoreButton.svelte';
import { Income, Expense, Balance, Category } from '$lib/db.server';
import Database from 'better-sqlite3';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load(  { cookies, url }) {
    const STUPIDHACK = url.pathname;
	/*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
	load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
	It must be url.pathname too, not just url.  */

    const income_to_load = Number(url.searchParams.get("income")) || 50;
    const expense_to_load = Number(url.searchParams.get("expense")) || 50;

    const currentBalance = Balance.current().toJSON();
    const recentIncome = Income.recent(income_to_load).map(x => x.toJSON());
    const recentExpense = Expense.recent(expense_to_load).map(x => x.toJSON());
    let categories = Category.get_all().map(x => x.toJSON());

    return {
        currentBalance: currentBalance,
        recentIncome: recentIncome,
        recentExpense: recentExpense,
        income_loaded: income_to_load,
        expense_loaded: expense_to_load,
        categories: categories
    };
};

export const actions = {

    addIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;
        const former_balance = data.get("former_balance") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;

        const new_balance = (Number(former_balance)+Number(amount));

        // console.log(Number(former_balance)+" + "+Number(amount)+" = "+(Number(former_balance)+Number(amount)));

		db.prepare("INSERT INTO income (amount, date, source) VALUES (?, ?, ?)").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, 1);
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    },

    editIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;
        const old_amount = data.get("old_amount") as String;
        const former_balance = data.get("former_balance") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;
        
        const new_balance = Number(former_balance)+Number(amount)-Number(old_amount);
        // console.log(Number(former_balance)+" + "+Number(amount)+" - "+Number(old_amount)+" = "+(Number(former_balance)+Number(amount)-Number(old_amount)));

		db.prepare("UPDATE income SET amount = ?, date = ? WHERE id = ?").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, Number(id));
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    },

    deleteIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
        const old_amount = data.get("old_amount") as String;
        const former_balance = data.get("former_balance") as String;
        
        const new_balance = Number(former_balance)-Number(old_amount);
        // console.log(Number(former_balance)+" - "+Number(old_amount)+" = "+(Number(former_balance)-Number(old_amount)));

		db.prepare("DELETE FROM income WHERE id = ?").run(Number(id));
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    },

    addExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;
        const former_balance = data.get("former_balance") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;
        
        const new_balance = Number(former_balance)-Number(amount);

		db.prepare("INSERT INTO expense (amount, date, source) VALUES (?, ?, ?)").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, 1);
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    },

    editExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;
        const old_amount = data.get("old_amount") as String;
        const former_balance = data.get("former_balance") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;
        
        const new_balance = Number(former_balance)-Number(amount)+Number(old_amount);

		db.prepare("UPDATE expense SET amount = ?, date = ? WHERE id = ?").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, Number(id));
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    },

    deleteExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
        const old_amount = data.get("old_amount") as String;
        const former_balance = data.get("former_balance") as String;
        
        const new_balance = Number(former_balance)+Number(old_amount);

		db.prepare("DELETE FROM expense WHERE id = ?").run(Number(id));
        db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(new_balance, 1);
    }

};
