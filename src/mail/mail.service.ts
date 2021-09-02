import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerification(user: UserEntity, token: string) {
    console.log({ token });
  }

  async sendPasswordRecovery(user: UserEntity, token: string) {
    console.log({ token });
  }
}
