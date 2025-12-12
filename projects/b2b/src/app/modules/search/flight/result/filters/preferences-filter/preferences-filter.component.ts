import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-preferences-filter',
    templateUrl: './preferences-filter.component.html',
    styleUrls: ['./preferences-filter.component.scss']
})
export class PreferencesFilterComponent implements OnInit {

    flightsCopy = [];
    preferencesForm: FormGroup;
    initialValue = {
        refundable: 0,
        nonRefundable: 0,
        baggage: 0,
    };
    enabled = false;
    protected subs = new SubSink();

    constructor(
        private fb: FormBuilder,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.createPreferencesForm();
        this.subs.sink = this.flightService.flights.subscribe(res => {
            this.enabled = res.length;
        });
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            this.flightsCopy = res;
        });
        this.subs.sink = this.flightService.preferencesReset.subscribe(res => {
            if (res) {
                this.clearPreferencesFilter();
            }
        });
    }

    createPreferencesForm() {
        this.preferencesForm = this.fb.group(this.initialValue);
    }

    filterByPreferences(t, v) {
        this.preferencesForm.controls[t].setValue(v ? 1 : 0);
        this.flightService.refundable.next(
            (this.preferencesForm.get('refundable').value === 1 || this.preferencesForm.get('refundable').value == true) ? true : false
        );
        this.flightService.nonRefundable.next(
            (this.preferencesForm.get('nonRefundable').value === 1 || this.preferencesForm.get('nonRefundable').value === true) ? true : false
        );
        this.flightService.filterByPreferences();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearPreferencesFilter() {
        this.preferencesForm.patchValue({
            refundable: 0,
            nonRefundable: 0,
            baggage: 0
        });
        this.flightService.refundable.next(false);
        this.flightService.nonRefundable.next(false);
        this.flightService.baggage.next(false);
        this.flightService.filterByPreferences();
    }
}
