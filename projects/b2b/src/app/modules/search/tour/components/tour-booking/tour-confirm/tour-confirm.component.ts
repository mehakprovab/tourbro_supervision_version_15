import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from '../../../tour.service';
import { SubSink } from 'subsink';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { HotelPaymentConfirmationComponent } from '../../../../hotel/components/hotel-booking/components/hotel-payment-confirmation/hotel-payment-confirmation.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const baseUrl = environment.SA_URL;

const b2b_url = `${environment.B2B_URL}/b2b`
let $: any
@Component({
  selector: 'app-tour-confirm',
  templateUrl: './tour-confirm.component.html',
  styleUrls: ['./tour-confirm.component.scss']
})
export class TourConfirmComponent implements OnInit {

   @ViewChild('form', { static: false }) form: ElementRef;

  bannerImageUrl = `${baseUrl}/sa/tour/tours/getBannerImage/`;
  tourPaxData: any;
  tourData: any;
  adultPrice: any;
  childPrice: number;
  tourValuation: any;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  loading: boolean;
  subSunk = new SubSink();
  public getUserDetails: any[] = [];
  attributes: any;
  priceBreakDownData: any;
showMandatoty: boolean = false;
checkWalletOption: boolean = false;
getUserData: any;

showConfirm: boolean = false;
showPayLater: boolean = false;
 subjectName: string;


paymentData: any;
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

    public showPaymentDetails: boolean = false;
    public paymentGateways: boolean = false;
    paymentForm: FormGroup;
    paymentMode: any;
    public totalDispalyFare: any;
  constructor(
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private util: UtilityService,
    private tourService: TourService,
    private swalService: SwalService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.paymentForm = this.fb.group({
              paymentMethod: ['']
          });
      // const priceBreakDownData = sessionStorage.getItem('tourPriceBreakDown');
      this.getUserData = JSON.parse(sessionStorage.getItem('currentUser'));
      // this.priceBreakDownData = JSON.parse(priceBreakDownData);
    const storedState = sessionStorage.getItem('tourBookingInfo');
    if (storedState) {
      this.tourService.blockedTourData.next(JSON.parse(storedState));
    }
    this.getUserDetails = JSON.parse(sessionStorage.getItem('b2cUser'));
    const tourPax = sessionStorage.getItem('tourPaxData')
    if (tourPax) {
      this.tourService.addTourBookingPaxDetails.next(JSON.parse(tourPax));
    }
    this.subSunk.sink = this.tourService.loading.subscribe(res => {
      this.loading = res;
    });
    this.tourService.blockedTourData.subscribe(res => {
      this.tourData = res;
      this.adultPrice = this.tourData.tourPrice[0].adult_airliner_price;
      this.childPrice = parseFloat(this.tourData.tourPrice[0].child_airliner_price);
    });
    this.tourService.addTourBookingPaxDetails.subscribe(res => {
      this.tourPaxData = res[0];
      this.totalDispalyFare = this.tourPaxData.bookingDetails[0].Total_Fare;
      this.priceBreakDownData = this.tourPaxData.bookingDetails[0].accommodations;
      this.attributes = JSON.parse(this.tourPaxData.passengerDetails[0].attribute);
    });
    this.cdRef.detectChanges();
  this.removePaymentGateWay();
  }

  convienienceFee: number = 0;
  convienienceFeeAdd: number = 0;

  onPaymentMethodChange(event) {
    const reqObj = {
        module: 'Tour',
        app_reference: this.tourPaxData.bookingDetails[0].AppReference
    }
    this.apiHandlerService.apiHandler('getPaymentCharges', 'POST', '', '', reqObj).subscribe((resp) => {
        if(resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201) ) {
            // const convenienceFee = resp.data.ConvenienceFee;
            this.convienienceFeeAdd  = this.convienienceFee;
            this.totalDispalyFare = resp.data.TotalFare;
            // this.showConvenienceFee = true
            // this.totalPriceHotel = convenienceFee;
        }
    })
}

onPaymentMethodChangeWallet(event) {
  this.removePaymentGateWay();
  this.convienienceFee  = 0;
  this.convienienceFeeAdd = 0;
  this.totalDispalyFare = this.tourPaxData.tourPrice[0].adult_airliner_price ;
}

