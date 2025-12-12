import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-filters',
  templateUrl: './tour-filters.component.html',
  styleUrls: ['./tour-filters.component.scss']
})
export class TourFiltersComponent implements OnInit {
  booking_source: any;

  constructor() { }

  ngOnInit(): void {
    this.booking_source = JSON.parse(sessionStorage.getItem('tourSearchData'))['Destination_source']
  }

}
