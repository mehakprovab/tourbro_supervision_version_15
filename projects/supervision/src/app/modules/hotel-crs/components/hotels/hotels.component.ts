import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';
import { HotelCrsService } from '../../hotel-crs.service';
import { ActivatedRoute, Router } from '@angular/router';

const log = new Logger('hotel-crs/HotelComponent')

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

@ViewChild('tabs', { static: false }) tabs: any;
  activeIdString = "list_hotels";
  add:boolean=true;
  hotelData: any;
  priceDirectData:any;
  selected:any;
  eventData:boolean=false;
  priceEvent:boolean=false;
  priceManagementEvent:boolean=false;
  showTax:boolean=false;
  constructor(
    private hotelCrsService: HotelCrsService,
    private route: ActivatedRoute,
    private router :Router
  ) { }

  ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     if (params['tab']) {
  //         this.activeIdString = params['tab'];
  //     }
  // });
  this.route.queryParams.subscribe(params => {
    console.log("params",params)
    if (params['tab'] == 'list_hotels') {
      this.activeIdString = 'list_hotels'; // Default to Hotel List tab
    } else {
      this.loadStoredState(); 
    }
    this.resetValue()
});
// this.route.queryParams.subscribe(params => {
//   if (params['tab']) {
//       this.activeIdString = params['tab'];
//       this.activeIdString = 'list_hotels'; // Default tab
//       // Remove query parameters from the URL after setting activeIdString
//       //  this.router.navigate([], { queryParams: {}, replaceUrl: true });
//   } else {
//      this.router.navigate([], { queryParams: {}, replaceUrl: true });
//     this.loadStoredState(); 
//       // this.activeIdString = 'list_hotels'; // Default tab
//   }

//   this.resetValue(); // Ensure values reset when tab changes
// });
    // this.resetValue()
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
    console.log("eee",e)
  }
  onTabSelected(event) {
    console.log(event)
    if(event.nextId == 'add_hotel'){
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
    this.activeIdString = event.nextId;
    this.saveState();
    this.resetValue();
}

resetValue(){
    if (this.activeIdString == 'list_hotels') {
        this.hotelCrsService.updateData.next({});
    }
}
triggerTab(data: any) {
  if (!data) return;

  this.eventData = data?.roomImageRedirect ?? false;
  this.priceDirectData = data ?? null;
  this.priceEvent = data?.roomPriceRedirect ?? false;
  this.priceManagementEvent = data?.roomPriceManageRedirect ?? false;

  this.hotelData = data?.hotel ?? null;
  this.selected = data?.hoteltrigger ?? null;

  this.saveState();

  if (data?.tabId && this.tabs) {
    this.tabs.select(data.tabId);
  }
}

      saveState() {
        // Save active tab and selected component in localStorage
        localStorage.setItem('activeTab', this.activeIdString);
        localStorage.setItem('selectedComponent', JSON.stringify({
          selected: this.selected,
          hotelData: this.hotelData,
          priceDirectData: this.priceDirectData,
          eventData: this.eventData,
          priceEvent: this.priceEvent,
          priceManagementEvent: this.priceManagementEvent
        }));
      }
    
      loadStoredState() {
        // Load saved tab state
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
          this.activeIdString = savedTab;
        }
    
        // Load saved selected component state
        const storedComponent = localStorage.getItem('selectedComponent');
        if (storedComponent) {
          const data = JSON.parse(storedComponent);
          console.log("refresh Data",data)
          this.selected = data.selected;
          this.hotelData = data.hotelData;
          this.priceDirectData = data.priceDirectData;
          this.eventData = data.eventData;
          this.priceEvent = data.priceEvent;
          this.priceManagementEvent = data.priceManagementEvent;
        }
      }
  }



