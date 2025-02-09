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

    const categories = Category.get_all().map(x => x.toJSON());

    return {
        categories: categories
    };
};

export const actions = {

    addCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const name = data.get("name") as String;
        const color = data.get("color") as String;

        db.prepare("INSERT INTO categories (name, color) VALUES (?, ?)").run(name, color);
    },

    editCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const id = data.get("id") as String;
        const name = data.get("name") as String;
        const color = data.get("color") as String;

        console.log(data);

        db.prepare("UPDATE categories SET name = ?, color = ? WHERE id = ?").run(name, color, Number(id));
    },

    deleteCategory: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const id = data.get("id") as String;
        
        db.prepare("DELETE FROM categories WHERE id = ?").run(Number(id));
    }

};
