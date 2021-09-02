import { Test, TestingModule } from '@nestjs/testing';
import { Repositories } from '../database/constrains';
import { UserTokenEntity } from './user-token.entity';
import { UserTokensService } from './user-tokens.service';

describe('UserTokensService', () => {
  let service: UserTokensService;
  let userTokenEntity: typeof UserTokenEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTokensService,
        {
          provide: Repositories.UserToken,
          useValue: {
            findOrCreate: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserTokensService>(UserTokensService);
    userTokenEntity = module.get<typeof UserTokenEntity>(
      Repositories.UserToken,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
