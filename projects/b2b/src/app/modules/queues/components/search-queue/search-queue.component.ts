import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

@Component({
    selector: 'app-search-queue',
    templateUrl: './search-queue.component.html',
    styleUrls: ['./search-queue.component.scss']
})
export class SearchQueueComponent implements OnInit {
    @Output() searchValuesEvent = new EventEmitter<string>();
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    searchForm: FormGroup
    setMinDate: any;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private util: UtilityService
    ) {
        this.createSearchForm();
        let fromDate = this.util.setFromDate();
        let toDate = this.util.setToDate();
        this.searchForm.patchValue({
            booked_from_date: fromDate,
            booked_to_date: toDate,
            status: "BOOKING_HOLD"
        });

    }

    ngOnInit() {
        this.onSubmit();
    }

    timelineSearch = [
        { timeline: 0, name: "Today Search" },
        { timeline: 1, name: "Last Day Search" },
        { timeline: 7, name: "One Week Search" },
        { timeline: 30, name: "One Month Search" },
    ]

    timelineFilter(timeline) {
        let date = new Date();
        date.setDate(date.getDate() - timeline);
        this.searchForm.patchValue({
            booked_from_date: date,
        });
        this.onSubmit();
    }

    createSearchForm() {
        this.searchForm = this.fb.group({
            booked_from_date: [''],
            booked_to_date: [''],
            status: ['ALL'],
            app_reference: [''],
            pnr: new FormControl('', [Validators.pattern(this.util.regExp.alphaNum)]),
            email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
        });
    }

    get f() { return this.searchForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.searchForm.invalid) {
            return;
        }
        this.searchValuesEvent.emit(this.searchForm.value);
    }

    onTimelineSearch() {

    }

    resetSearch() {
        this.searchForm.reset();
        let fromDate=this.util.setFromDate();
        let toDate=this.util.setToDate();
        this.searchForm.patchValue({
            booked_from_date:fromDate,
            booked_to_date: toDate,
            status: "BOOKING_HOLD"
        });
        this.searchValuesEvent.emit(this.searchForm.value);
    }

    onDepart(event) {
        if (event) {
            setTimeout(() => {
                this.setMinDate = event
            }, 100)

        } else if (event) {
            setTimeout(() => {
                this.isOpen = false;
            }, 100)
        }
    }

    receiveSearchForm($event) {
        this.searchValuesEvent.emit($event);
    }

    openDate() {
        this.isOpen = true;
    }



}
