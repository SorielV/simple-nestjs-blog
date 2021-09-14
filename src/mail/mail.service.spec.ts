import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailerService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerification', () => {
    it('should send a verification email', async () => {
      const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
      sendMailSpy.mockResolvedValueOnce({});

      await expect(
        service.sendVerification({} as any, ''),
      ).resolves.toBeUndefined();
      expect(sendMailSpy).toHaveBeenCalled();
    });
  });

  describe('sendPasswordRecovery', () => {
    it('should send a password recovery email', async () => {
      const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
      sendMailSpy.mockResolvedValueOnce({});

      await expect(
        service.sendPasswordRecovery({} as any, ''),
      ).resolves.toBeUndefined();
      expect(sendMailSpy).toHaveBeenCalled();
    });
  });
});
