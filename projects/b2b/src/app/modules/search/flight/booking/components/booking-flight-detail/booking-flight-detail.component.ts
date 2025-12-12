import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FlightService } from '../../../flight.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-booking-flight-detail',
    templateUrl: './booking-flight-detail.component.html',
    styleUrls: ['./booking-flight-detail.component.scss']
})
export class BookingFlightDetailComponent implements OnInit {

    @Input() flight: any;
    @Input() traveller: any;
    isCollapsed = true;
    isCollapsedFareSumm = true;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    airline_logo: string = '';
    flightSearchData ;
    constructor(
        private flightService: FlightService,
        private router: Router,
        private _location: Location
    ) { }

    ngOnInit() {
        this.flightSearchData = sessionStorage.getItem('flightSearchData');
        this.flightSearchData = JSON.parse(this.flightSearchData) || {}
        this.airline_logo = this.flightService.airline_logo;
        if (!this.flight) {
            this.router.navigate(['/dashboard']);
        }
    }


    duration(flight: any) {
        const time = flight.FlightDetails.Details[0];
        return time.length > 1 ? time[time.length - 1].LayOverTime : time[0].Duration;
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }

    backClicked() {
        this.flightService.resetSearch();
        this.flightService.formFilled = false;
        this._location.back();
    }

}
