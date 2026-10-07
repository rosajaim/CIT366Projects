import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (!request.url.startsWith("/api/")) return next.handle(request);
    this.auth.error.next("");
    return next
      .handle(
        request.clone({ setHeaders: { "X-CSRF-Token": this.auth.csrfToken } }),
      )
      .pipe(
        catchError((error) => {
          this.auth.error.next(
            error.status === 401
              ? "Your session expired. Sign in again."
              : error.error?.error ||
                  "Unable to save changes. Please try again.",
          );
          if (error.status === 401) {
            this.auth.authenticated.next(false);
            this.auth.refresh();
          }
          return throwError(() => error);
        }),
      );
  }
}
