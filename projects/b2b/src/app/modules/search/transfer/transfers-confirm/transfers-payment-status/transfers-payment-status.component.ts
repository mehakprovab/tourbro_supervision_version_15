import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ToastsService } from 'projects/b2b/src/app/core/services/toasts.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'app-transfers-payment-status',
  templateUrl: './transfers-payment-status.component.html',
  styleUrls: ['./transfers-payment-status.component.scss']
})
export class TransfersPaymentStatusComponent implements OnInit {

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
  transferConfirmDetail: any;

  constructor(
    private swalService: SwalService,
    private toastsService: ToastsService,
    private transferService: TransferService,
    private util: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.currentUser = this.util.getStorage('currentUser');
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params params", params)
      this.orderId = params.orderID,
        this.status = params.STATUS
    });

    this.transferService.transferConfirmDetail.subscribe(res => {
      this.transferConfirmDetail = res;
    });

    const storedData = localStorage.getItem("TransferConfirmDetail");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed transferConfirmDetail:", parsedData);
        this.transferConfirmDetail = parsedData; 
      } catch (error) {
        console.error("Error parsing transferConfirmDetail:", error);
      }
    } else {
      console.error("transferConfirmDetail not found in localStorage.");
    }


    this.appReference = this.transferConfirmDetail.appRef;
    this.booking_source = this.transferConfirmDetail.booking_source;
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
            this.paymentConfirm();
          } else {
            this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: this.appReference} });
            this.toastsService.toast({ 'type': 'error', 'text': 'Payment Failed' });
          }
        }
      },
      (error) => {
        this.router.navigate(['/search/transfer/transfers-confirm'], { queryParams: { AppReference: this.appReference} });
      }
    );
  }


  paymentConfirm(){
    let appReference = this.transferConfirmDetail.appRef;
    let booking_source = this.transferConfirmDetail.booking_source;
    let request = {
      AppReference: appReference,
      UserType: "B2B",
      UserId: this.currentUser.id ? this.currentUser.id : 0,
      BookingSource: booking_source
    }
    this.apiHandlerService.apiHandler('transferConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: this.appReference} });
      }
      else {
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
      }
    }, (err) => {
      this.transferService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
      this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: this.appReference} });
    });
  }
}