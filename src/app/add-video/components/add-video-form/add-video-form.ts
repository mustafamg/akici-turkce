import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { VideoMetadata, VideoSaveRequest } from '../../models/video.interface';

@Component({
  selector: 'app-add-video-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-video-form.html',
  styleUrls: ['./add-video-form.scss']
})
export class AddVideoForm implements OnInit {
  @Output() metadataFetched = new EventEmitter<VideoMetadata>();
  @Output() fetchError = new EventEmitter<string>();
  videoForm!: FormGroup;
  video: VideoMetadata = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    difficulty: undefined as 'beginner' | 'intermediate' | 'advanced' | undefined
  };
  isLoading = false;
  showUrlError = false;
  urlErrorMessage = '';

  constructor(private fb: FormBuilder, private videoService: VideoService) {}

  ngOnInit() {
    this.videoForm = this.fb.group({
      url: ['', [Validators.required, this.youtubeUrlValidator()]],
      difficulty: ['', [Validators.required]]
    });
  }

  youtubeUrlValidator() {
    return (control: any) => {
      if (!control.value) return null;

      const url = control.value.trim();
      // Comprehensive regex to handle various YouTube URL formats including Shorts and query parameters
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}([?&].*)?$/;

      if (!youtubeRegex.test(url)) {
        return { invalidYoutubeUrl: true };
      }

      return null;
    };
  }

  onUrlChange() {
    this.showUrlError = false;
    this.urlErrorMessage = '';
  }

  onFetchMetadata() {
    if (this.videoForm.invalid) {
      this.showUrlError = true;
      const urlControl = this.videoForm.get('url');
      if (urlControl?.hasError('required')) {
        this.urlErrorMessage = 'YouTube URL is required';
      } else if (urlControl?.hasError('invalidYoutubeUrl')) {
        this.urlErrorMessage = 'Please enter a valid YouTube URL';
      } else {
        this.urlErrorMessage = 'Invalid URL format';
      }
      return;
    }

    this.isLoading = true;
    const url = this.videoForm.value.url;

    this.videoService.fetchMetadata(url).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.video = response.data;
          this.video.url = url;
          this.video.difficulty = this.videoForm.value.difficulty;
          this.metadataFetched.emit(this.video);
        } else {
          const errorMessage = response.message || 'Failed to fetch video metadata';
          this.showUrlError = true;
          this.urlErrorMessage = errorMessage;
          this.fetchError.emit(errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const errorMessage = 'Failed to fetch video metadata';
        this.showUrlError = true;
        this.urlErrorMessage = errorMessage;
        this.fetchError.emit(errorMessage);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.videoForm.invalid) {
      this.showUrlError = true;
      const urlControl = this.videoForm.get('url');
      if (urlControl?.hasError('required')) {
        this.urlErrorMessage = 'YouTube URL is required';
      } else if (urlControl?.hasError('invalidYoutubeUrl')) {
        this.urlErrorMessage = 'Please enter a valid YouTube URL';
      } else {
        this.urlErrorMessage = 'Invalid URL format';
      }
      return;
    }

    const videoSaveRequest: VideoSaveRequest = {
      url: this.video.url,
      title: this.video.title,
      description: this.video.description,
      thumbnail: this.video.thumbnail,
      difficulty: this.videoForm.value.difficulty
    };

    this.videoService.saveVideo(videoSaveRequest).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Video saved successfully!');
          this.videoForm.reset();
          this.video = {
            title: '',
            description: '',
            thumbnail: '',
            url: '',
            difficulty: undefined
          };
        } else {
          alert(response.message || 'Failed to save video');
        }
      },
      error: () => {
        alert('Failed to save video');
      }
    });
  }
}
