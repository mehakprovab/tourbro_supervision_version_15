import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-includes-master',
  templateUrl: './includes-master.component.html',
  styleUrls: ['./includes-master.component.scss']
})
export class IncludesMasterComponent implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  activeIdString = "staticpage_list";

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
