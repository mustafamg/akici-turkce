import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Video } from '../models/video'

@Injectable({ providedIn: 'root' })
export class VideoService {

   private apiUrl = 'http://localhost:3000/videos';

   constructor(private httpClient:HttpClient) {}

 getFeaturedVideos(): Observable<Video[]> {
  return this.httpClient.get<Video[]>(this.apiUrl);

 }
}
