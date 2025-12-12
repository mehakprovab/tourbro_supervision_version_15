import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  Sno: number;
  appReference: string;
  pnr: string;
  bookingDate: string;
  canRequestedDate: string;
  travelDate: string;
  action: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {Sno: 1, appReference: 'http://www.google.com', pnr: '123-4567890', bookingDate: '2020-04-09', canRequestedDate: '2020-04-09', travelDate: '2020-04-09', action: 'Edit'}
];

@Component({
  selector: 'app-flight-cancellation',
  templateUrl: './flight-cancellation.component.html',
  styleUrls: ['./flight-cancellation.component.scss']
})
export class FlightCancellationComponent implements OnInit {
  displayedColumns: string[] = ['Sno', 'appReference', 'pnr', 'bookingDate', 'canRequestedDate', 'travelDate', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  
  constructor() { }

  ngOnInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

