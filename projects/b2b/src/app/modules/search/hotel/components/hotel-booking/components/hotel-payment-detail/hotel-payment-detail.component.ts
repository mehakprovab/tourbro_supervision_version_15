import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../../../environments/environment';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { HeaderService } from '../../../../../../../shared/components/header/header.service';
import { HotelService } from '../../../../hotel.service';
import { HotelPaymentConfirmationComponent } from '../hotel-payment-confirmation/hotel-payment-confirmation.component';

const b2b_url = `${environment.B2B_URL}/b2b`
export interface DialogData {
    appReference,
    paymentType,
    merchantInvoiceNumber: "Inv002"
}

let $: any
@Component({
    selector: 'app-hotel-payment-detail',
    templateUrl: './hotel-payment-detail.component.html',
    styleUrls: ['./hotel-payment-detail.component.scss']
})
export class HotelPaymentDetailComponent implements OnInit, OnDestroy {

    @ViewChild('form', { static: false }) form: ElementRef;
    private subSink = new SubSink();
    roomCount: any;
    room: any;
    paxDetails: any;
    hotel: any
    pax: any;
    nights: any;
    totalFare: any = 0;
    data: any;
    adultCount: any = 0;
    childCount: any = 0;
    currentUser: any;
    paymentForm: FormGroup;
    submitted: boolean;
    appReference: string = "";
    srcUrl: string = "";
    showPaymentModal: boolean = false;
    booking_source: string = '';
    confirmedData: any;
    showConfirmTicket: boolean = true;
    showPaymentDetails: boolean = false;
    showPayLater: boolean = false;
    paymentGateways: any;
    loadingTemplate: any;
    loading:boolean=false;
    primaryColour: any;
    secondaryColour: any;
    adult = 0;
    child = 0;
    paymentMode:any;
    hotelData:any;
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
    checkWalletOption: boolean = false;
    remarksData: any;
    showFullRemarks: boolean = false;
    maxLength = 200;
    loggedinUser: any;
    totalPriceHotel: any;
    showConvenienceFee: boolean = false
    constructor(
        private hotelService: HotelService,
        private util: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private swalService: SwalService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private headerService: HeaderService
    ) { }

