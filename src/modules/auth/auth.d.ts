import { Response, Request, NextFunction } from 'express';

export interface IAuthService {
  createToken(body: object, expireIn: number): Promise<string>;
  verifyToken(token?: string): string | jwt.JwtPayload | null;
  verifyUser(body: object): Promise<null | object>;
  authenticate(req: Request, res: Response, next: NextFunction): void;
}
