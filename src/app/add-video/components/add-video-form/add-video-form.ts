import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { VideoMetadata } from '../../models/video.interface';



@Component({
  selector: 'app-add-video-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-video-form.html',
  styleUrls: ['./add-video-form.scss']
})
export class AddVideoFormComponent {
  @Output() metadataFetched = new EventEmitter<VideoMetadata>();
  @Output() fetchError = new EventEmitter<string>();

  videoForm: FormGroup;
  isLoading = false;
  hasAttemptedFetch = false;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService
  ) {
    this.videoForm = this.fb.group({
      url: ['', [
        Validators.required,
        this.youtubeUrlValidator.bind(this)
      ]]
    });
  }

  private youtubeUrlValidator(control: any) {
    if (!control.value) return null;
    
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubePattern.test(control.value) 
      ? null 
      : { invalidYouTubeUrl: true };
  }

  get urlControl() {
    return this.videoForm.get('url');
  }

  get showUrlError(): boolean {
    return !!(this.urlControl?.invalid && (this.urlControl?.dirty || this.urlControl?.touched || this.hasAttemptedFetch));
  }

  get urlErrorMessage(): string {
    if (this.urlControl?.errors?.['required']) {
      return 'YouTube URL is required';
    }
    if (this.urlControl?.errors?.['invalidYouTubeUrl']) {
      return 'Please enter a valid YouTube URL';
    }
    return '';
  }

  onFetchMetadata() {
    this.hasAttemptedFetch = true;
    
    if (this.videoForm.invalid) {
      this.videoForm.markAllAsTouched();
      return;
    }

    const url = this.urlControl?.value?.trim();
    if (!url) return;

    this.isLoading = true;
    
    this.videoService.fetchMetadata(url).subscribe(
      (response: VideoMetadata) => {
        this.isLoading = false;
        if (response) {
          this.metadataFetched.emit(response);
        } else {
          this.fetchError.emit('Failed to fetch metadata');
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.fetchError.emit(error.message);
      }
    );
  }

  onUrlChange() {
    // Reset fetch state when URL changes
    this.hasAttemptedFetch = false;
  }
}
