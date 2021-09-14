import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../users/user.entity';

// '.' required ref https://github.com/nest-modules/mailer/issues/569

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerification(user: UserEntity, token: string) {
    await this.mailerService.sendMail({
      template: './verification',
      to: user.email,
      subject: 'Email verification',
      context: {
        user,
        token,
      },
    });
  }

  async sendPasswordRecovery(user: UserEntity, token: string) {
    await this.mailerService.sendMail({
      template: './password-reset',
      to: user.email,
      subject: 'Password recovery',
      context: {
        user,
        token,
      },
    });
  }
}
