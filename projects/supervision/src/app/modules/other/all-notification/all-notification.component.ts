import { Component, OnInit } from '@angular/core';
import { OtherServics } from '../other.service';
import { SwalService } from '../../../core/services/swal.service';
import { Logger } from '../../../core/logger/logger.service';

const log = new Logger('other/AllNotificationComponent');

@Component({
    selector: 'app-all-notification',
    templateUrl: './all-notification.component.html',
    styleUrls: ['./all-notification.component.scss']
})
export class AllNotificationComponent implements OnInit {
    displayColumn: { key: string, value: string }[] = [
        { key: 'slno', value: '#' },
        { key: 'event_description', value: 'Event Description' },
        { key: 'action', value: 'Action' },
    ]
    noData: boolean = true;
    respData: any;

    constructor(
        private otherService: OtherServics,
        private swalService: SwalService
    ) { }

    ngOnInit(): void {
        const data = [{
            "user_id": 80
        }];
        data['topic'] = 'eventNotfications'
        this.otherService.fetch(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp['data']['notifications'];
                    log.debug(this.respData);
                } else {
                    this.noData = true;
                    this.swalService.alert.opps(resp.msg || '');
                }
            })
    }

}

function getDisplayedColumns() {
    return [
        { key: 'slno', value: '#' },
        { key: 'event_description', value: '#' },
        { key: 'action', value: 'Action' },
    ]
}