import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Logger } from '../logger/logger.service';

const log = new Logger('AuthInterceptorService');
declare var provab: any;

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('adminToken');

    let headers = req.headers;

    // IMPORTANT: Do not set Content-Type for FormData
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
}