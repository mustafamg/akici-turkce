import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';

@Component({
  standalone: true,
  selector: 'app-video-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit {
  video = signal<Video | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private svc: VideoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getVideoById(id).subscribe({
      next: (v: Video) => this.video.set(v),
      error: () => this.video.set(null),
      complete: () => this.loading.set(false)
    });
  }

  private toEmbed(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/embed/')) return url;
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    } catch {}
    return null;
  }

  safeEmbedUrl = computed(() => {
    const v = this.video();
    if (!v) return '';
    const raw = v.youtubeId
      ? `https://www.youtube.com/embed/${v.youtubeId}`
      : (v.youtubeUrl ? this.toEmbed(v.youtubeUrl) : null);
    return raw ? this.sanitizer.bypassSecurityTrustResourceUrl(raw) : '';
  });
}
