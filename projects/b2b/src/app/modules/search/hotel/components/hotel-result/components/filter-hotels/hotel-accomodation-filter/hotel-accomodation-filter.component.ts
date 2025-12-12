import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
    selector: 'app-hotel-accomodation-filter',
    templateUrl: './hotel-accomodation-filter.component.html',
    styleUrls: ['./hotel-accomodation-filter.component.scss']
})
export class HotelAccomodationFilterComponent implements OnInit {
    stopovers: any = [
        { name: "Singapore Residency" },
        { name: "Hotel Residency" }
    ];
    flightsCopy: any = [];
    stopoversForm: FormGroup;
    protected subs = new SubSink();

    constructor(
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        this.createStopoversForm();
        this.subs.sink = this.hotelService.clearAccomodation.subscribe(flag => {
            if (flag) { this.clearStopoverCityFilter() }
        })
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    get items(): FormArray {
        return this.stopoversForm.get('items') as FormArray;
    }

    createStopoversForm() {
        this.stopoversForm = this.fb.group({
            items: this.fb.array(this.stopovers)
        });
    }

    filterByStopoverCity() {
        const stopoversTemp = [];
        this.items.value.forEach((element, i) => {
            stopoversTemp.push({ name: this.stopovers[i]['name'], isChecked: element });
        });
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
    }

}
