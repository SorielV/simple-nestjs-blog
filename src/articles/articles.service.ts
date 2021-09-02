import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from '../database/constrains';
import { ArticleEntity, ArticleEntityScopes } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IPaging } from '../common/interface';
import { Like } from '../common/utils';

interface IFindByOptions {
  scope?: string;
  rejectOnEmpty: boolean;
}

interface IFindPagingOptions {
  perPage: number;
  page: number;
  q?: string;
  scope?: ArticleEntityScopes;
}

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(Repositories.ArticleRepository)
    private readonly articleEntity: typeof ArticleEntity,
  ) {}

  async create(userId: number, data: CreateArticleDto) {
    return this.articleEntity.create({
      ...data,
      userId,
    });
  }

  async find(options: IFindPagingOptions): Promise<IPaging<ArticleEntity>> {
    const { rows: data, count } = await this.articleEntity
      .scope(options.scope)
      .findAndCountAll({
        where: {
          ...(options.q && { slug: Like(options.q) }),
        },
        limit: options.page,
        offset: (options.page - 1) * options.perPage,
        nest: true,
        raw: true,
      });

    return {
      paging: {
        page: options.page,
        perPage: options.perPage,
        count,
      },
      data,
    };
  }

  async findByUserId(
    options: IFindPagingOptions & { userId: number; owner?: boolean },
  ): Promise<IPaging<ArticleEntity>> {
    const { rows: data, count } = await this.articleEntity
      .scope(options.scope)
      .findAndCountAll({
        where: {
          ...(options.q && { slug: Like(options.q) }),
          userId: options.userId,
        },
        limit: options.page,
        offset: (options.page - 1) * options.perPage,
        nest: true,
        raw: true,
      });

    return {
      paging: {
        page: options.page,
        perPage: options.perPage,
        count,
      },
      data,
    };
  }

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<ArticleEntity | null>;

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<ArticleEntity>;

  async findById(
    id: number,
    options?: IFindByOptions,
  ): Promise<ArticleEntity | null> {
    return this.articleEntity.scope(options?.scope).findOne({
      where: {
        id,
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
    });
  }

  async updateById(id: number, data: UpdateArticleDto & { userId: number }) {
    const article = await this.articleEntity.findOne({
      where: {
        id,
        userId: data.userId,
      },
      rejectOnEmpty: true,
    });
    return article.set(data).save();
  }

  async deleteById(id: number, userId: number) {
    const article = await this.articleEntity.scope('id').findOne({
      where: {
        id,
        userId,
      },
      rejectOnEmpty: true,
    });
    await article.destroy();
  }
}
