import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to perform this action.';
          } else if (error.status === 401) {
            errorMessage = 'You are not authorized to perform this action.';
          } else if (error.status === 400) {
            if (error.error && typeof error.error === 'object') {
              const validationErrors = [];
              for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                  validationErrors.push(error.error[key]);
                }
              }
              if (validationErrors.length > 0) {
                errorMessage = validationErrors.join('. ');
              } else {
                errorMessage = error.error.message || 'Invalid request data.';
              }
            } else {
              errorMessage = 'Invalid request data.';
            }
          } else if (error.status === 500) {
            errorMessage = 'A server error occurred. Please try again later.';
          }
        }

        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}