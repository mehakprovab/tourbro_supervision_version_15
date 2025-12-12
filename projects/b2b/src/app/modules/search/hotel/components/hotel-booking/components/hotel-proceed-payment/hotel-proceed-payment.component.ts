import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../../hotel.service';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-proceed-payment',
  templateUrl: './hotel-proceed-payment.component.html',
  styleUrls: ['./hotel-proceed-payment.component.scss']
})
export class HotelProceedPaymentComponent implements OnInit {
    private subSink = new SubSink();
    queryParams : any= {}
    amount : Number;

  constructor(private hotelService:HotelService,
        private apiHandlerService:ApiHandlerService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.queryParams = params
        this.amount = parseInt(params.amount)
        console.log(typeof this.amount)
    })
  }

  nagadPayment(){
    this.hotelService.loading.next(true);
    let invoiceNumber= this.hotelService.setHotelInvoiceNumber(this.queryParams.appReference);
    let date = (new Date().getTime()).toString();
    this.subSink.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
        app_reference: this.queryParams.appReference,
        order_id:`HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
        payment_type: "nagad",
        merchantInvoiceNumber:invoiceNumber
    }).subscribe(resp => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
            console.log(resp);
            this.hotelService.loading.next(false);
          window.location = resp.data.callBackUrl
        }
    })
}

}
