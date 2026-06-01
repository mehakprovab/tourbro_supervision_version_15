import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-or-modify-agent-faq',
  templateUrl: './add-or-modify-agent-faq.component.html',
  styleUrls: ['./add-or-modify-agent-faq.component.scss']
})
export class AddOrModifyAgentFaqComponent implements OnInit {

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
