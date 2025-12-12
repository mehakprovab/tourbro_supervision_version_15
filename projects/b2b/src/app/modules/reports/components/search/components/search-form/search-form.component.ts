import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

    @Input() moduleType: string;
    @Output() searchFormEvent = new EventEmitter<string>();
    @Output() searchtype = new EventEmitter<string>();

    searchForm: FormGroup
    isOpen = false as boolean;
    setMinDate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private util: UtilityService
    ) { }

    ngOnInit() {
        this.createSearchForm();
        let fromDate = this.util.setFromDate();
        let toDate =this.util.setToDate();
        this.searchForm.patchValue({
            booked_from_date: fromDate,
            booked_to_date: toDate
        });
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
        console.log(date.toString());
        this.searchForm.patchValue({
            booked_from_date: date,
        });
        this.onSubmit();
    }

    createSearchForm() {
        if (this.moduleType == 'flight') {
            this.searchForm = this.fb.group({
                booked_from_date: [''],
                booked_to_date: [''],
                status: ['ALL'],
                app_reference: [''],
                pnr: new FormControl('', [Validators.pattern(this.util.regExp.alphaNum)]),
                email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
            });
        } else if (this.moduleType == 'hotel') {
            this.searchForm = this.fb.group({
                booked_from_date: [''],
                booked_to_date: [''],
                status: ['ALL'],
                app_reference: [''],
                email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
            });
        }  else if (this.moduleType == 'activity') {
            this.searchForm = this.fb.group({
                booked_from_date: [''],
                booked_to_date: [''],
                status: ['ALL'],
                app_reference: [''],
                email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
            });
        }else if (this.moduleType == 'transfer') {
            this.searchForm = this.fb.group({
                booked_from_date: [''],
                booked_to_date: [''],
                status: ['ALL'],
                app_reference: [''],
                email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
            });
        }else if (this.moduleType == 'tour') {
            this.searchForm = this.fb.group({
                booked_from_date: [''],
                booked_to_date: [''],
                status: ['ALL'],
                app_reference: [''],
                email: new FormControl('', [Validators.pattern(this.util.regExp.email)])
            });
        }

    }

    get f() { return this.searchForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.searchForm.invalid) {
            return;
        }
        this.searchFormEvent.emit(this.searchForm.value);
    }

    onTimelineSearch() {

    }

    resetSearch() {
        this.searchForm.reset();
        let fromDate = this.util.setFromDate();
        let toDate =this.util.setToDate();
        this.searchForm.patchValue({
            booked_from_date: fromDate,
            booked_to_date: toDate,
            status:'ALL'
        });
        this.searchFormEvent.emit(this.searchForm.value);
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

}
