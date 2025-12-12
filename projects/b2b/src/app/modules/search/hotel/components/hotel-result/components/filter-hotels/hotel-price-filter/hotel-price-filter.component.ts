import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

@Component({
    selector: 'app-hotel-price-filter',
    templateUrl: './hotel-price-filter.component.html',
    styleUrls: ['./hotel-price-filter.component.scss']
})
export class HotelPriceFilterComponent implements OnInit, AfterViewInit, OnDestroy {
    private subSunk = new SubSink();
    priceForm: FormGroup;
    max: number = 1;
    min: number = 0;
    sliderRange: Array<number> = [0, 1];
    stepRange = [this.min, this.max];
    currency: string = 'BDT';
    isLoading: boolean = true;
    hotels = [];
    hotelsCopy : any;
    protected subs = new SubSink();
    minValue: number = 0;
    maxValue: number = 0;
    minPrice: any;
    maxPrice: any;
    options: Options = {
      floor: 0,
      ceil: 500,
    };
    constructor(
        private hotelService: HotelService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private utility: UtilityService
    ) {
        this.sliderRange = [this.min, this.max];
     }

    ngOnInit() {
        this.currency = this.utility.readStorage('currentUser', sessionStorage)['currency'] || 'GBP';
        this.subs.sink = this.hotelService.hotelsCopy.subscribe(res => {
            console.log("price",res);
            if(res.length) {
                this.hotelsCopy = res;
                this.currency=this.hotelsCopy[0]['Price']['Currency']
            } else {
                this.hotelsCopy = [];
            }
            this.cdr.detectChanges();
        });
        this.subs.sink = this.hotelService.minPrice.subscribe(res => {
            this.minPrice = res;
            if(this.minPrice > 0){
                this.min = (res);
                this.cdr.detectChanges();
            }
        });
        setTimeout(() => {
            this.subs.sink = this.hotelService.maxPrice.subscribe(res => {
                this.maxPrice = res;            
                if(this.maxPrice > 0){
                    this.max = (res);
                }
            });
        }); 
        this.subs.sink = combineLatest([this.hotelService.minPrice, this.hotelService.maxPrice]).subscribe(res => {
            console.log("res",res)
            if (res[0] >=0 && res[1] > 0) {
                this.minValue =(res[0])
                this.maxValue = (res[1])
                this.options = {
                    floor:(res[0]),
                    ceil: (res[1]),
                }
            }
        });
        this.cdr.detectChanges();
    }

    getMaxMinValues() {
        this.subSunk.sink = this.hotelService.minPrice.subscribe(min => {
            this.subSunk.sink = this.hotelService.maxPrice.subscribe(max => {
                this.min = (min);
                this.max = (max) + 1;
                this.cdr.detectChanges();
                this.priceForm.patchValue({
                    min: this.min,
                    max: this.max,
                }, { emitEvent: false });
                this.isLoading = false;
                if (this.max > this.min)
                    this.sliderRange = [this.min, this.max];
                this.cdr.detectChanges();
            });
        });
        this.cdr.detectChanges();
    }


    getProvidedCurrency() {
        this.subSunk.sink = this.hotelService.searchResponseCopy.subscribe(d => {
            try {
                if (typeof d !== 'undefined') {
                    this.currency = d[0]['Price']['Currency'];
                }
            } catch (error) {
            }
        }, err => {
            console.log(err);
        });
    }

    createPriceForm(): void {
        this.priceForm = this.fb.group({
            min: new FormControl(this.min),
            max: new FormControl(this.max)
        })
    }

    onSliderChange(event) {
        this.priceForm.patchValue({
            min: event[0],
            max: event[1],
        }, { emitEvent: false });
        this.hotelService.myValue.next(event[1]);
        this.hotelService.myValueStart.next(event[0]);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    rangeChanged(r: any) {
        console.log("range...",r)
        this.hotelService.myValue.next(r[1]);
        this.hotelService.myValueStart.next(r[0]);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    valueChange(minVal){
        this.hotelService.myValueStart.next(minVal);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }
    highValueChange(maxVal){
        this.hotelService.myValue.next(maxVal);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }

    clearPriceFilter() {
        this.hotelService.myValue.next(this.hotelService.maxPrice.value);
        this.hotelService.myValueStart.next(this.hotelService.minPrice.value);
        this.hotelService.maxPrice.next(this.hotelService.maxPrice.value);
        this.hotelService.minPrice.next(this.hotelService.minPrice.value);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }





}
