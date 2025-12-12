import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('users/B2cUsersComponent');

@Component({
  selector: 'app-b2c-users',
  templateUrl: './b2c-users.component.html',
  styleUrls: ['./b2c-users.component.scss']
})
export class B2cUsersComponent implements OnInit {

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
