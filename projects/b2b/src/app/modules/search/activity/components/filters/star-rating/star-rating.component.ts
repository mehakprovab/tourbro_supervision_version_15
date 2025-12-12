import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ActivitiesService } from '../../../activities.service';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  starFrom: FormGroup;
  star0: number = 0; star1: number = 1; star2: number = 2; star3: number = 3; star4: number = 4; star5: number = 5;
  hotels: {}[] = [];
  starsTemp: Array<any> = [];
  availableFilters = [];
  protected subs = new SubSink();

  constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private activityService: ActivitiesService,
      private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
      this.createForm();
      this.availableFilters = this.activityService.availableOptions['stars'];
      this.subs.sink = this.activityService.clearRating.subscribe(res => {
          if (res) {
              this.clearRatingFilter();
          }
      });
  }

  createForm() {
      this.starFrom = this.fb.group({
          star0: false, star1: false, star2: false, star3: false, star4: false, star5: false
      })
  }

  get starControls() {
      return this.starFrom.controls;
  }

  filterByStars(event?) {
      this.activityService.activity.next([]);
      this.starsTemp = [];
      Object.keys(this.starControls).forEach((key, i) => {
          this.starsTemp.push({ stars: i, name: i + ' Star', type: 'star', isChecked: this.starControls[key].value })
      });
      this.activityService.stars.next(this.starsTemp);
      this.activityService.filterByStar();
  }

  isDisabled(v: number) {
  }

  isWidgetUnchecked(i: number) {
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  clearRatingFilter() {
      this.starFrom.patchValue({
          star0: false,
          star1: false,
          star2: false,
          star3: false,
          star4: false,
          star5: false
      });
      this.activityService.rating1.next(false);
      this.activityService.rating2.next(false);
      this.activityService.rating3.next(false);
      this.activityService.rating4.next(false);
      this.activityService.rating5.next(false);
      this.activityService.stars.next([]);
      this.activityService.filterByStar();
  }

}
