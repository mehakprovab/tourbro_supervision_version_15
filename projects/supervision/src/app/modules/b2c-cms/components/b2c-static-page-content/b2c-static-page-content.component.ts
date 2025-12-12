import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-b2c-static-page-content',
  templateUrl: './b2c-static-page-content.component.html',
  styleUrls: ['./b2c-static-page-content.component.scss']
})
export class B2cStaticPageContentComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
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
