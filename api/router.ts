import * as express from 'express'
import { SQLite } from '../database/sqlite/sqlite'
import { BookController } from './controller/BookController';
import { HealtyCheckController } from './controller/HealthyCheckController'
import { BookRepository, BookRepositoryImpl } from './repository/BookRepository';
import { HealthyCheckRepository, HealthyCheckRepositoryImpl } from './repository/HealthyCheckRepository'
import { BookService, BookServiceImpl } from './service/BookService';
import {HealthyCheckService, HealthyCheckServiceImpl} from './service/HealtyCheckService'
import * as BetterSqlite3 from "better-sqlite3"
import * as cloudinary from 'cloudinary'
import { Cloudinary } from '../external/cloudinary';
import multer from 'multer';

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
    upload : multer.Multer

    constructor(router: express.Router){
        this.router = router
        this.sqlite = this.initSQLite()
        this.repository = this.initRepository()
        this.service = this.initService()
        this.controller = this.initController()
        this.upload = this.initCloudinaryMulter()
        
    }

    registerRouter(): express.Router {
        this.router = this.router.get("/api/v1/healthy-check", this.controller.healthyCheckController.healtyCheck)
        this.router = this.router.get("/api/v1/book", this.controller.bookController.getAll)
        this.router = this.router.post("/api/v1/book", this.controller.bookController.create)
        this.router = this.router.put("/api/v1/book/:id", this.controller.bookController.update)
        this.router = this.router.delete("/api/v1/book/:id", this.controller.bookController.delete)
        this.router = this.router.get("/api/v1/book/:id", this.controller.bookController.getById)
        this.router = this.router.post("/api/v1/book/upload-image", this.upload.single("image"), this.controller.bookController.upload)
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

    private initCloudinaryMulter() : multer.Multer {
        let cloudinaryInstance= new Cloudinary(process.env.CLOUDINARY_CLOUD_NAME as unknown as string, process.env.CLOUDINARY_API_KEY as unknown as string, process.env.CLOUDINARY_API_SECRET as unknown as string, true)
        this.upload = cloudinaryInstance.init()
        return this.upload
    }

}