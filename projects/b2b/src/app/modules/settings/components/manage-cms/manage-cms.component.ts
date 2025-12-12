import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-cms',
  templateUrl: './manage-cms.component.html',
  styleUrls: ['./manage-cms.component.scss']
})
export class ManageCmsComponent implements OnInit {

  pageSize = 2;
  page=4;
  collectionSize;
  smsData;
  displayColumn;
  constructor() { }

  ngOnInit() {
    this.smsData = getData();
    this.displayColumn = Object.keys(this.smsData[0]);
    this.collectionSize = this.smsData.length;
  }

}

function getData() {
  return [
    {
      Module: 'account_activate',
      Location: 'activation_in_supervision',
      Action: {
        val: ['Active', 'Deactive'],
        status: true
      }
    },
    {
      Module: 'account_deactivate',
      Location: 'deactivation_in_supervision',
      Action: {
        val: ['InActive', 'Active'],
        status: false
      }
    },
    {
      Module: 'forget_password',
      Location: 'forget_password_in_b2c',
      Action: {
        val: ['Active', 'Deactive'],
        status: true
      }
    }
  ]
}