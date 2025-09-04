import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Difficulty } from '../entities/video.entity';

export class GetVideoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(Difficulty, { each: true })
  difficulties: Difficulty[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((v) => Number(v));
    return [Number(value)];
  })
  @IsArray()
  categoryIds: number[];

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsIn(['createdAt', 'views'])
  sort: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured: boolean;
}
