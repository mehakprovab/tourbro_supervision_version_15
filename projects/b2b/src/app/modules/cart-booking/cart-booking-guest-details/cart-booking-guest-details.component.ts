import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { UtilityService } from '../../../core/services/utility.service';
import { SwalService } from '../../../core/services/swal.service';
//import { AppGlobal } from '../../../app.global';
import { CartService } from '../cart.service';
import { KeyValue } from '@angular/common';
import { SubSink } from 'subsink';
import { formatDate } from '../../../core/services/format-date';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { shareReplay } from 'rxjs/operators';
import { TransferService } from '../../../modules/search/transfer/transfer.service';
import { untilDestroyed } from '../../../core/services/until-destroyed';
export let browserRefresh = false;
@Component({
  selector: 'app-cart-booking-guest-details',
  templateUrl: './cart-booking-guest-details.component.html',
  styleUrls: ['./cart-booking-guest-details.component.scss']
})
export class CartBookingGuestDetailsComponent implements OnInit {


  terms: boolean = true;
  phoneCodes: Array<any> = [];
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  loading: boolean;
  isCollapsed = true;
  isCollapsedFareSumm = true;
  isCollapsedGst = true;
  isCollapsedServiceReqs = true;
  browserRefresh: boolean;
  flight: any;
  flightString: any;
  traveller: any = false;
  travellerString: any;
  contactForm: FormGroup;
  usaDetailsForm: FormGroup;
  transferContactForm: FormGroup;
  activityContactForm: FormGroup;
  titles: any = [];
  infantsTitles: any = [];
  countries: any = [];
  submitted: boolean = false;
  selectedTitle;
  flightType: string;

  isConfirmed = false;
  maxDate = new Date();
  maxDateAdult: any;
  minDateAdult: any;
  maxDateChild: any;
  minDateChild: any;
  maxDateInfant: any;
  minDateInfant: any;
  minDateYouth: any;
  maxDateYouth: any;
  extraServices = false;
  isUpdatePassengers = false;
  currentUser: any;
  protected subs = new SubSink();
  travelList: any = [];
  seatMapData: any;
  seatMapSectors: any;
  selectedPassengerIndex: any;
  selectedPassenger: any;
  selectedTabIndex: number = 0;
  cartMessage: string | null = null;
  baggageArray = [];
  baggageMapData: any = {};
  baggageMapSectors: any;
  selectedBaggage: any = "";
  selectedMealTabIndex: number = 0;
  mealArray = [];
  mealMapData: any = {};
  mealMapSectors: any = [];
  selectedMeal: any = "";
  selectedBaggageTabIndex: number = 0;
  keysArray = [];
  isSeatLoading: boolean = true;
  showSeatSelection: boolean = false;
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  reverseKeyOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  valueOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value.localeCompare(b.value);
  }
  txtCouponCodeValue: string = ''; // Variable to hold the input value
  disableApplyPromo: boolean = false;
  selectedPromocode = '';
  promocodeList: any = [];
  airline_logo: string = '';
  hotel;
  transfer;
  cartItems;
  hotelTraveller;
  timeLeft: number = 900; // 15 minutes in seconds
  interval: any;




  nights: any;
  travellerForm: FormGroup;
  addressForm: FormGroup;
  titleListAdult: any = [];
  titleListChild: any = [];
  noOfAdults: number = 0;
  noOfChilds: number = 0;
  noOfAdultsExt: number = 0;
  noOfChildsExt: number = 0;
  roomWiseAdultsChilds = [];
  guestData: any = {};
  private subSunk = new SubSink();
  regConfig: FormGroup;
  lastKeyupTstamp: number = 0;
  openRooms: boolean = false;
  adults: number[] = [1];
  childs: number[] = [0];
  noOfRooms: number = 1;
  minChildDate: Date;
  maxChildDate: Date;
  minDate = new Date();
  isInvalidPromo: boolean = false;
  bsConfig: Partial<BsDatepickerConfig> = {
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      containerClass: 'theme-default',
  };
  hotelData:any;
  accomdationData:boolean =false;
  mealData:boolean = false;
  isLoading: boolean = false;
  guestCountData: {} = {};
  titleList: any;
  promocode:any;
  discount_value:number= 0;
  early_discount_value = 0
  duration_discount_value = 0;
  respData: any = [];
  noOfRoomArr = [];
  showMore = false;
  showMoreAmenity = false;
  accommodation_charge = 0;
  selectedMealCharge = 0;
  selectedMeals = [];
  dropdownSettingsForHotel:{}
  mealList:any;
  adult = 0;
  child = 0;
  earlyBooking:any;
  durationOfStay:any;

  transferSearchData: any;
  searchedList;
  depPoint: boolean;
  searchedAirLineList: any;
  shouldPreferedAirLineHide: any;
  selectedValues:any=[];
  selectedExtras: { [key: number]: number | string } = {};
  extasTotal:number=0;
  adultCount: any;
  childCount: any;
  infantCount: any;
  finalTraveller: { adults: number; childrens: number; infants: number; youth:number; youthDateOfBirth:any; childDateOfBirth: any; infantDateOfBirth: any; };
  transferTraveller: any;
  activity: any;
  currency: any;
  totalFare: any;
  booking_source: any;
  showJournerError: boolean = false;
  departureDate: any;
  activityChildAges: number[] = [];
  flightSearchData: any;
  minYouthDateOfBirth: any;
  maxYouthDateOfBirth: any;
  paxCount: {type: string, adultCount: number}[] = []
  paxCountSame: boolean = false;
  modules: any;
