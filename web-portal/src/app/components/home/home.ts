import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatIconModule,

    CommonModule,
    RouterModule  
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