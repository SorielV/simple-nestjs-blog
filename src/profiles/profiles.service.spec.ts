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

      await expect(service.findById(profileId)).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', profileId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a profile', async () => {
      const profileId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(
        service.findById(profileId, { rejectOnEmpty: true }),
      ).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', profileId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('findById', () => {
    it('should return a profile', async () => {
      const profileId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(service.findById(profileId)).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', profileId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a profile', async () => {
      const profileId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(
        service.findById(profileId, { rejectOnEmpty: true }),
      ).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', profileId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('findByUserId', () => {
    it('should return a profile', async () => {
      const userId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(service.findByUserId(userId)).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        userId,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a profile', async () => {
      const userId = 1;
      const profile = {} as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(
        service.findByUserId(userId, { rejectOnEmpty: true }),
      ).resolves.toBe(profile);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        userId,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });
  });

  describe('findByUserId', () => {
    it('should return a profile', async () => {
      const username = 'foo';
      const profile = {
        userId: username,
      } as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(service.findUserIdByUsername(username)).resolves.toBe(
        profile.userId,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.username',
        username,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'rejectOnEmpty',
        false,
      );
    });

    it('should return a profile', async () => {
      const username = 'foo';
      const profile = {
        userId: 1,
      } as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(
        service.findUserIdByUsername(username, { rejectOnEmpty: true }),
      ).resolves.toBe(profile.userId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.username',
        username,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('rejectOnEmpty', true);
    });

    it('should return a profile', async () => {
      const username = 'foo';
      const profile = null;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(
        service.findUserIdByUsername(username, { rejectOnEmpty: false }),
      ).resolves.toBe(null);
    });
  });

  describe('updateById', () => {
    it('should update an article', async () => {
      const profileId = 1;
      const profile = {
        userId: 666,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
      } as any;
      const findOneSpy = jest.spyOn(profileEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(profile);

      await expect(service.updateById(profileId, profile)).resolves.toBe(
        profile,
      );
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where.id', profileId);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty(
        'where.userId',
        profile.userId,
      );
    });
  });
});
