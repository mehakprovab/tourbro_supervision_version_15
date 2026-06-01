import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelAmenitiesComponent')
@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

    @ViewChild('tabs', { static: true })
tabs!: NgbNav;
    activeId = 'list_hotel_amenity';

    seasonData: any;
  
    constructor() { }
  
    ngOnInit(): void {
    }
  
    beforeChange(e) {
      log.debug('tabChanged', e)
    }
  
    triggerTab(data: any) {
        console.log("data",data)
      if (data.seasonData)
        this.seasonData = data.seasonData;
      this.tabs.select(data.tabId);
    }
   // this.tabs.select(data.tabId);
}
