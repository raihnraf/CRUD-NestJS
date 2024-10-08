import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publicationYear: number;
}