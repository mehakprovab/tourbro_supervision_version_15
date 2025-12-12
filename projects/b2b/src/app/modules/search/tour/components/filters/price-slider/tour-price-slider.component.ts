import { Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { TourService } from '../../../tour.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-tour-price-slider',
  templateUrl: './tour-price-slider.component.html',
  styleUrls: ['./tour-price-slider.component.scss']
})
export class TourPriceSliderComponent implements OnInit {

    max: number = 1;
    min: number = 0;
    min1 = 500;
    max1 = 0;
    step = 100;
    sliderRange: Array<number> = [0, 1];
    stepRange = [this.min, this.max];
    tour: any=[];
    minValue: number = 0;
    maxValue: number = 0;
    minPrice: any;
    maxPrice: any;
    options: Options = {
        floor: 0,
        ceil: 500,
    };
    
    constructor(
        private tourService: TourService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.sliderRange = [this.min, this.max];
    }
  
    ngOnInit(): void {
      this.tourService.tourCopy.subscribe(res => {
        if (res.length) {
            this.tour = res;
        } 
        this.cdr.detectChanges();
    });
    this.tourService.minPrice.subscribe(res => {
        this.minPrice = res;
        if (this.minPrice > 0) {
            this.min1 = Math.floor(res);
            this.cdr.detectChanges();
        }
    });
    setTimeout(() => {
        this.tourService.maxPrice.subscribe(res => {
            this.maxPrice = res;
            if (this.maxPrice > 0) {
                this.max1 = Math.ceil(res);
            }
        });
    });
    combineLatest([this.tourService.minPrice, this.tourService.maxPrice]).subscribe(res => {
      if (res[0] > 0 || res[1] > 0) {
          this.minValue = Math.floor(res[0])
          this.maxValue = Math.floor(res[1])
          this.options = {
              floor: Math.floor(res[0]),
              ceil: Math.floor(res[1]),
          }
      }
    });
    this.cdr.detectChanges();
    }
  
    valueChange(minVal) {
      this.tourService.myValueStart.next(minVal);
      this.tourService.changeSlider();
      this.cdr.detectChanges();
    }
  
    highValueChange(maxVal) {
        this.tourService.myValue.next(maxVal);
        this.tourService.changeSlider();
        this.cdr.detectChanges();
    }
  
    clearPriceFilter() {
      this.tourService.clearPrice();
      this.cdr.detectChanges();
  }
  }
  
