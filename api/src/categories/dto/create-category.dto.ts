// src/categories/dto/create-category.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Unique } from 'typeorm';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;
}
