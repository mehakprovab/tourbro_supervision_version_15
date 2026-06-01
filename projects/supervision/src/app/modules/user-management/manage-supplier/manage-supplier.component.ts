import {Component,OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-supplier',
  templateUrl: './manage-supplier.component.html',
  styleUrls: ['./manage-supplier.component.scss']
})
export class ManageSupplierComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeIdString = "supplier_list";
  test: boolean;
  propertyId:any;
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e) {
  }

  triggerTab(data: any) {
      if (data) {
        this.propertyId = data.propertyId;
        console.log("data",data)
          this.tabs.select(data.tabId);
      }
  }

}
