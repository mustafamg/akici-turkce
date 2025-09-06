import { Video } from './video.entity';

export class VideoDto {
  id!: string;
  youtubeId!: string;
  title!: string;
  durationSec!: number;
  thumbnailUrl!: string | null;
  hasTranscript!: boolean;
  status!: 'ok' | 'unavailable' | 'private';

  static fromEntity(v: Video): VideoDto {
    return {
      id: v.id,
      youtubeId: v.youtubeId,
      title: v.title,
      durationSec: v.durationSec,
      thumbnailUrl: v.thumbnailUrl,
      hasTranscript: v.hasTranscript,
      status: v.status,
    };
  }
}
