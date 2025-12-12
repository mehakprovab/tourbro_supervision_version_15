import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {
  radioBtn = [" Oneway and Int Round Trip and Multi City", "Domestic Round Trip"];
  constructor() { }

  ngOnInit() {
  }

}
