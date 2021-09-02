import { Test, TestingModule } from '@nestjs/testing';
import { Repositories } from '../database/constrains';
import { ProfileEntity } from './profile.entity';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profileEntity: typeof ProfileEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: Repositories.ProfileRepository,
          useValue: {
            create: jest.fn(),
            scope: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profileEntity = module.get<typeof ProfileEntity>(
      Repositories.ProfileRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile', async () => {
      const createSpy = jest.spyOn(profileEntity, 'create');
      const data = {
        userId: 1,
        image: '',
        firstName: '',
        lastName: '',
        username: '',
        bio: '',
      };
      const profile: any = {};
      createSpy.mockResolvedValueOnce(profile);
      await expect(service.create(data)).resolves.toBe(profile);
    });
  });

  describe('findById', () => {
    it('should return a profile', async () => {
      const profileId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(profile);
      await expect(
        service.findById(profileId, { rejectOnEmpty: false }),
      ).resolves.toBe(profile);
    });

    it('should return a profile', async () => {
      const profileId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(profile);
      await expect(
        service.findById(profileId, { rejectOnEmpty: true }),
      ).resolves.toBe(profile);
    });
  });
});
