import { Repositories } from '../database/constrains';
import { TagEntity } from './tag.entity';

export const TagProvider = [
  {
    provide: Repositories.TagRepository,
    useValue: TagEntity,
  },
];
