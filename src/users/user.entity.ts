import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';
import {
  Table,
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Unique,
  UpdatedAt,
  BeforeSave,
  HasOne,
  Scopes,
} from 'sequelize-typescript';
import { TableNames } from '../database/constrains';
import { ProfileEntity } from '../profiles/profile.entity';
import { IUser } from './user.interface';

export enum UserEntityScopes {
  Session = 'session',
}

@Table({
  tableName: TableNames.UserTable,
})
@Scopes(() => ({
  [UserEntityScopes.Session]: {
    include: {
      attributes: ['id', 'username', 'verified'],
      model: ProfileEntity,
    },
  },
}))
export class UserEntity
  extends Model<
    Optional<
      IUser,
      'id' | 'verified' | 'createdAt' | 'lastConnection' | 'updatedAt'
    >
  >
  implements IUser
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Unique({
    name: 'user_email_uq',
    msg: 'email must be unique',
  })
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @AllowNull
  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean;

  @AllowNull
  @Default(() => new Date())
  @Column(DataType.DATE)
  lastConnection: Date;

  @HasOne(() => ProfileEntity)
  profile: ProfileEntity;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  static async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  @BeforeSave
  static async setPasswordHash(instance: UserEntity): Promise<void> {
    const hashedPassword = await UserEntity.generatePasswordHash(
      instance.password,
    );
    instance.set({
      password: hashedPassword,
    });
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
