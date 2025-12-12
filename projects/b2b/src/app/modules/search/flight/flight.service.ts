import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { ModalConfigDataI, ModalConfigDefault } from '../../../core/services/mat-modal.service';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { HeaderService } from '../../../shared/components/header/header.service';
import {
    fakeCommitBookingResult,
    fakeFinalBookingResult, fakeFlightResult, tempExtraServices, tempFareQuaote,
    tempTraveller
} from './flight.temp.service';
@Injectable({ providedIn: 'root' })
export class FlightService implements OnDestroy {
    protected subs = new SubSink();
    isDevelopment = false;
    currency = 'GBP';
    changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
    bookingFlightData = new BehaviorSubject<any>(undefined);
    CommitBookingResponse = new BehaviorSubject<any>(undefined);
    FinalBookingResponse = new BehaviorSubject<any>(undefined);
    traveller: any = this.isDevelopment ? tempTraveller() : undefined;
    extraServices = new BehaviorSubject<any>(undefined);
    flightSearchData: BehaviorSubject<{}[]> = new BehaviorSubject<any>([]);
    editPassenger = new BehaviorSubject<boolean>(false);
    resultToken: any;
    appReference: any;
    isPanMandatory:boolean=false;
    isPassportMandatory:boolean=false;
    bookingSource = new BehaviorSubject<any>('');
    flightPromocode = new BehaviorSubject<any>({});
    cabinClass: any;
    modalData: any;
    loading = new BehaviorSubject<boolean>(false);
    isCollapsed = new BehaviorSubject<boolean>(true);
    internalCall = false;
    private _flightsCopy: any = [];
    private _maxPrice: any = 0;
    calenderData=new BehaviorSubject<any>([]);
    private _minPrice: any = 0;
    originCountry = new BehaviorSubject<object>({});
    destCountry = new BehaviorSubject<object>({});
    flights = new BehaviorSubject<any>([]);
    flightsCopy = new BehaviorSubject<any>([]);
    maxPrice = new BehaviorSubject<any>(0);
    minPrice = new BehaviorSubject<any>(0);
    myValue = new BehaviorSubject<any>(0);
    passengerDetails = new BehaviorSubject<any>([]);
    myValueStart = new BehaviorSubject<any>(0);
    searchDataFlight = new BehaviorSubject<any>([]);
    tripType = new BehaviorSubject<any>('Oneway');
    zeroStopActive = new BehaviorSubject<boolean>(true);
    oneStopActive = new BehaviorSubject<boolean>(true);
    multipleStopsActive = new BehaviorSubject<boolean>(true);
    multipleStopsPrice = new BehaviorSubject<boolean>(false);
    departureReset = new BehaviorSubject<boolean>(false);
    earlyMorning = new BehaviorSubject<boolean>(true);
    morning = new BehaviorSubject<boolean>(true);
    midDay = new BehaviorSubject<boolean>(true);
    evening = new BehaviorSubject<boolean>(true);
    arrivalReset = new BehaviorSubject<boolean>(false);
    earlyMorning2 = new BehaviorSubject<boolean>(true);
    morning2 = new BehaviorSubject<boolean>(true);
    midDay2 = new BehaviorSubject<boolean>(true);
    evening2 = new BehaviorSubject<boolean>(true);
    airlines = new BehaviorSubject<any>([]);
    airlinesReset = new BehaviorSubject<boolean>(false);
    nearbyAirports = new BehaviorSubject<any>([]);
    nearbyAirportsReset = new BehaviorSubject<boolean>(false);
    stopovers = new BehaviorSubject<any>([]);
    stopoversReset = new BehaviorSubject<boolean>(false);
    preferencesReset = new BehaviorSubject<boolean>(false);
    refundable = new BehaviorSubject<boolean>(true);
    nonRefundable = new BehaviorSubject<boolean>(true);
    baggage = new BehaviorSubject<boolean>(true);
    airlinesCarousel = new BehaviorSubject<any>([]);
    airline_logo = 'https://booking247.com/airline_logo/';
    airlineCarouselClick = new BehaviorSubject<any>(null);
    serverError = new BehaviorSubject<boolean>(false);
    tripTypeClicked = false;
    formFilled: any = false;
    extraFees = new BehaviorSubject<any>({});
    searchingFlight = new BehaviorSubject<any>('');
    applySortingAfterFilter = new BehaviorSubject<boolean>(false);
    currentCurrency = new BehaviorSubject<string>(sessionStorage.getItem('selectedCurrency') || 'USD');
    currentCurrencyRate = new BehaviorSubject<number>(1);
    searchFlightSubmitted = false;
    searchResponseCopy = new BehaviorSubject<any>(false);
    userTitleList = new BehaviorSubject<any>(false);
    countryList = new BehaviorSubject<any>(false);
    nearByAirportsCopy = new BehaviorSubject<any>([]);
    noFlight = new BehaviorSubject<boolean>(false);
    flightType = new BehaviorSubject<any>('');
    private goToDashboardTabs = new BehaviorSubject<any>('');
    changeEmitted$ = this.goToDashboardTabs.asObservable();
    private sidebarClickEvents = new BehaviorSubject<any>('');
    changeSidebarTabs$ = this.sidebarClickEvents.asObservable();
    isBaggeProtected: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    baggeProtectionData: BehaviorSubject<any> = new BehaviorSubject<any>({
        isProtected: false,
        data: {}
    });
    modalConfigData: ModalConfigDataI;
    resultsFound: boolean = false;
    dialogClose = new BehaviorSubject<boolean>(false);
    closeModel= new BehaviorSubject<boolean>(false);
    bookingApiSources = [];
    isDomesticFlightSelected: boolean = false
    mealFees = new BehaviorSubject<any>({});
    baggageFees = new BehaviorSubject<any>({});
    seatFees= new BehaviorSubject<any>({});
    roundTripCalendarList = new BehaviorSubject<any>([]);
    oneWayCalendarList = new BehaviorSubject<any>([]);
  edditedResponse: any;
  navigateToDashboard = new BehaviorSubject<boolean>(false);
    constructor(
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private utility: UtilityService,
        private swalService: SwalService,
        private http: HttpClient,
        private headerService: HeaderService,
        private router: Router
    ) {
        this.modalConfigData = ModalConfigDefault;
        if (this.isDevelopment) {
            this.bookingFlightData.next(tempFareQuaote().data.UpdateFareQuote.FareQuoteDetails.JourneyList);
            this.extraServices.next(tempExtraServices().data.ExtraServices.ExtraServiceDetails);
            this.CommitBookingResponse.next(fakeCommitBookingResult().data.CommitBooking.BookingDetails);
            this.FinalBookingResponse.next(fakeFinalBookingResult().data.FinalBooking.BookingDetails);
        }
        this.apiHandlerService.apiHandler('userTitlelist', 'POST').subscribe(res => {
            this.userTitleList.next(res.data);
        });
        this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(res => {
            this.countryList.next(res.data.popular_countries.concat(res.data.countries));
        });
    }

    emitChange(change: any) {
        this.goToDashboardTabs.next(change);
    }

    sidebarEventChange(change: any) {
        this.sidebarClickEvents.next(change)
    }

    setIsPassportMandatory(){
        const storedState = localStorage.getItem('isPassportMandatory');
        if (storedState) {
            this.isPassportMandatory=(JSON.parse(storedState));
        }
    }
    
    setLocalStrorage(journeyListPre, resultTokendata) {
        localStorage.setItem('b2bJourneyListPre', JSON.stringify(journeyListPre));
        localStorage.setItem('b2bBookingSource', resultTokendata.booking_source);
        localStorage.setItem('b2bResultToken', journeyListPre.JourneyList.ResultToken);
        localStorage.setItem('b2bFlightTraveller', JSON.stringify(this.traveller));
    }

    setBookingSourceValue() {
        const storedState = localStorage.getItem('b2bBookingSource');
        if (storedState) {
            this.bookingSource.next(storedState);
        }
    }

    setJourneyListPre() {
        const storedState = localStorage.getItem('b2bJourneyListPre');
        if (storedState) {
            this.bookingFlightData.next(JSON.parse(storedState));
        }
    }

    setIsPanMandatory(){
        const storedState = localStorage.getItem('isPanMandatory');
        if (storedState) {
            this.isPanMandatory=(JSON.parse(storedState));
        }
    }


