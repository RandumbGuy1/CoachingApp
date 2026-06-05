import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const cloned = req.clone({
    setHeaders: { Authorization: "Bearer " + token }
  });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && auth.getRefreshToken()) {
        return auth.refresh().pipe(
          switchMap(() => {
            const newReq = req.clone({
              setHeaders: { Authorization: "Bearer " + auth.getAccessToken() }
            });

            return next(newReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
