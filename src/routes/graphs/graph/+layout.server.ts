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
    
    const one_day = 86400;
    const one_week = one_day*7;
    const one_month = one_day*30;
    const one_year = one_day*365;

    const dateToggle = Boolean((url.searchParams.get("date") || "true") === "true");
    const minDate = Number(url.searchParams.get("minDate")) || ((Date.now()/1000)-one_year);
    const maxDate = Number(url.searchParams.get("maxDate")) || ((Date.now()/1000));
    const recentToggle = Boolean((url.searchParams.get("recent") || "false") === "true");
    const minRecent = Number(url.searchParams.get("minRecent")) || 0;
    const maxRecent = Number(url.searchParams.get("maxRecent")) || 50;
    
    const category_ids_raw = url.searchParams.get("catId") || "";
    const category_toggles_raw = url.searchParams.get("catTgl") || "";

    const category_ids = category_ids_raw.split(",").map((id) => Number(id));
    const category_toggles = category_toggles_raw.split(",").map((tgl) => Boolean(tgl === "true"));

    return {
        categories: categories,
        dateToggle: dateToggle,
        minDate: minDate,
        maxDate: maxDate,
        recentToggle: recentToggle,
        minRecent: minRecent,
        maxRecent: maxRecent,
        category_ids: category_ids,
        category_toggles: category_toggles
    };
};