passengerspax: any
  constructor(private fb: FormBuilder,
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private flightService: FlightService,
    private utility: UtilityService,
    private cdRef: ChangeDetectorRef,
    private swalService: SwalService,
   // private appGlobal: AppGlobal,
    private cartService: CartService,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    this.flightService.flightPromocode.next({})
    this.currentUser = JSON.parse(sessionStorage.getItem('b2cUser'));
    if (this.currentUser) {
      this.getTravellersList();
    }
    
    this.startTimer();
    this.currency = this.utility.readStorage('currentUser', sessionStorage)['currency'] || 'GBP';
    this.getPhoneCodeList();
    this.getCountryList();
    this.getTitleList();
    this.createContactForm();
    const agentEmail = JSON.parse(sessionStorage.getItem('currentUser'));
     this.contactForm.controls['contact'].patchValue({
      Email: agentEmail.email
     })
    const cartData = JSON.parse(sessionStorage.getItem('cartData'));
    if (cartData) {
      this.cartService.cartItemsSubject.next(cartData);
    }
    this.cartService.cartItems.subscribe(items => {
      this.cartItems = items;
    });
    this.subs.sink = this.cartService.cartItemsFlight.subscribe((res) => {
      if (res && Object.keys(res).length > 0) {
        this.flight = res;
        this.flightSearchData = this.flight;
        if (this.flight.SearchData.JourneyType === 'Oneway') {
          this.departureDate = this.flight.SearchData.Segments[0].DepartureDate;
        }
        if (this.flight.SearchData.JourneyType === 'Return') {
          this.departureDate = this.flight.SearchData.Segments[0].ReturnDate;
        }
        if (this.flight.SearchData.JourneyType === 'multicity') {
          this.departureDate = this.flight.SearchData.Segments[this.flight.SearchData.Segments.length-1].DepartureDate;
        }
        this.flightUpdate();
      } else {
        const flightData = sessionStorage.getItem('cartItemsFlight');
        if (flightData) {
          this.flight = JSON.parse(flightData);
          this.flightSearchData = this.flight;
        if (this.flight.SearchData.JourneyType === 'Oneway') {
          this.departureDate = this.flight.SearchData.Segments[0].DepartureDate;
        }
        if (this.flight.SearchData.JourneyType === 'Return') {
          this.departureDate = this.flight.SearchData.Segments[0].ReturnDate;
        }
        if (this.flight.SearchData.JourneyType === 'multicity') {
          this.departureDate = this.flight.SearchData.Segments[this.flight.SearchData.Segments.length-1].DepartureDate;
        }
          this.flightUpdate();
        }
      }
    });
    this.subs.sink = this.cartService.cartItemsHotel.subscribe((res) => {
      if (res && Object.keys(res).length > 0) {
        this.hotel = res;
        this.booking_source = this.hotel.booking_source;
        this.hotelUpdate();
      } else {
        // Retrieve hotel data from local storage as fallback
        const hotelData = sessionStorage.getItem('cartItemsHotel');
        if (hotelData) {
          this.hotel = JSON.parse(hotelData);
          this.hotelUpdate();
        }
      }
    });

    this.subs.sink = this.cartService.cartItemsTransfer.subscribe((res) => {
      if (res && Object.keys(res).length > 0) {
        this.transfer = res;
        this.transferUpdate();
      } else {
        // Retrieve transfer data from local storage as fallback
        const transferData = sessionStorage.getItem('cartItemsTransfer');
        if (transferData) {
          this.transfer = JSON.parse(transferData);
          this.transferUpdate();
        }
      }
    });

    this.subs.sink = this.cartService.cartItemsActivity.subscribe((res) => {
      if (res && Object.keys(res).length > 0) {
        this.activity = res;
        this.activityUpdate();
      } else {
        // Retrieve transfer data from local storage as fallback
        const activityData = sessionStorage.getItem('cartItemsActivity');
        if (activityData) {
          this.activity = JSON.parse(activityData);
          this.activityUpdate();
        }
      }
    });

    const sources = [
      { type: 'flight', data: this.flight ? this.flightSearchData.SearchData : [] },
      { type: 'hotel', data: this.hotel ? this.hotel.searchRequest.RoomGuests : [] },
      { type: 'transfer', data: this.transfer ? this.transfer.body : [] },
      { type: 'activity', data: this.activity ? this.activity.body.paxes[0] : [] }
    ];

    if (this.activity && this.activity.body.paxes[0].ChildAge && this.activity.body.paxes[0].ChildAge.length) {
      this.activityChildAges = this.activity.body.paxes[0].ChildAge.map((age: string) => parseInt(age, 10));
    }

    this.generatePassengerForms(sources)
    this.calculateTotalFare()
   
    //this.browserRefresh ? this.setValues() : null;
    this.airline_logo = this.flightService.airline_logo;
    this.subs.sink = this.flightService.flightType.subscribe(res => this.flightType = res)
    this.subs.sink = this.flightService.extraServices.subscribe(res => {
      if (res) {
        this.extraServices = true;
      } else {
        this.extraServices = false;
      }
    });
    this.flightService.editPassenger.subscribe(data => {
      if (data && data == true) {
        this.isUpdatePassengers = true;
      }
    })

    if (this.isUpdatePassengers)
      this.getPassengerDetails();
  }


  setValues(enabledApiList,bookingApiSources) {
    this.flightService.setFlightTraveller();
    this.flightService.setJourneyListPre();
    this.flightService.setResultToken();
    this.flightService.setBookingSource(enabledApiList,bookingApiSources);
  }

  setLocalStrorage(journeyListPre, resultTokendata) {
    this.flightService.setLocalStrorage(journeyListPre, resultTokendata);
  }

  transformActivityTraveller(traveller) {
    return {
      adults: traveller.adultCount,
      childrens: traveller.childCount,
      childDateOfBirth: traveller.ChildAge
    }
  }

  transformTraveller(traveller) {
    return {
      adults: traveller.AdultCount,
      childrens: traveller.ChildCount,
      infants: traveller.InfantCount,
      youth: traveller.YouthCount,
      youthDateOfBirth: traveller.youthDOB,
      childDateOfBirth: traveller.childDOB,
      infantDateOfBirth: traveller.infantDOB
    };
  }

  activityUpdate() {
     if (this.activity && Object.keys(this.activity).length > 0) {
      this.createAcivityForm();
      this.addActivityBookingQuestions();
      this.cdRef.detectChanges();
     }
  }

  transferUpdate(){
    if (this.transfer && Object.keys(this.transfer).length > 0) {
      // this.addBookingQuestions();
      this.setKey();
      this.createTransferForm();
      this.transferTraveller = this.transfer.body;
      this.transferTraveller = this.transformTransferTraveller(this.transferTraveller);
      // if (this.flight == null && this.hotel == null) {
        // this.passengers.clear();
        // let leadPax = 1;
        // for (let t of Object.keys(this.transferTraveller)) {
        //   if (this.transferTraveller[t]) {
        //     for (let i = 0; i < this.transferTraveller[t]; i++) {
        //       this.addPassenger(t, i, leadPax);
        //       leadPax = 0;
        //     }
        //   }
        // }
        // this.cdRef.detectChanges();
      // }
      this.cdRef.detectChanges();
    }
  }

  transformTransferTraveller(traveller) {
    return {
      adults: traveller.AdultCount,
      childrens: traveller.ChildCount,
      infants: traveller.InfantCount,
      childDateOfBirth: traveller.childDOB,
      infantDateOfBirth: traveller.infantDOB
    };
  }

  hotelUpdate(){
    if (this.hotel && Object.keys(this.hotel).length > 0) {
      this.hotelTraveller = this.transformHotelTraveller(this.hotel.searchRequest.RoomGuests);
      // if(!this.flight) {
        // this.passengers.clear();
        // let leadPax = 1;
        // for (let t of Object.keys(this.hotelTraveller)) {
        //   if (this.hotelTraveller[t]) {
        //     for (let i = 0; i < this.hotelTraveller[t]; i++) {
        //       this.addPassenger(t, i, leadPax);
        //       leadPax = 0;
        //     }
        //   }
        // }
        // this.cdRef.detectChanges();
      // }
      // else {
        // this.finalTraveller = this.mergeTravellerData(this.traveller, this.hotelTraveller);
        // this.passengers.clear();
        // let leadPax = 1;
        // for (let t of Object.keys(this.finalTraveller)) {
        //   if (this.finalTraveller[t]) {
        //     for (let i = 0; i < this.finalTraveller[t]; i++) {
        //       this.addPassenger(t, i, leadPax);
        //       leadPax = 0;
        //     }
        //   }
        // }
        // this.cdRef.detectChanges();
      // }
    }
  }

  mergeTravellerData(traveller1, traveller2) {
    return {
      adults: Math.max(traveller1.adults, traveller2.adults),
      childrens: Math.max(traveller1.childrens, traveller2.childrens),
      youth: Math.max(traveller1.youth, traveller2.youth),
      infants: Math.max(traveller1.infants, traveller2.infants),
      youthDateOfBirth: traveller1.youthDateOfBirth.length >= traveller2.youthDateOfBirth.length ? traveller1.youthDateOfBirth : traveller2.youthDateOfBirth,
      childDateOfBirth: traveller1.childDateOfBirth.length >= traveller2.childDateOfBirth.length ? traveller1.childDateOfBirth : traveller2.childDateOfBirth,
      infantDateOfBirth: traveller1.infantDateOfBirth.length >= traveller2.infantDateOfBirth.length ? traveller1.infantDateOfBirth : traveller2.infantDateOfBirth
    };
  }

  transformHotelTraveller(travellers) {
    return travellers.reduce((acc, traveller) => {
      acc.adults += traveller.NoOfAdults;
      acc.childrens += traveller.NoOfChild;
      acc.childDateOfBirth.push([]);
      return acc;
    }, {
      adults: 0,
      childrens: 0,
      youth: 0,
      infants: 0, // Assuming infants are always 0
      youthDateOfBirth: [],
      childDateOfBirth: [],
      infantDateOfBirth: [] // Assuming no infant DOB provided
    });
  }


  flightUpdate(){
    if (this.flight && Object.keys(this.flight).length > 0) {
      if (typeof this.flight == 'object' && this.flight.JourneyList["0"]["0"].hasOwnProperty('FlightDetails')) {
        const journeyListPre = this.flight.JourneyList["0"]["0"];
        this.flightService.extraFees.next(this.flightService.extraFees.value);
        this.traveller = this.flightService.traveller;
        // if ((res.JourneyList.booking_source == 'ZBAPINO00002' || res.JourneyList.booking_source == 'ZBAPINO00007') && this.currentUser && this.currentUser.id == 44) {
        this.showSeatSelection = true;
        this.flightService.bookingFlightData.next(journeyListPre);
        this.flightService.resultToken = journeyListPre.ResultToken;
        this.flightService.bookingSource.next(journeyListPre.booking_source);
        const randomTwoDigit = Math.floor(Math.random() * 90 + 10);
        const randomNumber = new Date().valueOf();
        this.traveller = this.transformTraveller(this.flight.SearchData);
        this.flightService.traveller = this.traveller;
        // this.setLocalStrorage(journeyListPre,journeyListPre)
        // this.getSeatLayout(res.JourneyList);
        // }
        this.flight = this.flight.JourneyList["0"]["0"];
        // this.passengers.clear();
        // let leadPax = 1;
        // for (let t of Object.keys(this.traveller)) {
        //   if (this.traveller[t]) {
        //     for (let i = 0; i < this.traveller[t]; i++) {
        //       this.addPassenger(t, i, leadPax);
        //       leadPax = 0;
        //     }
        //   }
        // }
      } else {
        this.router.navigate(['/']);
      }
      this.cdRef.detectChanges();
    }
  }

