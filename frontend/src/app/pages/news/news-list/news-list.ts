import { AsyncPipe, CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NewsState } from '../../../state/news-state';
import { Auth } from '../../../services/auth';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { News } from '../../../services/news';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [AsyncPipe, RouterModule, DatePipe, CommonModule],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsList implements OnInit {
  private newsState = inject(NewsState);
  private news = inject(News);
  private auth = inject(Auth);
  private router = inject(Router);

  private filterSubject = new BehaviorSubject<string>(''); // for filters

  public filteredNews$!: Observable<News[]>;
  public isLoading: boolean = true;

  ngOnInit(): void {
    this.newsState.loadNews();

    this.filteredNews$ = combineLatest([
      this.newsState.news$,
      this.filterSubject.asObservable().pipe(debounceTime(300), distinctUntilChanged()),
    ]).pipe(
      map(([news, filterTerm]) => {
        this.isLoading = false;
        if (!filterTerm) {
          return news;
        }
        return news.filter((item) => item.title.toLowerCase().includes(filterTerm.toLowerCase()));
      })
    );
  }

  onSortChange(event: Event): void {
    const sortOrder = (event.target as HTMLSelectElement).value as 'asc' | 'desc';
    this.isLoading = true;

    this.newsState.loadNews(sortOrder);
  }

  editNews(id: number): void {
    this.router.navigate(['/news', id, 'edit']);
  }

  onFilterChange(filter: string): void {
    this.filterSubject.next(filter);
  }

  logout(): void {
    this.auth.logout();
  }
}
