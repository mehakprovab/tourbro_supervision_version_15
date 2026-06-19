import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-bus-voucher',
  templateUrl: './bus-voucher.component.html',
  styleUrls: ['./bus-voucher.component.scss']
})
export class BusVoucherComponent implements OnInit, OnDestroy {
  @ViewChild('print_voucher', { static: false }) printVoucherRef: ElementRef;
  private subSunk = new SubSink();
  appReference = '';
  bookingSource = '';
  voucherData: any;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(params => {
      this.appReference = params.appReference || '';
      this.bookingSource = params.booking_source || '';
      this.getVoucher();
    });
  }

  getVoucher() {
    if (!this.appReference) {
      return;
    }

    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('busReport', 'POST', '', '', {
      status: 'ALL',
      app_reference: this.appReference,
      booked_from_date: '',
      booked_to_date: '',
      email: '',
      pnr: '',
      corporate_id: ''
    }).subscribe(resp => {
      this.loading = false;
      if (resp && ([200, 201].includes(resp.statusCode)) && resp.data) {
        this.voucherData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      } else {
        this.swalService.alert.error(resp && resp.Message ? resp.Message : 'Unable to load bus voucher');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load bus voucher');
    });
  }

  get itinerary() {
    return this.voucherData && this.voucherData.itinerary && this.voucherData.itinerary.length
      ? this.voucherData.itinerary[0]
      : {};
  }

get passengers() {
  return Array.isArray(this.voucherData?.pax)
    ? this.voucherData.pax
    : [];
}
  printVoucher() {
    window.print();
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

}
