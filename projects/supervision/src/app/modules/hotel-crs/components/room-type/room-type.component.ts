import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('hotel-crs/RoomTypeComponent')

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;

  roomTypeData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.room_type)
      this.roomTypeData = data.room_type;
    this.tabs.select(data.tabId);
  }

}
