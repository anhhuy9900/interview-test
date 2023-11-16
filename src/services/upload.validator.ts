export function UploadFile() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunc = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log('UploadFile - args: ', args[0].file);
      //   console.log('UploadFile - target: ', target);
      //   console.log('UploadFile - propertyKey: ', propertyKey);
      //   console.log('UploadFile - originalFunc: ', originalFunc);
      if (args[0].file.size > 1000) {
        args[0].file = {
          ...args[0].file,
          errorMsg: 'invalid file',
        };
      }

      return originalFunc.apply(this, args);
    };
    return descriptor;
  };
}
