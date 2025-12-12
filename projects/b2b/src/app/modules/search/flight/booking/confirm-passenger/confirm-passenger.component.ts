import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../../flight.service';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { AlertService } from '../../../../../core/services/alert.service';
import { SubSink } from 'subsink';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatModalService, ModalConfigDataI } from 'projects/b2b/src/app/shared/service/mat-modal.service';
import { Subscription } from 'rxjs';
import { BaggageAlertComponent } from './modals/baggage-alert/baggage-alert.component';
import { environment } from 'projects/b2b/src/environments/environment.prod';
const b2b_url = `${environment.B2B_URL}/b2b`

@Component({
    selector: 'app-confirm-passenger',
    templateUrl: './confirm-passenger.component.html',
    styleUrls: ['./confirm-passenger.component.scss']
})
export class ConfirmPassengerComponent implements OnInit, OnDestroy {

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
    loading: boolean;
    protected subs = new SubSink();
    modalConfigData: ModalConfigDataI;
    subscription: Subscription;
    bookingSource;
    airline_logo = '';
    enable_upload:any;
    baggeData = {
        isProtected: false,
        data: { Total_Price: 0 }
    };
    passport_pax: any;
    visa_pax: any;
    flightType:any;
    enablePaymentGateway:boolean=false;
    paymentGateways: any;
    paymentForm: FormGroup;
    submitted: boolean;
    isSeatInfoNotEmpty:boolean=false;
    loggedInUser: any;

    constructor(
        private router: Router,
        private flightService: FlightService,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private utility: UtilityService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private matModalService: MatModalService,
        private cdRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.airline_logo = this.flightService.airline_logo;
        this.setValues();
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.subs.sink = this.flightService.bookingSource.subscribe(res => {
            this.bookingSource = res;
        });
        // Selected flightType
        this.subs.sink = this.flightService.flightType.subscribe(res => {
            this.flightType=res;
        });
        this.baggageForm = this.fb.group({
            baggageProtection: ['false']
        })
        this.subs.sink = this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
        this.subs.sink = this.flightService.CommitBookingResponse.subscribe(res => {
            if (res) {
                this.passengers = res.PassengerDetails;
                this.enableSeat(res);
                this.contact = res.PassengerContactDetails;
                this.flights = res;
                this.flightsFare = res;
                this.price = res.Price;
                this.attr = res.JourneyList.FlightDetails.Details;
            } else {
                this.router.navigate(['/dashboard']);
            }
        });
        // this.getBaggageValue();
        this.createPaymentForm();
        this.getPaymentGateWays();
    }

    setValues(){
        this.flightService.setBookingSourceValue();
        this.flightService.setCommitBookingResponse();
    }
    
