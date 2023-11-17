import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/response.util';
import { UserService } from '../../user/services/user.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { ValidateRequest } from '../../../validators/request.validator';
import { AuthService } from '../services/auth.services';
import { IUserService } from '../../user/user.d';
import { IAuthService } from '../auth.d';

class AuthController {
  protected userService: IUserService;
  protected authService: IAuthService;
  protected validateRequest: ValidateRequest;

  constructor(userService: IUserService, authService: IAuthService) {
    this.userService = userService;
    this.authService = authService;
    this.validateRequest = new ValidateRequest();
  }

  /**
   * Login user
   * @param req
   * @param res
   */
  async login(req: Request, res: Response) {
    const { body } = req;
    try {
      const data = await this.authService.verifyUser(body);
      return ResponseHandler.send(res, data);
    } catch (error) {
      return ResponseHandler.sendUnauthorized(res, (error as Error).message);
    }
  }
}

export default new AuthController(new UserService(new UserRepository()), new AuthService(new UserRepository()))
