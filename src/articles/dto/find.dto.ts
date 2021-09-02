import { Expose, Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ArticleEntity } from '../article.entity';

const Defaults = {
  PerPage: 15,
  Page: 1,
};

// TODO: Add perPage lt validation
export class FindArticlesDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value ?? Defaults.PerPage)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perPage: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value ?? Defaults.Page)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? ArticleEntity.slugify(value) : value,
  )
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  q?: string;
}
