import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-guide-report',
  templateUrl: './guide-report.component.html',
  styleUrls: ['./guide-report.component.scss']
})
export class GuideReportComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  reportData: any[] = [];
  loading = false;
  searchText = '';
  page = 1;
  pageSize = 50;
  regConfig: FormGroup;
  isOpen = false;
  maxDate = new Date();
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  showPaymentDetails = false;
  selectedPayment: any;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private router: Router,
    private utility: UtilityService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.regConfig = this.fb.group({
      booked_from_date: new FormControl('', [Validators.required]),
      booked_to_date: new FormControl('', [Validators.required]),
      app_reference: new FormControl('', [Validators.maxLength(120)]),
      phone_number: new FormControl('', [Validators.maxLength(50), Validators.pattern(/^[+0-9()\-\s]*$/)]),
      email: new FormControl('', [Validators.email, Validators.maxLength(120)]),
      status: new FormControl('ALL')
    });
    this.setDefaultDates();
    this.getGuideReport();
  }

  onSearchSubmit(): void {
    if (this.regConfig.invalid) {
      this.regConfig.markAllAsTouched();
      return;
    }
    this.page = 1;
    this.getGuideReport();
  }

  onReset(): void {
    this.regConfig.reset({ status: 'ALL' });
    this.setDefaultDates();
    this.searchText = '';
    this.page = 1;
    this.getGuideReport();
  }

  getGuideReport(): void {
    this.loading = true;
    this.reportData = [];
    const payload = {
      booked_from_date: formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
      booked_to_date: formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
      status: this.regConfig.value.status === 'ALL' ? 'ALL' : Number(this.regConfig.value.status),
      app_reference: (this.regConfig.value.app_reference || '').trim(),
      phone_number: (this.regConfig.value.phone_number || '').trim(),
      email: (this.regConfig.value.email || '').trim()
    };
    this.subSunk.sink = this.apiHandlerService.apiHandler('guideReport', 'post', {}, {}, payload)
      .subscribe((response: any) => {
        this.loading = false;
        this.reportData = this.sortLatestFirst(
  this.applyFilters(this.extractRows(response))
);
      }, () => {
        this.loading = false;
        this.reportData = [];
      });
  }

  viewVoucher(row: any): void {
    const appReference = this.value(row, 'app_reference', 'AppReference', 'application_reference');
    if (!appReference) {
      return;
    }
    this.router.navigate(['/report/guide-report/voucher'], {
      queryParams: { AppReference: appReference }
    });
  }

  exportExcel(): void {
    const rows = this.reportData.map((row, index) => ({
      'S No.': index + 1,
      'Application Reference': this.value(row, 'app_reference', 'AppReference', 'application_reference'),
      'Status': this.getStatusLabel(this.value(row, 'status', 'booking_status')),
      'Payment Status': this.value(row, 'payment_status', 'PaymentStatus'),
      'Customer Name': this.customerName(row),
      'City': this.value(row, 'city', 'City'),
      'Hotel': this.value(row, 'hotel', 'hotel_name', 'Hotel'),
      'From Date': this.value(row, 'from_date', 'FromDate', 'travel_from_date'),
      'To Date': this.value(row, 'to_date', 'ToDate', 'travel_to_date'),
      'Phone': this.phone(row),
      'Email': this.value(row, 'email', 'Email'),
      'Language': this.value(row, 'language', 'Language'),
      'Guide Name': this.value(row, 'guide_name', 'GuideName'),
      'Guide Mobile': this.value(row, 'guide_mobile', 'GuideMobile'),
      'Price': this.value(row, 'price', 'amount', 'total_fare', 'TotalFare'),
      'Reported At': this.value(row, 'created_at', 'BookedOn', 'booked_on')
    }));
    const columnWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(key.length + 4, 18)
    }));
    this.utility.exportToExcel(rows, 'Guide Report', columnWidths);
  }

  exportPdf(): void {
    this.utility.downloadElementAsPdf('guide-report-table', 'Guide Report', 'landscape');
  }

  value(row: any, ...keys: string[]): any {
    if (!row) {
      return '';
    }
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    return '';
  }

  customerName(row: any): string {
    return this.value(row, 'name', 'customer_name', 'lead_passenger_name', 'CustomerName') ||
      [this.value(row, 'first_name', 'FirstName'), this.value(row, 'last_name', 'LastName')]
        .filter(Boolean).join(' ');
  }

  phone(row: any): string {
    return [this.value(row, 'phone_code', 'PhoneCode'), this.value(row, 'phone', 'mobile_number', 'PhoneNumber')]
      .filter(Boolean).join(' ');
  }

  hasVoucher(row: any): boolean {
    return !!this.value(row, 'app_reference', 'AppReference', 'application_reference');
  }

  canPayNow(row: any): boolean {
    const paymentStatus = String(row && row.payment_status || '').toLowerCase().replace('_', ' ');
    return this.hasVoucher(row) && Number(row.status) === 1 &&
      (paymentStatus === 'not paid' || paymentStatus === 'unpaid');
  }

  openPayment(row: any): void {
    this.selectedPayment = {
      appReference: row.app_reference,
      source: 'guide',
      name: this.customerName(row),
      phone: this.phone(row),
      email: row.email || '',
      amount: Number(row.price || 0)
    };
    this.showPaymentDetails = true;
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

  numberOnly(event: KeyboardEvent): boolean {
    return /[0-9+()\-\s]/.test(event.key);
  }

  private setDefaultDates(): void {
    const toDate = new Date();
    const fromDate = new Date(toDate.valueOf() - (30 * 24 * 60 * 60 * 1000));
    this.regConfig.patchValue({
      booked_from_date: fromDate,
      booked_to_date: toDate
    });
  }

  private extractRows(response: any): any[] {
    const payload = response && response.data;
    const candidates = [
      payload,
      payload && payload.data,
      payload && payload.result,
      payload && payload.guideReport,
      response && response.result
    ];
    return candidates.find(candidate => Array.isArray(candidate)) || [];
  }

  private applyFilters(rows: any[]): any[] {
    const filters = this.regConfig.value;
    const appReference = String(filters.app_reference || '').trim().toLowerCase();
    const phone = String(filters.phone_number || '').replace(/\s/g, '').toLowerCase();
    const email = String(filters.email || '').trim().toLowerCase();
    const status = filters.status === 'ALL' ? null : Number(filters.status);
    const fromDate = this.startOfDay(filters.booked_from_date);
    const toDate = this.endOfDay(filters.booked_to_date);

    return rows.filter(row => {
      const rowReference = String(row.app_reference || '').toLowerCase();
      const rowPhone = `${row.phone_code || ''}${row.phone || ''}`.replace(/\s/g, '').toLowerCase();
      const rowEmail = String(row.email || '').toLowerCase();
      const rowCreatedAt = row.created_at ? new Date(row.created_at).getTime() : null;

      return (!appReference || rowReference.includes(appReference)) &&
        (!phone || rowPhone.includes(phone)) &&
        (!email || rowEmail.includes(email)) &&
        (status === null || Number(row.status) === status) &&
        (rowCreatedAt === null || (rowCreatedAt >= fromDate && rowCreatedAt <= toDate));
    });
  }

  private startOfDay(value: any): number {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  private endOfDay(value: any): number {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date.getTime();
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
  private sortLatestFirst(rows: any[]): any[] {
  return [...rows].sort((a, b) => {
    const dateA = this.getRowDate(a);
    const dateB = this.getRowDate(b);
    return dateB - dateA;
  });
}

private getRowDate(row: any): number {
  const dateValue = this.value(
    row,
    'created_at',
    'booked_on',
    'BookedOn',
    'booking_date',
    'request_date'
  );

  return dateValue ? new Date(dateValue).getTime() : 0;
}
}
