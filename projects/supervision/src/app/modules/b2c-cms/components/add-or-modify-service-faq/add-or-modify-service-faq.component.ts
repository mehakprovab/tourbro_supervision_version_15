import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-or-modify-service-faq',
  templateUrl: './add-or-modify-service-faq.component.html',
  styleUrls: ['./add-or-modify-service-faq.component.scss']
})
export class AddOrModifyServiceFaqComponent implements OnInit {

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

