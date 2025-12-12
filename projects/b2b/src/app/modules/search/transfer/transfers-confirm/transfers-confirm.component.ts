import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../transfer.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from "projects/b2b/src/environments/environment.prod";
const baseUrl = environment.SA_URL;

@Component({
  selector: 'app-transfers-confirm',
  templateUrl: './transfers-confirm.component.html',
  styleUrls: ['./transfers-confirm.component.scss']
})
export class TransfersConfirmComponent implements OnInit {

  @ViewChild('form', { static: false }) form: ElementRef;
  confirmDetails: any = [];
  bookingDetails: any = [];
  created_by_id: string;
  showLoader: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  private subSink = new SubSink();
  paymentMode: string;
  transferSearchData: any;
  subjectName: string;
  showConfirm: boolean;

  ACCEPTURL:any;
  CANCELURL:any
  DECLINEURL:any 
  AMOUNT:number =0;
  CN: any
  COM: any
  CURRENCY: any
  EMAIL: any
  FONTTYPE:any 
  LANGUAGE:any 
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
  SHASIGN:any;
  BACKURL:any;
  updatedDateFrom: string;
  visibleCancelPolicyIndex = -1;
  visibleNonCancelPolicyIndex =-1;
  paymentData: any;
  payReference: any;
  currentUser: any;
  loading:boolean=false;
  confirmedData: any;
  showConfirmTicket: boolean = true;
  showPaymentDetails: boolean = false;
  paymentForm: FormGroup;
  paymentGateways: any;
  submitted: boolean;
  bookingData: any;
  noOfTraveller: any;
  showPayLater: boolean = false;
  transfers: any;
  loggedInUser: any;
  convienienceFee: any;
  grandTotalPrice: any;
  totalPriceFromAPI: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private transferService: TransferService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdRef: ChangeDetectorRef,
    private headerService: HeaderService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    this.transferSearchData=JSON.parse(sessionStorage.getItem('transferSearchData'));
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.setpaxDetails();
    this.setConfirmDetails();
    this.createPaymentForm();
    this.transferService.setPromoCode();
    this.noOfTraveller =  this.transferSearchData;
    this.transferService.loading.subscribe(res => {
      this.showLoader = res;
      this.cdRef.detectChanges();
    });
    this.transferService.bookingTransferData.subscribe(res => {
      this.transfers = res;
    })

  }

  payLaterShow(){
    this.showPayLater = true;
  }

  setConfirmDetails() {
    this.transferService.paxDetails.subscribe(res => {
      this.confirmDetails = res;
      const req = {
        appRef: this.confirmDetails.BookingDetails.app_reference,
        booking_source: this.confirmDetails.BookingSource

      }
      this.removePaymentGateWay()
      this.transferService.transferConfirmDetail.next(req);
      localStorage.setItem("TransferConfirmDetail",JSON.stringify(req));
      try {
        let sanitizedData;
        let noOfTraveller;
        if (this.confirmDetails.BookingSource === 'ZBAPINO00022') {
          sanitizedData =  this.confirmDetails.BookingDetails.attributes.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"');
          const attributes = this.confirmDetails.BookingItineraryDetails.attributes;
          const data = attributes.replace(/[\n\r\t]/g, ' ');
          noOfTraveller = JSON.parse(data.replace(/'/g, '"'));
        } else {
          sanitizedData =  this.confirmDetails.BookingDetails.attributes.replace(/'/g, '"');
          noOfTraveller = JSON.parse(this.confirmDetails.BookingItineraryDetails.attributes.replace(/'/g, '"'));
        }
        
        this.noOfTraveller = noOfTraveller.body.AdultCount + noOfTraveller.body.ChildCount + noOfTraveller.body.InfantCount;
        this.bookingData = JSON.parse(sanitizedData);
        let promocode;
        let discount_value =0;
        let extrasValue =0;
        this.transferService.transferPromocode.subscribe(res => {
          if (res && Object.keys(res).length > 0) {
              promocode = res['promocode'];
              if (promocode && promocode!="") {
                  if (promocode.discount_type == "percentage") {
                      let amount: number
                      amount = (promocode.discount_value / 100);
                      discount_value = this.bookingData.Price.TotalDisplayFare * amount;
                  }
                  if (promocode.discount_type == "plus") {
                      discount_value = promocode.discount_value;
                  }
              }
              else {
                  discount_value = 0;
              }

          }

          this.transferService.extrasValues.subscribe(res => {
            extrasValue = res
          });
      });
      this.totalPriceFromAPI = this.bookingData.Price.TotalDisplayFare + Number(extrasValue) - Number(discount_value)
        this.grandTotalPrice = this.bookingData.Price.TotalDisplayFare + Number(extrasValue) - Number(discount_value);
        console.log('Parsed Booking Data:', this.bookingData);
      } catch (error) {
        console.error('Error parsing booking data:', error.message);
      }
      this.cdRef.detectChanges();
    });
  } 

  setpaxDetails() {
    const storedState = localStorage.getItem('paxDetails');
    if (storedState) {
      this.transferService.paxDetails.next(JSON.parse(storedState));
    }
  }

  paymentConfirm(){
    this.loading = true;
    let appReference = this.confirmDetails.BookingDetails.app_reference;
    let booking_source = this.confirmDetails.BookingSource;
    let request = {
      AppReference: appReference,
      UserType: "B2B",
      UserId: this.created_by_id,
      BookingSource: booking_source
    }
    this.apiHandlerService.apiHandler('transferConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.loading = false;
        this.deductFromWallet(response.data.BookingDetails);
      }
      else {
        this.loading = false;
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
        // this.router.navigate(['/']);
      }
    }, (err) => {
      this.loading = false;
      this.transferService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
      // this.router.navigate(['/']);
    });
  }

  walletPayment(data,payments?) {
    this.transferService.loading.next(true);
    this.showLoader =true;
    this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data })
        .subscribe(res => {
            if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare < res.data[0].userWalletBalance) {
                  this.showLoader =false;
                  this.paymentGateways = payments;
                  this.showPaymentDetails = true;
                } else {
                  // this.paymentConfirm();
                }
            }
        }, (err) => {
          this.showLoader =false;
          this.paymentGateways = [payments[0]];
          this.showPaymentDetails = true;
            // this.swalService.alert.oops(err.error.Message)
            // this.router.navigate(['/']);
        });
    }

  // confirmBooking() {
  //   this.transferService.loading.next(true);
  //   let appReference = this.confirmDetails.BookingDetails.app_reference;
  //   this.walletPayment(appReference);
  // }
  

  confirmBooking() {
    this.showPayLater = false;
    this.paymentMode = 'pay_later'
    this.transferService.loading.next(true);
    let appReference = this.confirmDetails.BookingDetails.app_reference;
    let booking_source = this.confirmDetails.BookingSource;
    let request = {
      AppReference: appReference,
      UserType: "B2B",
      UserId: this.created_by_id,
      BookingSource: booking_source,
      payment_mode:'pay_later'
    }
    this.apiHandlerService.apiHandler('transferConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.transferService.loading.next(false);
        this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: appReference} });
        this.swalService.alert.success("Booking Confirmed");
      }
      else {
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
      }
    }, (err) => {
      this.transferService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
    });
  }


  hide() {
    this.showConfirm = false;
    this.showPayLater = false;
}

