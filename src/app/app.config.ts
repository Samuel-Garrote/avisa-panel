import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { NexoErrorHandler } from './core/nexo-error-handler';
import { NexoService } from './core/nexo.service';
import { sessionInterceptor } from './core/session.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([sessionInterceptor])),
    { provide: ErrorHandler, useClass: NexoErrorHandler },
    // Connect with the Tiendanube admin before showing anything
    provideAppInitializer(() => inject(NexoService).start(inject(Router))),
  ],
};
