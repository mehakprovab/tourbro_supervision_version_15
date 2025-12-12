import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlightService } from '../../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-stops-filter',
    templateUrl: './stops-filter.component.html',
    styleUrls: ['./stops-filter.component.scss']
})
export class StopsFilterComponent implements OnInit {

    flights: any = [];
    flightsCopy: any = [];
    myValue: any;
    minPrice: any;
    maxPrice: any;
    stopsFrom: FormGroup;
    zeroStopActive = true;
    oneStopActive = true;
    multipleStopsActive = true;
    zeroStopPrice = 0;
    oneStopPrice = 0;
    multipleStopsPrice = 0;
    currentCurreny:string = '';
    protected subs = new SubSink();

    constructor(
        private fb: FormBuilder,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.currentCurrency.subscribe(res => {
            this.currentCurreny = res;
        });
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            if (res.length) {
                this.flightsCopy = res;
                this.currentCurreny=res[0]['Price']['Currency'];
                const tempZeroStopPrice = [];
                const tempOneStopPrice = [];
                const tempMultipleStopsPrice = [];
                res.forEach(flight => {
                    const tempFlight = flight.FlightDetails.Details[0];
                    if (tempFlight.length === 1) {
                        tempZeroStopPrice.push(flight.Price.TotalDisplayFare);
                    } else if (tempFlight.length === 2) {
                        tempOneStopPrice.push(flight.Price.TotalDisplayFare);
                    } else {
                        tempMultipleStopsPrice.push(flight.Price.TotalDisplayFare);
                    }
                });
                if (tempZeroStopPrice.length) {
                    this.zeroStopPrice = tempZeroStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempOneStopPrice.length) {
                    this.oneStopPrice = tempOneStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempMultipleStopsPrice.length) {
                    this.multipleStopsPrice = tempMultipleStopsPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                } else {
                    this.flightService.multipleStopsPrice.next(false);
                }
            } else {
                this.zeroStopPrice = 0;
                this.oneStopPrice = 0;
                this.multipleStopsPrice = 0;
            }
        });
        this.subs.sink = this.flightService.zeroStopActive.subscribe(res => {
            this.zeroStopActive = res;
        });
        this.subs.sink = this.flightService.oneStopActive.subscribe(res => {
            this.oneStopActive = res;
        });
        this.subs.sink = this.flightService.multipleStopsActive.subscribe(res => {
            this.multipleStopsActive = res;
        });
        this.subs.sink = this.flightService.stopoversReset.subscribe(res => {
            this.clearStopsFilter();
        });
        this.createStopsFrom();
    }

    createStopsFrom() {
        this.stopsFrom = this.fb.group({
            zeroStop: 0,
            oneStop: 0,
            multipleStops: 0
        });
    }

    filterByStops(t, v) {
        this.stopsFrom.controls[t].setValue(v ? 1 : 0);
        this.flightService.zeroStopActive.next(this.stopsFrom.get('zeroStop').value);
        this.flightService.oneStopActive.next(this.stopsFrom.get('oneStop').value);
        this.flightService.multipleStopsActive.next(this.stopsFrom.get('multipleStops').value);
        this.flightService.filterByStops();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearStopsFilter() {
        this.createStopsFrom();
        this.stopsFrom.patchValue({
            zeroStop: 0,
            oneStop: 0,
            multipleStops: 0
        });
        this.flightService.zeroStopActive.next(false);
        this.flightService.oneStopActive.next(false);
        this.flightService.multipleStopsActive.next(false);
        this.flightService.filterByStops();
    }

}
