import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-city-package-master',
  templateUrl: './city-package-master.component.html',
  styleUrls: ['./city-package-master.component.scss']
})
export class CityPackageMasterComponent implements OnInit {
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
