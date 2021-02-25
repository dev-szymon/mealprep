import {Request, Response } from 'express-session'

export type ResolverContext = {
    req: Request & {session: Express.Session}
    res: Response
    user: string
}