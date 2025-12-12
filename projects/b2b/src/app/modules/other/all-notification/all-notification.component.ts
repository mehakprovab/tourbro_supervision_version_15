import { Component, OnDestroy, OnInit } from '@angular/core';
import { OtherServics } from '../other.service';
import { SwalService } from '../../../core/services/swal.service';
import { Logger } from '../../../core/logger/logger.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';

const log = new Logger('other/AllNotificationComponent');

@Component({
    selector: 'app-all-notification',
    templateUrl: './all-notification.component.html',
    styleUrls: ['./all-notification.component.scss']
})
export class AllNotificationComponent implements OnInit, OnDestroy {
    private subSink = new SubSink()
    displayColumn: { key: string, value: string }[] = [
        { key: 'slno', value: '#' },
        { key: 'event_title', value: 'Event Title' },
        { key: 'event_description', value: 'Event Description' },
        // { key: 'action', value: 'Action' },
    ]
    noData: boolean = true;
    respData: any;
    pageSize = 50;
    page = 1;
    collectionSize: number;

    constructor(
        private otherService: OtherServics,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHadlerService: ApiHandlerService
    ) { }

    ngOnInit(): void {
        this.subSink.sink = this.apiHadlerService.apiHandler('notifications', 'POST', {}, {}, { "active": false })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.respData = res.data;
                    this.collectionSize = this.respData.length;
                    this.noData = false;
                } else {
                    this.noData = true;
                    this.swalService.alert.opps(res.msg || '');
                }
            });
    }

    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

}

function getDisplayedColumns() {
    return [
        { key: 'slno', value: '#' },
        { key: 'event_description', value: '#' },
        { key: 'action', value: 'Action' },
    ]
}