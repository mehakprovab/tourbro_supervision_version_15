import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelTypeComponent')
@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;

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
    console.log("hotelTypeData",this.hotelTypeData)
    
    this.tabs.select(data.tabId);
  }

}
