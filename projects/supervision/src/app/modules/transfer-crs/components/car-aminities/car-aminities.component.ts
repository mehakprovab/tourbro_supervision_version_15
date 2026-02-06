import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-car-aminities',
  templateUrl: './car-aminities.component.html',
  styleUrls: ['./car-aminities.component.scss']
})
export class CarAminitiesComponent implements OnInit {

@ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  roomAmenityData: any;

  constructor() { }

  ngOnInit(): void {
  }

  beforeChange(e) {
    // log.debug('tabChanged', e)
  }

  triggerTab(data: any) {
    if (data.room_amenity)
      this.roomAmenityData = data.room_amenity;
    this.tabs.select(data.tabId);
  }

}

