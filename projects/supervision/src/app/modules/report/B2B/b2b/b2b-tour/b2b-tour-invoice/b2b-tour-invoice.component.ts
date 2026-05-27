import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ReportService } from '../../../../report.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-b2b-tour-invoice',
  templateUrl: './b2b-tour-invoice.component.html',
  styleUrls: ['./b2b-tour-invoice.component.scss']
})
export class B2bTourInvoiceComponent implements OnInit {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  isOpen = false as boolean;
  invoiceData: any;
  app_reference: "";
  bookingDetails: any;

  config: ExportAsConfig = {
      type: 'pdf',
      elementId: 'print_voucher',
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
      private exportAsService: ExportAsService,
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
      this.subSunk.sink = this.apiHandlerService.apiHandler('b2bTourVoucher', 'post', {}, {},
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
                  if (this.invoiceData && this.invoiceData.BookingDeatils[0].AppReference) {
                      this.invoiceData.BookingDeatils[0].InvoiceNumber = "INV-" + (this.invoiceData.BookingDeatils[0].AppReference.split("-")[1]);
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

  downloadA4(type: SupportedExtensions, orientation?: string): void {
      let fileName = this.invoiceData['AppReference']
      window['html2canvas'] = html2canvas;
      const date = new Date().toDateString();
      const doc = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
      });
      const content = this.print_voucher.nativeElement;
      doc.html(content, {
          html2canvas: {
              allowTaint: true,
              useCORS: true,
              scale: 600 / content.scrollWidth
          },
          callback: async (doc) => {
              doc.save(`Agent Tour Invoice ${this.app_reference}.pdf`);
              this.swalService.alert.success();
          }
      });
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
        return data.ApiCurrency;
    } else {
        return data.CurrencyCode;
    }
  }

  browserBack() {
    window.history.back();
  }
}
