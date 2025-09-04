// src/videos/videos.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FetchMetadataDto } from './dto/fetch-metadata.dto';
import { Difficulty } from './entities/video.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('fetch-metadata')
  fetchMetadata(@Body() fetchMetadataDto: FetchMetadataDto) {
    return this.videosService.fetchYoutubeMetadata(fetchMetadataDto.youtubeUrl);
  }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll(
    @Query('difficulty') difficulty?: Difficulty,
    @Query('category') category?: string,
  ) {
    return this.videosService.findAll(difficulty, category);
  }
}
