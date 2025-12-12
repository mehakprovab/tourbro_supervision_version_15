import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { browserRefresh } from '../../../../app/app.component';
import { ApiHandlerService } from '../../../core/api-handlers';
import { untilDestroyed } from '../../../core/services';
import { formatDate } from '../../../core/services/format-date';
import { UtilityService } from '../../../core/services/utility.service';
import { ThemeOptions } from '../../../theme-options';
import { FlightService } from './flight.service';
import { SwalService } from '../../../core/services/swal.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss'],
})
export class FlightComponent implements OnInit, OnDestroy {
    public browserRefresh: boolean;
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    public tourIcon: string = "assets/images/login-images/assets/holiday-ic.svg";
    public plusIcon: string = "assets/images/login-images/plus.png";
    public removeIcon: string = "assets/images/login-images/remove.png";
    @ViewChild('roundtripButton', { static: true }) roundtripButton: ElementRef<HTMLElement>;
    @ViewChild('flight', { static: false }) flight: ElementRef<HTMLElement>;
    @ViewChild('hotels', { static: false }) hotels: ElementRef<HTMLElement>;
    @ViewChild('tour', { static: false }) tour: ElementRef<HTMLElement>;
    @ViewChild('insurance', { static: false }) insurance: ElementRef<HTMLElement>;
    @ViewChild('multiButton', { static: true }) multiButton: ElementRef<HTMLElement>;
    @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
    @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
    @ViewChild('departureDate', { static: false }) departureDate: ElementRef<HTMLElement>;
    @ViewChild('returnDate', { static: false }) returnDate: ElementRef<HTMLElement>;
    @ViewChildren('mDepartureCity') mDepartureCity: QueryList<ElementRef>
    @ViewChildren('mDestinationCity') mDestinationCity: QueryList<ElementRef>
    @ViewChildren('mDepartureDate') mDepartureDate: QueryList<ElementRef>
    @ViewChild('activity', { static: false }) activity: ElementRef<HTMLElement>;
    @ViewChild('prefferedAirline', { static: false }) prefferedAirline: ElementRef<HTMLElement>;
    @ViewChild('transfer', { static: false }) transfer: ElementRef<HTMLElement>;
    @ViewChild('rangePicker', { static: false }) rangePicker!: BsDaterangepickerDirective;
    @Input() searchtype;
    @Output() callResult = new EventEmitter<any>();
    public items$: Observable<[]>;
    public input$ = new Subject<string | null>();
    searchTabs: Array<string>;
    selectedIndex = 1;
    CabinClass: any;
    searchedList: Array<any> = Array();
    searchedAirLineList: Array<any> = Array();
    depart = false as boolean;
    isOpen = false as boolean;
    isreturnDate = false as boolean;
    exchangeCity = false;
    trendingSearches = [];
    isDisabled: boolean = false;
    dateRange: Date[] = [new Date(), new Date()];
    onewayTab: boolean = false;
    roundtripTrab: boolean = false;
    regConfig: FormGroup;
    cityExchanged = false;
    minDate = new Date();
    NonStopFlights: number = 0;
    minDateArr = Array(5).fill(new Date());
    maxDate;
    bsDateConf = {
        isAnimated: true,
        displayMonths:2,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    fadeinn = false;
    Connectivity = false;
    airline = false;
    travellersFadeinn = false;
    travellerForm: FormGroup;
    dropDownCity: any;
    submitSessionFlightSearchKeyCheck;
    travellerCountError = false;
    infantError = false;
    airlines: any = [];
    airlineName = 'Choose Airline';
    airlineCode: string;
    protected subs = new SubSink();
    setMinDate: any;
    isResultScreen:boolean=false;
    tabSubscription: any;
    activeIdString: any = "left";
    config = {
        displayKey: "name", //if objects array passed which key to be displayed defaults to description
        search: true, //true/false for the search functionlity defaults to false,
        height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
        placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
        customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        limitTo: 0,// number thats limits the no of options displayed in the UI (if zero, options will not be limited)
        moreText: 'more',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
        noResultsFound: 'No results found!',// text to be displayed when no items are found while searching
        searchPlaceholder: 'Search', // label thats displayed in search input,
        searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    }
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    maxDateYoung: any;
    minDateYoung: any;
    selectedOption='Economy';
    fromCityBool:boolean=false;
    toCityBool:boolean=false;
    city: { cityId: any; cityName: any; countryCode: any; status: boolean; source: string; checkin: Date; };
    searchTitle: string;
    showYoungDOB: boolean = false;
    selectedDate: any;
    minReturnDate: any;
    fromSec: any;

    constructor(
        private fb: FormBuilder,
        public location: PlatformLocation,
        private flightService: FlightService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private utility: UtilityService,
        public globals: ThemeOptions,
        private swalService: SwalService

    ) {
        this.input$.subscribe((newTerm) => {
            const logLine = `Typeahead emit: ${newTerm}\n`;
        });

        this.items$ = this.input$.pipe(
            map((term) => this.searchPeople(term))
        )
    }

    private searchPeople(term: string | null): any {
        const searchTerm = term ? term : '';
        return this.airlines.filter((airline) => {
            return airline.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        });
    }

    ngOnInit() {
        this.setMaxMinDate();
        this.updateUI();
        
        this.flightService.flightSearchData.next([]);
        this.activeIdString = sessionStorage.getItem('activeId') || 'left';
        this.searchTabs = ['Roundtrip', 'Oneway', 'Multi-city', 'Open-Jaw'];
        this.createTravellerForm();
        this.createForm();
        if(this.selectedIndex ==1) {
            this.regConfig.get('returnDate').clearValidators();
        }
        if (browserRefresh == false) {
            this.onewayTab = true;
            this.roundtripTrab = true;
        }
        let data1 = sessionStorage.getItem('flightSearchData');
        data1 = JSON.parse(data1) || {};
        this.browserRefresh = browserRefresh;

        const getSectors = JSON.parse(sessionStorage.getItem('flightSearchData'));
      
        this.selectedOption = getSectors ? (getSectors['CabinClass'] ? getSectors['CabinClass'] : '') : '';

        if (getSectors['selectedIndex'] === 2 || getSectors['selectedIndex'] === 3) {
            this.regConfig.get('departureCity').clearValidators();
            this.regConfig.get('destinationCity').clearValidators();
            this.regConfig.get('returnDate').clearValidators();
            this.regConfig.get('departureCity').updateValueAndValidity();
            this.regConfig.get('destinationCity').updateValueAndValidity();
            this.regConfig.get('returnDate').updateValueAndValidity();
        }

        if (getSectors['tripType'] !== 'Multi-city' && getSectors['tripType'] !== 'Open-Jaw') {
            let sectors:any[] = [];
            let depSector = getSectors.departureCity;
            let desSector = getSectors.destinationCity;
            sectors.push(depSector.split('-')[1]);
            sectors.push(desSector.split('-')[1]);
            data1['sectors'] = sectors;
            const selectedSectors = data1['sectors'];
            const depDate = data1['departureDate'];
            const returnDate = data1['returnDate'];
            let departureDate;
            if (data1['returnDate']) {
                departureDate = new Date(returnDate);
            } else {
                departureDate = new Date(depDate);
            }

            this.maxDateInfant = this.addYearsToDate(departureDate,0,0, -1);
            this.minDateInfant = this.addYearsToDate(departureDate, -2, 0, 1);
            this.maxDateChild = this.addYearsToDate(departureDate,-2,0, -1);
            const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
            ];
            const showYoungDOB = selectedSectors.length > 0 ? [...selectedSectors].some(code => ukAirports.includes(code)) : false;
            if (showYoungDOB) {
                this.showYoungDOB = true;
                this.minDateChild = this.addYearsToDate(departureDate,-12,0 , 1);
                this.maxDateYoung = this.addYearsToDate(departureDate,-12, 0, -1);
                this.minDateYoung = this.addYearsToDate(departureDate,-16, 0,1);

                const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
                // Reset it
                youngDOBArray.clear();
                childDOBArray.clear();
                infantDOBArray.clear();
                
                // Add items
                data1['traveller'].youngDateOfBirth.forEach((dobObj: any) => {
                youngDOBArray.push(this.fb.group({
                    youngDateOfBirth: new Date(dobObj.youngDateOfBirth)
                }));
                });

                data1['traveller'].childDateOfBirth.forEach((dobObj: any) => {
                childDOBArray.push(this.fb.group({
                    childDateOfBirth: new Date(dobObj.childDateOfBirth)
                }));
                });
                data1['traveller'].infantDateOfBirth.forEach((dobObj: any) => {
                infantDOBArray.push(this.fb.group({
                    infantDateOfBirth: new Date(dobObj.infantDateOfBirth)
                }));
                });
                this.regConfig.get('traveller').patchValue ({
                    young: data1['traveller'].young,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
                this.travellerForm.patchValue({
                    young: data1['traveller'].young,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
            } else {
                this.showYoungDOB = false;
                this.minDateChild = this.addYearsToDate(departureDate,-12,0, 1);

                const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            
                youngDOBArray.clear();
                childDOBArray.clear();
                infantDOBArray.clear();
            
                
                data1['traveller'].youngDateOfBirth.forEach((dobObj: any) => {
                youngDOBArray.push(this.fb.group({
                    youngDateOfBirth: new Date(dobObj.youngDateOfBirth)
                }));
                });

                data1['traveller'].childDateOfBirth.forEach((dobObj: any) => {
                    childDOBArray.push(this.fb.group({
                    childDateOfBirth: new Date(dobObj.childDateOfBirth)
                }));
                });
                data1['traveller'].infantDateOfBirth.forEach((dobObj: any) => {
                    infantDOBArray.push(this.fb.group({
                    infantDateOfBirth: new Date(dobObj.infantDateOfBirth)
                }));
                });

                
                this.regConfig.get('traveller').patchValue ({
                    young: 0,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
                this.travellerForm.patchValue({
                    young: 0,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
            }
        } else {
            let cities = getSectors.cities.map(data => data.mDepartureCity.split('-')[1]);
            const departureLastDate = getSectors.cities[getSectors.cities.length-1];
            let departureDate = new Date(departureLastDate.mDepartureDate);
            this.maxDateInfant = this.addYearsToDate(departureDate,0,0, -1);
            this.minDateInfant = this.addYearsToDate(departureDate, -2, 0, 1);
            this.maxDateChild = this.addYearsToDate(departureDate,-2,0, -1);
            const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
            ];
            const showYoungDOB = cities.length > 0 ? [...cities].some(code => ukAirports.includes(code)) : false;

            if (showYoungDOB) {
                this.showYoungDOB = true;
                this.minDateChild = this.addYearsToDate(departureDate,-12,0 , 1);
                this.maxDateYoung = this.addYearsToDate(departureDate,-12, 0, -1);
                this.minDateYoung = this.addYearsToDate(departureDate,-16, 0,1);

                const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
                // Reset it
                youngDOBArray.clear();
                childDOBArray.clear();
                infantDOBArray.clear();
            
                // Add items
                data1['traveller'].youngDateOfBirth.forEach((dobObj: any) => {
                youngDOBArray.push(this.fb.group({
                    youngDateOfBirth: new Date(dobObj.youngDateOfBirth)
                }));
                });

                data1['traveller'].childDateOfBirth.forEach((dobObj: any) => {
                childDOBArray.push(this.fb.group({
                    childDateOfBirth: new Date(dobObj.childDateOfBirth)
                }));
                });
                data1['traveller'].infantDateOfBirth.forEach((dobObj: any) => {
                infantDOBArray.push(this.fb.group({
                    infantDateOfBirth: new Date(dobObj.infantDateOfBirth)
                }));
                });
                this.regConfig.get('traveller').patchValue ({
                    young: data1['traveller'].young,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
                this.travellerForm.patchValue({
                    young: data1['traveller'].young,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
            } else {
                this.showYoungDOB = false;
                this.minDateChild = this.addYearsToDate(departureDate,-12,0, 1);

                const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            
                youngDOBArray.clear();
                childDOBArray.clear();
                infantDOBArray.clear();
            
                
                data1['traveller'].youngDateOfBirth.forEach((dobObj: any) => {
                youngDOBArray.push(this.fb.group({
                    youngDateOfBirth: new Date(dobObj.youngDateOfBirth)
                }));
                });

                data1['traveller'].childDateOfBirth.forEach((dobObj: any) => {
                    childDOBArray.push(this.fb.group({
                    childDateOfBirth: new Date(dobObj.childDateOfBirth)
                }));
                });
                data1['traveller'].infantDateOfBirth.forEach((dobObj: any) => {
                    infantDOBArray.push(this.fb.group({
                    infantDateOfBirth: new Date(dobObj.infantDateOfBirth)
                }));
                });

                
                this.regConfig.get('traveller').patchValue ({
                    young: 0,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
              })
                this.travellerForm.patchValue({
                    young: 0,
                    childrens: data1['traveller'].childrens,
                    adults: data1['traveller'].adults,
                    infants: data1['traveller'].infants
                })
            }
        }

        
        if(this.browserRefresh){
            this.toggleSelectedTripType(data1['selectedIndex']);
            if (data1['cities'] && data1['cities'].length > 2) {
                const cities = this.regConfig.get('cities') as FormArray;
                for (let i = 0; i < (data1['cities'].length - 2); i++) {
                    cities.push(this.generateCities(''));
                }
            }
            if (data1['tripType'] == 'Multi-city' || data1['tripType'] == 'Open-Jaw') {
                data1['cities'].forEach((e) => {
                    e.mDepartureDate = new Date(e.mDepartureDate);
                });
            }   

            const cities = this.regConfig.get('cities') as FormArray;
            // Ensure the array is initialized, if needed
            if (cities.length === 0) {
                data1['cities'].forEach(city => {
                    cities.push(this.generateCities(city)); // generateCities should return a form group
                });
            }
            this.regConfig.patchValue({
                departureCity: data1['departureCity'],
                destinationCity: data1['destinationCity'],
                departureDate: data1['departureDate']? new Date(data1['departureDate']):'',
                returnDate: data1['returnDate'] ? new Date(data1['returnDate']) : '',
                traveller: data1['traveller'],
                cities: data1['cities'],
                PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                selectedIndex:data1['selectedIndex']
            });
            this.setdateRange();
        }

        this.setAutoFlightData();

        //Radha D D
        if (this.browserRefresh == false && data1.hasOwnProperty('departureCity')) {
            const tripType = data1['tripType'];
            this.flightService.tripType.next(tripType);
            this.regConfig.patchValue({
                departureCity: data1['departureCity'],
                destinationCity: data1['destinationCity'],
                departureDate: new Date(data1['departureDate']),
                returnDate: data1['returnDate'] ? new Date(data1['returnDate']) : '',
                traveller: data1['traveller'],
                PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                selectedIndex:data1['selectedIndex']
            });
            this.setdateRange();
            this.toggleTripType(data1['selectedIndex']);
        }
        this.location.onPopState(() => {
            this.flightService.flightsCopy.next([]);
            this.flightService.flights.next([]);
            if(this.browserRefresh){
                this.regConfig.patchValue({
                    departureCity: data1['departureCity'],
                    destinationCity: data1['destinationCity'],
                    departureDate: new Date(data1['departureDate']),
                    returnDate: data1['returnDate'] ? new Date(data1['returnDate']) : '',
                    traveller: data1['traveller'],
                    PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                    selectedIndex:data1['selectedIndex']
                });
                if (data1['cities'] && data1['cities'].length > 2) {
                    const cities = this.regConfig.get('cities') as FormArray;
                    for (let i = 0; i < (data1['cities'].length - 2); i++) {
                        cities.push(this.generateCities(''));
                    }
                }
            }

            if (data1['tripType'] == 'Multi-city' || data1['tripType'] == 'Open-Jaw') {
                data1['cities'].forEach((e) => {
                    e.mDepartureDate = new Date(formatDate(new Date(e.mDepartureDate), 'DD/MM/YYYY'));
                });
            }
            this.regConfig.patchValue({
                destinationCity: data1['destinationCity'],
                departureDate: new Date(data1['departureDate']),
                returnDate: data1['tripType'] != 'Oneway' ? new Date(data1['returnDate']) : '',
                traveller: data1['traveller'],
                cities: data1['cities'],
                PreferredAirline: data1['PreferredAirlineName'],
                PreferredAirlineCode: data1['PreferredAirlines'] && data1['PreferredAirlines'][0] ? data1['PreferredAirlines'][0] : '',
                PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                selectedIndex:data1['selectedIndex']
            });
            this.toggleTripType(data1['selectedIndex']);
        });
        if (!this.flightService.formFilled && (data1['tripType'] === 'Multi-city' || data1['tripType'] === 'Open-Jaw')) {
            this.selectedTrip(data1['selectedIndex']);//used to clear default selected records if clicked on home icon after selecting the multicity
        }
        if (this.flightService.formFilled) {
            let data = sessionStorage.getItem('flightSearchData');
            data = JSON.parse(data);
            if (data['tripType'] == 'Multi-city' || data1['tripType'] == 'Open-Jaw') {
                data['cities'].forEach((e) => {
                   e.mDepartureDate = new Date(formatDate(new Date(e.mDepartureDate), 'DD/MM/YYYY'));
                });
            }
            //Added to show more than 2 multi-city added in ui
            if (data['cities'] && data['cities'].length > 2) {
                const cities = this.regConfig.get('cities') as FormArray;
                for (let i = 0; i < (data['cities'].length - 2); i++) {
                    cities.push(this.generateCities(''));
                }
            }
            this.regConfig.patchValue({
                departureCity: data['departureCity'],
                destinationCity: data['destinationCity'],
                departureDate: new Date(formatDate(new Date(data['departureDate']), 'DD/MM/YYYY')),
                returnDate: data['returnDate'] ? new Date(formatDate(new Date(data['returnDate']), 'DD/MM/YYYY')) : '',
                traveller: data['traveller'],
                cities: data['cities'],
                PreferredAirline: data['PreferredAirlineName'] ? data['PreferredAirlineName'] : data['PreferredAirline'],
                PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                selectedIndex:data1['selectedIndex']
            });
            this.setdateRange();
            const tripType = data['tripType'];
            this.toggleTripType(data1['selectedIndex']);
            this.flightService.tripType.next(tripType);
            // switch (tripType) {
            //     case 'Roundtrip':
            //         this.selectedIndex = 0;
            //         break;
            //     case 'Multi-city':
            //         this.selectedIndex = 2;
            //         break;
            //     case 'Oneway':
            //         this.selectedIndex = 1;
            //         this.regConfig.get('returnDate').clearValidators();
            //         break;
            //     default:
            //         break;
            // }
        }

        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] };
        this.CabinClass = this.flightService.getCabinClass();
        this.flightService.flightSearchData.subscribe(data => {
            if (data && data['id'] > 0) {
                this.activeIdString = 'left';
                const today = new Date()
                let tomorrow; let returnDate;
                if (new Date(data['travel_date']) > new Date(today)) {
                    tomorrow = new Date(formatDate(new Date(data['travel_date']), 'DD/MM/YYYY'))
                } else {
                    tomorrow = new Date(today)
                    tomorrow.setDate(tomorrow.getDate() + 1)
                }

                if (new Date(data['return_date']) > tomorrow) {
                    returnDate = new Date(formatDate(new Date(data['return_date']), 'DD/MM/YYYY'))
                } else {
                    returnDate = "";
                }
                let airlineCode;
                let airlineName;
                if (data['airlines'].includes('-')) {
                    let airline;
                    airline = data['airlines'].split('-');
                    airlineName= airline[0];
                    airlineCode=airline[1];
                }
                this.regConfig.patchValue({
                    departureCity: data['from_airport_code'],
                    destinationCity: data['to_airport_code'],
                    departureDate: tomorrow,
                    returnDate: data['trip_type'] != 'oneWay' ? returnDate: '',
                    CabinClass: data['class'],
                    tripType: data['trip_type'],
                    traveller: data['traveller'] || 1,
                    PreferredAirline: airlineName ? airlineName : 'All Airline',
                    PreferredAirlineCode:airlineCode ? airlineCode: 'ALL',
                    PlusMinus3Days:data1['PlusMinus3Days'] ? 1 : 0,
                    selectedIndex:data1['selectedIndex'],
                });
                this.setdateRange();
                let tripType = data['trip_type'] == "oneWay" ? "Oneway" : "Roundtrip";
                this.toggleTripType(tripType);
                if(data['trip_type'] == "oneWay") {
                    this.regConfig.get('returnDate').clearValidators();
                }
                else{
                    this.regConfig.get('returnDate').setValidators(Validators.required);
                    this.regConfig.get('returnDate').updateValueAndValidity();

                }
                this.regConfig.markAsUntouched();
            } else {
            }
        })

         this.flightService.navigateToDashboard.subscribe((data) => {
            if (data) {
                    const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                    const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                    const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
                    // Reset it
                    youngDOBArray.clear();
                    childDOBArray.clear();
                    infantDOBArray.clear();
                    this.regConfig.patchValue({
                    departureCity: '',
                    destinationCity: '',
                    departureDate: '',
                    returnDate: ''
                })
                this.regConfig.get('traveller').patchValue ({
                    young: 0,
                    youngDateOfBirth: [],
                    childDateOfBirth: [],
                    infantDateOfBirth: [],
                    childrens: 0,
                    adults: 1,
                    infants: 0
                })
                this.travellerForm.patchValue({
                    young: 0,
                    childrens: 0,
                    adults: 1,
                    infants: 0
                })
            }
        })
         if (this.router.url === '/search/hotel/guests' || this.router.url === '/search/activity/activity-booking' || this.router.url === '/search/transfer/transfers-bookings') {
            const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
            const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
            const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            // Reset it
            youngDOBArray.clear();
            childDOBArray.clear();
            infantDOBArray.clear()
            this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                childrens: 0,
                adults: 1,
                infants: 0
            })
            this.travellerForm.patchValue({
                young: 0,
                childrens: 0,
                adults: 1,
                infants: 0
            })
        }

    }

    openDateRangePicker(): void {
        this.rangePicker.show();
      }

    updateNonStopFlights(checked: boolean) {
        this.NonStopFlights = checked ? 1 : 0; 
      }

    toggleSelectedTripType(tripType) {
        switch (tripType) {
            case 0:
                this.selectedIndex = 0;
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            case 0:
                    this.selectedIndex = 0;
                    break;
            case 2:
                this.selectedIndex = 2;
                this.updateValidation();
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            case 1:
                this.selectedIndex = 1;
                this.regConfig.get('returnDate').clearValidators();
                break;
            case 3:
                this.selectedIndex = 3;
                this.updateValidation();
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            default:
                break;
        }
    }

    updateValidation(){
        this.regConfig.get('departureCity').clearValidators();
        this.regConfig.get('destinationCity').clearValidators();
        this.regConfig.get('departureCity').updateValueAndValidity();
        this.regConfig.get('destinationCity').updateValueAndValidity();
    }
    
    toggleTripType(tripType) {
        switch (tripType) {
            case 0:
                this.selectedIndex = 0;
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            case 0:
                    this.selectedIndex = 0;
                    break;
            case 2:
                this.selectedIndex = 2;
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            case 1:
                this.selectedIndex = 1;
                this.regConfig.get('returnDate').clearValidators();
                break;
            case 3:
                this.selectedIndex = 3;
                this.regConfig.get('returnDate').setValidators(Validators.required);
                break;
            default:
                break;
        }
    }

    onSearchTypeChange(value) {
        sessionStorage.setItem('activeId', value);
        this.activeIdString = sessionStorage.getItem('activeId');
    }

    ngAfterViewInit() {
        this.tabSubscription = this.flightService.changeEmitted$.subscribe(tabvalue => {
            this.validateTabs(tabvalue);
        });
    }


    validateTabs(tabvalue) {
        if (tabvalue == 'flights') {
            this.flight && this.flight.nativeElement.click();
            if (this.router.url === '/dashboard') {
                const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
                const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
                // Reset it
                youngDOBArray.clear();
                childDOBArray.clear();
                infantDOBArray.clear()
                this.regConfig.get('traveller').patchValue ({
                    young: 0,
                    youngDateOfBirth: [],
                    childDateOfBirth: [],
                    infantDateOfBirth: [],
                    childrens: 0,
                    adults: 1,
                    infants: 0
                })
                this.travellerForm.patchValue({
                    young: 0,
                    childrens: 0,
                    adults: 1,
                    infants: 0
                })
            }
            
        }
        else if (tabvalue == 'hotels') {
            this.hotels && this.hotels.nativeElement.click()
        }
        else if (tabvalue == 'insurence') {
            this.insurance && this.insurance.nativeElement.click()
        }else if (tabvalue == 'activity') {
            this.activity && this.activity.nativeElement.click()
        } else if (tabvalue == 'transfer') {
            this.transfer && this.transfer.nativeElement.click()
        }
        else if (tabvalue == 'tour') {
            this.tour && this.tour.nativeElement.click()
        }
    }


    openDate() {
        this.isOpen = true;
        this.Connectivity = false;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.tabSubscription.unsubscribe();
    }

    selectedTrip(i: number): void {
        this.flightService.tripTypeClicked = true;
        this.travellersFadeinn = false;
        this.selectedIndex = i;
        this.toggleTripType(this.selectedIndex)
        this.regConfig.patchValue({ selectedIndex:i });
        this.regConfig.patchValue({ tripType: this.searchTabs[i] });
        sessionStorage.removeItem('multiCitySectors');
        this.showYoungDOB = false;
        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
        this.minReturnDate = new Date();
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();
        this.regConfig.patchValue({
            departureCity: '',
            destinationCity: ''
        })
        this.regConfig.get('traveller').patchValue ({
            young: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            childrens: 0,
            adults: 1,
            infants: 0
        })
        this.travellerForm.patchValue({
            young: 0,
            childrens: 0,
            adults: 1,
            infants: 0
        })
        if (i === 2 || i === 3) {
            this.regConfig.get('departureCity').clearValidators();
            this.regConfig.get('destinationCity').clearValidators();
            this.regConfig.get('returnDate').clearValidators();
            this.regConfig.get('departureCity').updateValueAndValidity();
            this.regConfig.get('destinationCity').updateValueAndValidity();
            this.regConfig.get('returnDate').updateValueAndValidity();
            this.regConfig.patchValue({ PlusMinus3Days: 0 });
            this.NonStopFlights = 0;
        }
        if (i != 2 && i != 3) {
            this.regConfig.get('returnDate').clearValidators();
            if (i == 0) {
                this.regConfig.get('departureCity').setValidators(Validators.required);
                this.regConfig.get('destinationCity').setValidators(Validators.required);
                this.regConfig.get('returnDate').setValidators(Validators.required);

                this.regConfig.get('departureCity').updateValueAndValidity();
                this.regConfig.get('destinationCity').updateValueAndValidity();
                this.regConfig.get('returnDate').updateValueAndValidity();
            }
            if (this.regConfig.controls.departureCity.value == 'test') {
                this.regConfig.patchValue({ departureCity: '' });
            }
            if (this.regConfig.controls.destinationCity.value == 'test') {
                this.regConfig.patchValue({ destinationCity: '' });
            }
            this.regConfig.patchValue({
                departureDate: '',
                returnDate: '',
                cities: [
                    { mDepartureCity: 'DAC', mDestinationCity: 'CGP', mDepartureDate: '2022-02-25T00:00:00' },
                    { mDepartureCity: 'CGP', mDestinationCity: 'CXB', mDepartureDate: '2022-02-25T00:00:00' }
                ]
            });
            this.regConfig.markAsUntouched();
        } else {
            if (this.regConfig.controls.departureCity.value == '') {
                this.regConfig.patchValue({ departureCity: '' });
            }
            if (this.regConfig.controls.destinationCity.value == '') {
                this.regConfig.patchValue({ destinationCity: '' });
            }
            if (this.regConfig.controls.departureDate.value == '') {
                this.regConfig.patchValue({ departureDate: '2022-02-25T00:00:00' });
            }
            if (this.regConfig.controls.returnDate.value == '') {
                this.regConfig.patchValue({ returnDate: '2022-02-25T00:00:00' });
            }
             //Added to clear more than 2 cities addeed under multi-city
             const cities = this.regConfig.get('cities') as FormArray;
             if (cities.value && cities.value.length > 2) {
                 while (cities.value.length > 2) {
                     cities.removeAt(cities.length - 1);
                 }
             }
                this.regConfig.patchValue({
                    cities: [
                        { mDepartureCity: '', mDestinationCity: '', mDepartureDate: '' },
                        { mDepartureCity: '', mDestinationCity: '', mDepartureDate: '' }
                    ]
                });
                this.updateValidation();
            this.regConfig.controls.cities.markAsUntouched();
        }
    }
    get classes() {
        const cssClasses = {};
        cssClasses['bg-info'] = true;
        return cssClasses;
    }

    getSearchedList(event: any, from): void {
        this.fromSec = from;
        if (event.target.id === 'departureCity') {
            this.depart = true;
        } else if (event.target.id === 'destinationCity') {
            this.depart = false;
        }
        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
    
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();

        this.regConfig.get('traveller').patchValue ({
            young: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            childrens: 0,
            adults: 1,
            infants: 0
        })
        this.travellerForm.patchValue({
            young: 0,
            childrens: 0,
            adults: 1,
            infants: 0
        })
        
         if (event && event.target.value) {
            const text = `${event.target.value}`.trim();
            if(text && text.length>=3){
                this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { text })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedList = resp.data;

                    } else {
                        const msg = resp['Message'];
                        this.searchedList=[];
                    }
                    
                });
            }
            else{
                this.searchedList=[];
            }
        }
    }


    getPrefferedAirlineList(event: any): void {
        if (event && event.target.value) {
            const name = `${event.target.value}`;
            this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', { name })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedAirLineList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedAirLineList.length = 0;
                    }
                });
        }
    }


