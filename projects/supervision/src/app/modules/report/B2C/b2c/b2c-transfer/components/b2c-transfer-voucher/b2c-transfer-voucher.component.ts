import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink/dist/subsink';
import { Location } from '@angular/common';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { ReportService } from '../../../../../report.service';
import { finalize } from 'rxjs/operators';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-b2c-transfer-voucher',
  templateUrl: './b2c-transfer-voucher.component.html',
  styleUrls: ['./b2c-transfer-voucher.component.scss']
})
export class B2cTransferVoucherComponent implements OnInit {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  app_reference = ''
  voucherData: any;
  bookingDetails: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  serviceTax: number = 0;
  logInUser: any;
  loggedInUser: any;
  showAgentDetails: boolean = false;
  displayColumn: any[] = [];
  maxRoutesCount: any;
  attributes: any
  itinerary: any
  pax: any = []
  BookingItineraryDetails
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.reportService.actionFromReports.subscribe((data) => {
      if (data === 'b2b') {
        this.showAgentDetails = true;
      } else {
        this.showAgentDetails = false;
      }
    })
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
      this.getVoucher();
    });
    this.logInUser = JSON.parse(sessionStorage.getItem("currentSupervisionUser"));
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    this.loggedInUser = JSON.parse(currentDomainUser)['auth_role_id'];
  }
  getVoucher(): void {
    // this.loading = true;

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('WebTransferVoucher', 'post', {}, {}, {
        AppReference: this.app_reference
      })
      .pipe(
        finalize(() => {
          this.loading = false; // 🔥 always closes loader
          this.cdr.detectChanges();
        })
      )
      .subscribe(
        (resp: any) => {
          this.loading = false;

          if (resp.statusCode !== 200 && resp.statusCode !== 201) {
            this.swalService.alert.error(resp.msg || 'Unable to fetch voucher');
            return;
          }

          this.voucherData = resp.data;
          this.attributes = JSON.parse(this.voucherData.BookingDetails.attributes);
          this.bookingDetails = this.voucherData.BookingDetails;
          console.log(this.bookingDetails, this.bookingDetails)
          this.itinerary = this.voucherData.BookingItineraryDetails;
          this.pax = this.voucherData.BookingPaxDetails;

          this.attributes = JSON.parse(this.voucherData.BookingDetails.attributes);
          console.log(this.pax, "pax")
          /* ---------------- Booking Details ---------------- */
          // let bookingAttributes = {};
          // if (this.voucherData.BookingDetails.attributes) {
          //   try {
          //     bookingAttributes = JSON.parse(
          //       this.voucherData.BookingDetails.attributes
          //         .replace(/[\n\r\t]/g, ' ')
          //         .replace(/'/g, '"')
          //     );
          //   } catch (e) {
          //     console.error('BookingDetails parse error', e);
          //   }
          // }

          /* ---------------- Pax Details (NO attributes parsing) ---------------- */
          // const paxDetails =
          //   this.voucherData.BookingPaxDetails.length > 0
          //     ? this.voucherData.BookingPaxDetails[0]
          //     : {};

          // /* ---------------- Itinerary Details ---------------- */
          // let itineraryAttributes = {};
          // if (this.voucherData.BookingItineraryDetails.attributes) {
          //   try {
          //     itineraryAttributes = JSON.parse(
          //       this.voucherData.BookingItineraryDetails.attributes
          //         .replace(/[\n\r\t]/g, ' ')
          //         .replace(/'/g, '"')
          //     );
          //   } catch (e) {
          //     console.error('ItineraryDetails parse error', e);
          //   }
          // }

          // /* ---------------- Final Merged Objects ---------------- */
          // this.bookingDetails = {
          //   ...this.voucherData.BookingDetails,
          //   ...bookingAttributes
          // };


          // this.BookingItineraryDetails = itineraryAttributes;

          /* ---------------- Route Name Handling ---------------- */
          try {
            this.bookingDetails.route_name_list =
              this.bookingDetails.data.route_name || [];
          } catch {
            this.bookingDetails.route_name_list = [];
          }

          this.maxRoutesCount = this.bookingDetails.route_name_list.length || 0;

          this.cdr.detectChanges();
        },
        (error) => {
          this.loading = false;
          console.error(error);
          this.swalService.alert.error('Something went wrong');
        }
      );
  }
  parseAttributes(value: any): any {
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(
        value.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"')
      );
    } catch (e) {
      return null;
    }
  }

  // getVoucher() {
  //   this.loading=true;
  //   this.subSunk.sink = this.apiHandlerService.apiHandler('WebTransferVoucher', 'post', {}, {},
  //     {
  //       "AppReference": this.app_reference,
  //     })
  //     .subscribe(resp => {
  //       if (resp.statusCode == 200 || resp.statusCode == 201) {
  //         this.voucherData = resp.data;
  //         this.loading=false;
  //         let bookingData = this.voucherData.BookingDetails.attributes.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"');
  //         let paxDetails = this.voucherData.BookingPaxDetails[0].attributes.replace(/'/g, '"');
  //         this.bookingDetails = { ...JSON.parse(paxDetails), ...JSON.parse(bookingData) };

  //             try {
  //                 this.bookingDetails.route_name_list = this.bookingDetails.data.route_name || [];
  //             } catch(err) {
  //                 this.bookingDetails.route_name_list = [];
  //             }
  //             this.maxRoutesCount = Math.max(
  //             this.bookingDetails.route_name_list.length || 0
  //             );
  //           for (let i = 1; i <= this.maxRoutesCount; i++) {
  //             this.displayColumn.splice(7 + (i - 1), 0, {
  //                 key: "location_" + i,
  //                 value: "Location " + i
  //             });
  //           }
  //         console.log(this.bookingDetails)     

  //         this.cdr.detectChanges();
  //       }
  //       else {
  //         this.loading=false;
  //         this.swalService.alert.error(resp.msg || '');
  //       }
  //     }, err => {
  //       this.loading=false;
  //     });
  // }

  getFormtedStatus(status: string) {
    if (status != null) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
  }

  async downloadA4(type: any, orientation?: string) {
    try {


      const base64Image = await this.getImage(this.bookingDetails.ProductImage);

      const imgEl = document.querySelector('.image-download img') as HTMLImageElement;
      if (imgEl) {
        imgEl.src = base64Image;
        await this.waitForImageToLoad(imgEl); // ensure image is rendered
      }
      this.loading = true;
      document.getElementById('download').style.display = "none";
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
          doc.save(`${this.app_reference}.pdf`);
          this.loading = false;
          this.swalService.alert.success();
          document.getElementById('download').style.display = "inline-block";
          this.cdr.detectChanges();
        }
      });
    } catch {
      this.loading = false;
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
  getDeparture(item: any): string {
    if (!item || !item.BookingDetails || !item.BookingDetails.attributes) {
      return 'N/A';
    }

    try {
      const parsed = JSON.parse(
        item.BookingDetails.attributes
          .replace(/[\n\r\t]/g, ' ')
          .replace(/'/g, '"')
      );

      if (
        parsed.searchRequest &&
        parsed.searchRequest.source &&
        parsed.searchRequest.source.LocationName
      ) {
        return parsed.searchRequest.source.LocationName;
      }
    } catch (e) {
      console.error('Departure parse error', e);
    }

    return 'N/A';
  }


  getSupplierPhoneNumber(value) {
    // console.log('Original value:', value);
    let values = value.replace(/'/g, '"');
    try {
      let attributes = JSON.parse(values);
      // console.log("attributes",attributes)
      return attributes.SupplierPhoneNumber;
    } catch (error) {
      // console.error('Error parsing JSON:', error, 'Input:', values);
      return null;
    }
  }
  getDestination(item: any): string {
    if (!item || !item.BookingDetails || !item.BookingDetails.attributes) {
      return 'N/A';
    }

    try {
      const parsed = JSON.parse(
        item.BookingDetails.attributes
          .replace(/[\n\r\t]/g, ' ')
          .replace(/'/g, '"')
      );

      if (
        parsed.searchRequest &&
        parsed.searchRequest.destination &&
        parsed.searchRequest.destination.LocationName
      ) {
        return parsed.searchRequest.destination.LocationName;
      }
    } catch (e) {
      console.error('Destination parse error', e);
    }

    return 'N/A';
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

  backtoReports() {
    this.location.back();
  }

  getImageBanner(img) {
    return `${baseUrl + '/transfer/getTransferImage/' + img}`;
  }

}
