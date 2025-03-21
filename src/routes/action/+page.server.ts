import { writeFile } from 'node:fs/promises';
import { Income, Expense, Balance, Category } from '$lib/db.server';
import { json, redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");

export function load(  { cookies, url }) {
    const STUPIDHACK = url.pathname;
    /*  HACK: According to https://kit.svelte.dev/docs/load#rerunning-load-functions-when-do-load-functions-rerun
    load functions will not run when changing pages unless something referenced in the function, such as url, changes. Maybe could be replaced with invalidateAll()? 
    It must be url.pathname too, not just url.  */

    const one_day = 86400;
    const one_week = one_day*7;
    const one_month = one_day*30;
    const one_year = one_day*365;

    const preview = Boolean((url.searchParams.get("preview") || "true") === "true");
    const incomeToggle = Boolean((url.searchParams.get("incomeToggle") || "true") === "true");
    const expenseToggle = Boolean((url.searchParams.get("expenseToggle") || "true") === "true");
    const minValueToggle = Boolean((url.searchParams.get("minValueToggle") || "false") === "true");
    const minValue = Number(url.searchParams.get("minValue")) || 1000;
    const maxValueToggle = Boolean((url.searchParams.get("maxValueToggle") || "false") === "true");
    const maxValue = Number(url.searchParams.get("maxValue")) || 2000;
    const minDateToggle = Boolean((url.searchParams.get("minDateToggle") || "false") === "true");
    const minDate = Number(url.searchParams.get("minDate")) || ((Date.now()/1000));
    const maxDateToggle = Boolean((url.searchParams.get("maxDateToggle") || "false") === "true");
    const maxDate = Number(url.searchParams.get("maxDate")) || ((Date.now()/1000)-one_year);
    const toDo = Number(url.searchParams.get("toDo")) || -2;
    const category_ids_raw = url.searchParams.get("categories") || "";
    const category_toggles_raw = url.searchParams.get("categoryToggles") || "";

    const category_ids = category_ids_raw.split(",").map((id) => Number(id));
    const category_toggles = category_toggles_raw.split(",").map((tgl) => Boolean(tgl === "true"));

    const categories = Category.get_all().map(x => x.toJSON());

    let objects: (Income | Expense)[] = [];

    if (preview) {
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
            run_params.push(Number(minDate));
        }
        if (Boolean(maxDateToggle)) {
            condition += " AND ";
            condition += "date <= ?";
            run_params.push(Number(maxDate));
        }

        if (Boolean(incomeToggle)) {
            for (let i = 0; i < category_toggles.length; i++) {
                if (category_toggles[i]) {
                    let temp_condition = "(source = ?"+condition+")";
                    let temp_run_params = [Number(category_ids[i]), ...run_params];
                    let incomes = Income.givenParams(temp_condition, temp_run_params);

                    if (incomes.length > 0) {
                        incomes.forEach((income) => objects.push(income.toJSON()));
                    }
                }
            }
        }
        if (Boolean(expenseToggle)) {
            for (let i = 0; i < category_toggles.length; i++) {
                if (category_toggles[i]) {
                    let temp_condition = "(source = ?"+condition+")";
                    let temp_run_params = [Number(category_ids[i]), ...run_params];
                    let expenses = Expense.givenParams(temp_condition, temp_run_params);

                    if (expenses.length > 0) {
                        expenses.forEach((expense) => objects.push(expense.toJSON()));
                    }
                }
            }
        }
    }

    objects.sort((a, b) => b.date-a.date);

    return {
        categories: categories,
        incomeToggle: incomeToggle,
        expenseToggle: expenseToggle,
        minValueToggle: minValueToggle,
        minValue: minValue,
        maxValueToggle: maxValueToggle,
        maxValue: maxValue,
        minDateToggle: minDateToggle,
        minDate: minDate,
        maxDateToggle: maxDateToggle,
        maxDate: maxDate,
        toDo: toDo,
        category_ids: category_ids,
        category_toggles: category_toggles,
        objects: objects,
        preview: preview
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
            let csv_file = "";
            if (Boolean(incomeToggle)) {
                for (let i = 0; i < categoryToggles.length; i++) {
                    if (categoryToggles[i]) {
                        let temp_condition = "(source = ?"+condition+")";
                        let temp_run_params = [Number(category_ids[i]), ...run_params];
                        let incomes = Income.givenParams(temp_condition, temp_run_params);

                        if (incomes.length > 0) {
                            incomes.forEach((income) => csv_file += income.asCSV());
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
                            expenses.forEach((expense) => csv_file += expense.asCSV());
                        }
                    }
                }
            }
            if (csv_file !== "") {
                csv_file = csv_file.slice(0, -4);
            }
            try {
                await writeFile("Penny_Pincher_export_"+String(new Date(Date.now()).toISOString().slice(0, 10))+".csv", csv_file, "utf-8");
                console.log("Success");
            } catch (error) {
                console.log("Failure: "+error.message);
            }
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
    },
    
    previewAction: async ({ cookies, request, url }) =>{

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
        const maxDateFormatted = new Date(String(maxDate)).getTime()/1000;
        
        const categories = data.get("categories") as String;
        let category_ids = categories.split(", ");
        let categoryToggles = [];
        // There will be an empty element at the end of category_ids
        for (let i = 0; i < category_ids.length-1; i++) {
            categoryToggles.push(Boolean(data.get("cat_"+Number(category_ids[i])+"_checked")));
        }

        throw redirect(303,
            "?preview=true&&incomeToggle="+Boolean(incomeToggle)+"&&expenseToggle="+Boolean(expenseToggle)+
            "&&minValueToggle="+Boolean(minValueToggle)+"&&minValue="+minValue+"&&maxValueToggle="+Boolean(maxValueToggle)+
            "&&maxValue="+maxValue+"&&minDateToggle="+Boolean(minDateToggle)+"&&minDate="+minDateFormatted+
            "&&maxDateToggle="+Boolean(maxDateToggle)+"&&maxDate="+maxDateFormatted+"&&toDo="+toDo+"&&categories="+
            category_ids+"&&categoryToggles="+categoryToggles
        );
    }

};
