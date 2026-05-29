import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-supplier-newlisting',
  templateUrl: './manage-supplier-newlisting.component.html',
  styleUrls: ['./manage-supplier-newlisting.component.scss']
})
export class ManageSupplierNewlistingComponent implements OnInit {

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
           this.tabs.select(data.tabId);
       }
   }
 

}
