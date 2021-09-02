import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
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
});
