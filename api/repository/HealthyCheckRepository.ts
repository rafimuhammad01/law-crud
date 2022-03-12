export interface HealthyCheckRepository {
    healtyCheck(): string
}

export class HealthyCheckRepositoryImpl implements HealthyCheckRepository{
    constructor() {}

    healtyCheck(): string {
        return "ok from repo"
    }
}