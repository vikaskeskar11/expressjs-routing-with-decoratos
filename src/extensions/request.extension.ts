declare namespace Express {
    export interface Request {
        user?: { email: string, name: string, id: number }
    }
}