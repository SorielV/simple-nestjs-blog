import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { ProfilesService } from '../profiles/profiles.service';
import { TagsService } from '../tags/tags.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let articlesService: ArticlesService;
  let profilesService: ProfilesService;
  let tagsService: TagsService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: ProfilesService,
          useValue: {
            findUserIdByUsername: jest.fn(),
          },
        },
        {
          provide: TagsService,
          useValue: {
            fetchTagsReport: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    articlesService = module.get<ArticlesService>(ArticlesService);
    profilesService = module.get<ProfilesService>(ProfilesService);
    tagsService = module.get<TagsService>(TagsService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const data = {} as any;
      const userId = 1;
      const createSpy = jest.spyOn(articlesService, 'create');
      createSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.create(data, { user: { userId } } as any),
      ).resolves.toBeDefined();
      expect(createSpy).toHaveBeenCalledWith(userId, data);
    });
  });

  describe('find', () => {
    it('should return articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const findSpy = jest.spyOn(articlesService, 'find');

      findSpy.mockResolvedValueOnce({} as any);

      await expect(controller.find(options)).resolves.toBeDefined();
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('fetchTagsReport', () => {
    it('should return tag report', async () => {
      const getCacheSpy = jest.spyOn(cache, 'get');
      const setCacheSpy = jest.spyOn(cache, 'set');
      const fetchTagsReportSpy = jest.spyOn(tagsService, 'fetchTagsReport');

      getCacheSpy.mockResolvedValueOnce(undefined);
      setCacheSpy.mockImplementationOnce(() => undefined);
      fetchTagsReportSpy.mockResolvedValueOnce({} as any);

      await expect(controller.fetchTagsReport()).resolves.toBeDefined();
      expect(fetchTagsReportSpy).toHaveBeenCalledWith();
      expect(setCacheSpy).toHaveBeenCalled();
    });

    it('should return tag report from cache', async () => {
      const getCacheSpy = jest.spyOn(cache, 'get');
      const setCacheSpy = jest.spyOn(cache, 'set');
      const fetchTagsReportSpy = jest.spyOn(tagsService, 'fetchTagsReport');

      getCacheSpy.mockResolvedValueOnce({});
      setCacheSpy.mockImplementationOnce(() => undefined);
      fetchTagsReportSpy.mockResolvedValueOnce({} as any);

      await expect(controller.fetchTagsReport()).resolves.toBeDefined();
      expect(fetchTagsReportSpy).not.toHaveBeenCalled();
    });
  });

  describe('findByOwner', () => {
    it('should return articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const userId = 1;
      const findByUserIdSpy = jest.spyOn(articlesService, 'findByUserId');

      findByUserIdSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.findByOwner(options, { user: { userId } } as any),
      ).resolves.toBeDefined();
      expect(findByUserIdSpy).toHaveBeenCalledWith({
        ...options,
        userId,
        owner: true,
      });
    });
  });

  describe('findById', () => {
    it('should return an article', async () => {
      const id = 1;
      const findByIdSpy = jest.spyOn(articlesService, 'findById');

      findByIdSpy.mockResolvedValueOnce({} as any);

      await expect(controller.findById(id)).resolves.toBeDefined();
      expect(findByIdSpy).toHaveBeenCalledWith(id, expect.anything());
    });
  });

  describe('findByOwner', () => {
    it('should return articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const userId = 1;
      const findByUserIdSpy = jest.spyOn(articlesService, 'findByUserId');

      findByUserIdSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.findByOwner(options, { user: { userId } } as any),
      ).resolves.toBeDefined();
      expect(findByUserIdSpy).toHaveBeenCalledWith({
        ...options,
        userId,
        owner: true,
      });
    });
  });

  describe('findByUsername', () => {
    it('should return articles', async () => {
      const options = {
        page: 1,
        perPage: 15,
      };
      const username = 'gopher';
      const userId = 1;
      const findUserIdByUsernameSpy = jest.spyOn(
        profilesService,
        'findUserIdByUsername',
      );
      const findByUserIdSpy = jest.spyOn(articlesService, 'findByUserId');

      findUserIdByUsernameSpy.mockResolvedValueOnce(userId);
      findByUserIdSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.findByUsername(options, username),
      ).resolves.toBeDefined();
      expect(findUserIdByUsernameSpy).toHaveBeenCalledWith(
        username,
        expect.anything(),
      );
    });
  });

  describe('updateById', () => {
    it('should update an article', async () => {
      const data = {} as any;
      const id = 1;
      const userId = 1;
      const updateByIdSpy = jest.spyOn(articlesService, 'updateById');
      updateByIdSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.updateById(id, data, { user: { userId } } as any),
      ).resolves.toBeDefined();
      expect(updateByIdSpy).toHaveBeenCalledWith(id, {
        ...data,
        userId,
      });
    });
  });

  describe('deleteById', () => {
    it('should delete an article', async () => {
      const id = 1;
      const userId = 1;
      const deleteByIdSpy = jest.spyOn(articlesService, 'deleteById');
      deleteByIdSpy.mockResolvedValueOnce({} as any);

      await expect(
        controller.deleteById(id, { user: { userId } } as any),
      ).resolves.toBeDefined();
      expect(deleteByIdSpy).toHaveBeenCalledWith(id, userId);
    });
  });
});
