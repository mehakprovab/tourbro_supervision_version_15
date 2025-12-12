import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesService } from '../../activities.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { SubSink } from 'subsink';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-activity-confirm',
  templateUrl: './activity-confirm.component.html',
  styleUrls: ['./activity-confirm.component.scss']
})
export class ActivityConfirmComponent implements OnInit {

  @ViewChild('form', { static: false }) form: ElementRef;
  @Input() noOfTravellers:any;
  private subSink = new SubSink();
  confirmDetails: any = [];
  bookingDetails: any = [];
  created_by_id: string;
  showLoader: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  bookingData:any;

  paymentMode:any;
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
  noOfTraveller: any;
  wallet:boolean=true;
  showPayLater: boolean = false;
  loggedInuser: any;
  public showDeductFromWallet: boolean = false;
  grandTotalPrice: any;
  convienienceFee: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivitiesService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdRef: ChangeDetectorRef,
    private headerService: HeaderService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.currentUser = this.utility.getStorage('currentUser');
    this.loggedInuser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.created_by_id = this.utility.readStorage('b2cUser', sessionStorage)['id'];
    this.setpaxDetails();
    this.createPaymentForm();
    this.setConfirmDetails();
    this.activityService.setPromoCode();
    this.activityService.loading.subscribe(res => {
      this.showLoader = res;
      this.cdRef.detectChanges();
    });
  }

  setConfirmDetails() {
    this.activityService.paxDetails.subscribe(res => {
      this.confirmDetails = res;
      this.bookingData = this.confirmDetails.BookingDetails.attributes;
      console.log("bookingData",this.bookingData)

      this.noOfTraveller = this.bookingData.body.paxes[0].adultCount + this.bookingData.body.paxes[0].childCount;
      // let paxDetails = this.confirmDetails.BookingPaxDetails;
      this.bookingDetails = {...(this.bookingData)};
      this.grandTotalPrice = this.bookingDetails.ItenaryData.totalAmount;
      const req = {
        appRef: this.bookingDetails.ItenaryData.app_reference,
        booking_source: this.bookingDetails.body.booking_source

      }
      this.activityService.activityConfirmDetail.next(req);
      localStorage.setItem("ActivityConfirmDetail",JSON.stringify(req));
      console.log("this.bookingDetails",this.bookingDetails)
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
           let obj = {
            user_id: this.loggedInuser.id
        }
  this.showLoader = true;
  this.showPaymentDetails = false;
  this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
      if (res && ([200, 201].includes(res.statusCode))) {
          if (res.data && res.data.length > 0) {
            if(res.data[1].remarks == 'Wallet'){
              this.walletPayment(this.confirmDetails.BookingDetails.app_reference,res.data)
            }
          
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
  console.log("dtaa",data)
    this.payReference = data.ItenaryData.app_reference
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
        source: "activity",
        name: data.ItenaryData.attributes.AddressDetails.FirstName + ' ' + data.ItenaryData.attributes.AddressDetails.LastName,
        phone: data.ItenaryData.attributes.AddressDetails.Contact,
        userId: this.currentUser.id ? this.currentUser.id : 0,
        email: data.ItenaryData.attributes.AddressDetails.Email
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
  if (!this.activityService.isDevelopment) {
      if (!this.paymentForm.valid)
          return;
  }
  const obj = {
    module: 'Activity',
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
      this.paymentConfirm('wallet');
  }

  this.showPaymentDetails = false;
}

confirmTicket() {
  this.form.nativeElement.submit();
  
  }

  setpaxDetails() {
    const storedState = localStorage.getItem('paxDetails');
    if (storedState) {
      this.activityService.paxDetails.next(JSON.parse(storedState));
    }
  }
  confirmBooking() {
    this.activityService.loading.next(true);
    let appReference = this.confirmDetails.BookingDetails.app_reference;
    this.walletPayment(appReference);
    
  }
  walletPayment(data,payemnt?) {
    this.showLoader = true;
    this.showPaymentDetails = false;
    this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data })
        .subscribe(res => {
            if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare < res.data[0].userWalletBalance) {
                  this.showLoader = false;
                    this.paymentGateways = payemnt;
                    this.showDeductFromWallet = true;
                    this.showPaymentDetails = true;
                 } else {
                    this.showDeductFromWallet = false;
                 }
            }
        }, (err) => {
          console.log("payemnt",payemnt)
          this.showLoader = false;
          this.paymentGateways = [payemnt[0]];
          this.showPaymentDetails = true;
            // this.swalService.alert.oops(err.error.Message)
            // this.router.navigate(['/']);
        });
    }
    paymentConfirm(mode){
      let appReference = this.confirmDetails.BookingDetails.app_reference;
      let booking_source = this.confirmDetails.BookingSource;
      let request = {
        AppReference: appReference,
        UserType: "B2B",
        UserId: this.currentUser.id ? this.currentUser.id : 0,
        BookingSource: booking_source,
        payment_mode: mode ? mode: 'pay_later'
      }
      this.apiHandlerService.apiHandler('activityConfirm', 'post', '', '', request).subscribe(response => {
        if (response.statusCode == 200 && response.data) {
          this.deductFromWallet(response.data[0]);
        }
        else {
          this.activityService.loading.next(false);
          this.swalService.alert.oops("Unable to Confirm Booking");
        }
      }, (err) => {
        this.activityService.loading.next(false);
        this.swalService.alert.oops(err.error.Message);
      });
    }
    deductFromWallet(data) {
      console.log("data",data)
      this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.app_reference }).subscribe(res => {
          if (res) {
              this.headerService.agentData.next(true);
              this.activityService.loading.next(false);
              this.swalService.alert.success("Thank you for Booking with Booking 247.");
              this.router.navigate(['search/activity/activity-voucher'], { queryParams: { AppReference: data.app_reference } });
          }
      }, (err => {
          this.swalService.alert.oops(err.error.Message)
      }));
  }

  payLaterShow(){
    this.showPayLater = true;
  }

  PayLaterBooking() {
    this.showPayLater = false;
    this.paymentMode = 'pay_later'
    this.activityService.loading.next(true);
    let appReference = this.confirmDetails.BookingDetails.app_reference;
    let booking_source = this.confirmDetails.BookingSource;
    let request = {
      AppReference: appReference,
      UserType: "B2B",
      UserId: this.currentUser.id ? this.currentUser.id : 0,
      BookingSource: booking_source,
      payment_mode: this.paymentMode
    }
    this.apiHandlerService.apiHandler('activityConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 ) {
        this.activityService.loading.next(false);
        this.swalService.alert.success("Thank you for Booking with Booking 247.");
        this.router.navigate(['search/activity/activity-voucher'], { queryParams: { AppReference: appReference} });
        this.swalService.alert.success("Booking Hold");
      }
      else {
        this.activityService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
      }
    }, (err) => {
      this.activityService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
    });
  }

  getStarArray(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = Math.round(num);
    return starArr;
  }

  getStarArrayRemaining(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = 5 - Math.round(num);
    return starArr;
  }

  onPaymentSelect(event, type) {
    if(type !== 'wallet'){
        const reqObj = {
          module: 'Activity',
          app_reference: this.bookingDetails.ItenaryData.app_reference
      }
      this.apiHandlerService.apiHandler('getPaymentCharges', 'POST', '', '', reqObj).subscribe((resp) => {
        this.convienienceFee = resp.data.ConvenienceFee;
        this.grandTotalPrice = resp.data.TotalFare;
      })
    } else {
      this.convienienceFee ='';
      this.grandTotalPrice = this.bookingDetails.ItenaryData.totalAmount;
    }
    
  }




  
}
