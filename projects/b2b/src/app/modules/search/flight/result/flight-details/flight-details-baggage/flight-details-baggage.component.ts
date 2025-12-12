import { Component, OnInit, Input } from '@angular/core';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { FlightService } from '../../../flight.service';

const log = new Logger('FlightDetailsBaggageComponent');

@Component({
    selector: 'app-flight-details-baggage',
    templateUrl: './flight-details-baggage.component.html',
    styleUrls: ['./flight-details-baggage.component.scss']
})
export class FlightDetailsBaggageComponent implements OnInit {

    @Input() flight: any;
    airline_logo: string = '';
    constructor(
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.airline_logo = this.flightService.airline_logo;
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'Kgs') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG'
        } else if (val === '') {
            return '0 KG';
        }
    }

}
