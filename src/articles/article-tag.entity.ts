import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  Unique,
  BelongsTo,
} from 'sequelize-typescript';
import { TableNames } from '../database/constrains';
import { TagEntity } from '../tags/tag.entity';
import { IArticleTag } from './article-tag.interface';
import { ArticleEntity } from './article.entity';

@Table({
  tableName: TableNames.ArticleTagTable,
  createdAt: false,
  updatedAt: false,
})
export class ArticleTagEntity
  extends Model<IArticleTag>
  implements IArticleTag
{
  @PrimaryKey
  @Unique({
    name: 'article_tag_article_id_tag_id_uq',
    msg: '(article_id, tag_id) must be unique',
  })
  @ForeignKey(() => ArticleEntity)
  @Column(DataType.INTEGER)
  articleId: number;

  @PrimaryKey
  @Unique({
    name: 'article_tag_article_id_tag_id_uq',
    msg: '(article_id, tag_id) must be unique',
  })
  @ForeignKey(() => TagEntity)
  @Column(DataType.INTEGER)
  tagId: number;

  @BelongsTo(() => ArticleEntity)
  article: ArticleEntity;

  @BelongsTo(() => TagEntity)
  tag: TagEntity;
}
