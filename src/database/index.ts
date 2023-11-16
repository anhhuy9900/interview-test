import { DataSource } from 'typeorm';
import { DB_HOST, DB_NAME, DB_USERNAME, DB_PASS, DB_PORT } from '../config';
import { UserModel } from '../modules/user/models/user.model';
import { UserDataModel } from '../modules/user/models/user-data.model';

const DataSourceTypeORM = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASS,
  database: DB_NAME,

  entities: [UserModel, UserDataModel],
  synchronize: false,
  migrationsRun: false,
  logging: true,
  logger: 'advanced-console',
  migrations: ['src/database/migrations/*.ts'],
});

export default DataSourceTypeORM;
