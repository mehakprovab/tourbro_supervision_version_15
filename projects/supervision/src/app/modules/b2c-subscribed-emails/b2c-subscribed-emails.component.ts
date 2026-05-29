import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-b2c-subscribed-emails',
  templateUrl: './b2c-subscribed-emails.component.html',
  styleUrls: ['./b2c-subscribed-emails.component.scss']
})
export class B2cSubscribedEmailsComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "newsletter";
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
