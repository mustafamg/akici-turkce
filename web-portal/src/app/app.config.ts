import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // 👈 for Angular Material

export const appConfig: ApplicationConfig = {
  providers: [
    // Error + zoneless signals CD (no zone.js needed)
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    // Router + niceties
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),               // optional: speed up lazy routes
      withInMemoryScrolling({                          // optional: better UX
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),

    // HTTP (add interceptors later if needed)
    provideHttpClient(),

    // Angular Material animations/ripples
    provideAnimations(),
  ],
};