import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';


const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-b2c-tour-voucher',
  templateUrl: './b2c-tour-voucher.component.html',
  styleUrls: ['./b2c-tour-voucher.component.scss']
})
export class B2cTourVoucherComponent implements OnInit {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  bannerImageUrl = `${baseUrl}/tour/tours/getBannerImage/`;
  app_reference = ''
  voucherData: any;
  bookingDetails: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  loggerInUser: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    this.loggerInUser = JSON.parse(currentDomainUser);
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['AppReference']);
      this.getVoucher();
    });
  }
getTermsList(): string[] {
  let terms = this.voucherData.BookingDetails.terms;

  if (!terms) return [];

  // Remove HTML tags
  terms = terms.replace(/<\/?[^>]+(>|$)/g, '');

  // Split by //
  return terms
    .split(/\s*\/\/\s*/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}
  getVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('tourVoucher', 'post', {}, {},
      {
        "AppReference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data;
          this.bookingDetails = this.voucherData;
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

  // downloadA4(type: SupportedExtensions, orientation?: string): void {
  //   this.loading = true;
  //   document.getElementById('download').style.display = "none";
  //   window['html2canvas'] = html2canvas;
  //   const date = new Date().toDateString();
  //   const doc = new jsPDF({
  //     orientation: 'p',
  //     unit: 'pt',
  //     format: 'a4',
  //   });
  //   const content = this.print_voucher.nativeElement;
  //   doc.html(content, {
  //     html2canvas: {
  //       allowTaint: true,
  //       useCORS: true,
  //       scale: 600 / content.scrollWidth
  //     },
  //     callback: async (doc) => {
  //       doc.save(`${this.app_reference}.pdf`);
  //       this.loading = false;
  //       this.swalService.alert.success();
  //       document.getElementById('download').style.display = "inline-block";
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

  downloadA4(type: SupportedExtensions, orientation?: string): void {
    this.loading = true;
    window.scrollTo(0, 0);
    const data = document.getElementById('print_voucher');

    setTimeout(() => {
        html2canvas(data!, {
            allowTaint: true,
            useCORS: true,
            scale: 2,
            logging: false
        }).then(canvas => {
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm (standard)
            const marginLeft = 10;
            const marginTop = 10;
            const marginRight = 10;
            const marginBottom = 10;
            const contentWidth = imgWidth - marginLeft - marginRight;
            const contentHeight = pageHeight - marginTop - marginBottom;

            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calculate scale: how many mm per pixel
            const mmPerPx = contentWidth / canvas.width;
            const pageHeightPx = contentHeight / mmPerPx;

            const totalPages = Math.ceil(canvas.height / pageHeightPx);
            const pdfPageHeight = pageHeight; // Full page height

            for (let page = 0; page < totalPages; page++) {
                if (page > 0) {
                    pdf.addPage();
                }

                // Calculate which part of canvas goes on this page
                const startY = page * pageHeightPx;
                const endY = Math.min((page + 1) * pageHeightPx, canvas.height);
                const pageHeight_px = endY - startY;

                // Create temporary canvas for this page
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = pageHeight_px;

                const tempCtx = tempCanvas.getContext('2d')!;
                tempCtx.fillStyle = '#ffffff';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

                // Copy only this page's content
                tempCtx.drawImage(
                    canvas,
                    0, startY,
                    canvas.width, pageHeight_px,
                    0, 0,
                    canvas.width, pageHeight_px
                );

                const imgData = tempCanvas.toDataURL('image/png');

                // Calculate actual height on PDF
                const pdfImageHeight = (pageHeight_px * contentWidth) / canvas.width;

                // Add image centered with margins
                pdf.addImage(
                    imgData,
                    'PNG',
                    marginLeft,
                    marginTop,
                    contentWidth,
                    pdfImageHeight
                );
            }

            this.loading = false;
            this.swalService.alert.success();
            pdf.save(`Tour Voucher - ${this.app_reference}.pdf`);
        }).catch(err => {
            this.loading = false;
            console.error('PDF Error:', err);
            this.swalService.alert.error('Error generating PDF');
        });
    }, 1000);
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
      case 'CANCELLED':
        return 'badge badge-danger';
      case 'PROCESSING':
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
      case 'CANCELLED':
        return 'Booking Cancelled';
      case 'PROCESSING':
        return 'Booking Inprogress';
      case 'BOOKING_HOLD':
        return 'Booking Hold';
      default:
        return 'NA';
    }
  }

 getOptionalTours(data) {
  if (!data) return [];

  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error('OptionalTours parse error:', e);
    return [];
  }
}

getItenary(data) {
  if (!data) return [];

  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error('Itinerary parse error:', e);
    return [];
  }
}
}

