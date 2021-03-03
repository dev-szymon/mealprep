import { Request, Response } from 'express-session';

export interface ResolverContext {
  req: Request & { session: Express.Session };
  res: Response;
  user: string;
}

export interface Context {
  user: string | undefined;
}