payNow(data) {
  this.tourService.loading.next(true);
  let appReference = this.tourPaxData.bookingDetails[0].AppReference;
  this.getPaymentGateWays();
 
}

  confirmPayment(data) {
    // this.tourService.loading.next(true);
    // let appReference = this.tourPaxData.bookingDetails[0].AppReference;
    // this.walletPayment(appReference);
    // this.getPaymentGateWays();
  }

    intitiatePayment(data){
        let date = (new Date().getTime()).toString();
        const order_id = `${date.substring(10)}${date.substring(0, 7)}${date.substring(7)}`;
        let payload = {
            app_reference: data.bookingDetails[0].AppReference,
            order_id: order_id,
            payment_type: "Barclay",
            merchantInvoiceNumber: "Inv002",
            source: "tour",
            name: data.passengerDetails[0].FirstName + ' ' + data.passengerDetails[0].LastName,
            phone: data.passengerDetails[0].Contact,
            userId: this.getUserData.id ? this.getUserData.id : 0,
            email: data.passengerDetails[0].Email
        }
        this.apiHandlerService.apiHandler('initiatePayment', 'post', '', '', payload).subscribe(res => {
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

  holdBooking(data) {
// data.bookingDetails[0].AppReference,
this.paymentMode = 'pay_later';
this.removePaymentGateWay();
    this.confirmBooking()
  }

  confirmBooking() {
    this.tourService.loading.next(true);
    let request = {
      AppReference: this.tourPaxData.bookingDetails[0].AppReference,
      UserType: "B2B",
      UserId: this.getUserDetails['id'],
      booking_source: this.tourData.BookingSource,
      payment_mode: this.paymentMode
    }
    this.apiHandlerService.apiHandler('tourConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.tourService.loading.next(false);
        const data = {
          app_reference: this.tourPaxData.bookingDetails[0].AppReference
        }
        if (this.paymentMode === 'pay_later') {
          this.router.navigate(['/search/tour/tour-voucher'], {
          queryParams: {
            AppReference: this.tourPaxData.bookingDetails[0].AppReference,
            // orderId: this.finalData.orderId
          },
        });
        }
        if (this.paymentMode !== 'pay_later') {
          this.deductFromWallet(data);
        }
   
      }
      else {
        this.tourService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking. Please Check another Booking.");

      }
    }, (err) => {
      this.tourService.loading.next(false);
      this.swalService.alert.oops("Unable to Confirm Booking. Please Check another Booking.");

    });
  }


  walletPayment(data,payments?) {
    this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data })
      .subscribe(res => {
        if (res && res.data[0].ticketFare) {
          if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
            // this.swalService.alert.oops("Your wallet balance is not sufficient.")
            this.showPaymentDetails = true
            this.checkWalletOption = false;
            this.paymentGateways = payments;
            // this.router.navigate(['/']);
          } else {
            this.paymentMode = 'wallet';
            this.checkWalletOption = true;
          }
        }
      }, (err) => {
        this.showPaymentDetails = true
        this.paymentGateways = payments;
        // this.swalService.alert.oops(err.error.Message);
        this.loading = false
        // this.router.navigate(['/']);
      });
  }

  deductFromWallet(data) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.app_reference }).subscribe(res => {
      if (res) {
        this.headerService.agentData.next(true);
        this.tourService.loading.next(false);
        this.router.navigate(['/search/tour/tour-voucher'], {
          queryParams: {
            AppReference: this.tourPaxData.bookingDetails[0].AppReference,
            // orderId: this.finalData.orderId
          },
        });
      }
    }, (err => {
      this.swalService.alert.oops(err.error.Message)
    }));
  }

  getTourEndDate() {
    const startDate = this.tourPaxData.bookingDetails[0].from_date
    const daysCount = parseInt(this.tourData.duration, 10);
    return moment(startDate).add(daysCount-1, 'days').format('DD-MM-YYYY');
  }

  getPriceDown(data){
    let priceData;
    if(data.type === 'Adult') {
      priceData = `${data.travellercount} Adult x ${data.value}`
    } else if(data.type === 'Child') {
      priceData = `${data.travellercount} Child x ${data.value}`
    } else {
      priceData = `${data.travellercount} Traveler x ${data.value}`
    }
    return priceData;
  }

   getMandatoryLocal(data) {
    if (data) { 
        data.forEach((res) => {
        if (res.payment_type === 'local') {
          this.showMandatoty = true;
        }
      })
      return this.showMandatoty;
    }

 }

getMandatoryPrice(data) {
  if (data) {
      return data.reduce((sum, item) => {
    return sum + item.prices.reduce((priceSum, price) => priceSum + price.value, 0);
  }, 0);  
  }

}

getCancPolicies(data) {
  if (data) {
    return JSON.parse(data);
  }
}

