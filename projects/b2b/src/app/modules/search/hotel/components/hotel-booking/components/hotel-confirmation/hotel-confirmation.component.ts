import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';

@Component({
    selector: 'app-hotel-confirmation',
    templateUrl: './hotel-confirmation.component.html',
    styleUrls: ['./hotel-confirmation.component.scss']
})
export class HotelConfirmationComponent implements OnInit {

    protected subSink = new SubSink();
    hotelDetails: any;
    paxDetails: any;
    roomDetails: any;
    bookingDetails: any;
    leadPax: any;
    totalFare: any = 0;
    nights: any;
    appReference: string = "";
    orderId: string = "";
    bookingSource: any;
    currentUser: any;
    loadingTemplate: any;
    loading:boolean=false;
    primaryColour: any;
    secondaryColour: any;
    constructor(
        private hotelService: HotelService,
        private util: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {

        this.route.queryParams.subscribe(params => {
            this.appReference = (params.AppReference).replace("/", "")
            this.bookingSource = params.source ? (params.source).replace("/", "") : null;
            if(params.orderId == 'pay_later'){
                this.orderId = (params.orderId)
            }else{
            this.orderId = (params.orderId).replace("/", "")
            }
        })

        this.goToVoucher(this.appReference);

        let req = {
            app_reference: this.appReference,
            order_id: this.orderId
        }
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelPaymentConfirmation', 'post', {}, {},
            req).subscribe(resp => {
                if (resp.statusCode == 201 ) {
                    
                //     this.reservation();
                // } 
                // else {
                    this.intializeValue();
                 }
            })
    }

    reservation() {
     this.loading = true;
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source: this.bookingSource,
            // payment_mode:this.paymentMode
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.loading =false;
                console.log(resp)
                this.currentUser = this.util.getStorage('currentUser');
                let totalFare: any = 0;
                resp.data["BookingItineraryDetails"].forEach(itinerary => {
                totalFare += itinerary.RoomPrice;
                 });
                let balance = String(this.currentUser.agent_balance - totalFare);
                this.subSink.sink = this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
                    id: this.currentUser.id,
                    agent_balance: balance
                }).subscribe(res => {
                    if (resp.statusCode == 201) {
                        this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                            id: this.currentUser.id
                        }).subscribe(data => {
                            res['data']['access_token'] = this.currentUser.access_token;
                            sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
                        });
                    }
                })
                this.hotelService.hotelConfirmationData.next(resp.data);
                this.intializeValue()
            } else {
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 100);
            }
        }, err => {
            console.error(err);
        })
        this.hotelService.loading.next(false);
    }

    intializeValue() {
        this.subSink.sink = this.hotelService.hotelConfirmationData.subscribe(data => {
            if(Object.keys(data).length===0){
                this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: this.appReference } });
            }
                this.hotelDetails = data;
                this.paxDetails = this.hotelDetails.BookingPaxDetails;
                this.bookingDetails = this.hotelDetails.BookingDetails;
                this.roomDetails = this.hotelDetails.BookingItineraryDetails;
        })
        this.paxDetails = this.hotelDetails.BookingPaxDetails;
        this.leadPax = this.paxDetails[this.paxDetails.length - 1];
        this.bookingDetails = this.hotelDetails.BookingDetails;
        this.roomDetails = this.hotelDetails.BookingItineraryDetails;
        this.roomDetails.forEach(itinerary => {
        this.totalFare += itinerary.RoomPrice;
         });
        // this.totalFare = this.roomDetails[0].RoomPrice;
        this.nights = this.util.noOfNights(this.bookingDetails.HotelCheckIn, this.bookingDetails.HotelCheckOut);
    }

    // getCancelationPolicy(cancellationPolicy) {
    //    const penalty=this.hotelService.getCancelationPolicy(cancellationPolicy,this.bookingDetails.Currency);
    //    return penalty;
    // }

    goToVoucher(appRef: any) {
        this.router.navigate(['/search/hotel/voucher'], { queryParams: { AppReference: appRef ,bookingSource:this.bookingSource} });
    }

}
