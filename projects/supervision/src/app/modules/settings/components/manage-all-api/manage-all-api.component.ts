import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';

const log = new Logger('manage-api/ManageApiComponent')
@Component({
  selector: 'app-manage-all-api',
  templateUrl: './manage-all-api.component.html',
  styleUrls: ['./manage-all-api.component.scss']
})
export class ManageAllApiComponent implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
      log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    console.log("data",data)
      if (data.hotel)
          this.hotelData = data.hotel;
      this.tabs.select(data.tabId);
  }

}
