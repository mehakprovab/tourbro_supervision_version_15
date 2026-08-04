import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import autoTable from 'jspdf-autotable';

const log = new Logger('report/B2cTransferComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2c-tour-report',
  templateUrl: './b2c-tour-report.component.html',
  styleUrls: ['./b2c-tour-report.component.scss']
})
export class B2cTourReportComponent implements OnInit {

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
      { key: 'booking_reference', value: 'Confirmation Reference' },
      { key: 'FirstName', value: 'Lead Passenger Name' },
      { key: 'Email', value: 'Lead Passenger Email' },
      { key: 'PhoneNumber', value: 'Lead Passenger Phone' },
      { key: 'dmcCompanyName', value: 'Supplier Name' },
      { key: 'ProductName', value: 'Tour Name' },
      { key: 'City', value: 'City' },
      { key: 'Country', value: 'Country' },
      { key: 'TravelDatetime', value: 'Travel Date' },
      { key: 'NoOfAdults', value: 'No Of Adults' },
      { key: 'NoOfChild', value: 'No Of Child' },
    //   { key: 'optionalTours', value: 'Optional Tours' },
    //   { key: 'optionalTourPrice', value: 'Optional Tour Price' },
      { key: 'SupplierNetFare', value: 'Supplier Net Fare'},
      { key: 'AdminNetFare', value: 'Total Display Fare' },
      { key: 'admin_markup', value: 'Admin Markup' },
      { key: 'ConvenienceFee', value: 'Convenience Fee' },
      { key: 'PromoCode', value: 'Promocode' },
      { key: 'Discount', value: 'Discount' },
      { key: 'Currency', value: 'Booking Currency' },
      { key: 'CustomerPaidAmount', value: 'Customer Amount' },
      { key: 'PaymentStatus', value: 'Payment Status' },
      { key: 'BookedOn', value: 'BookedOn' },
      { key: 'CancellationDeadLine', value: 'Cancellation Dead Line' },
      { key: 'CancelledOn', value: 'Cancelled On' },
      { key: 'Cancellationfee', value: 'Cancellation Fee' },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  config: any = {
      type: 'pdf',
      elementIdOrContent: 'b2c-tour-report',
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
  @ViewChild('b2c-tour-report', { static: false }) tableToExport: ElementRef;
  loggedInUser: any;
  showMailModal: boolean = false;
  enteredEmail: string = '';
  public app_reference: any;
  public loading : boolean = false;
  public primaryColour: any;
  public secondaryColour: any;
  public loadingTemplate: any;

  constructor(
      private apiHandlerService: ApiHandlerService,
      private fb: FormBuilder,
      private swalService: SwalService,
      private utility: UtilityService,
      private router: Router
  ) { }

  ngOnInit() {
    console.log(this.displayColumn)
     this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    if(this.loggedInUser.auth_role_id === 7) {
        this.displayColumn.splice(8, 1);
        console.log(this.displayColumn)
        this.displayColumn.splice(17, 7);
        console.log(this.displayColumn)
        // this.displayColumn.splice(12, 2);
        // this.displayColumn.splice(18, 5);
        // const supplierAdultFareColumn = { key: 'SupplierNetFare', value: 'Supplier Adult Fare'};
        // const supplierChildFareColumn = { key: 'SupplierNetFare', value: 'Supplier Child Fare'};
        // this.displayColumn.splice(16, 0, supplierAdultFareColumn, supplierChildFareColumn);
        // this.displayColumn.splice(18, 4);
        // this.displayColumn.splice(19,1);
    }

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

     this.getB2cTransferReport();
  }

  onSearchSubmit() {
      this.getB2cTransferReport();
  }

onReset() {
  this.regConfig.reset();

  // 🔹 Recalculate default dates (same as ngOnInit)
  let date = new Date();
  let fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 🔹 Patch values
  this.regConfig.patchValue({
    booked_from_date: fromDate,
    booked_to_date: tomorrow,
    status: 'ALL'
  });

  this.searchText = "";

  this.getB2cTransferReport();
}

  getB2cTransferReport() {
      this.noData = true;
      this.respData = [];
      const currentDomainUser = localStorage.getItem('currentDomainUser');
    const getUserId = JSON.parse(currentDomainUser);
      this.subSunk.sink = this.apiHandlerService.apiHandler('b2cTourReportList', 'post', {}, {},
          {
              "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
              "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
              "status": this.regConfig.value.status || "BOOKING_HOLD",
              "app_reference": this.regConfig.value.app_reference || "",
              "phone_number": this.regConfig.value.phone_number || "",
              "email": this.regConfig.value.email || "",
              "supplier_id": getUserId.id,
            "userType": getUserId.auth_role_id
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

  cancelTicket(appReference){
    const reqBody = {
        AppReference : appReference,
        UserId: JSON.parse(sessionStorage.getItem('currentSupervisionUser')).id
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
          this.getB2cTransferReport();
      }
  }

  download(type: any, orientation?: string) {
    this.config.type = type;
        if (type === 'xlsx' || type === 'xls') {
            this.exportExcel();
            return;
        }
        if (orientation) {
        this.config.options.jsPDF.orientation = orientation;
    }
    this.downloadPdf();
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
    if (!this.respData || !this.respData.length) {
        return;
    }

    const columns = this.getExportColumns();
    const rows = this.respData.map((data: any, index: number) => {
        return columns.map(column => this.getTourExportValue(data, column.key, index));
    });
    const doc = new jsPDF('l', 'mm', 'a3');

    autoTable(doc, {
        head: [columns.map(column => column.value)],
        body: rows,
        styles: {
            fontSize: columns.length > 24 ? 4 : 5,
            cellPadding: 1.2,
            overflow: 'linebreak',
            lineWidth: 0.1,
            lineColor: [230, 230, 230],
        },
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
        },
        margin: { top: 12, right: 5, bottom: 10, left: 5 },
        tableWidth: 'auto',
    });

    doc.save('B2C_Yatra_Report.pdf');
}

exportExcel(): void {
    const columns = this.getExportColumns();
    const rows = this.respData.map((data: any, index: number) => {
        return columns.reduce((row, column) => {
            row[column.value] = this.getTourExportValue(data, column.key, index);
            return row;
        }, {});
    });
    const columnWidths = columns.map(column => {
        return { wch: column.key === 'id' ? 8 : Math.max(column.value.length + 5, 20) };
    });

    this.utility.exportToExcel(rows, 'B2C_Yatra_Report', columnWidths);
}

private getExportColumns(): { key: string, value: string }[] {
    return this.displayColumn.filter(column => column.key !== 'Action');
}

private getTourExportValue(data: any, key: string, index: number): any {
    const booking = this.getBookingDetail(data);
    const pax = this.getLeadPaxDetail(data);

    switch (key) {
        case 'id': return index + 1;
        case 'status': return this.getBadgeText(booking.Status);
        case 'app_reference': return booking.App_Reference || 'N/A';
        case 'booking_reference': return booking.BookingReference || 'N/A';
        case 'FirstName': return this.cleanExportText(`${pax.Title || ''} ${pax.FirstName || ''} ${pax.LastName || ''}`);
        case 'Email': return pax.Email || 'N/A';
        case 'PhoneNumber': return this.cleanExportText(`${pax.PhoneCode ? '+' + pax.PhoneCode + '-' : ''}${pax.Contact || ''}`);
        case 'dmcCompanyName': return booking.supplier_business_name || 'N/A';
        case 'ProductName': return booking.PackageName || 'N/A';
        case 'City': return booking.StartCity || 'N/A';
        case 'Country': return booking.tour_country || 'N/A';
        case 'TravelDatetime': return this.formatExportDate(booking.DepartureDate);
        case 'NoOfAdults': return booking.AdultCount || 0;
        case 'NoOfChild': return this.cleanExportText(`${booking.ChildCount || 0}${booking.ChildAge ? ' (' + booking.ChildAge + ' Yrs)' : ''}`);
        case 'SupplierNetFare': return this.formatAmount(booking.SupplierTotalFare, booking.ApiCurrency);
        case 'AdminNetFare': return this.formatAmount(booking.TotalFare);
        case 'admin_markup': return booking.Markup || 0;
        case 'ConvenienceFee': return booking.Convenience_fee || 0;
        case 'PromoCode': return booking.PromoCode && booking.PromoCode !== 'null' ? booking.PromoCode : 'N/A';
        case 'Discount': return booking.Discount || 0;
        case 'Currency': return booking.Currency_Code || 'N/A';
        case 'CustomerPaidAmount': return booking.TotalFare || 0;
        case 'PaymentStatus': return booking.Paymnet_Status || 'N/A';
        case 'BookedOn': return this.formatExportDate(booking.created_at);
        case 'CancellationDeadLine': return this.getCancellationDeadLine(booking.canc_attributes, booking.cancel_deadline) || 'N/A';
        case 'CancelledOn': return this.formatExportDate(booking.cancelled_on);
        case 'Cancellationfee':
            return booking.Status === 'CANCELLED' || booking.Status === 'BOOKING_CANCELLED'
                ? this.getCancellationFee(booking.canc_attributes, booking.cancel_deadline) || 0
                : 'N/A';
        default: return booking[key] || data[key] || 'N/A';
    }
}

private getBookingDetail(data: any): any {
    return data && Array.isArray(data.bookingDetails) && data.bookingDetails.length ? data.bookingDetails[0] : {};
}

private getLeadPaxDetail(data: any): any {
    return data && Array.isArray(data.paxDetails) && data.paxDetails.length ? data.paxDetails[0] : {};
}

private formatExportDate(value: any): string {
    return value ? moment(value).format('DD/MM/YYYY') : 'N/A';
}

private formatAmount(amount: any, currency?: string): string {
    const value = amount !== undefined && amount !== null && amount !== '' ? amount : 0;
    return currency ? `${value} ${currency}` : value;
}

    private cleanExportText(value: string): string {
        const text = (value || '').replace(/\s+/g, ' ').trim();
        return text || 'N/A';
    }

    private getBadgeText(status: string): string {
        switch (status) {
            case 'BOOKING_FAILED': return 'Booking Failed';
            case 'BOOKING_CONFIRMED': return 'Booking Confirmed';
            case 'CANCELLED':
            case 'BOOKING_CANCELLED': return 'Booking Cancelled';
            case 'PROCESSING': return 'Booking Inprogress';
            case 'BOOKING_HOLD': return 'Booking Hold';
            default: return status || 'N/A';
        }
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

  onTourRedirect(appRef, type) {
      if (type == 'voucher')
          this.router.navigate(['/report/b2c-tour/voucher'], { queryParams: { AppReference: appRef } });
      else if (type == 'invoice')
          this.router.navigate(['/report/b2c-tour/invoice'], { queryParams: { AppReference: appRef } });
      else
          return false;
  }

  hide() {
      this.showModal = false;
      this.showCancelModal = false;
      this.showConfirm = false;
      this.showMailModal = false;
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
    if(data) {
        return JSON.parse(data);
    }
  }
  openEmailModal(app_reference) {
    this.showMailModal = true;
    this.app_reference = app_reference;
  }

  triggerTourEmail() {
    if (this.enteredEmail === '') {
        this.swalService.alert.oops('Please enter Email');
        return;
    }
    this.loading = true;
    const req = {
        AppReference: this.app_reference,
        email: this.enteredEmail
    }
    this.apiHandlerService.apiHandler('emailTourDetails', 'POST', {}, {}, req).subscribe({
        next: (res) => {
            if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                this.loading = false;
                this.showMailModal = false;
                this.swalService.alert.success(`Mail sent to ${this.enteredEmail} Successfully`);
            } else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
            
        }, error: (err) => {
            this.loading = false;
            this.swalService.alert.error(err.error.Message)
        }
    })
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
                    return this.loggedInUser.auth_role_id === 7 ? attr.supplier_cancellation_amount : attr.cancellation_amount || null;
                }
            }
        }

        for (const attr of cancAttributes) {
            if (!attr) continue;
            const from = attr.from ? moment(attr.from) : (attr.date_from_original ? moment(attr.date_from_original) : null);
            const to = attr.to ? moment(attr.to) : (attr.date_to_original ? moment(attr.date_to_original) : null);

            if (from && to) {
                if (cancellationDeadline.isBetween(from, to, 'day', '[]')) {
                    return this.loggedInUser.auth_role_id === 7 ? attr.supplier_cancellation_amount : attr.cancellation_amount || null;
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
}
