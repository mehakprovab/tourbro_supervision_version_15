import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-agent-grouping',
  templateUrl: './manage-agent-grouping.component.html',
  styleUrls: ['./manage-agent-grouping.component.scss']
})
export class ManageAgentGroupingComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  activeIdString = "supplier_list";
  test: boolean;
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e) {
  }

  triggerTab(data: any) {
      if (data) {
        console.log("data",data)
          this.tabs.select(data.tabId);
      }
  }

}