getCancellations(data) {
  if(data) {
    return data.split('</br>')
  }
}

   hide() {
        this.showConfirm = false;
        this.showPayLater = false;
    }


    public openDialog(paymentType) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'dialog-container';
            if (paymentType == "nagad") {
                dialogConfig.width = '850px';
                dialogConfig.height = '250px';
            }
            if (paymentType == 'bKash') {
                dialogConfig.width = '100vw';
                dialogConfig.height = '100vw';
                dialogConfig.maxWidth = '100vw';
                dialogConfig.position = {
                    top: '30px',
                    left: '80px'
                }
            }
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = false;
            dialogConfig.data = {
                appReference: this.tourPaxData.bookingDetails[0].AppReference,
                paymentType: paymentType,
                merchantInvoiceNumber: "Inv002"
            };
            this.dialog
                .open(HotelPaymentConfirmationComponent, dialogConfig)
                .afterClosed().subscribe(result => {
                    console.log(result)
                })
        }
    
        getPaymentGateWays() {
            this.loading=true;
            let obj = {
                user_id: this.getUserData.id
            }
            this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
                if (res && ([200, 201].includes(res.statusCode))) {
                    if (res.data && res.data.length > 0) {
                        this.walletPayment(this.tourPaxData.bookingDetails[0].AppReference,res.data)
                        this.paymentGateways = res.data;
                        const obj = {
                            module: 'Tour',
                            app_reference: this.tourPaxData.bookingDetails[0].AppReference
                        }
                        this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
                            if (resp.statusCode === 201 && resp.Status === true) {
                                // this.confirmTicket();
                                this.convienienceFee  = resp.data.ConvenienceFee;
                            }
                             this.intitiatePayment(this.tourPaxData);
                        })
                        this.showPaymentDetails = true;
                    }
                    else {
                        this.swalService.alert.oops('No payment gateway enabled.');
                        this.showPaymentDetails = false;
                        this.loading=false;
                    }
                }
                else {
                    this.swalService.alert.oops('Some thing went wrong');
                    this.showPaymentDetails = false;
                    this.loading=false;
                }
            }, (err) => {
                if (err && err.err && err.error.msg) {
                    this.swalService.alert.oops(err.error.msg);
                    this.showPaymentDetails = false;
                    this.loading=false;
                }
            });
        }


         nagadPayment() {
        this.tourService.loading.next(true);
        let invoiceNumber= this.tourService.setHotelInvoiceNumber(this.tourPaxData.bookingDetails[0].AppReference);
        let date = (new Date().getTime()).toString();
         this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: this.tourPaxData.bookingDetails[0].AppReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: "nagad",
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                console.log(resp);
                this.tourService.loading.next(false);
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment() {
        let invoiceNumber= this.tourService.setHotelInvoiceNumber(this.tourPaxData.bookingDetails[0].AppReference);
        let date = (new Date().getTime()).toString();
         this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: this.tourPaxData.bookingDetails[0].AppReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }
    confirmTicket() {
        this.form.nativeElement.submit();
       
        }


      onBooking(appReference) {
        console.log("appReference",appReference)
        const obj = {
            module: 'Tour',
            app_reference: appReference
        }
       
        if (!this.tourService.isDevelopment) {
            if (!this.paymentForm.valid)
                return;
        }
        if (this.paymentForm.value.paymentMethod == "barclay") {
            // this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
            //     if (resp.statusCode === 201 && resp.Status === true) {
                    this.confirmTicket();
            //     }
            // })
        }
        if (this.paymentForm.value.paymentMethod == "nagad") {
             this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
            if (resp.statusCode === 201 && resp.Status === true) {
                this.nagadPayment()
            }
        })
        }
        if (this.paymentForm.value.paymentMethod == "bKash") {
             this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
            if (resp.statusCode === 201 && resp.Status === true) {
                 window.location.href = `${b2b_url}/paymentGateway/${appReference}`
            }
        })        
        }
        if (this.paymentForm.value.paymentMethod == "wallet") {
            // this.walletPayment(appReference);
            this.paymentMode = "pay_now";
            this.confirmBooking();
        }

        if (this.paymentForm.value.paymentMethod == "sslCommerz") {
             this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
            if (resp.statusCode === 201 && resp.Status === true) {
                 this.sslCommerzPayment()
            }
        })
           
        }
        this.showPaymentDetails = false;
    }

    payLater() {}

    getChildAges(data) {
      if (data) {
        return data.map(age => Math.ceil(age.age)).join(' Yrs, ') + ' Yrs';
      }
    }

    getOptionalTourData(data) {
      if(data) {
        return JSON.parse(data);
      }
    }

    getToursPrices(price, pax) {
  if(price&& pax) {
    const currency = this.tourData.tourPrice[0].Currency;
    const prices = (price * pax).toFixed(2);
    return `${currency} ${prices}`
  }
}

removePaymentGateWay() {
    const obj = {
      app_reference: this.tourPaxData.bookingDetails[0].AppReference,
      module: "Tour"
    };

    this.apiHandlerService.apiHandler('removePaymentCharges', 'POST','','', obj).subscribe((response) => {

    })
  }

    getPrices(quantity, price) {
    if(quantity && price) {
      return Number(quantity)*Number(price)
    }
  }

  getPhoneCodes(data) {
    if(data) {
      const includesPlus = data.includes('+');
      if(includesPlus) {
        return data;
      } else {
        return `+${data}`
      }
    }
  }
}
