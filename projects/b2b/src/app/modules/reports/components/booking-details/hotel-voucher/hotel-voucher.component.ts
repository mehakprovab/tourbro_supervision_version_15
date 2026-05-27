import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../search/hotel/hotel.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-hotel-voucher',
  templateUrl: './hotel-voucher.component.html',
  styleUrls: ['./hotel-voucher.component.scss']
})
export class HotelVoucherComponent implements OnInit {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  isOpen = false as boolean;
  voucherData: any;
  app_reference: "";
  noOfAdults: number = 0;
  noOfChilds: number = 0;
  domainInformation: any;
  config: ExportAsConfig = {
    type: 'pdf',
    elementId: 'print_voucher',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }

  };
  logInUser: any;
  loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
  updatedDateFrom: string;
  parsedData: any;
  public hotelPolicy: any;
  public childPolicy: any;
  public typeOfData: boolean = false;
  remarksData: any;
  reportFrom: any;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private exportAsService: ExportAsService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private hotelService: HotelService,
    private utility: UtilityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
      this.reportFrom = queryParams['from'];
    });
    this.getB2cHotelVoucher();
    this.getDomain();
  }

  getB2cHotelVoucher() {
    this.logInUser = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log("this.loggedInUser image", this.logInUser["domain_logo"]);
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2bHotelVouher', 'post', {}, {},
      {
        "app_reference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data[0] || [];
         
          if (typeof(this.voucherData.BookingDetails.CancellationReason)  === 'object') {
            this.typeOfData = true;
            const childPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails.length > 0 ? resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails[0].description : '';
            this.childPolicy =  childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
            const hotelPolicy =  resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy.length> 0 ?  resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy[0] : '';
            this.hotelPolicy = hotelPolicy ? hotelPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
          }
         
          if( this.voucherData.BookingDetails.DomainOrigin !== 'CRS'){
             this.remarksData = this.voucherData.BookingDetails.remarks;
            if (typeof(this.voucherData.BookingDetails.CancellationReason ) !== 'object') {
              let cancellationReason = this.voucherData.BookingDetails.CancellationReason;
              cancellationReason = cancellationReason.replace(/(\r\n|\n|\r)/gm, ' ');

              // Step 2: Replace single quotes with double quotes
              cancellationReason = cancellationReason.replace(/'/g, '"');

              // Step 3: Fix trailing commas before } or ]
              cancellationReason = cancellationReason.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
              const validJsonString = cancellationReason;
              this.parsedData = JSON.parse(validJsonString);
             
            }
            const validateJSON = (this.voucherData.BookingDetails.CancellationReason);
            const jsonFormater = validateJSON.replace(/'/g, '"')
            const validJsonString = JSON.parse(jsonFormater);
            this.parsedData = validJsonString;
            // this.remarksData = this.parsedData.RoomDetails[0].remarks;
            // console.log("parsedData",this.parsedData)
            this.cdr.detectChanges();
            }
            // this.parsedData = JSON.parse(this.voucherData.BookingDetails.CancellationReason)
            if(this.voucherData.BookingDetails.DomainOrigin === 'CRS' && this.voucherData.BookingDetails.CancellationPolicy.$t.length){
          const minDate = this.voucherData.BookingDetails.CancellationPolicy.$t
            .map(data => new Date(data.date_from))
            .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest one

          if (minDate) {
            minDate.setDate(minDate.getDate() - 1); // Subtract 1 day
            this.updatedDateFrom = minDate.toISOString().split('T')[0];
            console.log("this.updatedDateFrom", this.updatedDateFrom);
          }
          }
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

  getParsedCancellationReason() {
    try {
        let reason = this.voucherData.BookingDetails.CancellationReason;
        reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');

              // Step 2: Replace single quotes with double quotes
        reason = reason.replace(/'/g, '"');

        // Step 3: Fix trailing commas before } or ]
        reason = reason.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        return typeof reason === 'string' ? JSON.parse(reason) : reason;
    } catch (error) {
        console.error("Error parsing CancellationReason:", error);
        return {};
    }
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
        if (cancellationPolicy) {
            const penalty = this.hotelService.getCancelationPolicy(cancellationPolicy, this.voucherData['BookingDetails']['Currency']);
            return penalty;
        }
    }

  getFormtedStatus(status: string) {
    console.log(status)
    let tmpStatus = status.split('_');
    return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
  }

  getDomain() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
      {})
      .subscribe(resp => {
        if (resp.statusCode == 201 && resp.data) {
          this.domainInformation = resp.data[0];

        }
      })
  }

  download(type: SupportedExtensions, orientation?: string) {
    // if (type)
    this.config.type = type;
    if (orientation) {
      this.config.options.jsPDF.orientation = orientation;
    }
    const date = new Date().toDateString();
    setTimeout(() => {
      this.exportAsService.save(this.config, `voucher_${this.app_reference}`).subscribe((_) => {
        // save started
        this.swalService.alert.success();
      }, (err) => {
        console.log(err);
        this.swalService.alert.oops();
      });
    }, 1000)

  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
  }
    
  async downloadA4(type: SupportedExtensions, orientation?: string) {
    
    this.loading = true;
    document.getElementById('download').style.display = "none";
    try {
      const base64Image = await this.getImageLoad(this.voucherData.BookingDetails.HotelPhoto);

    const imgEl = document.querySelector('.image-download img') as HTMLImageElement;
    if (imgEl) {
      imgEl.src = base64Image;
      await this.waitForImageToLoad(imgEl); // ensure image is rendered
    }
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
      this.swalService.alert.error()
      document.getElementById('download').style.display = "inline-block";
      this.loading = false;
    }
   
  }

   getImageLoad(imagePath: string): Promise<string> {
  const obj = {
    app_reference: this.app_reference,
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
  ngOnDestroy(): void {
    this.subSunk.unsubscribe();

  }
  getImage(data) {
    return data.replace(/'/g,'');
  }
  backToreports() {
    if (this.reportFrom === 'bundle') {
      this.router.navigate(['/reports/bundle-booking-details']);
    } else {
      this.router.navigate(['/reports/hotel-booking-details']);
    }
  }
}
