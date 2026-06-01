import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-b2c-promo-code',
  templateUrl: './b2c-promo-code.component.html',
  styleUrls: ['./b2c-promo-code.component.scss']
})
export class B2cPromoCodeComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
    activeIdString = "promocode_list";
    test:boolean;
    
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e) {
    }

  triggerTab(data: any) {
        if (data) {   
            this.tabs.select(data.tabId);
        }
    }

}
