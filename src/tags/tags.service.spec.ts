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
            findOne: jest.fn(),
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

  describe('create', () => {
    it('should create a tag', async () => {
      const createSpy = jest.spyOn(tagEntity, 'create');
      const tag = {} as any;

      createSpy.mockReturnValueOnce(tag);
      await expect(service.create({} as any)).resolves.toEqual(tag);
    });
  });

  describe('find', () => {
    it('should return a list of articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const findAndCountAllSpy = jest.spyOn(tagEntity, 'findAndCountAll');
      findAndCountAllSpy.mockResolvedValueOnce({ rows: [], count: 0 });

      await expect(service.find(options)).resolves.toBeDefined();
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('limit', 15);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('offset', 0);
    });

    it('should return a list of articles filtered by article slug', async () => {
      const options = {
        page: 2,
        perPage: 15,
        q: 'slugify',
      };
      const findAndCountAllSpy = jest.spyOn(tagEntity, 'findAndCountAll');
      findAndCountAllSpy.mockResolvedValueOnce({ rows: [], count: 0 });

      await expect(service.find(options)).resolves.toBeDefined();
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('where.tag');
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('limit', 15);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('offset', 15);
    });
  });

  describe('findById', () => {
    it('should return a tag', async () => {
      const tagId = 1;
      const tag = {} as any;
      const findOneSpy = jest.spyOn(tagEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(tag);

      await expect(service.findById(tagId)).resolves.toBe(tag);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', tagId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a tag', async () => {
      const tagId = 1;
      const tag = {} as any;
      const findOneSpy = jest.spyOn(tagEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(tag);

      await expect(
        service.findById(tagId, { rejectOnEmpty: true }),
      ).resolves.toBe(tag);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', tagId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('findByTag', () => {
    it('should return a tag', async () => {
      const slug = 'foo';
      const tag = {} as any;
      const findOneSpy = jest.spyOn(tagEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(tag);

      await expect(service.findByTag(slug)).resolves.toBe(tag);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.tag');
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a tag', async () => {
      const slug = 'foo';
      const tag = {} as any;
      const findOneSpy = jest.spyOn(tagEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(tag);

      await expect(
        service.findByTag(slug, { rejectOnEmpty: true }),
      ).resolves.toBe(tag);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.tag');
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('findOrCreateMany', () => {
    it('should find and/or create tags', async () => {
      const findAllSpy = jest.spyOn(tagEntity, 'findAll');
      const bulkCreateSpy = jest.spyOn(tagEntity, 'bulkCreate');
      const tags = [{ tag: 'a' }, { tag: 'b' }, { tag: 'c' }, { tag: 'd' }];

      findAllSpy.mockResolvedValueOnce(tags.slice(0, 1) as any);
      bulkCreateSpy.mockResolvedValueOnce(tags.slice(1, 4) as any);

      await expect(service.findOrCreateMany(tags)).resolves.toEqual(tags);
    });
  });

  describe('fetchTagsReport', () => {
    it('should return a tags report', async () => {
      const report = [
        {
          tag: 'foo',
          count: '1',
        },
      ];
      const countSpy = jest.spyOn(articleTagEntity, 'count');
      countSpy.mockResolvedValueOnce(report as any);
      await expect(service.fetchTagsReport()).resolves.toHaveProperty('foo', 1);
    });
  });
});
