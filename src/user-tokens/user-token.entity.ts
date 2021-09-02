import { Optional } from 'sequelize';
import {
  Table,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
} from 'sequelize-typescript';
import { TableNames } from '../database/constrains';
import { UserEntity } from '../users/user.entity';
import { IUserToken, UserTokenType } from './user-token.interface';

@Table({
  tableName: TableNames.UserToken,
  createdAt: false,
  updatedAt: false,
  paranoid: true,
})
export class UserTokenEntity
  extends Model<Optional<IUserToken, 'id' | 'createdAt'>>
  implements IUserToken
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING(255))
  value: string;

  @ForeignKey(() => UserEntity)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.ENUM(...Object.values(UserTokenType)))
  type: UserTokenType;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  expiresAt: Date;
}
