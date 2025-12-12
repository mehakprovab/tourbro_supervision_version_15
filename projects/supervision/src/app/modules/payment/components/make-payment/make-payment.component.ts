import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.component.html',
    styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

    navLinks = [
        {
            label: 'DEPOSIT REQUEST',
            icon: '',
            component: 'Deposit_Request'
        },
        {
            label: 'HISTORY DEPOSIT REQUEST',
            icon: '',
            component: 'History_Deposit_Request',
        }
    ]

    hideHeader: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    onSelect(comp) {
        console.trace('onSelect() called')
        if (comp == 'History_Deposit_Request') {
            this.hideHeader = true;
        } else {
            this.hideHeader = false;
        }
    }

}
