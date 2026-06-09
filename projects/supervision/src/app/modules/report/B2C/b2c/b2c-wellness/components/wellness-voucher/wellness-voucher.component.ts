import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-wellness-voucher',
  templateUrl: './wellness-voucher.component.html',
  styleUrls: ['./wellness-voucher.component.scss']
})
export class WellnessVoucherComponent implements OnInit, OnDestroy {
  @ViewChild('print_voucher', { static: false }) printVoucherRef: ElementRef;
  private subSunk = new SubSink();
  appReference = '';
  voucherData: any;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
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
    this.subSunk.sink = this.apiHandlerService.apiHandler('wellnessVoucher', 'post', {}, {}, {
      app_reference: this.appReference,
    }).subscribe(resp => {
      this.loading = false;
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.voucherData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      } else {
        this.swalService.alert.error(resp.msg || '');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load voucher');
    });
  }

  get booking() {
    return this.voucherData && this.voucherData.BookingDetails ? this.voucherData.BookingDetails : {};
  }

  get center() {
    return this.booking.CancellationReason && this.booking.CancellationReason.centerBody ? this.booking.CancellationReason.centerBody : {};
  }

  get packageDetails() {
    const packages = this.center.PackageDetails;
    return Array.isArray(packages) && packages.length ? packages[0] : {};
  }

  get leadPassenger() {
    const packages = this.booking.CancellationReason && this.booking.CancellationReason.body && Array.isArray(this.booking.CancellationReason.body.PackageDetails)
      ? this.booking.CancellationReason.body.PackageDetails
      : [];
    const passengers = packages.reduce((list, item) => list.concat(Array.isArray(item.PassengerDetails) ? item.PassengerDetails : []), []);
    return passengers.find(item => item.LeadPassenger === true || item.LeadPax === true) || passengers[0] || {};
  }

  calculateDiff(fromDate, toDate) {
    return this.utility.calculateDiff(fromDate, toDate);
  }

  printVoucher() {
    window.print();
  }

  downloadPdf() {
    const element = document.getElementById('wellness-voucher');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Wellness Voucher - ${this.appReference}.pdf`);
      this.swalService.alert.success();
    });
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
