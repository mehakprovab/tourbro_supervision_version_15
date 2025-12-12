import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-commission-table',
    templateUrl: './commission-table.component.html',
    styleUrls: ['./commission-table.component.scss']
})
export class CommissionTableComponent implements OnInit {
    navLinks = [
        {
            label: '% Commission',
            icon: '',
            component: 'Percantage_Commission'
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
