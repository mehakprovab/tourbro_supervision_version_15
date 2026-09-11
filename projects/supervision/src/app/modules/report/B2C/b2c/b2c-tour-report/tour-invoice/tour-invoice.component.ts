import { getTourDocumentFilename } from '../../../../utils/tour-document-filename';
import { splitInvoicePricingRows } from '../../../../utils/invoice-convenience-fee';
import { canViewAdminReportFields } from '../../../../utils/report-column-visibility';
import { getTourDocumentPricing } from '../../../../utils/tour-document-pricing';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ReportService } from '../../../../report.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-tour-invoice',
  templateUrl: './tour-invoice.component.html',
  styleUrls: ['./tour-invoice.component.scss']
})
export class TourInvoiceComponent implements OnInit {
  readonly showAdminReportFields = canViewAdminReportFields();

  get pricing() {
    const pricing = getTourDocumentPricing(this.invoiceData, this.showAdminReportFields);
        return { ...pricing, rows: splitInvoicePricingRows(pricing.rows) };
  }


  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  isOpen = false as boolean;
  invoiceData: any;
  app_reference = '';
  downloading = false;
  bookingDetails: any;

  config: any = {
      type: 'pdf',
      elementIdOrContent: 'print_voucher',
      options: {
          jsPDF: {
              orientation: 'potrait'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
      }

  };
  public loggedInUser: any;
  constructor(
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private utility: UtilityService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private reportService: ReportService
  ) { }

  ngOnInit() {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.loggedInUser = JSON.parse(currentDomainUser);
      this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
          this.app_reference = (queryParams['AppReference']);
      });
      this.getB2cActivityVoucher();
  }

  getB2cActivityVoucher() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('tourVoucher', 'post', {}, {},
          {
              "AppReference": this.app_reference,
          })
          .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.invoiceData = resp.data || [];
                //   let bookingData = this.invoiceData.BookingDetails.attributes.replace(/'/g, '"');
                //   let paxDetails = this.invoiceData.BookingPaxDetails[0].attributes.replace(/'/g, '"');
                  this.bookingDetails = resp.data;
                  if (resp.data[0]) {
                      this.reportService.setFareBreakup(resp.data[0]);
                  }
                  if (this.invoiceData && this.invoiceData.BookingDetails && this.invoiceData.BookingDetails.app_reference) {
                      this.invoiceData.InvoiceNumber = "INV-" + (this.invoiceData.BookingDetails.app_reference.split("-")[1]);
                  }
              }
              else {
                  this.swalService.alert.error(resp.msg || '');
              }
          });
  }

  calculateDiff(fromDate, toDate) {
      return this.utility.calculateDiff(fromDate, toDate);
  }

  getTime(t) {
      return t.split(" ")[1];
  }

  cancelBooking() {

  }

  findLeaduserDetails(data) {
      if (data) {
          let leadUser = data.filter(x => {
              return x.LeadPax == true
          });
          return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
      }
  }

  async downloadA4(type: any, orientation?: string): Promise<void> {
    if (this.downloading) {
      return;
    }
    const content = this.print_voucher && this.print_voucher.nativeElement;
    if (!content || !this.invoiceData) {
      this.swalService.alert.error('Please wait for the invoice to load.');
      return;
    }

    this.downloading = true;
    try {
      window['html2canvas'] = html2canvas;
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const exportContent = this.utility.prepareExportElement(content);
      const sourceWidth = content.scrollWidth || content.getBoundingClientRect().width;
      if (!sourceWidth) {
        throw new Error('Invoice has no renderable content');
      }
      const margin = 20;
      const targetWidth = doc.internal.pageSize.getWidth() - margin * 2;
      await doc.html(exportContent, {
        x: margin,
        y: margin,
        margin: [margin, margin, margin, margin],
        autoPaging: 'text',
        width: targetWidth,
        windowWidth: sourceWidth,
        html2canvas: {
          allowTaint: false,
          useCORS: true,
          logging: false,
          scale: targetWidth / sourceWidth
        }
      });
      this.pdfCallbackFn(doc);
      await doc.save(getTourDocumentFilename('Invoice', this.invoiceData, this.app_reference), { returnPromise: true });
      this.swalService.alert.success();
    } catch {
      this.swalService.alert.error('Unable to download the invoice. Please try again.');
    } finally {
      this.downloading = false;
    }
  }

  pdfCallbackFn(pdf: any) {
      // example to add page number as footer to every page of pdf
      const noOfPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= noOfPages; i++) {
          pdf.setPage(i);
          pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
      }


  }

  displayMaskContact(str) {
      return str.replace(/\d(?=\d{4})/g, "*");
  }

  ngOnDestroy(): void {
      this.subSunk.unsubscribe();
  }

  getCurrency(data) {
    if (this.loggedInUser.auth_role_id === 7) {
        return data.api_currency;
    } else {
        return data.currency_code;
    }
  }

}
