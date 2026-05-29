import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-b2c-active',
  templateUrl: './manage-b2c-active.component.html',
  styleUrls: ['./manage-b2c-active.component.scss']
})
export class ManageB2cActiveComponent implements OnInit {
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
