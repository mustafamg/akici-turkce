import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { DifficultyFilterComponent } from '../../components/difficulty-filter/difficulty-filter.component';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { VideoService } from '../../services/video.service';
import { FilterStateService } from '../../services/filter-state.service';
import { Video, Category } from '../../models/video';

@Component({
  standalone: true,
  selector: 'app-video-gallery',
  imports: [
    CommonModule, RouterModule, MatPaginatorModule, MatIconModule,
    VideoCardComponent, DifficultyFilterComponent, CategoryFilterComponent, SearchBarComponent
  ],
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGalleryComponent implements OnInit {
  private svc = inject(VideoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  fs = inject(FilterStateService);

  loading = signal(true);
  error   = signal<string | null>(null);
  videos  = signal<Video[]>([]);
  total   = signal(0);

  categoryOptions = signal<Category[]>([]);

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const difficulties = qp.getAll('difficulty');
    const categories   = qp.getAll('category').map(Number).filter(n => !Number.isNaN(n));
    const search       = qp.get('search') ?? '';
    const page         = Math.max(1, Number(qp.get('page') || 1));
    const size         = Math.max(1, Number(qp.get('limit') || this.fs.pageSize()));

    this.fs.setDifficulties(difficulties);
    this.fs.setCategories(categories);
    this.fs.setSearch(search);
    this.fs.setPage(page - 1, size);

    this.fetch();
  }

  private fetch() {
    this.loading.set(true);
    this.error.set(null);

    const p = this.fs.pageIndex();
    const s = this.fs.pageSize();

    this.svc.getVideos(p + 1, s, {
      difficulties: this.fs.difficulties(),
      categories: this.fs.categories(),
      search: this.fs.search()
    }).subscribe({
      next: res => {
        this.videos.set(res.items);
        this.total.set(res.total);

        if (this.categoryOptions().length === 0) {
          const map = new Map<number, Category>();
          res.items.forEach(v => (v.categories || []).forEach(c => map.set(c.id, c)));
          this.categoryOptions.set([...map.values()]);
        }

        this.syncQueryParams();
      },
      error: err => {
        this.videos.set([]);
        this.total.set(0);
        this.error.set(err?.message || 'Failed to load videos.');
      },
      complete: () => this.loading.set(false)
    });
  }

  private syncQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        difficulty: this.fs.difficulties().length ? this.fs.difficulties() : null,
        category:   this.fs.categories().length   ? this.fs.categories()   : null,
        search:     this.fs.search() || null,
        page:       this.fs.pageIndex() + 1,
        limit:      this.fs.pageSize()
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onDifficultyChange(val: string[]) { this.fs.setDifficulties(val); this.fetch(); }
  onCategoryChange(val: number[])   { this.fs.setCategories(val);   this.fetch(); }
  onSearchChange(val: string)       { this.fs.setSearch(val);       this.fetch(); }

  onPage(e: PageEvent) {
    this.fs.setPage(e.pageIndex, e.pageSize);
    this.fetch();
  }

  trackById = (_: number, v: Video) => v.id;
}
