import { UserRepository } from './repositories/user.repository';
import { UserDataRepository } from './repositories/user-data.repository';
import { UserModel, IUserModel } from './models/user.model';
import { UserDataModel, IUserDataModel } from './models/user-data.model';

export interface IUserService {
  repository: UserRepository;
  userDataRepository: UserDataRepository;

  createUser(body: IUserModel): Promise<IUserModel>;
  upload(userId: number, file: Record<string, any>): Promise<IUserDataModel>;
  findUserById(userId: number): Promise<UserModel | null>;
  getUserQuotaUsage(userId: number): Promise<Record<string, any>>;
  getFilesData(userId: number): Promise<UserModel['files'] | null>;
  getS3Info(fileId: number): Promise<UserDataModel | null>;
}
