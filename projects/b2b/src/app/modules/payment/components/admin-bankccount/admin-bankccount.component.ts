import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-bankccount',
    templateUrl: './admin-bankccount.component.html',
    styleUrls: ['./admin-bankccount.component.scss']
})
export class AdminBankccountComponent implements OnInit {

    navLinks = [
        {
            label: 'BANK ACCOUNT DETAILS',
            icon: '',
            component: 'Bank_Account_Details'
        },
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
