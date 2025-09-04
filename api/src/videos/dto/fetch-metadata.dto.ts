// src/videos/dto/fetch-metadata.dto.ts
import { IsUrl } from 'class-validator';

export class FetchMetadataDto {
  @IsUrl()
  youtubeUrl: string;
}
