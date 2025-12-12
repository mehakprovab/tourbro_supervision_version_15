import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ToastsService } from 'projects/b2b/src/app/core/services/toasts.service';
import { SubSink } from 'subsink';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { CartService } from '../cart.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-cart-payment-status',
  templateUrl: './cart-payment-status.component.html',
  styleUrls: ['./cart-payment-status.component.scss']
})
export class CartPaymentStatusComponent implements OnInit {

  appReference: any;
  orderId: any;
  booking_source: any;
  loading: boolean = false;
  currentUser: any;
  flight: any;
  finalData: any;
  airline_logo: string = '';
  confirmedData: any;
  showConfirmTicket: boolean = true;
  private subSink = new SubSink();
  ReservationResultIndex: any;
  txnid: any;
  custData: any;
  status: any;
  bookingDetails: any;
  hotel: any;
  transfer: any;
  cartItems: any;
  constructor(private router: Router,
    private swalService: SwalService,
    private toastsService: ToastsService,
    private flightService: FlightService,
    private apiHandlerService: ApiHandlerService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private utility: UtilityService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params params", params)
      this.orderId = params.orderID,
        this.status = params.STATUS
    });
    const cartData = JSON.parse(sessionStorage.getItem('cartData'));
    if (cartData) {
      this.cartService.cartItemsSubject.next(cartData);
    }
    this.cartService.cartItems.subscribe(items => {
      this.cartItems = items;
    });
    const storedState = sessionStorage.getItem('addBundleBookingPaxDetails');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        this.cartService.addBundleBookingPaxDetails.next(parsedState);
      } catch (e) {
        console.error('Error parsing storedState:', e);
      }
    }

    this.subSink.sink = this.cartService.addBundleBookingPaxDetails.subscribe((res: any) => {
      this.bookingDetails = res;
      this.flight = this.bookingDetails.flight.result.CommitBooking.BookingDetails;
      this.hotel = this.bookingDetails.hotel.BookingDetails;
      this.transfer = this.bookingDetails.transfer;
    });

    this.paymentCheckout();
  }


  paymentCheckout() {
    this.subSink.sink = this.apiHandlerService.apiHandler('paymentConfirm', 'post', {}, {}, {
      order_id: this.orderId,
      isSuccess: this.status,
      refNumber: this.cartItems.refNumber || '',
    }).subscribe(
      (resp) => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
          if (resp.data == true) {
            this.toastsService.toast({ 'type': 'success', 'text': 'Payment successful' });
            this.paymentConfirm();
          } else {
            this.toastsService.toast({ 'type': 'error', 'text': 'Payment Failed' });
            this.router.navigate(['/cart/voucher']);
          }
        }
      },
      (error) => {
        this.router.navigate(['/cart/voucher']);
      }
    );
  }

  paymentConfirm() {
    
    this.flightService.loading.next(true);

    const created_by_id = this.utility.readStorage('b2cUser', sessionStorage)['id'] || 0;

    const payload = {
      flightResultToken: this.bookingDetails.flight.result.CommitBooking.BookingDetails.ResultToken || null,
      flightAppReference: this.bookingDetails.flight.result.CommitBooking.BookingDetails.AppReference || null,
      transferAppReference: this.bookingDetails.transfer.BookingDetails.app_reference || null,
      transferBookingSource: this.bookingDetails.transfer.BookingSource || null,
      hotelBookingSource: this.bookingDetails.hotel.BookingDetails.booking_source || null,
      hotelAppReference: this.bookingDetails.hotel.BookingDetails.AppReference || null,
      refNumber: this.cartItems.refNumber || '',
      UserType: "B2C",
      UserId: created_by_id,
    };

    this.subSink.sink = this.apiHandlerService.apiHandler('finalBundleBooking', 'POST', '', '', payload).subscribe(
      (res) => {
        this.flightService.loading.next(false);

        if (res.Status) {
          this.router.navigate(['/cart/voucher']);
        } else {
          this.swalService.alert.oops(res.Message);
          setTimeout(() => {
            this.router.navigate(['/cart/bookings']);
          }, 100);
        }
      },
      (err: HttpErrorResponse) => {
        this.flightService.loading.next(false);
        this.router.navigate(['/cart/voucher']);
        const { error } = err;
        const errorMessage = error.Message || "An unexpected error occurred.";
        this.swalService.alert.oops(errorMessage);
      }
    );

  }



  handleError(err: HttpErrorResponse) {
    this.flightService.loading.next(false);
    const { error } = err;
    switch (error.statusCode) {
      case 400:
        // this.swalService.alert.oops(error.Message);
        break;
      default:
        // this.swalService.alert.oops(error.Message);
        break;
    }
    this.router.navigate(['/cart/voucher']);
  }

}

