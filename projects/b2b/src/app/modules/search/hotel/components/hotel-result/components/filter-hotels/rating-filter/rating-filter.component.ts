import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
    selector: 'app-rating-filter',
    templateUrl: './rating-filter.component.html',
    styleUrls: ['./rating-filter.component.scss']
})
export class RatingFilterComponent implements OnInit {
    originCityName: any;
    flightsCopy = [];
    ratingForm: FormGroup;
    initialValue = {
        rating0: false,
        rating1: false,
        rating2: false,
        rating3: false,
        rating4: false,
        rating5: false
    };
    enabled = false;
    protected subs = new SubSink();
    
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        this.createForm();
        this.subs.sink = this.hotelService.ratingReset.subscribe(res => {
            if (res) {
                this.clearRatingFilter();
            }
        });
    }

    createForm() {
        this.ratingForm = this.fb.group(this.initialValue);
    }

    filterByStars(t, v) {
        this.ratingForm.controls[t].setValue(v ? 1 : 0);
        this.hotelService.rating0.next(this.ratingForm.get('rating0').value);
        this.hotelService.rating1.next(this.ratingForm.get('rating1').value);
        this.hotelService.rating2.next(this.ratingForm.get('rating2').value);
        this.hotelService.rating3.next(this.ratingForm.get('rating3').value);
        this.hotelService.rating4.next(this.ratingForm.get('rating4').value);
        this.hotelService.rating5.next(this.ratingForm.get('rating5').value);
        // this.flightService.filterByStar();

    }

    get ratingControls() {
        return this.ratingForm.controls;
    }

    filterByStar(t, v) {
        let ratingsTemp = [];
        Object.keys(this.ratingControls).forEach((key, i) => {
            ratingsTemp.push({ stars: (i ), name: (i ) + ' Star', type: 'star', isChecked: this.ratingControls[key].value })
        });
        this.hotelService.stars.next(ratingsTemp);
        this.hotelService.filterByStar();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearRatingFilter() {
        this.ratingForm.patchValue({
            rating0: false,
            rating1: false,
            rating2: false,
            rating3: false,
            rating4: false,
            rating5: false
        });
        this.hotelService.rating0.next(false);
        this.hotelService.rating1.next(false);
        this.hotelService.rating2.next(false);
        this.hotelService.rating3.next(false);
        this.hotelService.rating4.next(false);
        this.hotelService.rating5.next(false);
        this.hotelService.stars.next([]);
        this.hotelService.filterByStar();
    }

}
