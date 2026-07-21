import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dynamic-package-voucher',
  templateUrl: './dynamic-package-voucher.component.html',
  styleUrls: ['./dynamic-package-voucher.component.scss']
})
export class DynamicPackageVoucherComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  reference = '';
  voucher: any;
  loading = true;

  constructor(private route: ActivatedRoute, private router: Router,
    private api: ApiHandlerService, private swal: SwalService, private utility: UtilityService) {}

  ngOnInit() {
    this.subSunk.sink = this.route.queryParams.subscribe(params => {
      this.reference = params.dynamic_package_ref || '';
      if (this.reference) {
        this.loadVoucher();
      } else {
        this.loading = false;
        this.swal.alert.oops('Dynamic package reference is missing.');
        this.back();
      }
    });
  }

  loadVoucher() {
    this.loading = true;
    this.subSunk.sink = this.api.apiHandler('dynamicPackageVoucher', 'post', {}, {}, {
      dynamic_package_ref: this.reference
    }).subscribe((response: any) => {
      this.loading = false;
      if (response.statusCode !== undefined && response.statusCode !== 200 && response.statusCode !== 201) {
        this.swal.alert.oops(response.Message || 'Unable to load voucher.'); return;
      }
      let data = response.data;
      while (data && !Array.isArray(data) && data.data) { data = data.data; }
      this.voucher = Array.isArray(data) ? data[0] : data;
    }, (error: any) => {
      this.loading = false;
      this.swal.alert.oops(error.error && error.error.Message || 'Unable to load voucher.');
    });
  }

  value(...keys: string[]): any {
    const containers = [this.voucher, this.voucher && this.voucher.BookingDetails,
      this.voucher && this.voucher.bookingDetails];
    for (const item of containers) {
      for (const key of keys) {
        if (item && item[key] !== undefined && item[key] !== null && item[key] !== '') { return item[key]; }
      }
    }
    return 'N/A';
  }

  items(...keys: string[]): any[] {
    for (const key of keys) { if (this.voucher && Array.isArray(this.voucher[key])) { return this.voucher[key]; } }
    return [];
  }

  get leadGuest(): any { return this.voucher && this.voucher.lead_guest || {}; }
  get days(): any[] { return this.voucher && Array.isArray(this.voucher.days) ? this.voucher.days : []; }
  get pax(): any[] { return this.voucher && Array.isArray(this.voucher.pax) ? this.voucher.pax : []; }
  get destinationNames(): string {
    return this.days.map(day => day && day.destination && day.destination.city_name).filter(Boolean)
      .filter((city, index, cities) => cities.indexOf(city) === index).join(', ') || 'N/A';
  }

  ref(item: any): string { return item && (item.app_reference || item.AppReference || item.ref_number) || 'N/A'; }
  download() { this.utility.downloadElementAsPdf('dynamic-voucher', `Dynamic_Voucher_${this.reference}`, 'portrait'); }
  back() { this.router.navigate(['/report/b2c-dynamic-package-report']); }
  ngOnDestroy() { this.subSunk.unsubscribe(); }
}
