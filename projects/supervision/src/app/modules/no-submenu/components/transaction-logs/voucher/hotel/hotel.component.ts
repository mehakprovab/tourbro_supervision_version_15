import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';

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
    isLoading: boolean = true;
    noOfAdults: number = 0;
    noOfChilds: number = 0;


    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.getB2cHotelVoucher();
    }

    getB2cHotelVoucher() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bHotelVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.isLoading = false;
                    this.voucherData = resp.data[0] || [];
                    this.voucherData['BookingPaxDetails'].forEach((element, i) => {
                        if (i < this.voucherData['BookingPaxDetails'].length - 1) {
                            if (element['PaxType'] == 'Child') {
                                this.noOfChilds++;
                            } else {
                                this.noOfAdults++;
                            }
                        }
                    });
                }
                else {
                    this.isLoading = true;
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
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

    getNoOfNights(i, o): number {
        let checkin = Number(new Date(i).getTime()), checkout = Number(new Date(o).getTime()), nights: number = 0;
        nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
        return nights;
    }

    getNoOfRoomsCount() {
        let totalRoomsBooked: number = 0;
        this.voucherData['BookingItineraryDetails'].forEach(o => {
            totalRoomsBooked += Boolean(o['BlockQuantity']) ? o['BlockQuantity'] : 1;
        });
        return totalRoomsBooked;
    }

    convert(val, currency) {
        // return this.hotelService.transform(val, currency);
    }

    getTotalAmnt() {
        let totalAmnt: number = 0;
        this.voucherData['BookingItineraryDetails'].forEach(o => {
            totalAmnt += Boolean(o.TotalFare) ? o.TotalFare : 0;
        });
        return totalAmnt;
    }
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + '&nbsp;' + tmpStatus[1]}`
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

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();

    }
}
