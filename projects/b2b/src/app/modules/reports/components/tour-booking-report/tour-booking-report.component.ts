import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../reports.service';
import { SwalService } from '../../../../core/services/swal.service';
import { untilDestroyed } from '../../../../core/services';
import { Logger } from '../../../../core/logger/logger.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-tour-booking-report',
  templateUrl: './tour-booking-report.component.html',
  styleUrls: ['./tour-booking-report.component.scss']
})
export class TourBookingReportComponent implements OnInit {

  searchType = 'tour';
  private subSunk = new SubSink();
  regConfig: FormGroup;
  isOpen = false as boolean;
  bsDateConf = {
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-blue',
      showWeekNumbers: false
  };

  pageSize = 100;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'S No.' },
    { key: 'Action', value: 'Action' },
    { key: 'status', value: 'Status' },
    { key: 'app_reference', value: 'Application Reference' },
    // { key: 'booking_reference', value: 'Confirmation Reference' },
    { key: 'FirstName', value: 'Lead Passenger Name' },
    { key: 'Email', value: 'Lead Passenger Email' },
    { key: 'PhoneNumber', value: 'Lead Passenger Phone' },
    { key: 'ProductName', value: 'Tour Name' },
    { key: 'country', value: 'Country' },
    { key: 'City', value: 'City' },
    { key: 'TravelDatetime', value: 'Travel Date' },
    { key: 'NoOfAdults', value: 'No Of Adults' },
    // { key: 'NoOfSenior', value: 'No Of Senior' },
    // { key: 'NoOfYouth', value: 'No Of Youth' },
    { key: 'NoOfChild', value: 'No Of Child' },
    // { key: 'NoOfInfant', value: 'No Of Infant' },
    // { key: 'CommissionFare', value: 'Agent Commission' },
    // { key: 'Commission', value: 'Commission' },
    { key: 'optionalTour', value: 'Optional Tour' },
    { key: 'optionalTourPrice', value: 'Optional Tours Price' },
    { key: 'AdminNetFare', value: 'Total Display Fare' },
    // { key: 'admin_markup', value: 'Admin Markup' },
    { key: 'agent_markup', value: 'Agent Markup' },
    // { key: 'ConvenienceFee', value: 'Convenience Fee' },
    // { key: 'Gst', value: 'GST' },
    // { key: 'PromoCode', value: 'Promocode' },
    // { key: 'Discount', value: 'Discount' },
    { key: 'Currency', value: 'Currency' },
    { key: 'CustomerPaidAmount', value: 'Customer Amount' },
    // { key: 'PaymentStatus', value: 'Payment Status' },
    { key: 'BookedOn', value: 'BookedOn' },
    { key: 'cancellation_deadLine', value: 'Cancellation Dead Line' },
    { key: 'cancelled_on', value: 'Cancelled On' },
    { key: 'cancelation_fee', value: 'Cancellation Fee' },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  config: ExportAsConfig = {
      type: 'pdf',
      elementId: 'b2b-tour-report',
      options: {
          jsPDF: {
              orientation: 'landscape'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
      }

  };
  showModal: boolean;
  showCancelModal: boolean;
  currentRecord: any = [];
  paxDetails: any = [];
  maxDate = new Date();
  searchText: string;
  subjectName: string;
  showConfirm: boolean;
  cancelData: any;
  load: boolean = false;
  searchParams: any;

@ViewChild('form', { static: false }) form: ElementRef;
payReference:any;
  paymentForm: FormGroup;
    submitted: boolean;
    loading:boolean=false;
    currentUser: any;
     paymentGateways: any;
     showPaymentDetails: boolean = false;
    showPaxDetails: boolean;
    showPaymentModal: boolean;

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
    showMailTrigger: boolean = false;
    customerEmailTrigger: any;
    mailTriggerData: any;
    totalAmount: any;
    showDeductCredit: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loggedInUser: any;

  constructor(
      private apiHandlerService: ApiHandlerService,
      private fb: FormBuilder,
      private swalService: SwalService,
      private exportAsService: ExportAsService,
      private utility: UtilityService,
      private router: Router
  ) { }

  ngOnInit() {
    this.createPaymentForm();
    this.currentUser = this.utility.getStorage('currentUser');
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'))
      let date = new Date(),
          fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
      let tommorow = date;
      tommorow.setDate(tommorow.getDate() + 1);

      this.regConfig = this.fb.group({
          booked_from_date: new FormControl('', [Validators.maxLength(120)]),
          booked_to_date: new FormControl('', [Validators.maxLength(120)]),
          app_reference: new FormControl('', [Validators.maxLength(15)]),
          phone_number: new FormControl('', [Validators.maxLength(10)]),
          email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
          status: new FormControl('ALL'),
      });

    //   this.regConfig.patchValue({
    //       booked_from_date: fromDate,
    //       booked_to_date: tommorow
    //   })

    //   this.getB2bTourReport();
  }

  mailTrigger(data){
       
    this.subSunk.sink = this.apiHandlerService.apiHandler('emailTourDetails', 'post', {}, {},
    {   AppReference: data.App_Reference,
        email: data.customer_email})
    .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success("Mail sent successfully.");
        }
        else {
            this.swalService.alert.oops();
        }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.oops("Something went wrong");
    }
    );
}

  onSearchSubmit() {
    this.getB2bTourReport('');
  }

  onReset() {
      this.regConfig.reset();
      this.regConfig.patchValue({
          status: 'ALL',
      });
      this.searchText = "";
    this.getB2bTourReport('');
  }

  getB2bTourReport(searchForm) {
    console.log("searchForm",searchForm)
    this.searchParams = searchForm;
    this.respData = [];
    console.log("searchForm",searchForm)
    let t = new Date(searchForm.booked_to_date)
    let toDate = new Date(t.setDate(t.getDate() + 1))
      this.subSunk.sink = this.apiHandlerService.apiHandler('tourB2bReport', 'post', {}, {},
          {
            "booked_from_date": searchForm.booked_from_date ? formatDate(searchForm.booked_from_date, 'YYYY-MM-DD') : "",
            "booked_to_date": searchForm.booked_to_date ? formatDate(toDate, 'YYYY-MM-DD') : "",
            "status": searchForm.status === 'ALL' ? 'ALL' : searchForm.status || '',
            "app_reference": searchForm.app_reference || "",
            "pnr": searchForm.pnr || "",
            "email": searchForm.email || "",
          })
          .subscribe(resp => {
              if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                  this.noData = false;
                  this.respData = resp.data || [];
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

  exportExcel(): void {
      const fileToExport = this.respData.map((response: any,index:number) => {
          return {
              "Sl No.":index+1,
              "Application Reference": response.BookingDetails.AppReference,
              "Status": response.BookingDetails.Status,
              "Confirmation Number": response.BookingDetails.ConfirmationReference,
              "Fare":response.BookingItineraryDetails[0].RoomPrice,
              "Agent Markup": response.BookingItineraryDetails[0].AgentMarkup,
              "Total Fare":response.BookingItineraryDetails[0].TotalFare,
              "Payment Mode":response.BookingDetails.PaymentMode,
              "From":moment(response.BookingDetails.HotelCheckIn).format("MMM DD, YYYY, hh:mm:ss A") ,
              "To":moment(response.BookingDetails.HotelCheckOut).format("MMM DD, YYYY, hh:mm:ss A"),
              "Agent Commission":response.BookingItineraryDetails[0].AgentMarkup,
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
          'Tour Report',
          columnWidths
      );
  }


  applyFilter(text: string) {
      text = text.toLocaleLowerCase().trim();
      filterArray = respDataCopy.slice().filter((objData, index) => {
          const filterOnFields = {
              agent: objData.agent,
              transactiondate: objData.transaction,
              app_refernce: objData.app_refernce,
              transactiontype: objData.transactiontype,
              fare: objData.fare,
              remarks: objData.remarks
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
              case 'transaction_type': return this.utility.compare('' + a.transaction_type.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
              case 'created_datetime': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
              case 'transaction_owner_id': return this.utility.compare('' + a.transaction_owner_id, '' + b.transaction_owner_id, isAsc);
              case 'app_reference': return this.utility.compare('' + a.app_reference.toLocaleLowerCase(), '' + b.app_reference.toLocaleLowerCase(), isAsc);
              case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
              case 'company': return this.utility.compare('' + a.company.toLocaleLowerCase(), '' + b.company.toLocaleLowerCase(), isAsc);
              case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
              default: return 0;
          }
      });
  }

  getPaxTypeCounts(data): { [key: number]: number } {
      const counts: { [key: number]: number } = {};
      data.paxDetails.forEach(item => {
          const paxType = item.pax_type;
          if (paxType) {
              counts[paxType] = (counts[paxType] || 0) + 1;
          }
      });
      return counts;
  }

  receiveSearchValues($event) {
    this.loadedData = $event
    this.noData=true;
    this.respData=[];
    this.getB2bTourReport($event);
  }

  download(type: SupportedExtensions, orientation?: string) {
      // if (type)
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      const date = new Date().toDateString();
      this.exportAsService.save(this.config, `b2b-TourReport`)
  }

  pdfCallbackFn(pdf: any) {
      // example to add page number as footer to every page of pdf
      const noOfPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= noOfPages; i++) {
          pdf.setPage(i);
          pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
      }
  }

  cancelTicketPopup(data) {
      this.subjectName = 'Cancel';
      this.showConfirm = true;
      this.cancelData = data;
  }
  public loadedData: any;

  cancelTicket() {
    const reqBody = {
      AppReference: this.cancelData.bookingDetails[0].App_Reference,
      booking_source: this.cancelData.bookingDetails[0].BookingSource
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('cancelTour', 'post', {}, {}, reqBody).subscribe(resp => {
      if (resp.statusCode == 200 || resp.statusCode == 201) {
        this.swalService.alert.success('Booking Cancelled!!');
        this.showConfirm = false;
        this.getB2bTourReport(this.loadedData)
      }
    }, (err) => {
      this.swalService.alert.oops('cancellation Failed!!');
    })
  }


  showPaxProfile(data) {
    this.showModal = true;
    this.currentRecord = data;
    this.paxDetails = data.paxDetails[0];
}

  filterByPassengers(list) {
      return list.filter(x => x.LeadPax == false);
  }

  showCancelPolicy(data) {
      this.showCancelModal = true;
      this.currentRecord = data;
  }

  onTourRedirect(appRef, type) {
      if (type === 'voucher')
          this.router.navigate(['/reports/tour-voucher'], { queryParams: { AppReference: appRef } });
      else if (type === 'invoice')
          this.router.navigate(['/reports/tour-invoice'], { queryParams: { AppReference: appRef } });
      else
          return false;
  }

  hide() {
      this.showModal = false;
      this.showCancelModal = false;
      this.showConfirm = false;
  }

  calculateDiff(fromDate, toDate) {
      return this.utility.calculateDiff(fromDate, toDate);
  }

  numberOnly(event): boolean {
      return this.utility.numberOnly(event);
  }

  ngOnDestroy(): void {
      this.subSunk.unsubscribe();
  }

      getOptionalTours(data) {
    if (!data) {
        return [];
    }
    
    try {
        // Check if data is already an object
        if (typeof data === 'object') {
            return data;
        }
        
        // Check if data is a valid JSON string
        if (typeof data === 'string') {
            const trimmedData = data.trim();
            // Only parse if it looks like JSON
            if (trimmedData.startsWith('[') || trimmedData.startsWith('{')) {
                return JSON.parse(trimmedData);
            }
        }
        
        return [];
    } catch (error) {
        console.error('Error parsing optional tours:', error, 'Data:', data);
        return [];
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
getPayNow(data) {
        this.totalAmount = data.bookingDetails[0].TotalFare;
        this.payReference = data.bookingDetails[0].App_Reference
        sessionStorage.setItem('TourReportAppRef',this.payReference);
        this.getPaymentGateWays();
        // this.intitiatePayment(data);
        this.removePaymentGateWay();
        this.checkWallet(this.payReference)
        this.showPaymentDetails = true;
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
            source: "tour",
            name: data.paxDetails[0].FirstName + ' ' + data.paxDetails[0].LastName,
            phone: data.paxDetails[0].Contact,
            userId: this.currentUser.id ? this.currentUser.id : 0,
            email: data.paxDetails[0].Email
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

    getPaymentGateWays() {
        let obj = {
            user_id: this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways = res.data;
                    const obj = {
                            module: 'Tour',
                            app_reference: this.payReference
                        }
                        this.apiHandlerService.apiHandler('updatePaymentCharges', 'POST', '', '', obj).subscribe((resp) => {
                            if (resp.statusCode === 201 && resp.Status === true) {
                                // this.confirmTicket();
                                // this.convienienceFee  = resp.data.ConvenienceFee;
                            }
                             this.intitiatePayment(this.payReference);
                        })
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
        // if (this.paymentForm.value.paymentMethod == "barclay") {
        //     this.confirmTicket();
        // }
        // if (this.paymentForm.value.paymentMethod == "wallet") {
        //     this.walletPayment(appReference);
        // }
        // this.showPaymentDetails = false;





        console.log("appReference",appReference)
        const obj = {
            module: 'Tour',
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
            this.walletPayment(appReference);
        }

        this.showPaymentDetails = false;
    }

    confirmTicket() {
    this.form.nativeElement.submit();
    
    }

    checkWallet(appReference) {
        this.loading=true;
       this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
            .subscribe(res => {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.showDeductCredit = false;
                    } else {
                        this.showDeductCredit = true;
                    }
                // }
            }, (err) => {
                this.loading=false;
            });
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
                        // this.updateSubAgent(res);
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
                    // res['data']['access_token'] = this.currentUser.access_token || '';
                    sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
                });
            }
        })
    }
    deductFromWallet(appReference) {
          this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
            if (res) {
                if (res.data[2].order_id && res.data[2].RemainingBalance > 0) {
                    this.swalService.alert.success("Your transaction successful.");
                    this.loading=false;
                    this.onTourRedirect(appReference, 'voucher');
                }
            }

        }, (err) => {
            this.loading=false;
            this.swalService.alert.oops("Your wallet balance is not sufficient.");
        });
    }


    getCancellationFee(canc_attributes: any, cancel_deadline: string | Date) {
        if (!canc_attributes || !cancel_deadline) {
            return null;
        }

        let cancAttributes;
        try {
            cancAttributes = typeof canc_attributes === 'string' ? JSON.parse(canc_attributes) : canc_attributes;
        } catch (err) {
            return null;
        }
        const cancellationDeadline = moment(cancel_deadline);

        for (const attr of cancAttributes) {
            if (attr && attr.date_from_original) {
                if (moment(attr.date_from_original).isSame(cancellationDeadline, 'day')) {
                    return attr.actualCancelAmount ? attr.actualCancelAmount : null;
                }
            }
        }

        for (const attr of cancAttributes) {
            if (!attr) continue;
            const from = attr.from ? moment(attr.from) : (attr.date_from_original ? moment(attr.date_from_original) : null);
            const to = attr.to ? moment(attr.to) : (attr.date_to_original ? moment(attr.date_to_original) : null);

            if (from && to) {
                if (cancellationDeadline.isBetween(from, to, 'day', '[]')) {
                    return attr.actualCancelAmount ? attr.actualCancelAmount : null;
                }
            }
        }

        return null;
    }

   getCancellationDeadLine(canc_attributes: any, cancel_deadline: string | Date) {
    if (!canc_attributes || !cancel_deadline) {
        return null;
    }

    let cancAttributes;
    try {
        cancAttributes = typeof canc_attributes === 'string'
            ? JSON.parse(canc_attributes)
            : canc_attributes;
    } catch (err) {
        return null;
    }

    const cancellationDeadline = moment(cancel_deadline);

    for (const attr of cancAttributes) {
        if (attr && attr.date_from_original) {

            const attrDate = moment(attr.date_from_original);

            // ✅ Match only the DATE (ignore time)
            if (attrDate.isSame(cancellationDeadline, "day")) {

                // Combine matched date + the time in attribute
                if (attr.time) {
                    return moment(
                        attrDate.format("YYYY-MM-DD") + " " + attr.time,
                        "YYYY-MM-DD hh:mm A"
                    ).format("DD/MM/YYYY hh:mm A");
                }

                // If no time exists, return only date
                return attrDate.format("DD/MM/YYYY");
            }
        }
    }

    return null;
}

onPaymentMethodChangeWallet(event) {
  this.removePaymentGateWay();
}

removePaymentGateWay() {
    const obj = {
      app_reference: this.payReference,
      module: "Tour"
    };

    this.apiHandlerService.apiHandler('removePaymentCharges', 'POST','','', obj).subscribe((response) => {

    })
  }

  
  onPaymentMethodChange(event) {
    const reqObj = {
        module: 'Tour',
        app_reference: this.payReference
    }
    this.apiHandlerService.apiHandler('getPaymentCharges', 'POST', '', '', reqObj).subscribe((resp) => {
        if(resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201) ) {
            // const convenienceFee = resp.data.ConvenienceFee;
            // this.convienienceFeeAdd  = this.convienienceFee;
            // this.totalDispalyFare = resp.data.TotalFare;
            // this.showConvenienceFee = true
            // this.totalPriceHotel = convenienceFee;
        }
    })
}

}
