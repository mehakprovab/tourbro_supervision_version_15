import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-manage-inactive-agent-grouping',
  templateUrl: './manage-inactive-agent-grouping.component.html',
  styleUrls: ['./manage-inactive-agent-grouping.component.scss']
})
export class ManageInactiveAgentGroupingComponent implements OnInit {
  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
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
