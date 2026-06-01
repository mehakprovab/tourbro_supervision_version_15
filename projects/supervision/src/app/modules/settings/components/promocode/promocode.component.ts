import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {
  @ViewChild('tabs', { static: true })
  tabs!: NgbNav;

  activeIdString = 'manage_promocode';

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

  beforeChange(e) {
  }

  triggerTab(data: any) {
    if (data && data.tabId) {
      this.tabs.select(data.tabId);
    }
  }

}