extractPaxCounts(sources: { type: string, data: any }[]): any {
  const paxCount = {
    adults: 0,
    childrens: 0,
    infants: 0,
    youth: 0
  };
  let activityChildCount;

  for (const source of sources) {
  const { type, data } = source;

  if (type === 'hotel') {
    let maxAdults = 0;
    let maxChildren = 0;

    for (const guest of data) {
      this.paxCount.push({type: 'hotel', adultCount: guest.NoOfAdults || 0});
      maxAdults = Math.max(maxAdults, guest.NoOfAdults || 0);
      maxChildren = Math.max(maxChildren, guest.NoOfChild || 0);
    }

    paxCount.adults = Math.max(paxCount.adults, maxAdults);
    paxCount.childrens = Math.max(paxCount.childrens, maxChildren);
  }

  if (type === 'flight') {
    this.paxCount.push({type: 'flight', adultCount: data.AdultCount || 0});
    paxCount.adults = Math.max(paxCount.adults, data.AdultCount || 0);
    paxCount.childrens = Math.max(paxCount.childrens, data.ChildCount || 0);
    paxCount.infants = Math.max(paxCount.infants, data.InfantCount || 0);
    paxCount.youth = Math.max(paxCount.youth, data.YouthCount || 0);
  }

  if (type === 'activity') {
    this.paxCount.push({type: 'activity', adultCount: data.adultCount || 0});
    paxCount.adults = Math.max(paxCount.adults, data.adultCount || 0);
    paxCount.childrens = Math.max(paxCount.childrens, data.childCount || 0);
    activityChildCount = data.ChildAge || [];
  }

  if (type === 'transfer') {
    this.paxCount.push({type: 'transfer', adultCount: data.AdultCount || 0})
    paxCount.adults = Math.max(paxCount.adults, data.AdultCount || 0);
    paxCount.childrens = Math.max(paxCount.childrens, data.ChildCount || 0);
    paxCount.infants = Math.max(paxCount.infants, data.InfantCount || 0);
  }
}
const filtered = this.paxCount.filter(item => item.adultCount > 0);
const firstCount = filtered[0].adultCount;
this.paxCountSame = filtered.every(item => item.adultCount === firstCount);

console.log(this.paxCount, "Total Overall PAx Count")

this.mergeAdultPassengers(this.paxCount)

  return paxCount;
}


mergeAdultPassengers(sources) {
  const sourceMap = new Map<string, number>();
  for (const source of sources) {
    if (source.adultCount > 0) {
      sourceMap.set(source.type, source.adultCount);
    }
  }

  this.passengerspax = [];

  while ([...sourceMap.values()].some(count => count > 0)) {
    const usedSources: string[] = [];

    for (const [source, count] of sourceMap.entries()) {
      if (count > 0) {
        usedSources.push(source);
      }
    }

    if (usedSources.length === 0) break;

    for (const src of usedSources) {
      sourceMap.set(src, sourceMap.get(src)! - 1);
    }

    this.passengerspax.push({ sources: usedSources });
  }
  // this.modules = this.passengerspax.map(data => data.sources)
  return this.passengerspax;
}



setDateLimits(): void {
  const depDate = this.flight ? new Date(this.departureDate) : new Date();

  // Adult: age 12 to 100
  this.maxDateAdult = this.addYearsToDate1(depDate, -12, 0, 0);
  this.minDateAdult = this.addYearsToDate1(depDate, -100, 0, 0);

  // Child: age 2 to <12
  this.maxDateChild = this.addYearsToDate1(depDate, -2, 0, -1);
  this.minDateChild = this.addYearsToDate1(depDate, -12, 0, 1);

  // Infant: age 0 to <2
  this.maxDateInfant = this.addYearsToDate1(depDate, 0, 0, -1);
  this.minDateInfant = this.addYearsToDate1(depDate, -2, 0, 1);

  // Youth: age 12 to <16
  this.minYouthDateOfBirth = this.addYearsToDate1(depDate,-16, 0,1);
  this.maxYouthDateOfBirth = this.addYearsToDate1(depDate,-12, 0, -1);
}

generatePassengerForms(sources: { type: string, data: any }[]): void {
  const paxCount = this.extractPaxCounts(sources);
  this.passengers.clear(); // clear old passengers

  let leadPax = 1;
  this.setDateLimits();
  // Create passengers by type
  const paxTypes = ['adults', 'childrens', 'infants', 'youth'];
  let activityChildIndex = 0;
 
  for (let type of paxTypes) {
    const count = paxCount[type] || 0;
    for (let i = 0; i < count; i++) {
       let activityAge = null;
    if (
      type === 'childrens' &&
      this.activityChildAges &&
      activityChildIndex < this.activityChildAges.length
    ) {
      activityAge = this.activityChildAges[activityChildIndex];
      activityChildIndex++;
    }
    
      this.addPassenger(type, i, leadPax,activityAge,this.passengerspax[i]);
      leadPax = 0;
    }
  }

  this.cdRef.detectChanges();
}

