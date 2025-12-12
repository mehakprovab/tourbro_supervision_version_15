import { Component, OnInit } from '@angular/core';
import { Sort } from "@angular/material/sort";
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-transaction-logs',
  templateUrl: './transaction-logs.component.html',
  styleUrls: ['./transaction-logs.component.scss']
})
export class TransactionLogsComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'transaction_type', value: 'Type' },
        { key: 'transaction_id', value: 'Transaction ID' },
        { key: 'transaction_date', value: 'Transaction Date' },
        { key: 'transaction_reference', value: 'Transaction Reference' },
        { key: 'company', value: 'Company' },
        { key: 'amount', value: 'Amount' },
        { key: 'remarks', value: 'Remark' },
        { key: '', value: 'Action' }
    ];
    noData: boolean = true;
    respData: any;


    receiveSearchValues($event) {
        console.log("in transaction logs",$event)
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                var resultData = this.respData.filter(function (a) {
                    return new Date(parseInt((a.transactiondate * 1000).toString())) >= $event.fromDate && new Date(parseInt((a.transactiondate * 1000).toString())) <= $event.toDate
                });
            } else if ($event.transactionId) {
                var resultData = this.respData.filter(b => {
                    return b.app_refernce == $event.transactionId;
                })
            }
            if (resultData) {
                this.respData = resultData;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
        } else {
            this.getTransactionLogs();
        }
    }

    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
    ) {

    }

    ngOnInit() {
        this.getTransactionLogs();
    }

    getTransactionLogs() {
        // this.reportService.fetchTransactionLogs()
        //     .subscribe(resp => {
        //         log.debug(resp);
        //         if (resp.statusCode == 200 || resp.statusCode == 201) {
        //             this.noData = false;
        //             this.respData = resp.data.transations;
        //             console.log("resp",resp)
        //             respDataCopy = [...this.respData];
        //             this.collectionSize = respDataCopy.length;
        //         }
        //         else {
        //             this.noData = true;
        //             this.swalService.alert.error(resp.msg || '');
        //         }
        //     });
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
                case 'transaction_type': return this.utility.compare('' + a.transaction_type.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
                case 'transaction_id': return this.utility.compare(+a.transaction_id, +b.transaction_id, isAsc);
                case 'transaction_date': return this.utility.compare(+a.transaction_date, +b.transaction_date, isAsc);
                case 'transaction_reference': return this.utility.compare('' + a.transaction_reference.toLocaleLowerCase(), '' + b.transaction_reference.toLocaleLowerCase(), isAsc);
                case 'amount': return this.utility.compare(+a.amount, +b.amount, isAsc);
                case 'company': return this.utility.compare('' + a.company.toLocaleLowerCase(), '' + b.company.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }

}
