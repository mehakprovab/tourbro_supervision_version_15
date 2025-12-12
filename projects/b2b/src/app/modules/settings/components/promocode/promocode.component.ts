import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {

  navLinks = [
    {
      label: 'Promo Code List',
      icon: 'fa fa-barcode',
      component: 'list'
    },
    {
      label: 'Manage Promo Code',
      icon: 'fa fa-barcode',
      component: 'update',
    },
  ]
  constructor() { }

  ngOnInit() {
  }

  onSelect(tab, index) {
  }

}