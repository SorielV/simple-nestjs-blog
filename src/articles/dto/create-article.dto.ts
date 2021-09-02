import {
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsOptional()
  @IsBase64()
  image: string | null;
}
