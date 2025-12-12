import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from "@angular/material/sort";
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { MarkupsService } from '../../markups.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';


const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];


@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    
    markuplist: any;
    activeIdString: any = "left";
    airlineForm: FormGroup;
    updateGeneral: boolean = false;
    generalMarkupForm: FormGroup;
    items: FormArray;
    protected subs = new SubSink();
    airlines: any = [];
    specificAirlineValue: string = '';;
    pageSize = 6;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    respData: any;
    generalMarkupId: number;
    ShowaddAirline: boolean;
    airlineMarkupData = []
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";

    constructor(
        private swalService: SwalService,
        private utility: UtilityService,
        private markupService: MarkupsService,
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private router: Router
    ) { }
    ngOnInit() {
        this.airlineForm = this.fb.group({
            airlines: ['', Validators.required],
            mark_up_type: ['plus', Validators.required],
            mark_up_value: ['', Validators.required]
        });
        this.generalMarkupForm = this.fb.group({
            mark_up_type: ['plus', Validators.required],
            mark_up_value: ['', Validators.required]
        });
        this.ShowAddAirline(1);
        this.getMarkupData();
        this.getAirlines();
    }
    submitted: boolean;
    hasAddAirlineError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.airlineForm.controls[controlName].touched) && this.airlineForm.controls[controlName].hasError(errorName));
    }
    hasgeneralMarkupError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.generalMarkupForm.controls[controlName].touched) && this.generalMarkupForm.controls[controlName].hasError(errorName));
    }

    onAddGeneralMarkup(data, type) {
        if (this.generalMarkupForm.invalid) {
            return;
        }
        if (data.mark_up_type == "percentage") {
            if (parseInt(data.mark_up_value) > 100) {
                this.swalService.alert.oops("Percentage must not exceed 100");
                return;
            }
        }
        if (this.updateGeneral) {
            this.updateGeneralMarkup(data);
        } else {
            this.onFlightAdd(data, type);
        }
    }

    updateGeneralMarkup(data) {
        let generalMarkup = [{
            id: this.generalMarkupId,
            value: parseInt(data.mark_up_value),
            value_type: data.mark_up_type,
            markup_currency: 'GBP'
        }]

        this.subs.sink = this.apiHandlerService.apiHandler('updateFlightMarkup', 'POST', '', '', generalMarkup).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.clearAddAirline();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }

    onAddSpecificAirlineMarkup(Udata, data) {
    }


    onFlightAdd(flightData, type) {
        if (flightData.mark_up_type == "percentage") {
            if (parseInt(flightData.mark_up_value) > 100) {
                this.swalService.alert.oops("Percentage must not exceed 100");
                return;
            }
        }
        this.submitted = true;
        let markupForm = {
            flight_airline_id: parseInt(flightData.airlines),
            value_type: flightData.mark_up_type,
            value: parseInt(flightData.mark_up_value),
            type: "specific",
            domain_list_fk: 0,
            module_type: "b2b_flight",
            markup_currency: "GBP",
            fare_type: "Public",
        }
        if (type == "generic") {
            markupForm.type = "generic";
            markupForm.flight_airline_id = 0
        } else {
            if (this.airlineForm.invalid) {
                return;
            }
        }

        this.subs.sink = this.apiHandlerService.apiHandler('addMarkup', 'POST', '', '', markupForm).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.clearAddAirline();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }

    getAirlines() {
        this.subs.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', {
            "name": ""
        }).subscribe(res => {
            if (res.Status) {
                this.airlines = res.data;
            } else {
            }
        });
    }

    ShowAddAirline(condition) {
        switch (condition) {
            case 0:
                this.ShowaddAirline = false;
                break;
            case 1:
                this.ShowaddAirline = true;
                break;
        }
    }

    onSearchTypeChange(value) {
        this.router.navigate(["markup/" + value])
    }

    getMarkupData() {

        this.respData = this.markupService.fetchMarkupReport().subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data;
                this.markuplist = resp.data

                this.markuplist = this.respData.filter((data) => {
                    return data.type === "generic" && data.module_type === "b2b_flight"
                })
                if (this.markuplist.length != 0) {
                    this.updateGeneral = true;
                    this.generalMarkupId = this.markuplist[0].id;
                    this.generalMarkupForm.patchValue({
                        mark_up_value: this.markuplist[0].value ? this.markuplist[0].value : '',
                        mark_up_type: this.markuplist[0].value_type ? this.markuplist[0].value_type : '',
                    })
                }

                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = true;
                this.swalService.alert.error(resp.msg || '');
            }
        });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                flight_name: objData.airlines,
                markup_value: objData.mark_up_value,
                mark_type: objData.mark_up_type,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'airlines': return this.utility.compare('' + a.airlines.toLocaleLowerCase(), '' + b.airlines.toLocaleLowerCase(), isAsc);
                case 'mark_up_type': return this.utility.compare('' + a.mark_up_type.toLocaleLowerCase(), '' + b.mark_up_type.toLocaleLowerCase(), isAsc);
                case 'mark_up_value': return this.utility.compare(+a.mark_up_value, +b.mark_up_value, isAsc);
                default: return 0;
            }
        });
    }

    clearAddAirline() {
        this.airlineForm.reset();
    }
    clearGeneralMarkup() {
        this.generalMarkupForm.reset();
    }

    userData: any;
    triggerTab(data: any) {
        if (data.data) {
            this.userData = data.data;
            this.tabs.select(data.tabId);
        }
    }


}
