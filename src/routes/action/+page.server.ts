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

    doAction: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const incomeToggle = data.get("incomeToggle") as String;
        const expenseToggle = data.get("expenseToggle") as String;
        const minValueToggle = data.get("minValueToggle") as String;
        const minValue = data.get("minValue") as String;
        const maxValueToggle = data.get("maxValueToggle") as String;
        const maxValue = data.get("maxValue") as String;
        const toDo = data.get("toDo") as String;
        
        const categories = data.get("categories") as String;
        let category_ids = categories.split(", ");
        let categoryToggles = [];
        // There will be an empty element at the end of category_ids
        for (let i = 0; i < category_ids.length-1; i++) {
            categoryToggles.push(Boolean(data.get("cat_"+Number(category_ids[i])+"_checked")));
        }

        let condition = "WHERE ";
        if (Boolean(minValueToggle)) {
            if (condition !== "WHERE ") {
                condition += ", ";
            }
            condition += "amount > "+Number(minValue);
        }
        if (Boolean(maxValueToggle)) {
            if (condition !== "WHERE ") {
                condition += ", ";
            }
            condition += "amount < "+Number(maxValue);
        }

        if (Number(toDo) === -3) {
            // Export CSV
        }else if (Number(toDo) === -2) {
            // Print Table / Export PDF
        }else if (Number(toDo) === -1) {
            // Delete All
        }else {
            // Move to Category
        }

        db.prepare("INSERT INTO categories (name, color) VALUES (?, ?)").run(name, color);
    }

};
