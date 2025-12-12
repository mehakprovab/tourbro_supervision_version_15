import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number = 40;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'bank_logo', value: 'Bank Logo' },
        { key: 'account_name', value: 'Account Name' },
        { key: 'acconut_number', value: 'Acconut Number' },
        { key: 'bank', value: 'Bank Name' },
        { key: 'branch', value: 'Branch Name' },
        { key: 'swift_code', value: 'Swift Code' },
        { key: 'routing_number', value: 'Routing Number' },
    ];
    noData: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  sortData(e) {

  }

}
