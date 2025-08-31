import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home').then(m => m.Home) // 👈 lazy-load Home
  },
  {
    path: 'videos',
    loadComponent: () =>
      import('./pages/video-gallery/video-gallery.component')
        .then(m => m.VideoGalleryComponent)
  },
  {
    path: 'videos/:id',
    loadComponent: () =>
      import('./pages/video-detail/video-detail.component')
        .then(m => m.VideoDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
