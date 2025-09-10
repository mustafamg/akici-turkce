import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YtSearchService {
  constructor(private http: HttpService) {}

  async searchTurkishEducation(query: string) {
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const params: Record<string, any> = {
      key: process.env.YT_API_KEY,  // تأكد من أنك وضعت مفتاح API في .env
      part: 'snippet',
      type: 'video',
      maxResults: 25,
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      videoCategoryId: '27',   // Education
      relevanceLanguage: 'tr', // لغة تركية
      regionCode: 'TR',        // تركيا
      safeSearch: 'moderate',
      q: query || '',          // إذا تم إدخال كلمة بحث
    };

    const { data } = await firstValueFrom(this.http.get(url, { params }));
    return (data.items || []).map((it: any) => ({
      youtubeId: it.id?.videoId,
      title: it.snippet?.title,
      channelTitle: it.snippet?.channelTitle,
      publishedAt: it.snippet?.publishedAt,
      thumb: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
    })).filter((v: any) => v.youtubeId);
  }
}
