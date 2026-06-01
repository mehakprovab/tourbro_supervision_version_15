import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../core/logger/logger.service';

const log = new Logger('users/UsersComponent');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('tabs', { static: true }) tabs: NgbNav;

  userData: any;
  activeId = 'list_users';

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(event: any): void {
    log.debug('tabChanged', event);
  }

  triggerTab(data: any): void {
    if (data?.user) {
      this.userData = data.user;
    }

    // Switch tab programmatically
    this.activeId = data.tabId;
  }
}