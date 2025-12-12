import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { ActivitiesService } from '../../../activities.service';
import { combineLatest } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider/options';

@Component({
  selector: 'app-activity-price-slider',
  templateUrl: './activity-price-slider.component.html',
  styleUrls: ['./activity-price-slider.component.scss']
})
export class ActivityPriceSliderComponent implements OnInit {

  private subSunk = new SubSink();
  priceForm: FormGroup;
  max: number = 1;
  min: number = 0;
  sliderRange: Array<number> = [0, 1];
  stepRange = [this.min, this.max];
  currency: string = 'INR';
  isLoading: boolean = true;
  activities = [];
  activityCopy: any;
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
      private activityService: ActivitiesService,
      private cdr: ChangeDetectorRef,
      private fb: FormBuilder,
  ) {
      this.sliderRange = [this.min, this.max];
  }

  ngOnInit() {
      this.subs.sink = this.activityService.activityCopy.subscribe(res => {
          if (res.length) {
              this.activityCopy = res;
              this.currency = this.activityCopy[0]['Price']['Currency']
          } else {
              this.activityCopy = [];
          }
          this.cdr.detectChanges();
      });
      this.subs.sink = this.activityService.minPrice.subscribe(res => {
          this.minPrice = res;
          if (this.minPrice > 0) {
              this.min = Math.floor(res);
              this.cdr.detectChanges();
          }
      });

      this.subs.sink = this.activityService.maxPrice.subscribe(res => {
          this.maxPrice = res;
          if (this.maxPrice > 0) {
              this.max = Math.ceil(res);
          }
      });

      this.subs.sink = combineLatest([this.activityService.minPrice, this.activityService.maxPrice]).subscribe(res => {
          if (res[0] > 0 && res[1] > 0) {
              this.minValue = Math.floor(res[0])
              this.maxValue = Math.ceil(res[1])
              this.options = {
                  floor: Math.floor(res[0]),
                  ceil: Math.ceil(res[1]),
                  hideLimitLabels: true
              }
          }
      });
      this.cdr.detectChanges();
  }

  getMaxMinValues() {
      this.subSunk.sink = this.activityService.minPrice.subscribe(min => {
          this.subSunk.sink = this.activityService.maxPrice.subscribe(max => {
              this.min = Math.floor(min);
              this.max = Math.ceil(max) + 1;
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
      this.activityService.myValue.next(event[1]);
      this.activityService.myValueStart.next(event[0]);
      this.activityService.changeSlider();
      this.cdr.detectChanges();
  }

  rangeChanged(r: any) {
      this.activityService.myValue.next(r[1]);
      this.activityService.myValueStart.next(r[0]);
      this.activityService.changeSlider();
      this.cdr.detectChanges();
  }

  valueChange(minVal) {
      this.activityService.myValueStart.next(minVal);
      this.activityService.changeSlider();
      this.cdr.detectChanges();
  }
  
  highValueChange(maxVal) {
      this.activityService.myValue.next(maxVal);
      this.activityService.changeSlider();
      this.cdr.detectChanges();
  }

  ngAfterViewInit() {
      setTimeout(() => {
          this.cdr.detectChanges();
      });
  }

  clearPriceFilter() {
      this.activityService.clearPrice();
      this.cdr.detectChanges();
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

}
