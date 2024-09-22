import Database from 'better-sqlite3';
import { Connect } from 'vite';
const db = new Database("db/main.db", {});
db.pragma("journal_mode = WAL");
