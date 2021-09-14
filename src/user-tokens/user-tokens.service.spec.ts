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

  describe('createVerificationToken', () => {
    it('should create a new verification token', async () => {
      const userId = 1;
      const userToken = {} as any;
      const findOrCreateSpy = jest.spyOn(userTokenEntity, 'findOrCreate');

      findOrCreateSpy.mockResolvedValueOnce([userToken, true]);

      await expect(service.createVerificationToken(userId)).resolves.toEqual(
        userToken,
      );
    });

    it('should update the existing verification token', async () => {
      const userId = 1;
      const userToken = {
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
      } as any;
      const findOrCreateSpy = jest.spyOn(userTokenEntity, 'findOrCreate');

      findOrCreateSpy.mockResolvedValueOnce([userToken, false]);

      await expect(service.createVerificationToken(userId)).resolves.toEqual(
        userToken,
      );

      expect(userToken.set).toHaveBeenCalled();
      expect(userToken.save).toHaveBeenCalled();
    });
  });

  describe('PasswordResetToken', () => {
    it('should create a new password reset token', async () => {
      const userId = 1;
      const userToken = {} as any;
      const findOrCreateSpy = jest.spyOn(userTokenEntity, 'findOrCreate');

      findOrCreateSpy.mockResolvedValueOnce([userToken, true]);

      await expect(service.createPasswordResetToken(userId)).resolves.toEqual(
        userToken,
      );
    });

    it('should update the existing password reset token', async () => {
      const userId = 1;
      const userToken = {
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
      } as any;
      const findOrCreateSpy = jest.spyOn(userTokenEntity, 'findOrCreate');

      findOrCreateSpy.mockResolvedValueOnce([userToken, false]);

      await expect(service.createPasswordResetToken(userId)).resolves.toEqual(
        userToken,
      );

      expect(userToken.set).toHaveBeenCalled();
      expect(userToken.save).toHaveBeenCalled();
    });
  });

  describe('findAndValidateVerificationToken', () => {
    it('should return validate verification token', async () => {
      const userId = 1;
      const token = '';
      const userToken = {} as any;
      const findOneSpy = jest.spyOn(userTokenEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(userToken);
      await expect(
        service.findAndValidateVerificationToken(userId, token),
      ).resolves.toBeDefined();
    });
  });

  describe('findAndValidatePasswordResetToken', () => {
    it('should return validate password reset token', async () => {
      const userId = 1;
      const token = '';
      const userToken = {} as any;
      const findOneSpy = jest.spyOn(userTokenEntity, 'findOne');

      findOneSpy.mockResolvedValueOnce(userToken);
      await expect(
        service.findAndValidatePasswordResetToken(userId, token),
      ).resolves.toBeDefined();
    });
  });
});
