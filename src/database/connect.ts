import DataSourceTypeORM from './index';
import { DataSource } from 'typeorm'

class Database {
  // db: DataSource;
  isConnected: boolean;

  constructor() {
    // this.db = DataSourceTypeORM
    this.isConnected = false
  }

  async connect() {
    if (this.isConnected) return;
    await DataSourceTypeORM.initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
        this.isConnected = true
      })
      .catch((err: any) => {
        console.error('Error during Data Source connect: ', err)
      })
  }
}

export default Database;
