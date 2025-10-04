import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { News } from '../../../services/news';
import { NewsState } from '../../../state/news-state';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-news-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './news-edit.html',
  styleUrl: './news-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private news = inject(News);
  private cdr = inject(ChangeDetectorRef);
  private newsState = inject(NewsState);

  newsForm!: FormGroup;
  private newsId!: number;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.newsId = +params.get('id')!;

          return this.news.getNewsById(this.newsId);
        }),
        tap((news: News) => {
          this.newsForm = this.formBuilder.group({
            title: [news.title, Validators.required],
            content: [news.content, Validators.required],
          });

          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  onSave(): void {
    if (this.newsForm.valid && this.newsForm.dirty) {
      const updatedNews = {
        id: this.newsId,
        ...this.newsForm.value,
      };

      this.news.updateNews(updatedNews).subscribe(() => {
        this.router.navigate(['/news']);
      });
    }
  }
}
