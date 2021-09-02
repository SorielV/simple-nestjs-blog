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
});
