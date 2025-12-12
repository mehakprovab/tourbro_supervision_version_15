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
    selector: 'app-invoice-car',
    templateUrl: './invoice-car.component.html',
    styleUrls: ['./invoice-car.component.scss']
})
export class InvoiceCarComponent implements OnInit {


    private subSunk = new SubSink()
    pageSize = 100;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'CarSupplierName', value: 'Car Supplier Name' },
        { key: 'BookingReference', value: 'Booking Reference' },
        { key: 'AppReference', value: 'App Reference' },
        { key: 'BookedDate', value: 'Booked On' },
        { key: 'TotalFare', value: 'Amount Paid' },
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
        this.subSunk.sink = this.apiHandlerService.apiHandler('carReports', 'post', {}, {}, {
            status: 'ALL'
        }).subscribe(resp => {
            console.log(resp);
            console.log(resp);
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data;
                this.collectionSize = resp.data.length;
            }
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
                case 'CarSupplierName': return this.utility.compare('' + a.CarSupplierName.toLocaleLowerCase(), '' + b.CarSupplierName.toLocaleLowerCase(), isAsc);
                case 'BookingReference': return this.utility.compare('' + a.BookingReference, '' + b.BookingReference, isAsc);
                case 'AppReference': return this.utility.compare('' + a.AppReference, '' + b.AppReference, isAsc);
                case 'BookedDate': return this.utility.compare('' + a.BookedDate.toLocaleLowerCase(), '' + b.BookedDate.toLocaleLowerCase(), isAsc);
                case 'TotalFare': return this.utility.compare(+a.TotalFare, +b.TotalFare, isAsc);
                default: return 0;
            }
        });
    }

}
