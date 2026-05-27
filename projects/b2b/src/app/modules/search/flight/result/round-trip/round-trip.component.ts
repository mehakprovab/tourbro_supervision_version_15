import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { formatDate } from 'projects/b2b/src/app/core/services/format-date';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ThemeOptions } from 'projects/b2b/src/app/theme-options';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { browserRefresh } from '../../../../../app.component';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { FlightService } from '../../flight.service';
import { TripInfoComponent } from './../flight-details/trip-info/trip-info.component';
@Component({
    selector: 'app-round-trip',
    templateUrl: './round-trip.component.html',
    styleUrls: ['./round-trip.component.scss']
})
export class RoundTripComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    endSlice: number = 20;
    throttle;
    public browserRefresh: boolean;
    displayedColumns = ['Flights', "Markup Value", 'Markup Type', 'Edit'];
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    isCollapsed = true;
    subscription: Subscription;
    currency = this.flightService.currency;
    tripType = '';
    departureCity = '';
    departureCityModified = '';
    departureDate: any = '';
    destinationCity = '';
    destinationCityModified = '';
    returnDate: any = '';
    traveller: any;
    travellerCount = 1;
    travellerString: any;
    displayCities = [];
    flights: any = [];
    flightsCopy: any = [];
    myValue = 9999;
    minPrice = 1000;
    maxPrice = 9999;
    loading: boolean;
    totalFlights = 0;
    fastestFligtTime = '';
    cheapestFlight: any = 0;
    totalDuration: string = '';
    airline_logo = '';
    serverError = false;
    noFlight = false;
    searchingFlight = false;
    totalAmount=0;
    originCountry = '';
    destCountry = '';
    selectedFlightFrom: any = [];
    selectedFlightTo: any = [];
    @Output() returnResult: EventEmitter<any> = new EventEmitter<any>();
    protected subs = new SubSink();
    private searchPayload: any;
    Fstops = [
        { id: 1 },
        { id: 2 },
    ]
    onStopSelection(s) {
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flightService: FlightService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        public globals: ThemeOptions,
        private alertService: SwalService,
    ) { }

    test = [
        { name: "abc", age: "28" },
        { name: "asbc", age: "208" },
        { name: "abqc", age: "280" },
    ]
    clicked() {
        alert(1);
    }
    ngOnInit() {
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
            this.flightService.loading.next(true);
            this.subs.sink = this.flightService.loading.subscribe(res => {
                this.loading = res;
            });
        }
        let flightSearchPostdata = this.prepareSearchPayloadFromSessionData('flightSearchData');
        this.flightService.formFilled = JSON.parse(sessionStorage.getItem('flightSearchData'));
        this.searchResult(flightSearchPostdata);
        this.flightService.loading.next(true);
        this.flightService.dialogClose.next(false);
        this.originCountry = this.flightService.originCountry['CountryName'];
        this.destCountry = this.flightService.destCountry['CountryName'];
        this.airline_logo = this.flightService.airline_logo;
        this.subs.sink = this.flightService.searchingFlight.subscribe(res => {
            this.searchingFlight = res;
        });
        this.subs.sink = this.flightService.serverError.subscribe(res => {
            this.serverError = res;
        });
        this.subs.sink = this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
        this.subs.sink = this.flightService.flights.subscribe(res => {
            if (!res.length || res.every(arr => Array.isArray(arr) && arr.length === 0)) {
                this.totalFlights = 0;
                this.flights = [];
            } else {
                if(!this.flightService.isDomesticFlightSelected){
                   this.returnResult.emit(true);
                   return;
               }
               
                this.totalFlights = 0;
                res.forEach(flightList => {
                    this.totalFlights += flightList.length;
                });
                 this.flights = res;
                if(this.flights){
                    this.setupModelContent(this.flights);
                }
                this.flights.length ? this.dialog.closeAll() : ""
                if (!this.loading) {
                    setTimeout(_ => {
                        this.dialog.closeAll();
                        this.globals.sidebarHover = true;
                    }, 100);
                }
            }

        });
        this.subs.sink = this.flightService.myValue.subscribe(res => {
            this.myValue = res;
        });
        this.subs.sink = this.flightService.minPrice.subscribe(res => {
            this.minPrice = res;
        });
        this.subs.sink = this.flightService.maxPrice.subscribe(res => {
            this.maxPrice = res;
        });
        this.subs.sink = this.flightService.isCollapsed.subscribe(res => {
            this.isCollapsed = res;
        });

        this.subs.sink = this.flightService.noFlight.subscribe(res => {
            this.noFlight = res;
        });
        this.flightService.loading.next(false);
        this.subs.sink = this.flightService.dialogClose.subscribe(res => {
            if (res)
                this.dialog.closeAll();
        })
    }

    onScrollDown() {
             this.endSlice += 20;
    }
    onScrollUp(){
        if(this.endSlice!=20){
            this.endSlice -= 20;
        }
    }

    displaySeats(flight: any) {
        if (flight.FlightDetails.Details[0][0].Attr.hasOwnProperty('AvailableSeats')) {
            return flight.FlightDetails.Details[0][0].Attr.AvailableSeats;
        }
        return false;
    }

    ngAfterViewChecked() {
    }

    async onBookNow() {
        let resultToken=[];
        this.flightService.loading.next(true);
        resultToken.push(this.selectedFlightFrom.ResultToken);
        resultToken.push(this.selectedFlightTo.ResultToken);
            this.flightService.loading.next(true);
            const req: any = {
                ResultToken: resultToken,
                booking_source: this.selectedFlightFrom.booking_source,
            }
            if (1) {
                req.UserType = 'B2B';
                req.UserId = this.util.readStorage('currentUser', sessionStorage)['id'];
            }
            this.subs.sink = this.apiHandlerService.apiHandler('updateFareQuote', 'POST', '', '', req).subscribe(res => {
                if ((res.statusCode == 200 || res.statusCode == 201) && res.data && Object.keys(res.data).length != 0) {
                    const journeyListPre = res.data.UpdateFareQuote.FareQuoteDetails;
                    journeyListPre.JourneyList['searchResultToken'] = resultToken;
                    this.flightService.bookingFlightData.next(journeyListPre);
                    this.flightService.resultToken = journeyListPre.JourneyList.ResultToken;
                    this.flightService.bookingSource.next( this.selectedFlightFrom.booking_source);
                    const randomTwoDigit = Math.floor(Math.random() * 90 + 10);
                    const randomNumber = new Date().valueOf();
                    this.flightService.traveller = this.traveller;
                    this.flightService.getFlightType(journeyListPre.JourneyList);
                    this.router.navigate(['/search/flight/booking']);
                } else if ((res.statusCode == 200 || res.statusCode == 201) && res.Message != "") {
                    this.flightService.loading.next(false);
                    this.alertService.alert.oops(res.Message);
                } else {
                    this.flightService.loading.next(false);
                    this.alertService.alert.oops(res.Message);
                }
                this.flightService.loading.next(false);
            }, (err: HttpErrorResponse) => {
                this.flightService.loading.next(false);
                this.alertService.alert.oops(err.error.Message);
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
        });
    }

    setTripData(params) {
        this.tripType = params['tripType'];
        if (params['tripType'] == 'Multi-city') {
            this.displayCities = params['cities'];
        } else {
            this.departureCity = params['departureCity'];
            console.log(params['departureCity']);
            var x = params['departureCity'].lastIndexOf(",");
            this.departureCityModified = params['departureCity'].substring(x + 1);
            if (params['departureDate'] != '') {
                if (params['tripType'] == 'Roundtrip') {
                    // const dt = (params['departureDate']).split(' - ');
                    this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    this.returnDate = moment(params['returnDate']).format("DD/MM/YYYY");
                    // this.departureDate = new Date(params['departureDate']);
                    // this.returnDate = new Date(params['returnDate']);
                } else {
                    this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    // this.departureDate = new Date(params['departureDate']);
                }
            }
            this.destinationCity = params['destinationCity'];
            var y = params['destinationCity'].lastIndexOf(",");
            this.destinationCityModified = params['destinationCity'].substring(y + 1);
        }
        this.traveller = params['traveller'];
        this.travellerCount = this.traveller['adults'] + this.traveller['childrens'] + this.traveller['infants'];
        this.travellerString = params['traveller'];
    }

    searchResult(data: any) {
        this.flightService.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination'])
        if((!this.flightService.isDomesticFlightSelected) || (this.flightService.isDomesticFlightSelected && data.JourneyType!='Return')){
            this.returnResult.emit(true);
            return;
        }
        if (data['booking_source']) {
            delete data['booking_source'];
        }
        this.util.writeStorage("flightSearchPostdata", data, sessionStorage)
        const params = this.flightService.formFilled;
        if (params) {
            this.tripType = params['tripType'];
            this.flightService.tripType.next(this.tripType);
            if (params['tripType'] == 'Multi-city') {
                this.displayCities = params['cities'];
            } else {
                this.departureCity = params['departureCity'];
                if (params['departureCity'] != undefined) {
                    var x = params['departureCity'].lastIndexOf(",");
                    this.departureCityModified = params['departureCity'].substring(x + 1);
                }
                if (params['departureDate'] != '') {
                    if (params['tripType'] == 'Roundtrip') {
                        this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                        this.returnDate = moment(new Date(params['returnDate'])).format("DD/MM/YYYY");
                    } else {
                        this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    }
                }
                this.destinationCity = params['destinationCity'];
                if (params['destinationCity'] != undefined) {
                    var y = params['destinationCity'].lastIndexOf(",");
                    this.destinationCityModified = params['destinationCity'].substring(y + 1);
                }
            }
            if (params['traveller']) {
                this.traveller = params['traveller'];
                this.travellerCount = this.traveller['adults'] + this.traveller['childrens'] + this.traveller['infants'];
                this.travellerString = params['traveller'];
            }
            let config = new MatDialogConfig();
            config.height = '600px';
            config.width = '1000px';
            config.panelClass = "copy-items-modal";
            config.disableClose = true;
            config.data = {
                data: this.flightService.formFilled
            }
            let copyDialog = this.dialog.open(TripInfoComponent, config);
        }
        this.flightService.searchResult(data);
    }

    getAirportCode(parantesis: string) {
        return parantesis.match(/\(([^)]+)\)/)[1]
    }

    convertDates(data) {
        const date = data[0],
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    resetFilter() {
        this.flightService.resetFilter();
    }

    stops(flight: any) {
        return flight.length - 1;
    }

    stopsAirportCodes(flight: any) {
        const codes = [];
        flight.forEach(e => {
            codes.push(e.Destination.AirportCode);
        });
        codes.pop();
        return codes.join(' -> ');
    }

    duration(flight) {
        return this.flightService.duration(flight);
    }

    flightDataStringify(flight: any) {
        return JSON.stringify(flight);
    }

    checkDays(flight: any) {
        if (typeof flight == 'object') {
            const time = flight;
            const dt = time[0].Origin.DateTime.split(" ");
            let days = 0;
            let dt2: any;
            if (time.length > 1) {
                dt2 = time[time.length - 1].Destination.DateTime.split(" ");
            } else {
                dt2 = time[0].Destination.DateTime.split(" ");
            }
            const origin: any = new Date(dt[0]);
            const destination: any = new Date(dt2[0]);
            days = Math.floor((destination - origin) / (1000 * 60 * 60 * 24));
            return days;
        }
    }

    private prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
        let segments = [];
        const pattern = /\(([^)]+)\)/;
        if (ssd.tripType == 'Multi-city') {
            ssd.tripType = 'multicity';
            ssd.cities.forEach((e) => {
                const Origin = e.mDepartureCity;
                const Destination = e.mDestinationCity;
                const DepartureDate = formatDate(e.mDepartureDate, "");
                segments.push({
                    Origin: Origin,
                    Destination:
                        Destination ,
                    DepartureDate: DepartureDate + "T00:00:00",
                    CabinClass: ssd.CabinClass
                });
            });
        } else {
            segments = [
                {
                    CabinClass: (ssd.tripType == 'Oneway') ? ssd.CabinClass : undefined,
                    CabinClassOnward: ssd.CabinClass,
                    CabinClassReturn: ssd.CabinClass,
                    DepartureDate: formatDate(ssd.departureDate,'')+ "T00:00:00",
                    ReturnDate: (ssd.tripType == 'Roundtrip') ? formatDate(ssd.returnDate,'')+ "T00:00:00" : undefined,
                    Destination: ssd.destinationCity,
                    Origin: ssd.departureCity
                }
            ];
        }
        let searchReq = {
            AdultCount: ssd.traveller.adults,
            ChildCount: ssd.traveller.childrens,
            InfantCount: ssd.traveller.infants,
            JourneyType: (ssd.tripType == 'Roundtrip') ? 'Return' : ssd.tripType,
            PreferredAirlineName: ssd.PreferredAirline == '' ? 'All' : ssd.PreferredAirline,
            PreferredAirlines: ssd.PreferredAirlineCode == '' ? '' : [ssd.PreferredAirlineCode],
            NonStopFlights: ssd.connectivity == 'Direct Flights' ? 1 : 0,
            Segments: segments,
            childDOB:ssd.traveller.childDateOfBirth,
            infantDOB:ssd.traveller.infantDateOfBirth
        }
        return searchReq;
    }

    extractCity(city) {
        if (city) {
            let c = city.split("(")
            return c[0] + ' (' + (c[1].replace(")", "")) + ')';
        } else {
            return '';
        }
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    showFareDetails = false;
    showFare(event) {
        this.showFareDetails = event;
        this.cd.detectChanges();
    }

    setFromFlight(fromFlight) {
        this.selectedFlightFrom=fromFlight;
    }
    
    setToFlight(toFlight) {
        this.selectedFlightTo=toFlight;
    }
  

    returnToResult(){
        if(!this.flightService.isDomesticFlightSelected){
            this.returnResult.emit(true);
        }
        else{
        }
    }

    setupModelContent(flights) {
        if (flights && flights[0][0] && flights[1][0]) {
            this.setFromFlight(flights[0][0]);
            this.setToFlight(flights[1][0]);
        }
    }
}
