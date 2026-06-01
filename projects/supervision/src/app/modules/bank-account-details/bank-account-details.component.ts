import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountDetailsService } from './bank-account-details.servise';

@Component({
    selector: 'app-bank-account-details',
    templateUrl: './bank-account-details.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit {
    activeIdString;
    @ViewChild('tabs', { static: true })
tabs!: NgbNav;
    userData: any;

    constructor(
        private BankAccountDetailsService: BankAccountDetailsService
    ) { }

    ngOnInit() {
    }

    activateTab(tab: string) {
        console.log(tab);
        this.activeIdString=tab;
      }

    beforeChange($event) {
        
    }

    triggerTab(data: any) {
        if (data.data)
            this.userData = data.data;
        this.tabs.select(data.tabId);
    }

}