getMaxDateForChild(index: number): Date {
  const passenger = this.passengers.at(index);
  const customAge = passenger.get('AgeLimitFromActivity').value;
  const today = this.flight && this.departureDate ? new Date(this.departureDate) : new Date();

  if (customAge !== null && customAge !== undefined) {
    return new Date(today.getFullYear() - customAge, today.getMonth(), today.getDate());
  }

  return this.maxDateChild; // fallback
}

getMinDateForChild(index: number): Date {
  const passenger = this.passengers.at(index);
  const customAge = passenger.get('AgeLimitFromActivity').value;

  const today = this.flight && this.departureDate ? new Date(this.departureDate) : new Date();

  if (customAge !== null && customAge !== undefined) {
    return new Date(today.getFullYear() - (customAge + 1), today.getMonth(), today.getDate() + 1);
  }

  return this.minDateChild; // fallback
}
  createContactForm() {
    this.contactForm = this.fb.group({
      passengers: this.fb.array([]),
      contact: this.fb.group({
        Title: [''],
        FirstName: ['', [Validators.required]],
        MiddleName: [''],
        LastName: ['', [Validators.required]],
        countryCode: ['44', [Validators.required]],
        phoneAreaCode: '',
        phoneExtensionCode: '',
        phoneNumber: ['', [Validators.pattern(/^([.-\s]?)?(\d[.-\s]?){7,10}\d$/)]],
        Email: [''],
        message: [''],

        Address: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
        Address2: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
        City: new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]),
        State: new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]),
        PostalCode: new FormControl('', [Validators.pattern(this.utility.regExp.zipCode), Validators.maxLength(10)]),
        PhoneCode: new FormControl('44', [Validators.required]),
        Contact: new FormControl('', [Validators.required, Validators.pattern(/^([.-\s]?)?(\d[.-\s]?){7,10}\d$/)]),
        Country: new FormControl('GBR', [Validators.required]),
        CustomerEmail: ['', [Validators.required, Validators.email]]
      }),
      usaForm: [0],
      usaDetailsForm: this.fb.group({
        country_name: ['USA'],
        gender: ['Male'],
        types: ['resident'],
        address: [''],
        city: [''],
        state: [''],
        postal_code: ['']
      }),
      baggageProtection: [false],
      remark: new FormControl('')
    });
  }

  createTransferForm() {
    this.transferContactForm = this.fb.group({
      journey1: this.fb.array([this.addJouney1Form()]),
      journey2: this.fb.array([this.addJouney2Form()]),
      bookingQuestions: this.fb.array([]),
      accomodation: this.fb.array([this.addAccomodationForm()]),
    });
  }

  createAcivityForm() {
    this.activityContactForm = this.fb.group({
      bookingQuestions: this.fb.array([])
    })
  }

  addJouney1Form(): FormGroup {
    const baseControls = {
      DepCity: new FormControl(''),
      DepPoint: new FormControl(''),
      DepInfo: new FormControl(''),
      DepExtraInfo: new FormControl(''),
    };

  if (!this.transfer.IsAccomadationAddress && this.transfer.LocTypeFrom === 'AP') {
      baseControls.DepCity = new FormControl('', Validators.required);
      baseControls.DepPoint = new FormControl('', Validators.required);
      baseControls.DepInfo = new FormControl('', Validators.required);
      baseControls.DepExtraInfo = new FormControl('', Validators.required);
  }
  return this.fb.group(baseControls);

}

  addJouney2Form(): FormGroup {
    // Define the base form controls with default values
    const baseControls = {
      RetPoint: new FormControl(''),
      RetCity: new FormControl(''),
      RetInfo: new FormControl(''),
      RetExtraInfo: new FormControl('')
    };
    // Conditionally add validators if IsAccomadationAddress equals 1
    if (this.transfer.IsAccomadationAddress === 1 && this.transfer.LocTypeTo === 'AP') {
      baseControls.RetPoint = new FormControl('', Validators.required);
      baseControls.RetCity = new FormControl('', Validators.required);
      baseControls.RetInfo = new FormControl('', Validators.required);
      baseControls.RetExtraInfo = new FormControl('', Validators.required);
    }
    // Return the form group with the configured controls
    return this.fb.group(baseControls);
  }
  


  addBookingQuestions() {
    const bookingQuestionsArray = this.transferContactForm.get('bookingQuestions') as FormArray;
    // Clear existing booking questions if needed
    bookingQuestionsArray.clear();
    for (const question of this.transfer.BookingQuestions) {
      bookingQuestionsArray.push(this.createBookingQuestionForm(question));
    }
  }

  addActivityBookingQuestions() {
    const bookingQuestionsArray = this.activityContactForm.get('bookingQuestions') as FormArray;
    // Clear existing booking questions if needed
    bookingQuestionsArray.clear();
    for (const question of this.activity.BookingQuestions) {
      bookingQuestionsArray.push(this.createActivityBookingQuestionForm(question));
    }
  }

    createActivityBookingQuestionForm(question: any): FormGroup {
    const formGroup = this.fb.group({
      answer: new FormControl('', [Validators.required]),
      // You can add more fields based on the structure of the question object
    });

    for (const key in question) {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        formGroup.addControl(key, new FormControl(question[key]));
      }
    }

    return formGroup;
  }

  createBookingQuestionForm(question: any): FormGroup {
    const formGroup = this.fb.group({
      answer: new FormControl('', [Validators.required]),
      // You can add more fields based on the structure of the question object
    });

    for (const key in question) {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        formGroup.addControl(key, new FormControl(question[key]));
      }
    }

    return formGroup;
  }

  addAccomodationForm(): FormGroup {
    // Define base form controls with default values
    const baseControls = {
      J1_AccommodationAddress: new FormControl(''),
      J1_PropertyName: new FormControl(''),
      AccommodationAddress: new FormControl(this.transfer.Destination)
    };
   // baseControls.AccommodationAddress.disable();
    // Conditionally add validators if IsAccomadationAddress is true
    if (this.transfer.IsAccomadationAddress) {
      baseControls.J1_AccommodationAddress = new FormControl(this.transfer.Origin, Validators.required);
      baseControls.J1_PropertyName = new FormControl(this.transfer.Origin, Validators.required);
      baseControls.AccommodationAddress = new FormControl(this.transfer.Origin, Validators.required);
    }
    // Return the form group with the configured controls
    return this.fb.group(baseControls);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  patchPassengers(adults) {
    this.passengers.patchValue(adults);
    this.cdRef.detectChanges();
  }


  get passengers() {
    return this.contactForm.get('passengers') as FormArray;
  }

  addPassenger(tt: string, i: number, lead = 0, activityAge, modules) {
    this.passengers.push(this.createPassenger(tt, i, lead,activityAge, modules));
  }

  createPassenger(tt: string, i: number, lead = 0, activityAgeLimit?: number, modules?:any[]): FormGroup {
    const title = tt == 'infants' ? 'Miss' : 'Mr';
    const paxType = tt == 'adults' ? 1 : (tt == 'infants' ? 3 : 2);
    const bookingFlightData = this.flightService.bookingFlightData.getValue();
    let dateOfBirth: any;
    // if (paxType == 2) {
    //     dateOfBirth = this.setChildDateOfBirth(bookingFlightData,i);
    // }
    // if (paxType == 3) {
    //     dateOfBirth = this.setInfantDateOfBirth(bookingFlightData,i);
    // }
    console.log("dateOfBirth ccc", dateOfBirth)
    return this.fb.group(
      {
        IsLeadPax: lead,
        Title: [''],
        FirstName: ['', [Validators.required]],
        MiddleName: [''],
        LastName: ['', [Validators.required]],
        PaxType: paxType,
        Gender: ['', [Validators.required]],
        DateOfBirth: ['', [Validators.required]],
        PassportNumber: this.flightType == 'International' ? ['', [Validators.required]] : [''],
        PassportExpiryDate: this.flightType == 'International' ? ['', [Validators.required]] : [''],
        PassportIssuingCountry: ['GBR',],
        Nationality: ['GBR'],
        CountryCode: '',
        CountryName: '',
        ContactNo: '',
        PhoneAreaCode: '',
        PhoneExtensionCode: '',
        City: '',
        PinCode: '',
        AddressLine1: '',
        AddressLine2: '',
        Email: '',
        travellerType: tt,
        travellerTypeCount: i + 1,
        BaggageId: [],
        MealId: [],
        SeatId: [],
        SelectedSeats: [],
        SelectedSelectorId: 0,
        PassengerSelection: '',// Used for passenger selection
        AgeLimitFromActivity: activityAgeLimit ? activityAgeLimit : null,
        modules: modules
      }
    );
  }


  onUpdatePassenges(phonecode: any) {
    phonecode = phonecode.split(/[()]/)[1];
    const result = this.phoneCodes.find(c => c.phone_code == phonecode);
    this.passengers.value.forEach((e, i) => {
      this.contactForm.controls['passengers']['controls'][i].patchValue({
        CountryCode: result.phone_code,
        CountryName: result.name
      });
    });
  }

  hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.contactForm.get(arrayControl) as FormArray;
      if (formArrayName && formArrayName != null)
        return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    } else {
      return ((this.submitted || this.contactForm.controls[controlName].touched) && this.contactForm.controls[controlName].hasError(errorName));
    }
  }

  hasContactError = (controlName: string, errorName: string, arrayControl?: string) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.contactForm.get(arrayControl) as FormArray;
      if (formArrayName && formArrayName != null)
        return ((this.submitted || formArrayName.controls[controlName].touched) && formArrayName.controls[controlName].hasError(errorName));
    }
  }

  getTravellersList() {
    this.subs.sink = this.apiHandlerService.apiHandler('userTravellersList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.travelList = res.data;
          this.cdRef.detectChanges();
        }
      });
  }

  addYearsToDate1(baseDate: Date, y: number, m: number, d: number): Date {
    return new Date(
        baseDate.getFullYear() + y,
        baseDate.getMonth() + m,
        baseDate.getDate() + d
    );
  }
  

  strtotime(modifier: string): Date {
    //const date = new Date(dateString);
    const data = this.flight.FlightInfo.FlightDetails.Details[0];
    const dobArray = new Date(data[0].Origin.DateTime)
    console.log("data", data)
    console.log("dobArray", dobArray)
    switch (modifier) {
      case '-100 years +1 day':
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - 100, dobArray.getMonth(), dobArray.getDate() + 1));
      case '-12 years -1 day':
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - 12, dobArray.getMonth(), dobArray.getDate() - 1));
      case '-2 years -1 day':
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - 2, dobArray.getMonth(), dobArray.getDate() - 1));
      case '-12 years':
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - 12, dobArray.getMonth(), dobArray.getDate()));
      case '-2 years':
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - 2, dobArray.getMonth(), dobArray.getDate()));
      default:
        return new Date();
    }
  }
  onTerms(e) {
    this.terms = e
  }

  getPassengerDetails() {
    this.flightService.passengerDetails.subscribe((data) => {
      if (data.length > 0) {
        this.patchValuesExt(data[1].contact);
        this.patchPassengers(data[1].passengers);
      }
    })
  }

  patchValuesExt(patchData) {
    this.contactForm.get('contact').patchValue({
      FirstName: patchData.FirstName,
      MiddleName: patchData.MiddleName,
      LastName: patchData.LastName,
      countryCode: patchData.countryCode,
      phoneAreaCode: patchData.phoneAreaCode,
      phoneExtensionCode: patchData.phoneExtensionCode,
      phoneNumber: patchData.phoneNumber,
      email: patchData.email,
    });
    this.cdRef.detectChanges();
  }

  getPhoneCodeList() {
    this.subs.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.phoneCodes = res.data;
          this.cdRef.detectChanges();
        }
      });
  }

  getTitleList() {
    this.subs.sink = this.apiHandlerService.apiHandler('userTitlelist', 'POST')
      .subscribe(res => {
        if (res) {
          this.titles = res.data;
          this.infantsTitles = res.data.filter(t => t.titleId == 3 || t.titleId == 4);
          this.cdRef.detectChanges();
        }
      });
  }

  getCountryList() {
    this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
      .subscribe(res => {
        if (res && res.data.countries.length) {
          this.flightService.countryList.next(res.data.countries)
          localStorage.setItem('flightCountryList', JSON.stringify(res.data.countries));
          this.countries = res.data.countries;
          this.cdRef.detectChanges();

        }
      });
  }

  setAdultDetails(passengerDetails, index, selectedSection) {
    this.setPassengerTitle(passengerDetails, selectedSection);
    this.contactForm.controls['passengers']['controls'][index].patchValue({
      Title: this.selectedTitle,
      FirstName: passengerDetails.first_name.toUpperCase(),
      MiddleName: passengerDetails.middle_name.toUpperCase(),
      LastName: passengerDetails.last_name.toUpperCase(),
      Gender: passengerDetails.gender,
      PassportNumber: passengerDetails.passport_no,
      PassportIssuingCountry: passengerDetails.issuing_country,
      DateOfBirth: new Date(formatDate(new Date(passengerDetails.date_of_birth), 'YYYY-MM-DD',)),
      PassportExpiryDate: new Date(formatDate(new Date(passengerDetails.passport_expiry), 'YYYY-MM-DD')),
      AddressLine1: passengerDetails.address,            //verify 
      AddressLine2: passengerDetails.address1,
      Email: passengerDetails.email,
      PinCode: passengerDetails.postal_code,
      City: passengerDetails.city,
      Nationality: passengerDetails.country,
    });
    console.log("passengerDetails.date_of_birth", passengerDetails.date_of_birth)
  }

  setPassengerTitle(passengerDetails, selectedSection) {
    let titleArray;
    if (selectedSection === 'adults') {
      titleArray = this.titles.filter(element => (element.paxType === "ADULT" && element.titleName === passengerDetails.title));
    }
    else {
      titleArray = this.titles.filter(element => (element.paxType === "CHILD" && element.titleName === passengerDetails.title));
    }
    if (titleArray.length == 0) {
      this.selectedTitle = "";
    } else {
      this.selectedTitle = passengerDetails.title;
    }
  }

  calculateTotalFare() {
    const activityFare = this.activity ? this.activity.Price.TotalDisplayFare || 0 : 0;
    const transferFare = this.transfer ? this.transfer.data.Price.TotalDisplayFare || 0 : 0;
    const hotelFare =  this.hotel ? this.hotel.Price.Amount || 0 : 0;
    const flightFare = this.flight ? this.flight.Price.TotalDisplayFare || 0 : 0; // Safely check if flight exists
  
    this.totalFare = activityFare + transferFare + hotelFare + flightFare;
  }

  clearDetails(index) {
    this.contactForm.controls['passengers']['controls'][index].patchValue({
      Title: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      Gender: '',
      PassportNumber: '',
      PassportIssuingCountry: 'GBR',
      DateOfBirth: '',
      PassportExpiryDate: '',
      AddressLine1: '',
      AddressLine2: '',
      Email: '',
      PinCode: '',
      City: '',
      Nationality: 'GBR',
      PassengerSelection: ''// Used for passenger selection
    });
  }

  alphaNumberOnly(e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  }

  openStaticPage(page_title) {
      sessionStorage.setItem('static_title', page_title);
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms'])
        );
        window.open('#' + url, '_blank');
  }

  setDateOfBirth(bookingFlightData: any, key: string, i: number): Date | string {
    if (bookingFlightData && bookingFlightData.hasOwnProperty('SearchData') && bookingFlightData.SearchData[key][i] != null) {
      return new Date(formatDate(new Date(bookingFlightData.SearchData[key][i]), 'DD/MM/YYYY'));
    } else {
      return '';
    }
  }

  
  isSameRoomGuests(roomGuests: any[]): boolean {
    if (!roomGuests || roomGuests.length === 0) return false;
    return roomGuests.every(guest => 
        guest.NoOfAdults === roomGuests[0].NoOfAdults && 
        guest.NoOfChild === roomGuests[0].NoOfChild
    );
}

  isAdult(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('ADT');
    if (result) {
      this.adultCount = flight.Price.PassengerBreakup.ADT.PassengerCount;
    }
    return result;
  }

  isYouth(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('YTH');
    if (result) {
      this.adultCount = flight.Price.PassengerBreakup.ADT.PassengerCount;
    }
    return result;
  }

  isChild(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('CHD');
    if (result) {
      this.childCount = flight['Price']['PassengerBreakup'].CHD.PassengerCount;
    }
    return result;
  }

  isInfant(flight: any) {
    const result = flight['Price']['PassengerBreakup'].hasOwnProperty('INF');
    if (result) {
      this.infantCount = flight['Price']['PassengerBreakup'].INF.PassengerCount;
    }
    return result;
  }

  setChildDateOfBirth(bookingFlightData: any, i: number): Date | string {
    return this.setDateOfBirth(bookingFlightData, 'childDOB', i);
  }

  setInfantDateOfBirth(bookingFlightData: any, i: number): Date | string {
    return this.setDateOfBirth(bookingFlightData, 'infantDOB', i);
  }


  onSubmitBooking() {
    this.submitted = true;
    const passengers = this.passengers.value;
    this.contactForm.get('contact').patchValue({
        FirstName: passengers[0].FirstName,
        LastName: passengers[0].LastName,
        Title: passengers[0].Title
    });
    if (!this.terms) {
        return;
    }
    if (!this.contactForm.valid) {
        return;
    }
    if (this.transfer && this.transfer.LocTypeFrom === 'AP' && !this.transferContactForm.get('journey1').valid) {
      this.showJournerError = true;
      return;
    } else {
      this.showJournerError = false;
    }
    if (this.isUpdatePassengers == true) {
        this.editPassengers();
    } else {
        this.processCommitBooking();
    }
}

