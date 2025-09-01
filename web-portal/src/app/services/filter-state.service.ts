import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  difficulties = signal<string[]>([]);
  categories   = signal<number[]>([]);
  search       = signal<string>('');
  pageIndex    = signal(0);
  pageSize     = signal(12);

  resetPage() { this.pageIndex.set(0); }
  setDifficulties(v: string[]) { this.difficulties.set(v); this.resetPage(); }
  setCategories(v: number[])   { this.categories.set(v);   this.resetPage(); }
  setSearch(v: string)         { this.search.set(v.trim()); this.resetPage(); }

  setPage(idx: number, size?: number) {
    this.pageIndex.set(idx);
    if (size != null) this.pageSize.set(size);
  }
}