    ngOnInit() {
        this.loggedinUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.route.queryParams.subscribe(params => {
            this.booking_source = params['source'];
            this.appReference = (params.appReference).replace("/", "")
            this.hotelService.HotelConfirmDetail.next(params);
            localStorage.setItem("HotelConfirmDetail",JSON.stringify(params));
        })
         this.loading = true;
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source: this.booking_source
        }).subscribe(data => {
            if (data.statusCode == 201 || data.statusCode == 200) {
                this.loading = false;
                this.hotelData = data.data;
                this.room = data.data.BookingItineraryDetails;
                this.hotel = data.data.BookingDetails;
                if(this.booking_source !== 'TLAPNO00003'){ 
                    this.remarksData = this.hotel.remarks;
                }
                if(this.booking_source == 'TLAPNO00003' && this.hotel.CancellationPolicy.$t.length){
                    const minDate = this.hotel.CancellationPolicy.$t
      .map(data => new Date(data.date_from))
      .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest one

    if (minDate) {
      minDate.setDate(minDate.getDate() - 1); // Subtract 1 day
      this.updatedDateFrom = minDate.toISOString().split('T')[0];
      console.log("this.updatedDateFrom", this.updatedDateFrom);
    }
                    // const dateFrom = new Date(this.hotel.CancellationPolicy.$t[0].date_from); // Convert to Date object
                    // dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
                    // this.updatedDateFrom = dateFrom.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
                }
               if(this.booking_source !== 'TLAPNO00003'){
                this.hotel.CancellationReason.searchRequest.RoomGuests.forEach(item => {
                    console.log("item",item)
                    this.adult += item.NoOfAdults;
                    this.child += item.NoOfChild;
                });
            }else{
                this.hotel.CancellationReason.hotelBody.searchRequest.RoomGuests.forEach(item => {
                    console.log("item",item)
                    this.adult += item.NoOfAdults;
                    this.child += item.NoOfChild;
                });
            }
          
                this.paxDetails = data.data.BookingPaxDetails;
                console.log(this.paxDetails);
                this.pax = this.paxDetails.length;
                this.roomCount = this.room.length;
                 this.totalFare = this.room[0].RoomPrice;
                // this.room.forEach(element => {
                //     this.totalFare += element.TotalFare;
                // });
                this.paxDetails.forEach((element, i, arr) => {
                    if (i != arr.length) {
                        if (element.PaxType == 'Adult') {
                            this.adultCount += 1;
                        } else if (element.PaxType == 'Child') {
                            this.childCount += 1;
                        }
                    }
                });
                this.nights = this.util.noOfNights(this.hotel.HotelCheckIn, this.hotel.HotelCheckOut);

            }
        })
        this.createPaymentForm()

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

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    proceedPayment(appReference) {
        this.getPaymentGateWays();
        this.showPaymentDetails = true;
    }
    payLater() {
     this.showPayLater = false;
     this.paymentMode = 'pay_later'
     this.reservation()
    }

    payLaterShow(){
        this.showPayLater = true;
    }

    
    getPayNow(data) {
        this.payReference = data.AppReference
        this.getPaymentGateWays();
        this.intitiatePayment(data);
        // this.showPaymentDetails = true;
    }

    
    isSameRoomGuests(roomGuests: any[]): boolean {
        if (!roomGuests || roomGuests.length === 0) return false;
        return roomGuests.every(guest => 
            guest.NoOfAdults === roomGuests[0].NoOfAdults && 
            guest.NoOfChild === roomGuests[0].NoOfChild
        );
    }

    intitiatePayment(data){
        let date = (new Date().getTime()).toString();
        this.currentUser = this.util.getStorage('currentUser');
        const order_id = `${date.substring(10)}${date.substring(0, 7)}${date.substring(7)}`;
        let payload = {
            app_reference: this.payReference,
            order_id: order_id,
            payment_type: "Barclay",
            merchantInvoiceNumber: "Inv002",
            source: "hotel",
            name: this.paxDetails[0].FirstName + ' ' + this.paxDetails[0].LastName,
            phone: data.PhoneNumber,
            userId: this.currentUser.id ? this.currentUser.id : 0,
            email: data.Email
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
        console.log("appReference",appReference)
        this.submitted = true;
        const obj = {
            module: 'Hotel',
            app_reference: appReference
        }
       
        if (!this.hotelService.isDevelopment) {
            if (!this.paymentForm.valid)
                return;
        }
        if (this.paymentForm.value.paymentMethod == "barclay") {
            this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
                if (resp.statusCode === 201 && resp.Status === true) {
                    this.confirmTicket();
                }
            })
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
            this.reservation();
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

    confirmTicket() {
        this.form.nativeElement.submit();
       
        }

    confimationBooking(appReference) {
        this.hotelService.loading.next(true);
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: appReference,
            booking_source: 'ZBAPINO00008'
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                console.log(resp)
                this.currentUser = this.util.getStorage('currentUser');
                let totalFare: any = 0;
                // resp.data["BookingItineraryDetails"].forEach(itinerary => {
                totalFare += resp.data["BookingItineraryDetails"][0].RoomPrice;
                // });
                let balance = String(this.currentUser.agent_balance - totalFare);
                this.subSink.sink = this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
                    id: this.currentUser.id,
                    agent_balance: balance
                }).subscribe(res => {
                    if (resp.statusCode == 201) {
                        this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                            id: this.currentUser.id
                        }).subscribe(data => {
                            // res['data']['access_token'] = this.currentUser.access_token || '';
                            sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
                        });
                    }
                })
                this.hotelService.hotelConfirmationData.next(resp.data);
                this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: appReference } });
            } else {
                this.swalService.alert.oops(resp.Message);
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 100);
            }
        }, err => {
            console.error(err);
        })
        this.hotelService.loading.next(false);
    }

    // getCancelationPolicy(cancellationPolicy) {
    //     const penalty = this.hotelService.getCancelationPolicy(cancellationPolicy, this.hotel.Currency);
    //     return penalty;
    // }

    getHotelPhoto(imgArrStr) {
        console.log(imgArrStr)
        if (imgArrStr != null) {
            let imgArray = JSON.parse(imgArrStr.replace(/'/gi, "\""));
            console.log(imgArray[0])
            return imgArray;
        } else {
            return '';
        }
    }

    bKashPayment(appReference) {
        let invoiceNumber= this.hotelService.setHotelInvoiceNumber(appReference);
        this.subSink.sink = this.apiHandlerService.apiHandler('completeBooking', 'post', {}, {}, {
            app_reference: appReference,
            payment_type: "bKash",
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
            }
        })
    }

    nagadPayment() {
        this.hotelService.loading.next(true);
        let invoiceNumber= this.hotelService.setHotelInvoiceNumber(this.appReference);
        let date = (new Date().getTime()).toString();
        this.subSink.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: this.appReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: "nagad",
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                console.log(resp);
                this.hotelService.loading.next(false);
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment() {
        let invoiceNumber= this.hotelService.setHotelInvoiceNumber(this.appReference);
        let date = (new Date().getTime()).toString();
        this.subSink.sink = this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: this.appReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    walletPayment(appReference,payments?) {
        this.loading=true;
        this.subSink.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
            .subscribe(res => {
                // if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare < res.data[0].userWalletBalance) {
                        this.checkWalletOption = res.data[0].status;
                        this.loading=false;
                        this.showPaymentDetails = true
                        this.paymentGateways = payments;
                      
                        // this.swalService.alert.oops("Your wallet balance is not sufficient.")
                    } else {
                        // this.reservation();
                    }
                // }
            }, (err) => {
                this.loading=false;
                this.paymentGateways = [payments[0]];
                this.showPaymentDetails = true
                // this.swalService.alert.oops("Your wallet balance is not sufficient.")
            });
    }

 payNowWallet() {
    this.getPaymentGateWays();
 }

 reservation() {
    this.loading = true;
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source:this.booking_source,
            payment_mode:this.paymentMode
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.loading = false;
                if(this.paymentMode === 'pay_later'){
                    this.swalService.alert.success("Thank you for Booking with Booking 247.");
                    this.hotelService.hotelConfirmationData.next(resp.data);
                    this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source, orderId: 'pay_later' } });
                } else {   
                this.updateSubAgent(resp);
                this.deductFromWallet(this.appReference);
                this.hotelService.hotelConfirmationData.next(resp.data);
                }
            } else {
                this.swalService.alert.error("Room not available to book. Please try booking with other room.");
                setTimeout(() => {
                    this.loading=false;
                    this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: this.appReference } });
                }, 100);
            }
        }, err => {
            this.swalService.alert.error("Room not available to book. Please try booking with other room");
            this.loading=false
            console.error(err);
        })
    }

    deductFromWallet(appReference) {
        this.subSink.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
            if (res) {
                if (res.data[2].order_id) {
                    this.swalService.alert.success("Your transaction successful.")
                    this.headerService.agentData.next(true);
                    this.loading=false;
                    this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: appReference, source: this.booking_source, orderId: res.data[2].order_id } });
                }
            }

        }, (err) => {
            this.loading=false;
            this.swalService.alert.oops("Your wallet balance is not sufficient.");
        });
    }

    updateSubAgent(resp) {
        this.currentUser = this.util.getStorage('currentUser');
        let totalFare: any = 0;
        resp.data["BookingItineraryDetails"].forEach(itinerary => {
        totalFare += itinerary.RoomPrice;
        });
        let balance = String(this.currentUser.agent_balance - totalFare);
        this.subSink.sink = this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
            id: this.currentUser.id,
            agent_balance: balance
        }).subscribe(res => {
            if (resp.statusCode == 201) {
                this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                    id: this.currentUser.id
                }).subscribe(data => {
                    // res['data']['access_token'] = this.currentUser.access_token;
                    sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
                });
            }
        })
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
            appReference: this.appReference,
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
            user_id: this.loggedinUser.id
        }
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.walletPayment(this.appReference,res.data)
                    // this.paymentGateways = res.data;
                    // this.showPaymentDetails = true;
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

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
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
    ngOnDestroy() {
        this.subSink.unsubscribe();
    }

    toggleRemarks() {
        this.showFullRemarks = !this.showFullRemarks;
      }
      
      getShortText(text: string, showFull: boolean): string {
        if (!text) return '';
        return showFull || text.length <= this.maxLength
          ? text
          : text.substring(0, this.maxLength) + '...';
      }
      
      isTextTruncated(text: string): boolean {
        return text && text.length > this.maxLength;
      }

      getRepeatArray(count: number): number[] {
  return Array(count).fill(0).map((_, i) => i);
}

getRoomStartIndex(index: number): number {
  let count = 0;
  for (let i = 0; i < index; i++) {
    count += this.hotel.CancellationReason.RoomDetails[i].room_count;
  }
  return count;
}

onPaymentMethodChange(event) {
    const reqObj = {
        module: 'Hotel',
        app_reference: this.appReference
    }
    this.apiHandlerService.apiHandler('getPaymentCharges', 'POST', '', '', reqObj).subscribe((resp) => {
        if(resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201) ) {
            const convenienceFee = resp.data.ConvenienceFee;
            this.showConvenienceFee = true
            this.totalPriceHotel = convenienceFee;
        }
    })
}
}
