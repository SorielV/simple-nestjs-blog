import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: {
            findById: jest.fn(),
            updateById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findById', () => {
    it('shold return users profile', async () => {
      const id = 1;
      const findByIdSpy = jest.spyOn(profilesService, 'findById');
      const profile = {} as any;
      findByIdSpy.mockResolvedValueOnce(profile);
      await expect(controller.findById(id)).resolves.toEqual(profile);
    });
  });

  describe('updateById', () => {
    it('should return users profile', async () => {
      const profileId = 1;
      const userId = 1;
      const updateByIdSpy = jest.spyOn(profilesService, 'updateById');
      const data = {
        image: null,
        firstName: '',
        lastName: '',
        bio: '',
      };
      updateByIdSpy.mockResolvedValueOnce({} as any);
      await expect(
        controller.updateById(profileId, data, {
          user: { userId, profileId },
        } as any),
      ).resolves.toBeDefined();
    });
  });
});
