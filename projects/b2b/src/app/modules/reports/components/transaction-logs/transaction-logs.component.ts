import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from "@angular/material/sort";
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ReportService } from '../../reports.service';


const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.component.html',
    styleUrls: ['./transaction-logs.component.scss']
})
export class TransactionLogsComponent implements OnInit, OnDestroy {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'agent', value: 'Agent Name' },
        { key: 'agent_id', value: 'Agent Id' },
        { key: 'transactiondate', value: 'Date' },
        { key: 'transaction', value: 'Transaction' },
        { key: 'fare', value: 'Credit' },
        { key: 'transactiontype', value: 'Payment Type' },
        { key: 'remarks', value: 'Description' }];
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
        private reportService: ReportService
    ) {

    }

    ngOnInit() {
        this.getTransactionLogs();
    }

    getTransactionLogs() {
        this.reportService.fetchTransactionLogs()
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.noData = false;
                    this.respData = resp.data.transations;
                    console.log("resp",resp)
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = true;
                    this.swalService.alert.error(resp.msg || '');
                }
            });
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
                case 'agent': return this.utility.compare('' + a.agent.toLocaleLowerCase(), '' + b.agent.toLocaleLowerCase(), isAsc);
                case 'transactiondate': return this.utility.compare(+a.transactiondate, +b.transactiondate, isAsc);
                case 'app_refernce': return this.utility.compare('' + a.app_refernce.toLocaleLowerCase(), '' + b.app_refernce.toLocaleLowerCase(), isAsc);
                case 'transactiontype': return this.utility.compare('' + a.transactiontype.toLocaleLowerCase(), '' + b.transactiontype.toLocaleLowerCase(), isAsc);
                case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }

}