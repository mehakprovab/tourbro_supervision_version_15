import { Component, Input, OnInit } from '@angular/core';
import { FlightService } from '../../flight.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sorting-round',
  templateUrl: './sorting-round.component.html',
  styleUrls: ['./sorting-round.component.scss']
})
export class SortingRoundComponent implements OnInit {
    active = 'price';

    airlines = true;
    departureTime = true;
    duration = true;
    arrivalTime = true;
    price = true;
    @Input() selectedFilterIndex: number;

    protected subs = new SubSink();
    constructor(
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.applySortingAfterFilter.subscribe(res => {
            if (res) {
                switch (this.active) {
                    case 'airlines':
                        this.sortByAirlines(true);
                        break;
                    case 'departureTime':
                        this.sortByDepartureTime(true);
                        break;
                    case 'duration':
                        this.sortByDuration(true);
                        break;
                    case 'arrivalTime':
                        this.sortByArrivalTime(true);
                        break;
                    case 'price':
                        this.sortByPrice(true);
                        break;
                    default:
                        break;
                }
            }
        });
    }


    sortByAirlines(internalCall: boolean = false) {
        this.active = 'airlines';
        this.airlines = internalCall ? this.airlines : !this.airlines;
        const tempFlights = JSON.parse(JSON.stringify(this.flightService.flights.value));
        if(tempFlights && tempFlights.length>0){
            if (this.airlines) {
                tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                    const resultA = a.FlightDetails.Details[0][0].OperatorName;
                    const resultB = b.FlightDetails.Details[0][0].OperatorName;
                    return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
                });
            } else { /* descending order */
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                    const resultA = a.FlightDetails.Details[0][0].OperatorName;
                    const resultB = b.FlightDetails.Details[0][0].OperatorName;
                    return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
                });
            }
        this.flightService.flights.next(tempFlights);
    }
    }

    sortByDepartureTime(internalCall: boolean = false) {
        this.active = 'departureTime';
        this.departureTime = internalCall ? this.departureTime : !this.departureTime;
        const tempFlights = JSON.parse(JSON.stringify(this.flightService.flights.value));
        if(tempFlights && tempFlights.length>0){
        if (this.departureTime) {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                const resultA = (new Date(a.FlightDetails.Details[0][0].Origin.DateTime)).getTime();
                const resultB = (new Date(b.FlightDetails.Details[0][0].Origin.DateTime)).getTime();
                return resultA - resultB;
            });
        } else {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                const resultA = (new Date(a.FlightDetails.Details[0][0].Origin.DateTime)).getTime();
                const resultB = (new Date(b.FlightDetails.Details[0][0].Origin.DateTime)).getTime();
                return resultB - resultA;
            });
        }
        this.flightService.flights.next(tempFlights);
    }
    }

    sortByDuration(internalCall: boolean = false) {
        this.active = 'duration';
        this.duration = internalCall ? this.duration : !this.duration;
        const tempFlights = JSON.parse(JSON.stringify(this.flightService.flights.value));
        if(tempFlights && tempFlights.length>0){
        tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
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
            return this.duration ? resultA - resultB : resultB - resultA;
        });
        this.flightService.flights.next(tempFlights);
    }
    }

    sortByArrivalTime(internalCall: boolean = false) {
        this.active = 'arrivalTime';
        this.arrivalTime = !this.arrivalTime;
        const tempFlights = JSON.parse(JSON.stringify(this.flightService.flights.value));
        if(tempFlights && tempFlights.length>0){
        let sortedFlights;
        if (this.arrivalTime) {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                const resultA = (new Date(a.FlightDetails.Details[0][this.flightService.stops(a)].Destination.DateTime)).getTime();
                const resultB = (new Date(b.FlightDetails.Details[0][this.flightService.stops(b)].Destination.DateTime)).getTime();
                return resultA - resultB;
            });
        } else {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => {
                const resultA = (new Date(a.FlightDetails.Details[0][this.flightService.stops(a)].Destination.DateTime)).getTime();
                const resultB = (new Date(b.FlightDetails.Details[0][this.flightService.stops(b)].Destination.DateTime)).getTime();
                return resultB - resultA;
            });
        }
        this.flightService.flights.next(tempFlights);
    }
    }

    sortByPrice(internalCall: boolean = false) {
        this.active = 'price';
        this.price = internalCall ? this.price : !this.price;
        const tempFlights = JSON.parse(JSON.stringify(this.flightService.flights.value));
        if(tempFlights && tempFlights.length>0 ){
        if (this.price) {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare);
        } else {
            tempFlights[this.selectedFilterIndex] = tempFlights[this.selectedFilterIndex].sort((a, b) => b.Price.TotalDisplayFare - a.Price.TotalDisplayFare);
        }
        this.flightService.flights.next(tempFlights);
    }
    }
}
