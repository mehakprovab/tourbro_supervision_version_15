import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { Logger } from '../../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Location } from '@angular/common';

const log = new Logger('report/B2cActivityVocherComponent');

@Component({
  selector: 'app-activity-voucher',
  templateUrl: './activity-voucher.component.html',
  styleUrls: ['./activity-voucher.component.scss']
})
export class ActivityVoucherComponent implements OnInit, OnDestroy {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  app_reference = ''
  voucherData: any;
  loadError = '';
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
    private loc: Location,
    private utility: UtilityService
  ) { }

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('currentSupervisionUser')
      || localStorage.getItem('currentDomainUser');
    try {
      const user = JSON.parse(storedUser || 'null');
      this.loggerUserAuthId = Number(user && user.auth_role_id);
    } catch {
      this.loggerUserAuthId = 0;
    }
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
      this.getVoucher();
    });
  }

  getVoucher() {
    this.voucherData = null;
    this.formattedActivityRemark = '';
    this.loadError = '';
    if (!this.app_reference) {
      this.loading = false;
      this.loadError = 'The booking reference is missing.';
      return;
    }
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('activityVoucher', 'post', {}, {},
      { app_reference: this.app_reference })
      .subscribe(resp => {
        this.loading = false;
        const voucher = resp && resp.data && resp.data[0];
        if (resp && (resp.statusCode == 200 || resp.statusCode == 201) && voucher) {
          this.voucherData = voucher;
          this.processActivityRemark();
        } else {
          this.loadError = (resp && resp.msg) || 'No activity voucher was found for this booking.';
          this.swalService.alert.error(this.loadError);
        }
      }, () => {
        this.loading = false;
        this.loadError = 'Unable to load the activity voucher. Please try again.';
        this.swalService.alert.error(this.loadError);
      });
  }

  processActivityRemark() {
    const text = this.voucherData?.ItenaryData?.attributes?.ActivityRemark?.[0]?.text;
    this.formattedActivityRemark = typeof text === 'string' ? text.replace(/\/\/\s*/g, '<br>') : '';
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

  getFormtedStatus(status: string) {
    if (status != null) {
      let tmpStatus = status.split('_');
      return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
    }
  }

  downloadA4(type: any, orientation?: string): void {
    if (!this.voucherData || !this.print_voucher || this.loading) {
      return;
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
    const exportContent = this.utility.prepareExportElement(content);
    doc.html(exportContent, {
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

  printVoucher(): void {
    const element = this.print_voucher && this.print_voucher.nativeElement;
    this.utility.printElement(element, `Activity Voucher - ${this.app_reference}`);
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