    setResultToken() {
        const storedState = localStorage.getItem('b2bResultToken');
        if (storedState) {
            this.resultToken = storedState;
        }
    }



    setFlightTraveller() {
        const storedState = localStorage.getItem('b2bFlightTraveller');
        if (storedState) {
            this.traveller = (JSON.parse(storedState));
        }
    }

    setUserTitleList() {
        const storedState = localStorage.getItem('b2bUserTitleList');
        if (storedState) {
            this.userTitleList.next(JSON.parse(storedState));
        }
    }


    setCommitBookingResponse() {
        const storedState = localStorage.getItem('b2bFlightCommitBookingResponse');
        if (storedState) {
            this.CommitBookingResponse.next(JSON.parse(storedState));
        }
    }

    resetFilter() {
        this.internalCall = false;
        this.flights.next(this._flightsCopy);
        this.maxPrice.next(this._maxPrice);
        this.minPrice.next(this._minPrice);
        this.myValue.next(this._maxPrice);
        this.myValueStart.next(this._minPrice);

        this.zeroStopActive.next(true);
        this.oneStopActive.next(true);
        this.multipleStopsActive.next(this.multipleStopsPrice.value);

        this.departureReset.next(true);
        this.arrivalReset.next(true);
        this.nearbyAirportsReset.next(true);
        this.stopoversReset.next(true);
        this.preferencesReset.next(true);
        this.airlinesReset.next(true);

        this.changeDetectionEmitter.emit();
    }

    resetSearch() {
        console.log("reset called=============================")
        this.flightsCopy.next([]);
        this.flights.next([]);
        this.maxPrice.next(0);
        this.minPrice.next(0);
        this.myValue.next(0);
        this.myValueStart.next(0);
        this.departureReset.next(false);
        this.arrivalReset.next(false);
        this.nearbyAirportsReset.next(false);
        this.stopoversReset.next(false);
        this.preferencesReset.next(false);
        this.airlinesReset.next(false);

        this.changeDetectionEmitter.emit();
    }

    getCabinClass(): Observable<any> {
        if (!this.cabinClass) {
            this.cabinClass = this.apiHandlerService.apiHandler('cabinClass', 'POST')
                .pipe(
                    map(response => response['Data']['CabinClass']),
                    shareReplay(1)
                );
        }
        return this.cabinClass;
    }

    setModalData(data: any) {
        this.modalData = data;
    }
    counter: number = 0;
    searchResult(data: any) {
        console.log("data",data)
        data.childDOB= data.childDOB.map((child) => child.childDateOfBirth);
        data.infantDOB= data.infantDOB.map((infant) => infant.infantDateOfBirth);
        data.youthDOB= data.youthDOB.map((youth) => youth.youngDateOfBirth);
        const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['user_id'];
        this.searchFlightSubmitted = true;
        if (this.isDevelopment) {

        } else {
            this.searchingFlight.next(true);
            this.loading.next(true);
            this.closeModel.next(false);
            if (!data.booking_source || data.booking_source === 'ZBAPINO00002' || data.booking_source === 'ZBAPINO00003'  || data.booking_source === 'ZBAPINO00009' || data.booking_source === 'ZBAPINO00008'||data.booking_source === 'ZBAPINO00007') {
                data.UserType = 'B2B';
                data.Currency = this.utility.readStorage('currentUser', sessionStorage)['currency'];
                data.UserId = this.utility.readStorage('currentUser', sessionStorage)['id'];
                data.GroupId = this.utility.readStorage('currentUser', sessionStorage)['agent_group_id'];
                if (data.booking_source === 'ZBAPINO00002') {
                    this.flights.next([]);
                }
            } else {
                delete data['UserType'];
                delete data['UserId'];
            }
           let enabledApiList = this.getEnabledApi();
             let tmx_api = enabledApiList.filter(item => enabledApiList.includes('ZBAPINO00010'))

            if (data.JourneyType == 'Return' && tmx_api && tmx_api.length > 0 && tmx_api[0] != "") {
                this.checkFormDomesticCodes(data);
            }
            else if(tmx_api && tmx_api.length > 0 && tmx_api[0] != "" ){
                this.isDomesticFlightSelected = false;
                this.setBookingApiSources(data);
            }
            else{
                this.isDomesticFlightSelected = false;
                this.setBookingApiSourceOld(data);
            }
        }
    }

    checkFormDomesticCodes(data) {
        if (data) {
            let domesticFlight = this.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination']);
            if (domesticFlight) {
                this.setTravelomatixBookingApiSources(data);
            }
            else {
                this.setBookingApiSources(data);
            }
        }
    }

    setMealFee() {
        const storedState = localStorage.getItem('mealFee');
        if (storedState) {
            this.mealFees.next({
                mealFee: JSON.parse(storedState)
            });
        }
    }
    
    setBaggageFee() {
        const storedState = localStorage.getItem('baggageFee');
        if (storedState) {
            this.baggageFees.next({
                baggageFee: JSON.parse(storedState)
            });
        }
    }

    
  setPromoCode() {
    const storedState = localStorage.getItem('flightPromocode');
    if (storedState) {
      this.flightPromocode.next({
        promocode: JSON.parse(storedState)
      });
    }
  }

    isDomesticFlight(origin, destination) {
        let enabledApiList = this.getEnabledApi();
        console.log("enabledApiList",enabledApiList)
        // let tmx_api = enabledApiList.includes('ZBAPINO00010')
        let tmx_api = enabledApiList.filter(item => enabledApiList.includes('ZBAPINO00010'))
        let india_airport_list = ['AGR', 'AGX', 'AJL', 'AKD', 'AMD', 'ATQ', 'BBI', 'BDQ', 'BEK', 'BEP', 'BHJ', 'BHO', 'BHU', 'BKB', 'BLR', 'BOM', 'BUP', 'CD', 'CCJ', 'CCU', 'CDP', 'CJB', 'CNN', 'COH', 'COK', 'DAE', 'DAI', 'DBD', 'DED', 'DEL', 'DEP', 'DHM', 'DIB', 'DIU', 'DMU', 'GAU', 'GAY', 'GOI', 'GOP', 'GUX', 'GWL', 'HBX', 'HDD', 'HJR', 'HSS', 'HYD', 'IDR', 'IMF', 'ISK', 'IXA', 'IXB', 'IXC', 'IXD', 'IXE', 'IXG', 'IXH', 'IXI', 'IXJ', 'IXK', 'IXL', 'IXM', 'IXN', 'IXP', 'IXQ', 'IXR', 'IXS', 'IXT', 'IXU', 'IXV', 'IXW', 'IY', 'IXZ', 'JAI', 'JDH', 'JGA', 'JGB', 'JLR', 'JRH', 'JSA', 'KCZ', 'KLH', 'KNU', 'KTU', 'KUU', 'LDA', 'LKO', 'LUH', 'MAA', 'MOH', 'MYQ', 'MZA', 'MZU', 'NAG', 'NDC', 'NMB', 'NVY', 'OMN', 'PAB', 'PAT', 'PBD', 'PGH', 'PNQ', 'PNY', 'PUT', 'PYB', 'RA', 'REW', 'RGH', 'RJA', 'RJI', 'RMD', 'RPR', 'RRK', 'RTC', 'RUP', 'SHL', 'SLV', 'SSE', 'STV', 'SXR', 'SXV', 'TCR', 'TEI', 'EZ', 'TIR', 'TJV', 'TNI', 'TRV', 'TRZ', 'UDR', 'VGA', 'VNS', 'VTZ', 'WGC', 'ZER', 'CNN', 'JRG', 'GBI'];
        // if (india_airport_list.includes(origin) && india_airport_list.includes(destination) && tmx_api && tmx_api.length > 0 && tmx_api[0] != "") {
        //     this.isDomesticFlightSelected = true;
        //     return true;
        // } else {
        //     this.isDomesticFlightSelected = false;
        //     return false;
        // }
        return false
    }

    setSegments(data) {
        for (let segment of data.Segments) {
            segment.Destination.includes('-') ? segment.Destination = segment.Destination.split('-')[1] : segment.Destination;
            segment.Origin.includes('-') ? segment.Origin = segment.Origin.split('-')[1] : segment.Origin;
        }
    }


