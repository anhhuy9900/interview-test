import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import ConnectDB from '../../../database';
import { UserDataModel, IUserDataModel } from '../models/user-data.model';

/**
 * UserDataRepository
 */
export class UserDataRepository {
  public repository: Repository<UserDataModel>;

  constructor() {
    this.repository = ConnectDB.getRepository<UserDataModel>(UserDataModel);
  }

  /**
   * Create function
   * @param data
   */
  async create(
    data: Pick<IUserDataModel, 'userId' | 's3Key' | 'fileType' | 'fileSize'>,
  ): Promise<IUserDataModel | any> {
    return await this.repository.save(data);
  }

  /**
   * Find one function
   * @param conditions
   */
  async findOne(conditions: FindOneOptions<IUserDataModel> = {}): Promise<IUserDataModel | null> {
    return await this.repository.findOne({ ...conditions });
  }

  /**
   * findOneByOrFail function
   * @param conditions
   */
  async findOneByOrFail(conditions: FindOptionsWhere<IUserDataModel>): Promise<UserDataModel> {
    return await this.repository.findOneByOrFail({ ...conditions });
  }
}
