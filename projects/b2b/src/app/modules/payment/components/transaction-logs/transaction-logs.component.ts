import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from "@angular/material/sort";
import { ApiHandlerService } from '../../../../core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { PaymentService } from '../../payment.service';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from 'ngx-bootstrap/chronos';
import { AppService } from 'projects/supervision/src/app/app.service';
import * as moment from 'moment';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.component.html',
    styleUrls: ['./transaction-logs.component.scss']
})
export class TransactionLogsComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    searchForm: FormGroup;
    searchText: string;
    pageSize = 50;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'transactiontype', value: 'Type' },
        { key: 'systemtarnsactionid', value: 'Transaction ID' },
        { key: 'transactiondate', value: 'Transaction Date' },
        { key: 'app_refernce', value: 'Transaction Reference' },
        { key: 'fare', value: 'Amount' },
        { key: 'remarks', value: 'Remark' }

    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'transactions-log',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    defaultCurrency: string = '';
    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
        private paymentService: PaymentService,
        private apiHandlerService: ApiHandlerService,
        private exportAsService: ExportAsService,
        private fb: FormBuilder,
        private appService: AppService,
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
        let date = new Date();
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 3);
        let tommorow = new Date(date);

        this.searchForm = this.fb.group({
            from_date: new FormControl('', [Validators.maxLength(120)]),
            to_date: new FormControl('', [Validators.maxLength(120)]),
            transaction_id: new FormControl('', [Validators.maxLength(30)]),
            module_type: new FormControl('', [Validators.maxLength(120)]),
            bookedBy: new FormControl('', [Validators.maxLength(120)]),
        });

        this.searchForm.patchValue({
            from_date: fromDate,
            to_date: tommorow,
        }, { emitEvent: false });
        this.getTransactionLogs();
    }

    openDate() {
        this.isOpen = true;
    }

    onSearchSubmit() {
        this.getTransactionLogs();
    }

    onReset() {
        this.searchForm.reset();
        let fromDate=this.utility.setFromDate();
        let toDate=this.utility.setToDate();
        this.searchForm.patchValue({
            module_type: '',
            bookedBy: '',
            from_date: fromDate,
            to_date: toDate,
        });
        this.getTransactionLogs();
    }

    searchByTimeLine(param) {
        let to_date = new Date(), from_date;
        switch (param) {
            case 'today':
                from_date = new Date();
                break;
            case 'lastDay':
                from_date = new Date(to_date.valueOf() - (1 * 24 * 60 * 60 * 1000))
                break;
            case 'oneWeek':
                from_date = new Date(to_date.getTime() - (7 * 24 * 60 * 60 * 1000))
                break;
            case 'oneMonth':
                from_date = new Date(to_date.getTime() - (30 * 24 * 60 * 60 * 1000))
                break;
        }

        this.searchForm.patchValue({
            from_date: formatDate(from_date, 'YYYY-MM-DD'),
            to_date: formatDate(to_date, 'YYYY-MM-DD')
        }, {emitEvent: false});

        this.getTransactionLogs();
    }

    getTransactionLogs() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('transactionLogsAccountSys', 'post', {}, {},
            {
                "from_date": formatDate(this.searchForm.value.from_date, 'YYYY-MM-DD') || '', // ? this.searchForm.value.from_date : today,
                "to_date": formatDate(this.searchForm.value.to_date,'YYYY-MM-DD') || '', // ? this.searchForm.value.to_date : today,
                "transaction_id": this.searchForm.value.transaction_id || '',
                "module_type": this.searchForm.value.module_type || ''
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.transations.length>0) {
                    this.noData = false;
                    this.respData = resp.data.transations || [];
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
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        let resultData = [];
        if ($event.from_date && $event.to_date) {
            resultData = this.respData.filter(function (a) {
                return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.from_date).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.to_date).getTime())
            });
            this.respData = resultData;
            respDataCopy = [...this.respData];
            this.collectionSize = respDataCopy.length;
        } else {
            this.getTransactionLogs();
        }
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const ts = new Date().getTime();
        this.exportAsService.save(this.config, `${ts}`).subscribe((_) => {
            // save started
            console.log(`success`);
            this.swalService.alert.success();
        }, (err) => {
            console.log(err);
            this.swalService.alert.oops();
        });
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }


    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Type": response.transactiontype,
                "Transaction ID":response.systemtarnsactionid,
                "Transaction Date": moment(response.transactiondate).format("MMM DD, YYYY, hh:mm:ss A"),
                "Transaction Reference":response.app_refernce,
                "Amount":response.fare,
                "Remark":response.remarks
            }
        });
 
        const columnWidths = [
            { wch: 5 },
            { wch: 10 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Transaction Log',
            columnWidths
        );
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}


function getAccountsTransactions() {
    return {
        "data": {
            "transations": [
                {
                    "currency": "GBP",
                    "systemtarnsactionid": "20200515-060434-S-1441",
                    "agent": "",
                    "transactiondate": "2020-05-15T06:04:34.000Z",
                    "transactiontype": "transaction",
                    "remarks": "accepted credit limit",
                    "fare": "1000.00",
                    "app_refernce": "MP5465474"
                },
                {
                    "currency": "GBP",
                    "systemtarnsactionid": "20200515-055530-S-295",
                    "agent": "",
                    "transactiondate": "2020-05-15T05:55:30.000Z",
                    "transactiontype": "transaction",
                    "remarks": "Credited Towards: flight_booking<br/>Reference: <br/>testing purpose addingthe balance",
                    "fare": "2500.00",
                    "app_refernce": "MP5465479"
                }
            ]
        },
        "statusCode": 201,
        "Message": "",
        "Status": true
    }
}