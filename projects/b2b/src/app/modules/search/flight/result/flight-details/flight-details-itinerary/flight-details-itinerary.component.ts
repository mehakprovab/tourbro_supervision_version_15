import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../../../flight.service';

@Component({
    selector: 'app-flight-details-itinerary',
    templateUrl: './flight-details-itinerary.component.html',
    styleUrls: ['./flight-details-itinerary.component.scss']
})
export class FlightDetailsItineraryComponent implements OnInit {

    @Input() flight: any;
    airline_logo: string = '';
    constructor(
        private flightService: FlightService
    ) { }
    ngOnInit() {
        if(this.flight && this.flight.booking_source==='ZBAPINO00002'){
            this.setRBD();// For TP
        }
        this.airline_logo = this.flightService.airline_logo;
    }

    duration(flight: any) {
        if (typeof flight == 'object') {
            const time = flight.FlightDetails.Details[0];
            return time.length > 1 ? time[time.length - 1].LayOverTime : time[0].Duration;
        }
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }
    setRBD() {
        if (this.flight.Price && this.flight.Price.PriceBreakup && this.flight.Price.PriceBreakup.RBD && this.flight.Price.PriceBreakup.RBD.length > 1 && this.flight.Price.PriceBreakup.RBD.indexOf(",") !== -1) {
            var array = this.flight.Price.PriceBreakup.RBD.split(',');
            this.flight.Price.PriceBreakup.RBD = array;
        }
    }

    codeshareInfo(list) {
        if (Object.keys(list[0].CodeshareInfo).length > 0) {
            return true;
        } else {
            return false;
        }
    }
}