import { Response } from 'express';

export enum HTTP_CODE {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export class ResponseHandler {
  static send<T>(res: Response, data: any): Response<T> {
    return res.status(HTTP_CODE.SUCCESS).send(data);
  }

  static sendCreated<T>(res: Response, data: any): Response<T> {
    return res.status(HTTP_CODE.CREATED).send(data);
  }

  static sendBadRequest<T>(res: Response, message: string): Response<T> {
    return res.status(HTTP_CODE.BAD_REQUEST).send({
      success: false,
      message: message,
    });
  }

  static sendUnauthorized<T>(res: Response, message: string): Response<T> {
    return res.status(HTTP_CODE.UNAUTHORIZED).send({
      success: false,
      message: message,
    });
  }

  static sendForbidden<T>(res: Response, message: string): Response<T> {
    return res.status(HTTP_CODE.FORBIDDEN).send({
      success: false,
      message,
    });
  }
}
