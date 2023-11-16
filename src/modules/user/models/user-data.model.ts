import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { UserModel } from './user.model'

export interface IUserDataModel {
  id: number
  userId: number
  s3Key: string
  fileType: string
  fileSize: number
  createdAt: Date
}

@Entity({
  name: 'user-data'
})
export class UserDataModel implements IUserDataModel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'int',
    nullable: false
  })
  userId!: number

  @ManyToOne(() => UserModel, (user) => user.files)
  user!: UserModel

  @Column({
    type: 'varchar',
    width: 255,
    nullable: false
  })
  s3Key!: string

  @Column({
    type: 'varchar',
    width: 255,
    nullable: true
  })
  fileType!: string

  @Column({
    type: 'int',
    width: 255,
    nullable: true
  })
  fileSize!: number

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt!: Date
}
