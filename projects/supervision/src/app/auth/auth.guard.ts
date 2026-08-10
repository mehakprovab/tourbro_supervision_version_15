import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    private isSupplierPanelUser(currentUser: any): boolean {
        return currentUser && (currentUser.auth_role_id === 6 || currentUser.auth_role_id === 7);
    }

    private selectedSupplierKeys(currentUser: any): string[] {
        const suppliers = currentUser && (
            currentUser.selectedSuppliers ||
            currentUser.selected_suppliers ||
            currentUser.supplier ||
            currentUser.suppliers
        );
        if (Array.isArray(suppliers)) {
            return suppliers.map((supplier) => this.normalizeSupplierKey(supplier));
        }
        if (typeof suppliers === 'string') {
            try {
                const parsedSuppliers = JSON.parse(suppliers);
                if (Array.isArray(parsedSuppliers)) {
                    return parsedSuppliers.map((supplier) => this.normalizeSupplierKey(supplier));
                }
            } catch (_) {
                // Older responses store the selected services as comma-separated text.
            }
            return suppliers.split(',').map((supplier) => this.normalizeSupplierKey(supplier));
        }
        return [];
    }

    private normalizeSupplierKey(supplier: any): string {
        const key = String(supplier || '').trim().toLowerCase();
        const aliases = {
            activity: 'experiences',
            cab: 'transfer',
            cabs: 'transfer',
            hotel: 'stays',
            tour: 'yatra-packages',
            'travel-helicopter': 'heli',
            'travel-heli': 'heli'
        };

        return aliases[key] || key;
    }

    private hasSupplier(currentUser: any, supplier: string): boolean {
        return this.selectedSupplierKeys(currentUser).includes(this.normalizeSupplierKey(supplier));
    }

    private isDashboardRoute(url: string): boolean {
        return url === '/' || url.startsWith('/?') || url.startsWith('/dashboard') || url.startsWith('/b2b-dashboard');
    }


    private redirectToSupplierHome(currentUser: any): void {
        if (this.hasSupplier(currentUser, 'stays')) {
            this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
            return;
        }
        if (this.hasSupplier(currentUser, 'wellness-retreat')) {
            this.router.navigate(['/wellnesscrs/wellness-center-list'], { queryParams: { tab: 'list_wellness' } });
            return;
        }
        if (this.hasSupplier(currentUser, 'experiences')) {
            this.router.navigate(['/activity/activity-crs'], { queryParams: { tab: 'list_activitycrs_list' } });
            return;
        }
        if (this.hasSupplier(currentUser, 'transfer')) {
            this.router.navigate(['/transfers/car-management']);
            return;
        }
        if (this.hasSupplier(currentUser, 'yatra-packages')) {
            this.router.navigate(['/tour-crs/tour-list']);
            return;
        }
        if (this.hasSupplier(currentUser, 'heli')) {
            this.router.navigate(['/heli/heli-crs-list']);
            return;
        }
        this.router.navigate(['/auth/login']);
    }

    private isSupplierRouteAllowed(currentUser: any, url: string): boolean {
        const accessMap = [
            { supplier: 'stays', prefixes: ['/hotels', '/report/b2c-hotel', '/report/b2b-hotel'] },
            { supplier: 'wellness-retreat', prefixes: ['/wellnesscrs', '/report/b2c-wellness'] },
            { supplier: 'experiences', prefixes: ['/activity', '/report/b2c-activity', '/report/b2b-activity'] },
            { supplier: 'transfer', prefixes: ['/transfers', '/report/b2c-transfer', '/report/b2b-transfer'] },
            { supplier: 'yatra-packages', prefixes: ['/tour-crs', '/report/b2c-tour', '/report/b2b-tour'] },
            { supplier: 'heli', prefixes: ['/heli', '/report/b2c-heli'] },
        ];

        return accessMap.some((item) =>
            this.hasSupplier(currentUser, item.supplier) &&
            item.prefixes.some((prefix) => url.startsWith(prefix))
        );
    }

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
        if (this.isSupplierPanelUser(currentUser)) {
            if (this.isDashboardRoute(state.url)) {
                return true;
            }
            if (this.isSupplierRouteAllowed(currentUser, state.url)) {
                return true;
            } else {
                this.redirectToSupplierHome(currentUser);
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
