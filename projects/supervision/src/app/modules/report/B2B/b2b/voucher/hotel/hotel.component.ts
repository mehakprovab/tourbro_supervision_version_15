import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
  booking_source: any;
  parsedData: any;
  updatedDateFrom: string;
  public childPolicy: any;
  public hotelPolicy: any;
  public auth_role_id: any;
  remarksData: any;
  currentUser: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.getB2cHotelVoucher();
        this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
        const auth_role_id = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
        this.auth_role_id = auth_role_id.auth_role_id;
    }

    getB2cHotelVoucher() {
        this.loading=true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHotelVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.voucherData = resp.data[0] || [];
                    if (typeof(resp.data[0].BookingDetails.CancellationReason) === 'object' ) {
                      const hotelPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy.length > 0 ? resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy[0]: '';
                      
                        this.hotelPolicy = hotelPolicy ? hotelPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                  
                     
                    const childPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails.length > 0 ? resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails[0].description : '';
                    this.childPolicy = childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                    }
                    

                    if( this.voucherData.BookingDetails.DomainOrigin !== 'CRS'){
                      const validJsonString = this.voucherData.BookingDetails.CancellationReason.replace(/'/g, '"');
                      const parsedString = validJsonString.replace(/\\n/g, "\\\\n").replace(/\n/g, "\\n");
                     this.parsedData = JSON.parse(parsedString);
                     this.remarksData = this.voucherData.BookingDetails.remarks;
                     console.log("parsedData",this.parsedData)
                     this.cdr.detectChanges();
                      }
                      // this.parsedData = JSON.parse(this.voucherData.BookingDetails.CancellationReason)
                      if(this.voucherData.BookingDetails.DomainOrigin == 'CRS' && this.voucherData.BookingDetails.CancellationPolicy.$t.length){
                        const dateFrom = new Date(this.voucherData.BookingDetails.CancellationPolicy.$t[0].date_from); // Convert to Date object
                        dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
                        this.updatedDateFrom = dateFrom.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
                    }
                    this.loading=false;
                    // this.booking_source = this.voucherData.BookingDetails.CancellationReason.hotelBody.booking_source;
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
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }

    getTime(t) {
        return t.split(" ")[1];
    }

    cancelBooking() {

    }


    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }


    findLeaduserDetails(data, type) {
        if (data) {
            let leadUser, value = "";
            leadUser = data.filter(x => x.LeadPax == true);
            switch (type) {
                case 'name':
                    value = `${leadUser[0].Title}. ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
                    break;
                case 'email':
                    value = `${leadUser[0].Email}`;
                    break;
                case "phone":
                    value = `${leadUser[0].PhoneNumber}`;
                    break;
            }
            return value;
        } else return 'N/A';
    }

    getCancelationPolicy(cancellationPolicy) {
        let policy = JSON.parse(cancellationPolicy.replace(/'/gi, "\""));
        if (policy['NonRefundable']) {
            return `Non Refundable`;
        } else if (!policy['NonRefundable']) {
            let penalty = '';
            if (typeof policy['CancelPenalty'] == 'object') {
                policy['CancelPenalty'].forEach((element, i) => {
                    penalty += `Cancellation made <strong>${element.HoursBefore} hours</strong> before checkin <strong>${this.voucherData['BookingPaxDetails']['Currency'] + ' ' + element.Penalty.Value}</strong> will be charged as cancellation penalty`;
                    if (policy['CancelPenalty'].length - 1 != i) {
                        penalty += '<br>'
                    }
                });
                return penalty;
            } else {
                penalty += `You may cancel your booking for <strong>no charge</strong> on or before <strong>${policy['CancelPenalty']}</strong>`;
                return penalty;
            }
        }
    }


    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + '&nbsp;' + tmpStatus[1]}`
    }

    async downloadA4() {
        this.loading = true;
        const downloadButton = document.getElementById('download');
        if (downloadButton) downloadButton.style.display = "none";
       try{
          const base64Image = await this.getImage(this.voucherData.BookingDetails.HotelPhoto);

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
        this.loading = false
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
      getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            let imgArray = JSON.parse(imgArrStr.replace(/'/gi, "\""));
            console.log("imgArray",imgArray)
            return imgArray;
        } else {
            return '';
        }
    }

    getParsedCancellationReason() {
      try {
          let reason = this.voucherData.BookingDetails.CancellationReason;
          return typeof reason === 'string' ? JSON.parse(reason.replace(/'/g, '"')) : reason;
      } catch (error) {
          console.error("Error parsing CancellationReason:", error);
          return {};
      }
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();

    }

     getImage(imagePath: string): Promise<string> {
  const obj = {
    app_reference: this.app_reference,
    image_url: imagePath.replace(/^'(.*)'$/, '$1')
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
