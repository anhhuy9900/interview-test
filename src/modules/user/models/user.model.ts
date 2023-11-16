import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserDataModel } from './user-data.model';
import { QUOTA_LIMIT_UPLOAD } from '../../../config';

export interface IUserModel {
  id: number;
  files: UserDataModel[];
  email: string;
  userName: string;
  password: string;
  quotaLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({
  name: 'users',
})
export class UserModel implements IUserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => UserDataModel, (fileData) => fileData.user)
  files!: UserDataModel[];

  @Column({
    type: 'varchar',
    width: 255,
    nullable: false,
  })
  userName!: string;

  @Column({
    type: 'varchar',
    width: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    width: 255,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'int',
    nullable: false,
    default: Number(QUOTA_LIMIT_UPLOAD),
  })
  quotaLimit!: number;

  @CreateDateColumn({ default: () => 'NOW()' })
  updatedAt!: Date;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt!: Date;
}
