import Database from 'better-sqlite3';
// import { Connect } from 'vite';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");


interface SQLClause {
    text: string;
    values: any[];
}

// // Balance List
// export class Balance {
//     // Note: keep these as basic JS objects so serialization is ezpz
//     id: number;
//     amountUsd: number;
//     date: number;

//     constructor(
//         id: number,
//         amountUsd: number,
//         date: number,
//     ) {
//         this.id = id;
//         this.amountUsd = amountUsd;
//         this.date = date;
//     }

//     static recent(count: number = 25) {
//         const query = "SELECT id,amount,date FROM balance ORDER BY date DESC LIMIT ?;";
//         const rows: any[] = db.prepare(query).all([count]);

//         return rows.map(function(row: any) {
//             return new Balance(
//                 row.id,
//                 row.amount_usd,
//                 row.date
//             );
//         });
//     }
//     static most_recent() {
//         const query = "SELECT id,amount,date FROM balance ORDER BY date DESC LIMIT ?;";
//         const rows: any[] = db.prepare(query).all([1]);

//         return new Balance(
//             rows[0].id,
//             rows[0].amount,
//             rows[0].date
//         );
//     }

//     toJSON() {
//         const out = {...this};
//         return out;
//     }
// }

// Balance Single Value
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

    static current() {
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
    category: number;
    date: number;

    constructor(
        id: number,
        amountUsd: number,
        category: number,
        date: number,
    ) {
        this.id = id;
        this.amountUsd = amountUsd;
        this.category = category;
        this.date = date;
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date,source FROM income ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static allSince(date: number) {
        const query = "SELECT id,amount,date,source FROM income WHERE date > ? ORDER BY date DESC;";
        const rows: any[] = db.prepare(query).all(date);

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static ofCategory(id: number) {
        const query = "SELECT id,amount,date,source FROM income WHERE source = ? ORDER BY date DESC;";
        const rows: any[] = db.prepare(query).all(id);

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
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
    category: number;
    date: number;

    constructor(
        id: number,
        amountUsd: number,
        category: number,
        date: number,
    ) {
        this.id = id;
        this.amountUsd = amountUsd;
        this.category =  category;
        this.date = date;
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date,source FROM expense ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        return rows.map(function(row: any) {
            return new Expense(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static ofCategory(id: number) {
        const query = "SELECT id,amount,date,source FROM expense WHERE source = ? ORDER BY date DESC;";
        const rows: any[] = db.prepare(query).all(id);

        return rows.map(function(row: any) {
            return new Expense(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}

export class Category {
    // Note: keep these as basic JS objects so serialization is ezpz
    id: number;
    name: string;
    color: number;

    constructor(
        id: number,
        name: string,
        color: number
    ) {
        this.id = id;
        this.name = name;
        this.color =  color;
    }

    static get_all() {
        const query = "SELECT id,name,color FROM categories ORDER BY id;";
        const rows: any[] = db.prepare(query).all();

        rows.unshift({id: 0, name: "If You Witness The Arising Of This Text, Flee For Your Life", color: 1});

        return rows.map(function(row: any) {
            return new Category(
                row.id,
                row.name,
                row.color
            );
        });
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}