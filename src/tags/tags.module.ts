import { Module } from '@nestjs/common';
import { ArticleTagProvider } from 'src/articles/article-tag.provider';
import { DatabaseModule } from 'src/database/database.module';
import { TagProvider } from './tag.provider';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TagsController],
  providers: [TagsService, ...TagProvider, ...ArticleTagProvider],
  exports: [TagsService],
})
export class TagsModule {}
