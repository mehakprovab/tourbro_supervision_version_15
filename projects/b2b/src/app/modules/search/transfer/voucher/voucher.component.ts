import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { TransferService } from '../transfer.service';
import { environment } from 'projects/b2b/src/environments/environment.prod';
const baseUrl = environment.SA_URL;

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  app_reference=''
  voucherData: any;
  bookingDetails:any;
  BookingItineraryDetails:any;
  loading:boolean=false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  extrasValue:number=0.00;
  logInUser: any;
maxRoutesCount: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService:ApiHandlerService,
    private swalService:SwalService,
    private cdr:ChangeDetectorRef,
     private transferService: TransferService,
  ) { }

  ngOnInit(): void {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['AppReference']);
      this.getVoucher();
  });
 this.transferService.extrasValues.subscribe(res => {
    this.extrasValue = res
 })
 this.logInUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  getVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('transferVoucher', 'post', {}, {},
      {
        "AppReference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data;
          let bookingData = this.sanitizeJson(this.voucherData.BookingDetails.attributes);
          let paxDetails = this.sanitizeJson(this.voucherData.BookingPaxDetails[0].attributes);
          let BookingItineraryDetails = this.sanitizeJson(this.voucherData.BookingItineraryDetails.attributes);
          
          try {
            this.bookingDetails = { ...JSON.parse(paxDetails), ...JSON.parse(bookingData)};
            this.BookingItineraryDetails = { ...JSON.parse(BookingItineraryDetails) }
            // console.log("this.bookingDetails",this.bookingDetails)
            try {
                  this.bookingDetails.route_name_list = this.bookingDetails.data.route_name || [];
              } catch(err) {
                  this.bookingDetails.route_name_list = [];
              }
              this.maxRoutesCount = Math.max(
              this.bookingDetails.route_name_list.length || 0
              );
            
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
          this.cdr.detectChanges();
        }
        else {
          this.swalService.alert.error(resp.msg || '');
        }
      });
  }

  getFormtedStatus(status: string) {
    if (status != null) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
}

sanitizeJson(jsonString: string): string {
  // Replace single quotes with double quotes
  jsonString = jsonString.replace(/'/g, '"');
  // Remove trailing commas
  jsonString = jsonString.replace(/,\s*}/g, '}');
  jsonString = jsonString.replace(/,\s*]/g, ']');
  return jsonString;
}

getTripType(value) {
  // console.log('Original value:', value);
  let values = value.replace(/'/g, '"'); 
  try {
      let attributes = JSON.parse(values);
      // console.log("attributes",attributes)
      let tripType;
      tripType = attributes.body.IsReturn;
      return tripType === 1 ? 'Round Trip' : 'One Way';
  } catch (error) {
      // console.error('Error parsing JSON:', error, 'Input:', values);
      return null;
  }
}

async downloadA4() {
  this.loading = true;
  window.scrollTo(0, 0);


  try {
     const base64Image = await this.getImage(this.bookingDetails.ProductImage);

    const imgEl = document.querySelector('.image-download img') as HTMLImageElement;
    if (imgEl) {
      imgEl.src = base64Image;
      await this.waitForImageToLoad(imgEl); // ensure image is rendered
    }
const downloadButton = document.getElementById('download');
if (downloadButton) downloadButton.style.display = "none";
const data = document.getElementById('print_voucher');
  const date = new Date().toDateString();

  setTimeout(() => {
      html2canvas(data!, {
          allowTaint: true,
          useCORS: true,
          scale: 2 // Better resolution
      }).then(canvas => {
          const imgWidth = 210; 
          const pageHeight = 280; 

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
          this.cdr.detectChanges();
          pdf.save(`${this.app_reference}.pdf`);
      });
  }, 1000);
} catch {
const downloadButton = document.getElementById('download');
downloadButton.style.display = "inline-block";
this.loading = false;
}

}

getDeparture(value) {
  // console.log('Original value:', value);
  let values = value.replace(/'/g, '"'); 
  try {
      let attributes = JSON.parse(values);
      return  attributes.body.From.name;
  } catch (error) {
      console.error('Error parsing JSON:', error, 'Input:', values);
      return null;
  }
}

  getDestination(value) {
      // console.log('Original value:', value);
      let values = value.replace(/'/g, '"'); 
      try {
          let attributes = JSON.parse(values);
          // console.log("attributes",attributes)
          return attributes.body.To.name;
      } catch (error) {
          console.error('Error parsing JSON:', error, 'Input:', values);
          return null;
      }
  }

getImage(imagePath: string): Promise<string> {
  const obj = {
    app_reference: this.app_reference,
    image_url: imagePath
  };

  return new Promise((resolve, reject) => {
    this.apiHandlerService.apiHandler('imageDownload', 'post', {}, {}, obj).subscribe({
      next: (data: any) => {
        const mimeType = data.mimeType || 'image/jpeg'; // fallback
        const base64Image = `data:${mimeType};base64,${data.base64}`;
        resolve(base64Image);
      },
      error: (err) => reject(err)
    });
  });
}

  waitForImageToLoad(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (img.complete) {
      resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Even on error, resolve so the process continues
    }
  });
}

          getImageImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }
}
