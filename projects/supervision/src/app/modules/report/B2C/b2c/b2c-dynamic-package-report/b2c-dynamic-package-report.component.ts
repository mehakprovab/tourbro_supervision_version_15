import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from 'ngx-bootstrap/chronos';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { Router } from '@angular/router';

interface ReportColumn {
  key: string;
  label: string;
  type?: 'date' | 'amount' | 'status';
}

@Component({
  selector: 'app-b2c-dynamic-package-report',
  templateUrl: './b2c-dynamic-package-report.component.html',
  styleUrls: ['./b2c-dynamic-package-report.component.scss']
})
export class B2cDynamicPackageReportComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  private allRows: any[] = [];

  regConfig: FormGroup;
  rows: any[] = [];
  columns: ReportColumn[] = [
    { key: 'ref_number', label: 'Package Reference' },
    { key: 'booking_status', label: 'Booking Status', type: 'status' },
    { key: 'title', label: 'Package Name' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'customer_email', label: 'Customer Email' },
    { key: 'customer_phone', label: 'Customer Phone' },
    { key: 'destinations', label: 'Destinations' },
    { key: 'from_date', label: 'Travel From', type: 'date' },
    { key: 'to_date', label: 'Travel To', type: 'date' },
    { key: 'duration_days', label: 'Duration (Days)' },
    { key: 'hotel_references', label: 'Hotel References' },
    { key: 'activity_references', label: 'Activity References' },
    { key: 'transfer_references', label: 'Transfer References' },
    { key: 'total_price', label: 'Total Price', type: 'amount' },
    { key: 'convenience_fee', label: 'Convenience Fee', type: 'amount' },
    { key: 'promo_code', label: 'Promo Code' },
    { key: 'discount_value', label: 'Discount', type: 'amount' },
    { key: 'total_after_discount', label: 'Customer Paid Amount', type: 'amount' },
    { key: 'payment_status', label: 'Payment Status', type: 'status' },
    { key: 'created_at', label: 'Booked On', type: 'date' }
  ];
  loading = false;
  searchText = '';
  page = 1;
  pageSize = 100;
  collectionSize = 0;
  maxDate = new Date();
  isFromDateOpen = false;
  isToDateOpen = false;
  showActionModal = false;
  actionView: 'voucher' | 'invoice' | 'pax' = 'voucher';
  selectedBooking: any;
  cancellingReference: string;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };

  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private utility: UtilityService,
    private swalService: SwalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.regConfig = this.fb.group({
      booked_from_date: new FormControl('', Validators.required),
      booked_to_date: new FormControl('', Validators.required),
      status: new FormControl('ALL'),
      app_reference: new FormControl('', Validators.maxLength(30)),
      phone_number: new FormControl('', Validators.maxLength(15)),
      email: new FormControl('', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'))
    });
    this.setDefaultFilters();
    this.fetchReport();
  }

  private setDefaultFilters() {
    const toDate = new Date();
    const fromDate = new Date(toDate.valueOf() - (30 * 24 * 60 * 60 * 1000));
    this.regConfig.patchValue({
      booked_from_date: fromDate,
      booked_to_date: toDate,
      status: 'ALL',
      app_reference: '',
      phone_number: '',
      email: ''
    });
  }

  fetchReport() {
    if (this.regConfig.invalid) {
      this.regConfig.markAllAsTouched();
      return;
    }

    const filters = this.regConfig.value;
    const payload = {
      booked_from_date: formatDate(filters.booked_from_date, 'YYYY-MM-DD'),
      booked_to_date: formatDate(filters.booked_to_date, 'YYYY-MM-DD'),
      status: filters.status || 'ALL',
      app_reference: (filters.app_reference || '').trim(),
      phone_number: (filters.phone_number || '').trim(),
      email: (filters.email || '').trim(),
      userType: 1
    };

    this.loading = true;
    this.rows = [];
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('b2cDynamicPackageReport', 'post', {}, {}, payload)
      .subscribe(response => {
        this.loading = false;
        const data = response && response.data !== undefined ? response.data : response;
        const records = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        this.allRows = records.map(record => this.toReportRow(record));
        this.applyFilter();
      }, () => {
        this.loading = false;
        this.allRows = [];
        this.rows = [];
        this.collectionSize = 0;
      });
  }

  onReset() {
    this.setDefaultFilters();
    this.searchText = '';
    this.page = 1;
    this.fetchReport();
  }

  applyFilter() {
    const search = (this.searchText || '').toLowerCase().trim();
    this.rows = search ? this.allRows.filter(row =>
      this.columns.some(column => String(row[column.key] == null ? '' : row[column.key]).toLowerCase().includes(search))
    ) : this.allRows.slice();
    this.collectionSize = this.rows.length;
    this.page = 1;
  }

  download(type: 'pdf' | 'xlsx') {
    if (type === 'xlsx') {
      this.utility.downloadElementAsExcel('b2c-dynamic-package-report', 'B2C_Dynamic_Package_Report');
      return;
    }
    this.utility.downloadElementAsPdf('b2c-dynamic-package-report', 'B2C_Dynamic_Package_Report', 'landscape');
  }

  openAction(row: any, view: 'voucher' | 'invoice' | 'pax') {
    if (view === 'voucher') {
      const reference = row.dynamic_package_ref || row.ref_number;
      if (!reference) {
        this.swalService.alert.oops('Dynamic package reference is missing.');
        return;
      }
      this.router.navigate(['/report/b2c-dynamic-package/voucher'], {
        queryParams: { dynamic_package_ref: reference }
      });
      return;
    }
    this.selectedBooking = row;
    this.actionView = view;
    this.showActionModal = true;
  }

  getVoucherItems(type: 'itinerary' | 'hotels' | 'activities' | 'transfers'): any[] {
    if (!this.selectedBooking) { return []; }
    const voucher = this.selectedBooking.voucherData || {};
    const source = this.selectedBooking.source || {};
    const keys = type === 'itinerary'
      ? ['itinerary_snapshot', 'itinerary', 'Itinerary']
      : [type, type.charAt(0).toUpperCase() + type.slice(1)];

    for (const container of [voucher, voucher.bookingDetails, voucher.BookingDetails, source]) {
      if (!container) { continue; }
      for (const key of keys) {
        if (Array.isArray(container[key])) { return container[key]; }
      }
    }
    return [];
  }

  getServiceReference(service: any): string {
    return service && (service.app_reference || service.AppReference || service.ref_number ||
      service.booking_reference || service.confirmation_reference) || 'N/A';
  }

  getServiceName(service: any, fallback: string): string {
    return service && (service.name || service.title || service.hotel_name || service.activity_name ||
      service.transfer_name || service.property_name || service.destination) || fallback;
  }

  closeActionModal() {
    this.showActionModal = false;
    this.selectedBooking = null;
  }

  downloadActionPdf() {
    if (!this.selectedBooking || this.actionView === 'pax') { return; }
    const name = this.actionView === 'voucher' ? 'Voucher' : 'Invoice';
    this.utility.downloadElementAsPdf(
      'dynamic-package-action-document',
      `Dynamic_Package_${name}_${this.selectedBooking.ref_number}`,
      'portrait'
    );
  }

  cancelBooking(row: any) {
    this.swalService.alert.cancel((confirmed: boolean) => {
      if (!confirmed) { return; }

      const reference = row.dynamic_package_ref || row.ref_number;
      if (!reference) {
        this.swalService.alert.oops('Dynamic package reference is missing.');
        return;
      }
      this.cancellingReference = reference;
      const currentUser: any = this.utility.readStorage('currentSupervisionUser', sessionStorage);
      const payload = {
        dynamic_package_ref: reference,
        UserId: currentUser.id
      };

      this.subSunk.sink = this.apiHandlerService
        .apiHandler('cancelDynamicPackage', 'post', {}, {}, payload)
        .subscribe((response: any) => {
          this.cancellingReference = null;
          if (response && (response.statusCode === 200 || response.statusCode === 201 || response.Status === true)) {
            this.swalService.alert.success('Dynamic package cancelled successfully.');
            this.fetchReport();
          } else {
            this.swalService.alert.oops((response && (response.Message || response.message || response.msg))
              || 'Dynamic package cancellation failed.');
          }
        }, (error: any) => {
          this.cancellingReference = null;
          const apiError = error && error.error;
          this.swalService.alert.oops((apiError && (apiError.Message || apiError.message || apiError.msg))
            || 'Dynamic package cancellation failed.');
        });
    });
  }

  canCancel(row: any): boolean {
    return ['BOOKING_CONFIRMED', 'BOOKING_FAILED', 'BOOKING_VOIDED', 'BOOKING_HOLD']
      .includes(row && row.booking_status);
  }

  numberOnly(event: KeyboardEvent) {
    const key = event.key;
    if (key.length === 1 && !/[0-9+\- ]/.test(key)) {
      event.preventDefault();
    }
  }

  private toReportRow(record: any): any {
    const itinerary = Array.isArray(record.itinerary_snapshot) ? record.itinerary_snapshot : [];
    const destinations = itinerary
      .map(day => day && day.destination && day.destination.city_name)
      .filter(Boolean);

    return {
      ref_number: record.dynamic_package_ref || record.dynamicPackageRef || record.ref_number || record.app_reference,
      dynamic_package_ref: record.dynamic_package_ref || record.dynamicPackageRef || record.ref_number || record.app_reference,
      booking_status: record.booking_status,
      title: record.title,
      customer_name: [record.first_name, record.last_name].filter(Boolean).join(' '),
      customer_email: record.customer_email,
      customer_phone: record.customer_phone,
      destinations: this.unique(destinations).join(', '),
      from_date: record.from_date,
      to_date: record.to_date,
      duration_days: record.duration_days,
      hotel_references: this.references(record.hotels),
      activity_references: this.references(record.activities),
      transfer_references: this.references(record.transfers),
      currency: record.currency,
      total_price: record.total_price,
      convenience_fee: record.convenience_fee,
      promo_code: record.promo_code,
      discount_value: record.discount_value,
      total_after_discount: record.total_after_discount,
      payment_status: record.payment_status,
      created_at: record.created_at,
      booking_source: record.booking_source,
      first_name: record.first_name,
      last_name: record.last_name,
      source: record
    };
  }

  private references(services: any[]): string {
    if (!Array.isArray(services)) { return ''; }
    return this.unique(services.map(service => service && service.app_reference).filter(Boolean)).join(', ');
  }

  private unique(values: any[]): any[] {
    return values.filter((value, index) => values.indexOf(value) === index);
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
