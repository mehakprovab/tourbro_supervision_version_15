import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-wellness-invoice',
  templateUrl: './wellness-invoice.component.html',
  styleUrls: ['./wellness-invoice.component.scss']
})
export class WellnessInvoiceComponent implements OnInit, OnDestroy {
  @ViewChild('print_invoice', { static: false }) printInvoiceRef: ElementRef;
  private subSunk = new SubSink();
  appReference = '';
  invoiceData: any;
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
      this.getInvoice();
    });
  }

  getInvoice() {
    if (!this.appReference) {
      return;
    }

    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('wellnessVoucher', 'post', {}, {}, {
      app_reference: this.appReference,
    }).subscribe(resp => {
      this.loading = false;
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.invoiceData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      } else {
        this.swalService.alert.error(resp.msg || '');
      }
    }, err => {
      this.loading = false;
      this.swalService.alert.error(err.error && err.error.Message ? err.error.Message : 'Unable to load invoice');
    });
  }

  get booking() {
    return this.invoiceData && this.invoiceData.BookingDetails ? this.invoiceData.BookingDetails : {};
  }

  get center() {
    return this.booking.CancellationReason && this.booking.CancellationReason.centerBody ? this.booking.CancellationReason.centerBody : {};
  }

  get packageDetails() {
    const packages = this.center.PackageDetails;
    return Array.isArray(packages) && packages.length ? packages[0] : {};
  }

  get invoiceNumber() {
    return this.booking.InvoiceNumber || `INV-${(this.booking.AppReference || '').split('-')[1] || this.booking.AppReference || ''}`;
  }

  printInvoice() {
    const element = this.printInvoiceRef && this.printInvoiceRef.nativeElement;
    this.utility.printElement(element, `Wellness Invoice - ${this.appReference}`);
  }

  downloadA4(type: any, orientation?: string): void {
    const content = this.printInvoiceRef && this.printInvoiceRef.nativeElement;
    if (!content) {
      return;
    }

    const fileName = `Wellness Invoice - ${this.appReference || 'booking'}`;

    window['html2canvas'] = html2canvas;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

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