createPaymentForm() {
    this.paymentForm = this.fb.group({
        paymentMethod: new FormControl('', [Validators.required])
    });
}


  proceedPayment(appReference) {
    this.getPaymentGateWays();
    this.showPaymentDetails = true;
}

hasError = (controlName: string, errorName: string) => {
  return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
}


getPaymentGateWays() {
  this.showLoader =true;
          let obj = {
            user_id: this.loggedInUser.id
        }
  this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
      if (res && ([200, 201].includes(res.statusCode))) {
          if (res.data && res.data.length > 0) {
            let appReference = this.confirmDetails.BookingDetails.app_reference;
            this.walletPayment(appReference,res.data)
              // this.paymentGateways = res.data;
              // this.showPaymentDetails = true;
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


getPayNow(data) {
    this.payReference = data.BookingDetails.app_reference
    this.getPaymentGateWays();
    this.intitiatePayment(data);
    // this.showPaymentDetails = true;
}

intitiatePayment(data){
    let date = (new Date().getTime()).toString();
    this.currentUser = this.utility.getStorage('currentUser');
    const order_id = `${date.substring(10)}${date.substring(0, 7)}${date.substring(7)}`;
    let payload = {
        app_reference: this.payReference,
        order_id: order_id,
        payment_type: "Barclay",
        merchantInvoiceNumber: "Inv002",
        source: "transfers",
        name: data.BookingPaxDetails[0].first_name + ' ' + data.BookingPaxDetails[0].last_name,
        phone: data.BookingPaxDetails[0].phone,
        userId: this.currentUser.id ? this.currentUser.id : 0,
        email: data.BookingPaxDetails[0].email
    }
    this.subSink.sink = this.apiHandlerService.apiHandler('initiatePayment', 'post', '', '', payload).subscribe(res => {
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
            this.loading = false;
            this.subjectName = "confirm";
        }
        console.log(" this.ACCEPTURL", this.ACCEPTURL)
    });
}

onBooking(appReference) {
  this.submitted = true;
  if (!this.paymentForm.valid)
          return;
    const obj = {
      module: 'Transfer',
      app_reference: appReference
    }
  if (this.paymentForm.value.paymentMethod == "barclay") {
      this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
        if (resp.statusCode === 201 && resp.Status === true) {
            this.confirmTicket();
        }
      })
  }

  if (this.paymentForm.value.paymentMethod == "wallet") {
      // this.walletPayment(appReference);
      this.paymentConfirm();
  }

  this.showPaymentDetails = false;
}

