import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-airline-hotel-partners',
  templateUrl: './airline-hotel-partners.component.html',
  styleUrls: ['./airline-hotel-partners.component.scss']
})
export class AirlineHotelPartnersComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "airline_list";
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e){
      
  }

  triggerTab(data: any) {
    if (data) {
        this.tabs.select(data.tabId);
    }
}

}
