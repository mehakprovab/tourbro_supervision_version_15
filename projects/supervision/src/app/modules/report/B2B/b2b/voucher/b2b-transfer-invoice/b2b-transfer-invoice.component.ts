import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink/dist/subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-b2b-transfer-invoice',
  templateUrl: './b2b-transfer-invoice.component.html',
  styleUrls: ['./b2b-transfer-invoice.component.scss']
})
export class B2bTransferInvoiceComponent implements OnInit {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  app_reference = ''
  voucherData: any;
  bookingDetails: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  serviceTax: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef
  ) {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
      this.getVoucher();
    });
   }

   getVoucher() {
    this.loading=true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('transferVoucher', 'post', {}, {},
      {
        "AppReference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data;
          this.loading=false;
          let bookingData = this.voucherData.BookingDetails.attributes.replace(/'/g, '"');
          let paxDetails = this.voucherData.BookingPaxDetails[0].attributes.replace(/'/g, '"');
          this.bookingDetails = { ...JSON.parse(paxDetails), ...JSON.parse(bookingData) };
          this.cdr.detectChanges();
        }
        else {
          this.loading=false;
          this.swalService.alert.error(resp.msg || '');
        }
      }, err => {
        this.loading=false;
      });
  }

  downloadA4(type: any, orientation: string = 'portrait'): void {
    let fileName = this.voucherData['BookingDetails']['app_reference'];
    const content = this.print_voucher.nativeElement;

    // Ensure html2canvas is available
    window['html2canvas'] = html2canvas;
    
    const doc = new jsPDF({
        orientation: orientation === 'landscape' ? 'l' : 'p',
        unit: 'pt',
        format: 'a4',
    });

    // Use html2canvas separately to capture full content
    html2canvas(content, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 595.28; // A4 width in pt
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`${fileName}.pdf`);

        this.swalService.alert.success();
    }).catch(error => {
        console.error("PDF Generation Error:", error);
        this.swalService.alert.error("Failed to download PDF.");
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


  ngOnInit() {
  }


}