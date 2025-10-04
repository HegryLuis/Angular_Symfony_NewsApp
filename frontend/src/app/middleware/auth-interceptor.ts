import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  let headers = req.headers;

  if (req.method === 'POST' || req.method === 'PUT') {
    headers = headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const clonedReq = req.clone({ headers });

  return next(clonedReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();

        console.error('Unauthorized request, logging out.');
      }

      return throwError(() => error);
    })
  );
};
