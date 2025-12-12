import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  app_reference = ''
  voucherData: any;
  bookingDetails: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  formattedActivityRemark: any;
  loggerUserAuthId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    this.loggerUserAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
      this.getVoucher();
    });
  }

  getVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('activityVoucher', 'post', {}, {},
      {
        "app_reference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data[0];
          this.processActivityRemark();
          // let bookingData = this.voucherData.bookingDetails.attributes.replace(/\s+/g, ' ').replace(/'/g, '"');
          // let paxDetails = this.voucherData.paxDetails[0].attributes.replace(/\s+/g, ' ').replace(/'/g, '"');
          // this.bookingDetails = {...(paxDetails),...(bookingData)};
          // console.log("bookingDetails",this.bookingDetails)
          console.log(" this.voucherData", this.voucherData)
          this.cdr.detectChanges();
        }
        else {
          this.swalService.alert.error(resp.msg || '');
        }
      });
  }

  processActivityRemark() {
    if ( this.voucherData.ItenaryData.attributes.ActivityRemark && this.voucherData.ItenaryData.attributes.ActivityRemark[0].text) {
      this.formattedActivityRemark = this.voucherData.ItenaryData.attributes.ActivityRemark[0].text.replace(/\/\/\s*/g, '<br>');
    }
  }

  getFormtedStatus(status: string) {
    if (status != null) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
  }

  async downloadA4() {
    this.loading = true;
    const downloadButton = document.getElementById('download');
    if (downloadButton) downloadButton.style.display = "none";
    try {
      
      const base64Image = await this.getImage(this.voucherData.ItenaryData.attributes.ProductImage);

    const imgEl = document.querySelector('.image-download img') as HTMLImageElement;
    if (imgEl) {
      imgEl.src = base64Image;
      await this.waitForImageToLoad(imgEl); // ensure image is rendered
    }
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
              this.cdr.detectChanges();
              pdf.save(`${this.app_reference}.pdf`);
          });
      }, 1000);
    } catch {
      this.loading = false;
      document.getElementById('download').style.display = "inline-block";
    }
  }

  commonBadgeStyle = {
    fontSize: '13px',
    padding: '8px',
    borderRadius: '5px',
  }
  
  getBadgeClass(status: string): string {
    switch (status) {
      case 'BOOKING_FAILED':
        return 'badge badge-danger';
      case 'BOOKING_CONFIRMED':
        return 'badge badge-success';
      case 'BOOKING_CANCELLED':
        return 'badge badge-danger';
      case 'BOOKING_INPROGRESS':
        return 'badge badge-info';
      case 'BOOKING_HOLD':
        return 'badge badge-warning';
      default:
        return '';
    }
  }
  
  getBadgeText(status: string): string {
    switch (status) {
      case 'BOOKING_FAILED':
        return 'Booking Failed';
      case 'BOOKING_CONFIRMED':
        return 'Booking Confirmed';
      case 'BOOKING_CANCELLED':
        return 'Booking Cancelled';
      case 'BOOKING_INPROGRESS':
        return 'Booking Inprogress';
      case 'BOOKING_HOLD':
        return 'Booking Hold';
      default:
        return 'NA';
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

}