editPassengers() {
    this.flightService.loading.next(false);
    if (this.flight['Attr']['is_usa']) {
        this.contactForm.patchValue({ usaForm: 0 });
    } else {
        this.contactForm.patchValue({ usaForm: 1 });
    }
    const passengers = this.passengers.value;
    // this.setSeatId(passengers);
    // this.setNull(passengers);
    const cEmail = this.contactForm.get('contact.Email').value;
    const cPhoneAreaCode = this.contactForm.get('contact.phoneAreaCode').value;
    const cPhoneExtensionCode = this.contactForm.get('contact.phoneExtensionCode').value;
    const cphoneNumber = this.contactForm.get('contact.Contact').value;
    const passportCountryName = this.contactForm.get('contact.countryCode').value;
    const cPhoneCode = this.contactForm.get('contact.countryCode').value;
    const cagentEmail = this.contactForm.get('contact.CustomerEmail').value;

    const passengersTemp = passengers.map(p => {
        console.log("paaaaa", p)
        const DateOfBirth = formatDate(p.DateOfBirth, '');
        p.PassportExpiryDate = p.PassportExpiryDate ? formatDate(p.PassportExpiryDate, '') : '';
        const PassportExpiry = p.PassportExpiryDate ? formatDate(p.PassportExpiryDate, '') : '';
        p.Email = cEmail;
        p.CustomerEmail = cagentEmail;
        p.PhoneCode = cPhoneCode.includes('(') ? cPhoneCode.split(/[()]/)[1] : cPhoneCode;
        p.ContactNo = cphoneNumber;
        let usaFormDetail = {};
        if (this.flight['Attr']['is_usa']) {
            Object.assign(usaFormDetail, {
                City: this.contactForm.get('usaDetailsForm.city').value,
                State: this.contactForm.get('usaDetailsForm.state').value,
                CountryName: this.contactForm.get('usaDetailsForm.country_name').value,
                CountryCode: 'GBR',
                AddressLine1: this.contactForm.get('usaDetailsForm.address').value,
                AddressLine2: '.',
                PinCode: this.contactForm.get('usaDetailsForm.postal_code').value,
                Gender: this.contactForm.get('usaDetailsForm.Gender').value,
                LocationType: this.contactForm.get('usaDetailsForm.types').value
            });

        }
        return { ...p, DateOfBirth, PassportExpiry, ...usaFormDetail };
    });
    const created_by_id = this.utility.readStorage('b2cUser', sessionStorage)['id'];
    let commitBookingBody = {
        UserId: created_by_id,
        // AppReference: this.appRef,
        booking_source: this.flight.booking_source,
        BookingSource: "B2B",
        SequenceNumber: 0,
        ResultToken: this.flightService.resultToken,
        Passengers: passengersTemp,

    }
    this.flightService.passengerDetails.next([commitBookingBody, this.contactForm.value]);
    this.subs.sink = this.apiHandlerService.apiHandler('updatePassengerDetails', 'POST', '', '', {
        // AppReference: this.appRef,
        booking_source: this.flight.booking_source,
        passengerData: passengersTemp
    })
        .subscribe(response => {
            if (response.Status) {
                this.subs.sink = this.flightService.CommitBookingResponse.subscribe(res => {
                    let flights = res;
                    flights.PassengerDetails = response.data;
                    this.flightService.edditedResponse.next(flights);
                });
                this.router.navigate(['/cart/booking-confirmation']);
            } else {
                this.swalService.alert.oops(response.Message);
                setTimeout(() => {
                    this.router.navigate(['/cart/bookings']);
                }, 100);
            }
            this.flightService.loading.next(false);
        })

}

