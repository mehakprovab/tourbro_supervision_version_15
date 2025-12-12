import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-schedule-changes',
  templateUrl: './flight-schedule-changes.component.html',
  styleUrls: ['./flight-schedule-changes.component.scss']
})
export class FlightScheduleChangesComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number = 40;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_reference', value: 'Airline Reference' },
        { key: 'airline', value: 'Airline' },
        { key: 'status', value: 'Status' },
        { key: 'pnr', value: 'PNR' },
        { key: 'travel_date', value: 'Travel Date' },
        { key: 'total_fare', value: 'Travel Fare' },
        { key: 'customer_payable_amount', value: 'Customer Payable Amount' },
        { key: 'booked_on', value: 'Booked On' },
        { key: 'sector', value: 'Sector' },
        { key: 'payment', value: 'Payment' },
        
    ];
    noData: boolean = true;
    currentBalance: any;
  constructor() { }

  ngOnInit() {
  }
  sortData(data){

  }

}
