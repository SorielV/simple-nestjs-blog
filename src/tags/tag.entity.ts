import { Optional } from 'sequelize';
import {
  Table,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  BeforeSave,
  BelongsToMany,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { ArticleTagEntity } from '../articles/article-tag.entity';
import { ArticleEntity } from '../articles/article.entity';
import { TableNames } from '../database/constrains';
import { ITag } from './tag.interface';

@Table({
  tableName: TableNames.TagTable,
  createdAt: false,
  updatedAt: false,
})
export class TagEntity extends Model<Optional<ITag, 'id'>> implements ITag {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  tag: string;

  @BelongsToMany(() => ArticleEntity, () => ArticleTagEntity)
  articles: ArticleEntity[];

  @BeforeSave
  static generateSlug(tag: TagEntity) {
    tag.tag = TagEntity.slugify(tag.tag);
  }

  static slugify(tag: string): string {
    return slugify(tag, { lower: true });
  }
}
