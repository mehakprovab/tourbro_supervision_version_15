import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {


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
      label: 'Hotel',
      icon: 'fa fa-bed',
      component: 'hotel',
    },
    {
      label: 'Transfers',
      icon: 'fa fa-binoculars',
      component: 'transfers',
    },
  ]

  constructor() { }

  ngOnInit() {
  }
  onSelect() {

  }
}
