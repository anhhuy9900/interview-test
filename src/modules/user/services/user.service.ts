import { IUserModel, UserModel } from '../models/user.model';
import { IUserDataModel, UserDataModel } from '../models/user-data.model';
import { UserRepository } from '../repositories/user.repository';
import { UserDataRepository } from '../repositories/user-data.repository';
import { AWS_S3 } from '../../../services/s3.service';
import { generateFileName } from '../../../utils';
import fs from 'fs';
import { IUserService } from '../user.d';

export class UserService implements IUserService {
  public repository: UserRepository;
  public userDataRepository: UserDataRepository;
  protected s3: AWS_S3;
  protected S3SubFolderKey = 'users';

  constructor(userRepository: UserRepository) {
    this.repository = userRepository;
    this.userDataRepository = new UserDataRepository();
    this.s3 = new AWS_S3();
  }

  async createUser(body: IUserModel): Promise<IUserModel> {
    return this.repository.create(body);
  }

  async upload(userId: number, file: Record<string, any>): Promise<IUserDataModel> {
    const { s3Key, fileType, fileSize } = await this.uploadToS3(userId, file);
    const fileData = await this.userDataRepository.create({
      userId,
      s3Key,
      fileType,
      fileSize,
    });

    return fileData;
  }

  private async uploadToS3(
    userId: number,
    file: Record<string, any>,
  ): Promise<Pick<IUserDataModel, 's3Key' | 'fileSize' | 'fileType'>> {
    const fileKey: string = `${this.S3SubFolderKey}/${userId}/${generateFileName(file.originalname)}`;
    const fileBody = fs.readFileSync(file.path);

    await this.s3.putObject({
      Key: fileKey,
      Body: fileBody,
    });
    return {
      s3Key: fileKey,
      fileSize: file.size,
      fileType: file.mimetype,
    };
  }

  async findUserById(userId: number): Promise<UserModel | null> {
    return await this.repository.findOne({ where: { id: userId }, relations: ['files'] });
  }

  async getUserQuotaUsage(userId: number): Promise<Record<string, any>> {
    const result = await this.repository.repository
      .createQueryBuilder('users')
      .select('users.id, users.quotaLimit')
      .addSelect((subQuery) => {
        return subQuery
          .select('SUM(userData.fileSize)')
          .from(UserDataModel, 'userData')
          .where('userData.userId = users.id');
      }, 'totalFileSizeUsed')
      .where('users.id = :userId')
      .setParameter('userId', userId)
      .getRawOne();

    return result;
  }

  async getFilesData(userId: number): Promise<UserModel['files'] | null> {
    const user = (await this.findUserById(userId)) as UserModel;
    return user.files;
  }

  async getS3Info(fileId: number): Promise<(UserDataModel & { s3SignUrl: string }) | null> {
    const file = await this.userDataRepository.findOneByOrFail({ id: fileId });
    let s3SignUrl = '';
    if (file) {
      s3SignUrl = await this.s3.getSignedUrl(file.s3Key);
    }

    return {
      ...file,
      s3SignUrl,
    };
  }
}
