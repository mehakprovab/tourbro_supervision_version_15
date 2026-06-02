import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Location } from '@angular/common';
const log = new Logger('report/HotelVoucherComponent');

@Component({
    selector: 'app-hotel-voucher',
    templateUrl: './hotel-voucher.component.html',
    styleUrls: ['./hotel-voucher.component.scss']
})
export class HotelVoucherComponent implements OnInit, OnDestroy {

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
    updatedDateFrom: string;
    parsedData:any;
  countryList: any;
  public hotelPolicy: any;
  public childPolicy: any;
  remarksData: any;
  
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
          private location : Location
    ) { }
printVoucher() {
  window.print();
}
    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });

        this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(res => {
          this.countryList = res.data.popular_countries.concat(res.data.countries);
      });
        this.getB2cHotelVoucher();
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
                  //   if (this.voucherData.BookingDetails.DomainOrigin !== 'CRS') {

                  //   }
                  //   const validJsonString = this.voucherData.BookingDetails.CancellationReason.replace(/'/g, '"');
                  //   const parsedString = validJsonString.replace(/\\n/g, "\\\\n").replace(/\n/g, "\\n");
                  //   this.parsedData = JSON.parse(parsedString);

                  //   const childPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails[0].description;
                  //   this.childPolicy = childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                  //   const hotelPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy;
                  //   this.hotelPolicy = hotelPolicy ? hotelPolicy.map(item => 
                  //     item.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>')
                  // ) : '';
                  //   if( this.voucherData.BookingDetails.DomainOrigin !== 'CRS'){
                  //   const validJsonString = this.voucherData.BookingDetails.CancellationReason.replace(/'/g, '"');
                  //  this.parsedData = JSON.parse(validJsonString);
                  //  console.log("parsedData",this.parsedData)
                  //  this.cdr.detectChanges();
                  //   }
                  //   // this.parsedData = JSON.parse(this.voucherData.BookingDetails.CancellationReason)
                  //   if(this.voucherData.BookingDetails.DomainOrigin == 'CRS' && this.voucherData.BookingDetails.CancellationPolicy.$t.length){
                  //     const dateFrom = new Date(this.voucherData.BookingDetails.CancellationPolicy.$t[0].date_from); // Convert to Date object
                  //     dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
                  //     this.updatedDateFrom = dateFrom.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
                  // }
                  if (typeof(resp.data[0].BookingDetails.CancellationReason) === 'object' ) {
                    if(this.voucherData.BookingDetails.DomainOrigin == 'CRS') {
                      var hotelPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy.length > 0 ? resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy[0]: '';
                    }else{
                        var hotelPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.HotelPolicy;
                    }
                      if(this.voucherData.BookingDetails.DomainOrigin == 'CRS'){
                        this.hotelPolicy = hotelPolicy ? hotelPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                      }else{
                         this.hotelPolicy = hotelPolicy.length > 0 ? hotelPolicy.map((p, i) => `${i + 1}. ${p}`).join('<br><br>') : '';
                      }
                  
                     if(this.voucherData.BookingDetails.DomainOrigin == 'CRS'){
                    const childPolicy = resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails.length > 0 ? resp.data[0].BookingDetails.CancellationReason.hotelBody.RoomDetails[0].childrenPolicyDetails[0].description : '';
                    this.childPolicy = childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
                     }
                    }
                    

                      // this.parsedData = JSON.parse(this.voucherData.BookingDetails.CancellationReason)
                      if(this.voucherData.BookingDetails.DomainOrigin == 'CRS' && this.voucherData.BookingDetails.CancellationPolicy.$t.length){
                        const dateFrom = new Date(this.voucherData.BookingDetails.CancellationPolicy.$t[0].date_from); // Convert to Date object
                        dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
                        this.updatedDateFrom = dateFrom.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
                    }

                    this.loading =false;
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

    getCountryName(code: string): string {
      const country = this.countryList.find(c => c.code === code);
      return country ? country.name : ''; 
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

    getCancelationPolicies(policyArr) {
        let cancellationPolicy: string = '';
        policyArr.forEach((policy, i) => {
            let fee = Number(policy.fee), from = new Date(policy.hasOwnProperty('from') ? policy.from.split(' ')[0] : ''), to = new Date(policy.hasOwnProperty('until') ? policy.until.split(' ')[0] : '');
            if (fee > 0) {
                cancellationPolicy += `Cancellations made after ${from.getDate() + ' ' + from.toString().split(' ')[1] + ' ' + from.getFullYear()}`;
                cancellationPolicy += `, will be charged ${policy.currency + ' ' + fee} <br>`;
            } else if (fee == 0) {
                cancellationPolicy += `No cancellation charges, if cancelled before ${to.getDate() + ' ' + to.toString().split(' ')[1] + ' ' + to.getFullYear()} <br>`;
            }
        });
        return cancellationPolicy;
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
    downloadA4(type: any, orientation?: string): void {
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
            doc.save(`${this.voucherData['BookingPaxDetails'][0].FirstName} ${this.voucherData['BookingPaxDetails'][0].LastName} ${this.app_reference}.pdf`);
            this.loading = false;
            this.swalService.alert.success();
            document.getElementById('download').style.display = "inline-block";
            this.cdr.detectChanges();
          }
        });
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

      getTotalFare(itinarary: any) {
        let totalFare: any = 0;
        itinarary.forEach(element => {
            totalFare += element.RoomPrice;
        });
        return totalFare;
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
      return typeof reason === 'string' ? JSON.parse(reason.replace(/'/gi, "\"")) : reason;
  } catch (error) {
      console.error("Error parsing CancellationReason:", error);
      return {};
  }
}

backtoReports() {
  this.location.back();  
}
}
