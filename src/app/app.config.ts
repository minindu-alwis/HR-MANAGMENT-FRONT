import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // For class-based interceptors
    ),
    provideAnimations(),
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true } // Class-based interceptor registration
  ]
};