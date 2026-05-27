import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../../../payment.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { Sort } from '@angular/material/sort';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('payment/SentBalanceRequestComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-sent-credit-limit',
    templateUrl: './sent-credit-limit.component.html',
    styleUrls: ['./sent-credit-limit.component.scss']
})
export class SentCreditLimitComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 10;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'system_transaction_id', value: 'System Transaction' },
        { key: 'amount', value: 'Amount' },
        { key: 'updated_datetime', value: 'Last Updated Date' },
        { key: 'last_deposit_amount', value: 'Last Deposit Amount' },
        { key: 'transaction_status', value: 'Status' },
        { key: 'created_datetime', value: 'Request Sent On' },
        { key: 'update_remarks', value: 'Remarks' },
    ];
    noData: boolean = true;
    currentBalance: any;

    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandelerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.getBalanceRequestListAccountSys();
    }

    getCreditLimitManager() {
        this.subSunk.sink = this.apiHandelerService.apiHandler('creditLimitRequestListAccountSys', 'post', {}, {}, {})
            .subscribe(resp => {
                log.debug('resp', resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                } else {
                    this.noData = false;   
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
              })
    }

    getBalanceRequestListAccountSys() {
        this.subSunk.sink = this.apiHandelerService.apiHandler('creditLimitRequestListAccountSys', 'post', {}, {}, {})
            .subscribe(resp => {
                console.log(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.respData = resp.data || [];
                    this.noData = false;
                    respDataCopy = [...this.respData];
                       
                } else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err: HttpErrorResponse) => {
                this.noData = false;
                this.respData=[];
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                system_transaction_id: objData.system_transaction_id,
                amount: objData.amount,
                transaction_status: objData.status,
                transaction_type: objData.transaction_type,
                created_datetime: objData.created_datetime,
                update_remarks: objData.update_remarks,
                updated_datetime: objData.updated_datetime,
                remarks: objData.remarks,
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
            const isAsc = sort.direction == 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare(' ' + a.system_transaction_id.toLocaleLowerCase(), ' ' + b.system_transaction_id.toLocaleLowerCase(), isAsc);
                case 'amount': return this.utility.compare(+ a.amount, + b.amount, isAsc);
                case 'transaction_status': return this.utility.compare(' ' + a.transaction_status.toLocaleLowerCase(), ' ' + b.transaction_status, isAsc);
                case 'transaction_type': return this.utility.compare(' ' + a.transaction_type.toLocaleLowerCase(), ' ' + b.transaction_type, isAsc);
                case 'created_datetime': return this.utility.compare(' ' + a.created_datetime.toLocaleLowerCase(), ' ' + b.created_datetime, isAsc);
                case 'update_remarks': return this.utility.compare(' ' + a.update_remarks.toLocaleLowerCase(), ' ' + b.update_remarks, isAsc);
                case 'updated_datetime': return this.utility.compare(' ' + a.updated_datetime.toLocaleLowerCase(), ' ' + b.updated_datetime, isAsc);
                // case 'remarks': return this.utility.compare(' ' + a.remarks.toLocaleLowerCase(), ' ' + b.remarks, isAsc);
                default: return 0;

                /*
                        
                */
            }
        });
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}

