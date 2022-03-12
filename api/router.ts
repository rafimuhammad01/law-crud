import * as express from 'express'
import { SQLite } from '../database/sqlite/sqlite'
import { BookController } from './controller/BookController';
import { HealtyCheckController } from './controller/HealthyCheckController'
import { BookRepository, BookRepositoryImpl } from './repository/BookRepository';
import { HealthyCheckRepository, HealthyCheckRepositoryImpl } from './repository/HealthyCheckRepository'
import { BookService, BookServiceImpl } from './service/BookService';
import {HealthyCheckService, HealthyCheckServiceImpl} from './service/HealtyCheckService'
import * as BetterSqlite3 from "better-sqlite3"

interface Controller {
    healthyCheckController: HealtyCheckController
    bookController : BookController
}

interface Service {
    healthyCheckService : HealthyCheckService
    bookService : BookService
}

interface Repository {
    healthyCheckRepository : HealthyCheckRepository
    bookRepository :BookRepository
}

export class Router {
    router: express.Router
    controller: Controller
    service : Service
    repository : Repository
    sqlite : BetterSqlite3.Database

    constructor(router: express.Router){
        this.router = router
        this.sqlite = this.initSQLite()
        this.repository = this.initRepository()
        this.service = this.initService()
        this.controller = this.initController()
    }

    registerRouter(): express.Router {
        this.router = this.router.get("/api/v1/healthy-check", this.controller.healthyCheckController.healtyCheck)
        this.router = this.router.get("/api/v1/book", this.controller.bookController.getAll)
        this.router = this.router.post("/api/v1/book", this.controller.bookController.create)
        this.router = this.router.put("/api/v1/book/:id", this.controller.bookController.update)
        this.router = this.router.delete("/api/v1/book/:id", this.controller.bookController.delete)
        this.router = this.router.get("/api/v1/book/:id", this.controller.bookController.getById)
        return this.router
    }

    private initController(): Controller {      
        this.controller = {
            healthyCheckController : new HealtyCheckController(this.service.healthyCheckService),
            bookController: new BookController(this.service.bookService)
        }

        return this.controller
    }

    private initService() : Service {
        this.service = {
            healthyCheckService : new HealthyCheckServiceImpl(this.repository.healthyCheckRepository),
            bookService : new BookServiceImpl(this.repository.bookRepository)
        }

        return this.service
    }

    private initRepository(): Repository {
        this.repository = {
            healthyCheckRepository : new HealthyCheckRepositoryImpl(),
            bookRepository : new BookRepositoryImpl(this.sqlite)
        }

        return this.repository
    }

    private initSQLite(): BetterSqlite3.Database {
        let db = new SQLite()
        this.sqlite = db.db
        return this.sqlite
    }

}