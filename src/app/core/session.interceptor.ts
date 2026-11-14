import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { NexoService } from './nexo.service';

// Adds the Nexo session token to every request to our backend.
// Replaces a login: the merchant is already logged in the Tiendanube admin
export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  const nexo = inject(NexoService);
  return from(nexo.getSessionToken()).pipe(
    switchMap((token) =>
      next(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            // Free ngrok answers browsers with a warning page unless this header is sent
            'ngrok-skip-browser-warning': 'true',
          },
        }),
      ),
    ),
  );
};
