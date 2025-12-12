import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('hotel-crs/RoomAmenitiesComponent')

@Component({
  selector: 'app-room-amenities',
  templateUrl: './room-amenities.component.html',
  styleUrls: ['./room-amenities.component.scss']
})
export class RoomAmenitiesComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  roomAmenityData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.room_amenity)
      this.roomAmenityData = data.room_amenity;
    this.tabs.select(data.tabId);
  }

}