    setBookingApiSources(data) {
        let enabledApiList= this.getEnabledApi();
        if ((data['PreferredAirlineName'] != 'All') && (data['PreferredAirlineName'] != 'All Airline')) {
            if (data['PreferredAirlines'][0] === 'BS') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008'];
            } else if (data['PreferredAirlines'][0] === 'VQ' && !(data['JourneyType'] == 'multicity')) {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00009'];
            } else {
                this.bookingApiSources = ['ZBAPINO00002', 'ZBAPINO00003', 'ZBAPINO00010']; //ZBAPINO00003, ZBAPINO00007
            }
        }
        else {
            if (data['JourneyType'] == 'multicity') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008','ZBAPINO00003', 'ZBAPINO00010']; //ZBAPINO00003, ZBAPINO00007
            }
            else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00009', 'ZBAPINO00003', 'ZBAPINO00010']; //ZBAPINO00003, ZBAPINO00007
            }
        }
        this.bookingApiSources.push('ZBAPINO00011');
        this.bookingApiSources.push('ZBAPINO00012');
        this.showResult(enabledApiList,data);
    }
    
    setBookingApiSourceOld(data) {
        let enabledApiList= this.getEnabledApi();
        if ((data['PreferredAirlineName'] != 'All') && (data['PreferredAirlineName'] != 'All Airline')) {
            if (data['PreferredAirlines'][0] === 'BS') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008'];
            } else if (data['PreferredAirlines'][0] === 'VQ' && !(data['JourneyType'] == 'multicity')) {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00009'];
            } else {
                this.bookingApiSources = ['ZBAPINO00002', 'ZBAPINO00003']; //ZBAPINO00003, ZBAPINO00007
            }
        }
        else {
            if (data['JourneyType'] == 'multicity') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008','ZBAPINO00003']; //ZBAPINO00003, ZBAPINO00007
            }
            else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00009', 'ZBAPINO00003']; //ZBAPINO00003, ZBAPINO00007
            }
        }
        this.bookingApiSources.push('ZBAPINO00011');
        this.bookingApiSources.push('ZBAPINO00012');
        this.showResult(enabledApiList,data);
    }

    setTravelomatixBookingApiSources(data) {
        let enabledApiList = this.getEnabledApi();
        // let tm_api = enabledApiList.includes('ZBAPINO00010')
        let tm_api = enabledApiList.filter(item => enabledApiList.includes('ZBAPINO00010'))

        if (tm_api && tm_api.length > 0 && tm_api[0] != "") {
            this.bookingApiSources = ['ZBAPINO00010'];
            data.booking_source = 'ZBAPINO00010';
            this.searchTravelomatix(data);
        }
        else {
            this.hideLoader();
            this.showApiEnableMessage();
        }
    }

    getEnabledApi() {
        let apiList = this.utility.readStorage('currentUser', sessionStorage)['api_list'];
        // const apiLists = JSON.parse(apiList.replace(/'/g, '"'));
        // let getEnabledApiList = apiLists.flight;
        let getEnabledApiList = apiList.split(",");
        return getEnabledApiList;
    }


    showResult(enabledApiList,data){
        this.setBookingSource(enabledApiList, this.bookingApiSources);
        if (this.bookingApiSources && this.bookingApiSources.length > 0 && this.bookingApiSources[0]!="") {
            data.booking_source=this.bookingApiSources[0];
            this.searchResultApi(data);
        }
        else if((!enabledApiList || enabledApiList.length == 0 || enabledApiList[0]=="") && ( !this.bookingApiSources || this.bookingApiSources.length==0 || this.bookingApiSources[0]=="") ){
            this.hideModel();
            this.showNoApiEnableMessage();
        }
        else {
           this.hideModel();
          // this.showApiEnableMessage();
        }
    }

    showApiEnableMessage() {
        this.router.navigate(['/dashboard']);
        this.swalService.alert.error("Specific api is not enabled for this user.Kindly contact customer support.");
    }

    showNoApiEnableMessage(){
        this.router.navigate(['/dashboard']);
        this.swalService.alert.error("Api is not enabled for this user.Kindly contact customer support.");
    }

    setBookingSource(enabledApiList,bookingApiSources){
        this.bookingApiSources=this.bookingApiSources.filter(item =>enabledApiList.includes(item))
    }
    
    searchResultApi(data) {
        this.setSegments(data);
        this.oneWayCalendarList.next([]);
        this.roundTripCalendarList.next([]);
        this.subs.sink = this.apiHandlerService.apiHandler('search', 'POST', '', '', data)
            .subscribe(
                searchResponse => {
                    if (searchResponse.Status && Object.keys(searchResponse.data).length) {
                        this.resetFilter();
                        this.flights.next([]);
                        if(searchResponse['data']['Search']['FlightDataList']['CalenderList'] && searchResponse['data']['Search']['FlightDataList']['CalenderList'].length && (data.JourneyType=="Oneway" || data.JourneyType=="OneWay")){
                            this.oneWayCalendarList.next(searchResponse['data']['Search']['FlightDataList']['CalenderList'][0]);
                        }
                        if(searchResponse['data']['Search']['FlightDataList']['CalenderList'] && searchResponse['data']['Search']['FlightDataList']['CalenderList'].length && data.JourneyType=="Return"){
                            this.roundTripCalendarList.next(searchResponse['data']['Search']['FlightDataList']['CalenderList'][0]);
                        }
                        let mergeResponseData = [...this.flights.value, ...searchResponse['data']['Search']['FlightDataList']['JourneyList'][0]];
                        mergeResponseData.forEach((element) => {
                            if (element && element.MorePrice) {
                                element.MorePrice.push(element.Price);
                            }
                            if (element && element.More_Exchange_Price) {
                                element.More_Exchange_Price.push(element.Price);
                            }
                            element.Price = element.Exchange_Price;
                        });
                        mergeResponseData = mergeResponseData.sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare);
                        if (mergeResponseData.length > 0 && !this.isDomesticFlightSelected) {
                            this.hideLoader(); // added to hide loader soon after getting response from  one api
                        }
                        searchResponse['data']['Search']['FlightDataList']['JourneyList'][0] = mergeResponseData;
                        this.getResponse(searchResponse);
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                                this.loading.next(false);
                                this.searchingFlight.next(false);
                                this.resultsFound = false;
                                this.dialogClose.next(true);
                            }
                        }
                        //}
                    } else {
                        if(!this.isDomesticFlightSelected){
                        this.noFlight.next(true);
                        this.alertService.error(searchResponse.Message);
                    }
                    }

                }, err => {
                    if (err.error.statusCode === 400) {
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                            this.loading.next(false);
                            this.searchingFlight.next(false);
                            this.resultsFound = false;
                            this.dialogClose.next(true);
                            }
                        }

                    } else if (err.error.statusCode != 500) {
                        if(!this.isDomesticFlightSelected){
                        this.noFlight.next(true);
                        this.loading.next(false);
                        this.searchingFlight.next(false);
                        this.resultsFound = false;
                        this.dialogClose.next(true)
                        this.swalService.alert.oops(err.error.Message);
                        }
                    } else
                    {
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                            this.loading.next(false);
                            this.searchingFlight.next(false);
                            this.resultsFound = false;
                            this.dialogClose.next(true);
                            }
                        }
                    }
                    this.flights.next([])
                }
            );
    }

    searchTravelomatix(data) {
        this.subs.sink = this.apiHandlerService.apiHandler('search', 'POST', '', '', data)
            .subscribe(
                searchResponse => {
                    if (searchResponse.Status && Object.keys(searchResponse.data).length) {
                        let mergeResponseData = [...searchResponse['data']['Search']['FlightDataList']['JourneyList']];
                        let sorttedArray = [];
                        for (let index = 0; index < mergeResponseData.length; index++) {
                            sorttedArray.push(mergeResponseData[index].sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare));
                        }
                        mergeResponseData = sorttedArray;
                        if (mergeResponseData.length > 0) {
                            this.hideLoader(); // added to hide loader soon after getting response from  one api
                            searchResponse['data']['Search']['FlightDataList']['JourneyList'] = mergeResponseData;
                            this.getTravelomatixResponse(searchResponse);
                        }
                    }
                }, err => {
                    this.loading.next(false);
                    this.searchingFlight.next(false);
                    this.resultsFound = false;
                    this.dialogClose.next(true);
                }
            );
    }

    getTravelomatixResponse(searchResponse) {
        this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
        const usdResult = searchResponse.data.Search.FlightDataList.JourneyList;
        this.nearByAirportsCopy.next(searchResponse.data.Search.NearByAirports);
        this.flights.next(usdResult);
        const flightsCopy = JSON.parse(JSON.stringify(usdResult));
        this.flightsCopy.next(flightsCopy);
        this._flightsCopy = flightsCopy;
        let mergedArray;
        if(flightsCopy && flightsCopy[0] && flightsCopy[1]){
            mergedArray = [...flightsCopy[0], ...flightsCopy[1]];
        }
        else if( flightsCopy && flightsCopy[0]){
            mergedArray=[...flightsCopy[0]];
        }
        else{
            mergedArray=[...flightsCopy[1]];

        }
        const maxPrice = mergedArray.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) > curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: 0 } }).Price.TotalDisplayFare;

        this.maxPrice.next(maxPrice);
        this._maxPrice = maxPrice;
        const minPrice = mergedArray.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) < curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: maxPrice } }).Price.TotalDisplayFare;

        this.minPrice.next(minPrice);
        this._minPrice = minPrice;
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);

        const airlinesTemp = [];
        for (const flightList of flightsCopy) {
            flightList.forEach(flight => {
                airlinesTemp.push(flight.FlightDetails.Details[0][0].OperatorName);
            });
        }
        const airlines = airlinesTemp.filter((x, i, a) => a.indexOf(x) == i);
        const airlinesTemp2 = [];
        airlines.forEach((_element, i) => {
            airlinesTemp2.push({ name: airlines[i], isChecked: true });
        });
        this.airlines.next(airlinesTemp2);
        const tempNearbyAirport = [];

        for (const element of flightsCopy) {
            element.forEach(flight => {
                const tempFlight = flight.FlightDetails.Details[0];
                if (tempFlight.length === 2) {
                    tempNearbyAirport.push(flight.FlightDetails.Details[0][1].Origin.AirportName);
                }
            });
        }
        const nearbyAirports = tempNearbyAirport.filter((x, i, a) => a.indexOf(x) == i);
        const airportsTemp2 = [];
        nearbyAirports.forEach((_element, i) => {
            airportsTemp2.push({ name: nearbyAirports[i], isChecked: true });
        });

        const tempStopovers = [];
        for (const element of flightsCopy) {
            element.forEach(flight => {
                const tempFlight = flight.FlightDetails.Details[0];
                if (tempFlight.length > 1) {
                    tempFlight.forEach((e, i) => {
                        if (i < tempFlight.length - 1) {
                            tempStopovers.push(e.Destination.CityName);
                        }
                    })
                }
            }
            );
        }

        const Stopovers = tempStopovers.filter((x, i, a) => a.indexOf(x) == i);
        const tempStopovers2 = [];
        Stopovers.forEach((_element, i) => {
            tempStopovers2.push({ name: Stopovers[i], isChecked: true });
        });
        this.stopovers.next(tempStopovers2);
        this.changeDetectionEmitter.emit();
    }

    hideLoader() {
        this.loading.next(false);
        this.searchingFlight.next(false);
        this.resultsFound = false;
        this.dialogClose.next(true);
    }

    noFlightsFound() {
        this.noFlight.next(true);
        this.loading.next(false);
        this.changeDetectionEmitter.emit();
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        window.alert(errorMessage);
        this.serverError.next(true);
        this.alertService.error(errorMessage);
        this.loading.next(false);
        return throwError(errorMessage);

    }

    getResponse(searchResponse) {
        this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
        const usdResult = searchResponse.data.Search.FlightDataList.JourneyList[0];
        this.nearByAirportsCopy.next(searchResponse.data.Search.NearByAirports);
        if(!this.isDomesticFlightSelected){
            this.flights.next(usdResult);
        const flightsCopy = JSON.parse(JSON.stringify(usdResult));
        this.flightsCopy.next(flightsCopy);
        this._flightsCopy = flightsCopy;

        const maxPrice = flightsCopy.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) > curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: 0 } }).Price.TotalDisplayFare;

        this.maxPrice.next(maxPrice);
        this._maxPrice = maxPrice;

        const minPrice = flightsCopy.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) < curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: maxPrice } }).Price.TotalDisplayFare;
        this.minPrice.next(minPrice);
        this._minPrice = minPrice;
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);

        const airlinesTemp = [];
        flightsCopy.forEach(flight => {
            airlinesTemp.push(flight.FlightDetails.Details[0][0].OperatorName);
        });
        const airlines = airlinesTemp.filter((x, i, a) => a.indexOf(x) == i);

        const airlinesTemp2 = [];
        airlines.forEach((_element, i) => {
            airlinesTemp2.push({ name: airlines[i], isChecked: true });
        });
        this.airlines.next(airlinesTemp2);
        const tempNearbyAirport = [];
        flightsCopy.forEach(flight => {
            const tempFlight = flight.FlightDetails.Details[0];
            if (tempFlight.length === 2) {
                tempNearbyAirport.push(flight.FlightDetails.Details[0][1].Origin.AirportName);
            }
        });
        const nearbyAirports = tempNearbyAirport.filter((x, i, a) => a.indexOf(x) == i);
        const airportsTemp2 = [];
        nearbyAirports.forEach((_element, i) => {
            airportsTemp2.push({ name: nearbyAirports[i], isChecked: true });
        });
        const tempStopovers = [];
        flightsCopy.forEach(flight => {
            const tempFlight = flight.FlightDetails.Details[0];
            if (tempFlight.length > 1) {
                tempFlight.forEach((e, i) => {
                    if (i < tempFlight.length - 1) {
                        tempStopovers.push(e.Destination.CityName);
                    }
                });
            }
        });
        const Stopovers = tempStopovers.filter((x, i, a) => a.indexOf(x) == i);
        const tempStopovers2 = [];
        Stopovers.forEach((_element, i) => {
            tempStopovers2.push({ name: Stopovers[i], isChecked: true });
        });
        this.stopovers.next(tempStopovers2);
        this.changeDetectionEmitter.emit();
        }
    }

    changeSlider() {
        this.multipleFiltersApply();
    }

    filterByStops() {
        this.multipleFiltersApply();
    }



    changeSliderExt() {
        this.myValue.next(Math.ceil(this.myValue.value+1));
        this.myValueStart.next(Math.floor(this.myValueStart.value));
        if (!this.isDomesticFlightSelected) {
            const result = this._flightsCopy.filter(flight => {
                const result = flight.Price.TotalDisplayFare <= this.myValue.value && flight.Price.TotalDisplayFare >= this.myValueStart.value;
                return result;
            });
            return !result.length ? this._flightsCopy : result;
        }
        else {
            let result = this.changeSliderExtTM();
            return result;
        }
    }

    changeSliderExtTM() {
        let resultArray = [];
        for (const flightList of this._flightsCopy) {
            const result = flightList.filter(flight => {
                const result = flight.Price.TotalDisplayFare <= this.myValue.value && flight.Price.TotalDisplayFare >= this.myValueStart.value;
                return result;
            });
            resultArray.push(result);
        }
        return !resultArray.length ? this._flightsCopy : resultArray;
    }

    changeSliderExt1(flights) {
        this.myValue.next(Math.ceil(this.myValue.value));
        this.myValueStart.next(Math.floor(this.myValueStart.value));
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        const result = flightsCopyTemp.filter(flight => {
            const result = flight.Price.TotalDisplayFare <= this.myValue.value && flight.Price.TotalDisplayFare >= this.myValueStart.value;
            return result;
        });
        return !result.length ? flightsCopyTemp : result;
    }

    filterByStopsExt(flights) {
        const zeroStop = this.zeroStopActive.value;
        const oneStop = this.oneStopActive.value;
        const multipleStops = this.multipleStopsActive.value;

        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            if (!zeroStop && !oneStop && !multipleStops) {
                flights = flightsCopyTemp;
            } else if (!zeroStop && !oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length > 2);
            } else if (!zeroStop && oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length === 2);
            } else if (!zeroStop && oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length > 1);
            } else if (zeroStop && !oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length === 1);
            } else if (zeroStop && !oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length !== 2);
            } else if (zeroStop && oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length <= 2);
            } else {
                flights = flightsCopyTemp;
            }
            return flights;
        }
        else {
            let result = this.filterByStopsExtTM(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops);
            return result;
        }
    }


    filterByStopsExtTM(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops) {
        if (!zeroStop && !oneStop && !multipleStops) {
            flights = flightsCopyTemp;
        } else if (!zeroStop && !oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length > 2);
            }
        } else if (!zeroStop && oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length === 2);
            }
        } else if (!zeroStop && oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length > 1);
            }
        } else if (zeroStop && !oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length === 1);
            }
        } else if (zeroStop && !oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length !== 2);
            }
        } else if (zeroStop && oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length <= 2);
            }
        } else {
            flights = flightsCopyTemp;
        }
        return flights;
    }

    filterByDepartureTime() {
        this.multipleFiltersApply();
    }

    filterByDepartureTimeExt(flights) {
        const a = this.earlyMorning.value;  // 12 AM - 6 AM
        const b = this.morning.value;       // 6 AM - 12 PM
        const c = this.midDay.value;    // 12 PM - 6 PM
        const d = this.evening.value;       // 6 PM - 12 AM
    
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        let tempFlights;
    
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (a && !b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 6;  // 12 AM - 6 AM
            });
        } else if (!a && b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 6 && t < 12;  // 6 AM - 12 PM
            });
        } else if (!a && !b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 12 && t < 18;  // 12 PM - 6 PM
            });
        } else if (!a && !b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return (t >= 18 && t < 24);  // 6 PM - 12 AM
            });
        } else if (a && b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 12;  // 12 AM - 12 PM
            });
        } else if (a && !b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 18;  // 12 AM - 6 PM
            });
        } else if (a && !b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && (t >= 18 && t < 24);  // 12 AM - 6 AM OR 6 PM - 12 AM
            });
        } else if (!a && b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 6 && t < 18;  // 6 AM - 6 PM
            });
        } else if (!a && b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 6 && t < 24;  // 6 AM - 12 AM
            });
        } else if (!a && !b && c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 6 && t < 24;  // 6 AM - 12 AM
            });
        } else if (a && b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 18;  // 12 AM - 6 PM
            });
        } else if (a && b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 24;  // 12 AM - 12 AM
            });
        } else if (a && b && c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                const t = (new Date(depTime)).getHours();
                return t >= 0 && t < 24;  // 12 AM - 12 AM
            });
        } else {
            tempFlights = flights;
        }
    
        return tempFlights;
    }

    filterByDepartureTimeExtTM(flights, flightsCopyTemp, a, b, c, d) {
        let tempFlights=[];
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (!a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            }
        } else if (!a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            }
        } else if (!a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            }
        } else if (!a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            }
        } else if (!a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            }
        } else if (!a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            }
        } else if (!a && b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && !b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            }
        } else if (a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            }
        } else if (a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            }
        } else if (a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            }
        } else if (a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            }
        } else if (a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            }
        } else {
            tempFlights = flights;
        }
        return tempFlights;
    }

    filterByArrivalTime() {
        this.multipleFiltersApply();
    }

    filterByArrivalTimeExt(flights) {
        const a = this.earlyMorning2.value;  // 12 AM - 6 AM
        const b = this.morning2.value;       // 6 AM - 12 PM
        const c = this.midDay2.value;       // 12 PM - 6 PM
        const d = this.evening2.value;       // 6 PM - 12 AM
    
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        let tempFlights;
    
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (a && !b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 6;  // 12 AM - 6 AM
            });
        } else if (!a && b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 6 && t < 12;  // 6 AM - 12 PM
            });
        } else if (!a && !b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 12 && t < 18;  // 12 PM - 6 PM
            });
        } else if (!a && !b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 18 && t < 24;  // 6 PM - 12 AM
            });
        } else if (a && b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 12;  // 12 AM - 12 PM
            });
        } else if (a && !b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 18;  // 12 AM - 6 PM
            });
        } else if (a && !b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && (t >= 18 && t < 24);  // 12 AM - 6 AM OR 6 PM - 12 AM
            });
        } else if (!a && b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 6 && t < 18;  // 6 AM - 6 PM
            });
        } else if (!a && b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 6 && t < 24;  // 6 AM - 12 AM
            });
        } else if (!a && !b && c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 6 && t < 24;  // 6 AM - 12 AM
            });
        } else if (a && b && !c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 18;  // 12 AM - 6 PM
            });
        } else if (a && b && !c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 24;  // 12 AM - 12 AM
            });
        } else if (a && b && c && !d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 18;  // 12 AM - 6 PM
            });
        } else if (a && b && c && d) {
            tempFlights = flightsCopyTemp.filter(flight => {
                const arrivalTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                const t = (new Date(arrivalTime)).getHours();
                return t >= 0 && t < 24;  // 12 AM - 12 AM
            });
        } else {
            tempFlights = flights;
        }
    
        return tempFlights;
    }


    filterByArrivalTimeExtTM(flights,flightsCopyTemp, a, b, c, d)
     {
        let tempFlights=[];
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (!a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            }
        } else if (!a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            }
        } else if (!a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            }
        } else if (!a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            }
        } else if (!a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            }
        } else if (!a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            }
        } else if (!a && b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && !b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            }
        } else if (a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            }
        } else if (a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            }
        } else if (a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            }
        } else if (a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            }
        } else if (a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            }
        } else {
            tempFlights = flights;
        }
        return tempFlights;
    }

    filterByAirlines() {
        this.multipleFiltersApply();
    }

    filterByAirlinesExt(flights) {
        const tempAirlines = this.airlines.value.filter(f => f.isChecked);
        if (this.airlines.value.length === tempAirlines.length || tempAirlines.length === 0) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            const tempFlights = flightsCopyTemp.filter(flight => {
                const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                return result.isChecked;
            });
            return tempFlights;
        }
        else {
            let result = this.filterByAirlinesExtTM(flightsCopyTemp);
            return result;
        }
    }

    filterByAirlinesExtTM(flightsCopyTemp) {
        if(flightsCopyTemp){
            let tempFlights = [];
            const tempFlightsFrom = flightsCopyTemp[0].filter(flight => {
                const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                return result.isChecked;
            });
            const tempFlightsTo = flightsCopyTemp[1].filter(flight => {
                const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                return result.isChecked;
            });
            tempFlights.push(tempFlightsFrom);
            tempFlights.push(tempFlightsTo)
            return tempFlights;
        }
    }

    filterByNearestAirport() {
        this.multipleFiltersApply();
    }

    filterByNearestAirportExt(flights) {
        const tempData = [];
        this.nearbyAirports.value.forEach(e => {
            if (e.isChecked) {
                tempData.push(e.code);
            }
        });
        if (tempData.length === 0 || tempData.length === this.nearbyAirports.value.length) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        const tempFlights2 = flightsCopyTemp.filter(flight => {
            let returnResult1 = false;
            let returnResult2 = false;
            flight.FlightDetails.Details[0].forEach((t) => {
                if (tempData.includes(t.Origin.AirportCode)) {
                    returnResult1 = true;
                }
            });
            flight.FlightDetails.Details[flight.FlightDetails.Details.length - 1].forEach((t) => {
                if (tempData.includes(t.Destination.AirportCode)) {
                    returnResult2 = true;
                }
            });
            return returnResult1 && returnResult2;
        });
        /* EOF arrive logic */

        return tempFlights2;
    }

    filterByStopoverCity() {
        this.multipleFiltersApply();
    }

    filterByStopoverCityExt(flights) {
        const tempData = [];
        this.stopovers.value.forEach(e => {
            if (e.isChecked) {
                tempData.push(e.name);
            }
        });
        if (tempData.length === 0 || tempData.length === this.stopovers.value.length) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            const tempFlights = flightsCopyTemp.filter(flight => {
                let returnResult = false;
                flight.FlightDetails.Details[0].forEach((t) => {
                    if (tempData.includes(t.Destination.CityName)) {
                        returnResult = true;
                    }
                });
                return returnResult || !tempData.length;
            });
            return tempFlights;
        }
        else {
            let result = this.filterByStopoverCityExtTM(flightsCopyTemp, tempData);
            return result;
        }
    }

    filterByStopoverCityExtTM(flightsCopyTemp, tempData) {
        let resultArray = [];
        const fromResult = flightsCopyTemp[0].filter(flight => {
            let returnResult = false;
            flight.FlightDetails.Details[0].forEach((t) => {
                if (tempData.includes(t.Destination.CityName)) {
                    returnResult = true;
                }
            });
            return returnResult || !tempData.length;
        });
        const toResult = flightsCopyTemp[1].filter(flight => {
            let returnResult = false;
            flight.FlightDetails.Details[0].forEach((t) => {
                if (tempData.includes(t.Destination.CityName)) {
                    returnResult = true;
                }
            });
            return returnResult || !tempData.length;
        });
        resultArray.push(fromResult);
        resultArray.push(toResult);
        return !resultArray.length ? this._flightsCopy : resultArray;
    }
    

    filterByPreferences() {
        this.multipleFiltersApply();
    }

    filterByPreferencesExt(flights) {
        const a = this.refundable.value;
        const b = this.nonRefundable.value;
        // const c = this.baggage.value;
        if (!this.isDomesticFlightSelected) {
            if ((a && b) || (!a && !b)) {
                return flights
            }
            const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
            // let tempFlights;
            if (a && !b) {
                flights = flightsCopyTemp.filter((flight) => flight.Attr.IsRefundable);
            } else if (!a && b) {
                flights = flightsCopyTemp.filter((flight) => !flight.Attr.IsRefundable);
            } else if (!a && !b) {
                let flightsTemp = flightsCopyTemp.filter((flight) => flight.Attr.IsRefundable === "");

                if (flightsTemp)
                    flights = flightsTemp;
                else
                    flights = [];
            }
            return flights;
        }
        else {
            let result = this.filterByPreferencesExtTM(flights, a, b);
            return result;
        }
    }

    filterByPreferencesExtTM(flights, a, b) {
        if ((a && b) || (!a && !b)) {
            return flights
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (a && !b) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.Attr.IsRefundable);
            }

        } else if (!a && b) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => !flight.Attr.IsRefundable);
            }
        } else if (!a && !b) {
            let flightsTemp = [];
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flightsTemp = flightsCopyTemp[index].filter((flight) => flight.Attr.IsRefundable === "");
            }
            if (flightsTemp)
                flights = flightsTemp;
            else
                flights = [];
        }
        return flights;
    }

    priceFilter() {
        let flights = this.changeSliderExt();
        this.flights.next(flights);
        this.applySortingAfterFilter.next(true);
        this.changeDetectionEmitter.emit();
    }

    multipleFiltersApply() {
        let flights = this.changeSliderExt();
        flights = this.filterByStopsExt(flights);
        flights = this.filterByDepartureTimeExt(flights);
        flights = this.filterByArrivalTimeExt(flights);
        flights = this.filterByNearestAirportExt(flights);
        flights = this.filterByStopoverCityExt(flights);
        flights = this.filterByPreferencesExt(flights);
        flights = this.filterByAirlinesExt(flights);
        this.flights.next(flights);
        /* apply sorting */
        this.applySortingAfterFilter.next(true);
        this.changeDetectionEmitter.emit();
    }

    duration(flight) {
        const time1 = flight;
        const dt11 = time1[0].Origin.DateTime;
        const dt12 = time1.length > 1 ? time1[time1.length - 1].Destination.DateTime : time1[0].Destination.DateTime;

        let totalDuration = '';
        let mins = 0, hrs = 0, day = 0;
        mins = this.diffMinutes(new Date(dt12), new Date(dt11))
        hrs += Math.floor(mins / 60);
        day = Math.floor(hrs / 24);
        hrs = hrs % 24;
        mins = mins % 60;
        totalDuration = day ? `${day} Day(s) ` : '';
        totalDuration += hrs ? `${hrs} Hr(s) ` : '';
        totalDuration += mins ? `${mins} Min(s)` : '';
        return totalDuration || '';
    }

    tripDuration(flight) {
        let totalDuration = '';
        let totalMins = 0, hrs = 0;
        flight.forEach(e => {
            for (let i = 0; i < e.length; i++) {
                const start = e[i].Origin.DateTime;
                const end = e[i].Destination.DateTime;
                totalMins += this.diffMinutes(new Date(end), new Date(start));
            }
        });
        hrs = Math.floor(totalMins / 60) % 24;
        totalMins = totalMins % 60;
        totalDuration += hrs ? `${hrs}h` : '';
        totalDuration += totalMins ? `${totalMins}m` : '';
        return totalDuration || '';
    }

    totalLayOverTime(flight) {
        let totalDuration = '';
        let totalMins = 0, hrs = 0;
        flight.forEach(e => {
            for (let i = 0; i < e.length; i++) {
                if (e[i].LayOverTimeMins) {
                    totalMins += e[i].LayOverTimeMins;
                }
            }
        });
        hrs = Math.floor(totalMins / 60) % 24;
        totalMins = totalMins % 60;
        totalDuration += hrs ? `${hrs}h` : '';
        totalDuration += totalMins ? `${totalMins}m` : '';
        return totalDuration || '';
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }
    totalStops(flight: any) {
        let totalStops = 0;
        flight.forEach(e => {
            totalStops += e.length;
        });
        return totalStops - 1;
    }
    finalDestination(flight: any) {
        const firstIterate = flight.length - 1;
        const secondIterate = flight[firstIterate].length - 1;
        return flight[firstIterate][secondIterate].Destination.AirportCode;
    }

    diffMinutes(dt2: any, dt1: any) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    changeCurrencyUpdateFareQuote(usdResult) {
        const fp = usdResult.Price;
        const currencyRate = this.currentCurrencyRate.value;
        fp.Currency = this.currentCurrency.value;
        fp.TotalDisplayFareUSD = fp['TotalDisplayFareUSD'] || fp.TotalDisplayFare;
        fp.TotalDisplayFare = Math.ceil(fp.TotalDisplayFareUSD * currencyRate);
        fp.PriceBreakup.BasicFareUSD = fp.PriceBreakup['BasicFareUSD'] || fp.PriceBreakup.BasicFare;
        fp.PriceBreakup.BasicFare = Math.ceil(fp.PriceBreakup.BasicFareUSD * currencyRate);
        fp.PriceBreakup.TaxUSD = fp.PriceBreakup['TaxUSD'] || fp.PriceBreakup.Tax;
        fp.PriceBreakup.Tax = Math.ceil(fp.PriceBreakup.TaxUSD * currencyRate);
        fp.PriceBreakup.TotalPriceUSD = fp.PriceBreakup['TotalPriceUSD'] || fp.PriceBreakup.TotalPrice;
        fp.PriceBreakup.TotalPrice = Math.ceil(fp.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.INUSD = fp.PriceBreakup.TaxDetails['INUSD'] || fp.PriceBreakup.TaxDetails.IN;
        fp.PriceBreakup.TaxDetails.IN = Math.ceil(fp.PriceBreakup.TaxDetails.INUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.K3USD = fp.PriceBreakup.TaxDetails['K3USD'] || fp.PriceBreakup.TaxDetails.K3;
        fp.PriceBreakup.TaxDetails.K3 = Math.ceil(fp.PriceBreakup.TaxDetails.K3USD * currencyRate);
        fp.PriceBreakup.TaxDetails.P2USD = fp.PriceBreakup.TaxDetails['P2USD'] || fp.PriceBreakup.TaxDetails.P2;
        fp.PriceBreakup.TaxDetails.P2 = Math.ceil(fp.PriceBreakup.TaxDetails.P2USD * currencyRate);
        fp.PriceBreakup.TaxDetails.ZRUSD = fp.PriceBreakup.TaxDetails['ZRUSD'] || fp.PriceBreakup.TaxDetails.ZR;
        fp.PriceBreakup.TaxDetails.ZR = Math.ceil(fp.PriceBreakup.TaxDetails.ZRUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.YQUSD = fp.PriceBreakup.TaxDetails['YQUSD'] || fp.PriceBreakup.TaxDetails.YQ;
        fp.PriceBreakup.TaxDetails.YQ = Math.ceil(fp.PriceBreakup.TaxDetails.YQUSD * currencyRate);
        fp.PriceBreakup.AgentCommissionUSD = fp.PriceBreakup['AgentCommissionUSD'] || fp.PriceBreakup.AgentCommission;
        fp.PriceBreakup.AgentCommission = Math.ceil(fp.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.PriceBreakup.AgentTdsOnCommisionUSD = fp.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.PriceBreakup.AgentTdsOnCommision;
        fp.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.PriceBreakup.CommissionEarnedUSD = fp.PriceBreakup['CommissionEarnedUSD'] || fp.PriceBreakup.CommissionEarned;
        fp.PriceBreakup.CommissionEarned = Math.ceil(fp.PriceBreakup.CommissionEarnedUSD * currencyRate);
        fp.PriceBreakup.PLBEarnedUSD = fp.PriceBreakup['PLBEarnedUSD'] || fp.PriceBreakup.PLBEarned;
        fp.PriceBreakup.PLBEarned = Math.ceil(fp.PriceBreakup.PLBEarnedUSD * currencyRate);
        fp.PriceBreakup.TdsOnCommissionUSD = fp.PriceBreakup['TdsOnCommissionUSD'] || fp.PriceBreakup.TdsOnCommission;
        fp.PriceBreakup.TdsOnCommission = Math.ceil(fp.PriceBreakup.TdsOnCommissionUSD * currencyRate);
        fp.PriceBreakup.TdsOnPLBUSD = fp.PriceBreakup['TdsOnPLBUSD'] || fp.PriceBreakup.TdsOnPLB;
        fp.PriceBreakup.TdsOnPLB = Math.ceil(fp.PriceBreakup.TdsOnPLBUSD * currencyRate);
        fp.PassengerBreakup.ADT.BasePriceUSD = fp.PassengerBreakup.ADT['BasePriceUSD'] || fp.PassengerBreakup.ADT.BasePrice;
        fp.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.PassengerBreakup.ADT.TaxUSD = fp.PassengerBreakup.ADT['TaxUSD'] || fp.PassengerBreakup.ADT.Tax;
        fp.PassengerBreakup.ADT.Tax = Math.ceil(fp.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.PassengerBreakup.ADT.TotalPriceUSD = fp.PassengerBreakup.ADT['TotalPriceUSD'] || fp.PassengerBreakup.ADT.TotalPrice;
        fp.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.PassengerBreakup.hasOwnProperty("CHD")) {
            fp.PassengerBreakup.CHD.BasePriceUSD = fp.PassengerBreakup.CHD['BasePriceUSD'] || fp.PassengerBreakup.CHD.BasePrice;
            fp.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CHD.TaxUSD = fp.PassengerBreakup.CHD['TaxUSD'] || fp.PassengerBreakup.CHD.Tax;
            fp.PassengerBreakup.CHD.Tax = Math.ceil(fp.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.PassengerBreakup.CHD.TotalPriceUSD = fp.PassengerBreakup.CHD['TotalPriceUSD'] || fp.PassengerBreakup.CHD.TotalPrice;
            fp.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty("CNN")) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty("INF")) {
            fp.PassengerBreakup.INF.BasePriceUSD = fp.PassengerBreakup.INF['BasePriceUSD'] || fp.PassengerBreakup.INF.BasePrice;
            fp.PassengerBreakup.INF.BasePrice = Math.ceil(fp.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.INF.TaxUSD = fp.PassengerBreakup.INF['TaxUSD'] || fp.PassengerBreakup.INF.Tax;
            fp.PassengerBreakup.INF.Tax = Math.ceil(fp.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.PassengerBreakup.INF.TotalPriceUSD = fp.PassengerBreakup.INF['TotalPriceUSD'] || fp.PassengerBreakup.INF.TotalPrice;
            fp.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return usdResult;
    }

    changeCurrencyExtraServices(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        for (let i = 0; i < fp.Baggage.length; i++) {
            for (let j = 0; j < fp.Baggage[i].length; j++) {
                fp.Baggage[i][j].PriceUSD = fp.Baggage[i][j]['PriceUSD'] || fp.Baggage[i][j].Price;
                fp.Baggage[i][j].Price = Math.ceil(fp.Baggage[i][j].PriceUSD * currencyRate);
            }
        }
        for (let i = 0; i < fp.MealPreference.length; i++) {
            for (let j = 0; j < fp.MealPreference[i].length; j++) {
                fp.MealPreference[i][j].PriceUSD = fp.MealPreference[i][j]['PriceUSD'] || fp.MealPreference[i][j].Price;
                fp.MealPreference[i][j].Price = Math.ceil(fp.MealPreference[i][j].PriceUSD * currencyRate);
            }
        }
        for (let i = 0; i < fp.Seat.length; i++) {
            for (let j = 0; j < fp.Seat[i].length; j++) {
                fp.Seat[i][j].PriceUSD = fp.Seat[i][j]['PriceUSD'] || fp.Seat[i][j].Price;
                fp.Seat[i][j].Price = Math.ceil(fp.Seat[i][j].PriceUSD * currencyRate);
            }
        }
        return fp;
    }

    changeCurrencyCommitBooking(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        for (let i = 0; i < fp.PassengerDetails.length; i++) {
            if (fp.PassengerDetails[i].hasOwnProperty('BaggageDetails')) {
                for (let j = 0; j < fp.PassengerDetails[i]['BaggageDetails'].length; j++) {
                    fp.PassengerDetails[i].BaggageDetails[j].PriceUSD = fp.PassengerDetails[i].BaggageDetails[j]['PriceUSD'] || fp.PassengerDetails[0].BaggageDetails[0].Price;
                    fp.PassengerDetails[i].BaggageDetails[j].Price = Math.ceil(fp.PassengerDetails[i].BaggageDetails[j].PriceUSD * currencyRate);

                    fp.PassengerDetails[i].BaggageDetails[j].BaggageUSD = fp.PassengerDetails[i].BaggageDetails[j]['BaggageUSD'] || fp.PassengerDetails[0].BaggageDetails[0].Baggage;
                    const Baggage = (fp.PassengerDetails[i].BaggageDetails[j].BaggageUSD).replace(fp.PassengerDetails[i].BaggageDetails[j].PriceUSD, fp.PassengerDetails[i].BaggageDetails[j].Price);
                    const FinalBaggage = (Baggage).replace('USD', this.currentCurrency.value);
                    fp.PassengerDetails[i].BaggageDetails[j].Baggage = FinalBaggage;
                }
            }
        }
        fp.Price.Currency = this.currentCurrency.value;
        fp.Price.TotalDisplayFareUSD = fp.Price['TotalDisplayFareUSD'] || fp.Price.TotalDisplayFare;
        fp.Price.TotalDisplayFare = Math.ceil(fp.Price.TotalDisplayFareUSD * currencyRate);
        fp.Price.PriceBreakup.BasicFareUSD = fp.Price.PriceBreakup['BasicFareUSD'] || fp.Price.PriceBreakup.BasicFare;
        fp.Price.PriceBreakup.BasicFare = Math.ceil(fp.Price.PriceBreakup.BasicFareUSD * currencyRate);
        fp.Price.PriceBreakup.TaxUSD = fp.Price.PriceBreakup['TaxUSD'] || fp.Price.PriceBreakup.Tax;
        fp.Price.PriceBreakup.Tax = Math.ceil(fp.Price.PriceBreakup.TaxUSD * currencyRate);
        fp.Price.PriceBreakup.TotalPriceUSD = fp.Price.PriceBreakup['TotalPriceUSD'] || fp.Price.PriceBreakup.TotalPrice;
        fp.Price.PriceBreakup.TotalPrice = Math.ceil(fp.Price.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.INUSD = fp.Price.PriceBreakup.TaxDetails['INUSD'] || fp.Price.PriceBreakup.TaxDetails.IN;
        fp.Price.PriceBreakup.TaxDetails.IN = Math.ceil(fp.Price.PriceBreakup.TaxDetails.INUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.K3USD = fp.Price.PriceBreakup.TaxDetails['K3USD'] || fp.Price.PriceBreakup.TaxDetails.K3;
        fp.Price.PriceBreakup.TaxDetails.K3 = Math.ceil(fp.Price.PriceBreakup.TaxDetails.K3USD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.P2USD = fp.Price.PriceBreakup.TaxDetails['P2USD'] || fp.Price.PriceBreakup.TaxDetails.P2;
        fp.Price.PriceBreakup.TaxDetails.P2 = Math.ceil(fp.Price.PriceBreakup.TaxDetails.P2USD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.YRUSD = fp.Price.PriceBreakup.TaxDetails['YRUSD'] || fp.Price.PriceBreakup.TaxDetails.YR;
        fp.Price.PriceBreakup.TaxDetails.YR = Math.ceil(fp.Price.PriceBreakup.TaxDetails.YRUSD * currencyRate);
        fp.Price.PriceBreakup.AgentCommissionUSD = fp.Price.PriceBreakup['AgentCommissionUSD'] || fp.Price.PriceBreakup.AgentCommission;
        fp.Price.PriceBreakup.AgentCommission = Math.ceil(fp.Price.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.Price.PriceBreakup.AgentTdsOnCommisionUSD = fp.Price.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.Price.PriceBreakup.AgentTdsOnCommision;
        fp.Price.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.Price.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.BasePriceUSD = fp.Price.PassengerBreakup.ADT['BasePriceUSD'] || fp.Price.PassengerBreakup.ADT.BasePrice;
        fp.Price.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.Price.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TaxUSD = fp.Price.PassengerBreakup.ADT['TaxUSD'] || fp.Price.PassengerBreakup.ADT.Tax;
        fp.Price.PassengerBreakup.ADT.Tax = Math.ceil(fp.Price.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TotalPriceUSD = fp.Price.PassengerBreakup.ADT['TotalPriceUSD'] || fp.Price.PassengerBreakup.ADT.TotalPrice;
        fp.Price.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.Price.PassengerBreakup.hasOwnProperty('CHD')) {
            fp.Price.PassengerBreakup.CHD.BasePriceUSD = fp.Price.PassengerBreakup.CHD['BasePriceUSD'] || fp.Price.PassengerBreakup.CHD.BasePrice;
            fp.Price.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.Price.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TaxUSD = fp.Price.PassengerBreakup.CHD['TaxUSD'] || fp.Price.PassengerBreakup.CHD.Tax;
            fp.Price.PassengerBreakup.CHD.Tax = Math.ceil(fp.Price.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TotalPriceUSD = fp.Price.PassengerBreakup.CHD['TotalPriceUSD'] || fp.Price.PassengerBreakup.CHD.TotalPrice;
            fp.Price.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty('CNN')) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.Price.PassengerBreakup.hasOwnProperty('INF')) {
            fp.Price.PassengerBreakup.INF.BasePriceUSD = fp.Price.PassengerBreakup.INF['BasePriceUSD'] || fp.Price.PassengerBreakup.INF.BasePrice;
            fp.Price.PassengerBreakup.INF.BasePrice = Math.ceil(fp.Price.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TaxUSD = fp.Price.PassengerBreakup.INF['TaxUSD'] || fp.Price.PassengerBreakup.INF.Tax;
            fp.Price.PassengerBreakup.INF.Tax = Math.ceil(fp.Price.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TotalPriceUSD = fp.Price.PassengerBreakup.INF['TotalPriceUSD'] || fp.Price.PassengerBreakup.INF.TotalPrice;
            fp.Price.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return fp;
    }

    changeCurrencyFinalBooking(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        fp.Price.Currency = this.currentCurrency.value;
        fp.Price.TotalDisplayFareUSD = fp.Price['TotalDisplayFareUSD'] || fp.Price.TotalDisplayFare;
        fp.Price.TotalDisplayFare = Math.ceil(fp.Price.TotalDisplayFareUSD * currencyRate);
        fp.Price.PriceBreakup.BasicFareUSD = fp.Price.PriceBreakup['BasicFareUSD'] || fp.Price.PriceBreakup.BasicFare;
        fp.Price.PriceBreakup.BasicFare = Math.ceil(fp.Price.PriceBreakup.BasicFareUSD * currencyRate);
        fp.Price.PriceBreakup.TaxUSD = fp.Price.PriceBreakup['TaxUSD'] || fp.Price.PriceBreakup.Tax;
        fp.Price.PriceBreakup.Tax = Math.ceil(fp.Price.PriceBreakup.TaxUSD * currencyRate);
        fp.Price.PriceBreakup.TotalPriceUSD = fp.Price.PriceBreakup['TotalPriceUSD'] || fp.Price.PriceBreakup.TotalPrice;
        fp.Price.PriceBreakup.TotalPrice = Math.ceil(fp.Price.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.airportTaxUSD = fp.Price.PriceBreakup.TaxDetails['airportTaxUSD'] || fp.Price.PriceBreakup.TaxDetails.airportTax;
        fp.Price.PriceBreakup.TaxDetails.airportTax = Math.ceil(fp.Price.PriceBreakup.TaxDetails.airportTaxUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.fuelTaxUSD = fp.Price.PriceBreakup.TaxDetails['fuelTaxUSD'] || fp.Price.PriceBreakup.TaxDetails.fuelTax;
        fp.Price.PriceBreakup.TaxDetails.fuelTax = Math.ceil(fp.Price.PriceBreakup.TaxDetails.fuelTaxUSD * currencyRate);
        fp.Price.PriceBreakup.AgentCommissionUSD = fp.Price.PriceBreakup['AgentCommissionUSD'] || fp.Price.PriceBreakup.AgentCommission;
        fp.Price.PriceBreakup.AgentCommission = Math.ceil(fp.Price.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.Price.PriceBreakup.AgentTdsOnCommisionUSD = fp.Price.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.Price.PriceBreakup.AgentTdsOnCommision;
        fp.Price.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.Price.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.BasePriceUSD = fp.Price.PassengerBreakup.ADT['BasePriceUSD'] || fp.Price.PassengerBreakup.ADT.BasePrice;
        fp.Price.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.Price.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TaxUSD = fp.Price.PassengerBreakup.ADT['TaxUSD'] || fp.Price.PassengerBreakup.ADT.Tax;
        fp.Price.PassengerBreakup.ADT.Tax = Math.ceil(fp.Price.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TotalPriceUSD = fp.Price.PassengerBreakup.ADT['TotalPriceUSD'] || fp.Price.PassengerBreakup.ADT.TotalPrice;
        fp.Price.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.Price.PassengerBreakup.hasOwnProperty('CHD')) {
            fp.Price.PassengerBreakup.CHD.BasePriceUSD = fp.Price.PassengerBreakup.CHD['BasePriceUSD'] || fp.Price.PassengerBreakup.CHD.BasePrice;
            fp.Price.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.Price.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TaxUSD = fp.Price.PassengerBreakup.CHD['TaxUSD'] || fp.Price.PassengerBreakup.CHD.Tax;
            fp.Price.PassengerBreakup.CHD.Tax = Math.ceil(fp.Price.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TotalPriceUSD = fp.Price.PassengerBreakup.CHD['TotalPriceUSD'] || fp.Price.PassengerBreakup.CHD.TotalPrice;
            fp.Price.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty('CNN')) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.Price.PassengerBreakup.hasOwnProperty('INF')) {
            fp.Price.PassengerBreakup.INF.BasePriceUSD = fp.Price.PassengerBreakup.INF['BasePriceUSD'] || fp.Price.PassengerBreakup.INF.BasePrice;
            fp.Price.PassengerBreakup.INF.BasePrice = Math.ceil(fp.Price.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TaxUSD = fp.Price.PassengerBreakup.INF['TaxUSD'] || fp.Price.PassengerBreakup.INF.Tax;
            fp.Price.PassengerBreakup.INF.Tax = Math.ceil(fp.Price.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TotalPriceUSD = fp.Price.PassengerBreakup.INF['TotalPriceUSD'] || fp.Price.PassengerBreakup.INF.TotalPrice;
            fp.Price.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return fp;
    }

    getFlightType(flight) {
        let airlineCodes = [];
        if (flight && flight.FlightDetails) {
            flight.FlightDetails.Details.forEach(flightDetails => {
                flightDetails.forEach(flight => {
                    airlineCodes.push({
                        Destination: flight.Destination.AirportCode,
                        Origin: flight.Origin.AirportCode
                    });
                });
            });
            this.subs.sink = this.apiHandlerService.apiHandler('flightType', 'POST', '', '', {
                Segments: airlineCodes
            }).subscribe(resp => {
                this.flightType.next(resp.data);
            })
        }
    }

    hideModel() {
        this.loading.next(false);
        this.searchingFlight.next(false);
        this.resultsFound = false;
        this.closeModel.next(true);
    }

    setInvoiceNumber(appReference) {
        let invoiceNumber = "";
        if (appReference) {
            invoiceNumber = "INV-" + (appReference.split("-")[1]);
        }
        return invoiceNumber;
    }

  

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}