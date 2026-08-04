import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-guide-voucher',
  templateUrl: './guide-voucher.component.html',
  styleUrls: ['./guide-voucher.component.scss']
})
export class GuideVoucherComponent implements OnInit, OnDestroy {
  @ViewChild('voucher', { static: false }) voucher: ElementRef;
  private subSunk = new SubSink();
  appReference = '';
  voucherData: any;
  booking: any = {};
  loading = false;
  isExporting = false;

  constructor(
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef,
    private utility: UtilityService
  ) {}

  ngOnInit(): void {
    this.subSunk.sink = this.route.queryParams.subscribe(params => {
      this.appReference = params.AppReference || params.appReference || '';
      if (this.appReference) {
        this.getVoucher();
      }
    });
  }

  getVoucher(): void {
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('guideVoucher', 'post', {}, {}, {
      AppReference: this.appReference
    }).subscribe((response: any) => {
      this.loading = false;
      if (response && (response.statusCode === 200 || response.statusCode === 201 || response.Status === true)) {
        const payload = response.data && response.data.data ? response.data.data : response.data;
        this.voucherData = Array.isArray(payload) ? payload[0] : payload;
        this.booking = this.voucherData && (
          this.voucherData.BookingDetails || this.voucherData.booking_details || this.voucherData.booking
        ) || this.voucherData || {};
        this.cdr.detectChanges();
      } else {
        this.voucherData = null;
        this.swalService.alert.oops((response && (response.msg || response.Message)) || 'Voucher data not found.');
      }
    }, () => {
      this.loading = false;
      this.voucherData = null;
      this.swalService.alert.oops('Unable to load the guide voucher.');
    });
  }

  value(source: any, ...keys: string[]): any {
    if (!source) {
      return '';
    }
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
        return source[key];
      }
    }
    return '';
  }

  detail(...keys: string[]): any {
    return this.value(this.booking, ...keys) || this.value(this.voucherData, ...keys);
  }

  customerName(): string {
    return this.detail('name', 'customer_name', 'lead_passenger_name', 'CustomerName') ||
      [this.detail('first_name', 'FirstName'), this.detail('last_name', 'LastName')].filter(Boolean).join(' ');
  }

  getStatusLabel(status: any): string {
    switch (Number(status)) {
      case 1: return 'Accepted';
      case 2: return 'Rejected';
      case 3: return 'Pending';
      default: return 'N/A';
    }
  }

  getStatusClass(status: any): string {
    switch (Number(status)) {
      case 1: return 'badge-success';
      case 2: return 'badge-danger';
      case 3: return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

printVoucher(): void {
  this.isExporting = true;
  this.cdr.detectChanges();

  setTimeout(() => {
    const element = this.voucher && this.voucher.nativeElement;
    this.utility.printElement(element, `Guide Voucher - ${this.appReference}`);

    setTimeout(() => {
      this.isExporting = false;
      this.cdr.detectChanges();
    }, 500);
  }, 100);
}

  downloadVoucher(): void {
    if (!this.voucher || !this.voucher.nativeElement) {
      return;
    }
    this.loading = true;
    this.isExporting = true;
    this.cdr.detectChanges();
    const exportElement = this.utility.prepareExportElement(this.voucher.nativeElement);
    setTimeout(() => html2canvas(exportElement, { useCORS: true, scale: 2, logging: false })
      .then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const width = 210 - (margin * 2);
        const height = canvas.height * width / canvas.width;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, width, height);
        pdf.save(`Guide Voucher - ${this.appReference}.pdf`);
        this.loading = false;
        this.isExporting = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.isExporting = false;
        this.swalService.alert.oops('Unable to download the voucher.');
      }), 0);
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
