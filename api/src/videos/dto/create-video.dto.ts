// src/videos/dto/create-video.dto.ts
import {
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Difficulty } from '../entities/video.entity';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  youtubeUrl: string;

  @IsString()
  thumbnailUrl: string;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty: Difficulty;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categories: string[];
}
