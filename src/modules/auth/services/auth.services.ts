import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { UserRepository } from '../../user/repositories/user.repository';
import { IUserModel } from '../../user/models/user.model';
import { ResponseHandler } from '../../../utils/response.util';
import { SECRET_KEY_ACCESS_TOKEN, EXPIRE_ACCESS_TOKEN } from '../../../config';

export interface IAuthService {
  createToken(body: object, expireIn: number): Promise<string>;
  verifyToken(token?: string): string | jwt.JwtPayload | null;
  verifyUser(body: object): Promise<null | object>;
  middleVerifyToken(req: Request, res: Response, next: NextFunction): void;
}

export class AuthService implements IAuthService {
  protected userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * create token
   * @param body
   * @returns
   */
  async createToken(body: object, expireIn: number): Promise<string> {
    const token = jwt.sign(
      {
        body,
      },
      SECRET_KEY_ACCESS_TOKEN,
      {
        expiresIn: expireIn,
      },
    );
    return token;
  }

  /**
   * Verify Token
   * @param token
   * @returns
   */
  verifyToken(token?: string): string | jwt.JwtPayload | null {
    try {
      if (!token) return null;
      const decoded = jwt.verify(token, SECRET_KEY_ACCESS_TOKEN);
      console.log('🚀 ------------------------------------------------------------------------------🚀');
      console.log('🚀 ~ file: auth.services.ts:56 ~ AuthService ~ verifyToken ~ decoded:', decoded);
      console.log('🚀 ------------------------------------------------------------------------------🚀');
      return decoded;
    } catch (err: any) {
      console.log('🚀 ----------------------------------------------------------------------🚀');
      console.log('🚀 ~ file: auth.services.ts:61 ~ AuthService ~ verifyToken ~ err:', err);
      console.log('🚀 ----------------------------------------------------------------------🚀');
      //throw new Error(err.message);
      return null;
    }
  }

  /**
   * Verify user
   * @param body
   * @returns
   */
  async verifyUser(body: Pick<IUserModel, 'email' | 'password'>): Promise<null | object> {
    const { email, password } = body;

    const user = await this.userRepository.findOneByOrFail({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Email or password is incorrect');
    }
    console.log('🚀 ------------------------------------------------------------------------------🚀');
    console.log('🚀 ~ file: auth.services.ts:56 ~ AuthService ~ verifyUser ~ EXPIRE_ACCESS_TOKEN:', EXPIRE_ACCESS_TOKEN);
    const payload = this.generatePayload(user);
    const accessToken = await this.createToken(payload, EXPIRE_ACCESS_TOKEN);
    return {
      ...payload,
      accessToken
    };
  }

  /**
   * Generate payload token
   * @param user
   * @returns
   */
  private generatePayload(user: IUserModel) {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
    };
  }

  /**
   * Middle Verify Token
   */
  middleVerifyToken(req: Request, res: Response, next: NextFunction) {
    const verifyData = this.verifyToken(req.headers.authorization?.split(' ')[1]) || null;
    if (!verifyData) {
      return ResponseHandler.sendUnauthorized(res, 'Token is expired');
    }

    (req as any).user = {
      ...(verifyData as JwtPayload).body,
    };

    next();
  }
}

export default new AuthService(new UserRepository());
