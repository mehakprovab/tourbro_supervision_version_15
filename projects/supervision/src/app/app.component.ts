import {Component, OnDestroy} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnDestroy {

    subscription: Subscription;
    private subSunk = new SubSink();
    currentUser: any;

    constructor(
        private bnIdle: BnNgIdleService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.setApplicationTitle();
        this.subSunk.sink = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe(() => this.setApplicationTitle());

        /* 30 minutes session idle time */
        this.subSunk.sink = this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
                console.log('session expired');
                this.authService.logout();
                this.bnIdle.stopTimer();
            } else {
                console.log('test');
            }
        });
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    private setApplicationTitle(): void {
        this.title.setTitle(this.isSupplierPanel() ? 'Supplier' : 'Supervision');
    }

    private isSupplierPanel(): boolean {
        const activeRoute = this.getActiveRoute(this.route);
        if (activeRoute.snapshot.data && activeRoute.snapshot.data['user_type'] === 'supplier') {
            return true;
        }

        const url = (this.router.url || '').toLowerCase();
        const browserUrl = `${window.location.pathname}${window.location.hash}`.toLowerCase();
        if (url.indexOf('supplier-login') > -1 || browserUrl.indexOf('/supplier') > -1) {
            return true;
        }

        const currentUser = this.getCurrentUser();
        return currentUser && (currentUser.auth_role_id == 6 || currentUser.auth_role_id == 7);
    }

    private getActiveRoute(route: ActivatedRoute): ActivatedRoute {
        while (route.firstChild) {
            route = route.firstChild;
        }

        return route;
    }

    private getCurrentUser(): any {
        try {
            return JSON.parse(sessionStorage.getItem('currentSupervisionUser') || '{}');
        } catch (e) {
            return {};
        }
    }
}
