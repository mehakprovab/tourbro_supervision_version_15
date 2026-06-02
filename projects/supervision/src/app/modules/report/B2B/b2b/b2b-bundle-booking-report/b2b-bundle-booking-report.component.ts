import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const log = new Logger('report/B2cTransferComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2b-bundle-booking-report',
  templateUrl: './b2b-bundle-booking-report.component.html',
  styleUrls: ['./b2b-bundle-booking-report.component.scss']
})
export class B2bBundleBookingReportComponent implements OnInit {

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
    { key: 'refNumber', value: 'Booking Reference Number' },
    { key: 'flightAppReference', value: 'Flight AppReference' },
    { key: 'flightBookingStatus', value: 'Flight Booking Status' },
    { key: 'flightTotal', value: 'Flight Total' },
    { key: 'hotelAppReference', value: 'Hotel AppReference' },
    { key: 'hotelBookingStatus', value: 'Hotel Booking Status' },
    { key: 'hotelTotal', value: 'Hotel Total' },
    { key: 'activityAppReference', value: 'Activity AppReference' },
    { key: 'activityBookingStatus', value: 'Activity Booking Status' },
    { key: 'activityTotal', value: 'Activity Total' },
    { key: 'transferAppReference', value: 'Transfer AppReference' },
    { key: 'transferBookingStatus', value: 'Transfer Booking Status' },
    { key: 'transferTotal', value: 'Transfer Total' },
    { key: 'currency', value: 'Currency' },
    { key: 'grandTotal', value: 'Grand Total' },
    { key: 'PaymentStatus', value: 'Payment Status' },
    { key: 'BookedOn', value: 'BookedOn' },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'b2b-bundle-report',
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
  @ViewChild('b2b-bundle-report', { static: false }) tableToExport: ElementRef;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private exportAsService: ExportAsService,
    private utility: UtilityService,
    private router: Router
  ) { }

  ngOnInit() {
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

    this.regConfig.patchValue({
      booked_from_date: fromDate,
      booked_to_date: tommorow
    })

    this.getB2bBundleBookingReport();
  }

  onSearchSubmit() {
    this.getB2bBundleBookingReport();
  }

  onReset() {
    this.regConfig.reset();
    this.regConfig.patchValue({
      status: 'ALL',
    });
    this.searchText = "";
    this.getB2bBundleBookingReport();
  }

  getB2bBundleBookingReport() {
    this.noData = true;
    this.respData = [];
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cBundleBookingReport', 'post', {}, {},
      {
        // "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
        // "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
        // "status": this.regConfig.value.status || "BOOKING_HOLD",
        // "app_reference": this.regConfig.value.app_reference || "",
        // "phone_number": this.regConfig.value.phone_number || "",
        // "email": this.regConfig.value.email || "",
        "createdBy": 0
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

  cancelTicket(appReference) {
    const reqBody = {
      AppReference: appReference
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('cancelTour', 'post', {}, {}, reqBody).subscribe(resp => {
      if (resp.statusCode == 200 || resp.statusCode == 201) {
        this.swalService.alert.success('Booking Cancelled!!');
        this.onSearchSubmit()
      }
    }, (err) => {
      this.swalService.alert.oops('cancellation Failed!!');
    })
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
    data.pax.forEach(item => {
      const paxType = item.pax_type;
      if (paxType) {
        counts[paxType] = (counts[paxType] || 0) + 1;
      }
    });
    return counts;
  }

  receiveSearchValues($event) {
    console.log("in transaction logs", $event)
    let resultData = [];
    if ($event.fromDate && $event.toDate || $event.transactionId) {
      if ($event.fromDate && $event.toDate) {
        resultData = this.respData.filter(function (a) {
          return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.toDate).getTime())
        });
      } else if ($event.transactionId) {
        resultData = this.respData.filter(b => {
          return b.app_refernce == $event.transactionId;
        })
      }
      this.respData = resultData;
      respDataCopy = [...this.respData];
      this.collectionSize = respDataCopy.length;
    } else {
      this.getB2bBundleBookingReport();
    }
  }

  download(type: SupportedExtensions, orientation?: string) {
    // if (type)
    this.config.type = type;
    if (orientation) {
        this.config.options.jsPDF.orientation = orientation;
    }
    const date = new Date().toDateString();
    this.exportAsService.save(this.config, `b2b-Bundle-Report`).subscribe();
}

pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
        pdf.setPage(i);
        pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
}

  downloadPdf() {
    const element = document.getElementById('b2b-bundle-report');
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('B2B_Bundle_Report.pdf');
        this.swalService.alert.success();
    });
}

  cancelTicketPopup(data) {
    this.subjectName = 'Cancel';
    this.showConfirm = true;
    this.cancelData = data;
  }

  //   cancelTicket() {
  //       let data = this.cancelData;
  //       this.showConfirm = false;
  //       this.load = true;
  //       let userDetails = JSON.parse(sessionStorage.getItem('currentSupervisionUser'))
  //       let reqBody = {
  //           "AppReference": data.app_reference,
  //           "UserType": "B2C",
  //           "BookingSource": 'ZBAPINO00002',
  //           "UserId": userDetails.id
  //       }
  //       this.subSunk.sink = this.apiHandlerService.apiHandler('cancelTransferBooking', 'post', '', '', reqBody).subscribe(res => {
  //           if (res && res.data) {
  //               this.swalService.alert.success("Ticket cancelled sucessfully");
  //               this.load = false;
  //               this.getB2cTransferReport();
  //           }
  //       }, err => {
  //           this.load = false;
  //           this.swalService.alert.oops(err.error.Message);
  //       });
  //   }

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

  // onTourRedirect(appRef, type) {
  //     if (type == 'voucher')
  //         this.router.navigate(['/report/b2c-tour/voucher'], { queryParams: { AppReference: appRef } });
  //     else if (type == 'invoice')
  //         this.router.navigate(['/report/b2c-tour/invoice'], { queryParams: { AppReference: appRef } });
  //     else
  //         return false;
  // }
  onActivityRedirect(appRef, type) {
    if (type == 'voucher')
      this.router.navigate(['/report/b2b-activity/voucher'], { queryParams: { appReference: appRef } });
    else if (type == 'invoice')
      this.router.navigate(['/report/b2b-activity/invoice'], { queryParams: { appReference: appRef } });
    else
      return false;
  }

  onHotelRedirect(appRef, type) {
    if (type == 'voucher')
      this.router.navigate(['/report/b2b-hotel/voucher'], { queryParams: { appReference: appRef } });
    else if (type == 'invoice')
      this.router.navigate(['/report/b2b-hotel/invoice'], { queryParams: { appReference: appRef } });
    else
      return false;
  }

  onVoucherRedirect(appRef, type) {
    if (type == 'voucher')
        this.router.navigate(['/report/transfer/voucher'], { queryParams: { appReference: appRef } });
    else if (type == 'invoice')
        this.router.navigate(['/report/b2b-transfer/invoice'], { queryParams: { appReference: appRef } });
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

}
