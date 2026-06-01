import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-manage-supplier-inactive',
  templateUrl: './manage-supplier-inactive.component.html',
  styleUrls: ['./manage-supplier-inactive.component.scss']
})
export class ManageSupplierInactiveComponent implements OnInit {

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
          this.tabs.select(data.tabId);
      }
  }

}
