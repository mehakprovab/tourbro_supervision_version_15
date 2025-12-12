import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { ReportService } from '../../reports.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { Sort } from '@angular/material';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-transfer-booking-report',
  templateUrl: './transfer-booking-report.component.html',
  styleUrls: ['./transfer-booking-report.component.scss']
})
export class TransferBookingReportComponent implements OnInit {
 private subSunk = new SubSink();

  @ViewChild('form', { static: false }) form: ElementRef;
  searchType = 'transfer';
  searchText;
  navLinks = [];
  pageSize = 10;
  page = 1;
  primaryColour: any;
  secondaryColour: any;
  collectionSize: number;
  loadingTemplate: any;

  searchParams: any;
  paymentForm: FormGroup;
  submitted: boolean;
  loading:boolean=false;
  currentUser: any;

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

  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'Action', value: 'Action' },
    { key: 'AppReference', value: 'Application Reference' },
    { key: 'booking_reference', value: 'Confirmation Reference' },
     { key: 'booing_status', value: 'Booking Status' },
    { key: 'PaymentMode', value: 'Payment Mode' },
    { key: 'PaymentStatus', value: 'Payment Status' },
    { key: 'PaidMode', value: 'Paid On' },
    { key: 'BookingType', value: 'Booking Type'},
    { key: 'departure_point', value:'Start Point'},
    { key: 'destination_point', value:'End Point'},
    { key: 'FirstName', value: 'Lead Passenger Name' },
    { key: 'Email', value: 'Lead Passenger Email' },
    { key: 'total_pax', value: 'Total Pax' },
    { key: 'Phone', value: 'Phone' },
    { key: 'ProductName', value: 'Vehicle' },
    { key: 'TravelDatetime', value: 'Travel Date/Time' },
    { key: 'ReturnDatetime', value: 'Return Date/Time' },
    { key: 'driver_info', value: 'Driver Info' },
    { key: 'BaseFare', value: 'Base Fare' },
    { key: 'Convenience', value:'Convenience Fee'},
    { key: 'AgentMarkup', value: 'Agent markup' },
    { key: 'Currency', value: 'Currency' },
    { key: 'CustomerPaidAmount', value: 'Customer Paid Amount' },
    { key: 'BookedOn', value: 'BookedOn' },
    { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
    { key: 'cancellationOn', value: 'Cancelled On' },
    { key: 'cancellationfee', value: 'Cancellation Fee' }

  ];
  noData: boolean = true;
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
    subjectName: string;
    showConfirm: boolean=false;
    cancelData: any;
    paymentGateways: any;
    showPaymentDetails: boolean = false;
    payReference: any;
    customerEmailTrigger: string;
    showMailTrigger: boolean = false;
    mailTriggerData: any;
    showDeductFromWallet: boolean = false;
    loggedInUser: any;
  maxRoutesCount: any;

  constructor(
      private reportsService: ReportService,
      private swalService: SwalService,
      private utility: UtilityService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private exportAsService: ExportAsService,
      private apiHandlerService: ApiHandlerService,
      private fb: FormBuilder,
      private headerService: HeaderService

  ) { }

  ngOnInit() {
      // this.getBookingReports();
      this.activatedRoute.queryParams.subscribe(q => {
          if (!this.utility.isEmpty(q)) {
              this.getBookingReports({ app_reference: q.appRef })
          }
      });
      this.createPaymentForm();
      this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
        paymentMethod: new FormControl('', [Validators.required])
    });
}



  receiveSearchValues($event) {
      this.noData=true;
      this.respData=[];
      this.getBookingReports($event);
  }

  getBookingReports(searchForm) {
    this.searchParams = searchForm;
      this.respData = [];
      let value=JSON.parse(sessionStorage.getItem('currentUser'));
      let t = new Date(searchForm.booked_to_date)
      let toDate = new Date(t.setDate(t.getDate() + 1))
      let reqBody = {
          "booked_from_date": searchForm.booked_from_date ? formatDate(searchForm.booked_from_date, 'YYYY-MM-DD') : "",
          "booked_to_date": searchForm.booked_to_date ? formatDate(toDate, 'YYYY-MM-DD') : "",
          "status": searchForm.status || "",
          "app_reference": searchForm.app_reference || "",
          "pnr": searchForm.pnr || "",
          "email": searchForm.email || "",
          "agent_id":value.id
      }
      this.subSunk.sink = this.apiHandlerService.apiHandler('transferReport', 'post', {}, {},
        reqBody)
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                this.noData = false;
                resp.data.forEach(item => {
                        const routeName = item.attributes.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"')
                    try {
                        const parsed = JSON.parse(routeName);
                        item.route_name_list = parsed.data.route_name || [];
                    } catch(err) {
                        item.route_name_list = [];
                    }
                    });
                     
                    this.respData = resp.data || [];
                    this.maxRoutesCount = Math.max(
                        ...this.respData.map(item => item.route_name_list.length || 0)
                        );
                        console.log(this.displayColumn)
                    for (let i = 1; i <= this.maxRoutesCount; i++) {
                        this.displayColumn.splice(8 + (i - 1), 0, {
                            key: "location_" + i,
                            value: "Location " + i
                        });
                    }
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = false;
                this.respData = [];
            }
        }, (err) => {
            this.noData = false;
            this.respData = [];
        })
  }

  openMailTrigger(data) {
    this.showMailTrigger = true;
    this.mailTriggerData = data;
    this.customerEmailTrigger = data.customer_email;

  }
  mailTrigger(type){
       this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('transferEmail', 'post', {}, {},
    {   AppReference: this.mailTriggerData.app_reference,
        email: this.mailTriggerData.customer_email,
        withPrice: type
    })
    .subscribe(resp => {
        this.loading = false;
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.showMailTrigger = false;
            this.swalService.alert.success("Mail sent successfully.");
        }
        else {
            this.loading = false;
            this.swalService.alert.oops();
            this.showMailTrigger = false;
        }
    }, (err: HttpErrorResponse) => {
        this.loading = false;
        this.showMailTrigger = false;
        this.swalService.alert.oops("Something went wrong");
    }
    );
}

  applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
    filterArray = respDataCopy.slice().filter((objData, index) => {
    const leadPassenger = objData.pax && objData.pax.length > 0 ? objData.pax[0] : {};
    const itinerary = objData.itinerary && objData.itinerary.length > 0 ? objData.itinerary[0] : {};
    let origin= this.getDeparture(objData.attributes);
    let destination= this.getDestination(objData.attributes);
    const filterOnFields = {
        status: objData.status,
        app_reference: objData.app_reference,
        booking_reference: objData.booking_reference,
        FirstName: leadPassenger.first_name,
        Origin:origin,
        Destination:destination,
        Email: leadPassenger.email,
        Phone: leadPassenger.phone,
        ProductName: objData.product_name,
        TravelDatetime:objData.travel_date,
        // PromoCode:objData.promo_code,
        BaseFare:itinerary.base_fare,
        admin_markup:itinerary.admin_markup,
        AgentMarkup:itinerary.agent_markup,
        Discount:itinerary.Discount,
        Currency:objData.currency
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
getDeparture(value) {
    // console.log('Original value:', value);
    let values = value.replace(/^"|"$/g, "")        // remove starting & ending quote
  .replace(/'/g, '"')           // convert single to double quote
  .replace(/\n/g, '\\n')        // escape newline
  .replace(/\r/g, '\\r')        // escape carriage return
  .replace(/\t/g, '\\t');
    try {
        let attributes = JSON.parse(values);
        return attributes.body.From.name;
    } catch (error) {
        console.error('Error parsing JSON:', error, 'Input:', values);
        return null;
    }
}

getCounty(value) {
    // console.log('Original value:', value);
    let values = value.replace(/^"|"$/g, "")        // remove starting & ending quote
  .replace(/'/g, '"')           // convert single to double quote
  .replace(/\n/g, '\\n')        // escape newline
  .replace(/\r/g, '\\r')        // escape carriage return
  .replace(/\t/g, '\\t');
    try {
        let attributes = JSON.parse(values);
        return attributes.data.country_name;
    } catch (error) {
        console.error('Error parsing JSON:', error, 'Input:', values);
        return null;
    }
}


getCity(value) {
    // console.log('Original value:', value);
    let values = value.replace(/^"|"$/g, "")        // remove starting & ending quote
  .replace(/'/g, '"')           // convert single to double quote
  .replace(/\n/g, '\\n')        // escape newline
  .replace(/\r/g, '\\r')        // escape carriage return
  .replace(/\t/g, '\\t');
    try {
        let attributes = JSON.parse(values);
        return attributes.data.start_point_name;
    } catch (error) {
        console.error('Error parsing JSON:', error, 'Input:', values);
        return null;
    }
}

    getDestination(value) {
        // console.log('Original value:', value);
        let values = value.replace(/^"|"$/g, "")        // remove starting & ending quote
  .replace(/'/g, '"')           // convert single to double quote
  .replace(/\n/g, '\\n')        // escape newline
  .replace(/\r/g, '\\r')        // escape carriage return
  .replace(/\t/g, '\\t'); 
        try {
            let attributes = JSON.parse(values);
            // console.log("attributes",attributes)
            return attributes.body.To.name;
        } catch (error) {
            console.error('Error parsing JSON:', error, 'Input:', values);
            return null;
        }
    }

  copy(appReference){
      this.reportsService.copy(appReference);
  }
  getVoucher(appReference) {
      this.router.navigate(['/reports/transfer-voucher'], { queryParams: { appReference , from: ''} });
  }

  download(type: SupportedExtensions, orientation?: string) {
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      const date = new Date().toDateString();
      this.exportAsService.save(this.config, `b2b-HotelReport`).subscribe((_) => {
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

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...respDataCopy];
    if (!sort.active || sort.direction === '') {
        this.respData = data;
        return;
    }
    this.respData = data.sort((a, b) => {
        let origin1=this.getDeparture(a.booking.attributes);
        let destination1=this.getDestination(a.booking.attributes);
        let origin2=this.getDeparture(b.booking.attributes);
        let destination2=this.getDestination(a.booking.attributes);
         
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
            case 'app_reference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
            case 'departure_point': return this.utility.compare('' + origin1, '' + origin2, isAsc);
            case 'destination_point': return this.utility.compare('' + destination1, '' + destination2, isAsc);
            case 'booking_reference': return this.utility.compare('' + a.booking_reference, '' + b.booking_reference, isAsc);
            case 'FirstName': return this.utility.compare('' + a.pax[0].title, '' + b.pax[0].title, isAsc);
            case 'Email': return this.utility.compare('' + a.pax[0].email, '' + b.pax[0].email, isAsc);
            case 'Phone': return this.utility.compare('' + a.pax[0].phone, '' + b.pax[0].phone, isAsc);
            case 'ProductName': return this.utility.compare('' + a.product_name, '' + b.product_name, isAsc);
            case 'TravelDatetime': return this.utility.compare('' + a.itinerary[0].travel_date, '' + b.itinerary[0].travel_date, isAsc);
            case 'PromoCode': return this.utility.compare('' + a.promo_code, '' + b.promo_code, isAsc);
            case 'BaseFare': return this.utility.compare('' + a.itinerary[0].base_fare, '' + b.itinerary[0].base_fare, isAsc);
            case 'admin_markup': return this.utility.compare('' + a.itinerary[0].admin_markup, '' + b.itinerary[0].admin_markup, isAsc);
            case 'AgentMarkup': return this.utility.compare('' + a.itinerary[0].agent_markup, '' + b.itinerary[0].agent_markup, isAsc);
            case 'Discount': return this.utility.compare('' + a.itinerary[0].Discount, '' + b.itinerary[0].Discount, isAsc);
            case 'Currency': return this.utility.compare('' + a.currency, '' + b.currency, isAsc);
            case 'BookedOn': return this.utility.compare('' + a.created_at, '' + b.created_at, isAsc);	
            default: return 0;
        }
    });
}

exportExcel(): void {
    const fileToExport = this.respData.map((response: any, index: number) => {
        // Safely access the first passenger's details if pax exists and is not empty
        const leadPassenger = response.pax && response.pax.length > 0 ? response.pax[0] : {};
        return {
            "Sl No.": index + 1,
            "Status": response.status,
            "Application Reference": response['app_reference'],
            "Confirmation Reference": response['booking_reference'],
            "Departure Point":this.getDeparture(response.attributes)|| 'N/A',
            "Destination Point":this.getDestination(response.attributes)|| 'N/A',
            "Lead Passenger Name": leadPassenger.first_name || '',
            "Lead Passenger Email": leadPassenger.email || '',
            "Phone": leadPassenger.phone || '',
            "Transfer Name": response.product_name,
            "Travel Date": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].travel_date : '',
            // "Promocode": response.promo_code,
            "Base Fare": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].base_fare : '',
            "Extras": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].extras_amount : '',
            // "Admin Markup": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].admin_markup : '',
            "Agent markup": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].agent_markup : '',
            // "Discount": response.discount,
            "Currency": response.currency,
            "Customer price": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].total_fare : '',
            "BookedOn": moment(response.created_at).format("MMM DD, YYYY") ,
        };
    });

    const columnWidths = [
        { wch: 5 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
        { wch: 30 },
        { wch: 10 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
    ];

    this.utility.exportToExcel(
        fileToExport,
        'B2B Transfer List',
        columnWidths
    );
}

  showPaxProfile(data) {
      this.showPaxDetails = true;
      this.paxDetails = data.pax[0];
  }

  getFormtedStatus(status: string) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
  }

  hide() {
      this.showPaxDetails = false;
      this.showConfirm = false;
      this.driverInfoModal = false;
      //   this.showPaymentModal = false;
  }


  cancelTicketPopup(data) {
    this.subjectName = 'Cancel';
    this.showConfirm = true;
    this.cancelData = data;
}


cancelTicket() {
    let userDetails = JSON.parse(sessionStorage.getItem('currentUser'))
    let data = this.cancelData;
    this.showConfirm = false;
    this.loading = true;
    let reqBody = {
        "AppReference": data.app_reference,
        "UserId": userDetails.id,
        "BookingSource": data.Api_id
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('transferCancel', 'post', '', '', reqBody).subscribe(res => {
        if (res && res.data) {
            this.swalService.alert.success("Ticket cancelled sucessfully");
            this.loading = false;
            this.receiveSearchValues(this.searchParams);
        }
    }, err => {
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
    });
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
        name: data.pax[0].first_name + ' ' + data.pax[0].last_name,
        phone: data.phone_number,
        userId: this.currentUser.id ? this.currentUser.id : 0,
        email: data.email
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
    this.payReference = data.app_reference
    sessionStorage.setItem('TransferReportAppRef',this.payReference);
    this.getPaymentGateWays();
    this.intitiatePayment(data);
    this.checkWallet(data.app_reference);
    this.showPaymentDetails = true;
}

checkWallet(appReference) {
    this.loading=true;
   this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
        .subscribe(res => {
            // if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.loading=false;
                    this.showDeductFromWallet = false;
                } else {
                    this.showDeductFromWallet = true;
                }
            // }
        }, (err) => {
            this.loading=false;
            this.showDeductFromWallet = false;
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
    this.loading = true;
    this.currentUser = this.utility.getStorage('currentUser');
    let totalFare: any = 0;

    let balance = String(this.currentUser.agent_balance - totalFare);
    this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
        id: this.currentUser.id,
        agent_balance: balance
    }).subscribe(res => {
        this.loading = false;
           this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                id: this.currentUser.id
            }).subscribe(data => {
                // res['data']['access_token'] = this.currentUser.access_token;
                sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
            });
    }, (err) => {
        this.loading = false;
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

  ngOnDestroy() { }

  app_reference: any;
    api_id: any;
    driverInfoModal: boolean = false;
    driverMobile: any;
    driverName: any;
    openDriverInfoModal(data) {
        this.driverInfoModal = true;
        this.api_id = data.Api_id,
        this.app_reference = data.app_reference
    }
    sendDriverInfo() {

        if (this.driverMobile === '' && this.driverName === '') {
            this.swalService.alert.oops('Please enter driver details');
            return;
        }
        const req = {
            AppReference: this.app_reference,
            BookingSource: this.api_id,
            driver_name: this.driverName,
            driver_contact: this.driverMobile
        }
        this.loading = true;
        this.apiHandlerService.apiHandler('updateDriverInfo', 'POST', {}, {}, req).subscribe({
            next: (res) => {
                
                if(res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.loading = false;
                    this.driverInfoModal = false;
                    this.swalService.alert.success('Driver Info is send Successfully');
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                this.loading = false;
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

}
