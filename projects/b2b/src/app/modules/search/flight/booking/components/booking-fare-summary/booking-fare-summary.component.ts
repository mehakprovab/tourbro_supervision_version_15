import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-booking-fare-summary',
    templateUrl: './booking-fare-summary.component.html',
    styleUrls: ['./booking-fare-summary.component.scss']
})
export class BookingFareSummaryComponent implements OnInit, OnDestroy {

    @Input() flight: any;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    name = 'SNF';
    adultCount = 0;
    childCount = 0;
    infantCount = 0;
    showDetails = true;
    baggageFee = 0.00;
    mealFee = 0.00;
    seatFee = 0.00;
    totalDisplayFare = 0.00;

    isBaggaeProtected: boolean = false;
    baggageProtectedData: any;
    youthCount: any;
    @Input() fromResult: boolean;
    

    protected subs = new SubSink();
    constructor(
        private flightService: FlightService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // console.log("fare",this.flight);
        this.subs.sink = this.flightService.extraFees.subscribe(res => {
            this.baggageFee = res['baggageFee'] || this.baggageFee;
            this.mealFee = res['mealFee'] || this.mealFee;
            this.seatFee = res['seatFee'] || this.seatFee;
            if(this.flight){
                this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare) + Number(this.baggageFee) + Number(this.mealFee) + Number(this.seatFee);
            }
        });

        this.getBaggageProtectionData();
        this.cdRef.detectChanges();
    }

    getBaggageProtectionData() {
        this.subs.sink = this.flightService.baggeProtectionData.subscribe(resp => {
            if (resp.isProtected && resp.data) {
                this.isBaggaeProtected = true;
                this.baggageProtectedData = resp.data;
                this.totalDisplayFare = this.totalDisplayFare + (this.adultCount + this.childCount + this.infantCount) * this.baggageProtectedData.Total_Price;
                this.cdRef.detectChanges();
            } else {
                this.isBaggaeProtected = false;
            }
        })
    }
    isAdult(flight: any) {
        const result = flight ? flight['Price']['PassengerBreakup'].hasOwnProperty('ADT') : null;
        if (result) {
            this.adultCount = flight.Price.PassengerBreakup.ADT.PassengerCount;
        }
        return result;
    }

    isYoung(flight: any) {
        const result = flight ? flight['Price']['PassengerBreakup'].hasOwnProperty('YTH') : null;
        if (result) {
            this.youthCount = flight.Price.PassengerBreakup.YTH.PassengerCount;
        }
        return result;
    }

    isChild(flight: any) {
        const price = flight ? flight['Price']['PassengerBreakup'] : null;
        const result = price ?
            price.hasOwnProperty('CHD') || price.hasOwnProperty('CNN') || price.hasOwnProperty('C09') : false;
        if (result) {
            this.childCount = price.hasOwnProperty('CHD') ? price.CHD.PassengerCount : price.hasOwnProperty('CNN') ? price.CNN.PassengerCount : price.C09.PassengerCount
        }
        return result;
    }

    isInfant(flight: any) {
        const result = flight ? flight['Price']['PassengerBreakup'].hasOwnProperty('INF') : null;
        if (result) {
            this.infantCount = flight['Price']['PassengerBreakup'].INF.PassengerCount;
        }
        return result;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showFare() {
        this.name = this.name === 'SNF' ? 'HNF' : 'SNF';
        this.showDetails = this.name === 'HNF' ? false : true;
        this.cdRef.detectChanges();
    }

}
