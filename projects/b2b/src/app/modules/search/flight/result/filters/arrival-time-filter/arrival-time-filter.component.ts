import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlightService } from '../../../flight.service';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-arrival-time-filter',
    templateUrl: './arrival-time-filter.component.html',
    styleUrls: ['./arrival-time-filter.component.scss']
})
export class ArrivalTimeFilterComponent implements OnInit {

    destinationCityName: any;
    flightsCopy = [];
    arrTimForm: FormGroup;
    initialValue = {
        earlyMorning: 0,
        morning: 0,
        midDay: 0,
        evening: 0
    };
    enabled = false;
    protected subs = new SubSink();

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.createArrivalTimeForm();
        if(this.flightService.formFilled){
            if(this.flightService.formFilled == 'Multi-city') {
                const dest = this.flightService.formFilled.cities.length - 1;
                this.destinationCityName = (this.flightService.formFilled.cities[dest].destinationCity.split('('))[0];
            } else {
                this.destinationCityName = (this.flightService.formFilled.destinationCity.split('('))[0];
            }
        }

        this.subs.sink = this.flightService.flights.subscribe(res => {
            this.enabled = res.length;
        });
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            this.flightsCopy = res;
        });
        
        this.subs.sink = this.flightService.arrivalReset.subscribe(res => {
            if (res) {
              this.clearArrivalTimeFilter();
            }
        });
    }

    createArrivalTimeForm() {
        this.arrTimForm = this.fb.group(this.initialValue);
    }

    filterByArrivalTime(t, v) {
        this.arrTimForm.controls[t].setValue(v ? 1 : 0);
        this.flightService.earlyMorning2.next(this.arrTimForm.get('earlyMorning').value);
        this.flightService.morning2.next(this.arrTimForm.get('morning').value);
        this.flightService.midDay2.next(this.arrTimForm.get('midDay').value);
        this.flightService.evening2.next(this.arrTimForm.get('evening').value);
        this.flightService.filterByDepartureTime();

    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearArrivalTimeFilter() {
        this.arrTimForm.patchValue({
            earlyMorning: 0,
            morning: 0,
            midDay: 0,
            evening: 0
        });
        this.flightService.earlyMorning2.next(false);
        this.flightService.morning2.next(false);
        this.flightService.midDay2.next(false);
        this.flightService.evening2.next(false);
        this.flightService.filterByDepartureTime();
    }

}
