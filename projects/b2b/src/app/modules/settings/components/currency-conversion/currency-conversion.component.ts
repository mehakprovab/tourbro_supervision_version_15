import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.scss']
})
export class CurrencyConversionComponent implements OnInit {

  pageSize = 2;
  page = 4;
  collectionSize;
  currData;
  displayColumn;
  constructor() { }

  ngOnInit() {
    this.currData = getData();
    this.displayColumn = Object.keys(this.currData[0]);
    this.collectionSize = this.currData.length;
  }

}

function getData() {
  return [
    {
      Sno: 1,
      Currency: 'AUD',
      Status: true,
      Action: 'Update'
    },
    {
      Sno: 2,
      Currency: 'USD',
      Status: true,
      Action: 'Update'
    },
    {
      Sno: 3,
      Currency: 'BBD',
      Status: true,
      Action: 'Update'
    }
  ]
}
