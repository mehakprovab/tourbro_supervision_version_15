import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-credit-limit-request',
    templateUrl: './credit-limit-request.component.html',
    styleUrls: ['./credit-limit-request.component.scss']
})
export class CreditLimitRequestComponent implements OnInit {

    navLinks = [
        {
            label: 'CREDIT LIMIT REQUEST ',
            icon: '',
            component: 'credit_limit_request',
        },
    ]

    hideHeader: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    onSelect(comp) {
        if (comp == 'credit_limit_request') {
            this.hideHeader = true;
        } else {
            this.hideHeader = false;
        }
    }
}
