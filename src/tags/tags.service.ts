import { Inject, Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { ArticleTagEntity } from '../articles/article-tag.entity';

import { IPaging } from '../common/interface';
import { Like } from '../common/utils';
import { Repositories } from '../database/constrains';
import { TagEntity } from './tag.entity';
import { ITag } from './tag.interface';

interface IFindByOptions {
  scope?: string;
  rejectOnEmpty: boolean;
}

interface IFindOptions {
  perPage: number;
  page: number;
  q?: string;
}

// { [slug: string]: count: number }
export interface ITagReport {
  [key: string]: number;
}

@Injectable()
export class TagsService {
  constructor(
    @Inject(Repositories.TagRepository)
    private readonly tagEntity: typeof TagEntity,
    @Inject(Repositories.ArticleTagRepository)
    private readonly articleTagEntity: typeof ArticleTagEntity,
  ) {}

  async create(data: Pick<ITag, 'tag'>): Promise<TagEntity> {
    return await this.tagEntity.create(data);
  }

  async find(options: IFindOptions): Promise<IPaging<TagEntity>> {
    const { rows: tags, count } = await this.tagEntity.findAndCountAll({
      where: {
        ...(options.q && {
          tag: {
            [Op.like]: Like(options.q),
          },
        }),
      },
      limit: options.perPage,
      offset: (options.page - 1) * options.perPage,
    });

    return {
      paging: {
        ...options,
        count,
      },
      data: tags,
    };
  }

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<TagEntity | null>;

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<TagEntity>;

  async findById(
    id: number,
    options?: IFindByOptions,
  ): Promise<TagEntity | null> {
    return this.tagEntity.scope(options?.scope).findOne({
      where: {
        id,
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
    });
  }

  async findByTag(
    id: string,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<TagEntity | null>;

  async findByTag(
    id: string,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<TagEntity>;

  async findByTag(
    tag: string,
    options?: IFindByOptions,
  ): Promise<TagEntity | null> {
    return this.tagEntity.scope(options?.scope).findOne({
      where: {
        tag: Like(tag),
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
    });
  }

  async findOrCreateMany(data: Pick<ITag, 'tag'>[]): Promise<TagEntity[]> {
    const tagsData = data.map((tag) => ({
      ...tag,
      tag: TagEntity.slugify(tag.tag),
    }));
    const tags = await this.tagEntity.findAll({
      where: {
        tag: tagsData.map(({ tag }) => tag),
      },
    });
    const currentTags = tags.map(({ tag }) => tag);
    const tagsCreated = await this.tagEntity.bulkCreate(
      tagsData.filter(({ tag }) => currentTags.includes(tag)),
      {
        individualHooks: true,
        ignoreDuplicates: true,
      },
    );

    return [...tags, ...tagsCreated];
  }

  async fetchTagsReport(): Promise<ITagReport> {
    const groups = (
      (await this.articleTagEntity.count({
        attributes: [
          [Sequelize.col('tag.tag'), 'slug'],
          [Sequelize.fn('COUNT(*)'), 'count'],
        ],
        include: {
          model: TagEntity,
          attributes: ['tag'],
          required: true,
        },
        group: ['tagId'],
      })) as unknown as { tag: string; count: string }[]
    ).map(({ tag, count }) => ({ tag, count: +count }));

    const report: ITagReport = {};
    groups.forEach(({ tag, count }) => {
      report[tag] = count;
    });
    return report;
  }
}
