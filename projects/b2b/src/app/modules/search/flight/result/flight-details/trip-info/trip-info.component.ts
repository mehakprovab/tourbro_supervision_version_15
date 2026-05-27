import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { FlightService } from '../../../flight.service';
const log = new Logger('FlightSearchComponent');


@Component({
    selector: 'app-trip-info',
    templateUrl: './trip-info.component.html',
    styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {
    public arrow_right: string = "assets/images/right_arrow.png";
    airline_logo: string = '';
    flightInfo: any
    constructor(
        private flightService: FlightService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.airline_logo = this.flightService.airline_logo;
        this.flightInfo = this.data.data
    }

    getCity (cityName) {
        let city = String(cityName).split(',')[0];
        return city;
    }


}
