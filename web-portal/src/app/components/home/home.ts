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
  lastVisitedId: number = 0;

  constructor(private route: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit() {
    const storedVideos = localStorage.getItem('featuredVideos');

    if (storedVideos) {
    
      this.videos = JSON.parse(storedVideos);
    } else {
      
      this.videoService.getFeaturedVideos()
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
          }),
          switchMap(() => this.route.paramMap),
          tap(params => {
            this.lastVisitedId = +(params.get('id') ?? 0);
          })
        )
        .subscribe();
    }
  }
}