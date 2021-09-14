import { Test, TestingModule } from '@nestjs/testing';
import { Repositories } from '../database/constrains';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './article.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleEntity: typeof ArticleEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: Repositories.ArticleRepository,
          useValue: {
            scope: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            findAndCountAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleEntity = module.get<typeof ArticleEntity>(
      Repositories.ArticleRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const userId = 1;
      const data = {} as any;
      const article = {} as any;
      const createSpy = jest.spyOn(articleEntity, 'create');
      createSpy.mockResolvedValueOnce(article);

      await expect(service.create(userId, data)).resolves.toEqual(article);
    });
  });

  describe('find', () => {
    it('should return a list of articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const findAndCountAllSpy = jest.spyOn(articleEntity, 'findAndCountAll');
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
      const findAndCountAllSpy = jest.spyOn(articleEntity, 'findAndCountAll');
      findAndCountAllSpy.mockResolvedValueOnce({ rows: [], count: 0 });

      await expect(service.find(options)).resolves.toBeDefined();
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('where.slug');
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('limit', 15);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('offset', 15);
    });
  });

  describe('findByUserId', () => {
    it('should return a list of articles', async () => {
      const userId = 1;
      const options = {
        page: 1,
        perPage: 15,
        userId,
      };
      const findAndCountAllSpy = jest.spyOn(articleEntity, 'findAndCountAll');
      findAndCountAllSpy.mockResolvedValueOnce({ rows: [], count: 0 });

      await expect(service.findByUserId(options)).resolves.toBeDefined();
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('limit', 15);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('offset', 0);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        userId,
      );
    });

    it('should return a list of articles filtered by article slug', async () => {
      const userId = 1;
      const options = {
        page: 2,
        perPage: 15,
        q: 'slugify',
        userId,
      };
      const findAndCountAllSpy = jest.spyOn(articleEntity, 'findAndCountAll');
      findAndCountAllSpy.mockResolvedValueOnce({ rows: [], count: 0 });

      await expect(service.findByUserId(options)).resolves.toBeDefined();
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('where.slug');
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        userId,
      );
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('limit', 15);
      expect(findAndCountAllSpy.mock.calls[0][0]).toHaveProperty('offset', 15);
    });
  });

  describe('findById', () => {
    it('should return an article', async () => {
      const id = 1;
      const article = {} as any;

      const findOneSpy = jest.spyOn(articleEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(article);

      await expect(service.findById(id)).resolves.toBe(article);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', id);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return an article', async () => {
      const id = 1;
      const article = {} as any;

      const findOneSpy = jest.spyOn(articleEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(article);

      await expect(service.findById(id, { rejectOnEmpty: true })).resolves.toBe(
        article,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', id);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('updateById', () => {
    it('should update an article', async () => {
      const articleId = 1;
      const userId = 666;
      const article = {
        id: articleId,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
      };
      const data = {
        userId,
      };

      const findOneSpy = jest.spyOn(articleEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(article as any);

      await expect(
        service.updateById(articleId, data as any),
      ).resolves.toBeDefined();
      expect(article.set).toHaveBeenCalledWith(data);
      expect(article.save).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should delete an article', async () => {
      const articleId = 1;
      const userId = 666;
      const article = {
        id: articleId,
        destroy: jest.fn().mockReturnThis(),
      };

      const findOneSpy = jest.spyOn(articleEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(article as any);

      await expect(
        service.deleteById(articleId, userId),
      ).resolves.toBeUndefined();
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        userId,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', articleId);
      expect(article.destroy).toHaveBeenCalled();
    });
  });
});
