import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FlightService } from '../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-airline-features',
    templateUrl: './airline-features.component.html',
    styleUrls: ['./airline-features.component.scss']
})
export class AirlineFeaturesComponent implements OnInit, OnDestroy {

    totalFlights = 0;
    fastestFligtTime = 0;
    cheapestFlight: any = 0;
    name = 'SNF';
    @Output() showFareDetails = new EventEmitter();
    protected subs = new SubSink();
    constructor(
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            if (res.length) {
                this.totalFlights=0;
                if (!this.flightService.isDomesticFlightSelected) {
                    this.totalFlights = res.length;
                }
                else {
                    res.forEach(flightList => {
                        this.totalFlights+=flightList.length;
                    });
                }

                if (!this.flightService.isDomesticFlightSelected) {
                    const sortedFlights = res.sort((a, b) => {
                        if (!a || !b) {
                            return 0;
                        }
                        const time1 = a.FlightDetails.Details[0];
                        const dt11 = time1[0].Origin.DateTime;
                        const dt12 = time1.length > 1 ? time1[time1.length - 1].Destination.DateTime : time1[0].Destination.DateTime;
                        const resultA = this.flightService.diffMinutes(new Date(dt12), new Date(dt11));
    
                        const time2 = b.FlightDetails.Details[0];
                        const dt21 = time2[0].Origin.DateTime;
                        const dt22 = time2.length > 1 ? time2[time2.length - 1].Destination.DateTime : time2[0].Destination.DateTime;
    
                        const resultB = this.flightService.diffMinutes(new Date(dt22), new Date(dt21));
                        return resultA - resultB;
                    });
                    this.fastestFligtTime = this.duration(sortedFlights[0]);
                    const tempFlights = JSON.parse(JSON.stringify(res));
                    const cheapestFlightDetail: any = tempFlights.sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare);
                    this.cheapestFlight = cheapestFlightDetail[0];
                }
                else{
                    this.sortedAirlineTM(res);
                }
            } else {
                this.totalFlights = 0;
                this.fastestFligtTime = 0;
                this.cheapestFlight = 0;
            }
        });
    }

    sortedAirlineTM(res){
        if(res){
            let mergedArray;
            if(res[0] && res[1]){
                mergedArray = [...res[0], ...res[1]];
            }
            else if( res && res[0]){
                mergedArray=[...res[0]];
            }
            else{
                mergedArray=[...res[1]];
            }  
              const sortedFlights = mergedArray.sort((a, b) => {
                if (!a || !b) {
                    return 0;
                }
                const time1 = a.FlightDetails.Details[0];
                const dt11 = time1[0].Origin.DateTime;
                const dt12 = time1.length > 1 ? time1[time1.length - 1].Destination.DateTime : time1[0].Destination.DateTime;
                const resultA = this.flightService.diffMinutes(new Date(dt12), new Date(dt11));
    
                const time2 = b.FlightDetails.Details[0];
                const dt21 = time2[0].Origin.DateTime;
                const dt22 = time2.length > 1 ? time2[time2.length - 1].Destination.DateTime : time2[0].Destination.DateTime;
    
                const resultB = this.flightService.diffMinutes(new Date(dt22), new Date(dt21));
                return resultA - resultB;
            });
            this.fastestFligtTime = this.duration(sortedFlights[0]);
            const tempFlights = JSON.parse(JSON.stringify(res));
            this.setCheapestFlightDetail();
        }
    }

    setCheapestFlightDetail() {
        this.subs.sink = this.flightService.minPrice.subscribe(res => {
            this.cheapestFlight = res;
            if(this.cheapestFlight > 0){
                this.cheapestFlight = res;
            }
        });
    }

    duration(flight: any) {
        if (typeof flight == 'object') {
            const time = flight.FlightDetails.Details[0];
            return time.length > 1 ? time[time.length - 1].LayoverTime : time[0].Duration;
        } else {
            return false;
        }
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showFare() {
        this.name = this.name === 'SNF' ? 'HNF' : 'SNF';
        this.showFareDetails.emit(this.name === 'HNF' ? true : false);
    }

}
