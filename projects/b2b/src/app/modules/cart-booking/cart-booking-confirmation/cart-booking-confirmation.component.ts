import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatModalService, ModalConfigDataI } from 'projects/b2b/src/app/core/services/mat-modal.service';
import { Subscription } from 'rxjs';
import { browserRefresh } from '../../../app.component';
import { SubSink } from 'subsink';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { ApiHandlerService } from '../../../../app/core/api-handlers';
import { AlertService } from '../../../../app/core/services/alert.service';
import { UtilityService } from '../../../../app/core/services/utility.service';
import { SwalService } from '../../../../app/core/services/swal.service';
import { CartService } from '../cart.service';
import { HeaderService } from '../../../shared/components/header/header.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cart-booking-confirmation',
  templateUrl: './cart-booking-confirmation.component.html',
  styleUrls: ['./cart-booking-confirmation.component.scss']
})
export class CartBookingConfirmationComponent implements OnInit {

  @ViewChild('form', { static: false }) form: ElementRef;
  @ViewChild('gotoBaggageProtection', { static: false }) private gotoBaggageProtection: ElementRef<HTMLDivElement>;
  baggageForm: FormGroup
  baggagelist: any;
  passengers: any;
  contact: any;
  flights: any;
  flightsFare: any;
  price: any;
  attr: any;
  baggageProtected: boolean = false;
  loadingTemplate: any;
  loading: boolean = false;
  protected subs = new SubSink();
  modalConfigData: ModalConfigDataI;
  subscription: Subscription;
  bookingSource;
  baggeData = {
    isProtected: false,
    data: { Total_Price: 0 }
  };
  contactDetails: any;
  passengerDetails: any;
  appReference: any;
  flight: any;
  commitBookReq: any;
  currentUser: any;
  baggageLoaded: Promise<boolean>;
  countries: any;
  baggageRadio: any = true;
  submitted: boolean = false;
  traveller: any;
  isSeatInfoNotEmpty: boolean = false;
  showConfirm: boolean = false;
  subjectName: string;
  fullName: any;
  paymentData: any;
  phone: any;
  ACCEPTURL: any;
  CANCELURL: any
  DECLINEURL: any
  AMOUNT: number = 0;
  CN: any
  COM: any
  CURRENCY: any
  EMAIL: any
  FONTTYPE: any
  LANGUAGE: any
  LOGO: any
  OPERATION: any
  ORDERID: any
  OWNERADDRESS: any
  OWNERCTY: any
  OWNERTELNO: any
  OWNERTOWN: any
  OWNERZIP: any
  PMLISTTYPE: any
  PSPID: any
  BGCOLOR: any
  BUTTONBGCOLOR: any
  BUTTONTXTCOLOR: any
  TBLBGCOLOR: any
  TBLTXTCOLOR: any
  TITLE: any
  TXTCOLOR: any
  SHASIGN: any;
  BACKURL: any;
  browserRefresh: boolean;
  paxDetail: any;
  addressDetail: any;
  cartItems: any;
  bookingDetails: any;

