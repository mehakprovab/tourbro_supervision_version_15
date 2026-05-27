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
import * as moment from 'moment';
import autoTable from 'jspdf-autotable';

const log = new Logger('report/B2cTransferComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-b2b-tour',
  templateUrl: './b2b-tour.component.html',
  styleUrls: ['./b2b-tour.component.scss']
})
export class B2bTourComponent implements OnInit {

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
      { key: 'dmc_supplier_name', value: 'Supplier Name'},
      { key: 'buyer_ta_name', value: 'Buyer TA Name'},
      { key: 'FirstName', value: 'Lead Passenger Name' },
      { key: 'Email', value: 'Lead Passenger Email' },
      { key: 'PhoneNumber', value: 'Lead Passenger Phone' },
      { key: 'ProductName', value: 'Tour Name' },
      { key: 'City', value: 'City' },
      { key: 'Country', value: 'Country' },
      { key: 'TravelDatetime', value: 'Travel Date' },
      { key: 'NoOfAdults', value: 'No Of Adults' },
      { key: 'NoOfChild', value: 'No Of Child' },
      { key: 'optionalTours', value: 'Optional Tours' },
      { key: 'optionalTourPrice', value: 'Optional Tours Price' },
      { key: 'SupplierNetFare', value: 'Supplier Net Fare'},
      { key: 'AdminNetFare', value: 'Total Display Fare' },
      { key: 'admin_markup', value: 'Admin Markup' },
      { key: 'agent_markup', value: 'Agent Markup' },
      { key: 'agent_paid', value: 'Agent Paid Amount' },
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
  @ViewChild('b2b-tour-report', { static: false }) tableToExport: ElementRef;
showMandatoty: boolean = false;
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
      private exportAsService: ExportAsService,
      private utility: UtilityService,
      private router: Router
  ) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));

    if(this.loggedInUser.auth_role_id === 7) {
        this.displayColumn.splice(5,2);
        this.displayColumn.splice(17,6);
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
      this.regConfig.patchValue({
          status: 'ALL',
      });
      this.searchText = "";
      this.getB2cTransferReport();
  }

  getB2cTransferReport() {
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    const getUserId = JSON.parse(currentDomainUser);
      this.noData = true;
      this.respData = [];
      this.subSunk.sink = this.apiHandlerService.apiHandler('b2bTourReport', 'post', {}, {},
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

  cancelTicket(){
    const reqBody = {
        AppReference : this.cancelData.bookingDetails[0].App_Reference,
        booking_source: this.cancelData.bookingDetails[0].BookingSource
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('cancelTour', 'post', {}, {}, reqBody).subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success('Booking Cancelled!!');
            this.showConfirm = false;
            this.onSearchSubmit()
        } else {
            this.swalService.alert.oops(resp.Message);
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

  download(type: SupportedExtensions, orientation?: string) {
    // if (type)
    this.config.type = type;
    if (orientation) {
        this.config.options.jsPDF.orientation = orientation;
    }
    const date = new Date().toDateString();
    this.exportAsService.save(this.config, `b2b-tour-report`)
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
  if (!this.respData || !this.respData.length) return;

  const doc = new jsPDF('l', 'mm', 'a3');

  const headers = [[
    "S.No", "Status", "Application Reference",
    "Confirmation Reference", "Supplier Name", "Agent Name",
    "Passenger Name", "Email", "Phone", "Tour Name", "City",
    "Country", "Travel Date", "Adult", "Child", "Optional Tours",
    "Supplier Opt Price", "Supplier Total", "Total Fare",
    "Markup", "Agent Markup", "Agent Net Fare", "Currency",
    "TotalFareDup", "Payment Status", "Created At",
    "Deadline", "Cancelled On", "Cancel Fee"
  ]];

  const rows = this.respData.map((data: any, index: number) => {
    const row: any[] = [];

    row.push(index + 1);
    row.push(data.bookingDetails[0].Status);
    row.push(data.bookingDetails[0].App_Reference);
    row.push(data.bookingDetails[0].BookingReference || 'N/A');
    row.push(data.bookingDetails[0].supplier_business_name || 'N/A');
    row.push(data.bookingDetails[0].agent_business_name || 'N/A');
    row.push(data.paxDetails[0].Title + ' ' + data.paxDetails[0].FirstName + ' ' + data.paxDetails[0].LastName);
    row.push(data.paxDetails[0].Email || 'N/A');
    row.push('+' + data.paxDetails[0].PhoneCode + '-' + (data.paxDetails[0].Contact || 'N/A'));
    row.push(data.bookingDetails[0].PackageName);
    row.push(data.bookingDetails[0].StartCity);
    row.push(data.bookingDetails[0].tour_country);
    row.push(data.bookingDetails[0].DepartureDate);
    row.push(data.bookingDetails[0].AdultCount);
    row.push(data.bookingDetails[0].ChildCount);

    let optTours = "";
    if (data.bookingDetails[0].OptionalTours) {
      optTours = this.getOptionalTours(data.bookingDetails[0].OptionalTours)
        .map((t: any, i: number) => `${i + 1}. ${t.name} (${t.price})`)
        .join('\n');
    }
    row.push(optTours);

    row.push(data.bookingDetails[0].SupplierOptionalToursPrice);
    row.push(data.bookingDetails[0].SupplierTotalFare);
    row.push(data.bookingDetails[0].TotalFare);
    row.push(data.bookingDetails[0].Markup || 0);
    row.push(data.bookingDetails[0].AgentMarkup || 0);
    row.push(data.bookingDetails[0].AgentNetFare || 0);
    row.push(data.bookingDetails[0].Currency_Code);
    row.push(data.bookingDetails[0].TotalFare);
    row.push(data.bookingDetails[0].Paymnet_Status);
    row.push(data.bookingDetails[0].created_at);
    row.push(this.getCancellationDeadLine(
      data.bookingDetails[0].canc_attributes,
      data.bookingDetails[0].cancel_deadline
    ));
    row.push(data.bookingDetails[0].cancelled_on);

    const cancelFee =
      data.bookingDetails[0].Status === 'CANCELLED' ||
      data.bookingDetails[0].Status === 'BOOKING_CANCELLED'
        ? this.getCancellationFee(
            data.bookingDetails[0].canc_attributes,
            data.bookingDetails[0].cancel_deadline
          )
        : '';

    row.push(cancelFee);

    return row;
  });


  // --- COLUMN WIDTHS FOR ALL 31 COLUMNS ---
  const columnWidths: any = {
    0: { cellWidth: 10 },   // S.No
    1: { cellWidth: 12 },   // Action
    2: { cellWidth: 18 },   // Status
    3: { cellWidth: 35 },   // Application Ref
    4: { cellWidth: 35 },   // Confirmation Ref
    5: { cellWidth: 35 },   // Supplier Name
    6: { cellWidth: 30 },   // Agent Name
    7: { cellWidth: 35 },   // Passenger Name
    8: { cellWidth: 35 },   // Email
    9: { cellWidth: 25 },   // Phone
    10: { cellWidth: 35 },  // Tour Name
    11: { cellWidth: 20 },  // City
    12: { cellWidth: 20 },  // Country
    13: { cellWidth: 22 },  // Travel Date
    14: { cellWidth: 12 },  // Adult
    15: { cellWidth: 12 },  // Child
    16: { cellWidth: 40 },  // Optional Tours
    17: { cellWidth: 25 },  // Supplier Opt Price
    18: { cellWidth: 25 },  // Supplier Total
    19: { cellWidth: 25 },  // Total Fare
    20: { cellWidth: 18 },  // Markup
    21: { cellWidth: 18 },  // Agent Markup
    22: { cellWidth: 25 },  // Agent Net Fare
    23: { cellWidth: 15 },  // Currency
    24: { cellWidth: 25 },  // TotalFareDup
    25: { cellWidth: 22 },  // Payment Status
    26: { cellWidth: 25 },  // Created At
    27: { cellWidth: 25 },  // Deadline
    28: { cellWidth: 25 },  // Cancelled On
    29: { cellWidth: 20 },  // Cancel Fee
  };

autoTable(doc, {
  head: headers,
  body: rows,

  styles: {
    fontSize: 4,
    cellWidth: 12,
    overflow: 'linebreak',
    lineWidth: 0,       // ❗ NO BORDER ANYWHERE
  },

  headStyles: {
    fillColor: [245, 245, 245],  // ≈ rgba(0,0,0,0.03)
    textColor: [0, 0, 0],        // black text
    fontSize: 5,
    fontStyle: 'bold',
    lineWidth: 0                 // ❗ HEADER ALSO HAS NO BORDER
  },

  columnStyles: {
    7: { cellWidth: 25 },
    16: { cellWidth: 40 }
  },

  tableWidth: 'auto',
  margin: { top: 15 }
});

  doc.save("Booking247_Tour_Report.pdf");
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
          this.router.navigate(['/report/b2b-tour/voucher'], { queryParams: { AppReference: appRef } });
      else if (type == 'invoice')
          this.router.navigate(['/report/b2b-tour/invoice'], { queryParams: { AppReference: appRef } });
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

  showConversationPage(data) {
    console.log(data.bookingDetails[0].BookingPage[0].url);
    window.open(data.bookingDetails[0].BookingPage[0].url,'_blank')
  }

  getOptionalTours(data) {
    if(data) {

        return JSON.parse(data.replace(/\\/g, ''));
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
