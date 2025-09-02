import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Video } from '../models/video'
import { videoFilters } from '../models/vidoe-filters';

@Injectable({ providedIn: 'root' })
export class VideoService {

 private apiUrl = "http://localhost:3000/videos";

  constructor(private http: HttpClient) {}

  getFeaturedVideos(): Observable<Video[]> {
    let params = new HttpParams().set('isFeatured', 'true');

    return this.http.get<{ items: Video[] }>(this.apiUrl, { params }).pipe(
      map(response => response.items) 
    );
  }
  getVideos(page: number = 1,
    limit: number = 10,
    filters?: videoFilters): Observable<{ items: Video[];total : number }> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (filters) {
      if (filters.difficulties?.length) {
        filters.difficulties.forEach(d => {
          params = params.append('difficulty', d);
        });
   }
      if (filters.categories?.length) {
        filters.categories.forEach(c => {
          params = params.append('catagory', c.toString());
        });
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
    }
    return this.http.get<{ items: Video[]; total: number }>(this.apiUrl, { params });
    
  }
  getVideoById(id : number) : Observable<Video>{
    return this.http.get<Video>(`${this.apiUrl}/${id}`);
  }
}
