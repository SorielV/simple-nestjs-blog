import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  image: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  bio: string;
}
