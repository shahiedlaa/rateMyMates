import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage: string = error.error.message || error.error.error.message.split('.')[0]
        console.log(errorMessage);
        this.authService.errorStatusListener.next({
          error: true,
          errorMessage: errorMessage
        })
        return throwError(error);
      })
    )
  }
}
