import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-airports-nearby-filter',
    templateUrl: './airports-nearby-filter.component.html',
    styleUrls: ['./airports-nearby-filter.component.scss']
})
export class AirportsNearbyFilterComponent implements OnInit {

    nearbyAirportsDepart: any = [];
    nearbyAirportsArrival: any = [];
    airportsForm: FormGroup;

    flightsCopy = [];

    tempNearbyAirport = [];
    protected subs = new SubSink();
    constructor(
        private flightService: FlightService,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createAirportsForm();
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            this.flightsCopy = res;
        });
        this.subs.sink = this.flightService.nearByAirportsCopy.subscribe(res => {
            this.items.clear();
            this.tempNearbyAirport = [];
            this.nearbyAirportsDepart = [];
            this.nearbyAirportsArrival = [];
            if (res && res.length) {
                res[0].depart.forEach((e, i) => {
                    this.items.push(new FormControl(1));
                    this.tempNearbyAirport.push(e.AirportName);
                    this.nearbyAirportsDepart.push({ name: e.AirportName, isChecked: true, code: e.AirportCode, type: 'depart' });
                });
                if (res[0].hasOwnProperty('arrival')) {
                    res[0].arrival.forEach((e, i) => {
                        this.items.push(new FormControl(1));
                        this.tempNearbyAirport.push(e.AirportName);
                        this.nearbyAirportsArrival.push({ name: e.AirportName, isChecked: true, code: e.AirportCode, type: 'arrive' });
                    });
                }
            }
        });
        this.subs.sink = this.flightService.nearbyAirportsReset.subscribe(res => {
            if (res) {
                const itemsValue = Array(this.items.value.length).fill(1);
                this.airportsForm.patchValue({ items: itemsValue });
            }
        });
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    get items(): FormArray {
        return this.airportsForm.get('items') as FormArray;
    }

    createAirportsForm() {
        this.airportsForm = this.fb.group({
            items: this.fb.array([])
        });
    }

    filterByNearestAirport(val, index, code) {
        this.flightService.nearbyAirports.next(this.flightService.nearbyAirports.value.map(t=> {
            if(code == t.code) {
                return {...t, isChecked: val};
            }
            return t;
        }));
        this.flightService.filterByNearestAirport();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearAirportsNearByFilter() {
        this.flightService.nearbyAirports.next(this.flightService.nearbyAirports.value.map(t=> {
            return {...t, isChecked: false};
        }));
        this.airportsForm.patchValue({ items: Array(this.items.value.length).fill(0) });
        this.flightService.filterByNearestAirport();
    }
}