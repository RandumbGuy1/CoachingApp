import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { WorkOSService } from './workos.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const workosService = inject(WorkOSService);

  return from(workosService.getAccessToken()).pipe(
    switchMap(token => {
      const cloned = token ? req.clone({ setHeaders: {Authorization: `Bearer ${token}` }}) : req;
      return next(cloned);
    })
  )
};
