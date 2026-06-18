import {Component,OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementService } from '../user-management.service';

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
  private openingEdit = false;
  constructor(private userManagementService: UserManagementService) { }

  ngOnInit() {
  }

  beforeChange(e) {
    const nextId = e && e.nextId ? e.nextId : e;
    if (nextId === 'supplier_list') {
      this.propertyId = null;
      this.userManagementService.supplierUpdateData.next({});
      return;
    }

    if (nextId === 'add_update_b2bUser' && !this.openingEdit) {
      this.propertyId = null;
      this.userManagementService.supplierUpdateData.next({});
    }

    this.openingEdit = false;
  }

  triggerTab(data: any) {
      if (data) {
        this.propertyId = data.propertyId;
        console.log("data",data)
        this.openingEdit = !!data.data;
          this.tabs.select(data.tabId);
      }
  }

}
