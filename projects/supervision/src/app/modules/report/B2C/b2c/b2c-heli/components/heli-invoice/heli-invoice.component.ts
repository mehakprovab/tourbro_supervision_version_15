import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-heli-invoice',
  templateUrl: './heli-invoice.component.html',
  styleUrls: ['./heli-invoice.component.scss']
})
export class HeliInvoiceComponent implements OnInit, OnDestroy {
  @ViewChild('print_invoice', { static: false }) printInvoiceRef: ElementRef;

  private subSunk = new SubSink();
  appReference = '';
  invoiceData: any;
  bookingPaxDetails: any[] = [];
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.appReference = queryParams.appReference || '';
      this.getInvoice();
    });
  }

  getInvoice() {
    if (!this.appReference) {
      return;
    }

    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('heliVoucher', 'post', {}, {}, {
      AppReference: this.appReference,
    }).subscribe(resp => {
      this.loading = false;
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        const invoiceData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
        this.invoiceData = invoiceData && invoiceData.BookingDetails ? invoiceData.BookingDetails : invoiceData;
        this.bookingPaxDetails = invoiceData && Array.isArray(invoiceData.BookingPaxDetails) ? invoiceData.BookingPaxDetails : [];
      } else {
        this.swalService.alert.error(resp.msg || '');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load invoice');
    });
  }

  get attributes(): any {
    return this.parseJson(this.invoiceData && this.invoiceData.Attributes);
  }

  get paxList(): any[] {
    if (this.bookingPaxDetails.length) {
      return this.bookingPaxDetails;
    }
    return this.invoiceData && Array.isArray(this.invoiceData.pax) ? this.invoiceData.pax : [];
  }

  get leadPax(): any {
    return this.paxList.find(pax => pax.is_lead_pax === 1 || pax.IsLeadPax === 1) || this.paxList[0] || {};
  }

  get invoiceNumber(): string {
    const ref = this.invoiceData && (this.invoiceData.app_reference || this.invoiceData.booking_reference);
    return `INV-${ref || ''}`;
  }

  getLeadPaxName(): string {
    if (this.leadPax.name) {
      return `${this.leadPax.title || ''} ${this.leadPax.name}`.trim();
    }
    if (this.leadPax.FirstName || this.leadPax.LastName) {
      return `${this.leadPax.Title || ''} ${this.leadPax.FirstName || ''} ${this.leadPax.LastName || ''}`.trim();
    }
    return 'N/A';
  }

  getContactNumber(): string {
    const phoneCode = this.leadPax.phone_code || this.leadPax.PhoneCode;
    const mobile = this.leadPax.mobile || this.leadPax.Mobile || this.invoiceData && (this.invoiceData.PhoneNumber || this.invoiceData.phone_number);
    return mobile ? `${phoneCode ? `+${phoneCode} ` : ''}${mobile}` : 'N/A';
  }

  getPassengerCount(): number {
    return this.paxList.length || this.attributes.passengers || 0;
  }

  getCurrency(): string {
    return this.invoiceData && (this.invoiceData.currency || this.invoiceData.Currency || this.attributes.currency || this.attributes.Currency) || '';
  }

  getHelipadName(value: any): string {
    const helipad = this.parseJson(value);
    return helipad && helipad.name ? helipad.name : 'N/A';
  }

  printInvoice() {
    window.print();
  }

  downloadPdf() {
    const element = document.getElementById('heli-invoice');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Heli Invoice - ${this.appReference}.pdf`);
      this.swalService.alert.success();
    });
  }

  parseJson(value: any): any {
    if (!value) {
      return {};
    }
    if (typeof value === 'object') {
      return value;
    }
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'string') {
        try {
          return JSON.parse(parsed);
        } catch (error) {
          return parsed;
        }
      }
      return parsed;
    } catch (error) {
      return {};
    }
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
