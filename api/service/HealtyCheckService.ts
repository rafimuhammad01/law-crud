import { HealthyCheckRepository } from "../repository/HealthyCheckRepository"

export interface HealthyCheckService {
    healthyCheck(): string
}

export class HealthyCheckServiceImpl implements HealthyCheckService {
    repository: HealthyCheckRepository

    constructor (healthyCheckRepository: HealthyCheckRepository) {
        this.repository = healthyCheckRepository
    }

    healthyCheck(): string {
        return this.repository.healtyCheck()
    }
}