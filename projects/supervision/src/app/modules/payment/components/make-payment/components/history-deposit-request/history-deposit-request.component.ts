import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-history-deposit-request',
    templateUrl: './history-deposit-request.component.html',
    styleUrls: ['./history-deposit-request.component.scss']
})
export class HistoryDepositRequestComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number = 40;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'system_transaction_id', value: 'System Transaction' },
        { key: 'mode_of_payment', value: 'Mode Of Payment' },
        { key: 'request_type', value: 'Request Type' },
        { key: 'amount', value: 'Amount' },
        { key: 'bank', value: 'Bank' },
        { key: 'branch', value: 'Branch' },
        { key: 'transaction_id', value: 'Transaction ID' },
        { key: 'receipt_number', value: 'Receipt Number' },
        { key: 'status', value: 'Status' },
        { key: 'created_datetime', value: 'Request Sent On' },
        { key: 'update_remarks', value: 'Update Remarks' },
    ];
    noData: boolean = true;
    currentBalance: any;

    constructor() { }

    ngOnInit() {
    }

    sortData(e) {
        console.log(e);
    }

}
