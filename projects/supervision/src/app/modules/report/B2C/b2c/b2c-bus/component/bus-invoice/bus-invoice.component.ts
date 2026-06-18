import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-bus-invoice',
  templateUrl: './bus-invoice.component.html',
  styleUrls: ['./bus-invoice.component.scss']
})
export class BusInvoiceComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  appReference = '';
  bookingData: any;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(params => {
      this.appReference = params.appReference || '';
      this.getBookingDetails();
    });
  }

  getBookingDetails() {
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
        this.bookingData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      } else {
        this.swalService.alert.error(resp && resp.Message ? resp.Message : 'Unable to load booking details');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load booking details');
    });
  }

  get itinerary() {
    return this.bookingData && this.bookingData.itinerary && this.bookingData.itinerary.length
      ? this.bookingData.itinerary[0]
      : {};
  }

  get passengers() {
    return this.bookingData && Array.isArray(this.bookingData.passengers)
      ? this.bookingData.passengers
      : (this.bookingData && Array.isArray(this.bookingData.pax_details) ? this.bookingData.pax_details : []);
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

}
