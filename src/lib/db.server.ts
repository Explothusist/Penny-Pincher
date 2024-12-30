import Database from 'better-sqlite3';
import { Connect } from 'vite';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");


interface SQLClause {
    text: string;
    values: any[];
}

export class Balance {
    // Note: keep these as basic JS objects so serialization is ezpz
    id: number;
    amountUsd: number;
    date: number;

    constructor(
        id: number,
        amountUsd: number,
        date: number,
    ) {
        this.id = id;
        this.amountUsd = amountUsd;
        this.date = date;
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date FROM balance ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        return rows.map(function(row: any) {
            return new Balance(
                row.id,
                row.amount_usd,
                row.date
            );
        });
    }
    static most_recent() {
        const query = "SELECT id,amount,date FROM balance ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([1]);

        return new Balance(
            rows[0].id,
            rows[0].amount,
            rows[0].date
        );
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}

export class Income {
    // Note: keep these as basic JS objects so serialization is ezpz
    id: number;
    amountUsd: number;
    date: number;

    constructor(
        id: number,
        amountUsd: number,
        date: number,
    ) {
        this.id = id;
        this.amountUsd = amountUsd;
        this.date = date;
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date FROM income ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.date
            );
        });
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}

export class Expense {
    // Note: keep these as basic JS objects so serialization is ezpz
    id: number;
    amountUsd: number;
    date: number;

    constructor(
        id: number,
        amountUsd: number,
        date: number,
    ) {
        this.id = id;
        this.amountUsd = amountUsd;
        this.date = date;
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date FROM expense ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        return rows.map(function(row: any) {
            return new Expense(
                row.id,
                row.amount,
                row.date
            );
        });
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}