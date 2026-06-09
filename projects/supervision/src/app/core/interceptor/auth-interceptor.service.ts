import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Logger } from '../logger/logger.service';
import { SwalService } from '../services/swal.service';

const log = new Logger('AuthInterceptorService');
declare var provab: any;
@Injectable({
    providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService,
        private swalService: SwalService
    ) { }

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  const currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser') || '{}');
  const token = currentUser['access_token'];

  let headers = req.headers;

  // Do not set Content-Type for FormData
  if (!(req.body instanceof FormData) && !headers.has('Content-Type')) {
    headers = headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers = headers.set('Authorization', 'Bearer ' + token);
  }

  const clonedAuthReq = req.clone({ headers });

  const foo = {};
  const started = Date.now();

  return next.handle(clonedAuthReq).pipe(
    tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          foo['api_response_status'] = event.status;
          foo['api_response_url'] = event.url;
          foo['api_response_message'] = event.statusText;
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/']);
          return;
        }

        foo['api_response_status'] = error.status;
        foo['api_response_url'] = error.url || '';
        foo['api_response_message'] = error.statusText;
      }
    ),
    finalize(() => {
      const elapsed = Date.now() - started;
      foo['api_response_time'] = elapsed;
      log.debug(foo);

      try {
        provab.logEvent('api_response', foo);
      } catch (error) {}
    })
  );
}

    private handleAuthError() {
        sessionStorage.clear();
        this.router.navigate(['/']);
    }
}
