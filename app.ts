import express from 'express'
import * as dotenv from "dotenv";
import * as bodyParser from 'body-parser';
import { Router } from './api/router';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './util/errors';

class App {
    public express
    constructor(){
        dotenv.config();
        this.express = express()
        this.express.use(bodyParser.urlencoded());
        this.express.use(bodyParser.json({ limit: '50mb' }))
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use("/", this.newRouter().registerRouter())
        this.express.use(errorHandler)
    }

    private newRouter(): Router {
        return new Router(express.Router())
    }
}

export default new App().express;