  adultCount = 0;
  childCount = 0;
  infantCount = 0;
  hotel: any;
  transfer: any;
  email: any;
  activity: any;
  currency: any;
  paymentGateways: any;
  showPaymentDetails: boolean;
  paymentForm: FormGroup;
  payReference: any;
  showPayLaterPopUp: boolean = false;
  bundelBookingDeadLine: any;
  constructor(
    private router: Router,
    private flightService: FlightService,
    private apiHandlerService: ApiHandlerService,
    private alertService: AlertService,
    private utility: UtilityService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private matModalService: MatModalService,
    private cdRef: ChangeDetectorRef,
    private cartService: CartService,
    private headerService: HeaderService
  ) {

  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    console.log("browserRefresh", this.browserRefresh)
    this.currency = this.utility.readStorage('currentUser', sessionStorage)['currency'] || 'GBP';
    //this.browserRefresh ? this.setValues() : null;
    if (this.browserRefresh) {
      // this.setValues();
      this.flightService.setMealFee();
      this.flightService.setBaggageFee();
      this.flightService.setPromoCode();
    }
    this.subs.sink = this.flightService.bookingSource.subscribe(res => {
      this.bookingSource = res;
    });

    this.flightService.countryList.subscribe(res => {
      this.countries = res;
    });
    const cartData = JSON.parse(sessionStorage.getItem('cartData'));
    if (cartData) {
      this.cartService.cartItemsSubject.next(cartData);
    }
    this.cartService.cartItems.subscribe(items => {
      this.cartItems = items;
    });
    // this.subs.sink = this.flightService.passengerDetails.subscribe(res => {
    //   console.log("passengerDetails", res)
    //   this.appReference = res[0].AppReference
    //   this.fullName = res[1].passengers[0].FirstName
    //   this.passengers = res[1].passengers;
    //   this.enableSeat(res);
    //   this.contact = res[1].contact;
    //   this.commitBookReq = res[0];
    //   this.cdRef.detectChanges()
    // });
    this.baggageForm = this.fb.group({
      baggageProtection: ['', Validators.required]
    })
    this.paymentForm = this.fb.group({
      paymentMethod: new FormControl('', [Validators.required])
  });
    this.subs.sink = this.flightService.loading.subscribe(res => {
      this.loading = res;
    });
    // this.getBaggageValue();
    const storedState = sessionStorage.getItem('addBundleBookingPaxDetails');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        this.cartService.addBundleBookingPaxDetails.next(parsedState);
      } catch (e) {
        console.error('Error parsing storedState:', e);
      }
    }

    this.subs.sink = this.cartService.addBundleBookingPaxDetails.subscribe((res: any) => {
      this.bookingDetails = res;
      this.getCancellationDeadLine(res);
      this.paxDetail = res.Passengers;
      this.addressDetail = res.AddressDetails;
      this.fullName = this.addressDetail.FirstName + ' ' + this.addressDetail.LastName,
        this.contact = this.addressDetail.Contact,
        this.email = this.addressDetail.Email,
        this.flight = (this.bookingDetails && this.bookingDetails.flight &&
          this.bookingDetails.flight.result &&
          this.bookingDetails.flight.result.CommitBooking &&
          this.bookingDetails.flight.result.CommitBooking.BookingDetails)
          ? this.bookingDetails.flight.result.CommitBooking.BookingDetails
          : null;

      this.hotel = (this.bookingDetails && this.bookingDetails.hotel &&
        this.bookingDetails.hotel.BookingDetails)
        ? this.bookingDetails.hotel.BookingDetails
        : null;

      this.transfer = (this.bookingDetails && this.bookingDetails.transfer)
        ? this.bookingDetails.transfer
        : null;

      this.activity = (this.bookingDetails && this.bookingDetails.activity &&
        this.bookingDetails.activity.BookingDetails)
        ? this.bookingDetails.activity.BookingDetails
        : null;

    });
    // this.subs.sink = this.flightService.edditedResponse.subscribe(res => {
    //   if (res && res.Price) {
    //     this.flights = res;
    //     this.flightsFare = res;
    //     this.price = res.Price;
    //     this.attr = res.Attr;
    //   }
    // });
    this.currentUser = JSON.parse(sessionStorage.getItem('b2cUser'));
  }

  getCountryName(code) {
    if (code) {
      let ob = this.countries.find(el => el.code == code)
      return ob.name
    }
  }

  editPassengers() {
    this.flightService.editPassenger.next(true)
    this.router.navigate(['/cart/guest-detail']);
  }

  passengerType(code): string {
    let result = 'Infant';
    switch (code) {
      case 'ADT':
        result = 'Adult';
        break;
      case 'CHD':
        result = 'Child';
        break;
      case 1:
        result = 'Adult';
        break;
      case 2:
        result = 'Child';
        break;

      default:
        break;
    }
    return result;
  }

  passengerName(obj): string {
    return obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
  }

  submitBaggageCharge() {
    this.subs.sink = this.apiHandlerService.apiHandler('servicePurchase', 'post', {}, {}, { app_reference: this.flightService.CommitBookingResponse.value.AppReference, booking_source: this.bookingSource }).subscribe(resp => {
      // console.log(resp);

      // if ((resp.statusCode == 200 || resp.statusCode == 201) && !resp.data.hasOwnProperty("Data")) {
      //     this.flightService.baggeProtectionData.next({
      //         isProtected: true,
      //         data: resp.data[0]
      //     });
      //     this.baggeData = {
      //         isProtected: true,
      //         data: resp.data[0],
      //     }
      // } else {
      //     this.swalService.alert.oops(resp.data.Errors[0]['ErrorMessage'] || '');
      // }
    }, err => {
      // console.log(err);
      // Radha DD
      // this.swalService.alert.oops();
    });
  }


  onFinalBooking() {
    this.submitted = true;
    let baggageProtection = this.baggageForm.value.baggageProtection;
    if (baggageProtection) {
      this.subs.sink = this.apiHandlerService.apiHandler('servicePurchase', 'post', {}, {}, {
        app_reference: this.flightService.appReference,
        booking_source: this.flight.booking_source
      }).subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
        }
      });
    }

    this.onReservation('');
  }

  onReservation(mode) {
    this.flightService.loading.next(true);

    // if (this.flightService.isDevelopment) {
    //   setTimeout(() => {
    //     this.flightService.loading.next(false);
    //     this.router.navigate(['/cart/guest-detail']);
    //   }, 3000);
    //   return;
    // }

    // if (this.baggageProtected) {
    //   this.submitBaggageCharge();
    // }

    const created_by_id = this.utility.readStorage('b2cUser', sessionStorage)['id'] || 0;

    const payload = {
      flightResultToken: this.bookingDetails.flight ? this.bookingDetails.flight.result.CommitBooking.BookingDetails.ResultToken : '',
      flightAppReference: this.bookingDetails.flight ? this.bookingDetails.flight.result.CommitBooking.BookingDetails.AppReference : '',
      transferAppReference: this.bookingDetails.transfer ? this.bookingDetails.transfer.BookingDetails.app_reference : '',
      transferBookingSource: this.bookingDetails.transfer ? this.bookingDetails.transfer.BookingSource : '',
      hotelBookingSource: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.booking_source : '',
      hotelAppReference: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.AppReference : '',
      activityBookingSource: this.bookingDetails.activity ? this.bookingDetails.activity.SearchData.booking_source : '' ,
      activityAppReference: this.bookingDetails.activity ? this.bookingDetails.activity.BookingDetails.app_reference : '' ,
      refNumber: this.cartItems.refNumber || '',
      UserType: "B2C",
      UserId: created_by_id,
    };
    if (mode === 'pay_later') {
      payload['payment_mode'] = mode;
    }
    this.subs.sink = this.apiHandlerService.apiHandler('finalBundleBooking', 'POST', '', '', payload).subscribe(
      (res) => {
        this.flightService.loading.next(false);

        if (res.Status) {
          this.router.navigate(['/cart/voucher'], {
            queryParams: {
              flightAppReference: this.bookingDetails.flight ? this.bookingDetails.flight.result.CommitBooking.BookingDetails.AppReference : '',
              hotelAppReference: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.AppReference : '',
              hotelBookingSource: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.booking_source : '',
              activityBookingSource: this.bookingDetails.activity ? this.bookingDetails.activity.SearchData.booking_source : '' ,
              activityAppReference: this.bookingDetails.activity ? this.bookingDetails.activity.BookingDetails.app_reference : '' ,
            },
          });
        } else {
          this.swalService.alert.oops(res.Message);
          setTimeout(() => {
            this.router.navigate(['/cart/bookings']);
          }, 100);
        }
      },
      (err: HttpErrorResponse) => {
        this.flightService.loading.next(false);

        this.router.navigate(['/cart/voucher'], {
          queryParams: {
              flightAppReference: this.bookingDetails.flight ? this.bookingDetails.flight.result.CommitBooking.BookingDetails.AppReference : '',
              hotelAppReference: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.AppReference : '',
              hotelBookingSource: this.bookingDetails.hotel ? this.bookingDetails.hotel.BookingDetails.booking_source : '',
              activityBookingSource: this.bookingDetails.activity ? this.bookingDetails.activity.SearchData.booking_source : '' ,
              activityAppReference: this.bookingDetails.activity ? this.bookingDetails.activity.BookingDetails.app_reference : '' ,
          },
        });

        const { error } = err;
        const errorMessage = error.Message || "An unexpected error occurred.";
        this.swalService.alert.oops(errorMessage);
      }
    );
  }


  hasError = (controlName: string, errorName: string, arrayControl?: string) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.baggageForm.get(arrayControl) as FormArray;
      if (formArrayName && formArrayName != null)
        return ((this.submitted || formArrayName.controls[controlName].touched) && formArrayName.controls[controlName].hasError(errorName));
    }
  }


  isAdult(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('ADT');
    if (result) {
      this.adultCount = flight.Price.PassengerBreakup.ADT.PassengerCount;
    }
    return result;
  }

  isYouth(flight: any) {
const result = flight['Price']['PassengerBreakup'].hasOwnProperty('YTH');
    if (result) {
      this.adultCount = flight.Price.PassengerBreakup.YTH.PassengerCount;
    }
    return result;
  }

  isChild(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('CHD');
    if (result) {
      this.childCount = flight['Price']['PassengerBreakup'].CHD.PassengerCount;
    }
    return result;
  }

  isInfant(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('INF');
    if (result) {
      this.infantCount = flight['Price']['PassengerBreakup'].INF.PassengerCount;
    }
    return result;
  }

  getData() {
    this.subscription = this.matModalService.getData().subscribe(res => {
      if (!res.noData && !this.baggageForm.value.baggageProtection) {
        this.subscription.unsubscribe();
        this.gotoBaggageProtection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        this.subscription.unsubscribe();
        this.onFinalBooking();
      }
    })
  }

  getBaggageValue() {
    this.subs.sink = this.apiHandlerService.apiHandler('baggageproductList', 'post', {}, {}, {}).subscribe(resp => {
      if ((resp.statusCode == 200 || resp.statusCode == 201)) {
        this.baggagelist = resp.data[0];
        this.baggageLoaded = Promise.resolve(true);
        this.cdRef.detectChanges()
      } else {
        this.swalService.alert.oops(resp.data.Errors[0]['ErrorMessage'] || '');
      }
    }, err => {
      this.swalService.alert.oops();
    });
  }

  updateBaggage(val) {
    let baggageData = {
      // booking_source: this.commitBookReq.booking_source,
      booking_source: "B2C",
      app_reference: this.commitBookReq.AppReference,
      baggagePrice: this.baggagelist.ProductPrice
    }

    if (val) {

      this.subs.sink = this.apiHandlerService.apiHandler('updateLostBaggageProtectionPrice', 'post', {}, {}, baggageData).subscribe(resp => {
        if ((resp.statusCode == 200 || resp.statusCode == 201)) {
          this.baggageProtected = true;
          // this.price = resp.data.Price;
          const obj = Object.assign({}, this.flightsFare, resp.data)
          this.flightsFare = obj;
          this.flight = this.flightsFare;
          this.cdRef.detectChanges();
        } else {
          this.baggageProtected = false;
          // this.price = resp.data.Price;
          this.cdRef.detectChanges();
          this.swalService.alert.oops(resp.data.Errors[0]['ErrorMessage'] || '');
        }
      }, err => {
        this.swalService.alert.oops();
      });

    } else {
      if (this.flightsFare.Price.PriceBreakup.TotalLostBaggageProtection) {
        baggageData.baggagePrice = -this.flightsFare.Price.PriceBreakup.TotalLostBaggageProtection;
      } else {
        baggageData.baggagePrice = 0;
      }
      this.subs.sink = this.apiHandlerService.apiHandler('updateLostBaggageProtectionPrice', 'post', {}, {}, baggageData).subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          const obj = Object.assign({}, this.flightsFare, resp.data)
          this.flightsFare = obj;
          this.flight = this.flightsFare
          this.cdRef.detectChanges();
        }
      });
    }
  }

  enableSeat(res) {
    const currentUser = this.utility.readStorage('b2cUser', sessionStorage);
    if (res && (res[0].booking_source == 'ZBAPINO00002' || res[0].booking_source == 'ZBAPINO00007') && currentUser && currentUser.id == 44) {
      this.isSeatInfoNotEmpty = this.checkSeatSelection(this.passengers);
    }
  }

  checkSeatSelection(passengers) {
    let hasValue = false;
    for (const passenger of passengers) {
      if (passenger.SeatId.length > 0) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }
  proceedToConfirm() {
    this.submitted = true;
    // if (!this.terms) {
    //     return;
    // }
    //this.loading=true;
    this.loading = false;
    // this.showConfirm = true;
    this.subjectName = "confirm";
    this.payReference = this.cartItems.refNumber
    this.getPaymentGateWays();
    this.intitiatePayment();
    this.showPaymentDetails = true;
  }


  onBooking(appReference) {
    this.submitted = true;
  
        if (!this.paymentForm.valid)
            return;


 
            if (this.paymentForm.value.paymentMethod == "barclay") {
                this.confirmTicket();
            }

    if (this.paymentForm.value.paymentMethod == "wallet") {
        this.walletPayment(appReference);
    }

 
    this.showPaymentDetails = false;
}


walletPayment(appReference) {
  this.loading=true;
 this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
      .subscribe(res => {
          // if (res && res.data[0].ticketFare) {
              if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                  this.loading=false;
                  this.swalService.alert.oops("Your wallet balance is not sufficient.")
              } else {
                  this.updateSubAgent(res);
                  this.deductFromWallet(appReference);
              }
          // }
      }, (err) => {
          this.loading=false;
          this.swalService.alert.oops("Your wallet balance is not sufficient.")
      });
}


