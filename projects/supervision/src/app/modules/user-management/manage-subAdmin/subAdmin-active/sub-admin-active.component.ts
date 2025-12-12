import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sub-admin-active',
  templateUrl: './sub-admin-active.component.html',
  styleUrls: ['./sub-admin-active.component.scss']
})
export class SubAdminActiveComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "staff_list";
    test:boolean;
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e) {
}

triggerTab(data: any) {
    if (data) {
        
        this.tabs.select(data.tabId);
    }

}

}
