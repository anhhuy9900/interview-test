import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/response.util';
import { IUserService, UserService } from '../../user/services/user.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { ValidateRequest } from '../../../services/request.validator';
import { AuthService, IAuthService } from '../services/auth.services'

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
