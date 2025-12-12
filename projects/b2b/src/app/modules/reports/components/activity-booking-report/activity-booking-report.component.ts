import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { ReportService } from '../../reports.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-activity-booking-report',
  templateUrl: './activity-booking-report.component.html',
  styleUrls: ['./activity-booking-report.component.scss']
})
export class ActivityBookingReportComponent implements OnInit {
  private subSunk = new SubSink();
  secondaryColour: any;
  searchType = 'activity';
  navLinks = [];
  pageSize = 10;
  primaryColour: any;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'AppReference', value: 'Application Reference' },
      { key: 'PaymentMode', value: 'Payment Mode' },
      { key: 'PaidMode', value: 'Paid On' },
      { key: 'PaymentStatus', value: 'Payment Status' },
      { key: 'BookingType', value: 'Booking Type'},
      { key: 'action', value: 'Action' },
      { key: 'Status', value: 'Status' },
      { key: 'pnr', value: 'Confirmation Number' },
      { key: 'LeadPassengerName', value: 'Lead Passenger Name' },
      { key: 'phone_number', value: 'Phone Number' },
      { key: 'email', value: 'Email' },
      { key: 'city', value: 'City' },
      { key: 'coumtry', value: 'Country' },
      { key: 'Destination', value: 'Destination' },
      { key: 'DateFrom', value: 'Date From' },
      { key: 'Date To', value: 'Date To' },
      { key: 'ProductName', value: 'Product Name' },
      { key: 'base_fare', value: 'Base Fare' },
      { key: 'markup', value: 'Agent Markup' },
      { key: 'TotalFare', value: 'Total Fare' },
      { key: 'CreatedDatetime', value: 'Booked On' },
      { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
      { key: 'cancelledOn', value: 'Cancelled On' },
      { key: 'cancelledamt', value: 'Cancellation Fee' },

      
  ];
  noData: boolean = true;
  loadingTemplate: any;
  respData: any;
  config: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: 'b2b-hotel-report',
      options: {
          jsPDF: {
              orientation: 'landscape'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
      }

  };
  showPaxDetails: boolean;
  showCancelModal: boolean;
  showPaymentModal: boolean;
  currentRecord: any = [];
  paxDetails: any = {
      "Title": "",
      "FirstName": "",
      "LastName": "",
  };
  currentUser:any;
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    loading: boolean;
    searchForm: any;



    @ViewChild('form', { static: false }) form: ElementRef; 
    searchParams: any;
    paymentForm: FormGroup;
    submitted: boolean;
    paymentGateways: any;
    showPaymentDetails: boolean = false;
  
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
    adult = 0;
    child = 0;
    updatedDateFrom: string;
    visibleCancelPolicyIndex = -1;
    visibleNonCancelPolicyIndex =-1;
    paymentData: any;
    payReference: any;
    showMailTrigger: boolean = false;
    customerEmailTrigger: string = '';
    mailTriggerData: any;
    showDeducuFromWallet: boolean = false;
    booking_source: any;

  constructor(
      private reportsService: ReportService,
      private swalService: SwalService,
      private utility: UtilityService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private exportAsService: ExportAsService,
      private apiHandlerService:ApiHandlerService,
      private fb: FormBuilder,
      private headerService: HeaderService
  ) { }

  ngOnInit() {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
      this.activatedRoute.queryParams.subscribe(q => {
          if (!this.utility.isEmpty(q)) {
              this.getBookingReports({ app_reference: q.appRef })
          }
      });
      this.createPaymentForm();
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
        paymentMethod: new FormControl('', [Validators.required])
    });
}

  cancelTicketPopup(data) {
    this.subjectName = 'Cancel';
    this.showConfirm = true;
    this.cancelData = data;
    this.booking_source = data.BookingDetails.searchData.booking_source;
}

  receiveSearchValues($event) {
      this.noData=true;
      this.respData=[];
      this.searchForm = $event;
      this.getBookingReports($event);
  }

  openMailTrigger(data) {
    this.showMailTrigger = true;
    this.mailTriggerData = data;
    this.customerEmailTrigger = data.BookingDetails.CustomerEmail;
  }

  mailTrigger(type){
       
    this.subSunk.sink = this.apiHandlerService.apiHandler('activityEmail', 'post', {}, {},
    {   AppReference: this.mailTriggerData.BookingDetails.AppReference,
        email: this.mailTriggerData.BookingDetails.CustomerEmail,
        withPrice: type })
    .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success("Mail sent successfully.");
            this.showMailTrigger = false
        }
        else {
            this.swalService.alert.oops();
            this.showMailTrigger = false;
        }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.oops("Something went wrong");
        this.showMailTrigger = false;
    }
    );
}

  getBookingReports(searchForm) {
      this.respData = [];
      let t = new Date(searchForm.booked_to_date)
      let toDate = new Date(t.setDate(t.getDate() + 1))
      let reqBody = {
          "booked_from_date": searchForm.booked_from_date ? formatDate(searchForm.booked_from_date, 'YYYY-MM-DD') : "",
          "booked_to_date": searchForm.booked_to_date ? formatDate(toDate, 'YYYY-MM-DD') : "",
          "status":  searchForm.status ? searchForm.status : 'ALL',
          "app_reference": searchForm.app_reference || "",
          "pnr": searchForm.pnr || "",
          "email": searchForm.email || "",
      }
      this.reportsService.fetchActivityBookingReports(reqBody)
          .pipe(untilDestroyed(this))
          .subscribe(resp => {
              log.debug(resp);
              if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                      this.noData = false;
                      this.respData = resp.data;
                      respDataCopy = [...this.respData];
                      this.collectionSize = respDataCopy.length;
              } else {
                  this.noData = false;
                  this.respData=[];
              }
          }, (err) => {
              this.respData=[];
              this.noData = false;
            })
  }

  applyFilter(text: string) {
      text = text.toLocaleLowerCase().trim();
      filterArray = respDataCopy.slice().filter((objData, index) => {
          const filterOnFields = {
              AppReference: objData.BookingDetails.AppReference,
              pnr: objData.pnr,
              HotelCheckIn: objData.BookingDetails.HotelCheckIn,
              HotelCheckOut: objData.BookingDetails.HotelCheckOut,
              agent_netfare: objData.agent_netfare,
              agent_commission: objData.agent_commission,
              markup: objData.markup,
              tds: objData.tds,
              TotalFare: objData.TotalFare,
              CreatedDatetime: objData.CreatedDatetime,
              Status: objData.Status,
          }
          if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
              return objData;
          }
      });
      if (filterArray.length && text.length)
          this.respData = filterArray;
      else
          this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

  }

  sortData(sort: Sort) {
      const data = filterArray.length ? filterArray : [...respDataCopy];
      if (!sort.active || sort.direction === '') {
          this.respData = data;
          return;
      }
      this.respData = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
              case 'AppReference': return this.utility.compare('' + a.AppReference, '' + b.AppReference, isAsc);
              case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
              case 'leadpax_name': return this.utility.compare('' + a.leadpax_name.toLocaleLowerCase(), '' + b.leadpax_name.toLocaleLowerCase(), isAsc);
              case 'JourneyFrom': return this.utility.compare('' + a.JourneyFrom.toLocaleLowerCase(), '' + b.JourneyFrom.toLocaleLowerCase(), isAsc);
              case 'JourneyTo': return this.utility.compare('' + a.JourneyTo, '' + b.JourneyTo, isAsc);
              case 'type': return this.utility.compare('' + a.type.toLocaleLowerCase(), '' + b.type.toLocaleLowerCase(), isAsc);
              case 'agent_netfare': return this.utility.compare(+ a.agent_netfare, + b.agent_netfare, isAsc);
              case 'agent_commission': return this.utility.compare(+ a.agent_commission, + b.agent_commission, isAsc);
              case 'agent_markup': return this.utility.compare(+ a.agent_markup, + b.agent_markup, isAsc);
              case 'tds': return this.utility.compare(+ a.tds.toLocaleLowerCase(), + b.tds.toLocaleLowerCase(), isAsc);
              case 'TotalFare': return this.utility.compare(+ a.TotalFare, + b.TotalFare, isAsc);
              case 'JourneyStart': return this.utility.compare('' + a.JourneyStart, '' + b.JourneyStart, isAsc);
              case 'CreatedDatetime': return this.utility.compare(+ a.CreatedDatetime, + b.CreatedDatetime, isAsc);
              case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
              default: return 0;
          }
      });
  }

  copy(appReference){
      this.reportsService.copy(appReference);
  }
  getVoucher(appReference) {
      log.debug('getVoucher called', appReference);
      this.router.navigate(['/reports/activity-voucher'], { queryParams: { appReference , from: '' } });
  }

  download(type: SupportedExtensions, orientation?: string) {
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      const date = new Date().toDateString();
      this.exportAsService.save(this.config, `b2b-ActivityReport`).subscribe((_) => {
          this.swalService.alert.success();
      }, (err) => {
          console.log(err);
          this.swalService.alert.oops();
      });
  }

  pdfCallbackFn(pdf: any) {
      // example to add page number as footer to every page of pdf
      const noOfPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= noOfPages; i++) {
          pdf.setPage(i);
          pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
      }
  }

  showPaxProfile(data) {
      this.showPaxDetails = true;
      this.currentRecord = data.BookingDetails;
      this.paxDetails = data.BookingPaxDetails.filter(p => p.LeadPax);
      this.paxDetails = this.paxDetails[0];
  }

  getFormtedStatus(status: string) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
  }

  hide() {
      this.showPaxDetails = false;
      this.showConfirm=false;
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
        name: data.BookingPaxDetails[0].FirstName + ' ' + data.BookingPaxDetails[0].LastName,
        phone: data.BookingDetails.PhoneNumber,
        userId: this.currentUser.id ? this.currentUser.id : 0,
        email: data.BookingDetails.Email
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('initiatePaymentReport', 'post', '', '', payload).subscribe(res => {
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

getPayNow(data) {
    this.payReference = data.BookingDetails.AppReference
    sessionStorage.setItem('ActivityReportAppRef',this.payReference);
    this.getPaymentGateWays();
    this.intitiatePayment(data);
    this.checkWallet(this.payReference);
    this.showPaymentDetails = true;
}


checkWallet(appReference) {
    this.loading=true;
   this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
        .subscribe(res => {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.loading=false;
                    this.showDeducuFromWallet = false;
                } else {
                    this.loading = false;
                    this.showDeducuFromWallet = true;
                }
        }, (err) => {
            this.loading=false;
            this.showDeducuFromWallet = false;
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

confirmTicket() {
this.form.nativeElement.submit();

}

walletPayment(appReference) {
    this.loading=true;
//    this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
//         .subscribe(res => {
//             // if (res && res.data[0].ticketFare) {
//                 if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
//                     this.loading=false;
//                     this.swalService.alert.oops("Your wallet balance is not sufficient.")
//                 } else {
                    this.updateSubAgent();
                    this.deductFromWallet(appReference);
        //         }
        //     // }
        // }, (err) => {
        //     this.loading=false;
        //     this.swalService.alert.oops("Your wallet balance is not sufficient.")
        // });
}
updateSubAgent() {
    this.loading=true;
    this.currentUser = this.utility.getStorage('currentUser');
    let totalFare: any = 0;

    let balance = String(this.currentUser.agent_balance - totalFare);
    this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
        id: this.currentUser.id,
        agent_balance: balance
    }).subscribe(res => {
        this.loading=false;
        // if (resp.statusCode == 201) {
           this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                id: this.currentUser.id
            }).subscribe(data => {
                // res['data']['access_token'] = this.currentUser.access_token;
                sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
            });
        // }
    }, (err) => {
        this.loading=false;
    })
}
deductFromWallet(appReference) {
      this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
        if (res) {
            if (res.data[2].order_id ) {
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
hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
}

  exportExcel(): void {
      const fileToExport = this.respData.map((response: any,index:number) => {
          return {
              "Sl No.":index+1,
              "Application Reference": response.BookingDetails.AppReference,
              "Status": response.BookingDetails.Status,
              "Confirmation Number": response.BookingDetails.ConfirmationReference,
              "Agent Markup": response.BookingDetails.AgentMarkup,
              "Total Fare":response.BookingDetails.TotalNet,
              "From":moment(response.BookingDetails.DateFrom).format("MMM DD, YYYY, hh:mm:ss A") ,
              "To":moment(response.BookingDetails.DateTo).format("MMM DD, YYYY, hh:mm:ss A"),
              "Booked On":moment(response.BookingDetails.CreatedDatetime).format("MMM DD, YYYY, hh:mm:ss A")
          }
      });

      const columnWidths = [
          { wch: 5 },
          { wch: 30 },
          { wch: 30 },
          { wch: 30 },
          { wch: 10 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 30 },
          { wch: 25 },
      ];

      this.utility.exportToExcel(
          fileToExport,
          'Activity Report',
          columnWidths
      );
  }

  cancelTicket() {
    let data = this.cancelData;
    this.showConfirm = false;
    this.loading = true;
    let reqBody = {
        "AppReference": data.BookingDetails.AppReference,
        "UserType": "B2C",
        "booking_source": this.booking_source
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('cancelActivityBooking', 'post', '', '', reqBody).subscribe(res => {
        if (res && res.data) {
            this.swalService.alert.success("Ticket cancelled sucessfully");
            this.loading = false;
            this.getBookingReports(this.searchForm);
        }
    }, err => {
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
    });
}

  ngOnDestroy() { }


}