function getData() {
    return {
        "data": [
            {
                "id": 1,
                "type": "b2b",
                "user_oid": 2,
                "system_transaction_id": "CLIMIT-2160828810274",
                "domain_list_fk": 5,
                "transaction_type": "CreditLimit",
                "amount": 5000,
                "currency": "USD",
                "currency_conversion_rate": 1,
                "date_of_transaction": "2020-12-18T00:00:00.000Z",
                "bank": "N/A",
                "branch": "N/A",
                "deposited_branch": "",
                "transaction_number": "N/A",
                "transaction_status": "pending",
                "remarks": "Adding the credit limit testing purpose",
                "update_remarks": "",
                "created_datetime": "2020-12-18T10:41:42.000Z",
                "created_by_id": 2,
                "updated_datetime": "0000-00-00 00:00:00",
                "updated_by_id": 0,
                "image": "",
                "conversion_value": 0,
                "currency_converter_origin": 0,
                "status": 0,
                "created_at": "2020-12-18T10:41:42.000Z"
            },
            {
                "id": 2,
                "type": "b2b",
                "user_oid": 2,
                "system_transaction_id": "CLIMIT-2160861369088",
                "domain_list_fk": 5,
                "transaction_type": "CreditLimit",
                "amount": 500,
                "currency": "USD",
                "currency_conversion_rate": 1,
                "date_of_transaction": "2020-12-22T00:00:00.000Z",
                "bank": "N/A",
                "branch": "N/A",
                "deposited_branch": "",
                "transaction_number": "N/A",
                "transaction_status": "pending",
                "remarks": "adding the credit limit testing purpose",
                "update_remarks": "",
                "created_datetime": "2020-12-22T05:08:10.000Z",
                "created_by_id": 2,
                "updated_datetime": "0000-00-00 00:00:00",
                "updated_by_id": 0,
                "image": "",
                "conversion_value": 0,
                "currency_converter_origin": 0,
                "status": 0,
                "created_at": "2020-12-22T05:08:10.000Z"
            },
            {
                "id": 6,
                "type": "b2b",
                "user_oid": 2,
                "system_transaction_id": "CLIMIT-2160873772299",
                "domain_list_fk": 5,
                "transaction_type": "CreditLimit",
                "amount": 500,
                "currency": "USD",
                "currency_conversion_rate": 1,
                "date_of_transaction": "2020-12-23T00:00:00.000Z",
                "bank": "N/A",
                "branch": "N/A",
                "deposited_branch": "",
                "transaction_number": "N/A",
                "transaction_status": "pending",
                "remarks": "adding the credit limit testing purpose",
                "update_remarks": "",
                "created_datetime": "2020-12-23T15:35:22.000Z",
                "created_by_id": 2,
                "updated_datetime": "0000-00-00 00:00:00",
                "updated_by_id": 0,
                "image": "",
                "conversion_value": 0,
                "currency_converter_origin": 0,
                "status": 1,
                "created_at": "2020-12-23T15:35:22.000Z"
            },
            {
                "id": 8,
                "type": "b2b",
                "user_oid": 2,
                "system_transaction_id": "CLIMIT-2160874476231",
                "domain_list_fk": 5,
                "transaction_type": "CreditLimit",
                "amount": 5000,
                "currency": "USD",
                "currency_conversion_rate": 1,
                "date_of_transaction": "2020-12-23T00:00:00.000Z",
                "bank": "N/A",
                "branch": "N/A",
                "deposited_branch": "",
                "transaction_number": "N/A",
                "transaction_status": "pending",
                "remarks": "Adding the credit limit testing purpose",
                "update_remarks": "",
                "created_datetime": "2020-12-23T17:32:42.000Z",
                "created_by_id": 2,
                "updated_datetime": "0000-00-00 00:00:00",
                "updated_by_id": 0,
                "image": "",
                "conversion_value": 0,
                "currency_converter_origin": 0,
                "status": 1,
                "created_at": "2020-12-23T17:32:42.000Z"
            },
            {
                "id": 11,
                "type": "b2b",
                "user_oid": 2,
                "system_transaction_id": "CLIMIT-2160874532512",
                "domain_list_fk": 5,
                "transaction_type": "CreditLimit",
                "amount": 5000,
                "currency": "USD",
                "currency_conversion_rate": 1,
                "date_of_transaction": "2020-12-23T00:00:00.000Z",
                "bank": "N/A",
                "branch": "N/A",
                "deposited_branch": "",
                "transaction_number": "N/A",
                "transaction_status": "pending",
                "remarks": "Adding the credit limit testing purpose",
                "update_remarks": "",
                "created_datetime": "2020-12-23T17:42:05.000Z",
                "created_by_id": 2,
                "updated_datetime": "0000-00-00 00:00:00",
                "updated_by_id": 0,
                "image": "",
                "conversion_value": 0,
                "currency_converter_origin": 0,
                "status": 1,
                "created_at": "2020-12-23T17:42:05.000Z"
            }
        ],
        "statusCode": 201,
        "Message": "",
        "Status": true
    }
}
