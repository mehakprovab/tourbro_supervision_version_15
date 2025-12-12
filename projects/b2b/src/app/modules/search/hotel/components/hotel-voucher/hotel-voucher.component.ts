import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
    selector: 'app-hotel-voucher',
    templateUrl: './hotel-voucher.component.html',
    styleUrls: ['./hotel-voucher.component.scss']
})
export class HotelVoucherComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSink = new SubSink();
    voucher:any;
    booking_source:any;
    isLoading: boolean = true;
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    showPayment: boolean = true;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'voucher-print',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    adult=0;
    child=0;
    updatedDateFrom: string;
    public hotelPolicy: any;
    public childPolicy: any;
    logInUser: any;
    bookingLogo = 'assets/images/l-logo.png';
    remarksData: any;
    commonBadgeStyle = {
        fontSize: '13px',
        padding: '8px',
        borderRadius: '5px',
      }
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private hotelService: HotelService,
        private exportAsService: ExportAsService,
        private router: Router,
        private swalService: SwalService,
        // private ngxService: NgxUiLoaderService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.hotelService.loading.next(true);
        this.activatedRoute.queryParams.subscribe(q => {
            console.log("q",q)
            if (!this.util.isEmpty(q)) {
                this.bookingConfirmation(q);
            }
        })
        this.logInUser = JSON.parse(sessionStorage.getItem("currentUser"));
        // this.ngxService.stop();
    }

    bookingConfirmation(q) {
        console.log(q);
        this.booking_source = q.bookingSource;
        this.hotelService.loading.next(true);
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {}, {
            AppReference: q.AppReference, booking_source: this.booking_source
        }).pipe(
            finalize(() => {
                this.hotelService.loading.next(false);
                this.isLoading = false;
            })
        ).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.hotelService.loading.next(false);
                this.voucher = resp.data;
                if (this.booking_source !== 'TLAPNO00003'){
                    this.remarksData = this.voucher.BookingDetails.remarks;
                }
                if(this.booking_source === 'TLAPNO00003') {
                    const hotelPolicy = resp.data.BookingDetails.CancellationReason.hotelBody.HotelPolicy.length>0 ? resp.data.BookingDetails.CancellationReason.hotelBody.HotelPolicy : '';
                    this.hotelPolicy = hotelPolicy ? hotelPolicy.map(item => 
                        item.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>')
                    ) : '';
                }
                if(this.booking_source === 'TLAPNO00003'){ 
                    const childPolicy = resp.data.BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails.length >0? resp.data.BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails[0].description : '';
                    this.childPolicy = childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                }
 
                if(this.voucher.BookingDetails.booking_source === "TLAPNO00003" && this.voucher.BookingDetails.CancellationPolicy.$t.length){
                    // const dateFrom = new Date(this.voucher.BookingDetails.CancellationPolicy.$t[0].date_from); // Convert to Date object
                    // dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
                    // this.updatedDateFrom = dateFrom.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"

                    const minDate = this.voucher.BookingDetails.CancellationPolicy.$t
      .map(data => new Date(data.date_from))
      .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest one

    if (minDate) {
      minDate.setDate(minDate.getDate() - 1); // Subtract 1 day
      this.updatedDateFrom = minDate.toISOString().split('T')[0];
      console.log("this.updatedDateFrom", this.updatedDateFrom);
    }
                }
                if(this.booking_source !== 'TLAPNO00003'){
                this.voucher['BookingDetails'].CancellationReason.searchRequest.RoomGuests.forEach(item => {
                    console.log("item",item)
                    this.adult += item.NoOfAdults;
                    this.child += item.NoOfChild;
                });
            }
            if(this.booking_source === 'TLAPNO00003'){
                this.voucher['BookingDetails'].CancellationReason.hotelBody.searchRequest.RoomGuests.forEach(item => {
                    console.log("item",item)
                    this.adult += item.NoOfAdults;
                    this.child += item.NoOfChild;
                });
            }
            if (this.voucher.BookingPaxDetails.length) {
                // Sort so that LeadPax comes first
                this.voucher.BookingPaxDetails.sort((a, b) => {
                  return (b.LeadPax === true ? 1 : 0) - (a.LeadPax === true ? 1 : 0);
                });
              
                // Reset counters before looping
                this.noOfAdults = 0;
                this.noOfChilds = 0;
              
                // Count PaxTypes
                this.voucher.BookingPaxDetails.forEach((element, i) => {
                  if (element['PaxType'] === 'Child') {
                    this.noOfChilds++;
                  } else if (element['PaxType'] === 'Adult') {
                    this.noOfAdults++;
                  }
                });
              }    
            }
        }, err => {
            this.hotelService.loading.next(false);
            console.error(err);
        });
    }

    getParsedCancellationReason() {
        try {
            let reason = this.voucher.BookingDetails.CancellationReason;
            return typeof reason === 'string' ? JSON.parse(reason.replace(/'/gi, "\"")) : reason;
        } catch (error) {
            console.error("Error parsing CancellationReason:", error);
            return {};
        }
      }

    getNoOfRoomsCount() {
        let totalRoomsBooked: number = 0;
        console.log(" this.voucher['BookingItineraryDetails']", this.voucher)
        this.voucher['BookingItineraryDetails'].forEach(o => {
            totalRoomsBooked += o['BlockQuantity'];
        });
        return totalRoomsBooked;
    }

    getDatesFormat(date) {
        if (date != null) {
            date = date.split(' ')[0];
            let d = new Date(date).getDate(), m = new Date(date).toDateString().split(' ')[1], y = new Date(date).getFullYear(), day = new Date(date).toDateString().split(' ')[0];
            day = this.util.getWeekDay(day);
            return `${day + ',&nbsp;' + d + '&nbsp;' + m + '&nbsp;' + y}`;
        }
    }

    getTimes(t: string): string {
        if (t != null) {
            t = t.split(' ')[1];
            let time = Number(t.split(':')[0]);
            if (time > 12) {
                return `${t} PM`;
            } else if (time < 12) {
                return `${t} AM`;
            } if (time == 12) {
                return `${t} PM`;
            }
        }
    }

    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }

    getTotalAmnt() {
        let totalAmnt: number = 0;
        this.voucher['BookingItineraryDetails'].forEach(o => {
            totalAmnt += o.TotalFare;
        });
        return totalAmnt;
    }

    getNoOfNights(i, o): number {
        let checkin = Number(new Date(i).getTime()), checkout = Number(new Date(o).getTime()), nights: number = 0;
        nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
        return nights;
    }

    getBoardType(roomName: string): string {
        let temp = roomName.split('-'), boardType = '';
        temp.forEach((s, i) => {
            if (i > 0 && i < temp.length - 1) {
                boardType += s;
                boardType += (i < temp.length - 2) ? '-' : '';
            }
        })
        return `${boardType}`;
    }

    // getCancelationPolicy(cancellationPolicy) {
    //     let policy = JSON.parse(cancellationPolicy.replace(/'/gi, "\""));
    //     if (policy['NonRefundable']) {
    //         return `Non Refundable`;
    //     } else if (!policy['NonRefundable']) {
    //         let penalty = '';
    //         if (typeof policy['CancelPenalty'] == 'object') {
    //             policy['CancelPenalty'].forEach((element, i) => {
    //                 penalty += `Cancellation made <strong>${element.HoursBefore} hours</strong> before checkin <strong>${this.voucher['BookingDetails']['Currency'] + ' ' + element.Penalty.Value}</strong> will be charged as cancellation penalty`;
    //                 if (policy['CancelPenalty'].length - 1 != i) {
    //                     penalty += '<br>'
    //                 }
    //             });
    //             return penalty;
    //         } else {
    //             penalty += `You may cancel your booking for <strong>no charge</strong> on or before <strong>${policy['CancelPenalty']}</strong>`;
    //             return penalty;
    //         }
    //     }

    // }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + '&nbsp;' + tmpStatus[1]}`
    }

    public downloadPDF1(isWithPrice: boolean) {
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
                doc.save(`${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}.pdf`);
                console.log('Success');
                this.swalService.alert.success();
            }
        });
    }

    getImageLoad(imagePath: string): Promise<string> {
  const obj = {
    app_reference: this.voucher['BookingDetails']['AppReference'],
    image_url: imagePath.replace(/'/g,'')
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

    async downloadPDF() {
        this.loading = true;
        window.scrollTo(0, 0);


        try {
      const base64Image = await this.getImageLoad(this.voucher.BookingDetails.HotelPhoto);

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
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 280; // A4 height in mm

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
                pdf.save(`${this.voucher['BookingDetails']['AppReference']}-${date}.pdf`);
            });
        }, 1000);
} catch {
    this.loading = false;
}

        
    }
      

    download(type: SupportedExtensions, isWithPrice: boolean, orientation?: string) {
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}`).subscribe((_) => {
            console.log(`success`);
        }, (err) => {
            console.log(err);
        });
    }

    cancel() {
        this.router.navigate(['/hotel/hotel-cancellation'], {
            queryParams: { "AppReference": this.voucher['BookingDetails']['AppReference'] }
        })
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        console.log(noOfPages)
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    downloadWithPrice(t: boolean) {
        console.log(t);
        this.showPayment = t;
    }

    getTotalFare(itinarary: any) {
        let totalFare: any = 0;
        itinarary.forEach(element => {
            totalFare += element.RoomPrice;
        });
        return totalFare;
    }

    getHotelPhoto(imgArrStr) {
        let imgArray = JSON.parse(imgArrStr.replace(/'/gi, "\""));
        return imgArray;
    }
    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
            starArr.length = Math.round(num);
        return starArr;
    }
    getStarArrayRemaining(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = 5 - Math.round(num);
        return starArr;
    }
    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

    replaceUlTag(data) { 
       return data.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
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

}