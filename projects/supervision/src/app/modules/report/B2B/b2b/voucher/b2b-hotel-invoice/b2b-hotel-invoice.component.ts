import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-b2b-hotel-invoice',
  templateUrl: './b2b-hotel-invoice.component.html',
  styleUrls: ['./b2b-hotel-invoice.component.scss']
})
export class B2bHotelInvoiceComponent implements OnInit {


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
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute
    ) { }

  ngOnInit() {
  	this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference =(queryParams['appReference']);  
    });
  	this.getB2cHotelVoucher();
  }

  getB2cHotelVoucher(){
  	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHotelVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.voucherData = resp.data[0] || [];
                    if (this.voucherData.BookingPaxDetails.length) {
                        // Sort so that LeadPax comes first
                        this.voucherData.BookingPaxDetails.sort((a, b) => {
                          return (b.LeadPax === true ? 1 : 0) - (a.LeadPax === true ? 1 : 0);
                        });
                      
                        // Reset counters before looping
                        this.noOfAdults = 0;
                        this.noOfChilds = 0;
                      
                        // Count PaxTypes
                        this.voucherData.BookingPaxDetails.forEach((element, i) => {
                          if (element['PaxType'] === 'Child') {
                            this.noOfChilds++;
                          } else if (element['PaxType'] === 'Adult') {
                            this.noOfAdults++;
                          }
                        });
                      }    
                    if(this.voucherData)
                    	this.findLeaduserDetails(this.voucherData['BookingPaxDetails'])
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
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


        async downloadA4() {
        const downloadButton = document.getElementById('download');
        if (downloadButton) downloadButton.style.display = "none";
       try{
         this.loading = true;
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
                this.swalService.alert.success();
                if (downloadButton) downloadButton.style.display = "inline-block";
                pdf.save(`${this.voucherData['BookingDetails']['AppReference']}.pdf`);
            });
            this.loading = false;
            
        }, 1000);
       } catch {
        this.loading = false;
       }
      }


    // downloadA4(type: SupportedExtensions, orientation?: string): void {
    //     let fileName = this.voucherData['BookingDetails']['AppReference']
    //        window['html2canvas'] = html2canvas;
    //        const date = new Date().toDateString();
    //        const doc = new jsPDF({
    //            orientation: 'p',
    //            unit: 'pt',
    //            format: 'a4',
    //        });
   
    //     const content = this.print_voucher.nativeElement;
        
    //     doc.html(content, {
    //         html2canvas: {
    //             allowTaint: true,
    //             useCORS: true,
    //             scale: 600 / content.scrollWidth
    //         },
            
    //         callback: async (doc) => {
    //             doc.save(`${fileName}.pdf`);
    //             this.swalService.alert.success();
                
    //         }
    //     });
    
    // }
   
   
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
