import { Component, OnInit } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { PaymentService } from '../../payment.service';
import { Sort } from '@angular/material/sort';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-invoice-management',
    templateUrl: './invoice-management.component.html',
    styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit {
    private subSunk = new SubSink()
   
    pageSize = 100;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'name', value: 'Name' },
        { key: 'booking_id', value: 'Booking Id' },
        { key: 'booking_type', value: 'Booking Type' },
        { key: 'booked_on', value: 'Booked On' },
        { key: 'amount_paid', value: 'Amount Paid' },
        { key: 'invoice', value: 'Invoice' },
        { key: 'send_email', value: 'Send Email' }
    ];
    noData: boolean = true;
    currentBalance: any;
    topic: string = '';
    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
        private paymentService: PaymentService,
        private apiHandlerService: ApiHandlerService,
        private exportAsService: ExportAsService,
    ) { }

    ngOnInit() {
        this.searchByModule('flight')
    }

    searchByModule(module: string) {
        this.topic = module;
        let topic: string = this.topic;
        switch (module) {
            case 'car':
                topic = 'carReports';
                this.subSunk.sink = this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {
                    status: 'ALL'
                }).subscribe(resp => {
                });
                break;
            case 'flight':
                topic = 'flightReports';
                this.subSunk.sink = this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {
                    status: 'ALL'
                }).subscribe(resp => {
                });
                break;
            case 'hotel':
                topic = 'hotelReports';
                this.subSunk.sink = this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {
                    status: 'ALL'
                }).subscribe(resp => {
                });
                break;
            case 'insurance':
                topic = 'insuranceReports';
                this.subSunk.sink = this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {
                    status: 'ALL'
                }).subscribe(resp => {
                });
                break;
        };
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

    download(item) {
        // your delete code
    }
    sendEmail(item) {
        // your delete code
    }

}
