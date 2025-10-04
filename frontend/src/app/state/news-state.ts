import { inject, Injectable } from '@angular/core';
import { News } from '../services/news';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsState {
  private news = inject(News);

  private readonly _news$ = new BehaviorSubject<News[]>([]);

  public readonly news$: Observable<News[]> = this._news$.asObservable();

  loadNews(order: 'asc' | 'desc' = 'desc'): void {
    this.news.getNews(order).subscribe((news) => {
      this._news$.next(news);
    });
  }

  updateNews(newsItem: News): Observable<News> {
    return this.news.updateNews(newsItem).pipe(
      tap((updated) => {
        const currNews = this._news$.getValue();
        const index = currNews.findIndex((n) => n.id === updated.id);

        if (index !== -1) {
          currNews[index] = updated;
          this._news$.next([...currNews]);
        }
      })
    );
  }
}
