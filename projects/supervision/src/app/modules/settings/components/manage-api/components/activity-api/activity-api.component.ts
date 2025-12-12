import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { Logger } from '../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { SettingService } from '../../../../setting.service';

const log = new Logger('manage-api/FlightApiComponent')
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-activity-api',
    templateUrl: './activity-api.component.html',
    styleUrls: ['./activity-api.component.scss']
})
export class ActivityApiComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "name", value: 'Name' },
        { key: "description", value: 'Description' },
        { key: "booking_engine_status", value: 'Current Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    status;
    private subSunk = new SubSink();

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private settingService: SettingService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.getFlightApiList();
    }

    getFlightApiList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('manageApiList', 'post', {}, {}, {
            module_type: 'Activity'
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = true;
                this.swalService.alert.error(resp.msg || '');
            }
        })
    }

    onStatusUpdate(val): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateApiStatus', 'post', {}, {}, {
            id: val.id,
            booking_engine_status: val.booking_engine_status == true ? false : true
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.getFlightApiList();
            }
            else {
                this.noData = true;
                this.swalService.alert.error(resp.msg || '');
            }
        })

    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name': return this.utility.compare('' + a.name, '' + b.name, isAsc);
                case 'description': return this.utility.compare('' + a.description, '' + b.description, isAsc);
                case 'booking_engine_status': return this.utility.compare('' + a.booking_engine_status, '' + b.booking_engine_status, isAsc);
                default: return 0;
            }
        });
    }

}
