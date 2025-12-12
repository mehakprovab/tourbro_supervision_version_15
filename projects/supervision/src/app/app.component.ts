import {Component, OnDestroy} from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
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
        private authService: AuthService
    ) { }

    ngOnInit(): void {
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
}
