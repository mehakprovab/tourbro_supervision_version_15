import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-stopover-city-filter',
    templateUrl: './stopover-city-filter.component.html',
    styleUrls: ['./stopover-city-filter.component.scss']
})
export class StopoverCityFilterComponent implements OnInit {

    stopovers: any = [];
    flightsCopy: any = [];
    stopoversForm: FormGroup;

    protected subs = new SubSink();
    constructor(
        private flightService: FlightService,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createStopoversForm();
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            this.items.clear();
            this.stopovers = [];
            const stopoverTemp = [];
            this.flightsCopy = [];
            if (res.length) {
                this.flightsCopy = res;
                res.forEach(flight => {
                    const tempFlight = flight.FlightDetails.Details[0];
                    tempFlight.forEach((e, i) => {
                        if (i < tempFlight.length - 1) {
                            if (!stopoverTemp.includes(e.Destination.CityName)) {
                                this.items.push(new FormControl(0));
                                stopoverTemp.push(e.Destination.CityName);
                                this.stopovers.push({ name: e.Destination.CityName, isChecked: false, code: e.Destination.AirportCode });
                            }
                        }
                    });
                });
            }
        });
        this.subs.sink = this.flightService.stopoversReset.subscribe(res => {
            if (res) {
                this.clearStopoverCityFilter();
            }
        });
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    get items(): FormArray {
        return this.stopoversForm.get('items') as FormArray;
    }

    createStopoversForm() {
        this.stopoversForm = this.fb.group({
            items: this.fb.array([])
        });
    }

    filterByStopoverCity() {
        const stopoversTemp = [];
        this.items.value.forEach((element, i) => {
            stopoversTemp.push({ name: this.stopovers[i]['name'], isChecked: element });
        });
        this.flightService.stopovers.next(stopoversTemp);
        this.flightService.filterByStopoverCity();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearStopoverCityFilter() {
        this.stopoversForm.patchValue({ items: Array(this.items.value.length).fill(0) });
        const stopoversTemp = [];
        this.items.value.forEach((element, i) => {
            stopoversTemp.push({ name: this.stopovers[i]['name'], isChecked: false });
        });
        this.flightService.stopovers.next(stopoversTemp);
        this.flightService.filterByStopoverCity();
    }

}