processCommitBooking() {
    // if (this.flight['Attr']['is_usa']) {
    //     this.contactForm.patchValue({ usaForm: 0 });
    // } else {
    //     this.contactForm.patchValue({ usaForm: 1 });
    // }
    this.contactForm.patchValue({ usaForm: 1 });
    const passengers = this.passengers.value;
    // this.setSeatId(passengers);
    // this.setBaggageId(passengers);
    // this.setMealId(passengers);
    let bookingQuestions = this.transfer ? this.transferContactForm.get('bookingQuestions').value : '';
    let activitybookingQuestions = this.activity ? this.activityContactForm.get('bookingQuestions').value : '';
    let accomodation= this.transfer ? this.transferContactForm.get('accomodation').value : '';
    let journey1= this.transfer ? this.transferContactForm.get('journey1').value : '';
    let journey2= this.transfer ? this.transferContactForm.get('journey2').value : '';
    let extras = this.transfer ? this.updateSelectedValues() : '';
    const cEmail = this.contactForm.get('contact.Email').value;
    const cPhoneCode = this.contactForm.get('contact.countryCode').value;
    const cphoneNumber = this.contactForm.get('contact.Contact').value;
    const passengersTemp = passengers.map(p => {
        console.log("paaaaa", p)

        p.MealId = ["", null, undefined].indexOf(p.MealId) >= 0 ? [] : p.MealId
        p.SeatId = ["", null, undefined].indexOf(p.SeatId) >= 0 ? []  : p.SeatId
        p.BaggageId =  ["", null, undefined].indexOf(p.BaggageId) >= 0 ? []  : p.BaggageId
        const DateOfBirth = formatDate(p.DateOfBirth, '');
        p.PassportExpiryDate = p.PassportExpiryDate ? formatDate(p.PassportExpiryDate, '') : '';
        const PassportExpiry = p.PassportExpiryDate ? formatDate(p.PassportExpiryDate, '') : '';
        p.Email = cEmail;
        p.PhoneCode = cPhoneCode.includes('(') ? cPhoneCode.split(/[()]/)[1] : cPhoneCode;
        p.ContactNo = cphoneNumber;
        let usaFormDetail = {};
        return { ...p, DateOfBirth, PassportExpiry, ...usaFormDetail };
    });
    this.flightService.loading.next(true);
    if (this.flightService.isDevelopment) {
    } else {
        this.loading = true;
       
      
        let commitBookingBody = {
           
            BookingSource: "B2B",
            SequenceNumber: 0,
            ResultToken: this.cartItems ? this.cartItems.ResultIndex : '',
            Passengers: passengersTemp,
            AddressDetails: this.contactForm.get('contact').value,
            Remark: this.contactForm.get('remark').value,
            UserType: "B2B",
            //Currency: this.appGlobal.selectedCurrency.value,
            BlockRoomId: 0,
            UserId: sessionStorage.getItem('b2cUser') ? JSON.parse(sessionStorage.getItem('b2cUser'))['id'] : 0,
            refNumber: this.cartItems ? this.cartItems.refNumber : '',
            PropertyName: this.transfer ? this.transfer.Destination : "",
            BookingQuestions: this.transfer ? bookingQuestions : '',
            DepExtraInfo: this.transfer ? journey1[0].DepExtraInfo : "",
            DepInfo: this.transfer ? journey1[0].DepInfo : '',
            DepPoint: this.transfer ? journey1[0].DepPoint : '',
            Extras: this.transfer ? extras : '',
            J1_AccommodationAddress: this.transfer ? accomodation[0].J1_AccommodationAddress : '',
            J1_PropertyName: this.transfer ? accomodation[0].J1_PropertyName : '',
            AccommodationAddress: this.transfer ? accomodation[0].AccommodationAddress : '',
            RetExtraInfo: this.transfer ? journey2[0].RetExtraInfo : '',
            RetInfo: this.transfer ? journey2[0].RetInfo : '',
            RetPoint: this.transfer ? journey2[0].RetPoint : '',
            activityBookingQuestions: this.activity ? activitybookingQuestions : '',
            // PromoCode: ''
        }
        this.loading = true;
        this.subs.sink = this.apiHandlerService.apiHandler('commitBundleBooking', 'POST', '', '', commitBookingBody).subscribe(res => {
            if (res.Status) {
                this.loading = false;
                const BookingDetails = res.data;
                this.cartService.addBundleBookingPaxDetails.next(BookingDetails);
                sessionStorage.setItem('addBundleBookingPaxDetails', JSON.stringify(BookingDetails));
                this.router.navigate(['cart/booking-confirmation']);
            } else {
                this.swalService.alert.oops(res.Message);
                setTimeout(() => {
                    this.router.navigate(['/cart/bookings']);
                }, 100);
            }
            this.flightService.loading.next(false);
        });
    }
}

