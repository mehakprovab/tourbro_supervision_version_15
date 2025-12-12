import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

    navLinks = [
        {
            label: 'Credit History',
            icon: 'fa fa-edit',
            component: 'creditHistory',
        }
    ]
    
    constructor() { }

    ngOnInit() {
    }

    onSelect() {
        
    }
}
