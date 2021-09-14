import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJWTToken: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const data = {};
      const createSpy = jest.spyOn(authService, 'create');
      createSpy.mockResolvedValueOnce(data as any);

      await expect(controller.registration(data as any)).resolves.toEqual(data);
    });
  });

  describe('logIn', () => {
    it('should logIn', async () => {
      const session = {
        userId: 1,
        profileId: 1,
        username: '',
        verified: false,
      };
      const token = 'dsad!~@!@#';
      const generateJWTTokenSpy = jest.spyOn(authService, 'generateJWTToken');
      generateJWTTokenSpy.mockResolvedValueOnce(token);

      await expect(controller.logIn({ user: session } as any)).resolves.toEqual(
        {
          ...session,
          token,
        },
      );
    });
  });

  describe('status', () => {
    it('should return request session', async () => {
      const session = {
        userId: 1,
        profileId: 1,
        username: '',
        verified: false,
      };

      expect(controller.status({ user: session } as any)).toEqual(session);
    });
  });
});
