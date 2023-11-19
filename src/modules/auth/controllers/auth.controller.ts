import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/response.util';
import { UserService } from '../../user/services/user.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { ValidateRequest } from '../../../validators/request.validator';
import { AuthService } from '../services/auth.services';
import { IUserService } from '../../user/user.d';
import { IAuthService } from '../auth.d';
import { UserLoginDto } from '../dto/user-login.dto';

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
    try {
      const { body } = req;
      const validateErr = await this.validateRequest.validate(UserLoginDto, body);
      if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr[0]);

      const data = await this.authService.verifyUser(body);
      return ResponseHandler.send(res, data);
    } catch (error) {
      return ResponseHandler.sendBadRequest(res, 'The email or password incorrect');
    }
  }
}

export default new AuthController(new UserService(new UserRepository()), new AuthService(new UserRepository()))
