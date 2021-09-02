import { Test, TestingModule } from '@nestjs/testing';
import { ArticleTagEntity } from 'src/articles/article-tag.entity';
import { Repositories } from '../database/constrains';
import { TagEntity } from './tag.entity';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let tagEntity: typeof TagEntity;
  let articleTagEntity: typeof ArticleTagEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: Repositories.TagRepository,
          useValue: {
            create: jest.fn(),
            findAndCountAll: jest.fn(),
            scope: jest.fn().mockReturnThis(),
            findAll: jest.fn(),
            bulkCreate: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: Repositories.ArticleTagRepository,
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagEntity = module.get<typeof TagEntity>(Repositories.TagRepository);
    articleTagEntity = module.get<typeof ArticleTagEntity>(
      Repositories.ArticleTagRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
