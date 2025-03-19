import { Income, Expense, Balance } from '$lib/db.server';
import { redirect } from '@sveltejs/kit';
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

    const dateToggle = Boolean(url.searchParams.get("date")) || true;
    const minDate = Number(url.searchParams.get("minDate")) || ((Date.now()/1000)-one_year);
    const maxDate = Number(url.searchParams.get("maxDate")) || ((Date.now()/1000));
    const recentToggle = Boolean(url.searchParams.get("recent")) || false;
    const minRecent = Number(url.searchParams.get("minRecent")) || 0;
    const maxRecent = Number(url.searchParams.get("maxRecent")) || 50;
    
    const category_ids_raw = url.searchParams.get("catId") || "";
    const category_toggles_raw = url.searchParams.get("catTgl") || "";

    console.log(dateToggle);
    console.log(minDate);
    console.log(category_ids_raw);
    console.log(category_toggles_raw);

    const category_ids = category_ids_raw.split(",").map((id) => Number(id));
    const category_toggles = category_toggles_raw.split(",").map((tgl) => Boolean(tgl));

    console.log(category_ids);
    console.log(category_toggles);

    let condition = "";
    let params = [];
    if (category_ids.length > 0 && category_toggles.length > 0 && category_ids[0] !== 0) {
        condition += "(";
        for (let i = 0; i < category_toggles.length; i++) {
            if (category_toggles[i]) {
                if (condition !== "(") {
                    condition += " OR ";
                }
                condition += "source = ?";
                params.push(category_ids[i]);
            }
        }
        if (condition === "(") {
            condition += "1 = 0";
        }
        condition += ")";
    }

    let recentIncome: Income[];

    console.log("WHOOOPDEEEEDOOOOO           "+condition);
    console.log("WHOOOPDEEEEDOOOOO           "+params);

    if (dateToggle) {
        recentIncome = Income.allSinceGivenParams(minDate, condition, params).map(x => x.toJSON());
    }else {
        recentIncome = Income.recentGivenParams(maxRecent, condition, params).map(x => x.toJSON());
    }

    return {
        recentIncome: recentIncome,
        dateToggle: dateToggle,
        minDate: minDate,
        maxDate: maxDate,
        recentToggle: recentToggle,
        minRecent: minRecent,
        maxRecent: maxRecent,
        category_toggles: category_toggles
    };
};

export const actions = {

    applySettings: async ({ cookies, request, url }) =>{

        const hack = url.pathname;
        const data = await request.formData();
        const dateToggle = data.get("dateToggle") as String;
        const minDate = data.get("minDate") as String;
        const maxDate = data.get("maxDate") as String;
        const recentToggle = data.get("recentToggle") as String;
        const minRecent = data.get("minRecent") as String;
        const maxRecent = data.get("maxRecent") as String;
        
        const one_day = 86400;
        const minDateFormatted = new Date(String(minDate)).getTime()/1000;
        const maxDateFormatted = new Date(String(maxDate)).getTime()/1000 + one_day;
        
        const categories = data.get("categories") as String;
        let category_ids = categories.split(", ");
        let categoryToggles = [];
        // There will be an empty element at the end of category_ids
        for (let i = 0; i < category_ids.length-1; i++) {
            categoryToggles.push(Boolean(data.get("cat_"+Number(category_ids[i])+"_checked")));
        }

        let link_sett = "?";

        // if (Boolean(dateToggle)) {
        //     link_sett += "date=true&&recent=false&&minDate="+minDateFormatted+"&&maxDate="+maxDateFormatted;
        // }else if (Boolean(recentToggle)) {
        //     link_sett += "date=false&&recent=true&&minRecent="+Number(minRecent)+"&&maxRecent="+Number(maxRecent);
        // }
        link_sett += "date="+Boolean(dateToggle)+"&&recent="+Boolean(recentToggle)+"&&minDate="+minDateFormatted+"&&maxDate="+maxDateFormatted+"&&minRecent="+Number(minRecent)+"&&maxRecent="+Number(maxRecent);

        link_sett += "&&catTgl="+categoryToggles+"&&catId="+category_ids;

        redirect(303, "/graphs/graph/income-dot"+link_sett);
    }

};