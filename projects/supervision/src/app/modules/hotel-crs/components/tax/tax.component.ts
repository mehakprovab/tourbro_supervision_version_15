import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelTypeComponent')
@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @Output() callResult = new EventEmitter<boolean>(true);
  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  @Input() hotelOne :any
  hotelTypeData: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.hotel_type && data.hotel_type.id) {
      // Retain data only for updates
      this.hotelTypeData = data.hotel_type;
    } else {
      // Reset data when switching tabs or creating a new entry
      this.hotelTypeData = null;
    }
  
    // Ensure the tab is selected
    if (this.tabs) {
      this.tabs.select(data.tabId);
    }
  }
  
  
OnInit() {
  }
  goToHotelList(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
  });
}
}
