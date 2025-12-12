import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Logger } from '../../../../../core/logger/logger.service';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from '../../../../../core/services';
import { FlightService } from '../../flight.service';
import { Location } from '@angular/common';

const log = new Logger('MultiTrip');

@Component({
    selector: 'app-multicity',
    templateUrl: './multicity.component.html',
    styleUrls: ['./multicity.component.scss']
})
export class MulticityComponent implements OnInit, OnDestroy {
    @Output() someEvent = new EventEmitter<any>();
    @Output() callParent = new EventEmitter<any>();
    @Input() searchedList: Array<any> = Array();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        showWeekNumbers :false
    };
    cities = [];

    multiCityForm: FormGroup;
    submitted: boolean;
    dropDownCity: any;

    fadeinn = false;
    travellersFadeinn = false;
    travellerForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private flightService: FlightService,
        private location: Location
    ) {
        this.cities.length = 1;
        if (this.flightService.tripTypeClicked) {
            if (this.router.url !== '/') {
                const qp = { ...this.route.snapshot.queryParams, tripType: 'Multi-City' };
                this.location.go('/search/flight/result', new URLSearchParams(qp).toString());
            }
        }
    }


    ngOnInit(): void {
        this.createTravellerForm();
        this.createForm();
        this.route.queryParams.subscribe(params => {
            if (Object.keys(params).length && params['formData']) {
                const formData = JSON.parse(params['formData']);
                this.multiCityForm.patchValue(formData);
                if (this.multiCityForm.valid) {
                    if (this.flightService.tripTypeClicked) {
                        this.flightService.tripTypeClicked = false;
                    } else {
                        this.onSubmit();
                    }
                }
            }
        });
    }

    ngOnDestroy(): void {
        // throw new Error("Method not implemented.");
    }

    createForm() {
        this.multiCityForm = this.fb.group({
            cities: this.fb.array(
                [
                    this.generateCities(),
                    this.generateCities()
                ]
            ),
            tripType: 'Multi-City',
            traveller: this.fb.group({
                adults: 1,
                childrens: 0,
                infants: 0
            }),
            cabinClass: ['Economy', [Validators.required]]
        });
    }
    createTravellerForm() {
        this.travellerForm = this.fb.group({
            adults: 1,
            childrens: 0,
            infants: 0
        });
    }

    getCity(event: any): void {
        let city = `${event.AirportCity}(${event.AirportCode})`;
        if (city) {
            const inputFor = event.inputFor.split('_');
            if (inputFor[0] == 'departureCity') {
                this.multiCityForm.controls['cities']['controls'][inputFor[1]].patchValue({ departureCity: city });
            } else {
                this.multiCityForm.controls['cities']['controls'][inputFor[1]].patchValue({ destinationCity: city });
            }
            /*event.inputFor === 'depart' ?
              this.multiCityForm.patchValue({ departureCity: city }) :
              this.multiCityForm.patchValue({ destinationCity: city });*/

            this.searchedList.length = 0;
        }
    }

    getSearchedList(event: any): void {
        const userinp = `${event.target.value}`;

        !!userinp && this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { userinp })
            .pipe(
                shareReplay(1),
                untilDestroyed(this)
            )
            .subscribe((resp: any) => {
                if (resp['Status'] == 1) {
                    this.searchedList = resp.Data['AirportList'].slice(0, 10);
                } else {
                    const msg = resp['Message'];
                    this.searchedList.length = 0;
                }
            });
    }

    generateCities() {
        return this.fb.group({
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            departureDate: ['', [Validators.required]]
        });
    }



    onSubmit(): void {
        this.flightService.tripTypeClicked = false;
        if (this.router.url == '/') {
            this.multiCityForm.controls.cities.value.map(t => {
                const dt = new Date(t['departureDate']);
                const departureDate = (dt.getDate() + "").padStart(2, '0') + '-' + ((dt.getMonth() + 1) + "").padStart(2, '0') + '-' + dt.getUTCFullYear();
                return Object.assign(t, { departureDate });
            });
            this.router.navigate(['search/flight/result'], { queryParams: { formData: JSON.stringify(this.multiCityForm.value), tripType: 'Multi-city' } });
        } else {
            this.callParent.emit(this.multiCityForm.value);
            // log.debug(this.multiCityForm.value);
        }
    }

    addCity(): void {
        const len = this.cities.length;
        if (len < 4) {
            this.cities.length = len + 1;
            this.t.push(this.generateCities());
        }
    }
    shouldiHide(index): boolean {
        if (index === 0)
            return false;
        else
            return true;
    }

    removeCity(index): void {
        this.t.removeAt(index);
        // remove with the id
        this.cities.length = this.cities.length - 1;
    }



    // convenience getters for easy access to form fields
    get f() { return this.multiCityForm.controls; }
    get t() { return this.multiCityForm.get('cities') as FormArray; }

    setCurrentInput(t) {
        this.dropDownCity = t;
    }

    isCurrentInput(t) {
        return this.dropDownCity == t;
    }
}
