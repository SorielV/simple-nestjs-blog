import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailConfig } from 'src/config/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailConfig = configService.get<MailConfig>('mail');
        const dir = join(__dirname, 'templates');

        return {
          transport: {
            host: mailConfig.host,
            port: mailConfig.port,
            auth: {
              user: mailConfig.user,
              pass: mailConfig.password,
            },
          },
          defaults: {
            from: mailConfig.from,
          },
          template: {
            adapter: new PugAdapter(),
            dir,
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
