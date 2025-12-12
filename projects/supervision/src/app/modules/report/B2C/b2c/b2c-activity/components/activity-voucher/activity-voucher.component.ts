import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { Logger } from '../../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { Location } from '@angular/common';

const log = new Logger('report/B2cActivityVocherComponent');

@Component({
  selector: 'app-activity-voucher',
  templateUrl: './activity-voucher.component.html',
  styleUrls: ['./activity-voucher.component.scss']
})
export class ActivityVoucherComponent implements OnInit {

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
    private cdr: ChangeDetectorRef,
    private loc: Location
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
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('activityVoucher', 'post', {}, {},
      {
        "app_reference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.voucherData = resp.data[0];
          this.loading = false;
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
          this.loading = false;
        }
      });
  }

  
  processActivityRemark() {
    if (this.voucherData.ItenaryData.attributes.ActivityRemark && this.voucherData.ItenaryData.attributes.ActivityRemark[0].text) {
      this.formattedActivityRemark = this.voucherData.ItenaryData.attributes.ActivityRemark[0].text.replace(/\/\/\s*/g, '<br>');
    }
  }

  getFormtedStatus(status: string) {
    if (status != null) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
  }

  downloadA4(type: SupportedExtensions, orientation?: string): void {
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

  backToreports() {
    this.loc.back();
  }
}
