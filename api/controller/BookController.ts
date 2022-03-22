import { BookService } from "../service/BookService";
import { NextFunction, Request, Response } from "express"
import { BookDetail, BookImage } from "../entity/Book";
import { responseEncoding } from "axios";
var HttpStatus = require('http-status-codes');

export class BookController {
    bookService : BookService

    constructor (booksService : BookService) {
        this.bookService = booksService
    }

    getAll = (req: Request, res: Response, next: NextFunction) => {
        try {
            let books = this.bookService.getAll()
            res.status(HttpStatus.OK as number).json({ 
                data : books as any
            })
        } catch (e) {
            next(e)
        }
    }

    create = (req: Request, res :Response, next: NextFunction) => {
        try {
            let dateParsed= new Date(Date.parse(req.body.release_date));
            let book : BookDetail = {
                title: req.body.title? req.body.title : "",
                author: req.body.author? req.body.author : "",
                description: req.body.description? req.body.description : "",
                volume: req.body.volume? req.body.volume : "",
                total_page: req.body.total_page? req.body.total_page : "",
                release_date: dateParsed
            }

            let bookResponse = this.bookService.create(book)
            res.status(HttpStatus.CREATED).json({ 
                data : bookResponse as any
            })
        } catch (e) {
            next(e)
        }
    }

    update = (req: Request, res :Response, next:NextFunction) => {
        try {
            let dateParsed= new Date(Date.parse(req.body.release_date));
            let book : BookDetail = {
                id : req.params.id? req.params.id as unknown as number : 0,
                title: req.body.title? req.body.title : "",
                author: req.body.author? req.body.author : "",
                description: req.body.description? req.body.description : "",
                volume: req.body.volume? req.body.volume : "",
                total_page: req.body.total_page? req.body.total_page : "",
                release_date: dateParsed
            }

            let bookResponse = this.bookService.update(book)
            res.status(HttpStatus.CREATED).json({ 
                data : bookResponse as any
            })
        } catch (e) {
            next(e)
        }
    }

    delete = (req: Request, res: Response, next: NextFunction) => {
        try {
            let bookId = req.params.id as unknown as number
            this.bookService.delete(bookId)
            res.status(HttpStatus.CREATED).json({ 
                data : `delete data of id ${bookId} success`
            })
        } catch(e) {
            next(e)
        }
    }

    getById = (req: Request, res: Response, next: NextFunction) => {
        try {
            let bookId = req.params.id as unknown as number
            let book = this.bookService.getById(bookId)
            res.status(HttpStatus.CREATED).json({ 
                data : book as any
            })
        } catch (e) {
            next(e)
        }
    }

    upload = (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json({ 
                id: req.file?.filename,
                url: req.file?.path 
            });
        } catch (e) {
            next(e)
        }
    }

}