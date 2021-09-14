import { Test, TestingModule } from '@nestjs/testing';
import { Repositories } from '../database/constrains';
import { ProfilesService } from '../profiles/profiles.service';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userEntity: typeof UserEntity;
  let profileService: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: Repositories.UserRepository,
          useValue: {
            create: jest.fn(),
            scope: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ProfilesService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userEntity = module.get<typeof UserEntity>(Repositories.UserRepository);
    profileService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an user and user profile', async () => {
      const data = {
        destroy: jest.fn().mockReturnThis(),
        profile: undefined,
      } as any;
      const profile = {} as any;
      const createSpy = jest.spyOn(userEntity, 'create');
      const createProfileSpy = jest.spyOn(profileService, 'create');

      createSpy.mockResolvedValueOnce(data);
      createProfileSpy.mockResolvedValueOnce(profile);

      await expect(service.create(data)).resolves.toEqual({
        ...data,
        profile,
      });
    });

    describe('when somethings wrong', () => {
      it('should destroy user if defined', async () => {
        const err = new Error(':c');
        const data = {
          destroy: jest.fn().mockReturnThis(),
          profile: undefined,
        };
        const createSpy = jest.spyOn(userEntity, 'create');
        const createProfileSpy = jest.spyOn(profileService, 'create');

        createSpy.mockResolvedValueOnce(data);
        createProfileSpy.mockRejectedValueOnce(err);

        await expect(service.create(data as any)).rejects.toThrow(err);
        expect(data.destroy).toHaveBeenCalled();
      });
    });
  });

  describe('findByEmailAndCompare', () => {
    it('should return an user', async () => {
      const email = 'reifaubi@bahjivvo.er';
      const password = 'Elsie';
      const passwordHash = await UserEntity.generatePasswordHash(password);

      const user = {
        email,
        password: passwordHash,
        destroy: jest.fn().mockReturnThis(),
        profile: undefined,
      };

      const findOneSpy = jest.spyOn(userEntity, 'findOne');
      findOneSpy.mockResolvedValueOnce(user as any);

      await expect(
        service.findByEmailAndCompare(email, password),
      ).resolves.toEqual(user);
    });

    describe('when something is wrong', () => {
      it('should throw an exception', async () => {
        const email = 'reifaubi@bahjivvo.er';
        const password = 'Elsie';
        const user = {
          email,
          password,
          destroy: jest.fn().mockReturnThis(),
          profile: undefined,
        };

        const findOneSpy = jest.spyOn(userEntity, 'findOne');
        findOneSpy.mockResolvedValueOnce(user as any);

        await expect(
          service.findByEmailAndCompare(email, password),
        ).rejects.toThrow();
      });
    });
  });
});
