import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../core/services/format-date';
import { FlightService } from '../../flight.service';
import { Location } from '@angular/common';

const log = new Logger('TwoWay');

@Component({
    selector: 'app-roundtrip',
    templateUrl: './roundtrip.component.html',
    styleUrls: ['./roundtrip.component.scss']
})
export class RoundtripComponent implements OnInit {
    @Output() someEvent = new EventEmitter<any>();
    @Output() callParent = new EventEmitter<any>();
    @Input() searchedList: Array<any> = Array();
    @Input() depart: any;
    @Input() cabinClass: any;
    isOpen = false as boolean;
    cityExchanged = false;
    minDate;
    maxDate;
    bsDateConf = {
        isAnimated: true,
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-orange'
    };
    fadeinn = false;
    travellersFadeinn = false;

    roundTripForm: FormGroup;
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
                const qp = { ...this.route.snapshot.queryParams, tripType: 'Roundtrip' };
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
                const dt = (params['departureDate']).split(' - ');
                let updatedForm = { ...params };
                if (dt.length > 1) {
                    updatedForm = Object.assign(updatedForm, { departureDate: [new Date(dt[0]), new Date(dt[1])] });
                }
                this.roundTripForm.patchValue(updatedForm);
                if (this.roundTripForm.valid) {
                    if (this.flightService.tripTypeClicked) {
                        this.flightService.tripTypeClicked = false;
                    } else {
                        this.onSubmit();
                    }
                }
            }
        });
    }

    createForm() {
        this.roundTripForm = this.fb.group({
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            departureDate: ['', [Validators.required]],
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
        return this.roundTripForm.controls;
    }

    onSubmit(): void {
        this.flightService.tripTypeClicked = false;
        const dd = this.roundTripForm.controls.departureDate.value;
        const departureDate = formatDate(dd[0], '') + ' - ' + formatDate(dd[1], '');
        const traveller = JSON.stringify(this.roundTripForm.controls.traveller.value);
        Object.assign(this.roundTripForm.value, { departureDate, traveller });
        if (this.router.url !== '/') {
            const pattern = /\(([^)]+)\)/;
            const Origin = (this.roundTripForm.controls.departureCity.value).match(pattern);
            const Destination = (this.roundTripForm.controls.destinationCity.value).match(pattern);
            const DepartureDate = formatDate(dd[0], '');
            const ReturnDate = formatDate(dd[1], '');
            const formData = {
                AdultCount: this.roundTripForm.get('traveller.adults').value,
                ChildCount: this.roundTripForm.get('traveller.childrens').value,
                InfantCount: this.roundTripForm.get('traveller.infants').value,
                JourneyType: 'Round',
                PreferredAirlines: [''],
                CabinClass: this.roundTripForm.controls.cabinClass.value,
                Segments: [
                    {
                        Origin: Origin[1],
                        Destination: Destination[1],
                        DepartureDate: DepartureDate + 'T00:00:00',
                        ReturnDate: ReturnDate + 'T00:00:00'
                    }
                ]
            };
            this.callParent.emit(formData);
        }
        this.router.navigate(['search/flight/result'], { queryParams: { ...this.roundTripForm.value, tripType: 'Roundtrip' } });
    }

    onChanges(): void {
        this.roundTripForm.valueChanges.subscribe(v => {
        });
    }

    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
        }
    }

    getCity(event: any): void {
        let city = `${event.AirportCity}(${event.AirportCode})`;
        if (city) {
            event.inputFor === 'depart' ?
                this.roundTripForm.patchValue({ departureCity: city }) :
                this.roundTripForm.patchValue({ destinationCity: city });

            this.searchedList.length = 0;
        }
    }

    getSearchedList(e: any): void {
        this.someEvent.next(e);
    }

    exchangeCity() {
        this.cityExchanged = !this.cityExchanged;
        const destinationCity = JSON.parse(JSON.stringify(this.roundTripForm.controls.destinationCity.value));
        const departureCity = JSON.parse(JSON.stringify(this.roundTripForm.controls.departureCity.value));
        this.roundTripForm.patchValue({ departureCity: destinationCity });
        this.roundTripForm.patchValue({ destinationCity: departureCity });
    }

}
