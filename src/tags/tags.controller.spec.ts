import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let tagsService: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    tagsService = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find GET /', () => {
    it('should find tags', async () => {
      const result = {} as any;
      const findSpy = jest.spyOn(tagsService, 'find');
      findSpy.mockResolvedValueOnce(result);

      const options = {
        perPage: 15,
        page: 1,
      };

      await expect(controller.find(options)).resolves.toEqual(result);
    });
  });

  describe('findById GET /:id', () => {
    it('should find tags', async () => {
      const tagId = 1;
      const result = {} as any;
      const findByIdSpy = jest.spyOn(tagsService, 'findById');
      findByIdSpy.mockResolvedValueOnce(result);

      await expect(controller.findById(tagId)).resolves.toEqual(result);
    });
  });
});
