import * as cloudinary from 'cloudinary'
import * as cloudnaryMulter from 'multer-storage-cloudinary'
import multer from 'multer';
import path from "path";

export class Cloudinary {
    private cloudName : string
    private apiKey : string
    private apiSecret  : string
    private secure : boolean
    client : multer.Multer

    constructor(cloudName: string, apiKey: string, apiSecret: string, secure: boolean) {
        this.cloudName = cloudName
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.secure = secure
        this.client = this.init()
    }

    init = () : multer.Multer =>  {
        let cloudinaryClient = cloudinary.v2
        let config : cloudinary.ConfigOptions = {
            cloud_name: this.cloudName,
            api_key: this.apiKey,
            api_secret: this.apiSecret,
            secure : this.secure
        }

        cloudinaryClient.config(config)

        let paramsOption = {
            folder : "LAW",
            public_id: (req:any, file:any) => {
                let date = new Date()
                let ext = path.extname(file.originalname);
                return `${date.toISOString()}_${path.basename(file.originalname, ext)}`
            },
            format : (req:any, file:any) => {
                return path.extname(file.originalname).slice(1)
            }
        }

        let option : cloudnaryMulter.Options = {
            cloudinary: cloudinaryClient,
            params : paramsOption, 
        }

        let multerClient = multer({
            storage : new cloudnaryMulter.CloudinaryStorage(option),
        })
        
        return multerClient
    }
}