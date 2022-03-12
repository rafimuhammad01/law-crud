import { HealthyCheckService } from "../service/HealtyCheckService"
import { Request, Response } from "express"

export class HealtyCheckController {
    healthyCheckService : HealthyCheckService

    constructor(healthyCheckService: HealthyCheckService ) {
        this.healthyCheckService = healthyCheckService
    }
    
    healtyCheck = (req:Request, res:Response) => {
        let result = this.healthyCheckService.healthyCheck()
        return res.json({
            message : result
       })
   }
}