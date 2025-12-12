import { Component, OnInit, ViewChild } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('BankAccountDetailsComponent');

@Component({
    selector: 'app-bank-account-details',
    templateUrl: './bank-account-details.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    dataToUpdate: any;
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }

    getTab(data: { tabId: string, data?: any }) {
        log.debug(data);
        !!data && (this.dataToUpdate = data.data);
        this.tabs.select(data.tabId);
    }

}
