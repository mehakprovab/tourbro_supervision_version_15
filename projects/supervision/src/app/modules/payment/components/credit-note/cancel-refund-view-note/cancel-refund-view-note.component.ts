import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cancel-refund-view-note',
    templateUrl: './cancel-refund-view-note.component.html',
    styleUrls: ['./cancel-refund-view-note.component.scss']
})
export class CancelRefundViewNoteComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number = 40;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'booking_reference', value: 'Booking Reference' },
        { key: 'module_type', value: 'Module Type' },
        { key: 'agents', value: 'Agents' },
        { key: 'credit_towards', value: 'Credit Towards' },
        { key: 'reference_number', value: 'Reference Number' },
        { key: 'credit_amount', value: 'Credit Amount' },
        { key: 'comments', value: 'Comments' },
    ];
    noData: boolean = true;
    constructor() { }

    ngOnInit() {
    }

    sortData(e) {

    }
}
