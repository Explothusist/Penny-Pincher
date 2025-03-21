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

    static errorCode() {
        return new Income(-1, -1, 1, 1);
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date,source FROM income ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static allInRecentRangeGivenParams(minRecent: number, maxRecent: number, condition: string, params: number[]) {
        if (condition !== "") {
            condition = "WHERE "+condition;
        }
        const query = "SELECT id,amount,date,source FROM income "+condition+" ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all(...params, maxRecent);

        rows.splice(0, minRecent);

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

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

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static allInDateRangeGivenParams(minDate: number, maxDate: number, condition: string, params: number[]) {
        if (condition !== "") {
            condition = "AND ("+condition+")"
        }
        const query = "SELECT id,amount,date,source FROM income WHERE date > ? AND date < ? "+condition+" ORDER BY date DESC;";
        const rows: any[] = db.prepare(query).all(minDate, maxDate, ...params);

        // console.log(query);
        // console.log(rows);

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

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

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static givenParams(condition: string, run_params: number[]) {
        const query = "SELECT id,amount,date,source FROM income WHERE "+condition+" ORDER BY date DESC;";

        // console.log(query);
        // console.log(...run_params);
        
        const rows: any[] = db.prepare(query).all(...run_params);

        if (rows.length === 0) {
            return [Income.errorCode()];
        }

        return rows.map(function(row: any) {
            return new Income(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static fromCSV(shard: string) {
        let bits = shard.split(",");
        return new Income(
            0,
            Number(bits[0]),
            Number(bits[2]),
            Number(bits[1])
        )
    }

    asCSV() {
        // $$,Cat,Date,I/E
        if (this.id !== -1) {
            return this.amountUsd+","+this.date+","+this.category+",0\r\n";
        }
        return "";
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

    static errorCode() {
        return new Income(-1, -1, 1, 1);
    }

    static recent(count: number = 25) {
        const query = "SELECT id,amount,date,source FROM expense ORDER BY date DESC LIMIT ?;";
        const rows: any[] = db.prepare(query).all([count]);

        if (rows.length === 0) {
            return [Expense.errorCode()];
        }

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

    static givenParams(condition: string, run_params: number[]) {
        const query = "SELECT id,amount,date,source FROM expense WHERE "+condition+" ORDER BY date DESC;";
        const rows: any[] = db.prepare(query).all(...run_params);

        return rows.map(function(row: any) {
            return new Expense(
                row.id,
                row.amount,
                row.source,
                row.date
            );
        });
    }

    static fromCSV(shard: string) {
        let bits = shard.split(",");
        return new Expense(
            0,
            Number(bits[0]),
            Number(bits[2]),
            Number(bits[1])
        )
    }

    asCSV() {
        // $$,Date,Cat,I/E
        if (this.id !== -1) {
            return this.amountUsd+","+this.date+","+this.category+",1\r\n";
        }
        return "";
    }

    toJSON() {
        const out = {...this};
        return out;
    }
}

export function adaptiveFromCSV(shard: string) {
    let bits = shard.split(",");
    // console.log(bits);
    // console.log(Number(bits[3]));
    if (Number(bits[3]) === 0) {
        return Income.fromCSV(shard);
    }else if (Number(bits[3]) === 1) {
        return Expense.fromCSV(shard);
    }else {
        return Income.fromCSV(shard);
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