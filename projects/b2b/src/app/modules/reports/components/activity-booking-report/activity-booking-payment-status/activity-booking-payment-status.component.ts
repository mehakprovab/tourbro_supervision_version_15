import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ToastsService } from 'projects/b2b/src/app/core/services/toasts.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-activity-booking-payment-status',
  templateUrl: './activity-booking-payment-status.component.html',
  styleUrls: ['./activity-booking-payment-status.component.scss']
})
export class ActivityBookingPaymentStatusComponent implements OnInit {

  
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
  bookingDetails: any;
  leadPax: any;
  totalFare: any = 0;
  nights: any;
  bookingSource: any;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  status: any;
  ActvityAppRef: string;

  constructor(private swalService: SwalService,
    private toastsService: ToastsService,
    private util: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params params", params)
      this.orderId = params.orderID,
        this.status = params.STATUS
    });


    const storedData = sessionStorage.getItem("ActivityReportAppRef");

    if (storedData) {
      try {
        this.ActvityAppRef = storedData;
      } catch (error) {
        console.error("Error parsing ActivityConfirmDetail:", error);
      }
    } else {
      console.error("ActivityConfirmDetail not found in localStorage.");
    }
    this.cdr.detectChanges();
    this.paymentCheckout();
  }


  paymentCheckout() {
    this.subSink.sink = this.apiHandlerService.apiHandler('paymentConfirm', 'post', {}, {}, {
      order_id: this.orderId,
      isSuccess: this.status,
      payment_mode: "pay_later"
    }).subscribe(
      (resp) => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
          if (resp.data == true) {
            this.toastsService.toast({ 'type': 'success', 'text': 'Payment successful' });
            this.getVoucher(this.ActvityAppRef)
          } else {
            this.router.navigate(['/reports/activity-booking-details']);
            this.toastsService.toast({ 'type': 'error', 'text': 'Payment Failed' });
          }
        }
      },
      (error) => {
        this.router.navigate(['/reports/activity-booking-details']);
      }
    );
  }

  getVoucher(appReference) {
    this.router.navigate(['/reports/activity-voucher'], { queryParams: { appReference } });
  }

}
