import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './middleware/auth-guard';
import { NewsList } from './pages/news/news-list/news-list';
import { NewsEdit } from './pages/news/news-edit/news-edit';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'news',
    canActivate: [authGuard],
    children: [
      { path: '', component: NewsList },
      { path: ':id/edit', component: NewsEdit },
    ],
  },
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/news' },
];
