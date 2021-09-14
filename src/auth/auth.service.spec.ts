import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/users/user.entity';
import { MailService } from '../mail/mail.service';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let userTokensService: UserTokensService;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailAndCompare: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: UserTokensService,
          useValue: {
            createVerificationToken: jest.fn(),
            createPasswordResetToken: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerification: jest.fn(),
            sendPasswordRecovery: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userTokensService = module.get<UserTokensService>(UserTokensService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login', async () => {
      const email = 'foo@foo.com';
      const password = '123456789';
      const findByEmailAndCompareSpy = jest.spyOn(
        usersService,
        'findByEmailAndCompare',
      );
      findByEmailAndCompareSpy.mockResolvedValueOnce(<UserEntity>{
        id: 1,
        email: 'foo',
        password: '',
        verified: false,
        lastConnection: new Date(),
        profile: {
          id: 1,
          username: 'foo',
        },
      });

      await expect(service.login(email, password)).resolves.toBeDefined();
      expect(findByEmailAndCompareSpy).toHaveBeenCalledWith(email, password);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createSpy = jest.spyOn(usersService, 'create');
      const token = '.foo>!';
      const createVerificationTokenSpy = jest.spyOn(
        userTokensService,
        'createVerificationToken',
      );
      const sendVerificationSpy = jest.spyOn(mailService, 'sendVerification');
      const data = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      };
      createSpy.mockResolvedValueOnce(<UserEntity>{
        id: 1,
        email: 'foo',
        password: '',
        verified: false,
        lastConnection: new Date(),
        profile: {
          id: 1,
          username: 'foo',
        },
      });
      createVerificationTokenSpy.mockResolvedValueOnce({ value: token } as any);
      sendVerificationSpy.mockResolvedValueOnce();

      await expect(service.create(data)).resolves.toBeDefined();
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('generateJWTToken', () => {
    it('should return a token', async () => {
      const session = {
        userId: 1,
        profileId: 1,
        username: '',
        verified: false,
      };
      const token = '';
      const signAsyncSpy = jest.spyOn(jwtService, 'signAsync');
      signAsyncSpy.mockResolvedValueOnce(token);

      await expect(service.generateJWTToken(session)).resolves.toEqual(token);
      expect(signAsyncSpy).toHaveBeenCalledWith(session);
    });
  });

  describe('sendUserConfirmationToken', () => {
    it('should send email', async () => {
      const user = {
        id: 1,
        email: 'foo',
        password: '',
        verified: false,
        lastConnection: new Date(),
        profile: {
          id: 1,
          username: 'foo',
        },
      } as any;
      const token = '.foo>!';
      const createVerificationTokenSpy = jest.spyOn(
        userTokensService,
        'createVerificationToken',
      );
      const sendVerificationSpy = jest.spyOn(mailService, 'sendVerification');
      createVerificationTokenSpy.mockResolvedValueOnce({ value: token } as any);
      sendVerificationSpy.mockResolvedValueOnce();

      await expect(
        service.sendUserConfirmationToken(user),
      ).resolves.toBeUndefined();
      expect(createVerificationTokenSpy).toHaveBeenCalledWith(user.id);
      expect(sendVerificationSpy).toHaveBeenCalledWith(user, token);
    });
  });

  describe('sendPasswordResetToken', () => {
    it('should send email', async () => {
      const user = {
        id: 1,
        email: 'foo',
        password: '',
        verified: false,
        lastConnection: new Date(),
        profile: {
          id: 1,
          username: 'foo',
        },
      } as any;
      const token = '.foo>!';
      const createPasswordResetTokenSpy = jest.spyOn(
        userTokensService,
        'createPasswordResetToken',
      );
      const sendVerificationSpy = jest.spyOn(
        mailService,
        'sendPasswordRecovery',
      );
      createPasswordResetTokenSpy.mockResolvedValueOnce({
        value: token,
      } as any);
      sendVerificationSpy.mockResolvedValueOnce();

      await expect(
        service.sendPasswordResetToken(user),
      ).resolves.toBeUndefined();
      expect(createPasswordResetTokenSpy).toHaveBeenCalledWith(user.id);
      expect(sendVerificationSpy).toHaveBeenCalledWith(user, token);
    });
  });
});