updateSubAgent(resp) {
  this.currentUser = this.utility.getStorage('currentUser');
  let totalFare: any = 0;

  let balance = String(this.currentUser.agent_balance - totalFare);
  this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
      id: this.currentUser.id,
      agent_balance: balance
  }).subscribe(res => {
      if (resp.statusCode == 201) {
         this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
              id: this.currentUser.id
          }).subscribe(data => {
              res['data']['access_token'] = this.currentUser.access_token;
              sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
          });
      }
  })
}
deductFromWallet(appReference) {
    this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
      if (res) {
          if (res.data[2].order_id && res.data[2].RemainingBalance > 0) {
              this.swalService.alert.success("Your transaction successful.")
              this.headerService.agentData.next(true);
              this.loading=false;
              this.getVoucher(appReference)
              // this.receiveSearchValues(this.searchParams)
          }
      }

  }, (err) => {
      this.loading=false;
      this.swalService.alert.oops("Your wallet balance is not sufficient.");
  });
}

  getPaymentGateWays() {
     let obj = {
            user_id: this.currentUser.id
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

getVoucher(appReference) {
  this.router.navigate(['/cart/voucher'], { queryParams: { appReference } });
}

  intitiatePayment() {
    let date = (new Date().getTime()).toString();
    const userId = this.utility.readStorage('b2cUser', sessionStorage)['id']
    const order_id = `${date.substring(10)}${date.substring(0, 7)}${date.substring(7)}`;
    let payload = {
      app_reference: this.cartItems.refNumber || '',
      order_id: order_id,
      payment_type: "Barclay",
      merchantInvoiceNumber: "Inv002",
      source: "bundle",
      name: this.fullName,
      phone: this.contact,
      userId: userId ? userId : 0,
      email: this.email
    }
    this.subs.sink = this.apiHandlerService.apiHandler('initiatePayment', 'post', '', '', payload).subscribe(res => {
      if (res) {
        console.log(res);

        // this.paymentData = this.data.paymentUrl;
        this.ACCEPTURL = res.data.ACCEPTURL;
        this.CANCELURL = res.data.CANCELURL;
        this.DECLINEURL = res.data.DECLINEURL;
        this.AMOUNT = parseFloat(res.data.AMOUNT);
        this.CN = res.data.CN;
        this.COM = res.data.COM;
        this.CURRENCY = res.data.CURRENCY;
        this.EMAIL = res.data.EMAIL;
        this.FONTTYPE = res.data.FONTTYPE;
        this.LANGUAGE = res.data.LANGUAGE;
        this.LOGO = res.data.LOGO;
        this.OPERATION = res.data.OPERATION;
        this.ORDERID = res.data.ORDERID;
        this.OWNERADDRESS = res.data.OWNERADDRESS;
        this.OWNERCTY = res.data.OWNERCTY;
        this.OWNERTELNO = res.data.OWNERTELNO;
        this.OWNERTOWN = res.data.OWNERTOWN;
        this.OWNERZIP = res.data.OWNERZIP;
        this.PMLISTTYPE = res.data.PMLISTTYPE;
        this.PSPID = res.data.PSPID;
        this.BGCOLOR = res.data.BGCOLOR;
        this.BUTTONBGCOLOR = res.data.BUTTONBGCOLOR;
        this.BUTTONTXTCOLOR = res.data.BUTTONTXTCOLOR;
        this.TBLBGCOLOR = res.data.TBLBGCOLOR;
        this.TBLTXTCOLOR = res.data.TBLTXTCOLOR;
        this.TITLE = res.data.TITLE;
        this.TXTCOLOR = res.data.TXTCOLOR;
        this.SHASIGN = res.data.SHASign;
        this.BACKURL = res.data.BACKURL;
        this.paymentData = res.data.paymentUrl;
        this.cdRef.detectChanges();
      }
      console.log(" this.ACCEPTURL", this.ACCEPTURL)
    });
  }
  confirmTicket() {
    this.loading = true;
    // this.showConfirm = true;
    this.form.nativeElement.submit();

  }

  hide() {
    this.showConfirm = false;
    this.showPaymentDetails = false;
    this.showPayLaterPopUp = false;
  }

  setValues(enabledApiList, bookingApiSources) {
    this.flightService.setFlightTraveller();
    this.flightService.setJourneyListPre();
    this.flightService.setResultToken();
    this.flightService.setBookingSource(enabledApiList, bookingApiSources);
    // this.flightService.setPassengerDetails();
    // this.flightService.setCountryList();
    this.flightService.setCommitBookingResponse();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  checkPayLaterOption(data: any): boolean {
    if (data.flight && typeof data.flight === 'object' && 'flight' in data) {
      return false;
    }
    if (data.hotel && typeof data.hotel === 'object' && 'hotel' in data && data.hotel.BookingDetails.Refundable !== "true" ) {
      return false;
    }
    if (data.transfer && typeof data.transfer === 'object' && 'transfer' && 'transfer' in data && data.transfer.BookingDetails.pay_later !== "true") {
      return false
    }
    if (data.activity && typeof data.activity === 'object' && 'activity' && 'activity' in data && data.activity.BookingDetails.pay_later !== "true") {
      return false;
    } 
    return true;
  }

 payLater(mode) {
  this.onReservation(mode);
 }

 getCancellationDeadLine(data) {
    if (data.activity || data.hotel) {
    const activityDeadLine = data.activity ?  moment(data.activity.BookingDetails.cancellation_deadline, ['DD/MM/YYYY', moment.ISO_8601]).format('YYYY-MM-DD') : '';
    const hotelDeadLine = data.hotel ? moment(data.hotel.BookingDetails.CancelDeadline, ['DD-MM-YYYY', moment.ISO_8601]).format('YYYY-MM-DD') : '';
    
    
    const deadLineDates = [
      new Date(activityDeadLine),
      new Date(hotelDeadLine)
    ]
    
    const validDates = deadLineDates
      .filter(date => date !== null)
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime())); // Filter out invalid dates

    // Step 2: Find the earliest date
    const earliestDate = validDates.reduce((earliest, current) => {
      return current < earliest ? current : earliest;
    }, validDates[0]);
    
    this.bundelBookingDeadLine = moment(earliestDate, ['DD-MM-YYYY', moment.ISO_8601]).format('DD-MM-YYYY');
    console.log('Earliest deadline:', earliestDate );
    }
 }
}