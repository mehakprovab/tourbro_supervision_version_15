import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';

const log = new Logger('RecentBookingTransactionsComponent');

@Component({
    selector: 'app-recent-booking-transactions',
    templateUrl: './recent-booking-transactions.component.html',
    styleUrls: ['./recent-booking-transactions.component.scss']
})
export class RecentBookingTransactionsComponent implements OnInit, OnDestroy {

    recentBookingTransactions: object[] = [];
    noDataFound: boolean = true;
    subSunk = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.apiHandlerService.apiHandler('latestTransactions', 'post', {}, {}, {})
            .subscribe( resp => {
                log.debug(resp);
                if(resp.statusCode == 200 || resp.statusCode == 201){
                    this.noDataFound = false;
                    this.recentBookingTransactions = resp['data'];
                }
            })
    }

    ngOnDestroy() {
    }
}
