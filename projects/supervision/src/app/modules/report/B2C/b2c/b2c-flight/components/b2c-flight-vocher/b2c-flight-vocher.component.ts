import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { Logger } from '../../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

const log = new Logger('report/B2cFlightVocherComponent');

@Component({
    selector: 'app-b2c-flight-vocher',
    templateUrl: './b2c-flight-vocher.component.html',
    styleUrls: ['./b2c-flight-vocher.component.scss']
})
export class B2cFlightVocherComponent implements OnInit, OnDestroy {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    airline_logo = 'https://booking247.com/airline_logo/'; //AI.gif
    isSeatInfoNotEmpty:any=false;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
          jsPDF: {
            orientation: 'potrait'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    
      };
      dataTime:any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.getB2cHotelVoucher();
    }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData['AppReference']
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
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();
            }
        });
    }


  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
    }


  }

    getB2cHotelVoucher() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    resp.data[0]['FlightItineraries'].forEach((element, i) => {
                        if (element.attributes) {
                            let attributes = element.attributes.replace(/\"/gi, "\"");
                            resp.data[0]['FlightItineraries'][i]['attributes'] = JSON.parse(attributes);
                        }
                    });
                    this.voucherData = resp.data[0] || [];
                    this.dataTime =new Date(this.voucherData.CreatedDatetime)
                    this.enableSeat();
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

    findLeaduserDetails(data) {
        if (data) {
            let leadUser = data.filter(x => {
                return x.LeadPax == true
            });
            return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

    download(type, orientation) {

    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    duration(f) {
        const origin = f.departure_datetime;
        const destination = f.arrival_datetime
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';

    }

    enableSeat() {
        const currentUser = this.utility.readStorage('currentSupervisionUser', sessionStorage);
        if (this.voucherData) {
            this.isSeatInfoNotEmpty =this.utility.checkSeatSelection(this.voucherData.Passengers);
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
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

}
