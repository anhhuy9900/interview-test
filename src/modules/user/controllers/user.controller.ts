import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/response.util';
import { IUserService, UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserDataRepository } from '../repositories/user-data.repository';
import { ValidateRequest } from '../../../services/request.validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { hashPassword, covertBytesToMb, covertMbToByte } from '../../../utils';
import { UploadFileDto } from '../dto/upload.dto';
import { UpdateUserQuotaDto } from '../dto/update-user-quota.dto';
import { UploadFile } from '../../../services/upload.validator';
import { IUserModel } from '../models/user.model';

class UserController {
  protected userService: IUserService;
  protected validateRequest: ValidateRequest;

  /**
   * Constructor
   */
  constructor(userService: IUserService) {
    this.userService = userService;
    this.validateRequest = new ValidateRequest();
  }

  /**
   * Create user
   * @param req
   * @param res
   */
  async create(req: Request, res: Response) {
    const { body } = req;
    const validateErr = await this.validateRequest.validate(CreateUserDto, body);
    if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr);
    const data = await this.userService.createUser({
      ...body,
      password: hashPassword(body.password),
    });

    return ResponseHandler.sendCreated(res, {
      data,
      msg: 'User created success',
    });
  }

  /**
   * Update quota
   * @param req
   * @param res
   */
  async updateQuota(req: Request, res: Response) {
    const { quotaLimit, userId } = req.body;

    const validateErr = await this.validateRequest.validate(UpdateUserQuotaDto, req.body);
    if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr);

    const data = await this.userService.repository.update({ quotaLimit: covertMbToByte(quotaLimit) } as IUserModel, {
      id: userId,
    });

    if (!data?.affected) return ResponseHandler.sendBadRequest(res, `User's not exists in system`);

    return ResponseHandler.sendCreated(res, {
      data: {},
      msg: 'Updated quota limit success',
    });
  }

  /**
   * Update file
   * @param req
   * @param res
   */
  async upload(req: Request, res: Response) {
    try {
      const uploadFile = req.file as Record<string, any>;

      const user = (req as Record<string, any>).user;
      const validateErr = await this.validateRequest.validate(UploadFileDto, uploadFile);
      if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr);

      const quotaUsage = await this.userService.getUserQuotaUsage(user.id);
      console.log('🚀 --------------------------------------------------------------------------------🚀');
      console.log('🚀 ~ file: user.controller.ts:61 ~ UserController ~ upload ~ quotaUsage:', quotaUsage);
      console.log('🚀 --------------------------------------------------------------------------------🚀');

      const quotaLimit = quotaUsage?.quotaLimit;
      if (Number(quotaUsage?.totalFileSizeUsed) + uploadFile.size >= quotaLimit) {
        return ResponseHandler.sendBadRequest(
          res,
          `Your quota used to be upload exceeds the limitation of the system. The limitation of the upload quota is ${covertBytesToMb(
            quotaLimit,
          )} MB`,
        );
      }

      //Upload file to S3 and stores data to users-data table
      const data = await this.userService.upload(1, uploadFile);

      return ResponseHandler.sendCreated(res, {
        data,
        msg: `User's file uploaded success`,
      });
    } catch (err) {
      console.log('🚀 ~ file: user.controller.ts:39 ~ UserController ~ upload ~ err:', err);
      return ResponseHandler.sendForbidden(res, 'Have a problem with upload file');
    }
  }

  /**
   * Create user
   * @param req
   * @param res
   */
  async getFilesData(req: Request, res: Response) {
    console.log('🚀 ---------------------------------------------------------------------------------🚀');
    console.log('🚀 ~ file: user.controller.ts:116 ~ UserController ~ getFilesData ~ req:', req);
    console.log('🚀 ---------------------------------------------------------------------------------🚀');
    const { userId } = req.params;
    const data = await this.userService.getFilesData(Number(userId));

    return ResponseHandler.sendCreated(res, {
      data,
      msg: ''
    });
  }

  /**
   * get info of the file uploaded from S3
   * @param req
   * @param res
   */
  async getFileInfo(req: Request, res: Response) {
    const { fileId } = req.params;
    const data = await this.userService.getS3Info(Number(fileId));

    return ResponseHandler.sendCreated(res, {
      data,
      msg: ''
    });
  }
}

export default new UserController(new UserService(new UserRepository()));
