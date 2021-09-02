import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(
  OmitType(CreateArticleDto, [
    'title',
    'description',
    'content',
    'image',
  ] as const),
) {}