confirmTicket() {
  this.form.nativeElement.submit();
  
  }

  PayLaterBooking() {
    this.paymentMode = 'pay_later'
    this.transferService.loading.next(true);
    let appReference = this.confirmDetails.BookingDetails.app_reference;
    let booking_source = this.confirmDetails.BookingSource;
    let request = {
      AppReference: appReference,
      UserType: "B2B",
      UserId: this.created_by_id ? this.created_by_id : 0,
      BookingSource: booking_source,
      payment_mode: this.paymentMode
    }
    this.apiHandlerService.apiHandler('transferConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 ) {
        this.transferService.loading.next(false);
        this.swalService.alert.success("Thank you for Booking with Booking 247.");
        this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: appReference} });
        this.swalService.alert.success("Booking Hold");
      }
      else {
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
      }
    }, (err) => {
      this.transferService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
    });
  }

  

  deductFromWallet(data) {
    this.loading = true;
    this.subSink.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.app_reference }).subscribe(res => {
        if (res) {
          this.loading = false;
            this.headerService.agentData.next(true);
            this.transferService.loading.next(false);
            this.swalService.alert.success("Thank you for Booking with Booking 247.");
            this.router.navigate(['search/transfer/transfers-voucher'], { queryParams: { AppReference: data.app_reference } });
        }
        else{
          this.loading = false;
          this.transferService.loading.next(false);
          this.swalService.alert.oops("Unable to deduct balance");
        }
    }, (err => {
      this.loading = false;
       this.transferService.loading.next(false);
        this.swalService.alert.oops(err.error.Message)
    }));
}
  onPaymentSelect(event) {
    const reqObj = {
        module: 'Transfer',
        app_reference: this.confirmDetails.BookingDetails.app_reference
    }
    this.apiHandlerService.apiHandler('getPaymentCharges', 'POST', '', '', reqObj).subscribe((resp) => {
      this.convienienceFee = resp.data.ConvenienceFee;
      this.grandTotalPrice = resp.data.TotalFare;

    })
  }

  onSelectWallet($event) {
    this.convienienceFee = '';
    this.grandTotalPrice = this.totalPriceFromAPI;
  }

  removePaymentGateWay() {
    const obj = {
      app_reference: this.confirmDetails.BookingDetails.app_reference,
      module: "Transfer"
    };

    this.apiHandlerService.apiHandler('removePaymentCharges', 'POST','','', obj).subscribe((response) => {

    })
  }

          getImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }


}
