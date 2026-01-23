import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Add token to request
    const token = this.authService.getToken();

    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log('🔄 Got 401, attempting token refresh...');

      return new Observable((observer) => {
        this.authService.tryRefreshToken().then((success) => {
          if (success) {
            this.isRefreshing = false;
            const newToken = this.authService.getToken();
            this.refreshTokenSubject.next(newToken);

            console.log('Token refreshed, retrying request');

            // Retry the original request with new token
            const retryReq = this.addToken(request, newToken!);
            next.handle(retryReq).subscribe(
              (response) => observer.next(response),
              (error) => observer.error(error),
              () => observer.complete(),
            );
          } else {
            this.isRefreshing = false;
            console.error('Refresh failed, logging out');
            observer.error(new Error('Session expired'));
          }
        });
      });
    } else {
      // Wait for refresh to complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        }),
      );
    }
  }
}
