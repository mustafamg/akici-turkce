import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Video } from '../models/video'

@Injectable({
  providedIn: 'root'
})
export class VideoService {

   private apiUrl = 'http://localhost:3000/videos';

   constructor(private httpClient:HttpClient) {}

 getFeaturedVideos(): Observable<Video[]> {
   const params = new HttpParams()
      .set('isFeatured', 'false') 
      .set('sort', 'views')
      .set('order', 'DESC')
      .set('limit', '4'); 

    return this.httpClient.get<{ items: Video[] }>(this.apiUrl, { params }).pipe(
      map(response => response.items) 
    );

 }
}
