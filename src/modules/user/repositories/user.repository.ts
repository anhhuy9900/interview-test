import { Condition, Repository, DeleteResult, FindOptionsWhere, UpdateResult, FindOneOptions } from 'typeorm';
import ConnectDB from '../../../database';
import { UserModel, IUserModel } from '../models/user.model';

/**
 * UserRepository
 */
export class UserRepository {
  public repository: Repository<UserModel>;

  constructor() {
    this.repository = ConnectDB.getRepository<UserModel>(UserModel);
  }

  /**
   * Get all data
   * @param conditions
   */
  async findAll(conditions?: Condition<IUserModel>): Promise<IUserModel[] | Error> {
    return await this.repository.find({
      where: {
        ...conditions,
      },
    });
  }

  /**
   * Create function
   * @param data
   */
  async create(data: IUserModel): Promise<IUserModel | any> {
    return await this.repository.save(data);
  }

  /**
   * Update function
   * @param data
   * @param conditions
   */
  async update(data: IUserModel, conditions: FindOptionsWhere<IUserModel>): Promise<UpdateResult | null> {
    return await this.repository.update({ ...conditions }, data);
  }

  /**
   * Delete function
   * @param conditions
   */
  async delete(conditions: Condition<IUserModel> = {}): Promise<DeleteResult> {
    return await this.repository.delete({ ...conditions });
  }

  /**
   * findOneByOrFail function
   * @param conditions
   */
  async findOneByOrFail(conditions: FindOptionsWhere<IUserModel>): Promise<UserModel> {
    return await this.repository.findOneByOrFail({ ...conditions });
  }

  /**
   * Find one function
   * @param conditions
   */
  async findOne(conditions: FindOneOptions<IUserModel>): Promise<UserModel | null> {
    return await this.repository.findOne({ ...conditions });
  }
}
