import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

const log = new Logger('no-submenu/ListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    @Output() passedTab = new EventEmitter<any>();
    pageSize = 6;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: object[] = [];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'banklogo', value: 'BankLogo' },
        { key: 'accountname', value: 'AccountName' },
        { key: 'accountnumber', value: 'AccountNumber' },
        { key: 'bankname', value: 'BankName' },
        { key: 'branchname', value: 'BranchName' },
        { key: 'ifsccode', value: 'IFSCode' },
        { key: 'pannumber', value: 'PAN' },
        { key: 'createdon', value: 'CreatedOn' },
        { key: 'status', value: 'Status' },
        { key: 'action', value: 'Action' }];
    noData: boolean = true;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.apiHandlerService.apiHandler('bankAccountDetails', 'post', {}, {}, {})
            .pipe(
                finalize(() => {
                    // this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug('resp', resp);
                if (resp.Status) {
                    this.noData = false;
                    this.respData = resp['Data'];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            if (Object.values(objData).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

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
                case 'id': return this.utility.compare(+a.id, +b.id, isAsc);
                case 'accountname': return this.utility.compare(a.accountname, b.accountname, isAsc);
                case 'accountnumber': return this.utility.compare(+a.accountnumber, +b.accountnumber, isAsc);
                case 'bankname': return this.utility.compare(""+a.bankname, ""+b.bankname, isAsc);
                case 'branchname': return this.utility.compare(""+a.branchname, ""+b.branchname, isAsc);
                case 'createdon': return this.utility.compare(+a.createdon, +b.createdon, isAsc);
                default: return 0;
            }
        });
    }

    onUpdate(doc) {
        this.passedTab.emit({tabId: 'addOrUpdateBankAccountDetails', data: doc});
    }

    ngOnDestroy() {
    }
}
