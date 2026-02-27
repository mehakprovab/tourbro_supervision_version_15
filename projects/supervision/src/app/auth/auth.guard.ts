import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let currentPath = state.url;
        const currentUser = this.authenticationService.currentUserValue;
        // if (currentUser && currentUser['auth_role_id'] === 6 ) {
        //     if (state.url.startsWith('/hotels/hotel-crs-lists') || state.url.startsWith('/report/b2c-hotel') || state.url.startsWith('/report/b2b-hotel')) {
        //         return true;
        //     } else {
        //         this.router.navigate(['/hotels/hotel-crs-lists'],{ queryParams: { tab: 'list_hotels' } });
        //         return false;
        //     }
        // }
        if (currentUser && currentUser['auth_role_id'] === 7 || currentUser && currentUser['auth_role_id'] === 6 ) {
            if (state.url.startsWith('/hotels/hotel-crs-lists') || state.url.startsWith('/report/b2c-hotel') || state.url.startsWith('/report/b2b-hotel') || state.url.startsWith('/report/b2c-activity')
                || state.url.startsWith('/report/b2c-transfer') || state.url.startsWith('/report/b2c-tour') || state.url.startsWith('/report/b2c-hotel-enquiry')
                || state.url.startsWith('/report/b2c-tour-enquiry') || state.url.startsWith('/report/b2b-activity') || state.url.startsWith('/report/b2b-transfer') || 
                state.url.startsWith('/report/b2b-tour')) {
                return true;
            } else {
                // this.router.navigate(['/hotels/hotel-crs-lists'],{ queryParams: { tab: 'list_hotels' } });
                return false;
            }
        }
        if (currentUser && currentUser['auth_role_id'] == 3) {
            const previliges = JSON.parse(sessionStorage.getItem('userPrevilige'))
            const activeArr = ['active', 'inactive-list', 'in-active', 'new-listing'];
            const authUrls = ['auth/login', 'auth/login/', '/auth/login', 'auth/login/', "", "/"]
            currentPath = currentPath.substring(1);
            console.log(currentPath);
            if (authUrls.includes(currentPath))
                return true;
            let a = currentPath.split("/");
            console.log(a)
            if (activeArr.includes(a[a.length - 1]) || activeArr.includes(a[a.length - 1].split("?")[0])) {
                a.pop();
            }
            // if (a.length > 2) {
                // currentPath = a[0]+"/"+a[1]+"/"
            // } else {
                currentPath = a.join("/");
            // }
            
            console.log(currentPath)
            if (previliges.some(e => currentPath.startsWith(e.url) || (currentPath + "/") == e.url)) {
                return true
            }
            this.router.navigate(['/'], {});
            return false;
        } else {
            return true;
        }
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            return true;
        }
        this.router.navigate(['/auth/login'], {});
        return false;
    }


}