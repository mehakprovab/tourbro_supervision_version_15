import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { HotelService } from '../../../../hotel.service';
const log = new Logger('FlightSearchComponent');

@Component({
    selector: 'app-hotel-search-loader',
    templateUrl: './hotel-search-loader.component.html',
    styleUrls: ['./hotel-search-loader.component.scss']
})
export class HotelSearchLoaderComponent implements OnInit {

    public arrow_right: string = "assets/images/right_arrow.png";
    airline_logo: string = '';
    hotelInfo: any
    constructor(
        private hotelService: HotelService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.hotelInfo = this.data.data
    }

    getCity(cityName) {
        let city = String(cityName).split(',')[0];
        return city;
    }
}
