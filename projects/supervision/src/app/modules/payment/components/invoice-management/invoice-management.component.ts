import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number = 40;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'name', value: 'Name' },
        { key: 'booking_id', value: 'Booking Id' },
        { key: 'booking_type', value: 'Booking Type' },
        { key: 'booked_on', value: 'Booked On' },
        { key: 'amount_paid', value: 'Amount Paid' },
        { key: 'invoice', value: 'Invoice' },
        { key: 'send_email', value: 'Send Email' },
        
    ];
    noData: boolean = true;
    currentBalance: any;

  constructor() { }

  ngOnInit() {
  }

  sortData(e) {
    console.log(e);
}

  download(item){
    // your delete code
    console.log("Download",item);
  }
  sendEmail(item){
    // your delete code
    console.log("Email",item);
  }

}
