import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../../../payment.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { Sort } from '@angular/material';


const log = new Logger('payment/SentBalanceRequestComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-sent-balance-request',
    templateUrl: './sent-balance-request.component.html',
    styleUrls: ['./sent-balance-request.component.scss']
})
export class SentBalanceRequestComponent implements OnInit, OnDestroy {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'system_transaction_id', value: 'System Transaction' },
        // Mode Of Payment
        { key: 'amount', value: 'Amount' },
        { key: 'bank', value: 'Bank' },
        { key: 'branch', value: 'Branch' },
        { key: 'status', value: 'Status' },
        { key: 'transaction_type', value: 'Transaction Type' },
        { key: 'requeston', value: 'Request Sent On' },
        { key: 'update_remarks', value: 'Update Remarks' },
        { key: 'updated_datetime', value: 'Updated Date' },
        { key: 'remarks', value: 'Remarks' },
    ];
    noData: boolean = true;
    currentBalance: any;

    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getBalanceManager();
    }

    getBalanceManager() {
        const data = [{ agent_id: this.utility.readStorage('currentSupervisionUser', sessionStorage)['user_id'] }];
        data['topic'] = 'balanceManager';
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug('resp', resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data['balance_request_details'];
                    this.currentBalance = resp.data['agent_details'];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                } else {
                    this.swalService.alert.error(resp.msg);
                }
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                system_transaction_id: objData.system_transaction_id,
                // Mode Of Payment
                amount: objData.amount,
                bank: objData.bank,
                branch: objData.branch,
                status: objData.status,
                transaction_type: objData.transaction_type,
                requeston: objData.requeston,
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
                case 'system_transaction_id': return this.utility.compare(' '+a.system_transaction_id.toLocaleLowerCase(), ' '+b.system_transaction_id.toLocaleLowerCase(), isAsc);
                case 'amount': return this.utility.compare(' '+a.amount.toLocaleLowerCase(), ' '+b.amount.toLocaleLowerCase(), isAsc);
                case 'bank': return this.utility.compare(' '+a.bank.toLocaleLowerCase(), ' '+b.bank.toLocaleLowerCase(), isAsc);
                case 'branch': return this.utility.compare(' '+a.branch.toLocaleLowerCase(), ' '+b.branch.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare(' '+a.status.toLocaleLowerCase(), ' '+b.status, isAsc);
                case 'transaction_type': return this.utility.compare(' '+a.transaction_type.toLocaleLowerCase(), ' '+b.transaction_type, isAsc);
                case 'requeston': return this.utility.compare(' '+a.requeston.toLocaleLowerCase(), ' '+b.requeston, isAsc);
                case 'update_remarks': return this.utility.compare(' '+a.update_remarks.toLocaleLowerCase(), ' '+b.update_remarks, isAsc);
                case 'updated_datetime': return this.utility.compare(' '+a.updated_datetime.toLocaleLowerCase(), ' '+b.updated_datetime, isAsc);
                case 'remarks': return this.utility.compare(' '+a.remarks.toLocaleLowerCase(), ' '+b.remarks, isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }

}


function getData() {
    return [
        {
            'Sno': 1,
            'System Transaction': 'Transaction',
            'Mode Of Payment': 'Online',
            Amount: '0.00',
            Bank: 'HDFC',
            Branch: 'E-Cit',
            Status: 'Active',
            'Bank Deposit Slip': 'Slip',
            'Request Sent On': '12/12/2019',
            'Update Remarks': '07/01/2020'
        }
    ]
}
