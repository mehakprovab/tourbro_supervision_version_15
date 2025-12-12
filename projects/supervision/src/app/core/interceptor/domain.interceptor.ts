import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class DomainInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let REQ_URL = req.url;
        const currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
        const modifiedReq = req.clone({
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + currentUser['access_token']
            }),
        });
        return next.handle(modifiedReq);
    }


    isValidUrl(str: string) {
        try {
            new URL(str);
        } catch (_) {
            return false;
        }

        return true;
    }
}
