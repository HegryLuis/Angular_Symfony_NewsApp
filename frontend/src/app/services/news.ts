import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

interface HydraResponse {
  'hydra:member': News[];
}

export interface News {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class News {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/news';

  getNews(order: 'asc' | 'desc' = 'desc'): Observable<News[]> {
    return this.http
      .get<HydraResponse>(`${this.apiUrl}?order[createdAt]=${order}`)
      .pipe(map((response) => response['hydra:member']));
  }

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  updateNews(news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${news.id}`, news);
  }
}
