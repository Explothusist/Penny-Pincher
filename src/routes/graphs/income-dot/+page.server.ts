import { Income, Expense, Balance } from '$lib/db.server';
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
    const one_month = one_day*365;
    const one_year = one_month*12;

    // const recentIncome = Income.recent(200).map(x => x.toJSON());
    const recentIncome = Income.allSince((Date.now()/1000)-one_year).map(x => x.toJSON());

    return {
        recentIncome: recentIncome,
    };
};