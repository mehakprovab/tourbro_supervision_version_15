import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

  navLinks = [
    {
      label: 'Flight',
      icon: 'fa fa-plane',
      component: 'flight'
    },
    {
      label: 'Bus',
      icon: 'fa fa-bus',
      component: 'bus',
    },
    {
      label: 'Transfers',
      icon: 'fa fa-cars',
      component: 'transfers',
    },
    {
      label: 'Activities',
      icon: 'fa fa-binoculars',
      component: 'activities',
    },
  ]

  constructor() { }

  ngOnInit() {
  }
  onSelect() {

  }
}
