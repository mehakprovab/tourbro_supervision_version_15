import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.component.html',
    styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
    activeIdString = 'History_Deposit_Request';
    navLinks = [
        {
            label: 'HISTORY DEPOSIT REQUEST',
            icon: '',
            component: 'History_Deposit_Request',
        },
        {
            label: 'DEPOSIT REQUEST',
            icon: '',
            component: 'Deposit_Request'
        },
    ]

    hideHeader: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    activateChildTab(tab) {
        this.activeIdString = tab;
    }

    onSelect(e) {

    }

}
