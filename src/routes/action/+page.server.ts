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
        const minDateToggle = data.get("minDateToggle") as String;
        const minDate = data.get("minDate") as String;
        const maxDateToggle = data.get("maxDateToggle") as String;
        const maxDate = data.get("maxDate") as String;
        const toDo = data.get("toDo") as String;

        const one_day = 43200 * 2;
        const minDateFormatted = new Date(String(minDate)).getTime()/1000;
        const maxDateFormatted = new Date(String(maxDate)).getTime()/1000 + one_day;
        
        const categories = data.get("categories") as String;
        let category_ids = categories.split(", ");
        let categoryToggles = [];
        // There will be an empty element at the end of category_ids
        for (let i = 0; i < category_ids.length-1; i++) {
            categoryToggles.push(Boolean(data.get("cat_"+Number(category_ids[i])+"_checked")));
        }

        let condition = "";
        let run_params = [];
        if (Boolean(minValueToggle)) {
            condition += " AND ";
            condition += "amount >= ?";
            run_params.push(Number(minValue));
            console.log(run_params);
        }
        if (Boolean(maxValueToggle)) {
            condition += " AND ";
            condition += "amount <= ?";
            run_params.push(Number(maxValue));
            console.log(run_params);
        }
        if (Boolean(minDateToggle)) {
            condition += " AND ";
            condition += "date >= ?";
            run_params.push(Number(minDateFormatted));
        }
        if (Boolean(maxDateToggle)) {
            condition += " AND ";
            condition += "date <= ?";
            run_params.push(Number(maxDateFormatted));
        }

        if (Number(toDo) === -3) {
            // Export CSV
        }else if (Number(toDo) === -2) {
            // Print Table / Export PDF
        }else if (Number(toDo) === -1) {
            // Delete All
            let curr_balance = Balance.current();
            if (Boolean(incomeToggle)) {
                for (let i = 0; i < categoryToggles.length; i++) {
                    if (categoryToggles[i]) {
                        let temp_condition = "(source = ?"+condition+")";
                        let temp_run_params = [Number(category_ids[i]), ...run_params];
                        let incomes = Income.givenParams(temp_condition, temp_run_params);

                        if (incomes.length > 0) {
                            incomes.forEach((income) => curr_balance.amountUsd -= income.amountUsd);

                            db.prepare("DELETE FROM income WHERE "+temp_condition).run(...temp_run_params);
                        }
                    }
                }
            }
            if (Boolean(expenseToggle)) {
                for (let i = 0; i < categoryToggles.length; i++) {
                    if (categoryToggles[i]) {
                        let temp_condition = "(source = ?"+condition+")";
                        let temp_run_params = [Number(category_ids[i]), ...run_params];
                        let expenses = Expense.givenParams(temp_condition, temp_run_params);

                        if (expenses.length > 0) {
                            expenses.forEach((expense) => curr_balance.amountUsd += expense.amountUsd);
                            
                            db.prepare("DELETE FROM expense WHERE "+temp_condition).run(...temp_run_params);
                        }
                    }
                }
            }
            db.prepare("UPDATE balance SET amount = ? WHERE id = ?").run(curr_balance.amountUsd, 1);
        }else {
            // Move to Category
            if (Boolean(incomeToggle)) {
                for (let i = 0; i < categoryToggles.length; i++) {
                    if (categoryToggles[i]) {
                        let temp_condition = "(source = ?"+condition+")";
                        let temp_run_params = [Number(category_ids[i]), ...run_params];

                        db.prepare("UPDATE income SET source = ? WHERE "+temp_condition).run(Number(toDo), ...temp_run_params);
                    }
                }
            }
            if (Boolean(expenseToggle)) {
                for (let i = 0; i < categoryToggles.length; i++) {
                    if (categoryToggles[i]) {
                        let temp_condition = "(source = ?"+condition+")";
                        let temp_run_params = [Number(category_ids[i]), ...run_params];

                        db.prepare("UPDATE expense SET source = ? WHERE "+temp_condition).run(Number(toDo), ...temp_run_params);
                    }
                }
            }
        }

        throw redirect(303, '/');
    }

};
