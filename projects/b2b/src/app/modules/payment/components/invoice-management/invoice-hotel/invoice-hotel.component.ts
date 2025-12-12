import { Component, OnInit } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { Logger } from '../../../../../core/logger/logger.service';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material';
import { AppService } from 'projects/b2b/src/app/app.service';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-invoice-hotel',
    templateUrl: './invoice-hotel.component.html',
    styleUrls: ['./invoice-hotel.component.scss']
})
export class InvoiceHotelComponent implements OnInit {
    searchText: string;
    private subSunk = new SubSink()
    pageSize = 100;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'name', value: 'Name' },
        { key: 'AppReference', value: 'App Reference' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'TotalFare', value: 'Total Fare' },
        { key: 'Status', value: 'Status' },
        { key: 'send_email', value: 'Send Email' }
    ];
    noData: boolean = true;
    currentBalance: any;
    topic: string = '';
    defaultCurrency: string = '';
    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private exportAsService: ExportAsService,
        private appService: AppService
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
     }

    ngOnInit() {
        this.searchByModule()
    }

    searchByModule() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelReports', 'post', {}, {}, {
            status: 'ALL'
        }).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.respData = resp.data;
                this.collectionSize = resp.data.length;
            }
            else{
                this.noData=false;
                this.respData=[];
            }
        }, (err) => {
            this.noData = false;
            this.respData=[];
          })
    };

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
                case 'transactiontype': return this.utility.compare('' + a.transactiontype.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
                case 'systemtarnsactionid': return this.utility.compare('' + a.systemtarnsactionid, '' + b.systemtarnsactionid, isAsc);
                case 'transactiondate': return this.utility.compare('' + a.transactiondate, '' + b.transactiondate, isAsc);
                case 'app_refernce': return this.utility.compare('' + a.app_refernce.toLocaleLowerCase(), '' + b.app_refernce.toLocaleLowerCase(), isAsc);
                case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
                case 'agent': return this.utility.compare('' + a.agent.toLocaleLowerCase(), '' + b.agent.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }
}
