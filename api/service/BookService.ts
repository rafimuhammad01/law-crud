import { BookRepository } from "../repository/BookRepository"
import { BookList, BookDetail } from "../entity/Book"
import { ErrorType } from "../../util/errors"

export interface BookService {
    getAll() : BookList[] | void
    create(book : BookDetail) : BookDetail | void
    update(book : BookDetail) : BookDetail | void
    delete(bookId: number) : void
    getById(bookId: number) : BookDetail | void
}


export class BookServiceImpl implements BookService{
    bookRepository : BookRepository

    constructor(bookRepository: BookRepository) {
        this.bookRepository = bookRepository
    }

    getAll():  BookList[] | void {
        try {
            return this.bookRepository.getAll()
        } catch (e) {
            console.log("[error when calling function getAll on bookRepository] -  ", e)
            throw e;
        }
    }

    create(book : BookDetail): void | BookDetail {
        // validate input
        try {
            this.ValidateCreateInput(book)
            let data = this.bookRepository.create(book)
            return data
        } catch (e) {
            console.log("[error when calling function create on bookRepository] -  ", e)
            throw e
        }
    }

    update(book : BookDetail): void | BookDetail {
        // validate input
        try {
            this.ValidateCreateInput(book)
            let data = this.bookRepository.update(book)
            return data
        } catch (e) {
            console.log("[error when calling function update on bookRepository] -  ", e)
            throw e
        }
    }

    delete(bookId: number): void {
        try {
            this.bookRepository.delete(bookId)
        } catch (e) {
            console.log("[error when calling function delete on bookRepository] -  ", e)
            throw e
        }
    }

    getById(bookId: number): void | BookDetail {
        try {
            let data = this.bookRepository.getById(bookId)
            return data
        } catch (e) {
            console.log("[error when calling function getBookById on bookRepository] -  ", e)
            throw e
        }
    }

    private ValidateCreateInput(book: BookDetail) {
        if (book.author == "" ){
            throw ErrorType.ErrValidation("author is required")
        } 

        if (book.description == "") {
            throw ErrorType.ErrValidation("description is required")
        }

        if (book.release_date.toString() == "" ){
            throw ErrorType.ErrValidation("release_date is required")
        }

        if (book.title == "") {
            throw ErrorType.ErrValidation("title is required")
        }

        if (book.total_page == 0) {
            throw ErrorType.ErrValidation("total_page is required")
        }

        if (book.volume == 0) {
            throw ErrorType.ErrValidation("volume is required")
        }
    }
}
