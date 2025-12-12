import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ReportService } from '../../../../../report.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-b2c-flight-invoice',
  templateUrl: './b2c-flight-invoice.component.html',
  styleUrls: ['./b2c-flight-invoice.component.scss']
})
export class B2cFlightInvoiceComponent implements OnInit,OnDestroy {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
	private subSunk = new SubSink();
    isOpen = false as boolean;
    invoiceData : any;
    app_reference : "";

  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute,
        private reportService:ReportService
    ) { }

  ngOnInit() {
  	this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference =(queryParams['appReference']);  
    });
  	this.getB2cHotelVoucher();
  }

  getB2cHotelVoucher(){
  	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.invoiceData = resp.data[0] || [];
                    if(resp.data[0]){
                        this.reportService.setFareBreakup(resp.data[0]);
                    }
                    if(this.invoiceData && this.invoiceData.AppReference){
                        this.invoiceData.InvoiceNumber="INV-"+(this.invoiceData.AppReference.split("-")[1]);
                       }
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
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
           return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

    displayMaskContact(str){
    	return str.replace(/\d(?=\d{4})/g, "*");
    }

  ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