updateSelectedValues() {
  const updatedValues = this.selectedValues.map((value) => {
    if (value) {
      return {
        id: value.ExtrasID,
        NoOf: value.selectedCount || 0,
        code: value.ExtrasCode,
        name:value.Extras_Description
      };
    }
    return []; 
  }).filter(Boolean); 
  return updatedValues; // Return the filtered array
}


getSearchedList(event: any,value): void {
  this.depPoint=value;
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
              this.cdRef.detectChanges()
          });
      }
      else{
          this.searchedList=[];
      }
  }
}

getCity(event: any): void {
let city = `${event.AirportCity}, ${event.CountryName}, ${event.AirportName}(${event.AirportCode})`;
if (city) {
    if (event.inputFor === 'DepCity') {
      let controls=this.transferContactForm.get('journey1') as FormArray;
      let journeyControl = controls.at(0); // For the first journey
      journeyControl.patchValue({
        DepPoint:event.AirportCode,
        DepCity:city
      })
    } else {
      let controls=this.transferContactForm.get('journey2') as FormArray;
      let journeyControl = controls.at(0); // For the first journey
      journeyControl.patchValue({
        RetPoint:event.AirportCode,
        RetCity:city
      })
    }
    this.searchedList.length = 0;
}
this.cdRef.detectChanges();
}

getPrefferedAirlineList(event: any,value): void {
this.shouldPreferedAirLineHide=value;
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
            this.cdRef.detectChanges()
        });
}
}

getPreferredAirLineList(event: any): void {
let city = `${event.name}`;
city = city.replace(/\s+/g, '');
city = city.replace(/\b\w/g, char => char.toUpperCase());
//let city = `${event.name}, (${event.code})`;
if (city) {
  if (event.inputFor === 'prefferedAirline') {
    let controls=this.transferContactForm.get('journey1') as FormArray;
    let journeyControl = controls.at(0); // For the first journey
    journeyControl.patchValue({
      DepExtraInfo:city
    })
  } else {
    let controls=this.transferContactForm.get('journey2') as FormArray;
    let journeyControl = controls.at(0); // For the first journey
    journeyControl.patchValue({
      RetExtraInfo:city
    })
  }
  this.searchedAirLineList.length = 0;
}
this.cdRef.detectChanges();
}

setKey(){
  if (this.transfer.Extras) {
    this.transfer.Extras.forEach((_, index) => {
      this.selectedExtras[index] = ''; // Initialize with empty string or desired default value
    });
  }
}

generateOptions(maxNumberOfExtras: number): number[] {
  return Array.from({ length: maxNumberOfExtras }, (_, i) => i + 1);
}

setExtras(isChecked: boolean, value: any, index: number, defaultValue) {
  // value.Price = 10;
  if (isChecked) {
    this.selectedExtras[index] = defaultValue;
    value.selectedCount = defaultValue;
    if (!this.selectedValues.find(v => v.ExtrasCode === value.ExtrasCode)) {
      this.selectedValues.push(value);
    }
  } else {
    this.selectedExtras[index] = '';
    value.selectedCount = 0;
    this.selectedValues = this.selectedValues.filter(v => v.ExtrasCode !== value.ExtrasCode);
  }
  this.calculateTotal();
}

