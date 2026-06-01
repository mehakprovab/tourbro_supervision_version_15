import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-or-modify-customer-faq',
  templateUrl: './add-or-modify-customer-faq.component.html',
  styleUrls: ['./add-or-modify-customer-faq.component.scss']
})
export class AddOrModifyCustomerFaqComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeIdString = "staticpage_list";
constructor() { }

ngOnInit() {
}
beforeChange(e){
    
}

triggerTab(data: any) {
  if (data) {
      this.tabs.select(data.tabId);
  }
}

}
