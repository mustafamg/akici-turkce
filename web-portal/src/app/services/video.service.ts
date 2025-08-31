import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Paginated, Video } from '../models/video';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private MOCK: Video[] = [
    {
      id: 1,
      youtubeId: 'M7lc1UVf-VE',
      youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
      title: "İstanbul'da Bir Gün - Vlog",
      description: 'Gün boyu İstanbul turu.',
      thumbnailUrl: '/img/placeholder.svg',
      transcriptUrl: null,
      difficulty: 'Intermediate',
      categories: [{ id: 11, name: 'Vlog' }]
    },
    {
      id: 2,
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Baklava Tarifi',
      description: 'Adım adım tatlı.',
      thumbnailUrl: '/img/placeholder.svg',
      transcriptUrl: null,
      difficulty: 'Beginner',
      categories: [{ id: 12, name: 'Cooking' }]
    }, 
    {
    id: 3,
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
    title: 'Türkçe Selamlaşma',
    description: 'Temel selamlaşma ifadeleri.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Beginner',
    categories: [{ id: 13, name: 'Basics' }]
  },
  {
    id: 4,
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Top 10 Istanbul Foods',
    description: 'İstanbul’un en ünlü yemekleri.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Intermediate',
    categories: [{ id: 14, name: 'Culture' }]
  },
  {
    id: 5,
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
    title: 'Türkçe Zamanlar: Giriş',
    description: 'Türkçede zamanlara giriş.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Intermediate',
    categories: [{ id: 15, name: 'Grammar' }]
  },
  {
    id: 6,
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Ankara City Tour',
    description: 'Ankara’da hızlı bir tur.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Beginner',
    categories: [{ id: 16, name: 'Travel' }]
  },
  {
    id: 7,
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
    title: 'Listening Practice: Café Talk',
    description: 'Bir kafede geçen diyalog.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Intermediate',
    categories: [{ id: 17, name: 'Listening' }]
  },
  {
    id: 8,
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Advanced News Breakdown',
    description: 'Haberlere ileri seviye analiz.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Advanced',
    categories: [{ id: 18, name: 'News' }]
  },
  {
    id: 9,
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
    title: 'Pronunciation Tips',
    description: 'Türkçe telaffuz ipuçları.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Beginner',
    categories: [{ id: 19, name: 'Pronunciation' }]
  },
  {
    id: 10,
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Street Interview: Hobbies',
    description: 'Sokakta hobiler üzerine röportajlar.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Intermediate',
    categories: [{ id: 20, name: 'Interview' }]
  },
  {
    id: 11,
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://youtu.be/M7lc1UVf-VE',
    title: 'Documentary: Cappadocia',
    description: 'Kapadokya ve sıcak hava balonları.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Advanced',
    categories: [{ id: 21, name: 'Documentary' }]
  },
  {
    id: 12,
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Shopping Phrases',
    description: 'Alışverişte kullanılan temel cümleler.',
    thumbnailUrl: '/img/placeholder.svg',
    transcriptUrl: null,
    difficulty: 'Beginner',
    categories: [{ id: 22, name: 'Phrases' }]
  }
  ];

  getVideos(page = 1, limit = 12): Observable<Paginated<Video>> {
    const start = (page - 1) * limit;
    const items = this.MOCK.slice(start, start + limit);
    return of({ items, total: this.MOCK.length, page, limit });
  }

  getVideoById(id: number): Observable<Video> {
    const v = this.MOCK.find(x => x.id === id)!;
    return of(v);
  }

  getFeaturedVideos(limit = 4): Observable<Video[]> {
    return of(this.MOCK.slice(0, limit));
  }
}
