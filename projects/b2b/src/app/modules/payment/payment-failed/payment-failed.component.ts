import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.scss']
})
export class PaymentFailedComponent implements OnInit {
  loggedInUser: any;
  app_reference: "";
  order_id: "";
  constructor(private activatedRoute: ActivatedRoute) { 
  }

  ngOnInit() {
     this.activatedRoute.queryParams.subscribe(queryParams => {
        if(queryParams){
        this.app_reference = (queryParams['AppReference']).replace("/", "");
        this.order_id = queryParams['orderId'] ? (queryParams['orderId']).replace("/", "") : "";
        }
    });
    this.loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

}