import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-tour-voucher',
  templateUrl: './tour-voucher.component.html',
  styleUrls: ['./tour-voucher.component.scss']
})
export class TourVoucherComponent implements OnInit {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  bannerImageUrl = `${baseUrl}/sa/tour/tours/getBannerImage/`;
  app_reference = ''
  voucherData: any;
  bookingDetails: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  terms: any;
  maxLength = 300;
  showMore: boolean = false;
  logInUser: any;
  priceBreakDownData: any;
  showMandatoty: boolean = false;
  commonBadgeStyle = {
    fontSize: '13px',
    padding: '8px',
    borderRadius: '5px',
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['AppReference']);
      this.logInUser = JSON.parse(sessionStorage.getItem("currentUser"));
      console.log("this.loggedInUser image", this.logInUser["domain_logo"]);
      this.getVoucher();
    });
    // const priceBreakDownData = sessionStorage.getItem('tourPriceBreakDown');
    // this.priceBreakDownData = JSON.parse(priceBreakDownData);
  }

  getVoucher() {
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('tourVoucher', 'post', {}, {},
      {
        "AppReference": this.app_reference,
      })
      .subscribe(resp => {
        this.loading = false;
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data;
          this.priceBreakDownData = resp.data.BookingDeatils[0].tour_details ? resp.data.BookingDeatils[0].tour_details.accommodations : '';
          this.terms = this.sanitizer.bypassSecurityTrustHtml(this.voucherData.BookingDeatils[0].terms);
          // let bookingData = this.voucherData.BookingDetails.attributes.replace(/'/g, '"');
          // this.bookingDetails = JSON.parse(bookingData);
          this.cdr.detectChanges();
        }
        else {
          this.loading = false;
          this.voucherData = [];
          this.swalService.alert.error(resp.msg || '');
        }
      }, (err) => {
        this.loading = false;
        this.voucherData  = [];
        this.swalService.alert.error('Something went wrong please try again.!');
      });
  }

  getFormtedStatus(status: string) {
    if (status != null) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
  }

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
            pdf.save(`Agent Tour Voucher - ${this.app_reference}.pdf`);
        }).catch(err => {
            this.loading = false;
            console.error('PDF Error:', err);
            this.swalService.alert.error('Error generating PDF');
        });
    }, 1000);
}

  isTextTruncated(text: string): boolean {
    return text && text.length > this.maxLength;
  }

  getShortText(text: string, showFull: boolean): string {
    if (!text) return '';
    return showFull || text.length <= this.maxLength
      ? text
      : text.substring(0, this.maxLength) + '...';
  }

  toggleTerms() {
    this.showMore = !this.showMore;
  }

  getPriceDown(data){
    let priceData;
    if(data.type === 'Adult') {
      priceData = `${data.travellercount} Adult x ${data.value}`
    } else if(data.type === 'Child') {
      priceData = `${data.travellercount} Child x ${data.value}`
    } else {
      priceData = `${data.travellercount} Traveler x ${data.value}`
    }
    return priceData;
  }

    getMandatoryLocal(data) {
      if (data) {
          data.forEach((res) => {
    if (res.payment_type === 'local') {
      this.showMandatoty = true;
    }
  })
   return this.showMandatoty;
      }

 }

 getMandatoryPrice(data) {
  if (data) {
      return data.reduce((sum, item) => {
    return sum + item.prices.reduce((priceSum, price) => priceSum + price.value, 0);
  }, 0);
  }

}
  getOptionalTours(data) {
    if(data) {
      return JSON.parse(data);
    }
  }

  getTerms(data) {
    if (data) {
      return data.changingThisBreaksApplicationSecurity.replace(/\\n/g, '\n');
    }
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
      case 'PROCESSING':
        return 'badge badge-info';
      case 'BOOKING_HOLD':
        return 'badge badge-warning';
      default:
        return '';
    }
  }
}

