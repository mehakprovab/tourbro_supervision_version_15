import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-promocode',
  templateUrl: './list-promocode.component.html',
  styleUrls: ['./list-promocode.component.scss']
})
export class ListPromocodeComponent implements OnInit {
  @Input() label: any;
  promoData;
  displayColumn: string[];
  pageSize = 2;
  page=4;
  collectionSize;

  constructor() { }

ngOnInit() {
    this.promoData = getData();
    this.displayColumn = Object.keys(this.promoData[0])
    this.collectionSize = this.promoData.length;
  }

}



function getData() {
  return [
    {
      Sno: 1,
      'Promo Code': 'ACT10',
      Image: 'https://travelomatix.in/extras/system/template_list/template_v1/images/promocode/TMX1512291534825461f-2.jpg',
      Discount: '10.00 Plus(+ USD)',
      'Valid Upto': '30-Jun-2019(0 Days Left)',
      'Minimum Amount': '10.00',
      Module: 'Activities',
      Status: 'Active',
      'Created On': '25-Jun-2019',
      Action: 'Delete'
    },
    {
      Sno: 2,
      'Promo Code': 'TRN10',
      Image: 'https://travelomatix.in/extras/system/template_list/template_v1/images/promocode/TMX1512291534825461unnamed%20(13).jpg',
      Discount: '10.00 Plus(+ USD)',
      'Valid Upto': '30-Jun-2019(0 Days Left)	',
      'Minimum Amount': '10.00',
      Module: 'Transfer',
      Status: 'Active',
      'Created On': '25-Jun-2019',
      Action: 'Delete'
    },
    {
      Sno: 3,
      'Promo Code': 'FLY10',
      Image: 'https://travelomatix.in/extras/system/template_list/template_v1/images/promocode/TMX1512291534825461128215212.jpg',
      Discount: '10.00 Plus(+ USD)',
      'Valid Upto': '30-Jun-2020(80 Days Left)',
      'Minimum Amount': 100.00,
      Module: 'Flight',
      Status: 'Pending',
      'Created On': '20-Jun-2019',
      Action: 'Update'
    }
  ]
}
