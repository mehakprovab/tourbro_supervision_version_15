import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const log = new Logger('RecentBookingTransactionsComponent');

@Component({
    selector: 'app-recent-booking-transactions',
    templateUrl: './recent-booking-transactions.component.html',
    styleUrls: ['./recent-booking-transactions.component.scss']
})
export class RecentBookingTransactionsComponent implements OnInit, OnDestroy {

    recentBookingTransactions: object[] = [];
    noDataFound: boolean = true;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.apiHandlerService.apiHandler('latestTransactions', 'post', {}, {}, { agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'], user_type: 3 })
            .pipe(
                finalize(() => { }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug(resp);
                if (resp['Status']) {
                    this.noDataFound = false;
                    this.recentBookingTransactions = resp['Data'];
                }
            })
    }

    ngOnDestroy() {
    }

}