    uploadPassportVisa(passenger) {
        if(!passenger.visaDocument && !passenger.passportDocument ){
            this.swalService.alert.oops("Kindly upload visa or passport document.");
            return;
        }
        const formData = new FormData();
        formData.append('id', passenger.PassengerId);
        if(passenger.passportDocument){
            formData.append('image', passenger.passportDocument);//Key is as per the api requirement
        }
        if(passenger.visaDocument){
            formData.append('image', passenger.visaDocument);//Key is as per the api requirement
        }
        this.apiHandlerService.apiHandler('uploadFlightDocument', 'post', {}, {}, formData).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("Documents uploaded sucessfully.");
            }
        }, err => {
            this.enable_upload = this.passport_pax;
            this.swalService.alert.oops(err.message);
        });
    }

    uploadPassport(event, passenger){
        this.passport_pax = passenger.PassengerId;
        var file = event.target.files[0];
        passenger.passportDocument=file;
    }

    uploadVisa(event, passenger){
        this.visa_pax = passenger.PassengerId;
        var file = event.target.files[0];
        passenger.visaDocument=file;
    }

    do_enable_upload(){
        if(this.visa_pax == this.passport_pax){
            this.enable_upload = this.passport_pax;
        }else{
            this.enable_upload = 0;  
        }
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
            this.swalService.alert.oops();
        });
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'kg' || bg[1] == 'Kg' || bg[1] == 'KGS' || bg[1] == 'Kgs') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    onFinalBooking() {
        this.flightService.loading.next(true);
        if (this.flightService.isDevelopment) {
            setTimeout(_ => {
                this.flightService.loading.next(false);
                this.router.navigate(['/search/flight/booking-confirm']);
            }, 3000);
        } else {
            if (this.baggageProtected) {
                this.submitBaggageCharge();
            }
            const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['user_id'];
            const req: any = {
                created_by_id,
                ResultToken: this.flightService.CommitBookingResponse.value.ResultToken,
                booking_source: this.flights.booking_source,
                AppReference: this.flightService.CommitBookingResponse.value.AppReference
            }
            if (1) {
            // if (this.flights.booking_source === 'ZBAPINO00002' || this.flights.booking_source === 'ZBAPINO00003') {
                req.UserType = 'B2B';
                req.UserId = created_by_id;
            }

            this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: this.flightService.CommitBookingResponse.value.AppReference })
            .subscribe(res => {
                this.flightService.loading.next(false);
                    if (res && res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.swalService.alert.oops("Your wallet balance is not sufficient.");
                    } else {
                        this.subs.sink = this.apiHandlerService.apiHandler('finalBooking', 'POST', '', '', req).subscribe(res => {
                            this.flightService.loading.next(false);
                            if (res.Status && res.data.hasOwnProperty('FinalBooking')) {
                                // const BookingDetails = this.flightService.changeCurrencyFinalBooking(res.data.FinalBooking.BookingDetails);
                                this.flightService.FinalBookingResponse.next(res.data.FinalBooking.BookingDetails);
                                this.router.navigate(['/search/flight/booking-confirm'], {
                                    queryParams: {
                                        AppReference: this.flightService.CommitBookingResponse.value.AppReference,
                                        ReservationResultIndex: res.data.ReservationResultIndex
                                    }
                                });
                                this.flightService.bookingSource.next('');
                            } else {
                                this.swalService.alert.oops(res.Message);
                                // setTimeout(() => {
                                //     this.router.navigate(['/dashboard']);
                                // }, 100);
                            }
                            this.flightService.loading.next(false);
                        }, (err: HttpErrorResponse) => {
                            this.flightService.loading.next(false);
                            const { error } = err;
                            switch (error.statusCode) {
                                case 400:
                                    this.swalService.alert.oops(error.Message);
                                    break;
                                default:
                                    this.swalService.alert.oops(error.Message);
                                    break;
                            }
            
                        });
                    }
            }, (err: HttpErrorResponse) => {
                console.log(err)
                this.flightService.loading.next(false);
                this.swalService.alert.oopsWallet();
            })
        }
    }

    openDialog(whichComponent, data?: any) {
        this.modalConfigData.width = '600px';
        this.modalConfigData.data = data || {};
        switch (whichComponent) {
            case 1: this.modalConfigData.component = BaggageAlertComponent;
                break;
        }
        this.matModalService.openDialog(this.modalConfigData);
        this.getData();
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

            } else {
                this.swalService.alert.oops('Something went wrong please try again.!');
            }
        }, err => {
            this.swalService.alert.oops('Something went wrong please try again.!');
        });
    }

    updateBaggage(val) {
        let baggageData = {
            booking_source: this.bookingSource,
            app_reference: this.flightService.CommitBookingResponse.value.AppReference,
            baggagePrice: this.baggagelist.ProductPrice
        }

        if (val) {
            this.subs.sink = this.apiHandlerService.apiHandler('updateLostBaggageProtectionPrice', 'post', {}, {}, baggageData).subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201)) {
                    this.baggageProtected = true;
                    // this.price = resp.data.Price;
                    const obj = Object.assign({}, this.flightsFare, resp.data)
                    this.flightsFare = obj;
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
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    proceedToConfirm(){
        this.enablePaymentGateway=true;
    }
   
    closePaymentModel(){
        this.enablePaymentGateway=false;
    }

    getPaymentGateWays() {
                 let obj = {
            user_id: this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways = res.data;
                }
                else {
                    this.swalService.alert.oops('No payment gateway enabled.');
                }
            }
            else {
                this.swalService.alert.oops('Some thing went wrong');
            }
        }, (err) => {
            if (err && err.err && err.error.msg) {
                this.swalService.alert.oops(err.error.msg);
            }
        });
    }

    paymentConfirm() {
        this.submitted = true;
        this.loading = true;
        if (!this.paymentForm.valid){
            this.loading = false; // Added since UI was blocked with the loader if clicked on confirm without selecting the payment gateway
            return;
        }
            let data  = this.flights;
            if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
                switch (this.paymentForm.value.paymentMethod) {
                    case 'nagad':
                        data['paymentType'] = 'nagad';
                        this.nagadPayment(data);
                        break;
                    case 'bKash':
                        let srcUrl = `${b2b_url}/paymentGateway/${data.AppReference}?source=reports`
                        window.location.replace(srcUrl);
                        break;
                    case 'wallet':
                        this.walletPayment(data);
                        break;
                    case 'sslCommerz':
                        data['paymentType'] = 'sslCommerz';
                        this.sslCommerzPayment(data);
                        break;
    
                    default:
                        break;
                }
            }
    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    nagadPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.AppReference);
        let date = (new Date().getTime()).toString();
        this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.AppReference);
        let date = (new Date().getTime()).toString();
        this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    walletPayment(data) {
        this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.AppReference })
            .subscribe(res => {
                if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.swalService.alert.oops("Your wallet balance is not sufficient.");
                    } else {
                        let TicketData = {
                            AppReference: data.AppReference,
                            booking_source: data.booking_source,
                            payment_type:'wallet'
                        }
                    this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
                            .subscribe(res => {
                                if (res) {
                                     let confirmedData = res.data.FinalBooking.BookingDetails;
                                    this.utility.writeStorage("ticketCache", res.data.FinalBooking.BookingDetails, sessionStorage)
                                    this.loading = false;
                                    if (confirmedData.BookingStatus.toUpperCase()==="BOOKING_CONFIRMED") {
                                        this.deductFromWallet(data);
                                    }
                                    else
                                    {
                                        this.loading = false;
                                        this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                                        this.router.navigate(['/']);
                                    }
                                }
                            }, (err => {
                                this.loading = false;
                                this.swalService.alert.oops(err.error.Message)
                            })
                            );
                    }
                }
            }, (err => {
                this.loading = false;
                this.swalService.alert.oops(err.error.Message)
            }));
    }

    deductFromWallet(data) {
        this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Thank you for Booking with Booking 247.");
                this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    enableSeat(res) {
        const currentUser = this.utility.readStorage('currentUser', sessionStorage);
        if (res && (res.booking_source == 'ZBAPINO00002' || res.booking_source == 'ZBAPINO00007') && currentUser && (currentUser.id == 2 || currentUser.id==134 || currentUser.id==121)) {
            this.isSeatInfoNotEmpty = this.utility.checkSeatSelection(this.passengers);
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}