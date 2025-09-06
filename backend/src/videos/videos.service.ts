import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';

@Injectable()
export class VideosService implements OnModuleInit {
  constructor(@InjectRepository(Video) private repo: Repository<Video>) {}

  async onModuleInit() {
    // شغّل الـ seed فقط إذا SEED_ON_START=true
    if (process.env.SEED_ON_START !== 'true') return;

    const count = await this.repo.count();
    if (count > 0) return;

    // عرّف النوع صراحةً لتجنّب الاستدلال على أنه Array
    const created = this.repo.create({
      youtubeId: 'dQw4w9WgXcQ',
      title: 'Sample Video',
      durationSec: 213,
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      status: 'ok',
      hasTranscript: false,
    } as Partial<Video>) as Video;

    // احفظ واسترجع الكائن المحفوظ (اللي فيه الـ id)
    const saved: Video = await this.repo.save(created);
    console.log('Seeded sample video id:', saved.id);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByYoutubeId(youtubeId: string) {
    return this.repo.findOne({ where: { youtubeId } });
  }
}
