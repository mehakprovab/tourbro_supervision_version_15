import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../../flight.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('FlightDetailsComponent');

@Component({
    selector: 'app-flight-details',
    templateUrl: './flight-details.component.html',
    styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

    @Input() flight: any;
    tripType: any;

    constructor(
        private flightService: FlightService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {        
        this.tripType = this.flightService.formFilled.tripType;
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }

}
