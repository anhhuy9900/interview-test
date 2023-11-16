import { S3 } from 'aws-sdk';

export interface IPutObjectRequest extends Omit<S3.Types.PutObjectRequest, 'Bucket'> {
  Bucket?: string;
}

export interface IGetObjectRequest extends IPutObjectRequest {}

export class AWS_S3 {
  private s3: S3;
  public bucket!: string;

  constructor() {
    this.s3 = new S3({
      apiVersion: '2006-03-01',
      region: process.env.AWS_ENV_REGION,
      accessKeyId: process.env.AWS_ENV_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ENV_SECRET_ACCESS_KEY,
    });

    this.bucket = process.env.AWS_ENV_BUCKET || '';
  }

  async getObject({ Key, ...args }: IGetObjectRequest): Promise<Record<string, any>> {
    return await this.s3
      .getObject({
        Bucket: this.bucket,
        Key,
        ...args,
      })
      .promise();
  }

  async putObject({ Key, Body, ...args }: IPutObjectRequest) {
    return await this.s3
      .putObject({
        ...args,
        Bucket: this.bucket,
        Key,
        Body,
      })
      .promise();
  }

  async getSignedUrl(key: string): Promise<string> {
    const signedUrlExpireSeconds = 60 * 2;
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
  }
}
