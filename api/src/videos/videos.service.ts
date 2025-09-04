// src/videos/videos.service.ts
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, Difficulty } from './entities/video.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private httpService: HttpService,
  ) {}

  private normalizeYoutubeUrl(url: string): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      return null;
    }
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  private async findCategoriesByName(names: string[]) {
    const categories = await this.categoryRepository.find({
      where: names.map((name) => ({ name })),
    });
    if (categories.length !== names.length) {
      const foundNames = categories.map((cat) => cat.name);
      const missingNames = names.filter((name) => !foundNames.includes(name));
      throw new BadRequestException(
        `The following categories do not exist: ${missingNames.join(', ')}`,
      );
    }
    return categories;
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const normalizedUrl = this.normalizeYoutubeUrl(createVideoDto.youtubeUrl);
    if (!normalizedUrl) {
      throw new BadRequestException('Invalid YouTube URL');
    }
    createVideoDto.youtubeUrl = normalizedUrl;

    const ifExists = await this.videoRepository.findOne({
      where: { youtubeUrl: normalizedUrl },
    });
    if (ifExists) {
      throw new BadRequestException('Video already exists');
    }

    const categories = await this.findCategoriesByName(
      createVideoDto.categories,
    );

    const { categories: _, ...videoData } = createVideoDto;
    const video = this.videoRepository.create(videoData);
    video.categories = categories;
    return this.videoRepository.save(video);
  }

  findAll(difficulty?: Difficulty, category?: string): Promise<Video[]> {
    const where: any = {};
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (category) {
      where.categories = { name: category };
    }
    return this.videoRepository.find({
      where,
      relations: ['categories'],
    });
  }

  async fetchYoutubeMetadata(youtubeUrl: string) {
    const videoId = this.extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new BadRequestException('Invalid YouTube URL');
    }
    console.log('Extracted video ID:', videoId);

    // const apiKey = process.env.YOUTUBE_API_KEY;
    const apiKey = 'AIzaSyDIZaVLuvYFBLKDmdEK7D2rt0B0GUmw_BE';
    if (!apiKey) {
      throw new HttpException(
        'YouTube API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    console.log('YouTube API URL:', apiUrl.replace(apiKey, '[API_KEY]')); // Log URL without exposing API key

    try {
      const response = await lastValueFrom(this.httpService.get(apiUrl));
      const items = response.data.items;
      if (!items || items.length === 0) {
        throw new NotFoundException('Video not found on YouTube');
      }
      const snippet = items[0].snippet;
      return {
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails?.high?.url,
        youtubeUrl: youtubeUrl,
      };
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error.message);

      if (error.response) {
        console.log(error.response);
        const status = error.response.status;
        const message =
          error.response.data?.error?.message ||
          error.response.message ||
          'Unknown YouTube API error';

        if (status === 403) {
          throw new HttpException(
            'YouTube API access forbidden. Check your API key and quota.',
            HttpStatus.FORBIDDEN,
          );
        } else if (status === 404) {
          throw new NotFoundException('Video not found on YouTube');
        } else {
          throw new HttpException(`YouTube API Error: ${message}`, status);
        }
      }

      // Handle network errors or other unexpected errors
      throw new HttpException(
        'An error occurred while fetching video metadata. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // private extractVideoId(url: string): string | null {
  //   const regex =
  //     /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  //   const match = url.match(regex);
  //   return match ? match[1] : null;
  // }
  private extractVideoId(url: string): string | null | undefined {
    try {
      const parsed = new URL(url);

      // watch?v=VIDEOID
      if (parsed.hostname.includes('youtube.com')) {
        if (parsed.searchParams.has('v')) {
          return parsed.searchParams.get('v');
        }

        // /embed/VIDEOID or /v/VIDEOID or /shorts/VIDEOID
        const parts = parsed.pathname.split('/');
        if (parts.length > 1) {
          return parts.pop();
        }
      }

      // youtu.be/VIDEOID
      if (parsed.hostname === 'youtu.be') {
        return parsed.pathname.slice(1);
      }
    } catch (e) {
      return null;
    }
    return null;
  }
}
