import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfileProvider } from './profile.provider';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ...ProfileProvider],
  exports: [ProfilesService],
})
export class ProfilesModule {}
