import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../core/logger/logger.service';

const log = new Logger('users/InactiveUserComponent');

@Component({
  selector: 'app-inactive-user',
  templateUrl: './inactive-user.component.html',
  styleUrls: ['./inactive-user.component.scss']
})
export class InactiveUserComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    userData;

    constructor() { }

    ngOnInit() {
    }

    beforeChange(e) {
        log.debug('tabChanged', e)
    }

    triggerTab(data: any) {
        if (data.user)
            this.userData = data.user;
        this.tabs.select(data.tabId);
    }
}