onDropdownChange(value: number, index: number, selectedValue: any) {
  let data = this.selectedValues.find(v => v.ExtrasCode === selectedValue.ExtrasCode);

  if (data) {
    // Update the selected count
    data.selectedCount = (+value);
  }
  this.selectedExtras[index] = value;
  this.calculateTotal();
  // Update the checkbox state based on the dropdown value
  if (value > 0) {
    this.setExtras(true, selectedValue, index,value);
  } else {
    this.setExtras(false, selectedValue, index,value);
  }
}
calculateTotal(){
this.extasTotal = 0;
this.selectedValues.forEach(v => {
    this.extasTotal += v.Price * v.selectedCount; // Adjust total based on selected counts
});
this.transferService.extrasValues.next(this.extasTotal);
}

isChecked(value: any): boolean {
  const index = this.selectedValues.findIndex(v => v.ExtrasCode === value.ExtrasCode);
  return index !== -1;
}


copyContact() {
    let passengers = <FormArray>this.contactForm.controls["passengers"];
    passengers.controls[0].patchValue({
        Title: this.contactForm.value.contact.Title,
        FirstName: this.contactForm.value.contact.FirstName,
        LastName: this.contactForm.value.contact.LastName,
        MiddleName: this.contactForm.value.contact.MiddleName,
    });
}

getBaggageProtection(val) {
    this.flightService.isBaggeProtected.next(val)
}

addYearsToDate(y: number) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year + y, month, day);
    return c;
}

  get roomsFormArray(): FormArray {
        return this.travellerForm.get('rooms') as FormArray;
      }

// createTravellerForm() {
//   this.travellerForm = this.fb.group({
//       rooms: this.fb.array([]),
//       // adults: this.fb.array([],this.uniqueFirstNameValidator()),
//       //  childs: this.fb.array([],this.childFirstNameValidator()),
//       address: this.fb.array([this.addAddressForm()]),
//       Aggreed: new FormControl(false, [Validators.required]),
//       remark: new FormControl('', ),
//   });
//   this.addRooms();
// }




addRooms() {
  this.hotelTraveller.forEach((element, index) => {
      console.log(element,element)
      this.noOfAdults += element.NoOfAdults;
      this.noOfChilds += element.NoOfChild;
      this.adult += element.NoOfAdults;
      this.child += element.NoOfChild;
      const roomGroup = this.fb.group({
      RoomId: [index + 1], // Assign RoomId
      travellers: this.fb.array([]) // Group travellers within each room
    });

    
    // Add room group to the form
    (this.travellerForm.get('rooms') as FormArray).push(roomGroup);

    // Add adults and children to the respective room
    for (let i = 0; i < element.NoOfAdults; i++) {
      let dateOfBirth = formatDate(this.maxDateAdult, 'YYYY-MM-DD');
      let age = this.utility.calculateAge(dateOfBirth);
      let isLeadPax = (i === 0);
      (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'adult','1',dateOfBirth,age,index + 1));
    }
    for (let i = 0; i < element.NoOfChild; i++) {
      let dateOfBirth=formatDate(this.maxDateChild, 'YYYY-MM-DD');
      let age = this.utility.calculateAge(dateOfBirth);
      let isLeadPax=false;
      (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'child','0',dateOfBirth,age,index + 1));
    }
  });
}
addTravellers(isLeadPax,type: string,PaxType,dateOfBirth,age,room?: number): FormGroup {
  return this.fb.group({
      type: [type], 
      Title: new FormControl(''),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.utility.regExp.fullName)]),
      LastName: new FormControl('', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.utility.regExp.userName)]),
      Dob: new FormControl(),
      //  Dob:new Date(formatDate(new Date(dateOfBirth), 'DD-MM-YYYY')),
    
      Age: new FormControl(age),
      RoomId:room,
      LeadPassenger:new FormControl(isLeadPax),
      PaxType:new FormControl(PaxType),
      PassengerSelectionAdult:''// Used for passenger selection
  })
}
uniqueFirstNameValidator() {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const firstNames = formArray.value.map((adult: any) => adult.FirstName);
    const hasDuplicate = firstNames.some((name: string, index: number) => firstNames.indexOf(name) !== index);
    return hasDuplicate ? { duplicateFirstName: true } : null;
  };
}
childFirstNameValidator() {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const firstNames = formArray.value.map((adult: any) => adult.FirstName);
    const hasDuplicate = firstNames.some((name: string, index: number) => firstNames.indexOf(name) !== index);
    return hasDuplicate ? { duplicateFirstName: true } : null;
  };
}


addAddressForm(): FormGroup {
  return this.fb.group({
      Title: new FormControl(''),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.utility.regExp.fullName)]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.utility.regExp.userName)]),
      Address: new FormControl('', [Validators.required, Validators.maxLength(120), Validators.minLength(2)]),
      Address2: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
      City: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      State: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      PostalCode: new FormControl('', [Validators.required, Validators.pattern(this.utility.regExp.zipCode), Validators.maxLength(10)]),
      Email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.utility.regExp.email)]),
      // PhoneCode: new FormControl('', [Validators.required]),
      PhoneCode: new FormControl('44', [Validators.required]),
      Contact: new FormControl('', [Validators.required, Validators.pattern(/^([.-\s]?)?(\d[.-\s]?){7,10}\d$/)]),
      Country: new FormControl('GBR', [Validators.required])
  })
}

trevellers(controlName: string): FormArray {
  return this.travellerForm.get(controlName) as FormArray;
}


addChildTravellers() {
  if (this.trevellers('childs').length < this.noOfChilds) {
      this.trevellers('childs').push(this.addChildTravellersFrom());
  }
}

addChildTravellersFrom(room?: number): FormGroup {
  return this.fb.group({
      Title: new FormControl(''),
      FirstName: new FormControl('', [Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.utility.regExp.fullName)]),
      LastName: new FormControl('', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.utility.regExp.userName)]),
      Dob: new FormControl(''),
      PassengerSelectionChild:'',
      RoomId:room,
  })
}

removeAdultTravellers(index?): void {
  if (this.trevellers('adults').length > 1) {
      this.trevellers('adults').removeAt(index);
  }
}

// hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number,roomIndex?: number): boolean => {
//   if (arrayControl !== undefined && roomIndex !== undefined) {
//       const formArray = this.travellerForm.get('rooms') as FormArray;
//       if (formArray && formArray.at(roomIndex)) {
//           const traveller = formArray.at(roomIndex).get(arrayControl) as FormArray;
//           if (traveller && traveller.at(i)) {
//           const control = traveller.at(i).get(controlName);
//           return control && (this.submitted || control.touched) && control.hasError(errorName);
//           }
//       }
//   } else {
//       const formArray = this.travellerForm.get(arrayControl) as FormArray;
//       const control = formArray.at(0).get(controlName);
//       return control && (this.submitted || control.touched) && control.hasError(errorName);
//   }
//   return false; // Return false if there's an issue with formArray or index
// };

startTimer() {
  this.interval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.cdRef.detectChanges(); 
    } else {
      clearInterval(this.interval);
      this.router.navigate(['/']); 
    }
  }, 1000);
}

ngOnDestroy() {
  if (this.interval) {
    clearInterval(this.interval);
  }
}

get formattedTime(): string {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

formatRoomDescription(desc): string {
  let parts;
  if (this.booking_source !== undefined && this.booking_source === 'TLAPNO00003' ) {
    parts = desc.RoomType;
  } else {
    parts = desc.Description;
  }
  return parts;
}

}
