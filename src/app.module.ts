import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { TagsController } from './tags/tags.controller';
import { DatabaseModule } from './database/database.module';
import { TagsModule } from './tags/tags.module';
import { UserTokensModule } from './user-tokens/user-tokens.module';
import config, { RedisConfig } from './config/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
        };
      },
    }),
    DatabaseModule,
    UsersModule,
    ProfilesModule,
    UserTokensModule,
    AuthModule,
    ArticlesModule,
    TagsModule,
    MailModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ProfilesController,
    ArticlesController,
    TagsController,
  ],
  providers: [AppService],
})
export class AppModule {}
