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
  UpdatedAt,
  ForeignKey,
  BelongsToMany,
  Scopes,
  BelongsTo,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { TableNames } from '../database/constrains';
import { ProfileEntity } from '../profiles/profile.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';
import { ArticleTagEntity } from './article-tag.entity';
import { IArticle } from './article.interface';

export enum ArticleEntityScopes {
  ID = 'id',
  Paging = 'paging',
}

@Table({
  tableName: TableNames.ArticleTable,
})
@Scopes(() => ({
  [ArticleEntityScopes.ID]: {
    attributes: ['id'],
  },
  [ArticleEntityScopes.Paging]: {
    attributes: {
      exclude: ['content'],
    },
    include: [
      {
        attributes: [],
        model: UserEntity,
        required: true,
        include: [
          {
            model: ProfileEntity,
            attributes: ['username', 'image', 'firstName', 'lastName'],
            required: true,
          },
        ],
      },
      {
        model: TagEntity,
        attributes: ['tag'],
        through: {
          attributes: [],
        },
      },
    ],
  },
  [ArticleEntityScopes.Paging]: {
    attributes: {
      exclude: ['description'],
    },
    include: [
      {
        attributes: [],
        model: UserEntity,
        required: true,
        include: [
          {
            model: ProfileEntity,
            attributes: ['username', 'image', 'firstName', 'lastName'],
            required: true,
          },
        ],
      },
      {
        model: TagEntity,
        attributes: ['tag'],
        through: {
          attributes: [],
        },
      },
    ],
  },
}))
export class ArticleEntity
  extends Model<
    Optional<IArticle, 'id' | 'slug' | 'image' | 'createdAt' | 'lastUpdate'>
  >
  implements IArticle
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => UserEntity)
  @ForeignKey(() => ProfileEntity)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  slug: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  content: string;

  @AllowNull
  @Default(null)
  @Column(DataType.STRING)
  image: string | null;

  @BelongsToMany(() => TagEntity, () => ArticleTagEntity)
  tags: (TagEntity & { ArticleTag?: ArticleTagEntity })[];

  static slugify(title: string): string {
    return slugify(title, { lower: true });
  }

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  lastUpdate: Date;
}
