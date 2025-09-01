import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  private difficultyRank = new Map<string, number>([
    ['Beginner', 0],
    ['Intermediate', 1],
    ['Advanced', 2],
  ]);

  getVideos(
    page = 1,
    limit = 12,
    opts?: {
      difficulties?: string[];
      categories?: number[];
      search?: string;
      sortBy?: 'id' | 'difficulty' | 'title';
      order?: 'asc' | 'desc';
    }
  ): Observable<Paginated<Video>> {
    let data = [...this.MOCK];

    const diffs = (opts?.difficulties ?? []).map(d => this.normalizeDiff(d));
    if (diffs.length) {
      data = data.filter(v => diffs.includes(this.normalizeDiff(v.difficulty)));
    }

    const cats = new Set(opts?.categories ?? []);
    if (cats.size) {
      data = data.filter(v => (v.categories || []).some(c => cats.has(c.id)));
    }

    const q = (opts?.search ?? '').trim().toLowerCase();
    if (q) {
      data = data.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        (v.categories || []).some(c => c.name.toLowerCase().includes(q))
      );
    }

    const sortBy = opts?.sortBy ?? 'id';
    const order = opts?.order ?? 'desc';
    data.sort((a, b) => this.compare(a, b, sortBy) * (order === 'asc' ? 1 : -1));

    const total = data.length;
    const start = Math.max(0, (page - 1) * limit);
    const items = data.slice(start, start + limit);

    return of({ items, total, page, limit });
  }

  getVideoById(id: number): Observable<Video> {
    const v = this.MOCK.find(x => x.id === id)!;
    return of(v);
  }

  getFeaturedVideos(limit = 4): Observable<Video[]> {
    return of(this.MOCK.slice(0, limit));
  }

  private normalizeDiff(d: string) {
    const s = (d || '').toLowerCase();
    if (s.startsWith('beg')) return 'Beginner';
    if (s.startsWith('int')) return 'Intermediate';
    if (s.startsWith('adv')) return 'Advanced';
    return d;
    }

  private compare(a: Video, b: Video, sortBy: 'id' | 'difficulty' | 'title'): number {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'difficulty') {
      const ra = this.difficultyRank.get(this.normalizeDiff(a.difficulty)) ?? 0;
      const rb = this.difficultyRank.get(this.normalizeDiff(b.difficulty)) ?? 0;
      return ra - rb;
    }
    return (a.id ?? 0) - (b.id ?? 0);
  }
}
