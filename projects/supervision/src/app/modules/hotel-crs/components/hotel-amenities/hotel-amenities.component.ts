import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('hotel-crs/HotelAmenitiesComponent')

@Component({
  selector: 'app-hotel-amenities',
  templateUrl: './hotel-amenities.component.html',
  styleUrls: ['./hotel-amenities.component.scss']
})
export class HotelAmenitiesComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  hotelAmenityData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.hotel_amenity)
      this.hotelAmenityData = data.hotel_amenity;
    this.tabs.select(data.tabId);
  }

}
