import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatPaginatorModule, MatIconModule, VideoCardComponent],
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.scss']
})
export class VideoGalleryComponent implements OnInit {
  videos: Video[] = [];
  loading = false;
  error?: string;

  pageIndex = 0; // MatPaginator is 0-based
  pageSize = 12;
  total = 0;

  skeletons = Array.from({ length: this.pageSize });

  constructor(private videosSvc: VideoService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true; this.error = undefined;
    this.videosSvc.getVideos(this.pageIndex + 1, this.pageSize).subscribe({
      next: res => { this.videos = res.items; this.total = res.total; },
      error: () => { this.error = 'Failed to load videos. Please try again.'; this.videos = []; },
      complete: () => { this.loading = false; this.skeletons = Array.from({ length: this.pageSize }); }
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.fetch();
  }

  trackById(_: number, v: Video) { return v.id; }
}
