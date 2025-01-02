import { Income, Expense, Balance } from '$lib/db.server';
import Database from 'better-sqlite3';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load(  { cookies, url }) {
    const STUPIDHACK = url.pathname;
	/*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
	load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
	It must be url.pathname too, not just url.  */


    const currentBalance = Balance.most_recent().toJSON();
    const recentIncome = Income.recent(25).map(x => x.toJSON());
    const recentExpense = Expense.recent(25).map(x => x.toJSON());

    return {
        currentBalance: currentBalance,
        recentIncome: recentIncome,
        recentExpense: recentExpense
    };
};

export const actions = {

    addIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;

		db.prepare("INSERT INTO income (amount, date, source) VALUES (?, ?, ?)").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, 1);
    },

    editIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;

		db.prepare("UPDATE income SET amount = ?, date = ? WHERE id = ?").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, Number(id));
    },

    deleteIncome: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;

		db.prepare("DELETE FROM income WHERE id = ?").run(Number(id));
    },

    addExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;

		db.prepare("INSERT INTO expense (amount, date, source) VALUES (?, ?, ?)").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, 1);
    },

    editExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;
		const amount = data.get("amount") as String;
		const date = data.get("date") as String;

        const formatted_date = new Date(String(date));
        const half_a_day = 43200;

		db.prepare("UPDATE expense SET amount = ?, date = ? WHERE id = ?").run(Number(amount), (formatted_date.getTime()/1000)+half_a_day, Number(id));
    },

    deleteExpense: async ({ cookies, request, url }) =>{

		const hack = url.pathname;
        const data = await request.formData();
		const id = data.get("id") as String;

		db.prepare("DELETE FROM expense WHERE id = ?").run(Number(id));
    }

};
