import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportService } from '../../../../report.service';

@Component({
  selector: 'app-b2b-flight-invoice',
  templateUrl: './b2b-flight-invoice.component.html',
  styleUrls: ['./b2b-flight-invoice.component.scss']
})
export class B2bFlightInvoiceComponent implements OnInit {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  isOpen = false as boolean;
  invoiceData: any;
  invoiceNo:any;
  config: any = {
    type: 'pdf',
    elementIdOrContent: 'print_voucher',
    options: {
        jsPDF: {
            orientation: 'portrait'
        },
        pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }

};
  app_reference: "";

  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private reportService:ReportService
  ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
    });
    this.getB2cHotelVoucher();
  }


  downloadA4(type: any, orientation?: string): void {
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
             doc.save(`${fileName}.pdf`);
             this.swalService.alert.success();
             
         }
     });
 
 }


  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
        pdf.setPage(i);
        pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
  }

  getB2cHotelVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cFlightVoucher', 'post', {}, {},
      {
        "app_reference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            if(resp.data[0]){
                this.reportService.setFareBreakup(resp.data[0]);
            }
          this.invoiceData = resp.data[0] || [];
        }
        if(this.invoiceData && this.invoiceData.AppReference){
            this.invoiceNo="INV-"+(this.invoiceData.AppReference.split("-")[1]);
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

  displayMaskContact(str) {
    return str.replace(/\d(?=\d{4})/g, "*");
  }
  
  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
