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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { TableNames } from '../database/constrains';
import { UserEntity } from '../users/user.entity';
import { IProfile } from './profile.interface';

@Table({
  tableName: TableNames.ProfileTable,
})
export class ProfileEntity
  extends Model<
    Optional<IProfile, 'id' | 'bio' | 'image' | 'createdAt' | 'updatedAt'>
  >
  implements IProfile
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Unique
  @ForeignKey(() => UserEntity)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @AllowNull
  @Default(null)
  @Column(DataType.STRING)
  image: string | null;

  @AllowNull
  @Default(null)
  @Column(DataType.STRING)
  firstName: string;

  @AllowNull
  @Default(null)
  @Column(DataType.STRING)
  lastName: string;

  @Unique({
    name: 'user_username_uq',
    msg: 'username must be unique',
  })
  @Column(DataType.STRING)
  username: string;

  @AllowNull
  @Default(null)
  @Column(DataType.STRING)
  bio: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
