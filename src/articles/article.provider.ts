import { Repositories } from '../database/constrains';
import { ArticleEntity } from './article.entity';

export const ArticleProvider = [
  {
    provide: Repositories.ArticleRepository,
    useValue: ArticleEntity,
  },
];
