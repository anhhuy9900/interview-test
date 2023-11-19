import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/response.util';
import { UserService } from '../services/user.service';
import { IUserService } from '../user.d';
import { UserRepository } from '../repositories/user.repository';
import { ValidateRequest } from '../../../validators/request.validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { hashPassword, covertBytesToMb, covertMbToByte } from '../../../utils';
import { UploadFileDto } from '../dto/upload.dto';
import { UpdateUserQuotaDto } from '../dto/update-user-quota.dto';
import { IUserModel } from '../models/user.model';

class UserController {
  protected userService: IUserService;
  protected validateRequest: ValidateRequest;

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
    if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr[0]);
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
    if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr[0]);

    const data = await this.userService.repository.update({ quotaLimit: covertMbToByte(quotaLimit) } as IUserModel, {
      id: userId,
    });

    if (!data?.affected) return ResponseHandler.sendBadRequest(res, `User's not exists in system`);

    return ResponseHandler.sendCreated(res, {
      data: {},
      msg: 'Updated quota limitation success',
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
      if (validateErr.length) return ResponseHandler.sendBadRequest(res, validateErr[0]);

      const quotaUsage = await this.userService.getUserQuotaUsage(user.id);

      const quotaLimit = quotaUsage?.quotaLimit;
      if (Number(quotaUsage?.totalFileSizeUsed) + uploadFile.size >= quotaLimit) {
        return ResponseHandler.sendBadRequest(
          res,
          `The upload quota has exceeded the limitation of the system. The limitation of the quota is ${covertBytesToMb(
            quotaLimit,
          )} MB. Please choose another file.`,
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
      return ResponseHandler.sendForbidden(res, 'Something went wrong with upload file');
    }
  }

  /**
   * Create user
   * @param req
   * @param res
   */
  async getFilesData(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data = await this.userService.getFilesData(Number(userId));

      return ResponseHandler.sendCreated(res, {
        data,
        msg: '',
      });
    } catch (err) {
      return ResponseHandler.sendForbidden(res, 'The file is not exist in system');
    }
  }

  /**
   * get info of the file uploaded from S3
   * @param req
   * @param res
   */
  async getFileInfo(req: Request, res: Response) {
    try {
      const { fileId } = req.params;
      const data = await this.userService.getS3Info(Number(fileId));

      return ResponseHandler.sendCreated(res, {
        data,
        msg: '',
      });
    } catch (err) {
      return ResponseHandler.sendForbidden(res, 'The file is not exist in system');
    }
  }
}

export default new UserController(new UserService(new UserRepository()));
