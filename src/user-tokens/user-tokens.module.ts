import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserTokenProvider } from './user-token.provider';
import { UserTokensService } from './user-tokens.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserTokensService, ...UserTokenProvider],
  exports: [UserTokensService],
})
export class UserTokensModule {}
