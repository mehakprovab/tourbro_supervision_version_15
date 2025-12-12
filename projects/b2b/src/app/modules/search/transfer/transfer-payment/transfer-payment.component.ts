import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { TransferService } from '../transfer.service';

@Component({
  selector: 'app-transfer-payment',
  templateUrl: './transfer-payment.component.html',
  styleUrls: ['./transfer-payment.component.scss']
})
export class TransferPaymentComponent implements OnInit {

  transferBookingPaxDetails: any;
  booking_source: string = '';
  appReference: string = ""
  loading: boolean;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  showPaymentDetails: boolean = false;
  paymentGateways: any;
  submitted: boolean;
  paymentForm: FormGroup;
  blockedTransfer: any = [];
  bookingDetails: any = [];
    loggedInUser: any;

  constructor(
      private transferService: TransferService,
      private router: Router,
      private cdRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.transferService.paxDetails.subscribe(res => {
      this.blockedTransfer = res;
      this.appReference = this.blockedTransfer.BookingDetails.app_reference;
      let bookingData = this.blockedTransfer.BookingDetails.attributes.replace(/'/g, '"');
      this.bookingDetails = JSON.parse(bookingData);
    });
      this.createPaymentForm()
      this.setVoucherResponse();
      this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  setVoucherResponse() {
      this.loading = true;
      this.apiHandlerService.apiHandler('transferVoucher', 'POST', '', '', {
          AppReference: this.appReference,
      }).subscribe(res => {
          if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
              this.transferBookingPaxDetails = res.data;
              this.loading = false;
              this.cdRef.detectChanges();
          }
      },
          (err) => {
              this.loading = false;
              this.cdRef.detectChanges();
              this.swalService.alert.oops(err.error.Message);
          });
  }

  setResponseData() {
      this.transferService.addTransferBookingPaxDetails.subscribe(res => {
          if (typeof res == 'object' && res.hasOwnProperty('BookingPaxDetails')) {
              this.transferBookingPaxDetails = res;
          } else {
              this.router.navigate(['/']);
          }
          this.cdRef.detectChanges();
      });
  }

  onBooking() {
      this.submitted = true;
      if (!this.paymentForm.valid)
          return;

      if (this.paymentForm.value.paymentMethod == "wallet") {
          this.walletPayment();
      }
      this.showPaymentDetails = false;
  }

  walletPayment() {
      this.loading = true;
      this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: this.appReference })
          .subscribe(res => {
              if (res && res.data[0].ticketFare) {
                  if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                      this.loading = false;
                      this.swalService.alert.oops("Your wallet balance is not sufficient.")
                  } else {
                     // this.holdSeat();
                  }
              }
          }, (err) => {
              this.loading = false;
              this.swalService.alert.oops(err.error.Message)
          });
  }

  createPaymentForm() {
      this.paymentForm = this.fb.group({
          paymentMethod: new FormControl('', [Validators.required])
      });
  }

  hasError = (controlName: string, errorName: string) => {
      return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
  }
  // holdSeat() {
  //     this.loading = true;
  //     let request = {
  //         "AppReference": this.busBookingPaxDetails.BookingDetails.app_reference
  //     }
  //     this.apiHandlerService.apiHandler('holdSeatsBus', 'post', '', '', request).subscribe(response => {
  //         if (response.statusCode == 200 && response.data) {
  //             this.busService.holdBusData.next(response.data);
  //             this.reservation();
  //         }
  //         else {
  //             this.redirectToPayment();
  //         }
  //     }, (err) => {
  //         this.swalService.alert.oops(err.error.Message);
  //         this.redirectToPayment();
  //     });
  // }

  redirectToPayment(){
      this.loading = false;
      this.cdRef.detectChanges();
      this.router.navigate(['/search/transfer/transfer-payment'], { queryParams: { appReference: this.appReference } });
  }

  // reservation() {
  //     let request = {
  //         "AppReference": this.appReference
  //     }
  //     this.apiHandlerService.apiHandler('bookSeats', 'post', '', '', request).subscribe(response => {
  //         if (response.statusCode == 200 && response.data) {
  //             this.busService.busConfirmationData.next(response.data);
  //             this.deductFromWallet();
  //         }
  //         else {
  //             this.redirectToPayment();
  //         }
  //     }, (err) => {
  //         this.swalService.alert.oops(err.error.Message);
  //         this.redirectToPayment();
  //     });
  // }

  deductFromWallet() {
     this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: this.appReference }).subscribe(res => {
          if (res) {
              if (res.data[2].order_id && res.data[2].RemainingBalance > 0) {
                  this.swalService.alert.success("Your transaction is successful.")
                  this.loading=false;
                  this.redirectToconfirmation(res.data[2].order_id);
              }
          }

      }, (err) => {
          this.loading=false;
          this.swalService.alert.oops("Your wallet balance is not sufficient.");
      });
  }

  proceedPayment() {
      this.getPaymentGateWays();
      this.showPaymentDetails = true;
  }

  getPaymentGateWays() {
            let obj = {
            user_id: this.loggedInUser.id
        }
      this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
          if (res && ([200, 201].includes(res.statusCode))) {
              if (res.data && res.data.length > 0) {
                  this.paymentGateways = res.data;
                  this.showPaymentDetails = true;
              }
              else {
                  this.swalService.alert.oops('No payment gateway enabled.');
                  this.showPaymentDetails = false;
              }
          }
          else {
              this.swalService.alert.oops('Some thing went wrong');
              this.showPaymentDetails = false;
          }
      }, (err) => {
          if (err && err.err && err.error.msg) {
              this.swalService.alert.oops(err.error.msg);
              this.showPaymentDetails = false;
          }
      });
  }

  redirectToconfirmation(order_id) {
      this.router.navigate(['/search/transfer/transfers-confirm'], { queryParams: { AppReference: this.appReference, OrderId:order_id, BookingSource: this.booking_source } });
  }

}
