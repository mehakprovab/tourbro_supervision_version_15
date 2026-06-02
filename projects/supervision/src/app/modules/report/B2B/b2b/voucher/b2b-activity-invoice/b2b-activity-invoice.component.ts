import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-b2b-activity-invoice',
  templateUrl: './b2b-activity-invoice.component.html',
  styleUrls: ['./b2b-activity-invoice.component.scss']
})
export class B2bActivityInvoiceComponent implements OnInit {

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
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute
    ) { }

  ngOnInit() {
  	this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference =(queryParams['appReference']);  
    });
  	this.getVoucher();
  }

  getVoucher(){
    this.loading =true;
  	this.subSunk.sink = this.apiHandlerService.apiHandler('activityVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading =false;
                    this.voucherData = resp.data[0] || [];
                    console.log("this.voucherData",this.voucherData)
                    // if(this.voucherData)
                    // 	this.findLeaduserDetails(this.voucherData['paxDetails'])
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
  }

downloadA4() {
        this.loading = true;
        const downloadButton = document.getElementById('download');
        if (downloadButton) downloadButton.style.display = "none";
       try{
          const data = document.getElementById('print_voucher');
      const date = new Date().toDateString();
          setTimeout(() => {
            html2canvas(data!, {
                allowTaint: true,
                useCORS: true,
                scale: 2 // Better resolution
            }).then(canvas => {
                const imgWidth = 210; 
                const pageHeight = 290; 
    
                const pdf = new jsPDF('p', 'mm', 'a4');
    
                const imgProps = {
                    width: canvas.width,
                    height: canvas.height
                };
    
                const pageHeightPx = (pageHeight * canvas.width) / imgWidth; // Convert mm to px
                const totalPages = Math.ceil(canvas.height / pageHeightPx);
    
                for (let page = 0; page < totalPages; page++) {
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = Math.min(pageHeightPx, canvas.height - page * pageHeightPx);
    
                    const pageCtx = pageCanvas.getContext('2d')!;
                    pageCtx.fillStyle = '#ffffff';
                    pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    
                    pageCtx.drawImage(
                        canvas,
                        0,
                        page * pageHeightPx,
                        canvas.width,
                        pageHeightPx,
                        0,
                        0,
                        canvas.width,
                        pageHeightPx
                    );
    
                    const imgData = pageCanvas.toDataURL('image/png');
    
                    if (page > 0) {
                        pdf.addPage();
                    }
    
                    pdf.addImage(
                        imgData,
                        'PNG',
                        0,
                        0,
                        imgWidth,
                        (pageCanvas.height * imgWidth) / canvas.width
                    );
                }
                this.loading = false;
                this.swalService.alert.success();
                if (downloadButton) downloadButton.style.display = "inline-block";
                let fileName = this.voucherData['bookingDetails']['app_reference']
                pdf.save(`${fileName}.pdf`);
            });
        }, 1000);
       } catch {
        this.loading = false
       }
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
           this.paxUser = leadUser[0];
        }
    }

    displayMaskContact(str){
    	return str.replace(/\d(?=\d{4})/g, "*");
    }

  ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
