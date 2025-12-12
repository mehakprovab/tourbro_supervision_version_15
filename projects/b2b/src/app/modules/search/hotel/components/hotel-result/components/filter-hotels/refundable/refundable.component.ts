import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
  selector: 'app-refundable',
  templateUrl: './refundable.component.html',
  styleUrls: ['./refundable.component.scss']
})
export class RefundableComponent implements OnInit {

  hotelsCopy = [];
    preferencesForm: FormGroup;
    initialValue = {
        refundable: 0,
        nonRefundable: 0,
        baggage: 0,
    };
    enabled = false;
    protected subs = new SubSink();
    booking_source:any;
    constructor(
        private fb: FormBuilder,
        private HotelService: HotelService
    ) { }

    ngOnInit() {
        this.createPreferencesForm();
        this.subs.sink = this.HotelService.hotels.subscribe(res => {
            this.enabled = res.length;
        });
        this.subs.sink = this.HotelService.hotelsCopy.subscribe(res => {
            this.hotelsCopy = res;
            if(this.hotelsCopy.length){
            this.booking_source = this.hotelsCopy[0].booking_source
            console.log(" this.booking_source", this.booking_source)
            }
        });
        this.subs.sink = this.HotelService.preferencesReset.subscribe(res => {
            if (res) {
                this.clearPreferencesFilter();
            }
        });
    }

    createPreferencesForm() {
        this.preferencesForm = this.fb.group(this.initialValue);
    }

    filterByPreferences(t, v) {
        this.preferencesForm.controls[t].setValue(v ? true : false);
        this.HotelService.refundable.next(
            ( this.preferencesForm.get('refundable').value == true) ? true : false
        );
        this.HotelService.nonRefundable.next(
            ( this.preferencesForm.get('nonRefundable').value === true) ? true : false
        );
        this.HotelService.filterByPreferences();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearPreferencesFilter() {
        this.preferencesForm.patchValue({
            refundable: 0,
            nonRefundable: 0,
        });
        this.HotelService.refundable.next(false);
        this.HotelService.nonRefundable.next(false);
        this.HotelService.filterByPreferences();
    }

}
