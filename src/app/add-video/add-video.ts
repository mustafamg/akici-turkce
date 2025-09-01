import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddVideoForm } from './components/add-video-form/add-video-form';
import { VideoMetadataPreviewComponent } from './components/video-metadata-preview/video-metadata-preview';
import { VideoService } from './services/video.service';
import { VideoMetadata, VideoSaveRequest } from './models/video.interface';

@Component({
  selector: 'app-add-video',
standalone: true,
imports: [CommonModule, AddVideoForm, VideoMetadataPreviewComponent],
  template: `
    <div class="add-video-page">
      
      <!-- Success Message -->
      <div *ngIf="successMessage" class="success-message">
        <div class="success-content">
          <div class="success-icon">✓</div>
          <h3>{{ successMessage }}</h3>
          <p>Redirecting to video library...</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage && !successMessage" class="error-banner">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-text">{{ errorMessage }}</span>
          <button class="try-again-btn" (click)="onTryAgain()">Try Again</button>
        </div>
      </div>

      <!-- Step 1: URL Input -->
      <app-add-video-form
        *ngIf="currentStep === 'input' && !successMessage"
        (metadataFetched)="onMetadataFetched($event)"
        (fetchError)="onFetchError($event)">
      </app-add-video-form>

      <!-- Step 2: Metadata Preview & Edit -->
      <app-video-metadata-preview
        *ngIf="currentStep === 'preview' && fetchedMetadata && !successMessage"
        [metadata]="fetchedMetadata"
        (saveVideo)="onSaveVideo($event)"
        (cancel)="onCancel()">
      </app-video-metadata-preview>

    </div>
  `,
  styles: [`
    .add-video-page {
      min-height: calc(100vh - 200px);
      background: #f9fafb;
      padding: 3rem 2rem;
      font-family: 'Inter', sans-serif;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .success-message {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .success-content {
      background: white;
      padding: 3rem 4rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 12px 30px rgba(196, 30, 58, 0.3);
      max-width: 420px;
      width: 90%;
      color: #111827;
    }

    .success-icon {
      width: 4.5rem;
      height: 4.5rem;
      background: #C41E3A;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 auto 1.25rem;
      box-shadow: 0 4px 12px rgba(196, 30, 58, 0.5);
    }

    .success-content h3 {
      font-size: 1.75rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .success-content p {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .error-banner {
      max-width: 600px;
      margin: 0 auto 2.5rem;
      background: #fee2e2;
      border: 1px solid #fca5a5;
      border-radius: 0.75rem;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
      font-weight: 500;
      color: #b91c1c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .error-text {
      flex: 1;
      font-size: 1rem;
    }

    .try-again-btn {
      background: #C41E3A;
      color: white;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(196, 30, 58, 0.4);
    }

    .try-again-btn:hover {
      background-color: #9e1730;
    }

    app-add-video-form, app-video-metadata-preview {
      width: 100%;
      max-width: 600px;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      padding: 2rem 2.5rem;
      margin: 0 auto;
      display: block;
    }

    /* Buttons inside video-metadata-preview */
    app-video-metadata-preview button {
      border-radius: 0.5rem;
      font-weight: 600;
      padding: 0.6rem 1.5rem;
      box-shadow: 0 4px 12px rgba(196, 30, 58, 0.3);
      transition: background-color 0.3s ease;
    }

    app-video-metadata-preview button.save-btn {
      background-color: #C41E3A;
      color: white;
      border: none;
    }

    app-video-metadata-preview button.save-btn:hover {
      background-color: #9e1730;
    }

    app-video-metadata-preview button.cancel-btn {
      background-color: #6b7280;
      color: white;
      border: none;
      margin-right: 1rem;
    }

    app-video-metadata-preview button.cancel-btn:hover {
      background-color: #4b5563;
    }

    /* Fade in animation */
    .add-video-page > * {
      animation: fadeIn 0.4s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AddVideoComponent {
  currentStep: 'input' | 'preview' = 'input';
  fetchedMetadata: VideoMetadata | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {
    console.log('✅ AddVideoComponent loaded successfully!');
  }

  onMetadataFetched(event: VideoMetadata) {
    console.log('✅ Metadata fetched:', event);
    this.fetchedMetadata = event;
    this.currentStep = 'preview';
    this.errorMessage = null;
  }

  onFetchError(event: string) {
    this.errorMessage = event;
  }

  onSaveVideo(event: VideoSaveRequest) {
    this.videoService.saveVideo(event).subscribe({
      next: () => {
        this.successMessage = 'Video saved successfully!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }

  onCancel() {
    this.fetchedMetadata = null;
    this.currentStep = 'input';
    this.errorMessage = null;
  }

  onTryAgain() {
    this.errorMessage = null;
  }
}
