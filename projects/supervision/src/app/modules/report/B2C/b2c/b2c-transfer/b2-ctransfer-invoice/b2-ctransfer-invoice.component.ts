import { canViewAdminReportFields } from '../../../../utils/report-column-visibility';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const log = new Logger('report/HotelVoucherComponent');

@Component({
  selector: 'app-b2-ctransfer-invoice',
  templateUrl: './b2-ctransfer-invoice.component.html',
  styleUrls: ['./b2-ctransfer-invoice.component.scss']
})
export class B2CTransferInvoiceComponent implements OnInit {
  readonly showAdminReportFields = canViewAdminReportFields();

  attributes: any = {};

  get invoiceTotal(): number | null {
    const value = this.showAdminReportFields
      ? (this.voucherData?.BookingDetails?.grand_total ?? 0)
      : this.attributes?.data?.Price?.TotalDisplayFare;
    return value == null ? null : Number(value);
  }

  get invoiceCurrency(): string {
    return (!this.showAdminReportFields && this.attributes?.data?.Price?.Currency)
      || this.voucherData?.BookingDetails?.currency || 'INR';
  }

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
	private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData : any;
    app_reference : "";
    paxUser : any = {
    	Address: "",
		Address2: "",
		Email: "",
		FirstName: "",
		LastName: "",
		LeadPax: "",
		PhoneNumber: "",
		PostalCode: "",
		Title: ""
    };
      noOfAdults: number = 0;
    noOfChilds: number = 0;

  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute
    ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = queryParams['appReference'];
      this.getB2cCabVoucher();
    });
  }

  getB2cCabVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('WebTransferVoucher', 'post', {}, {}, {
      AppReference: this.app_reference
    }).subscribe({
      next: resp => {
        if (resp.statusCode !== 200 && resp.statusCode !== 201) {
          this.swalService.alert.error(resp.msg || 'Unable to fetch invoice');
          return;
        }
        this.voucherData = resp.data || {};
        const attributes = this.voucherData.BookingDetails?.attributes;
        try {
          this.attributes = typeof attributes === 'string' ? JSON.parse(attributes) : (attributes || {});
        } catch {
          this.attributes = {};
        }
        const passengers = this.voucherData.BookingPaxDetails || [];
        this.paxUser = passengers.find(passenger => passenger.LeadPax === true) || passengers[0] || {};
        this.noOfAdults = passengers.filter(passenger => passenger.PaxType === 'Adult').length;
        this.noOfChilds = passengers.filter(passenger => passenger.PaxType === 'Child').length;
      },
      error: () => this.swalService.alert.error('Unable to fetch invoice')
    });
  }

  calculateDiff(fromDate,toDate){
        return this.utility.calculateDiff(fromDate,toDate);
    }

    getTime(t){
    	return t.split(" ")[1];
    }

    cancelBooking(){

    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => {
            return x.LeadPax == true
        });
           this.paxUser = leadUser[0];
        }
    }

    displayMaskContact(str){
    	return str.replace(/\d(?=\d{4})/g, "*");
    }

    downloadA4(type: any, orientation?: string): void {
      const fileName = this.voucherData?.BookingDetails?.app_reference || this.app_reference
         window['html2canvas'] = html2canvas;
         const date = new Date().toDateString();
         const doc = new jsPDF({
             orientation: 'p',
             unit: 'pt',
             format: 'a4',
         });
 
      const content = this.print_voucher.nativeElement;
      const exportContent = this.utility.prepareExportElement(content);
      
      doc.html(exportContent, {
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

  ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
