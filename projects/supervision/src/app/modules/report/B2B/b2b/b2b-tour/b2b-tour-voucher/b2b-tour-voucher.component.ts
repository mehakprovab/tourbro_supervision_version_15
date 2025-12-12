import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Router } from '@angular/router';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-b2b-tour-voucher',
  templateUrl: './b2b-tour-voucher.component.html',
  styleUrls: ['./b2b-tour-voucher.component.scss']
})
export class B2bTourVoucherComponent implements OnInit {

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
  termsandConditions: any;
  paxData: any[] = [];
  loggedInUser: any;

    commonBadgeStyle = {
    fontSize: '13px',
    padding: '8px',
    borderRadius: '5px',
  }
  showMandatoty: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    this.loggedInUser = JSON.parse(currentDomainUser);
    console.log(this.loggedInUser)
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['AppReference']);
      this.getVoucher();
    });
  }

  getVoucher() {
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2bTourVoucher', 'post', {}, {},
      {
        "AppReference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.loading = false;
          this.voucherData = resp.data;
          this.bookingDetails = this.voucherData;
          this.termsandConditions = resp.data.BookingDeatils[0].terms.replace(/[\n\t]/g, '');
          this.bookingDetails.BookingDeatils[0].tour_details.accommodations.reduce((acc, item) => {
            item.prices.forEach(tier => {
              this.paxData.push({
                name: item.name,
                value: tier.value,
                  type: tier.pax_type,
                travellercount: tier.quantity
              });
            });
            return acc;
          }, []);

          this.bookingDetails.BookingDeatils[0].tour_details.mandatory_addons.reduce((acc, item) => {
            item.prices.forEach(tier => {
              if(item.payment_type !== 'local') {
                  this.paxData.push({
                  name: item.name,
                  value: tier.value,
                    type: '',
                  travellercount: tier.quantity
                });
              }
            });
            return acc;
          }, []);
          this.cdr.detectChanges();
        }
        else {
          this.loading = false;
          this.swalService.alert.error('Something went wrong please try again.');
          this.router.navigate(['report/b2b-tour'])
        }
      }, (err) => {
        this.loading = false;
          this.swalService.alert.error('Something went wrong please try again.');
          this.router.navigate(['report/b2b-tour'])
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
            pdf.save(`Agent Tour Voucher - ${this.app_reference}.pdf`);
        }).catch(err => {
            this.loading = false;
            console.error('PDF Error:', err);
            this.swalService.alert.error('Error generating PDF');
        });
    }, 1000);
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
  data.forEach((res) => {
    if (res.payment_type === 'local') {
      this.showMandatoty = true;
    }
  })
   return this.showMandatoty;
 }

 getMandatoryPrice(data) {
  return data.reduce((sum, item) => {
    return sum + item.prices.reduce((priceSum, price) => priceSum + price.value, 0);
  }, 0);
}

  getTourImage(img) {
    return `${baseUrl + '/tour/tours/getBannerImage/' + img}`;
  }

  getOptionalTours(data) {
     if(data) {
      return JSON.parse(data);
    }
  }
}

