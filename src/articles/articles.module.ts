import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ArticleTagProvider } from './article-tag.provider';
import { ArticleProvider } from './article.provider';
import { ArticlesService } from './articles.service';

@Module({
  imports: [DatabaseModule],
  providers: [ArticlesService, ...ArticleProvider, ...ArticleTagProvider],
  exports: [ArticlesService],
})
export class ArticlesModule {}
