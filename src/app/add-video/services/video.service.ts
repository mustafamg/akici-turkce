// src/app/add-video/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

export interface VideoMetadata {
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  videoId?: string;
  url: string;
}

export interface VideoSaveRequest {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Validate YouTube URL format
   */
  isValidYouTubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+(&[\w=]*)?$/;
    return youtubeRegex.test(url);
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Fetch metadata from YouTube URL
   * For now, returns mock data - replace with real API call
   */
  fetchMetadata(url: string): Observable<VideoMetadata> {
    if (!this.isValidYouTubeUrl(url)) {
      return throwError(() => new Error('Invalid YouTube URL format'));
    }

    // Mock data for testing - replace with real API call
    const mockMetadata: VideoMetadata = {
      title: 'Sample YouTube Video Title',
      description: 'This is a sample description for the YouTube video. Replace this with actual API integration.',
      thumbnail: 'https://via.placeholder.com/480x270/ff0000/ffffff?text=YouTube+Thumbnail',
      duration: '5:23',
      publishedAt: '2024-01-15',
      videoId: this.extractVideoId(url) || 'sample-id',
      url: url
    };

    // Simulate API delay
    return of(mockMetadata).pipe(delay(1000));

    // Real implementation (uncomment when backend is ready):
    /*
    return this.http.post<any>(`${this.apiUrl}/videos/fetch-metadata`, { url })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
    */
  }

  /**
   * Save video with final metadata
   */
  saveVideo(videoData: VideoSaveRequest): Observable<any> {
    // Mock response for testing
    return of({ 
      id: 'video-' + Date.now(), 
      ...videoData, 
      createdAt: new Date().toISOString() 
    }).pipe(delay(500));

    // Real implementation (uncomment when backend is ready):
    /*
    return this.http.post<any>(`${this.apiUrl}/videos`, videoData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
    */
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid YouTube URL or request format';
          break;
        case 404:
          errorMessage = 'Video not found or inaccessible';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Server returned code ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}