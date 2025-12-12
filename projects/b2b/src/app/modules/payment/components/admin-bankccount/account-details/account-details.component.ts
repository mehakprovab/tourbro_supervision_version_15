import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-account-details',
    templateUrl: './account-details.component.html',
    styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 0;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'bank_logo', value: 'Bank Logo' },
        { key: 'account_name', value: 'Account Name' },
        { key: 'account_number', value: 'Acconut Number' },
        { key: 'bank_name', value: 'Bank Name' },
        { key: 'branch_name', value: 'Branch Name' },
        { key: 'swift_code', value: 'Swift Code' },
        { key: 'iban', value: 'IBAN' },
        { key: 'ssn', value: 'Routing Number' },
    ];
    noData: boolean = true;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.getListBankAccountAccountSys();
    }
    getListBankAccountAccountSys() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('listBankAccountAccountSys', 'post', {}, {}, {})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
              })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.agent,
                transactiondate: objData.transaction,
                app_refernce: objData.app_refernce,
                transactiontype: objData.transactiontype,
                fare: objData.fare,
                remarks: objData.remarks
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
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
                case 'account_name': return this.utility.compare('' + a.account_name, '' + b.account_name, isAsc);
                case 'account_number': return this.utility.compare( + a.account_number,  + b.account_number, isAsc);
                case 'bank_name': return this.utility.compare('' + a.bank_name.toLocaleLowerCase(), '' + b.bank_name.toLocaleLowerCase(), isAsc);
                case 'branch_name': return this.utility.compare(+a.branch_name, +b.branch_name, isAsc);
                case 'swift_code': return this.utility.compare('' + a.swift_code.toLocaleLowerCase(), '' + b.swift_code.toLocaleLowerCase(), isAsc);
                case 'ssn': return this.utility.compare('' + a.ssn.toLocaleLowerCase(), '' + b.ssn.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

}
