import { Test, TestingModule } from '@nestjs/testing';
import { databaseProvider } from '../__mock__/sequelize';
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
        databaseProvider,
        {
          provide: Repositories.ArticleRepository,
          useValue: {
            scope: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
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

  describe('findById', () => {
    it('should return an article', async () => {
      const id = 1;
      const article = {} as any;
      const findOneSpy = jest.spyOn(articleEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(article);
      await expect(
        service.findById(id, { rejectOnEmpty: false }),
      ).resolves.toBe(article);
    });

    it('should return an article', async () => {
      const id = 1;
      const article = {} as any;
      const findOneSpy = jest.spyOn(articleEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(article);
      await expect(service.findById(id, { rejectOnEmpty: true })).resolves.toBe(
        article,
      );
    });
  });
});
