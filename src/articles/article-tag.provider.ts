import { Repositories } from '../database/constrains';
import { ArticleTagEntity } from './article-tag.entity';

export const ArticleTagProvider = [
  {
    provide: Repositories.ArticleTagRepository,
    useValue: ArticleTagEntity,
  },
];
