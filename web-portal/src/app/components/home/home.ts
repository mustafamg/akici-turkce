import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  videos: Video[] = [];
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(private videosService: VideoService) {}

  ngOnInit(): void {
    const storedVideos = localStorage.getItem('featuredVideos');

    if (storedVideos) {
    
      this.videos = JSON.parse(storedVideos);
    } else {
      
      this.fetchVideosFromApi();
    }
  }

  fetchVideosFromApi(): void {
    this.videosService.getFeaturedVideos()
      .pipe(
        tap(data => {
          this.hasError = false;
          this.errorMessage = '';
          this.videos = data;
        
          localStorage.setItem('featuredVideos', JSON.stringify(data));
        }),
        catchError(error => {
          this.hasError = true;
          this.errorMessage = 'Failed to load videos data: ' + error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }

  
  refreshVideos(): void {
    this.fetchVideosFromApi();
  }
}