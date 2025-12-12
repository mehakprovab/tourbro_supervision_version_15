import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { finalize } from 'rxjs/operators';
import { Sort } from '@angular/material';

const log = new Logger('ManageCmsComponent');
let filterArray: Array<any> = [];
let manageSMSDataCopy: Array<any> = [];

@Component({
    selector: 'app-manage-cms',
    templateUrl: './manage-cms.component.html',
    styleUrls: ['./manage-cms.component.scss']
})
export class ManageCmsComponent implements OnInit, OnChanges, OnDestroy {
    pageSize = 3;
    page = 1;
    collectionSize: number;
    status: boolean;
    manageSMSData: object[] = [];
    displayColumn: { key: string, value: string }[] = [{ key: 'id', value: '#' }, { key: 'molename', value: 'Module' }, { key: 'location', value: 'Location' }, { key: 'status', value: 'Action' }];
    noData: boolean = true;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.getManageData();
    }

    getManageData() {
        this.apiHandlerService.apiHandler('manageSMS', 'post', {}, {}, {})
            .pipe(
                finalize(() => {
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug(resp);
                if (resp.Status) {
                    this.noData = false;
                    this.manageSMSData = resp['Data'];
                    manageSMSDataCopy = [...this.manageSMSData];
                    this.collectionSize = manageSMSDataCopy.length;
                }
            })
    }
  
    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = manageSMSDataCopy.slice().filter((objData, index) => {
            if (Object.values(objData).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.manageSMSData = filterArray;
        else
            this.manageSMSData = !filterArray.length && text.length ? filterArray : [...manageSMSDataCopy];

    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...manageSMSDataCopy];
        if (!sort.active || sort.direction === '') {
            this.manageSMSData = data;
            return;
        }
        this.manageSMSData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return compare(a.id, b.id, isAsc);
                case 'modulename': return compare(a.modulename, b.modulename, isAsc);
                case 'location': return compare(a.location, b.location, isAsc);
                case 'status': return compare(a.status, b.status, isAsc);
                default: return 0;
            }
        });
    }

    onUpdateStatus(data) {

        data['sms_id'] = data.id;
        this.apiHandlerService.apiHandler('updateManageSMS', 'post', {}, {}, data)
            .subscribe(resp => {
                log.debug(resp);
                let text = "";
                if (resp.Status && resp.Data.msg) {
                    text = 'Status updated successfully..!';
                    this.swalService.alert.success(text);
                } else if (resp.Status && resp.Data.error_msg) {
                    text = 'Opps! Sorry something went worg, retry later.';
                    this.swalService.alert.oops(text);
                }
            })
    }

    ngOnChanges() {
    }

    ngOnDestroy() {
    }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


function getData() {
    return [
        {
            Module: 'account_activate',
            Location: 'activation_in_supervision',
            Action: {
                val: ['Active', 'Deactive'],
                status: true
            }
        },
        {
            Module: 'account_deactivate',
            Location: 'deactivation_in_supervision',
            Action: {
                val: ['InActive', 'Active'],
                status: false
            }
        },
        {
            Module: 'forget_password',
            Location: 'forget_password_in_b2c',
            Action: {
                val: ['Active', 'Deactive'],
                status: true
            }
        }
    ]
}