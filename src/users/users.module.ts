import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProfileProvider } from 'src/profiles/profile.provider';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UserProvider } from './user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ProfilesService,
    ...UserProvider,
    ...ProfileProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
