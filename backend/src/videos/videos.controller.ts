import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { VideosService } from './videos.service';
import { VideoDto } from './video.dto';

@Controller('videos')
@UseInterceptors(CacheInterceptor)
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  @Get(':id')
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async getOne(@Param('id') id: string): Promise<VideoDto> {
    const v = await this.videos.findById(id);
    if (!v || v.status !== 'ok') throw new NotFoundException('Video not available');
    return VideoDto.fromEntity(v);
    }

  @Get('by-youtube/:youtubeId')
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async getByYoutube(@Param('youtubeId') youtubeId: string): Promise<VideoDto> {
    const v = await this.videos.findByYoutubeId(youtubeId);
    if (!v || v.status !== 'ok') throw new NotFoundException('Video not available');
    return VideoDto.fromEntity(v);
  }
}
