import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-heli-voucher',
  templateUrl: './heli-voucher.component.html',
  styleUrls: ['./heli-voucher.component.scss']
})
export class HeliVoucherComponent implements OnInit, OnDestroy {
  @ViewChild('print_voucher', { static: false }) printVoucherRef: ElementRef;

  private subSunk = new SubSink();
  appReference = '';
  voucherData: any;
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
      this.getVoucher();
    });
  }

  getVoucher() {
    if (!this.appReference) {
      return;
    }

    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('heliVoucher', 'post', {}, {}, {
      AppReference: this.appReference,
    }).subscribe(resp => {
      this.loading = false;
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        const voucherData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
        this.voucherData = voucherData && voucherData.BookingDetails ? voucherData.BookingDetails : voucherData;
        this.bookingPaxDetails = voucherData && Array.isArray(voucherData.BookingPaxDetails) ? voucherData.BookingPaxDetails : [];
      } else {
        this.swalService.alert.error(resp.msg || '');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load voucher');
    });
  }

  get attributes(): any {
    return this.parseJson(this.voucherData && this.voucherData.Attributes);
  }

  get paxList(): any[] {
    if (this.bookingPaxDetails.length) {
      return this.bookingPaxDetails;
    }
    return this.voucherData && Array.isArray(this.voucherData.pax) ? this.voucherData.pax : [];
  }

  get leadPax(): any {
    return this.paxList.find(pax => pax.is_lead_pax === 1 || pax.IsLeadPax === 1) || this.paxList[0] || {};
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
    const mobile = this.leadPax.mobile || this.leadPax.Mobile || this.voucherData && (this.voucherData.PhoneNumber || this.voucherData.phone_number);
    return mobile ? `${phoneCode ? `+${phoneCode} ` : ''}${mobile}` : 'N/A';
  }

  getPassengerCount(): number {
    return this.paxList.length || this.attributes.passengers || 0;
  }

  getCurrency(): string {
    return this.voucherData && (this.voucherData.currency || this.voucherData.Currency || this.attributes.currency || this.attributes.Currency) || '';
  }

  getDurationLabel(): string {
    return this.voucherData && this.voucherData.duration ? `${this.voucherData.duration} mins` : 'N/A';
  }

  getPaxName(pax: any): string {
    if (pax.name) {
      return `${pax.title || ''} ${pax.name}`.trim();
    }
    return `${pax.Title || ''} ${pax.FirstName || ''} ${pax.LastName || ''}`.trim() || 'N/A';
  }

  getPaxGender(pax: any): string {
    return pax.gender || pax.Gender || 'N/A';
  }

  getPaxAge(pax: any): string {
    return pax.age || pax.Age || 'N/A';
  }

  getPaxWeight(pax: any): string {
    return pax.weight || pax.Weight || 'N/A';
  }

  getPaxKycDocument(pax: any): string {
    return pax.kyc_document || pax.KycDocument || '';
  }

  getTermsAndConditionHtml(): string {
    const terms = this.parseJson(this.voucherData && this.voucherData.TermsAndCondition);
    return typeof terms === 'string' ? terms : '';
  }

  getHelipadName(value: any): string {
    const helipad = this.parseJson(value);
    return helipad && helipad.name ? helipad.name : 'N/A';
  }

  getBookingStatusLabel(status: string): string {
    switch (status) {
      case 'BOOKING_FAILED': return 'Booking Failed';
      case 'BOOKING_CONFIRMED': return 'Booking Confirmed';
      case 'BOOKING_CANCELLED': return 'Booking Cancelled';
      case 'BOOKING_INPROGRESS': return 'Booking Inprogress';
      case 'BOOKING_HOLD': return 'Booking Hold';
      default: return status || 'N/A';
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'BOOKING_CONFIRMED': return 'badge-success';
      case 'BOOKING_FAILED':
      case 'BOOKING_CANCELLED': return 'badge-danger';
      case 'BOOKING_INPROGRESS': return 'badge-info';
      case 'BOOKING_HOLD': return 'badge-warning';
      default: return 'badge-info';
    }
  }

  printVoucher() {
    window.print();
  }

  downloadPdf() {
    const element = document.getElementById('heli-voucher');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Heli Voucher - ${this.appReference}.pdf`);
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
