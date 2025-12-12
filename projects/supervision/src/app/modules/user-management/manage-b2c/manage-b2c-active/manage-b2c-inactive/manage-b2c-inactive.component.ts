import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-b2c-inactive',
  templateUrl: './manage-b2c-inactive.component.html',
  styleUrls: ['./manage-b2c-inactive.component.scss']
})
export class ManageB2cInactiveComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "b2cUsers_list";
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
