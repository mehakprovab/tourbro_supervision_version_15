import { getTourDocumentFilename } from '../../../../utils/tour-document-filename';
import { canViewAdminReportFields } from '../../../../utils/report-column-visibility';
import { getTourDocumentPricing } from '../../../../utils/tour-document-pricing';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';


const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-b2c-tour-voucher',
  templateUrl: './b2c-tour-voucher.component.html',
  styleUrls: ['./b2c-tour-voucher.component.scss']
})
export class B2cTourVoucherComponent implements OnInit {
  readonly showAdminReportFields = canViewAdminReportFields();

  get pricing() {
    return getTourDocumentPricing(this.voucherData, this.showAdminReportFields);
  }


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
    private cdr: ChangeDetectorRef,
    private utility: UtilityService
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

  async downloadA4(type: any, orientation?: string): Promise<void> {
    if (this.loading) {
      return;
    }
    const content = this.print_voucher && this.print_voucher.nativeElement;
    if (!content || !this.voucherData) {
      this.swalService.alert.error('Please wait for the voucher to load.');
      return;
    }

    this.loading = true;
    try {
      const canvas = await html2canvas(content, {
        allowTaint: false,
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: element => element.matches('button, #download, .pdf-exclude, .no-print, .doc-btn, .btnStyle')
      });
      if (!canvas.width || !canvas.height) {
        throw new Error('Voucher has no renderable content');
      }
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 10;
      const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const contentHeight = pdf.internal.pageSize.getHeight() - margin * 2;
      const pageHeightPx = Math.max(1, Math.floor(contentHeight * canvas.width / contentWidth));

      for (let startY = 0; startY < canvas.height; startY += pageHeightPx) {
        if (startY > 0) {
          pdf.addPage();
        }
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - startY);
        const context = pageCanvas.getContext('2d');
        if (!context) {
          throw new Error('Unable to create PDF canvas');
        }
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(canvas, 0, startY, canvas.width, pageCanvas.height,
          0, 0, canvas.width, pageCanvas.height);
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin,
          contentWidth, pageCanvas.height * contentWidth / canvas.width);
      }
      await pdf.save(getTourDocumentFilename('Voucher', this.voucherData, this.app_reference), { returnPromise: true });
      this.swalService.alert.success();
    } catch {
      this.swalService.alert.error('Unable to download the voucher. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  printVoucher(): void {
    const voucher = this.print_voucher && this.print_voucher.nativeElement;

    if (!voucher || this.loading || !this.voucherData) {
      this.swalService.alert.oops();
      return;
    }

    this.utility.printElement(voucher, `Tour Voucher - ${this.app_reference}`);
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
