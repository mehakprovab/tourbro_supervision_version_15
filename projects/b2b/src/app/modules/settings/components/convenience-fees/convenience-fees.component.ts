import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convenience-fees',
  templateUrl: './convenience-fees.component.html',
  styleUrls: ['./convenience-fees.component.scss']
})
export class ConvenienceFeesComponent implements OnInit {

  pageSize = 2;
  page=4;
  collectionSize;
  displayColumn;
  convFees: any;
  constructor() { }

  ngOnInit() {
    this.convFees = getData();
    this.collectionSize = this.convFees.length; 
    this.displayColumn = Object.keys(this.convFees[0]);
  }
}

function getData() {
  return [
    {
      'Sl.No': 1,
      Module: '+10 ACTIVITIES',
      Fees_Type:  {
        val: 10.00,
        input: 'text'
      },
      Fees: {
        val: ['perc%','plus+'],
        input: 'radio'
      },
      Added_Per_Pax: {
        val: ['Yes', 'No'],
        input: 'radio'
      },
    },
    {
      'Sl.No': 2,
      Module: '+100 DOMESTIC_FLIGHT',
      Fees_Type:  {
        val: 100.00,
        input: 'text'
      },
      Fees: {
        val: ['perc%','plus+'],
        input: 'radio'
      },
      Added_Per_Pax: {
        val: ['Yes', 'No'],
        input: 'radio'
      },
    },
    {
      'Sl.No': 3,
      Module: '	+10 INTERNATIONAL_FLIGHT',
      Fees_Type:  {
        val: 10.00,
        input: 'text'
      },
      Fees: {
        val: ['perc%','plus+'],
        input: 'radio'
      },
      Added_Per_Pax: {
        val: ['Yes', 'No'],
        input: 'radio'
      },
    },
    {
      'Sl.No': 4,
      Module: '	+10 DOMESTIC_HOTEL',
      Fees_Type:  {
        val: 10.00,
        input: 'text'
      },
      Fees: {
        val: ['perc%','plus+'],
        input: 'radio'
      },
      Added_Per_Pax: {
        val: ['Yes', 'No'],
        input: 'radio'
      },
    }
  ]
}