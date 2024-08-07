import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { Observable, throwError } from "rxjs";

import { retry, catchError } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)

      .pipe(
        retry(1),

        catchError((error: HttpErrorResponse) => {
          let errorMessage = "";

          if (error.message) {
            errorMessage = `Error ${error.status}: ${error.statusText} ${error.url}`;
          }

          if (error.status === 401 || error.status === 403) {
            this.router.navigate(["forbidden", { errorMessage: errorMessage }]);
          }

          if (error.status === 404) {
            try {
              const translateService = this.injector.get(TranslateService);
              this._snackBar.open(
                translateService.instant("ERRORS.NOT-FOUND-ERROR") +
                  "\n " +
                  errorMessage,
                "X",
                {
                  duration: 10000,
                  panelClass: ["yellow-snackbar"],
                }
              );
            } catch {
              // log without translation translation service is not yet available
              this._snackBar.open(
                "Not found the API resource" + "\n " + errorMessage,
                "X",
                {
                  duration: 3000,
                  panelClass: ["yellow-snackbar"],
                }
              );
            }
          } else {
            try {
              const translateService = this.injector.get(TranslateService);
              this._snackBar.open(
                translateService.instant("ERRORS.SERVICE-ERROR") +
                  "\n " +
                  errorMessage,
                "X",
                {
                  duration: 10000,
                  panelClass: ["red-snackbar"],
                }
              );
            } catch {
              // log without translation translation service is not yet available
              this._snackBar.open(
                "Error calling the API, please retry later",
                "X",
                {
                  duration: 3000,
                  panelClass: ["red-snackbar"],
                }
              );
            }
          }

          return throwError(() => errorMessage);
        })
      );
  }
}
