import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideosService } from './videos.service';
import * as videosEntity from './entities/video.entity'
import { GetVideoDto } from './dto/get-video.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // Admin Dashboard -- Add Videos
  @Post()
  create(@Body(ValidationPipe) createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

 @Get()
  async findAll(@Query() getVideosDto: GetVideoDto) {
    return this.videosService.findAll(getVideosDto);
  }

  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}
