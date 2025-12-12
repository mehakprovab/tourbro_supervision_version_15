import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalConfigDataI } from 'projects/b2b/src/app/shared/service/mat-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { FlightService } from '../flight.service';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { fakeCommitBookingResult } from '../flight.temp.service';
import { SubSink } from 'subsink';
import { formatDate } from '../../../../core/services/format-date';
import { AlertService } from '../../../../core/services/alert.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SwalService } from '../../../../core/services/swal.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import * as moment from 'moment';
import { NgbNavChangeEvent, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TripInfoComponent } from '../result/flight-details/trip-info/trip-info.component';
import { HotelComponent } from '../../hotel/hotel.component';
import { TransferSearchComponent } from '../../transfer/transfer-search/transfer-search.component';
import { CustomDialogWrapperComponent } from '../../../custom-dialog-wrapper/custom-dialog-wrapper.component';
import { CartService } from '../../../cart-booking/cart.service';
import { ActivitySearchFormComponent } from '../../activity/components/activity-search-form/activity-search-form.component';
export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {
        placement: 'right',
        container: 'body',
    });
}

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit, OnDestroy {
    @ViewChild('optionRef', { static: false }) optionRef: ElementRef;
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
    isCollapsed = true;
    isCollapsedFareSumm = true;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    modalConfigData: ModalConfigDataI;
    flight: any;
    flightString: any;
    traveller: any = false;
    travellerString: any;
    contactForm: FormGroup;
    usaDetailsForm: FormGroup;
    titles: any = [];
    infantsTitles: any = [];
    countries: any = [];
    loading: boolean;
    respData: any = [];
    selectedTitle;
    submitted: boolean = false;
    seatMapData:any;
    seatMapSectors:any;
    selectedPassengerIndex:any;
    selectedPassenger:any;
    selectedTabIndex: number = 0;
    keysArray = [];
    isSeatLoading:boolean=true;
    showSeatSelection:boolean=false;
    baggageMapSectors:any;
    baggageArray = [];
    baggageMapData:any={};
    mealMapSectors:any=[];
    selectedMealTabIndex: number = 0;
    mealArray = [];
    mealMapData:any={};
    html = `<div class="container">
    <div class="row py-3">
        <div class="col-12 font-weight-bold">
            Information on Entry of Name(s)
        </div>
        <div class="col-12 mt-2">
            Name of the <mark>Passenger(s)</mark> must be identical with the name displayed on the selected ID type.
        </div>
        <div class="col-12">
            <div class="row col-12 bg my-2 mx-0 p-3">
                <div class="col-12 mb-3"> <span class="font-weight-bold f-14"> Passport </span> </div>
                <div class="col-3 pt-4">
                    <i class=" fa fa-5x fa-users"></i>
                </div>
                <div class="col-9">
                    <div class="d-flex flex-column">
                        <div class="text-muted">
                            <small> Last name </small> 
                        </div>
                        <div class="text-dark">
                            <span>
                                JONH
                            </span>
                        </div>
                        <div class="text-muted mt-3">
                            <small> First & middle name </small> 
                        </div>
                        <div class="text-dark">
                            <span>
                            STEVE  DOE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mt-3 f-12">
            <span class="font-italic f-14"> 
                N.B.- 
            </span>
            Passenger(s) who don't have first names may enter their last name in the boxese for both "last name" and "first & middle names".
        </div>
    </div>
</div>`;

    isConfirmed = false;
    maxDate = new Date();
    minDateExpiry= new Date();
    maxDateExpiry;
    maxDateAdult: any;
    minDateAdult: any;
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    minDatePassportExpiry: any;
    extraServices = false;
    appRef: any;
    flightType: any;
    selectedBaggageTabIndex: number = 0;
    protected subs = new SubSink();
    private _jsonURL = 'assets/seatAvailabilityFormat.json';
    airline_logo: string = '';
    currentUser: any;
    minYouthAge: any;
    maxYouthAge: any;

    
    originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return 0;
      }
    
      reverseKeyOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
      }
    
      valueOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return a.value.localeCompare(b.value);
      }
      showRoundTripUI:boolean=false;
      travellerCount = 1;
      destinationCity = '';
      destinationCityModified = '';
      tripType = '';
      departureCity = '';
      displayCities = [];
      departureCityModified = '';
      departureDate: any = '';
      returnDate: any = '';
    autoSearchData: any;
    flightSearchData: any;
    cartMessage: string;
    cartItems: any;
    destCity: any;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private flightService: FlightService,
        private alertService: AlertService,
        private utility: UtilityService,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService,
        private http: HttpClient,
        private renderer: Renderer2,
        private dialog: MatDialog,
        private cartService: CartService

    ) {
    }
   
    ngOnInit() {
        this.setValues();
        this.getTravellersList();
        this.createContactForm();
        
        this.currentUser = this.utility.readStorage('currentUser', sessionStorage);
        this.flightSearchData  = JSON.parse(sessionStorage.getItem("flightSearchPostdata"));
        const flightSearchData = JSON.parse(sessionStorage.getItem('flightSearchData'));
        this.destCity = JSON.parse(sessionStorage.getItem("searchDataFlight"));
        console.log('City Code',this.destCity )
        // this.subs.sink = this.flightService.searchDataFlight.subscribe(res => {
        //     this.flightSearchData = res;
        // });

        this.subs.sink = this.flightService.bookingFlightData.subscribe(res => {
            if (typeof res == 'object' && res.JourneyList.hasOwnProperty('FlightDetails')) {
                this.flightService.extraFees.next(this.flightService.extraFees.value);
                this.traveller = this.flightService.traveller;
                // if ((res.JourneyList.booking_source == 'ZBAPINO00002' || res.JourneyList.booking_source == 'ZBAPINO00007') && (this.currentUser.id==2 || this.currentUser.id==134 || this.currentUser.id==121)) {
                //     this.showSeatSelection = true;
                //     this.getSeatLayout(res.JourneyList);
                // }
                this.flight = res.JourneyList;
                this.flightService.flightType.subscribe(data => {
                    this.flightType = data
                    this.passengers.clear();
                    let leadPax = 1;
                    const travellerData = {
                        adults: this.traveller.adults,
                        young: this.traveller.young,
                        childrens: this.traveller.childrens,
                        infants: this.traveller.infants,
                    }
                    for (let t of Object.keys(travellerData)) {
                        if (travellerData[t]) {
                            for (let i = 0; i < travellerData[t]; i++) {
                                this.addPassenger(t, i, leadPax);
                                leadPax = 0;
                            }
                        }
                    }
                })
            } else {
                this.router.navigate(['/dashboard']);
            }
            this.cdRef.detectChanges();
        });
        this.airline_logo = this.flightService.airline_logo;
        this.subs.sink = this.flightService.extraServices.subscribe(res => {
            if (res) {
                this.extraServices = true;
            } else {
                this.extraServices = false;
            }
        });
        
        this.flightService.userTitleList.subscribe(res => {
            if (res) {
                this.titles = res
            }
        });
        this.flightService.countryList.subscribe(res => {
            this.countries = res;
        });
        this.subs.sink = this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
      
        let depDate;
        if (flightSearchData['ReturnDate']) {
            depDate = flightSearchData['ReturnDate'];
        } else {
            depDate = flightSearchData['departureDate']
        }
        const date = new Date(depDate);
        if (flightSearchData['traveller'].young > 1) {
            this.maxDateAdult = this.addYearsToDateOfBirth(date, -16, 0, 0);
        } else {
            this.maxDateAdult = this.addYearsToDateOfBirth(date, -12, 0, 0);
        }
        
        this.minDateAdult = this.addYearsToDateOfBirth( date, -100, 0 ,0)
        this.minDateChild = this.addYearsToDateOfBirth(date,-12,0 , 1);
        this.maxDateChild = this.addYearsToDateOfBirth(date, -2, 0 , 0);
        this.maxYouthAge = this.addYearsToDateOfBirth(date,-12, 0, 0);
        this.minYouthAge = this.addYearsToDateOfBirth(date,-15, 0,0);
        this.maxDateInfant = this.addYearsToDateOfBirth(date,0,0, 0);
        this.minDateInfant = this.addYearsToDateOfBirth(date, -2, 0, 1);
        
        // this.maxDateInfant = new Date();
        // this.minDateInfant = this.strtotime( '-2 years');
        this.minDatePassportExpiry = new Date(date);
        this.minDatePassportExpiry = this.addYearsToDateOfBirth(date, 0, 0, 6);
        this.getPhoneCodeList();
        this.patchEmailToContact();
    }
    strtotime( modifier: string): Date {
        //const date = new Date(dateString);
        const data =this.flight.FlightDetails.Details[0];
        const dobArray = new Date(data[0].Origin.DateTime)
  console.log("data",data)
        console.log("dobArray",dobArray)
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
            case '-15 years +1 day':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 15, dobArray.getMonth(), dobArray.getDate() + 1));
            case '-12 years -1 day':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 12, dobArray.getMonth(), dobArray.getDate() - 1));
            default:
                return new Date();
        }
    }

    setValues(){
        this.flightService.setUserTitleList();
        this.flightService.setJourneyListPre();
        this.flightService.setFlightTraveller();
        this.flightService.setResultToken();
        this.flightService.setIsPanMandatory();
        this.flightService.setIsPassportMandatory();
    }
    
    getTravellersList() {
        this.subs.sink = this.apiHandlerService.apiHandler("travellerManagementList", "POST").subscribe((res) => {
            if (res && res.data.length) {
                this.respData = res.data;
                this.cdRef.detectChanges();
            }
        });
    }
      
      setAdultDetails(passengerDetails,index,selectedSection) {
        if(selectedSection == 'childrens'){
            var DateOfBirth = new Date(formatDate(new Date(passengerDetails.date_of_birth), 'DD/MM/YYYY')) 
        }
        this.setPassengerTitle(passengerDetails,selectedSection);
        this.contactForm.controls['passengers']['controls'][index].patchValue({
            Title:this.selectedTitle,
            FirstName:passengerDetails.first_name.toUpperCase(),
            MiddleName:passengerDetails.middle_name.toUpperCase(),
            LastName:passengerDetails.last_name.toUpperCase(),
            Gender:passengerDetails.gender,
            PassportNumber: passengerDetails.passport_no,
            PassportIssuingCountry:passengerDetails.issuing_country,
            // DateOfBirth:DateOfBirth,
            // PassportExpiry:new Date(formatDate(new Date(passengerDetails.passport_expiry), 'DD/MM/YYYY')),
            AddressLine1:passengerDetails.address,            //verify 
            AddressLine2:passengerDetails.address1,
            // Email:passengerDetails.email,
            PinCode:passengerDetails.postal_code,
            City:passengerDetails.city,
            Nationality:passengerDetails.country,
        });
       }

    setPassengerTitle(passengerDetails, selectedSection) {
        let titleArray;
        if (selectedSection === 'adults') {
            titleArray = this.titles.filter(element => (element.pax_type === "ADULT" && element.title === passengerDetails.title));
        }
        else {
            titleArray = this.titles.filter(element => (element.pax_type === "CHILD" && element.title === passengerDetails.title));
        }
        if (titleArray.length == 0) {
            this.selectedTitle= "";
        }else
        {
            this.selectedTitle=passengerDetails.title;
        }
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
            PassportExpiry: '',
            AddressLine1: '',
            AddressLine2: '',
            Email: '',
            PinCode: '',
            City: '',
            Nationality: 'GBR',
            PassengerSelection:''// Used for passenger selection
        });
    }

    onTerms(e) {
        this.terms = e
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

    createContactForm() {
        this.contactForm = this.fb.group({
            passengers: this.fb.array([]),
            contact: this.fb.group({
                phoneCode: ['+880', [Validators.required]],
                phoneNumber: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                CustomerEmail: ['', [Validators.required, Validators.email]],
                message: ['',[Validators.pattern('^[a-zA-Z0-9 ]*$')]]
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
            baggageProtection: [false]
        });
  
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    createUsaDetailsForm() {
        this.usaDetailsForm = this.fb.group({
            // passengers: this.fb.array([]),
            // contact: this.fb.group({
            //     countryCode: ['+91', [Validators.required]],
            //     phoneAreaCode: '080',
            //     phoneExtensionCode: '91',
            //     phoneNumber: [123456789, [Validators.required]],
            //     email: ['', [Validators.required, Validators.email]],
            //     message: ['', [Validators.required]]
            // })
        });
    }

    get passengers() {
        return this.contactForm.get('passengers') as FormArray;
    }

    addPassenger(tt: string, i: number, lead = 0) {
        this.passengers.push(this.createPassenger(tt, i, lead));
    }
    intialSpaceNotAllow(): ValidatorFn  {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) {
            return null; // Allow empty values
            }
            const value = control.value as string;
            if (value.startsWith(' ')) {
            return { initialSpace: true };
            }
            return null;
        };
    }
   
    createPassenger(tt: string, i: number, lead = 0): FormGroup {
        const title = tt == 'adults' ? 'Mr' : (tt == 'infants' ? 'Miss' : 'Miss');
        const paxType = tt == 'adults' ? 1 : tt == 'young' ? 4 : (tt == 'infants' ? 3 : 2);
        const bookingFlightData = this.flightService.bookingFlightData.getValue();
        let dateOfBirth:any;
        // if (paxType == 2) {
        //     dateOfBirth = this.setChildDateOfBirth(bookingFlightData,i);
        // }
        // if (paxType == 3) {
        //     //dateOfBirth = this.setInfantDateOfBirth(bookingFlightData,i);
        // }
        console.log("dateOfBirth bbbbb",dateOfBirth)
        return this.fb.group(
            {
                IsLeadPax: lead,
                Title: ['', [Validators.required]],
                FirstName: ['', [Validators.required]],
                MiddleName: '',
                LastName: ['', [Validators.required,Validators.minLength(2), this.intialSpaceNotAllow()]],
                PaxType: paxType,
                Gender: ['', [Validators.required]],
                DateOfBirth: [dateOfBirth],
                PassportNumber: this.flightType == 'International' ? ['', [Validators.required]] : [''],
                PassportExpiry: this.flightType == 'International' ? ['', [Validators.required]] : [''],
                PassportIssuingCountry: ['GBR',[Validators.required]],
                Nationality: ['GBR',[Validators.required]],
                CountryCode: ['GBR'],
                CountryName: ['United Kingdom',],
                ContactNo: '',
                PhoneCode: '',
                City: ['Gulshan Dhaka'],
                PinCode: '1212',
                AddressLine1: 'House 11/B Road; 130 Gulshan-1',
                AddressLine2: 'House 11/B Road; 130 Gulshan-1',
                Email: '',
                CustomerEmail: '',
                travellerType: tt === 'young' ? 'youths' : tt,
                travellerTypeCount: i + 1,
                BaggageId: [],
                MealId: [],
                SeatId: [],
                SelectedSeats: [],
                SelectedSelectorId:0,
                PassengerSelection:''// Used for passenger selection
            }
        
        );
    }

    onUpdatePassenges(phonecode: any) {
        phonecode = phonecode.split(/[()]/)[1];
        const result = this.phoneCodes.find(c => c.phone_code == phonecode);
        this.passengers.value.forEach((e, i) => {
            this.contactForm.controls['passengers']['controls'][i].patchValue({
                PhoneCode: result.phone_code,
                CountryName: result.name,
                // FirstName:this.currentUser.first_name,
                // LastName:this.currentUser.last_name,
                // phoneNumber:this.currentUser.phone
            });
        });
    }

    onSubmitBooking() {
        this.submitted=true;
        if (!this.terms) {
            this.swalService.alert.oops("Please accept Terms and Conditions/Privacy Policy.");
            return;
        }
        let baggageProtection = this.contactForm.value.baggageProtection;
        if (this.flight['Attr']['is_usa']) {
            this.contactForm.patchValue({ usaForm: 0 });
        } else {
            this.contactForm.patchValue({ usaForm: 1 });
        }
        const passengers = this.passengers.value;
        this.setSeatId(passengers);
        this.setNull(passengers);
        const cEmail = this.contactForm.get('contact.email').value;
        
        const cPhoneCode = this.contactForm.get('contact.phoneCode').value;
        const cphoneNumber = this.contactForm.get('contact.phoneNumber').value;
        const remark = this.contactForm.get('contact.message').value;
        const passengersTemp = passengers.map((p, i) => {
            const DateOfBirth = formatDate(p.DateOfBirth, '');   
         
            if (p.PassportNumber == '' && (this.flight.booking_source != 'ZBAPINO00009' && this.flight.booking_source != 'ZBAPINO00008')) {
                p.PassportNumber = "BP012543" + i + (i + 1);
            }
            if (p.PassportExpiry == '') {
                p.PassportExpiry = formatDate(this.addYearsToDate(+5, +0), '');
            } else {
                p.PassportExpiry = formatDate(p.PassportExpiry, '');
            }
            const PassportExpiryDate = p.PassportExpiry;
            p.Email = cEmail;
            p.CustomerEmail = this.contactForm.get('contact.CustomerEmail').value;
            p.PhoneCode = cPhoneCode.includes('(') ? cPhoneCode.split(/[()]/)[1] : cPhoneCode;
            p.phoneAreaCode = cPhoneCode.includes('(') ? cPhoneCode.split(/[()]/)[1] : cPhoneCode;
            p.ContactNo = cphoneNumber;
            let usaFormDetail = {};
            if (this.flight['Attr']['is_usa']) {
                Object.assign(usaFormDetail, {
                    City: this.contactForm.get('usaDetailsForm.city').value,
                    State: this.contactForm.get('usaDetailsForm.state').value,
                    CountryName: this.contactForm.get('usaDetailsForm.country_name').value,
                    CountryCode: 'BGD',
                    AddressLine1: this.contactForm.get('usaDetailsForm.address').value,
                    AddressLine2: '.',
                    PinCode: this.contactForm.get('usaDetailsForm.postal_code').value,
                    Gender: this.contactForm.get('usaDetailsForm.Gender').value,
                    LocationType: this.contactForm.get('usaDetailsForm.types').value
                });
        
    }
    console.log("DateOfBirth cccc",DateOfBirth)
            p.CountryCode = p.Nationality;
            return { ...p,DateOfBirth, PassportExpiryDate, ...usaFormDetail };
        });
        this.flightService.loading.next(true);
        if (this.flightService.isDevelopment) {
            setTimeout(_ => {
                const res = fakeCommitBookingResult();
                this.flightService.loading.next(false);
                if (res.Status) {
                    this.router.navigate(['/search/flight/confirm-passenger']);
                } else {
                    this.alertService.error(res.Message);
                    window.alert(res.Message);
                }
            }, 3000);
        } else {
            this.subs.sink = this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
                module: "flight"
            }).subscribe(res => {
                if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                    this.appRef = res.data;
                    if (baggageProtection) {
                        this.subs.sink = this.apiHandlerService.apiHandler('servicePurchase', 'post', {}, {}, {
                            app_reference: this.appRef,
                            booking_source: this.flight.booking_source
                        }).subscribe(resp => {
                            if (resp.statusCode == 200 || resp.statusCode == 201) {
                            }
                        });
                    }
                    const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
                    let data = {
                        UserId: created_by_id,
                        AppReference: this.appRef,
                        BookingSource: this.flight.booking_source,
                        SequenceNumber: 0,
                        ResultToken: this.flightService.resultToken,
                        Passengers: passengersTemp
                    }
                    let business_name= this.currentUser.business_name.replace(/[^a-zA-Z0-9 ]/g, ' ');
                    this.subs.sink = this.apiHandlerService.apiHandler('commitBooking', 'POST', '', '', {
                        UserId: created_by_id,
                        UserType: 'B2B',
                        AppReference: this.appRef,
                        booking_source: this.flight.booking_source,
                        BookingSource: "B2B",
                        SequenceNumber: 0,
                        ResultToken: this.flightService.resultToken,
                        Passengers: passengersTemp,
                        Remark:"Booking 247 B2B "+business_name+" "+remark
                    }).subscribe(res => {
                        if (res.Status) {
                            const BookingDetails = res.data.CommitBooking.BookingDetails;
                            this.flightService.CommitBookingResponse.next(BookingDetails);
                            localStorage.setItem('b2bFlightCommitBookingResponse', JSON.stringify(BookingDetails));
                            this.flightService.loading.next(false);
                            this.router.navigate(['/search/flight/confirm-passenger']);
                        }
                    }, (err) => {
                        this.swalService.alert.oops(err.error.Message);
                        this.flightService.loading.next(false);
                        setTimeout(() => {
                            this.router.navigate(['/search/flight/result']);
                        }, 100);
                    }
                    );
                }
            })
        }
    }

    getBaggageProtection(val) {
        this.flightService.isBaggeProtected.next(val)
    }

    addYearsToDate(y: number, m: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month + m, day);
        return c;
    }

    addYearsToDateOfBirth(baseDate: Date, y: number, m: number, d: number): Date {
        return new Date(
            baseDate.getFullYear() + y,
            baseDate.getMonth() + m,
            baseDate.getDate() + d
        );
    }
    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'kg' || bg[1] == 'Kg' || bg[1] == 'KGS' || bg[1] == 'Kgs') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    alphaNumberOnly (e) {  // Accept only alpha numerics, not special characters 
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
    onBaggageSelection(item: any, selectedSectorIndex: any, selectedBaggageIndex: any, passengerIndex: any, passenger: any) {
        const selectedBaggage = item.value[selectedBaggageIndex];
        this.setSelectedPassenger(passengerIndex);
        const sector = this.baggageMapSectors.get(item.key) || [];
        const key = item.key; // Assuming item.key is a valid string
        // Ensure the sector array has a certain length and fill with empty objects if needed
        while (sector.length <= passengerIndex) {
            sector.push({ [key]: null });
        }
        selectedBaggage.SelectedBaggageSector = selectedSectorIndex;
        selectedBaggage.SelectedBaggagePassengerIndex = passengerIndex;
        // Push baggageCode into the passenger's object with a key
        sector[passengerIndex][item.key] = selectedBaggage;
        // Update the baggageMapSectors
        this.baggageMapSectors.set(item.key, sector);
        this.setBaggagePrice();
        passenger.patchValue({
            SelectedBaggage: sector,
            SelectedBaggageSector: selectedSectorIndex,
            SelectedBaggagePassengerIndex: passengerIndex
        });
    }
    hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
        if (typeof arrayControl !== 'undefined') {
            let formArrayName = this.contactForm.get(arrayControl) as FormArray;
            return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
        } else {
            return ((this.submitted || this.contactForm.controls[controlName].touched) && this.contactForm.controls[controlName].hasError(errorName));
        }
    }
    removeBaggage(item: any, sectorIndexToRemove: any, selectedPassengerToRemove: any, passenger: any) {
        // Get the sector array for the specified item
        const sector = this.baggageMapSectors.get(item.key) || [];
        // Check if the sectorIndexToRemove and selectedPassengerToRemove are within valid bounds
        if (
            sectorIndexToRemove >= 0 &&
            sectorIndexToRemove <=sector.length &&
            selectedPassengerToRemove >= 0 
            //&& selectedPassengerToRemove <= Object.keys(sector[selectedPassengerToRemove]).length
        ) {
            // Remove the baggage value for the specified user and index
            sector[selectedPassengerToRemove][item.key] = null;
            // Update the baggageMapSectors
            this.baggageMapSectors.set(item.key, sector);
            // Update the passenger's SelectedBaggage with the modified sector
            passenger.patchValue({
                SelectedBaggage: sector,
                Baggage:''
            });
            this.setBaggagePrice();
        }
    }
    setBaggagePrice() {
        let total = 0;
        for (const baggageSector of this.baggageMapSectors) {
            for (const baggage of Object.values(baggageSector[1])) {
                for (const baggageDetail of Object.values(baggage)) {
                    if (baggageDetail) {
                        total += baggageDetail.Price;
                    }
                }
            }
        }
        this.flightService.baggageFees.next({
            baggageFee: total
        });
        localStorage.setItem('baggageFee', JSON.stringify(total));
    }
    onMealTabSelected(event: NgbNavChangeEvent): void {
        let id = +event.nextId;
        this.setSelectedMealTab(id);
    }
    getSeatLayout(res) {
        this.isSeatLoading=true;
        let request={
            ResultToken:res.ResultToken,
            booking_source:res.booking_source
        }
        this.apiHandlerService.apiHandler('flightSeatAvailability', 'POST', '', '',request).subscribe(response => {
            if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                this.seatMapData=response.data.seat_map;
                this.setSeatMapSectors(this.seatMapData);
                this.setSelectedPassenger(0);
                this.isSeatLoading=false;
                this.cdRef.detectChanges();
            }
            else{
                this.isSeatLoading=false;
                this.cdRef.detectChanges();
            }
        }, (error) => {
            this.isSeatLoading=false;
            this.cdRef.detectChanges();
        }
        );
    }

    onCheckboxChange(item: any, selectedSectorIndex: any, selectedSeat: any, event: any) {
        if (!this.selectedPassenger || (this.selectedPassenger.controls.SelectedSeats.value || []).some(s => s.sectorIndex === selectedSectorIndex && s.selectedPassenger === this.selectedPassengerIndex) || (selectedSeat.value.hasOwnProperty('isSelected') && selectedSeat.value.isSelected)) {
            return;
          }
          const seatCode = selectedSeat.value.SeatCode;
          const sector = this.seatMapSectors.get(item.key) || [];
          selectedSeat.value.isSelected = true;
          selectedSeat.value.sectorIndex = selectedSectorIndex;
          selectedSeat.value.selectedPassenger = this.selectedPassengerIndex;
          this.keysArray.push(selectedSeat.value);
          this.selectedPassenger.patchValue({
            SelectedSeats: this.keysArray,
            SelectedSelectorId: selectedSectorIndex
          });
          sector.push(seatCode);
          this.cdRef.detectChanges();
          this.setSelectedPassenger(this.selectedPassengerIndex + 1);
          this.moveToNextOption(this.optionRef, this.selectedPassengerIndex);
          this.seatMapSectors.set(item.key, sector);
    }

    moveToNextOption(currentOption: ElementRef, nextIndex: number) {
        if (nextIndex < 0 || nextIndex >= this.passengers.value.length) {
            const isAllSeatsSelected = this.keysArray.filter(value => value.sectorIndex === this.selectedTabIndex).length === this.passengers.value.length;
            if (isAllSeatsSelected && nextIndex >= this.passengers.value.length) {
                this.setSelectedTab(this.selectedTabIndex + 1);
            }
            this.setSelectedPassenger(0);
            nextIndex = 0;
        }
        const nextOption = currentOption.nativeElement.parentElement.parentElement.querySelectorAll('input')[nextIndex];
        this.renderer.setProperty(nextOption, 'checked', true);
        nextOption.focus();
    }

    removeSeat(item: any, sectorIndexToRemove: any, seat: any, selectedPassengerToRemove: any, passenger: any) {
        const passengerData = passenger.controls.SelectedSeats.value;
        const index = passengerData.findIndex((item) => item.sectorIndex === sectorIndexToRemove && item.selectedPassenger === selectedPassengerToRemove);
        if (index !== -1) {
            passengerData.splice(index, 1);
            passenger.patchValue({ SelectedSeats: passengerData });
        }
        const sector = this.seatMapSectors.get(item.key) || [];
        const sectorIndex = sector.indexOf(seat.SeatCode);
        if (sectorIndex !== -1) {
            sector.splice(sectorIndex, 1);
            seat.isSelected = false;
            this.cdRef.detectChanges();
        }
        this.seatMapSectors.set(item.key, sector);
        this.setSelectedPassenger(selectedPassengerToRemove);
        this.moveToNextOption(this.optionRef, this.selectedPassengerIndex);
    }

    setSeatMapSectors(seatMapData){
        const map = new Map<any, any>();
        for (let item of Object.keys(seatMapData)) {
            map.set(item, []);
        }
        this.seatMapSectors=map;
    }
    
    public getJSON(): Observable<any> {
        return this.http.get(this._jsonURL);
    }
    
    setSelectedPassenger(ii) {
        const filteredArray = this.passengers.controls.filter((passenger) => {
          const control = passenger as FormGroup;
          return control.controls.travellerType.value !== 'infants';
        });
      
        if (filteredArray[ii]) {
          this.selectedPassengerIndex = ii;
          this.selectedPassenger = filteredArray[ii];
        } else {
          this.setSelectedTab(this.selectedTabIndex + 1);
        }
    }

    onTabSelected(event: NgbTabChangeEvent): void {
      let id=+event.nextId;
       this.setSelectedTab(id);
    }
    setSelectedMealTab(id) {
        this.selectedMealTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        this.setMeal(id);
    }
    setMeal(id) {
        const mealMapSectors = Array.from(this.mealMapSectors);
        // Retrieve the selected baggage data based on the new tab's id
        const sector = mealMapSectors[id] || [];
        // Iterate through the passengers in your FormArray
        this.passengers.controls.forEach((passenger, passengerIndex) => {
            const selectedMeal = sector[1] || null;
            // Update the passenger's SelectedBaggage field
            passenger.patchValue({
                SelectedMeal: selectedMeal,
                SelectedMealSector: id,
                SelectedMealPassengerIndex: passengerIndex,
                Meal:''
            });
            this.cdRef.detectChanges();
        });
    }
    setSelectedTab(id){
        this.selectedTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        for (const passenger of this.passengers.controls) {
            passenger.patchValue({
                SelectedSelectorId: this.selectedTabIndex
            });
        }
    }
    onMealSelection(item: any, selectedSectorIndex: any, selectedMealIndex: any, passengerIndex: any, passenger: any) {
        const selectedMeal = item.value[selectedMealIndex];
        this.setSelectedPassenger(passengerIndex);
        const sector = this.mealMapSectors.get(item.key) || [];
        const key = item.key; // Assuming item.key is a valid string
        // Ensure the sector array has a certain length and fill with empty objects if needed
        while (sector.length <= passengerIndex) {
            sector.push({ [key]: null });
        }
        selectedMeal.SelectedMealSector = selectedSectorIndex;
        selectedMeal.SelectedMealPassengerIndex = passengerIndex;
        // Push baggageCode into the passenger's object with a key
        sector[passengerIndex][item.key] = selectedMeal;
        // Update the baggageMapSectors
        this.mealMapSectors.set(item.key, sector);
        this.setMealPrice();
        passenger.patchValue({
            SelectedMeal: sector,
            SelectedMealSector: selectedSectorIndex,
            SelectedMealPassengerIndex: passengerIndex
        });
    }
    isSeatSelected(sectorIndex: number,selectedPassenger: number, passenger:any): boolean {
        if(passenger && passenger.controls.SelectedSeats.value!=null){
            return passenger.controls.SelectedSeats.value.some(s => s.sectorIndex === sectorIndex && s.selectedPassenger === selectedPassenger);
        }
      }

    setSeatId(passengers: any[]) {
        passengers.forEach((passenger, i) => {
            passenger.SeatId=[];
            if(this.seatMapSectors){
                // Add null values to passenger.SeatId based on this.seatMapSectors.size
            for (let j = 0; j < this.seatMapSectors.size; j++) {
                passenger.SeatId.push(null);
            }
            if (passenger.SelectedSeats && passenger.SelectedSeats.length > 0) {
                const result = passenger.SelectedSeats.filter((seat) => seat.selectedPassenger === i);
                result.forEach((seat) => {
                    passenger.SeatId[seat.sectorIndex] = seat.ResultToken;
                });
            }
            }
        });
    }

    setDateOfBirth(bookingFlightData: any, key: string, i: number): Date | string {
        console.log("key",key)
        if (bookingFlightData && bookingFlightData.hasOwnProperty('SearchData') && bookingFlightData.SearchData[key][i] != null) {
           return new Date(formatDate(new Date(bookingFlightData.SearchData[key][i]), 'DD/MM/YYYY'));
        } else {
            return '';
        }
    }

    setChildDateOfBirth(bookingFlightData: any, i: number): Date | string {
        console.log("bookingFlightData",bookingFlightData)
        return this.setDateOfBirth(bookingFlightData, 'childDOB', i);
    }

    setInfantDateOfBirth(bookingFlightData: any, i: number): Date | string {
        return this.setDateOfBirth(bookingFlightData, 'infantDOB', i);
    }

    setNull(passengers) {
        // Assuming passengers is the array containing the passenger objects
        // Check if all passengers' SeatId is null
        const allSeatIdsNull = passengers.every(passenger => {
            return passenger.SeatId.every(seatId => seatId === null);
        });
        // If all SeatId values are null, set them to an empty array
        if (allSeatIdsNull) {
            passengers.forEach(passenger => {
                passenger.SeatId = [];
            });
        }
    }
    
    setSelectedBaggageTab(id) {
        this.selectedBaggageTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        this.setBaggage(id);
    }
    setBaggage(id) {
        const baggageMapSectors = Array.from(this.baggageMapSectors);
        // Retrieve the selected baggage data based on the new tab's id
        const sector = baggageMapSectors[id] || [];
        // Iterate through the passengers in your FormArray
        this.passengers.controls.forEach((passenger, passengerIndex) => {
            const selectedBaggage = sector[1] || null;
            // Update the passenger's SelectedBaggage field
            passenger.patchValue({
                SelectedBaggage: selectedBaggage,
                SelectedBaggageSector: id,
                SelectedBaggagePassengerIndex: passengerIndex,
                Baggage:''
            });
            this.cdRef.detectChanges();
        });
    }
    onBaggageTabSelected(event: NgbNavChangeEvent): void {
        let id = +event.nextId;
        this.setSelectedBaggageTab(id);
    }
    removeMeal(item: any, sectorIndexToRemove: any, selectedPassengerToRemove: any, passenger: any) {
        // Get the sector array for the specified item
        const sector = this.mealMapSectors.get(item.key) || [];
        // Check if the sectorIndexToRemove and selectedPassengerToRemove are within valid bounds
        if (
            sectorIndexToRemove >= 0 &&
            sectorIndexToRemove <=sector.length &&
            selectedPassengerToRemove >= 0 
            //&& selectedPassengerToRemove <= Object.keys(sector[selectedPassengerToRemove]).length
        ) {
            // Remove the baggage value for the specified user and index
            sector[selectedPassengerToRemove][item.key] = null;
            // Update the baggageMapSectors
            this.mealMapSectors.set(item.key, sector);
            // Update the passenger's SelectedBaggage with the modified sector
            passenger.patchValue({
                SelectedMeal: sector,
                Meal:''
            });
            this.setMealPrice();
        }
    }
    setMealPrice() {
        let total = 0;
        for (const mealSector of this.mealMapSectors) {
            for (const meal of Object.values(mealSector[1])) {
                for (const mealDetail of Object.values(meal)) {
                    if (mealDetail) {
                        total += mealDetail.Price;
                    }
                }
            }
        }

         this.flightService.mealFees.next({
            mealFee: total
        });
        localStorage.setItem('mealFee', JSON.stringify(total));
    }

    
    searchResult(data: any) {
        this.flightService.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination'])
        if(data.JourneyType=='Return' && this.flightService.isDomesticFlightSelected){
           this.showRoundTripUI=true;
           return;
        }
          
           if (data['booking_source']) {
               delete data['booking_source'];
           }
           this.utility.writeStorage("flightSearchPostdata", data, sessionStorage)
           const params = this.flightService.formFilled;
           if (params) {
               this.tripType = params['tripType'];
               this.flightService.tripType.next(this.tripType);
               if (params['tripType'] == 'Multi-city') {
                   this.displayCities = params['cities'];
               } else {
                   this.departureCity = params['departureCity'];
                   console.log(params['departureCity'])
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
            //    let config = new MatDialogConfig();
            //    config.height = '600px';
            //    config.width = '1000px';
            //    config.panelClass = "copy-items-modal";
            //    config.disableClose = true;
            //    config.data = {
            //        data: this.flightService.formFilled
            //    }
            //    let copyDialog = this.dialog.open(TripInfoComponent, config);
           }
           this.router.navigate(
            [
                "search/flight/result",
            ] 
        );
           //this.flightService.searchResult(data);
       }

      patchEmailToContact(): void {
        // Check if the email exists in the current user
        if (this.currentUser.email) {
          console.log(`Patching email: ${this.currentUser.email}`);
          
          // Get the contact FormGroup from the contactForm
          const contactGroup = this.contactForm.get('contact') as FormGroup;
      
          if (contactGroup) {
            // Patch the email value
            contactGroup.get('email').patchValue(this.currentUser.email);
            console.log('Email patched successfully to contact:', this.currentUser.email);
          } else {
            console.error('Contact FormGroup not found in contactForm');
          }
        } else {
          console.error('Email not found in currentUser object');
        }
      }

      openHotelSearch(data?): void {
        console.log('hotel data', data);
        this.dialog.open(CustomDialogWrapperComponent, {
            width: '80vw',
            height: '70vh',
            maxWidth: '100vw',
            maxHeight: '65%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
            data: {
                component: HotelComponent,
                title: 'Hotel Search'
            }
        });
  
    }

    openTransferSearch(data?): void {
        this.dialog.open(CustomDialogWrapperComponent, {
            width: '80vw',
            height: '70vh',
            maxWidth: '100vw',
            maxHeight: '65%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
            data: {
                component: TransferSearchComponent,
                title: 'Transfer Search'
            }
        });
    }

    openActivitySearch(data?): void {
            this.dialog.open(CustomDialogWrapperComponent, {
                width: '80vw',
                height: '70vh',
                maxWidth: '100vw',
                maxHeight: '65%',
                disableClose: true,
                panelClass: 'custom-dialog-container',
                data: {
                    component: ActivitySearchFormComponent,
                    title: 'Activity Search'
                }
            });
        }

    async addToCartWithMessage(moduleType: string): Promise<void> {
       

        // Ensure that the item is not already in the cart before adding it
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        console.log(cartData);
        await this.addBundleBooking(); // Add item if it's not already in the cart
        await this.addAutoSearchData(); // Add any related data
        // if (!cartData) {
        //     await this.addBundleBooking(); // Add item if it's not already in the cart
        //     await this.addAutoSearchData(); // Add any related data
        // } else {
        //     this.cartMessage = 'Item already in cart'; // Handle message if item is already added
        // }

        // Keep the message for a specific duration before clearing it
        setTimeout(() => {
            this.cartMessage = '';
            this.cdRef.detectChanges(); // Trigger change detection if needed
        }, 2000); // Adjust the timeout duration as required
      }
      
      

      openSearch(type){
          if (type === 'hotel') {
            this.openHotelSearch(type);
        } else if (type === 'transfer') {
            this.openTransferSearch(type);
        }
        else if (type === 'activity') {
            this.openActivitySearch(type);
        }

      }

      getBundleBookings() {
        this.cartService.cartItems.subscribe((items) => {
        this.cartItems = items;
        });
        const req = {
            ResultToken: this.cartItems ? this.cartItems.ResultIndex : ''
        };
        this.apiHandlerService
      .apiHandler('getBundleBooking', 'POST', '', '', req).subscribe((res) => {
        console.log(res);
        Object.keys(res.data).forEach((key) => {
            if(key === 'flight') {
                const req = {
                ResultToken: this.cartItems.ResultIndex,
                refNumber: this.cartItems.refNumber || null,
                module: 'flight',
                };
            
                this.cartService.removeCart(req).subscribe(
                (res) => {
                    this.cartService.cartItemsSubject.next(res.data);
                    sessionStorage.setItem('cartData', JSON.stringify(res.data));

                    this.flightAddToCart();
                },
                (error) => {
                    this.swalService.alert.oops();
                }
                );
            }
        })
      })
    }
    
    flightAddToCart() {
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        const currentCart = this.cartService.getCartList(); 
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
        });
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.flight.ResultToken}`,
            exitingToken: this.cartItems ? this.cartItems.ResultIndex : "",
            module: "flight",
            bookingSource: this.flight.booking_source,
        }
        this.cartMessage = `Flight added to cart!`;
        console.log("Adding item to cart:", item);
        this.cartService.addCart(item); // Make sure this method updates cart state properly
        this.cdRef.detectChanges();
    }



      async addBundleBooking() {
        
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
          });
          
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: this.flight.ResultToken,
            exitingToken: cartData ? cartData.ResultIndex : "",
            module: "flight",
            bookingSource: this.flight.booking_source,
        };
        
        // Check if item is already in the cart before adding it
        if (!this.isItemAlreadyInCart(item)) {
            this.cartMessage = `Flight added to cart!`;
            this.cartService.addCart(item); // Add item to cart via CartService

           // sessionStorage.setItem('cartData', JSON.stringify(item));
            this.cdRef.detectChanges();
        } else {
            this.getBundleBookings();
        }
    }

    isItemAlreadyInCart(item: any): boolean {
        let currentCart: any = this.cartService.getCartList();  

  // If the current cart is empty, attempt to retrieve it from sessionStorage
  if (currentCart.length === 0) {
    const storedCart = sessionStorage.getItem('cartListSource');
    currentCart = storedCart ? JSON.parse(storedCart) : []; // Default to an empty array if null
  }
    return currentCart.some(cartItem => 
        cartItem.module === item.module
        // cartItem.ResultToken === item.ResultToken  &&
        // cartItem.exitingToken === item.exitingToken &&
        //  cartItem.refNumber === item.refNumber
    );
}


    
    async addAutoSearchData(){
        console.log('flight data', this.flight);
        const journeyType = "oneway"; // Can be "oneway" or "roundtrip"
        const details = this.flight.FlightDetails.Details;
        let item = {};
        // let item = {
        //     "city_code": this.flightSearchData.Segments[0].Destination,
        //     // "city_name": this.flightSearchData.Segments[0].CityName,
        //     "city_name": this.flight.FlightDetails.Details[0][0].Destination.CityName,
        //     "module": "flight",
        //     "userType": "B2C",
        //     "date": this.flightSearchData.Segments[0].DepartureDate
        // }

        if (journeyType === "oneway") {
            if (details[0].length === 1) {
                // Direct flight (no stops)
                item = {
                    city_code: this.destCity.Segments[0].Destination,
                    city_name: details[0][0].Destination.CityName,
                    module: "flight",
                    userType: "B2B",
                    date: this.flightSearchData.Segments[0].DepartureDate,
                    //stops: "No Stops"
                };
            } else if (details[0].length === 2) {
                // 1 stop
                item = {
                    city_code: this.destCity.Segments[0].Destination,
                    city_name: details[0][1].Destination.CityName,
                    module: "flight",
                    userType: "B2B",
                    date: this.flightSearchData.Segments[0].DepartureDate,
                    //stops: "1 Stop"
                };
            } else if (details[0].length > 2) {
                // 2 or more stops
                item = {
                    city_code: this.destCity.Segments[0].Destination,
                    city_name: details[0][details[0].length - 1].Destination.CityName,
                    module: "flight",
                    userType: "B2B",
                    date: this.flightSearchData.Segments[0].DepartureDate,
                    //stops: `${details[0].length - 1} Stops`
                };
            }
        } else if (journeyType === "roundtrip") {
            if (details[0].length === 1 && details[1].length === 1) {
                // Roundtrip with no stops
                item = {
                    city_code: this.destCity.Segments[0].Destination,
                    city_name: details[1][0].Destination.CityName,
                    module: "flight",
                    userType: "B2B",
                    date: this.flightSearchData.Segments[0].DepartureDate,
                    //return_date: details[1][0].Origin.DateTime.split(" ")[0],
                    //stops: "No Stops"
                };
            } else if (details[0].length > 1 || details[1].length > 1) {
                // Roundtrip with stops
                item = {
                    city_code: this.destCity.Segments[0].Destination,
                    city_name: details[1][details[1].length - 1].Destination.CityName,
                    module: "flight",
                    userType: "B2B",
                    date: this.flightSearchData.Segments[0].DepartureDate,
                    //return_date: details[1][0].Origin.DateTime.split(" ")[0],
                    //stops: `${details[0].length + details[1].length - 2} Stops`
                };
            }
        }
        
        console.log(item);
        
        this.subs.sink = this.apiHandlerService.apiHandler('cartSearchInfo', 'POST',{},{},item)
        .subscribe(res => {
            if (res) {
                console.log("res",res)
                this.autoSearchData = res.data;
                //this.hotelService.moduleAutoFetchData.next(res)
                console.log('datas',this.autoSearchData);
                sessionStorage.setItem('autoSearchData', JSON.stringify(this.autoSearchData));
            }
        });
    }
      
      
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    codeshareInfo(list) {
        if (Object.keys(list[0].CodeshareInfo).length > 0) {
            return true;
        } else {
            return false;
        }
    }

}