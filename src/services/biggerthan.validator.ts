import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBiggerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          console.log("🚀 ------------------------------------------------------------------------------🚀");
          console.log("🚀 ~ file: biggerthan.validator.ts:15 ~ validate ~ value:", value);
          console.log("🚀 ~ file: biggerthan.validator.ts:15 ~ validate ~ relatedValue:", relatedValue);
          return typeof value === 'number' && typeof relatedValue === 'number' && value < relatedValue;
        },
      },
    });
  };
}