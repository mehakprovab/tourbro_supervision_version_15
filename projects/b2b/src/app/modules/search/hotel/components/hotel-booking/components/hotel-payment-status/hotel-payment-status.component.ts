import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ToastsService } from 'projects/b2b/src/app/core/services/toasts.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HotelService } from '../../../../hotel.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-hotel-payment-status',
  templateUrl: './hotel-payment-status.component.html',
  styleUrls: ['./hotel-payment-status.component.scss']
})
export class HotelPaymentStatusComponent implements OnInit {


  appReference: any;
  orderId: any;
  booking_source: any;
  loading: boolean = false;
  currentUser: any;
  finalData: any;
  airline_logo: string = '';
  confirmedData: any;
  showConfirmTicket: boolean = true;
  private subSink = new SubSink();
  hotelDetails: any;
  paxDetails: any;
  roomDetails: any;
  bookingDetails: any;
  leadPax: any;
  totalFare: any = 0;
  nights: any;
  bookingSource: any;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  status: any;
  HotelConfirmDetail: any;

  constructor(
    private swalService: SwalService,
    private route: ActivatedRoute,
    private toastsService: ToastsService,
    private hotelService: HotelService,
    private util: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {


    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params params", params)
      this.orderId = params.orderID,
        this.status = params.STATUS
    });

    this.hotelService.HotelConfirmDetail.subscribe(res => {
      this.HotelConfirmDetail = res;
    });

    const storedData = localStorage.getItem("HotelConfirmDetail");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed HotelConfirmDetail:", parsedData);
        this.HotelConfirmDetail = parsedData; 
      } catch (error) {
        console.error("Error parsing HotelConfirmDetail:", error);
      }
    } else {
      console.error("HotelConfirmDetail not found in localStorage.");
    }


    this.appReference = this.HotelConfirmDetail.appReference;
    this.booking_source = this.HotelConfirmDetail.source;
    this.cdr.detectChanges();
    this.paymentCheckout();
  }


  paymentCheckout() {
    this.subSink.sink = this.apiHandlerService.apiHandler('paymentConfirm', 'post', {}, {}, {
      order_id: this.orderId,
      isSuccess: this.status,
      payment_mode: ""
    }).subscribe(
      (resp) => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
          if (resp.data == true) {
            this.toastsService.toast({ 'type': 'success', 'text': 'Payment successful' });
            this.reservation();
          } else {
            this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source, orderId: '' } });
            this.toastsService.toast({ 'type': 'error', 'text': 'Payment Failed' });
          }
        }
      },
      (error) => {
        this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source, orderId: '' } });
      }
    );
  }


  reservation() {
    this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
      AppReference: this.appReference,
      booking_source: this.booking_source,
      // payment_mode:this.paymentMode
    }).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.hotelService.hotelConfirmationData.next(resp.data);
        this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source, orderId: '' } });
        this.hotelService.hotelConfirmationData.next(resp.data);
      } else {
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: this.appReference } });
        }, 100);
      }
    }, err => {
      this.loading = false
      console.error(err);
    })
  }

}
