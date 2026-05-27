import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { FlightService } from '../../../../search/flight/flight.service';

const b2b_url = `${environment.B2B_URL}/b2b`
const log = new Logger('report/VoucherComponent')
@Component({
    selector: 'app-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['./voucher.component.scss']
})

export class VoucherComponent implements OnInit {


    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    order_id: "";
    airline_logo = 'https://booking247.com/airline_logo/'; //AI.svg
    domainInformation: any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'print_voucher',
        options: {
            jsPDF: {
                orientation: 'potrait'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showPaymentDetails: boolean;
    paymentData: any;
    srcUrl: string = "";
    paymentForm: FormGroup;
    submitted: boolean;
    loggedInUser: any;
    loadingTemplate: any;
    loading: boolean=false;
    paymentGateways: any;
    confirmedData: any;
    segment_indicator0:any;
    segment_indicator1:any;
    isSeatInfoNotEmpty:any=false;
    hidePrice: boolean = true;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private headerService: HeaderService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private util: UtilityService,
        private flightService:FlightService
    ) { }


    toggleStyle: boolean = true;
    public buttonName: any = 'Hide Price';
    toggle() {
        this.toggleStyle = !this.toggleStyle;
        this.hidePrice = !this.hidePrice;
        if (this.toggleStyle)
            this.buttonName = "Hide Price";
        else
            this.buttonName = "Show Price";
    }



    ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['AppReference']).replace("/", "");
            this.order_id = queryParams['orderId'] ? (queryParams['orderId']).replace("/", "") : "";
        });
        this.getB2bFlightVoucher();
        this.getDomain();
        this.createPaymentForm();
    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    
  onPrint(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_voucher').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

    getB2bFlightVoucher() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    resp.data[0]['FlightItineraries'].forEach((element, i) => {
                        if (element.attributes) {
                            let attributes = element.attributes.replace(/\"/gi, "\"");
                            resp.data[0]['FlightItineraries'][i]['attributes'] = JSON.parse(attributes);
                        }
                    });
                    this.voucherData = resp.data[0] || [];
                    this.setPNRData(this.voucherData);
                    this.enableSeat();
                    if (this.app_reference && this.order_id)
                        this.checkPaymentStatus();
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    checkPaymentStatus() {
        let req = {
            app_reference: this.app_reference,
            order_id: this.order_id
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('paymentConfirmation', 'post', {}, {},
            req).subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.callPnrTicket();
                }
            })
    }

    callPnrTicket() {
        let TicketData = {
            AppReference: this.app_reference,
            booking_source: this.voucherData['ApiCode'],
            order_id:this.order_id
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData).subscribe(res => {
            if (res) {
                this.order_id="";
                this.getB2bFlightVoucher();
            }
        });
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            })
    }

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }
    calculateDiffTime(fromDate, toDate) {
        return this.utility.calculateDiffTime(fromDate, toDate);
    }
    calculateDuration(fromDate, toDate) {
        return this.utility.calculateDuration(fromDate, toDate);
    }

    getTime(t) {
        return t.split(" ")[1];
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    findLeaduserDetails(data) {
        if (data) {
            let leadUser = data.filter(x => {
                return x.LeadPax == true
            });
            return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }
    download(type: SupportedExtensions, orientation?: string) {
        const source = document.getElementById("print_voucher");
        let doc = new jsPDF('p', 'pt', 'a3');
        let handleElement = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        doc.setFontSize(9);
        let fileName = this.voucherData['AppReference']
        doc.html(source, {
            margin: [15, 15, 15, 15],
            html2canvas: {
            },
            callback: function (doc) {

                doc.save(`${fileName}.pdf`);
            }
        });

    }
    download1(type: SupportedExtensions, orientation?: string) {
        window.scrollTo(0, 0);
        var data = document.getElementById('print_voucher');

        setTimeout(() => {
            html2canvas(data, {
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                canvas.getContext('2d');
                const contentDataURL = canvas.toDataURL("image/jpeg", 1.0);
                let pdf = new jsPDF('p', 'mm', 'a4'[canvas.width, canvas.height]);
                const imgProps = pdf.getImageProperties(contentDataURL);
                var width = pdf.internal.pageSize.getWidth() - 3;
                var height = (imgProps.height * width) / imgProps.width;
                this.swalService.alert.success();
                pdf.save(`${this.voucherData['AppReference']}.pdf`);
            });
        }, 1000)

    }

    public downloadDocument(): void {
        window.scrollTo(0, 0);
        var data = document.getElementById('print_voucher');
        setTimeout(() => {
            html2canvas(data, {
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                const contentDataURL = canvas.toDataURL('image/png', 1.0)
                let pdf = new jsPDF('p', 'mm', 'a4');
                var width = pdf.internal.pageSize.getWidth();
                var height = pdf.internal.pageSize.getHeight();
                pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
                this.swalService.alert.success();
                pdf.save(`${this.voucherData['AppReference']}.pdf`);
            });
        }, 1000)
    }


    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData['AppReference']
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });
        const content = this.print_voucher.nativeElement;
        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },
            callback: async (doc) => {
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();
            }
        });
    }


    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
        }


    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    duration(f) {
        const origin = f.departure_datetime;
        const destination = f.arrival_datetime
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';

    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    submitTicket(data) {
        this.getPaymentGateWays();
        this.showPaymentDetails = true;
        this.paymentData = data;
    }

    paymentConfirm() {
        this.submitted = true;
        if (!this.paymentForm.valid)
            return;
        let data = this.paymentData;
        console.log(this.paymentForm.value.paymentMethod);
        if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
            switch (this.paymentForm.value.paymentMethod) {
                case 'nagad':
                    data['paymentType'] = 'nagad';
                    this.nagadPayment(data);
                    break;
                case 'bKash':
                    this.srcUrl = `${b2b_url}/paymentGateway/${data.AppReference}?source=reports`
                    window.location.replace(this.srcUrl);
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

    nagadPayment(data) {
      let invoiceNumber= this.flightService.setInvoiceNumber(data.AppReference);
        let date = (new Date().getTime()).toString();
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
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
        this.subSunk.sink = this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
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
        this.loading = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.AppReference })
            .subscribe(res => {
                if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.loading = false;
                        this.swalService.alert.oops("Your wallet balance is not sufficient.");
                    } else {
                        let TicketData = {
                            AppReference: data.AppReference,
                            booking_source: data.ApiCode,
                            payment_type:'wallet'
                        }
                        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
                            .subscribe(res => {
                                if (res) {
                                    this.confirmedData = res.data.FinalBooking.BookingDetails;
                                    this.util.writeStorage("ticketCache", res.data.FinalBooking.BookingDetails, sessionStorage)
                                    this.loading = false;
                                    if (this.confirmedData.BookingStatus.toUpperCase()==="BOOKING_CONFIRMED") {
                                        this.deductFromWallet(data);
                                    }
                                    else
                                    {
                                        this.loading = false;
                                        this.showPaymentDetails = false;
                                        this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                                        this.router.navigate(['/']);
                                    }
                                }
                            }, (err => {
                                this.loading = false;
                                this.showPaymentDetails = false;
                                this.swalService.alert.oops(err.error.Message)
                            })
                            );
                    }
                }
            }, (err => {
                this.loading = false;
                this.swalService.alert.oops(err.error.Message)
                this.showPaymentDetails = false;
            }));
    }

    deductFromWallet(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Thank you for Booking with Booking 247.");
                this.headerService.agentData.next(true);
                this.hide();
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    hide() {
        this.showPaymentDetails = false;
    }

    getTimeFromDate(date: any) {
        return date.substr(11, 5);
    }

    importPNR() {
        this.loading=true;
        this.apiHandlerService.apiHandler('importPnr', 'POST', '', '', { AppReference: this.app_reference,booking_source: this.voucherData['ApiCode']
    })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.loading=false;
                    window.location.reload();
                }
            }, (err) => {
                if (err) {
                    this.loading=false;
                    this.swalService.alert.oops(err.error.msg);
                }
            });
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

    setPNRData(voucherData){
       this.segment_indicator0=voucherData.FlightItineraries.filter(element=>element.segment_indicator==0);
       this.segment_indicator1=voucherData.FlightItineraries.filter(element=>element.segment_indicator==1);
    }

    enableSeat() {
        const currentUser = this.utility.readStorage('currentUser', sessionStorage);
        if (this.voucherData && (this.voucherData.ApiCode == 'ZBAPINO00002' || this.voucherData.ApiCode == 'ZBAPINO00007') && currentUser && (currentUser.id == 2 || currentUser.id==134 || currentUser.id==121)) {
            this.isSeatInfoNotEmpty =this.util.checkSeatSelection(this.voucherData.Passengers);
        }
    }


    commonBadgeStyle = {
        fontSize: '13px',
        padding: '8px',
        borderRadius: '5px',
      }
      
      getBadgeClass(status: string): string {
        switch (status) {
          case 'BOOKING_FAILED':
            return 'badge badge-danger';
          case 'BOOKING_CONFIRMED':
            return 'badge badge-success';
          case 'BOOKING_CANCELLED':
            return 'badge badge-danger';
          case 'BOOKING_INPROGRESS':
            return 'badge badge-info';
          case 'BOOKING_HOLD':
            return 'badge badge-warning';
          default:
            return '';
        }
      }
      
      getBadgeText(status: string): string {
        switch (status) {
          case 'BOOKING_FAILED':
            return 'Booking Failed';
          case 'BOOKING_CONFIRMED':
            return 'Booking Confirmed';
          case 'BOOKING_CANCELLED':
            return 'Booking Cancelled';
          case 'BOOKING_INPROGRESS':
            return 'Booking Inprogress';
          case 'BOOKING_HOLD':
            return 'Booking Hold';
          default:
            return 'NA';
        }
      }
      
   
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
