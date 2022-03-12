import { BookList, BookDetail } from "../entity/Book"
import * as BetterSqlite3 from "better-sqlite3"
import { ErrorType } from "../../util/errors"

export interface BookRepository {
    getAll() : BookList[] | void
    create(book: BookDetail) : BookDetail | void
    update(book: BookDetail) : BookDetail | void
    delete (bookId : number): void
    getById(bookId : number) : BookDetail | void
}

export class BookRepositoryImpl implements BookRepository {
    sqlite : BetterSqlite3.Database

    constructor(sqlite: BetterSqlite3.Database) {
        this.sqlite = sqlite
    }

    getAll(): BookList[]|void {
        try {
            let books: BookList[] = []

            let data = this.sqlite.prepare("SELECT id, title, author, description FROM books").all()
            data.forEach(bookData => {
                let book: BookList = {
                    id: bookData.id,
                    title: bookData.title,
                    author: bookData.author,
                    description: bookData.description
                }

                books.push(book);
            });

            return books
        } catch (e) {
            console.log("[error when fetching data from SQLite] - ", e)
            throw e
        }
    }

    create(book: BookDetail): BookDetail | void{
        try {  
            let stmt = this.sqlite.prepare(`
                INSERT INTO books (title, author, description, volume, total_page, release_date) 
                VALUES (?,?,?,?,?,?) RETURNING *`
            ).bind(
                book.title,
                book.author,
                book.description,
                book.volume,
                book.total_page,
                book.release_date.toISOString()
            )
            
            let data = stmt.get()
            let result : BookDetail = {
                id : data.id,
                title: data.title,
                author: data.author,
                description: data.description,
                volume: data.volume,
                total_page: data.total_page,
                release_date: data.release_date
            }
            return result
        } catch (e) {
            console.log("[error when create data from SQLite] - ", e)
            throw e
        }
    }

    update(book: BookDetail): void | BookDetail {
        try {  
            let stmt = this.sqlite.prepare(`
                UPDATE books SET 
                    title = ?, 
                    author = ?, 
                    description = ?, 
                    volume = ?, 
                    total_page = ?, 
                    release_date = ?,
                    updated_at = ?
                WHERE id = ?
                RETURNING *`
            ).bind(
                book.title,
                book.author,
                book.description,
                book.volume,
                book.total_page,
                book.release_date.toISOString(),
                Date.now(),
                book.id
            )
            
            let data = stmt.get()
            if (!data) {
                throw ErrorType.ErrNotFound(`book data with id = ${book.id} is not found`)
            }

            let result : BookDetail = {
                id : data.id,
                title: data.title,
                author: data.author,
                description: data.description,
                volume: data.volume,
                total_page: data.total_page,
                release_date: data.release_date
            }
            return result
        } catch (e: any) {
            console.log("[error when update data from SQLite] - ", e)
            throw e
        }
    }
    
    delete (bookId : number): void {
        try {
            let stmt = this.sqlite.prepare(`
                    DELETE FROM books
                    WHERE id = ?`
                ).bind(
                    bookId
                )
            stmt.run()
        } catch(e) {
            console.log("[error when delete data from SQLite] - ", e)
            throw e
        } 
    }

    getById(bookId: number): void | BookDetail {
        try {
            let stmt = this.sqlite.prepare(`
                SELECT * FROM books WHERE id = ?
            `).bind(bookId)

            let data = stmt.get()
            if (!data) {
                throw ErrorType.ErrNotFound(`book data with id = ${bookId} is not found`)
            }

            let result : BookDetail = {
                id : data.id,
                title: data.title,
                author: data.author,
                description: data.description,
                volume: data.volume,
                total_page: data.total_page,
                release_date: data.release_date
            }
            return result
        } catch (e) {
            console.log("[error when get book data from SQLite] - ", e)
            throw e
        }
    }
}