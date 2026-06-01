import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelTypeComponent')
@Component({
  selector: 'app-children-pollicy',
  templateUrl: './children-pollicy.component.html',
  styleUrls: ['./children-pollicy.component.scss']
})
export class ChildrenPollicyComponent implements OnInit {

  @Output() callResult = new EventEmitter<boolean>(true);
  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeIdString = 'list_hotel_types';
  @Input() hotelOne :any
  hotelTypeData: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    console.log("hotelOne",this.hotelOne)
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    console.log("data",data)
    if (data.hotel_type)
      this.hotelTypeData = data.hotel_type;
    this.tabs.select(data.tabId);
  }
OnInit() {
  }
  goToHotelList(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
  });
    
}

}
