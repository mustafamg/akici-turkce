import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Component, OnInit, signal } from '@angular/core';
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
  videos = signal<Video[]>([]);
  constructor(private videoService : VideoService){}
  

  ngOnInit(): void {
    this.videoService.getFeaturedVideos().subscribe((videos) => {
      this.videos.set(videos);
      console.log('Featured videos: ', this.videos());
    });
  }
  getCategoryNames(video: Video) {
    return  video.categories?.map(c => c.name).join(', ') || ''
  }

}