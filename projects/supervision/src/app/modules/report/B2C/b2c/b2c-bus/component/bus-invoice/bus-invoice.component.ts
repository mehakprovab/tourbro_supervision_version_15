import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bus-invoice',
  templateUrl: './bus-invoice.component.html',
  styleUrls: ['./bus-invoice.component.scss']
})
export class BusInvoiceComponent implements OnInit, OnDestroy {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;

  private subSunk = new SubSink();
  appReference = '';
  bookingData: any;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
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

  downloadA4(type: any, orientation?: string): void {
    if (!this.print_voucher || !this.print_voucher.nativeElement) {
      return;
    }

    const fileName = `Bus Invoice - ${this.appReference || 'booking'}`;

    window['html2canvas'] = html2canvas;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    const content = this.print_voucher.nativeElement;
    const exportContent = this.utility.prepareExportElement(content);

    // actual rendered width of your invoice markup, in px
    const sourceWidth = exportContent.scrollWidth || content.scrollWidth;

    const pageWidth = doc.internal.pageSize.getWidth();   // ~595pt for A4 portrait
    const margin = 20;
    const targetWidth = pageWidth - margin * 2;

    doc.html(exportContent, {
      x: margin,
      y: margin,
      width: targetWidth,        // width the content is scaled INTO on the PDF page
      windowWidth: sourceWidth,  // width the content is laid out AT before scaling — the key fix
      html2canvas: {
        allowTaint: true,
        useCORS: true,
        scale: targetWidth / sourceWidth,
      },
      callback: async (doc) => {
        doc.save(`${fileName}.pdf`);
        this.swalService.alert.success();
      }
    });
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

}