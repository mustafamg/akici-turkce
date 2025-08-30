import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoMetadata, VideoSaveRequest } from '../../models/video.interface';

@Component({
  selector: 'app-video-metadata-preview',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-metadata-preview.html',
  styleUrls: ['./video-metadata-preview.scss']
})
export class VideoMetadataPreviewComponent implements OnInit {
  @Input() metadata!: VideoMetadata;
  @Output() saveVideo = new EventEmitter<VideoSaveRequest>();
  @Output() cancel = new EventEmitter<void>();

  metadataForm!: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.metadataForm = this.fb.group({
      title: [
        this.metadata.title || '', 
        [Validators.required, Validators.maxLength(200)]
      ],
      description: [
        this.metadata.description || '', 
        [Validators.maxLength(1000)]
      ],
      thumbnail: [this.metadata.thumbnail || '']
    });
  }

  get titleControl() {
    return this.metadataForm.get('title');
  }

  get descriptionControl() {
    return this.metadataForm.get('description');
  }

  get thumbnailControl() {
    return this.metadataForm.get('thumbnail');
  }

  get showTitleError(): boolean {
    return !!(this.titleControl?.invalid && (this.titleControl?.dirty || this.titleControl?.touched));
  }

  get titleErrorMessage(): string {
    if (this.titleControl?.errors?.['required']) {
      return 'Title is required';
    }
    if (this.titleControl?.errors?.['maxlength']) {
      return 'Title must be less than 200 characters';
    }
    return '';
  }

  get showDescriptionError(): boolean {
    return !!(this.descriptionControl?.errors?.['maxlength'] && 
             (this.descriptionControl?.dirty || this.descriptionControl?.touched));
  }

  get descriptionErrorMessage(): string {
    if (this.descriptionControl?.errors?.['maxlength']) {
      return 'Description must be less than 1000 characters';
    }
    return '';
  }

  onSave() {
    if (this.metadataForm.invalid) {
      this.metadataForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    const saveData: VideoSaveRequest = {
      url: this.metadata.url,
      title: this.titleControl?.value?.trim() || '',
      description: this.descriptionControl?.value?.trim() || '',
      thumbnail: this.thumbnailControl?.value || this.metadata.thumbnail
    };

    this.saveVideo.emit(saveData);
  }

  onCancel() {
    this.cancel.emit();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/video-placeholder.jpg'; // Fallback image
  }

  getCharacterCount(controlName: string): number {
    return this.metadataForm.get(controlName)?.value?.length || 0;
  }
}
