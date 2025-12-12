import { Component, OnInit, OnDestroy, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Logger } from '../../../../../core/logger/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlightService } from '../../flight.service';
import { formatDate } from '../../../../../core/services/format-date';

const log = new Logger('Oneway');

@Component({
    selector: 'app-oneway',
    templateUrl: './oneway.component.html',
    styleUrls: ['./oneway.component.scss']
})

export class OnewayComponent implements OnInit, AfterViewInit, OnDestroy {

    @Output() someEvent = new EventEmitter<any>();
    @Output() callParent = new EventEmitter<any>();
    @Input() searchedList: Array<any> = Array();
    @Input() depart: any;
    @Input() cabinClass: any;
    regConfig: FormGroup;
    isOpen = false as boolean;
    cityExchanged = false;
    minDate = new Date();
    maxDate;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-orange'
    };
    fadeinn = false;
    travellersFadeinn = false;
    travellerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private flightService: FlightService,
        private location: Location
    ) {
        if (this.flightService.tripTypeClicked) {
            if (this.router.url !== '/') {
                const qp = { ...this.route.snapshot.queryParams, tripType: 'Oneway' };
                const d = this.route.snapshot.queryParams['departureDate'].split('-'); 
                qp['departureDate'] = d[0] + '-' + d[1] + '-' + d[2]; 
                this.location.go('/search/flight/result', new URLSearchParams(qp).toString());
            }
        }
    }

    ngOnInit(): void {
        console.log("one way");
        this.createTravellerForm();
        this.createForm();
        this.route.queryParams.subscribe(params => {
            if (Object.keys(params).length) {
                this.regConfig.patchValue(params);
                this.regConfig.patchValue({
                    traveller: JSON.parse(params['traveller'])
                });
                if (this.regConfig.valid) {
                    this.travellerForm.patchValue(JSON.parse(params['traveller']));
                    if (this.flightService.tripTypeClicked) {
                        this.flightService.tripTypeClicked = false;
                    } else {
                        this.onSubmit();
                    }
                }
            }
        });
    }

    ngAfterViewInit() {
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            departureDate: ['', [Validators.required]],
            tripType: 'oneway',
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

    get f() {
        return this.regConfig.controls;
    }

    onSubmit(): void {
        this.flightService.tripTypeClicked = false;
        if (this.router.url == '/') {
            const dt = new Date(this.regConfig.controls.departureDate.value);
            const departureDate = formatDate(dt, '');
            const traveller = JSON.stringify(this.regConfig.controls.traveller.value);
            this.router.navigate(['search/flight/result'], {
                queryParams: {
                    ...this.regConfig.value,
                    traveller,
                    departureDate,
                    tripType: 'Oneway'
                }
            });
        } else {
            this.flightService.isCollapsed.next(true);
            /* get airline code between parenthesis */
            const pattern = /\(([^)]+)\)/;
            const Origin = (this.regConfig.controls.departureCity.value).match(pattern);
            const Destination = (this.regConfig.controls.destinationCity.value).match(pattern);
            const dt = new Date(this.regConfig.controls.departureDate.value);
            const DepartureDate = formatDate(dt, '');
            const formData = {
                AdultCount: this.regConfig.get('traveller.adults').value,
                ChildCount: this.regConfig.get('traveller.childrens').value,
                InfantCount: this.regConfig.get('traveller.infants').value,
                JourneyType: 'OneWay',
                PreferredAirlines: [''],
                CabinClass: this.regConfig.controls.cabinClass.value,
                Segments: [
                    {
                        Origin: Origin[1],
                        Destination: Destination[1],
                        DepartureDate: DepartureDate + 'T00:00:00'
                    }
                ]
            };

            this.callParent.emit(formData);
            /* AFTER SUBMIT REFESH URL WITH NEW DATA */
            Object.assign(this.regConfig.value, { departureDate: DepartureDate });
            const traveller = JSON.stringify(this.regConfig.controls.traveller.value);
            Object.assign(this.regConfig.value, { traveller });
            //this.router.navigate(['search/flight/result'], { queryParams: { ...this.regConfig.value, tripType: 'Oneway' } });
        }
    }

    getSearchedList(event: any): void {
        this.someEvent.next(event);
    }

    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
            //console.log(error);
        }
    }

    getCity(event: any): void {
        let city = `${event.AirportCity}(${event.AirportCode})`;
        if (city) {
            event.inputFor === 'depart' ?
                this.regConfig.patchValue({ departureCity: city }) :
                this.regConfig.patchValue({ destinationCity: city });

            this.searchedList.length = 0;
        }
    }

    exchangeCity() {
        this.cityExchanged = !this.cityExchanged;
        const destinationCity = JSON.parse(JSON.stringify(this.regConfig.controls.destinationCity.value));
        const departureCity = JSON.parse(JSON.stringify(this.regConfig.controls.departureCity.value));
        this.regConfig.patchValue({ departureCity: destinationCity });
        this.regConfig.patchValue({ destinationCity: departureCity });
    }

    ngOnDestroy(): void {
    }

    applyTrendingSearch(ts: any) {
        this.flightService.tripTypeClicked = true;
        this.regConfig.patchValue(ts);
    }

}
