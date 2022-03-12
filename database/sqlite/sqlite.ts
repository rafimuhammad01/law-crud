import * as BetterSqlite3 from "better-sqlite3"
import Database from 'better-sqlite3';
import * as fs from 'fs';

export class SQLite {
    db : BetterSqlite3.Database
    constructor() {
        this.db = this.initDB() as unknown as BetterSqlite3.Database
    }

    private initDB(): BetterSqlite3.Database|undefined  {
        let db = new Database('./database/sqlite/law-db.db', { verbose: console.log });

        const migration = fs.readFileSync('./database/sqlite/migrations/create_table_book.sql', 'utf8');
        db.exec(migration);
        return db
    }
}