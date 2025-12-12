import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('hotel-crs/HotelTypeComponent')

@Component({
  selector: 'app-hotel-type',
  templateUrl: './hotel-type.component.html',
  styleUrls: ['./hotel-type.component.scss']
})
export class HotelTypeComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  hotelTypeData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.hotel_type)
      this.hotelTypeData = data.hotel_type;
    this.tabs.select(data.tabId);
  }

}
