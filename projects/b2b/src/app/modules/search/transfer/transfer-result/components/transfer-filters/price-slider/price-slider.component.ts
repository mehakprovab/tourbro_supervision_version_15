import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink';
import { TransferService } from '../../../../transfer.service';
import { Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-price-slider',
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.scss']
})
export class PriceSliderComponent implements OnInit {

  private subSunk = new SubSink();
    priceForm: FormGroup;
    max: number = 1;
    min: number = 0;
    sliderRange: Array<number> = [0, 1];
    stepRange = [this.min, this.max];
    currency: string = 'INR';
    isLoading: boolean = true;
    transfers = [];
    transferCopy: any;
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
        private transferService: TransferService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.sliderRange = [this.min, this.max];
    }

    ngOnInit() {
        this.subs.sink = this.transferService.transferCopy.subscribe(res => {
            if (res.length) {
                this.transferCopy = res;
                this.currency = this.transferCopy[0]['Price']['Currency']
            } else {
                this.transferCopy = [];
            }
            this.cdr.detectChanges();
        });
        this.subs.sink = this.transferService.minPrice.subscribe(res => {
            this.minPrice = res;
            if (this.minPrice > 0) {
                this.min = Math.floor(res);
                this.cdr.detectChanges();
            }
        });

        this.subs.sink = this.transferService.maxPrice.subscribe(res => {
            this.maxPrice = res;
            if (this.maxPrice > 0) {
                this.max = Math.ceil(res);
            }
        });

        this.subs.sink = combineLatest([this.transferService.minPrice, this.transferService.maxPrice]).subscribe(res => {
            if (res[0] >=0 && res[1] > 0) {
                this.minValue = Math.floor(res[0]);
                this.maxValue = Math.floor(res[1]);
                this.options = {
                    floor: Math.floor(res[0]),
                    ceil: Math.floor(res[1]),
                    hideLimitLabels: true
                }
                this.cdr.detectChanges();
            }
        });
    }

    createPriceForm(): void {
        this.priceForm = this.fb.group({
            min: new FormControl(this.min),
            max: new FormControl(this.max)
        })
    }

    valueChange(minVal) {
        this.transferService.myValueStart.next(minVal);
        this.transferService.changeSlider();
        this.cdr.detectChanges();
    }
    
    highValueChange(maxVal) {
        this.transferService.myValue.next(maxVal);
        this.transferService.changeSlider();
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }

    clearPriceFilter() {
        this.transferService.clearPrice();
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}