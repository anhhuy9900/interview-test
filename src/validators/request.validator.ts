import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ValidateRequest {
  async validate(ObjectDTO: any, body: Record<string, any> | undefined): Promise<string[] | any> {
    const obj: Record<string, any> = plainToClass(ObjectDTO, body || {});
    const error: Record<string, any> = await validate(obj, { skipMissingProperties: true }).then((errors) => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        const errorTexts = [];
        for (const errorItem of errors) {
          errorTexts.push(errorItem.constraints);
        }
        return errorTexts.map((el: any) => Object.values(el)[0]);
      }
      return [];
    });
    return error;
  }
}
