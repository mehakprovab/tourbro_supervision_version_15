import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink';
import { Options } from '@angular-slider/ngx-slider';

@Component({
    selector: 'app-price-filter',
    templateUrl: './price-filter.component.html',
    styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit, AfterViewInit, OnDestroy {

    invert = true;
    flights: any;
    flightsCopy: any;
    myValue: any;
    minPrice: any;
    maxPrice: any;
    min1 = 500;
    max1 = 0;
    step = 100;
    stepRange = [this.min1, this.max1];
    currency: string = '';
    protected subs = new SubSink();
    minValue: number = 0;
    maxValue: number = 0;
    options: Options = {
        floor: 0,
        ceil: 500
    }

    constructor(
        private flightService: FlightService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            if (res.length) {
                this.flightsCopy = res;
                if (!this.flightService.isDomesticFlightSelected) {
                    this.currency = this.flightsCopy[0]['Price']['Currency']
                }
                else {
                    this.currency = this.flightsCopy[0][0]['Price']['Currency']
                }

            } else {
                this.flightsCopy = [];
            }
        });
        this.subs.sink = this.flightService.flights.subscribe(res => {
            if(!res.length){
                this.stepRange = [0,0];
                this.min1 = 0;
            } else {
    
            }
        });
        this.subs.sink = this.flightService.minPrice.subscribe(res => {
            this.minPrice = res;
            if(this.minPrice > 0){
                this.min1 =  Math.floor(res);
            }
        });
        setTimeout(() => {
            this.subs.sink = this.flightService.maxPrice.subscribe(res => {
                this.maxPrice = res;            
                if(this.maxPrice > 0){
                    this.max1 = Math.ceil(res);
                }
            });
        }); 
        this.subs.sink = combineLatest([this.flightService.minPrice, this.flightService.maxPrice]).subscribe(res => {
            if(res[0] > 0 && res[1] > 0){
               this.stepRange = [Math.floor(res[0]), Math.ceil(res[1])];
               this.minValue = Math.floor(res[0])
               this.maxValue = Math.floor(res[1])
               this.options = {
                floor: Math.floor(res[0]),
                ceil: Math.floor(res[1]),
            }
            }
        });
    }

    rangeChanged(r: any) {
        this.flightService.myValue.next(r[1]);
        this.flightService.myValueStart.next(r[0]);
        this.flightService.priceFilter();
        this.cdr.detectChanges();
    }
    
    valueChange(minVal){
        this.flightService.myValueStart.next(minVal);
        this.flightService.priceFilter();
        this.cdr.detectChanges();
    }
    highValueChange(maxVal){
        this.flightService.myValue.next(maxVal);
        this.flightService.priceFilter();
        this.cdr.detectChanges();
    }

    ngAfterViewInit(){  
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearPriceFilter() {
        this.flightService.myValue.next(this.flightService.maxPrice.value);
        this.flightService.myValueStart.next(this.flightService.minPrice.value);
        this.flightService.maxPrice.next(this.flightService.maxPrice.value);
        this.flightService.minPrice.next(this.flightService.minPrice.value);
        this.flightService.changeSlider();
        this.cdr.detectChanges();
    }

}
