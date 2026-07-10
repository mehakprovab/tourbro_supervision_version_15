import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelTypeComponent')
@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.scss']
})
export class RoomViewComponent implements OnInit {
  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeId = 'list_room_views';

  hotelTypeData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.hotel_type && data.hotel_type.id) {
      this.hotelTypeData = data.hotel_type;
    } else {
      this.hotelTypeData = null;
    }

    const tabId = ['list_room_views', 'add_room_views'].includes(data.tabId) ? data.tabId : 'list_room_views';
    this.tabs.select(tabId);
  }
OnInit() {
  }


}