    applyTrendingSearch(ts: any) {
        this.regConfig.patchValue({
            tripType: 'Oneway', /* temp line */
            departureCity: ts.departureCity + '(' + ts.departureCityCode + ')',
            destinationCity: ts.destinationCity + '(' + ts.destinationCityCode + ')',
        })
    }

    submitForm(data: any) {
        this.flightService.flightsCopy.next([]);
        this.flightService.flights.next([]);
        this.callResult.emit(data);
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            departureDate: ['', [Validators.required]],
            returnDate: ['', [Validators.required]],
            tripType: 'Oneway',
            selectedIndex:1,
            traveller: this.fb.group({
                adults: 1,
                childrens: 0,
                infants: 0,
                young: 0,
                childDateOfBirth:this.fb.array([]),
                infantDateOfBirth:this.fb.array([]),
                youngDateOfBirth: this.fb.array([])
            }),
            CabinClass: ['Economy', [Validators.required]],
            PreferredAirline: ['All'],
            PreferredAirlineCode: [''],
            connectivity: ['All', [Validators.required]],
            cities: this.fb.array([this.generateCities('DAC'), this.generateCities('CGP')]),
            NonStopFlights:  ['', ],
            PlusMinus3Days: ['', ],
            sectors: ['']
        });
        if (this.flightService.formFilled) {
           this.setTravellerForm();
        } else if (this.flightService.isDevelopment) {
            this.regConfig.patchValue({
                departureCity: 'Bangalore(BLR)',
                destinationCity: 'Chennai(MAA)',
                departureDate: new Date(),
                traveller: this.flightService.traveller
            });
            this.travellerForm.patchValue(this.flightService.traveller);
        }
    }

    setTravellerForm(){
        // this.setTravellerChild();
        // this.setTravellerInfant();
        // this.regConfig.patchValue(this.flightService.formFilled);
        // this.travellerForm.patchValue(this.flightService.formFilled.traveller);
        this.regConfig.patchValue(this.flightService.formFilled);
        this.travellerForm.patchValue(this.flightService.formFilled.traveller);
        this.travellerForm.patchValue({
            CabinClass: this.flightService.formFilled.CabinClass,
            PreferredAirline: this.flightService.formFilled.PreferredAirline
        })
    }

    setTravellerChild() {
        this.flightService.formFilled.traveller.childDateOfBirth = this.flightService.formFilled.traveller.childDateOfBirth.map(child => {
            const date = new Date(child.childDateOfBirth);
            return { childDateOfBirth: date };
        });
        this.patchChildDateOfBirth(this.flightService.formFilled.traveller.childDateOfBirth);
        this.patchRegChildDateOfBirth(this.flightService.formFilled.traveller.childDateOfBirth);
    }


      setTravellerYouth() {
        this.flightService.formFilled.traveller.youngDateOfBirth = this.flightService.formFilled.traveller.youngDateOfBirth.map(youth => {
            const date = new Date(youth.youngDateOfBirth);
            return { youngDateOfBirth: date };
        });
        this.patchYoungDateOfBirth(this.flightService.formFilled.traveller.youngDateOfBirth);
        this.patchRegYouthDateOfBirth(this.flightService.formFilled.traveller.youngDateOfBirth);
    }


    setTravellerInfant() {
        this.flightService.formFilled.traveller.infantDateOfBirth = this.flightService.formFilled.traveller.infantDateOfBirth.map(infant => {
            const date = new Date(infant.infantDateOfBirth);
            return { infantDateOfBirth: date };
        });
        this.patchInfantDateOfBirth(this.flightService.formFilled.traveller.infantDateOfBirth);
        this.patchRegInfantDateOfBirth(this.flightService.formFilled.traveller.infantDateOfBirth);
    }
    
    createTravellerForm() {
        this.travellerForm = this.fb.group({
            adults: 1,
            childrens: 0,
            infants: 0,
            young: 0,
            childDateOfBirth:this.fb.array([]),
            infantDateOfBirth:this.fb.array([]),
            youngDateOfBirth: this.fb.array([]),
        });
    }

    generateCities(d: string) {
        let dDate = new Date(formatDate(new Date(), 'DD/MM/YYYY'));
        if(this.regConfig && (this.regConfig.controls.tripType.value==='Multi-city' || this.regConfig.controls.tripType.value==='Open-Jaw')){
            return this.fb.group({
                mDepartureCity: [d, [Validators.required]],
                mDestinationCity: [d, [Validators.required]],
                mDepartureDate: ['', [Validators.required]]
            });
        }
        else{
            return this.fb.group({
                mDepartureCity: [d, [Validators.required]],
                mDestinationCity: [d, [Validators.required]],
                mDepartureDate: [dDate, [Validators.required]]
            });
        }
    }

    onSubmitTraveller() {
        this.travellersFadeinn = false;
    }

    onUpdateTraveller(travellerType: string, operation: string) {
        const adults = this.travellerForm.get('adults').value;
        const childrens = this.travellerForm.get('childrens').value;
        const infants = this.travellerForm.get('infants').value;
        const young = this.travellerForm.get('young').value;
        const control = this.travellerForm.controls[travellerType];
        const dateOfBirth = this.travellerForm.controls['childDateOfBirth'];
        const infantDOB = this.travellerForm.controls['infantDateOfBirth'];
        const youngDOB = this.travellerForm.controls['youngDateOfBirth'];
        let result = 0;
        let travellerCount = 0;
        if (travellerType == 'adults' || travellerType == 'childrens' || travellerType === 'young') {
            travellerCount = adults*1 + childrens*1 + young*1;
        } else {
            travellerCount = infants;
        }


        if (travellerCount > 8 && operation === 'plus') {
            this.travellerCountError = true;
            this.infantError = false;
            return false;
        }
        if ((adults <= infants && operation === 'plus' && travellerType == 'infants') || (adults <= infants && operation === 'minus' && travellerType == 'adults')) {
            this.travellerCountError = true;
            this.infantError = true;
            return false;
        }
        if (operation === 'minus') {
            result = control.value < 1 ? control.value : control.value - 1;
            if (travellerType == 'young' && travellerCount > 1) { this.removeYoungDOB(youngDOB); }
            if (travellerType == 'childrens' && travellerCount > 1) { this.removechildDateOfBirth(dateOfBirth); }
            if (travellerType == 'infants') { this.removeInfantDateOfBirth(infantDOB); }
        } else {
            result = control.value + 1;
            if (travellerType == 'young' && travellerCount <= 8) {  this.addYoungDateOfBirth(youngDOB);}
            if (travellerType == 'childrens' && travellerCount<= 8) {  this.addChildDateOfBirth(dateOfBirth);}
            if (travellerType == 'infants' ) {  this.addInfantDateOfBirth(infantDOB);}
        }
        if (operation === 'minus' && travellerType == 'adults' && result < 1) {
            return false;
        }
        
        this.patchChildDateOfBirth(dateOfBirth);
        this.patchInfantDateOfBirth(infantDOB);
        this.patchYoungDateOfBirth(youngDOB);
        this.travellerCountError = false;
        control.setValue(result);
        this.regConfig.patchValue({
            traveller: this.travellerForm.value
        });

    }
    removeYoungDOB(youngDOB) {
        let length = youngDOB.controls.length-1;
        youngDOB.removeAt(length);
    }

    patchChildDateOfBirth(dateOfBirth) {
        const regTraveller = this.regConfig.controls['traveller'] as FormArray;
        let childDateOfBirth = regTraveller.controls['childDateOfBirth'] as FormArray;
        childDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            childDateOfBirth.push(this.setChildDateOfBirth());
        }
    }

    patchYoungDateOfBirth(dateOfBirth) {
        const regTraveller = this.regConfig.controls['traveller'] as FormArray;
        let youngDateOfBirth = regTraveller.controls['youngDateOfBirth'] as FormArray;
        youngDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            youngDateOfBirth.push(this.setYoungDOB());
        }
    }

    patchRegChildDateOfBirth(dateOfBirth) {
        const childDateOfBirth = this.travellerForm.controls['childDateOfBirth'] as FormArray;
        childDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            childDateOfBirth.push(this.setChildDateOfBirth());
        }
    }

     patchRegYouthDateOfBirth(dateOfBirth) {
        const youthDateofBirth = this.travellerForm.controls['youngDateOfBirth'] as FormArray;
        youthDateofBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            youthDateofBirth.push(this.setYoungDOB());
        }
    }

    patchInfantDateOfBirth(dateOfBirth) {
        const regTraveller = this.regConfig.controls['traveller'] as FormArray;
        let infantDateOfBirth = regTraveller.controls['infantDateOfBirth'] as FormArray;
        infantDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            infantDateOfBirth.push(this.setInfantDateOfBirth());
        }
    }

    patchRegInfantDateOfBirth(dateOfBirth) {
        const infantDateOfBirth = this.travellerForm.controls['infantDateOfBirth'] as FormArray;
        infantDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            infantDateOfBirth.push(this.setInfantDateOfBirth());
        }
    }

    addChildDateOfBirth(childDateOfBirth){
        childDateOfBirth.push(this.setChildDateOfBirth());
    }

    addYoungDateOfBirth(youngDOB) {
        youngDOB.push(this.setYoungDOB())
    }

    addInfantDateOfBirth(infantDateOfBirth){
        infantDateOfBirth.push(this.setInfantDateOfBirth());
    }

    setChildDateOfBirth(){
        return this.fb.group({
            childDateOfBirth: new Date(formatDate(new Date(this.maxDateChild), 'DD/MM/YYYY'))
        });  
      }

    setYoungDOB() {
        return this.fb.group({
            youngDateOfBirth: new Date(formatDate(new Date(this.maxDateYoung), 'DD/MM/YYYY'))
        })
    }

      setInfantDateOfBirth(){
        return this.fb.group({
            infantDateOfBirth:new Date(formatDate(new Date(this.maxDateInfant), 'DD/MM/YYYY'))
        });  
      }

    removechildDateOfBirth(childDateOfBirth){
        let length=childDateOfBirth.controls.length-1;
        childDateOfBirth.removeAt(length);
    }

    removeInfantDateOfBirth(infantDateOfBirth){
        let length=infantDateOfBirth.controls.length-1;
        infantDateOfBirth.removeAt(length);
    }

    onChangeCabin(v: any) {
        this.regConfig.patchValue({
            CabinClass: v
        });
        this.fadeinn = false;
    }

    setSelectedDate(event, index) {
        const childAges = this.regConfig.get('traveller.childDateOfBirth') as FormArray;
        childAges.at(index).patchValue({ childDateOfBirth: new Date(formatDate(new Date(event), 'DD/MM/YYYY'))});
    }

    setSelectedYoungDOB(event, index) {
        const youngAges = this.regConfig.get('traveller.youngDateOfBirth') as FormArray;
        youngAges.at(index).patchValue({ youngDateOfBirth: new Date(formatDate(new Date(event), 'DD/MM/YYYY'))});
    }

    setInfantSelectedDate(event, index) {
        const infantAges = this.regConfig.get('traveller.infantDateOfBirth') as FormArray;
        infantAges.at(index).patchValue({ infantDateOfBirth: new Date(formatDate(new Date(event), 'DD/MM/YYYY'))});
    }

    onChangeConnectivity(v: any) {
        this.regConfig.patchValue({
            connectivity: v
        });
        this.Connectivity = false;
    }
    onChangeAirline(i: any) {
        this.regConfig.patchValue({
            PreferredAirline: this.airlines[i]['code']
        });
        this.airline = false;
        this.airlineName = this.airlines[i]['name'];
    }

    selectionChanged(airLine: any) {
        this.regConfig.patchValue({
            PreferredAirlineCode: airLine.value.code,
            PreferredAirline: airLine.value.name
        });
         // console.log(airLine);
        this.airline = false;
        this.airlineName = airLine.value.name;
        this.airlineCode = airLine.value.code;
    }

    changeFn(val) {
        console.log("Dropdown selection:", val);
    }

    onDepart(event) {
        this.selectedDate = event;
        this.minReturnDate = new Date(event);
        if (event && this.selectedIndex == 0) {
            setTimeout(() => {
               // this.returnDate.nativeElement.click();
                this.setMinDate = event
            }, 100)

        } else if (event && this.selectedIndex == 1) {
            setTimeout(() => {
                this.isreturnDate = false;
                this.isOpen = false;
            }, 100)
            this.travellersFadeinn = true;
        }
       
        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
        // Reset it
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();

         this.regConfig.get('traveller').patchValue ({
            young: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            childrens: 0,
            adults: 1,
            infants: 0
        })

        this.travellerForm.patchValue({
            young: 0,
            childrens: 0,
            adults: 1,
            infants: 0,
             youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
        })

         const selectedDateStr = event;
        const selectedDate = new Date(selectedDateStr); // Assuming it's ISO or Date object
      
        // const compareDate = this.addYears/ToDateFrom(selectedDate, -2, 0);

        if (!this.showYoungDOB) {
            this.minDateChild = this.addYearsToDate(selectedDate,-12,0, 1);
        } else {
            this.minDateChild = this.addYearsToDate(selectedDate,-12,0, 1);
        }
        this.maxDateChild = this.addYearsToDate(selectedDate,-2,0, -1);
        this.maxDateYoung = this.addYearsToDate(selectedDate,-12,0, -1);
        this.minDateYoung = this.addYearsToDate(selectedDate,-16,0, 1);
        this.maxDateInfant = this.addYearsToDate(selectedDate,0,0, -1);
        this.minDateInfant = this.addYearsToDate(selectedDate, -2, 0, 1);
            
    }

    closeTravellers() {
        this.travellersFadeinn = false;
    }
    closeConnectivity() {
        this.Connectivity = false;
    }
    closeClass() {
        this.fadeinn = false;
    }
    closeAirline() {
        this.airline = false;
        this.searchedAirLineList.length = 0;
    }
    onReturn(event) {
        if (event && this.selectedIndex == 0) {
            setTimeout(() => {
                this.travellersFadeinn = true;
            }, 100)
        }

        this.regConfig.get('traveller').patchValue ({
            young: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            childrens: 0,
            adults: 1,
            infants: 0
        })

        this.travellerForm.patchValue({
            young: 0,
            childrens: 0,
            adults: 1,
            infants: 0
        })

        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
        // Reset it
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();

        const selectedDateStr = event;
        const selectedDate = new Date(selectedDateStr); 
        if (!this.showYoungDOB) {
            this.minDateChild = this.addYearsToDate(selectedDate,-12, 0, 1);
        } else {
            this.minDateChild = this.addYearsToDate(selectedDate,-12, 0, 1);
        }
        this.maxDateChild = this.addYearsToDate(selectedDate,-2, 0, -1);
        this.maxDateYoung = this.addYearsToDate(selectedDate,-12, 0, -1);
        this.minDateYoung = this.addYearsToDate(selectedDate,-16, 0, 1);
        this.maxDateInfant = this.addYearsToDate(selectedDate,0,0, -1);
        this.minDateInfant = this.addYearsToDate(selectedDate, -2, 0, 1);
            
    }

    getCity(event: any): void {
        let city = `${event.AirportCity}, ${event.CountryName}, ${event.AirportName}(${event.AirportCode})`;
        if (city) {

            if (event.inputFor === 'depart') {
                this.flightService.originCountry = event;
                // this.regConfig.patchValue({ departureCity: city });
                this.regConfig.patchValue({ departureCity: event.AirportCity + '-' + event.AirportCode });
                this.destinationCity.nativeElement.focus();
            } else {
                this.flightService.destCountry = event;
                // this.regConfig.patchValue({ destinationCity: city });
                this.regConfig.patchValue({ destinationCity: event.AirportCity + '-' + event.AirportCode });
                this.departureDate.nativeElement.click();

            }
            this.searchedList.length = 0;

            const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
            const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
            const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            // Reset it
            youngDOBArray.clear();
            childDOBArray.clear();
            infantDOBArray.clear();

            this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                childrens: 0,
                adults: 1,
                infants: 0
            })

            this.travellerForm.patchValue({
                adults: 1,
                young: 0,
                childrens: 0,
                 youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                infants: 0
            })
        if (this.fromSec === 'from') {
            const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
              ];
            let showYoung: boolean = false;
            const cityObj = event
            localStorage.setItem('selectedCity', JSON.stringify(cityObj));

        const getLocalStorage = JSON.parse(localStorage.getItem('selectedCity'));

        const newCodes = Array.isArray(getLocalStorage.AirportCode)
            ? getLocalStorage.AirportCode
            : [getLocalStorage.AirportCode];
        const updatedCodes = Array.from(new Set([ ...newCodes]));
            sessionStorage.setItem('selectedSectors', JSON.stringify(updatedCodes));
             const seletedSectorCode = JSON.parse(sessionStorage.getItem('selectedSectors'));
            showYoung = [...seletedSectorCode].some(code => ukAirports.includes(code));
            if (showYoung) {
                this.showYoungDOB = true;   
            } else {
                this.showYoungDOB = false;
            }
        }        
        }
    }

    getPreferredAirLineList(event: any): void {
        let city = `${event.name}, (${event.code})`;
        if (city) {
            // console.log(event)
            this.flightService.destCountry = event;
            // this.regConfig.patchValue({ destinationCity: city });
            this.regConfig.patchValue({
                PreferredAirline: event.name,
                PreferredAirlineCode: event.code
            });
            this.prefferedAirline.nativeElement.click();
            this.searchedAirLineList.length = 0;
        }
    }

    
    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
            //console.log(error);
        }
    }

    get shouldPreferedAirLineHide(): boolean {
        try {
            return !!this.searchedAirLineList.length ? true : false;
        } catch (error) {
            //console.log(error);
        }
    }

    get f() {
        return this.regConfig.controls;
    }

    shouldiHideDynamic(index): boolean {
        if (index === 1)
            return true;
        else
            return false;
    }

    shouldRemoveCity(index): boolean {
        if (index === 0 || index === 1)
            return false;
        else
            return true;
    }

    setCurrentInput(t) {
        this.dropDownCity = t;
    }

    isCurrentInput(t) {
        return this.dropDownCity == t;
    }

    exchangeCityFn() {
        this.cityExchanged = !this.cityExchanged;
        const destinationCity = JSON.parse(JSON.stringify(this.regConfig.controls.destinationCity.value));
        const departureCity = JSON.parse(JSON.stringify(this.regConfig.controls.departureCity.value));
        this.regConfig.patchValue({ departureCity: destinationCity });
        this.regConfig.patchValue({ destinationCity: departureCity });

        let depCity = this.regConfig.value.departureCity;
        const ukAirports = [
            'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
            'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
          ];
        let showYoung: boolean = false;
        const seletedSectorCode = [depCity.split('-')[1]]
        showYoung = [...seletedSectorCode].some(code => ukAirports.includes(code));
        if (showYoung) {
            this.showYoungDOB = true;
            const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
            const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
            const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            // Reset it
            youngDOBArray.clear();
            childDOBArray.clear();
            infantDOBArray.clear();

            this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                childrens: 0,
                adults: 1,
                infants: 0
            })

            this.travellerForm.patchValue({
                adults: 1,
                young: 0,
                childrens: 0,
                 youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                infants: 0
            })
        } else {
            this.showYoungDOB = false;
              const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
              youngDOBArray.clear();
             this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: []
            })

            this.travellerForm.patchValue({
                young: 0,
                 youngDateOfBirth: []
            })

        }

    }

    getDynamicCity(event: any, indexNum): void {
        let city = `${event.AirportCity}(${event.AirportCode})`;
        if (city) {
            const mDesCtArr = this.mDestinationCity.toArray();
            const mDepDtArr = this.mDepartureDate.toArray();
            const inputFor = event.inputFor.split('_');

            if (inputFor[0] == 'mDepartureCity') {
                mDesCtArr[inputFor[1]].nativeElement.focus();
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDepartureCity: event.AirportCity + '-' + event.AirportCode });
            } else {
                mDepDtArr[inputFor[1]].nativeElement.click();
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDestinationCity:  event.AirportCity + '-' +event.AirportCode });
                if (this.selectedIndex != 3) {
                    if (mDepDtArr[+inputFor[1] + 1]) {
                        this.regConfig.controls['cities']['controls'][+inputFor[1] + 1].patchValue({ mDepartureCity: event.AirportCity + '-' + event.AirportCode });
                        let ukPort = [event.AirportCode];
                        let showYoung: boolean = false;
                        const ukAirports = [
                            'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                            'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
                          ];
                          showYoung = [...ukPort].some(code => ukAirports.includes(code));
                          if (showYoung) {
                              this.showYoungDOB = true;   
                              this.fromSec = 'from';
                          } else {
                            this.fromSec = '';
                              this.showYoungDOB = false;
                              const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
                              youngDOBArray.clear();
                              this.regConfig.get('traveller').patchValue ({
                                young: 0,
                                youngDateOfBirth: []
                            })
                            this.travellerForm.patchValue({
                                young: 0,
                                youngDateOfBirth: []
                            })
                          }
                    }
            }
            }
            this.searchedList.length = 0;
            const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
            const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
            const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
            // Reset it
            youngDOBArray.clear();
            childDOBArray.clear();
            infantDOBArray.clear();

            this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                childrens: 0,
                adults: 1,
                infants: 0
            })

            this.travellerForm.patchValue({
                adults: 1,
                young: 0,
                childrens: 0,
                 youngDateOfBirth: [],
                childDateOfBirth: [],
                infantDateOfBirth: [],
                infants: 0
            })

            if (this.fromSec === 'from') {
            const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
              ];
            let showYoung: boolean = false;
            const cityObj = event
            localStorage.setItem('selectedCity', JSON.stringify(cityObj));

            const getLocalStorage = JSON.parse(localStorage.getItem('selectedCity'));
            const existingCodes = JSON.parse(sessionStorage.getItem('multiCitySectors')) || [];

            if (existingCodes.length > 0 && indexNum * 1 === inputFor[1] * 1) {
                existingCodes[indexNum] = event.AirportCode;
            }
            const newCodes = Array.isArray(getLocalStorage.AirportCode)
                ? getLocalStorage.AirportCode
                : [getLocalStorage.AirportCode];
            const updatedCodes = Array.from(new Set([...existingCodes, ...newCodes]));
            //   if (existingCodes.length === 0 || !existingCodes) {
                sessionStorage.setItem('multiCitySectors', JSON.stringify(updatedCodes));
            //   }

             const seletedSectorCode = JSON.parse(sessionStorage.getItem('multiCitySectors'));
            showYoung = [...seletedSectorCode].some(code => ukAirports.includes(code));
            if (showYoung) {
                this.showYoungDOB = true;   
            } else {
                this.showYoungDOB = false;
            }
        }
        const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
              ];
        let showYoung: boolean = false;
        const seletedSectorCode = JSON.parse(sessionStorage.getItem('multiCitySectors'));
        showYoung = [...seletedSectorCode].some(code => ukAirports.includes(code));
        if (showYoung) {
                this.showYoungDOB = true;   
        } else {
            this.showYoungDOB = false;
        }
        }
    }

    addCity(): void {
        const cities = this.regConfig.get('cities') as FormArray;
        if (cities.length < 5) {
            cities.push(this.generateCities(''));
        }
        let showYoung: boolean = false;
        const getCitiesList = cities.value.map(data => data.mDepartureCity.split('-')[1]);
        sessionStorage.setItem('multiCitySectors', JSON.stringify(getCitiesList));
        const ukAirports = [
            'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
            'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
          ];
          showYoung = [...getCitiesList].some(code => ukAirports.includes(code));
          if (showYoung) {
              this.showYoungDOB = true;
          } else {
              this.showYoungDOB = false;
              const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
              youngDOBArray.clear();
              this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: []
            })
            this.travellerForm.patchValue({
                young: 0,
                youngDateOfBirth: []
            })
          }
    }

    removeCity(i: number): void {
        const cities = this.regConfig.get('cities') as FormArray;
        if (cities.length > 1) {
            cities.removeAt(i);
            let showYoung: boolean = false;
        const getCitiesList = cities.value.map(data => data.mDepartureCity.split('-')[1]);
        sessionStorage.setItem('multiCitySectors', JSON.stringify(getCitiesList));
        const ukAirports = [
            'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
            'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
          ];
          showYoung = [...getCitiesList].some(code => ukAirports.includes(code));
          if (showYoung) {
              this.showYoungDOB = true;   
          } else {
              this.showYoungDOB = false;
              const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
              youngDOBArray.clear();
              this.regConfig.get('traveller').patchValue ({
                young: 0,
                youngDateOfBirth: []
            })
            this.travellerForm.patchValue({
                young: 0,
                youngDateOfBirth: []
            })
          }
        }
    }

    mUpdateNextDepDt(i: number) {
        if (this.minDateArr[i + 1]) {
            this.minDateArr[i + 1] = new Date(this.regConfig.controls['cities']['controls'][i]['controls']['mDepartureDate'].value);
        }

        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
        // Reset it
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();

        this.regConfig.get('traveller').patchValue ({
            young: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            childrens: 0,
            adults: 1,
            infants: 0
        })

        this.travellerForm.patchValue({
            adults: 1,
            young: 0,
            childrens: 0,
            youngDateOfBirth: [],
            childDateOfBirth: [],
            infantDateOfBirth: [],
            infants: 0
        })

        if (this.fromSec === 'from') {
            const ukAirports = [
                'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'EDI', 'BHX', 'GLA', 'BRS',
                'NCL', 'LPL', 'EMA', 'BHD', 'ABZ', 'BFS', 'CWL', 'INV', 'LON'
            ];
            let showYoung: boolean = false;
             const seletedSectorCode = JSON.parse(sessionStorage.getItem('multiCitySectors'));
            showYoung = [...seletedSectorCode].some(code => ukAirports.includes(code));
            if (showYoung) {
                this.showYoungDOB = true;
            } else {
                this.showYoungDOB = false;
            }
        }

        const selectedDateStr = this.regConfig.controls['cities']['controls'][i]['controls']['mDepartureDate'].value;
        const selectedDate = new Date(selectedDateStr); 
        if (!this.showYoungDOB) {
            this.minDateChild = this.addYearsToDate(selectedDate,-12, 0, 1);
        } else {
            this.minDateChild = this.addYearsToDate(selectedDate,-12, 0, 1);
        }
        this.maxDateChild = this.addYearsToDate(selectedDate,-2, 0, -1);
        this.maxDateYoung = this.addYearsToDate(selectedDate,-12, 0, -1);
        this.minDateYoung = this.addYearsToDate(selectedDate,-16, 0, 1);
        this.maxDateInfant = this.addYearsToDate(selectedDate,0,0, -1);
        this.minDateInfant = this.addYearsToDate(selectedDate, -2, 0, 1);
        const mDepCtArr = this.mDestinationCity.toArray();
        // this.returnDate.nativeElement.click();
        if (mDepCtArr[i + 1]) {
            mDepCtArr[i + 1].nativeElement.focus();
        }
    }

    updateUI() {
        const currentUrl = this.router.url;
        if (currentUrl.includes('flight/result') || currentUrl.includes('flight/booking')) {
            this.isResultScreen = true;
            this.searchTitle = 'New Search'
        } else {
            this.isResultScreen = false;
            this.searchTitle = 'Search'
        }
    }

    onSubmit(): void {
        this.flightService.flights.next([]);
        this.flightService.navigateToDashboard.next(false);
        // this.regConfig.patchValue({
        //     CabinClass: this.selectedOption
        // })
        if (this.regConfig.invalid) {
            return;
        }
        if (this.selectedIndex !== 2 && this.selectedIndex !== 3) {
            if(this.regConfig.controls.destinationCity.value==this.regConfig.controls.departureCity.value  ){
                this.swalService.alert.oops('From and To city can not be the same. Please select different city!');
                return;
            }
        }
        if (this.regConfig.value.PreferredAirlineCode === "ALL") {
            this.regConfig.controls.PreferredAirlineCode.setValue('')
        }
        this.globals.toggleSidebar = true;
        this.submitSessionFlightSearchKeyCheck = true;
        this.flightService.formFilled = {}
        this.flightService.tripTypeClicked = false;
        if (this.selectedIndex == 0) {
            this.regConfig.controls.tripType.setValue('Roundtrip')
        }
        else if (this.selectedIndex == 1) {
            this.regConfig.controls.tripType.setValue('Oneway')
        } else if (this.selectedIndex == 2) {
            this.regConfig.controls.tripType.setValue('Multi-city');
        } else if (this.selectedIndex == 3) {
            this.regConfig.controls.tripType.setValue('Open-Jaw');
        }
        this.flightService.formFilled = this.regConfig.value;
        const flightSearchReq = JSON.parse(sessionStorage.getItem('flightSearchData'));
        if ( flightSearchReq && (flightSearchReq.traveller.childrens || flightSearchReq.traveller.young || flightSearchReq.traveller.infants)) {

            if (this.regConfig.value.traveller.youngDateOfBirth.length > 0) {
                flightSearchReq.traveller.youngDateOfBirth.push(this.regConfig.value.traveller.youngDateOfBirth);
            } else {
                flightSearchReq.traveller.youngDateOfBirth = [];
            }

            if (this.regConfig.value.traveller.childDateOfBirth.length > 0) {
                flightSearchReq.traveller.childDateOfBirth.push(this.regConfig.value.traveller.childDateOfBirth);
            } else {
                flightSearchReq.traveller.childDateOfBirth = [];
            }


            if (this.regConfig.value.traveller.infantDateOfBirth.length > 0) {
                flightSearchReq.traveller.infantDateOfBirth.push(this.regConfig.value.traveller.infantDateOfBirth);
            } else {
                flightSearchReq.traveller.infantDateOfBirth = [];
            }

            // this.regConfig.value.traveller.infantDateOfBirth = flightSearchReq.traveller.infantDateOfBirth.length > 0 ? flightSearchReq.traveller.infantDateOfBirth : [];
            // this.regConfig.value.traveller.childDateOfBirth = flightSearchReq.traveller.childDateOfBirth.length > 0 ? flightSearchReq.traveller.childDateOfBirth : [];
;
        }
        sessionStorage.setItem('flightSearchData', JSON.stringify(this.regConfig.value));
        sessionStorage.setItem('submitSessionFlightSearchKeyCheck', 'true');
        const getSectors = JSON.parse(sessionStorage.getItem('flightSearchData'));
        let sectors:any[] = [];
        let depSector = getSectors.departureCity;
        let desSector = getSectors.destinationCity;
        sectors.push(depSector.split('-')[1]);
        sectors.push(desSector.split('-')[1]);
        
        this.regConfig.controls.sectors.setValue(sectors)
        // console.log(this.regConfig.value)
        setTimeout(() => {
            this.isreturnDate = false;
            this.isOpen = false;
            this.travellersFadeinn = false;
        }, 100)
        // console.log(this.router.url)
        if (this.router.url == "/dashboard" || this.router.url == "/search/hotel/guests" || this.router.url == "/search/activity/activity-booking" || this.router.url == "/search/transfer/transfers-bookings" || this.router.url == "/cart/bookings") {
            this.flightService.flightsCopy.next([]);//Added to clear the previously selected data
            this.flightService.flights.next([]); //Added to clear the previously selected data
            this.router.navigate(
                [
                    "search/flight/result",
                ] /*, { queryParams: { ...this.regConfig.value } }*/
            );
        } else {
            this.flightService.isCollapsed.next(true);
            const pattern = /\(([^)]+)\)/;
            let Segments = [];
            let JourneyType = "OneWay";
            if (this.selectedIndex == 2 || this.selectedIndex == 3) {
                JourneyType = "multicity";
                this.regConfig.controls.cities.value.forEach((e) => {
                    const Origin = e.mDepartureCity;
                    const Destination = e.mDestinationCity;
                  const DepartureDate = formatDate(e.mDepartureDate, "");
                    Segments.push({
                        Origin: Origin,
                        Destination:
                            Destination,
                       DepartureDate: DepartureDate + "T00:00:00",
                        // CabinClassReturn: this.regConfig.controls.CabinClass.value,
                        // CabinClassOnward: this.regConfig.controls.CabinClass.value
                        CabinClass: this.regConfig.controls.CabinClass.value
                    });
                });
            } else {
                // const Origin = this.regConfig.controls.departureCity.value.match(pattern)
                // const Destination = this.regConfig.controls.destinationCity.value.match(pattern)
                const Origin = this.regConfig.value.departureCity
                const Destination = this.regConfig.value.destinationCity
                Segments.push({
                    // Origin: Origin && Origin[1] ? Origin[1] : Origin,
                    // Destination: Destination && Destination[1] ? Destination[1] : Destination,
                    Origin: Origin,
                    Destination: Destination,
                    CabinClassReturn: this.regConfig.controls.CabinClass.value,
                    CabinClassOnward: this.regConfig.controls.CabinClass.value
                });
                if (this.selectedIndex == 1) {
                    const dt = this.regConfig.controls.departureDate.value;
                    const DepartureDate = formatDate(dt, "");
                    Segments[0]["DepartureDate"] = DepartureDate + "T00:00:00";
                    Segments[0]["CabinClass"] = this.regConfig.controls.CabinClass.value;//added for one way
                } else {
                    JourneyType = "Return";
                    const dt = this.regConfig.controls.departureDate.value;
                    const rd = this.regConfig.controls.returnDate.value
                    const DepartureDate = formatDate(dt, "");
                    const ReturnDate = formatDate(rd, "");
                    Segments[0]["DepartureDate"] = DepartureDate + "T00:00:00";
                    Segments[0]["ReturnDate"] = ReturnDate + "T00:00:00";
                }
            }
            // console.log(this.regConfig.get('traveller.adults').value,this.regConfig.get('traveller.childrens').value, this.regConfig.get('traveller.infants').value);
            const formData = {
                AdultCount: JSON.stringify(this.regConfig.get('traveller.adults').value ? this.regConfig.get('traveller.adults').value : 1),
                ChildCount: JSON.stringify(this.regConfig.get('traveller.childrens').value ? this.regConfig.get('traveller.childrens').value : 0),
                YouthCount: JSON.stringify(this.regConfig.get('traveller.young').value ? this.regConfig.get('traveller.young').value : 0),
                InfantCount: JSON.stringify(this.regConfig.get('traveller.infants').value ? this.regConfig.get('traveller.infants').value : 0),
                PreferredAirlines: (this.regConfig.get('PreferredAirline').value && this.regConfig.get('PreferredAirline').value != 'all') && this.regConfig.get('PreferredAirlineCode').value ? [this.regConfig.get('PreferredAirlineCode').value] : [],
                PreferredAirlineName: this.regConfig.get('PreferredAirline').value ? this.regConfig.get('PreferredAirline').value : 'All',
                JourneyType,
                Segments,
                NonStopFlights: this.NonStopFlights,
                childDOB:this.regConfig.get('traveller').value.childDateOfBirth,
                infantDOB: this.regConfig.get('traveller').value.infantDateOfBirth,
                youthDOB: this.regConfig.get('traveller').value.youngDateOfBirth,
                PlusMinus3Days:  this.regConfig.get('PlusMinus3Days').value,
                selectedIndex:  this.regConfig.get('selectedIndex').value,
            };
            this.submitForm(formData);
        }
    }

    ThreeDaysFlights(event: any) {
        const isChecked = event.target.checked;
        this.regConfig.patchValue({ PlusMinus3Days: isChecked ? 1 : 0 });
      }

    getControl(): FormArray {
        return this.travellerForm.controls['childDateOfBirth'] as FormArray
    }

    getControlYoung(): FormArray {
        return this.travellerForm.controls['youngDateOfBirth'] as FormArray
    }

    getInfantControl(): FormArray {
        return this.travellerForm.controls['infantDateOfBirth'] as FormArray
    }

    setMaxMinDate() {
        
        // this.maxDateInfant = this.addYearsToDate(new Date(),0,0, 0);
        
        // // Set minDateInfant to one day after maxDateChild
        // this.minDateInfant = this.addYearsToDate(this.maxDateChild, 0, 0, 0);
    }
    
    addYearsToDate(baseDate: Date, y: number, m: number, d: number): Date {
        return new Date(
            baseDate.getFullYear() + y,
            baseDate.getMonth() + m,
            baseDate.getDate() + d
        );
}
    
    searchFormCheck(){
        let fromCity='',toCity='';
        fromCity=this.regConfig.get('departureCity').value;
        fromCity=fromCity.split('-')[1] 
        if(fromCity && fromCity.length==3){
            this.fromCityBool=true;
        }else{
            this.fromCityBool=false;
        }
        toCity=this.regConfig.get('destinationCity').value;
        if(toCity && toCity.length==3){
            this.toCityBool=true;
        }else{
            this.toCityBool=false;
        }
     
    }
    
    enableSearch(){
        // this.searchFormCheck();
        // return !(this.fromCityBool && this.toCityBool)
        return true;
    }

    onRangeChange(value: Date[]): void {
        this.dateRange = value;
        this.regConfig.patchValue({
            departureDate:this.dateRange[0],
            returnDate: this.dateRange[1]
        });
        
      }

      setAutoFlightData() {
        const autoSearchData = JSON.parse(sessionStorage.getItem('autoSearchData'));
        console.log("autoSearchData", autoSearchData);
    
        if (autoSearchData && autoSearchData.hotelInfo && autoSearchData.hotelInfo[0]) {
            const today = new Date();
            const check_in = new Date(autoSearchData['date']);
            const check_out = new Date(check_in);
            check_out.setDate(check_in.getDate() + 1);
    
            const validCheckIn = check_in >= today ? check_in : today;
            const validCheckOut = check_out > validCheckIn ? check_out : new Date(validCheckIn.setDate(validCheckIn.getDate() + 1));
    
        
            const city = {
                cityId: autoSearchData.flightInfo[0]['AirportCode'],
                cityName: autoSearchData.flightInfo[0]['AirportCity'],
                countryCode: autoSearchData.flightInfo[0]['CountryCode'],
                status: true,
                source: "",
                checkin: validCheckIn,
            };
    
            this.city = city;
    
            // Patch values into the form
            if (autoSearchData.flightInfo.length > 0) {
                const flightInfo = autoSearchData.flightInfo[0];
                const airportCity = flightInfo.AirportCity || 'Unknown City';
                const airportCode = flightInfo.AirportCode || 'Unknown Code';
            
                // Combine AirportCity and AirportCode
                const departureCity = `${airportCity}-${airportCode}`;
            
                // Patch the form value
                this.regConfig.patchValue({
                    departureCity: departureCity,
                    departureDate: validCheckIn,
                    returnDate: validCheckOut,
                });
            } else {
                console.error('Flight info is empty or undefined.');
            
                // Patch fallback values
                this.regConfig.patchValue({
                    departureCity: 'Unknown City (Unknown Code)',
                    departureDate: validCheckIn,
                    returnDate: validCheckOut,
                });

                
            }
    
            this.setdateRange();
        } else {
            console.warn("AutoSearchData is missing or incomplete.");
        }
    }
    
    
      setdateRange(){
        const DepDate = this.regConfig.get('departureDate').value;
        const RetDate = this.regConfig.get('returnDate').value;
        let value=[];
        // Push only if the value is not null or undefined
        if (DepDate) {
            value.push(DepDate);
        }
        if (RetDate) {
            value.push(RetDate);
        }
        this.dateRange=value;
      }

      clearFromValues() {
        const youngDOBArray = this.travellerForm.get('youngDateOfBirth') as FormArray;
        const childDOBArray = this.travellerForm.get('childDateOfBirth') as FormArray;
        const infantDOBArray = this.travellerForm.get('infantDateOfBirth') as FormArray;
        youngDOBArray.clear();
        childDOBArray.clear();
        infantDOBArray.clear();
        this.regConfig.patchValue({
            departureCity: '',
            destinationCity: '',
            returnDate: '',
            departureDate: ''
        })
      }

}
