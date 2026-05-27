import { Component, OnInit } from '@angular/core';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { Sort } from '@angular/material/sort';

const log = new Logger('report/AccountLedgerComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-account-ledger',
    templateUrl: './account-ledger.component.html',
    styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent implements OnInit {
    tabsData: any;
    navLinks = [
        {
            icon: 'fa fa-plane',
            label: 'Account Statement',
            class: '',
            report: 'Flight',
        },
    ];
    report: string = '';
    isCollapsed = true;


    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'transaction_date', value: 'Date' },
        { key: 'reference_number', value: 'Reference Number' },
        { key: 'payment_type', value: 'Payment Type' },
        { key: 'opening_balance', value: 'Opening Balance' },
        { key: 'description', value: 'Description' },
        { key: 'debit_amount', value: 'Debit(GBP)' },
        { key: 'credit_amount', value: 'Available Credit' },
        { key: 'closing_balance', value: 'Closing Balance' },
    ];
    noData: boolean = true;
    respData: any;

    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.tabsData = getData();
        this.getAgentAccountLedger();
    }

    receiveSearchValues($event) {
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                var resultData = this.respData.filter(function (a) {
                    return new Date(a.transaction_date) >= $event.fromDate && new Date(a.transaction_date) <= $event.toDate
                });
            } else if ($event.transactionId) {
                var resultData = this.respData.filter(b => {
                    return b.reference_number == $event.transactionId;
                })
            }
            if (resultData) {
                this.respData = resultData;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
        } else {
            this.getAgentAccountLedger();
        }
    }

    getAgentAccountLedger() {
        // this.reportsService.fetchAgentAccountLedger()
        //     .pipe(untilDestroyed(this))
        //     .subscribe(resp => {
        //         log.debug(resp);
        //         if (resp.statusCode == 200) {
        //             this.noData = false;
        //             this.respData = resp.data['transaction_details'];
        //             respDataCopy = [...this.respData];
        //             this.collectionSize = respDataCopy.length;
        //         } else {
        //             log.debug('something went worng', resp);
        //             this.swalService.alert.oops(resp.data['error_msg'])
        //         }
        //     });
    }

    onSelect(tab, i) {
        // console.log("tab",tab, i);
        this.report = tab.report;
    }

    beforeChange(e) {
        // console.log("tabchage", e);
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                transaction_date: objData.transaction_date,
                reference_number: objData.reference_number,
                description: objData.description,
                payment_type:objData.payment_type,
                debit_amount: objData.debit_amount,
                credit_amount: objData.credit_amount,
                opening_balance: objData.opening_balance,
                closing_balance: objData.closing_balance,
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
                case 'transaction_date': return this.utility.compare('' + a.transaction_date.toLocaleLowerCase(), '' + b.transaction_date.toLocaleLowerCase(), isAsc);
                case 'reference_number': return this.utility.compare('' + a.reference_number.toLocaleLowerCase(), '' + b.reference_number.toLocaleLowerCase(), isAsc);
                case 'description': return this.utility.compare('' + a.description.toLocaleLowerCase(), '' + b.description.toLocaleLowerCase(), isAsc);
                case 'payment_type': return this.utility.compare('' + a.payment_type.toLocaleLowerCase(), '' + b.payment_type.toLocaleLowerCase(), isAsc);
                case 'debit_amount': return this.utility.compare(+ a.debit_amount.toLocaleLowerCase(), + b.debit_amount.toLocaleLowerCase(), isAsc);
                case 'credit_amount': return this.utility.compare(+ a.credit_amount.toLocaleLowerCase(), + b.credit_amount.toLocaleLowerCase(), isAsc);
                case 'opening_balance': return this.utility.compare(+ a.opening_balance.toLocaleLowerCase(), + b.opening_balance.toLocaleLowerCase(), isAsc);
                case 'closing_balance': return this.utility.compare(+ a.closing_balance.toLocaleLowerCase(), + b.closing_balance.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }
}

function getData() {
    return [
        {
            SlNo: 1,
            'Date': 'Sun, 26-Apr 01:26 am',
            'Reference Number': 'FB26-012625-935892',
            Description: 'flight Transaction was Successfully done LeadPax:Balu Vijay PNR: S3S8VB',
            Debit: 4059,
            Credit: 8524,
            'Opening Balance': 4568953,
            'Closing Balance': 8572643,
        }
    ]
}