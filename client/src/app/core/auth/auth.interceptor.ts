import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const cloned = token ? req.clone({ 
    setHeaders: { Authorization: "Bearer " + token }
  }) : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      //Prevent auth endpoints from triggering a token refresh
      if (req.url.includes('/auth/')) return throwError(() => error);

      if (error.status === 401 && authService.getRefreshToken()) {
        return authService.refresh().pipe(
          switchMap(() => {
            const newReq = req.clone({
              setHeaders: { Authorization: "Bearer " + authService.getAccessToken() }
            });
            return next(newReq);
          }),

          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
