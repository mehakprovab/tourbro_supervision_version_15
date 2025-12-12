
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
//import { AppGlobal } from 'projects/b2c/src/app/app.global';
import { FlightComponent } from '../../../modules/search/flight/flight.component';
import { TransferSearchComponent } from '../../../modules/search/transfer/transfer-search/transfer-search.component';
import { CartService } from '../../cart-booking/cart.service';
import { HotelService } from '../../../modules/search/hotel/hotel.service';
import { LowBalanceAlertComponent } from '../../../modules/search/hotel/components/hotel-booking/components/low-balance-alert/low-balance-alert.component';
import { browserRefresh } from '../../../app.component';
import { DashboardService } from '../../dashboard/dashboard.service';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { BehaviorSubject } from 'rxjs';
import { CustomDialogWrapperComponent } from '../../custom-dialog-wrapper/custom-dialog-wrapper.component';

@Component({
    selector: 'app-cart-booking-guest-details',
    templateUrl: './cart-booking-guest-detail.component.html',
    styleUrls: ['./cart-booking-guest-detail.component.scss']
})
export class CartBookingGuestDetailComponent implements OnInit {

    nights: any;
    currentUser: any;
    travellerForm: FormGroup;
    addressForm: FormGroup;
    titleListAdult: any = [];
    titleListChild: any = [];
    selectedTitle;
    hotel: any;
    traveller: any;
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    noOfAdultsExt: number = 0;
    noOfChildsExt: number = 0;
    roomWiseAdultsChilds = [];
    guestData: any = {};
    countries: Array<any> = [];
    private subSunk = new SubSink();
    regConfig: FormGroup;
    submitted: boolean = false;
    lastKeyupTstamp: number = 0;
    openRooms: boolean = false;
    adults: number[] = [1];
    childs: number[] = [0];
    noOfRooms: number = 1;
    maxDate = new Date();
    maxDateAdult: Date;
    minDateAdult: Date;
    minChildDate: Date;
    maxChildDate: Date;
    minDate = new Date();
    isInvalidPromo: boolean = false;
    bsConfig: Partial<BsDatepickerConfig> = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        containerClass: 'theme-default',
    };
    hotelData:any;
    accomdationData:boolean =false;
    mealData:boolean = false;
    isLoading: boolean = false;
    guestCountData: {} = {};
    phoneCodes: any;
    titleList: any;
    selectedPromocode='';
    promocode:any;
    discount_value:number= 0;
    early_discount_value = 0
    duration_discount_value = 0;
    respData: any = [];
    noOfRoomArr = [];
    browserRefresh: boolean;
    loading: boolean;
    loadingTemplate: any;
    primaryColour: any;
    secondaryColour: any;
    showMore = false;
    showMoreAmenity = false;
    accommodation_charge = 0;
    selectedMealCharge = 0;
    selectedMeals = [];
    dropdownSettingsForHotel:{}
    mealList:any;
    adult = 0;
    child = 0;
    isChild:boolean=false;
    txtCouponCodeValue: string = ''; // Variable to hold the input value
    promocodeList:any=[];
    disableApplyPromo:boolean=false;
    earlyBooking:any;
    durationOfStay:any;
    maxDateChild: Date;
    minDateChild: Date;
    cartMessage: string;
    flight: any;
    transfer: any;
    flightType: any;
    cartItems: any;
    appGlobal: any;
    hotelPromocode = new BehaviorSubject<any>({});
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private router: Router,
        private hotelService: HotelService,
        private util: UtilityService,
        
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService,
       // private appGlobal: AppGlobal,
        private flightService: FlightService,
        private cartService: CartService
    ) {
        this.dropdownSettingsForHotel = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            maxHeight: 197,
            itemsShowLimit: 2,
            unSelectAllText: 'Unselect All',
            selectAllText: 'Select All',
        };
     }

    ngOnInit() {
        this.dropdownSettingsForHotel = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            maxHeight: 197,
            itemsShowLimit: 2,
        };
        this.getTitleList();
        this.currentUser = this.util.getStorage('b2cUser');
        if (this.currentUser) {
            this.getTravellersList();
        }
        const cartData = JSON.parse(sessionStorage.getItem('cartData'));
        if (cartData) {
          this.cartService.cartItemsSubject.next(cartData);
        }
        this.cartService.cartItems.subscribe(items => {
          this.cartItems = items;
        });
        this.subSunk.sink = this.cartService.cartItemsFlight.subscribe((res) => {
            if (res && Object.keys(res).length > 0) {
              this.flight = res;
              this.flightUpdate();
            } else {
              const flightData = sessionStorage.getItem('cartItemsFlight');
              if (flightData) {
                this.flight = JSON.parse(flightData);
                this.flightUpdate();
              }
            }
          });
          this.subSunk.sink = this.cartService.cartItemsHotel.subscribe((res) => {
            if (res && Object.keys(res).length > 0) {
              this.hotel = res;
            } else {
              // Retrieve hotel data from local storage as fallback
              const hotelData = sessionStorage.getItem('cartItemsHotel');
              if (hotelData) {
                this.hotel = JSON.parse(hotelData);
              }
            }
          });
      
          this.subSunk.sink = this.cartService.cartItemsTransfer.subscribe((res) => {
            if (res && Object.keys(res).length > 0) {
              this.transfer = res;
            } else {
              // Retrieve transfer data from local storage as fallback
              const transferData = sessionStorage.getItem('cartItemsTransfer');
              if (transferData) {
                this.transfer = JSON.parse(transferData);
              }
            }
          });
          this.subSunk.sink = this.flightService.flightType.subscribe(res => this.flightType = res)
          if((this.hotel && Object.keys(this.hotel).length > 0) && (this.flight && Object.keys(this.flight).length > 0 || this.transfer && Object.keys(this.transfer).length > 0)){
            this.traveller = this.hotel.searchRequest.RoomGuests;
          }

        this.getPromoCodeList();
        this.getCountryList();
        this.getPhoneCodeList();
        this.createTravellerForm();
        this.nights = (new Date(this.hotel.CheckOut).getTime() - new Date(this.hotel.CheckIn).getTime()) / (1000 * 60 * 60 * 24);
        if (this.currentUser.agent_balance <= 50) {
            this.dialog.open(LowBalanceAlertComponent, {
                data: this.currentUser.agent_balance
            });
        }
        this.maxDateAdult = this.addYearsToDate(-12);
        this.maxChildDate = this.addYearsToDate(-2);
        this.maxDateChild = this.strtotime('-5 years -1 day');   // Max age for child (2 years old)
        this.minDateChild = this.strtotime('-18 years');   

    }



    flightUpdate(){
        if (this.flight && Object.keys(this.flight).length > 0) {
          if (typeof this.flight == 'object' && this.flight.JourneyList["0"]["0"].hasOwnProperty('FlightDetails')) {
            const journeyListPre = this.flight.JourneyList["0"]["0"];
            this.flightService.extraFees.next(this.flightService.extraFees.value);
            this.traveller = this.flightService.traveller;
            // if ((res.JourneyList.booking_source == 'ZBAPINO00002' || res.JourneyList.booking_source == 'ZBAPINO00007') && this.currentUser && this.currentUser.id == 44) {
            // this.showSeatSelection = true;
            this.flightService.bookingFlightData.next(journeyListPre);
            this.flightService.resultToken = journeyListPre.ResultToken;
            this.flightService.bookingSource.next(journeyListPre.booking_source);
            const randomTwoDigit = Math.floor(Math.random() * 90 + 10);
            const randomNumber = new Date().valueOf();
            // this.traveller = this.transformTraveller(this.flight.SearchData);
            this.flightService.traveller = this.traveller;
            // this.setLocalStrorage(journeyListPre,journeyListPre)
            // this.getSeatLayout(res.JourneyList);
            // }
            this.maxDateAdult = this.strtotime('-12 years -1 day');
            // this.minDateAdult = this.strtotime('-100 years +1 day');
            this.maxDateChild = this.strtotime('-2 years -1 day');
            this.minDateChild = this.strtotime('-12 years');
            // this.maxDateInfant = new Date();
            // this.minDateInfant = this.strtotime('-2 years');
            this.flight = this.flight.JourneyList["0"]["0"];
            // this.passengers.clear();
            let leadPax = 1;
            // for (let t of Object.keys(this.traveller)) {
            //   if (this.traveller[t]) {
            //     for (let i = 0; i < this.traveller[t]; i++) {
            //     //   this.addPassenger(t, i, leadPax);
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


    strtotime(modifier: string): Date {
        const dobArray = new Date(); // Use the current date as the base
        switch (modifier) {
            case '-100 years +1 day':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 100, dobArray.getMonth(), dobArray.getDate() + 1));
            case '-18 years -1 day':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 18, dobArray.getMonth(), dobArray.getDate() - 1));
            case '-5 years -1 day':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 5, dobArray.getMonth(), dobArray.getDate() - 1));
            case '-18 years':
                return new Date(dobArray.setFullYear(dobArray.getFullYear() - 18, dobArray.getMonth(), dobArray.getDate()));
            default:
                return new Date();
        }
    }
    mealLisData(){
    this.mealList = [
        { id:1, name: 'Breakfast', charge: this.hotelData.breakfast },
        { id:2, name: 'Lunch', charge: this.hotelData.lunch },
        { id:3, name: 'Dinner', charge: this.hotelData.dinner },
        { id:4, name: 'Iftar', charge: this.hotelData.iftar },
        { id:5, name: 'Sahour', charge: this.hotelData.sahour }
      ];
    }
    addYearsToDate(y: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month, day);
        return c;
    }

   

  
    createTravellerForm() {
        this.travellerForm = this.fb.group({
            rooms: this.fb.array([]),
            // adults: this.fb.array([],this.uniqueFirstNameValidator()),
            //  childs: this.fb.array([],this.childFirstNameValidator()),
            address: this.fb.array([this.addAddressForm()]),
            Aggreed: new FormControl(false, [Validators.required]),
            remark: new FormControl('', ),
        });
        this.addRooms();
    }
    addRooms() {
        this.traveller.forEach((element, index) => {
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
            let age = this.util.calculateAge(dateOfBirth);
            let isLeadPax = (i === 0);
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'adult','1',dateOfBirth,age,index + 1));
          }
          for (let i = 0; i < element.NoOfChild; i++) {
            let dateOfBirth=formatDate(this.maxDateChild, 'YYYY-MM-DD');
            let age = this.util.calculateAge(dateOfBirth);
            let isLeadPax=false;
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'child','0',dateOfBirth,age,index + 1));
          }
        });
      }
      addTravellers(isLeadPax,type: string,PaxType,dateOfBirth,age,room?: number): FormGroup {
        return this.fb.group({
            type: [type], 
            Title: new FormControl('', [Validators.required]),
            FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            LastName: new FormControl('', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.userName)]),
            // Dob: new FormControl(),
            //  Dob:new Date(formatDate(new Date(dateOfBirth), 'DD-MM-YYYY')),
          
            Age: new FormControl(age),
            RoomId:room,
            LeadPassenger:new FormControl(isLeadPax),
            PaxType:new FormControl(PaxType),
            PassengerSelectionAdult:'',// Used for passenger selection


            // IsLeadPax: lead,
            MiddleName: [''],
            // PaxType: paxType,
            Gender: ['', [Validators.required]],
            DateOfBirth: [dateOfBirth],
            PassportNumber: this.flightType == 'International' ? ['', [Validators.required]] : [''],
            PassportExpiryDate: this.flightType == 'International' ? ['', [Validators.required]] : [''],
            PassportIssuingCountry: ['GBR',],
            Nationality: ['GBR',],
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
            // travellerType: tt,
            // travellerTypeCount: i + 1,
            BaggageId: [""],
            MealId: [""],
            SeatId: [""],
            SelectedSeats: [""],
            SelectedSelectorId: 0,
            PassengerSelection: ''// Used for passenger selection
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
    // addAdults() {
    //     this.traveller.forEach((element, index) => {
    //         console.log("element",element)
    //         this.noOfAdults += element.adults;
    //         this.adult += element.adults;
    //         this.child += element.childrens;
    //          this.noOfChilds += element.childrens;

    //         // this.noOfRooms += 1;
    //         this.noOfRoomArr.push(1)

    //         for (let i = 0; i < element.adults; i++) {
    //             if (this.travellerForm.value['adults'].length < this.noOfAdults) {
    //                 this.trevellers('adults').push(this.addTravellers(index + 1));
    //             }
    //         }
    //         for (let i = 0; i < element.childrens; i++) {
    //             if (this.trevellers('childs').length < this.noOfChilds) {
    //                 this.trevellers('childs').push(this.addChildTravellersFrom(index + 1));
    //             }
    //         }
    //     });
    // }
    
    getPhoneCodeList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                this.phoneCodes = res.data;
                this.cdRef.detectChanges();

                }
            });
    }

    getCountryList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 && resp.data) {
                this.countries = resp.data.countries;
                this.cdRef.detectChanges();
            }
        })
    }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {}, {}).subscribe(res => {
            this.hotelService.userTitleList.next(res.data);
            if (res.data.length) {
                this.titleList = res.data;
                this.cdRef.detectChanges();
            }
        });
    }

    // addTravellers(room?: number): FormGroup {
    //     return this.fb.group({
    //         Title: new FormControl('', [Validators.required]),
    //         FirstName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(3), Validators.pattern(this.util.regExp.fullName)]),
    //         LastName: new FormControl('', [Validators.maxLength(25), Validators.minLength(3), Validators.pattern(this.util.regExp.userName)]),
    //         // Dob: new FormControl(''),
    //         PassengerSelectionAdult:'',// Used for passenger selection
    //         RoomId:room,
    //     })
    // }

    addChildTravellersFrom(room?: number): FormGroup {
        return this.fb.group({
            Title: new FormControl(''),
            FirstName: new FormControl('', [Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            LastName: new FormControl('', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.userName)]),
            Dob: new FormControl(''),
            PassengerSelectionChild:'',
            RoomId:room,
        })
    }

    addAddressForm(): FormGroup {
        return this.fb.group({
            // Title: new FormControl('', [Validators.required]),
            // FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            // LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.userName)]),
            // Address: new FormControl('', [Validators.required, Validators.maxLength(120), Validators.minLength(2)]),
            // Address2: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
            // City: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            // State: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            // PostalCode: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.zipCode), Validators.maxLength(10)]),
            Email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
            // PhoneCode: new FormControl('', [Validators.required]),
            PhoneCode: new FormControl('44', [Validators.required]),
            Contact: new FormControl('', [Validators.required, Validators.pattern(/^([.-\s]?)?(\d[.-\s]?){7,10}\d$/)]),
            Country: new FormControl('GBR', [Validators.required])
        })
    }

    trevellers(controlName: string): FormArray {
        return this.travellerForm.get(controlName) as FormArray;
    }

    // addAdultTravellers() {
    //     if (this.travellerForm.value['adults'].length < this.noOfAdults) {
    //         this.trevellers('adults').push(this.addTravellers());
    //     }
    // }

    addChildTravellers() {
        if (this.trevellers('childs').length < this.noOfChilds) {
            this.trevellers('childs').push(this.addChildTravellersFrom());
        }
    }

    removeAdultTravellers(index?): void {
        if (this.trevellers('adults').length > 1) {
            this.trevellers('adults').removeAt(index);
        }
    }

    // removeChildTravellers(index?): void {
    //     if (this.trevellers('childs').length > 0) {
    //         this.trevellers('childs').removeAt(index);
    //     }
    // }

    // hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
        
    //     if (typeof arrayControl !== 'undefined') {
    //         let formArrayName = this.travellerForm.get(arrayControl) as FormArray;
    //         return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    //     } else {
    //         return ((this.submitted || this.travellerForm.controls[controlName].touched) && this.travellerForm.controls[controlName].hasError(errorName));
    //     }
    // }
    // hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
    //     if (arrayControl) {
    //       const formArrayName = this.travellerForm.get(arrayControl) as FormArray;
    //       const control = formArrayName.controls[i].get(controlName);
      
    //       // Check if it's the duplicateFirstName error
    //       if (errorName === 'duplicateFirstName') {
    //         return this.submitted || control?.touched;
    //       }
      
    //       return (this.submitted || control?.touched) && control?.hasError(errorName);
    //     } else {
    //       const control = this.travellerForm.get(controlName);
    //       return (this.submitted || control?.touched) && control?.hasError(errorName);
    //     }
    //   };
    hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number,roomIndex?: number): boolean => {
        if (arrayControl !== undefined && roomIndex !== undefined) {
            const formArray = this.travellerForm.get('rooms') as FormArray;
            if (formArray && formArray.at(roomIndex)) {
                const traveller = formArray.at(roomIndex).get(arrayControl) as FormArray;
                if (traveller && traveller.at(i)) {
                const control = traveller.at(i).get(controlName);
                return control && (this.submitted || control.touched) && control.hasError(errorName);
                }
            }
        } else {
            const formArray = this.travellerForm.get(arrayControl) as FormArray;
            const control = formArray.at(0).get(controlName);
            return control && (this.submitted || control.touched) && control.hasError(errorName);
        }
        return false; // Return false if there's an issue with formArray or index
    };
    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = Math.round(num);
        return starArr;
    }

    getStarArrayRemaining(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = 5 - Math.round(num);
        return starArr;
    }

    onSubmit() {
        this.submitted = true;
        if (!this.hotelService.isDevelopment) {
            if (!this.travellerForm.valid)
                return;
        }
        this.loading =true;
        this.hotelService.loading.next(true);
        let passengerDetails = [];
        this.roomsFormArray.controls.forEach((roomGroup: FormGroup) => {
            const roomTravellers = roomGroup.get('travellers').value; // Get the travellers in the room
            
            roomTravellers.forEach((traveller, i) => {

                traveller.MealId = ["", null, undefined].indexOf(traveller.MealId) >= 0 ? [] : traveller.MealId
                traveller.SeatId = ["", null, undefined].indexOf(traveller.SeatId) >= 0 ? []  : traveller.SeatId
                traveller.BaggageId =  ["", null, undefined].indexOf(traveller.BaggageId) >= 0 ? []  : traveller.BaggageId

      
                 if (traveller.PaxType === '0') {
                let age = this.util.calculateAge(traveller.DateOfBirth);
                traveller.Age = age;
                // traveller.Dob = formatDate(traveller.Dob, 'YYYY-MM-DD');

            } else {
                delete traveller.Dob;
                delete traveller.Age;
            }
                delete traveller.type;
             
    
                // Push the formatted traveller details into passengerDetails array
                passengerDetails.push(traveller);
            });
        });

        let reqBody = {
            BlockRoomId: 0,
            UserId: sessionStorage.getItem('b2cUser') ? JSON.parse(sessionStorage.getItem('b2cUser'))['id'] : 0,
            Passengers: passengerDetails,
            AddressDetails: this.travellerForm.get('address').value[0],
            Remark:this.travellerForm.get('remark').value,
            BookingSource: 'B2C',
            SequenceNumber: 0,
            ResultToken: this.cartItems ? this.cartItems.ResultIndex : '',
            UserType: "B2C",
            //Currency: this.appGlobal.selectedCurrency.value,
            refNumber: this.cartItems ? this.cartItems.refNumber : '',


            DepExtraInfo: "",
            DepInfo: "",
            DepPoint: "",
            Extras: "",
            J1_AccommodationAddress: "",
            J1_PropertyName: "",
            AccommodationAddress: "",
            RetExtraInfo: "",
            RetInfo: "",
            RetPoint: "",
            BookingQuestions: "",
            PropertyName: "",

        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('commitBundleBooking', 'post', {}, {}, reqBody).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.loading =false;
                this.cartService.addBundleBookingPaxDetails.next(resp.data);
                localStorage.setItem('addBundleBookingPaxDetails', JSON.stringify(this.cartService.addBundleBookingPaxDetails.getValue()));
                this.router.navigate(['cart/booking-confirmation'], { queryParams: { appReference: reqBody['AppReference'], bookingSource: this.hotel.searchRequest.booking_source } });
                // this.hotelBookingService.isButtonClickedInTraveler.next(true);
            }
        }, err => {
            console.error(err);
        })
        this.hotelService.loading.next(false);

        this.hotelService.loading.next(false);
    }

    setAdultDetails(passengerDetails,index,selectedSection) {
        this.setPassengerTitle(passengerDetails,selectedSection);
            this.travellerForm.controls['adults']['controls'][index].patchValue({
                Title:this.selectedTitle,
                FirstName:passengerDetails.first_name.toUpperCase(),
                LastName:passengerDetails.last_name.toUpperCase(),
                //Dob:new Date(formatDate(new Date(passengerDetails.date_of_birth), 'DD/MM/YYYY')),
                Room: new FormControl(index || 0)
            });
       }

       setChildDetails(passengerDetails,index,selectedSection) {
        this.setPassengerTitle(passengerDetails,selectedSection);
            this.travellerForm.controls['childs']['controls'][index].patchValue({
                Title:this.selectedTitle,
                FirstName:passengerDetails.first_name.toUpperCase(),
                LastName:passengerDetails.last_name.toUpperCase(),
                Dob:new Date(formatDate(new Date(passengerDetails.date_of_birth), 'DD/MM/YYYY')),
                Room: new FormControl(index || 0)
            });
       }

    setPassengerTitle(passengerDetails, selectedSection) {
        let titleArray;
        if (selectedSection === 'adults') {
            titleArray = this.titleList.filter(element => (element.pax_type === "ADULT" && element.title === passengerDetails.title));
        }
        else {
            titleArray = this.titleList.filter(element => (element.pax_type === "CHILD" && element.title === passengerDetails.title));
        }
        if (titleArray.length == 0) {
            this.selectedTitle= "";
        }else
        {
            this.selectedTitle=passengerDetails.title;
        }
    }

    clearAdultDetails(index,selectedIndex) {
        this.travellerForm.controls['adults']['controls'][index].patchValue({
            Title: '',
            FirstName: '',
            LastName: '',
            //Dob:'',
            Room: index,
            PassengerSelectionAdult:''
        });
    }

    clearChildDetails(index,selectedIndex) {
        this.travellerForm.controls['childs']['controls'][index].patchValue({
            Title: '',
            FirstName: '',
            LastName: '',
            Dob:'',
            Room: index,
            PassengerSelectionChild:''
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

    getTravellersList() {
        this.apiHandlerService.apiHandler("userTravellersList", "POST").subscribe((res) => {
             if (res && res.data.length) {
              this.respData = res.data;
               this.cdRef.detectChanges();
             }
           });
       }

    openStaticPage(page_title) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['cms/' + page_title])
        );
        window.open('#' + url, '_blank');
    }
   
     isAllowedCharacter(event) {
        // Get the ASCII code of the key that was pressed
        var charCode = event.charCode;
        
        // Allow letters (both uppercase and lowercase), numbers, and space
        if ((charCode >= 65 && charCode <= 90) || // Uppercase letters
            (charCode >= 97 && charCode <= 122) || // Lowercase letters
            (charCode >= 48 && charCode <= 57) || // Numbers
            (charCode == 32)) { // Space
            return true;
        } else {
            return false;
        }
    }
    get roomsFormArray(): FormArray {
        return this.travellerForm.get('rooms') as FormArray;
      }
      toggleShowMore() {
        this.showMore = !this.showMore; // Toggle between showing more and less
      }
      toggleShowMoreAmenitity() {
        this.showMoreAmenity = !this.showMoreAmenity; // Toggle between showing more and less
      }
      getPromoCodeList() {
        let today = formatDate(new Date(), 'YYYY-MM-DD');
        this.subSunk.sink = this.apiHandlerService.apiHandler('listPromocode', 'POST','','',{"Currency": this.appGlobal.selectedCurrency.value})
            .subscribe(res => {
                if (res) {
                    this.promocodeList=res.data.filter(element=>element.expiry_date > today && element.category=='Hotel');
                    this.cdRef.detectChanges();
                }
            });
    }
    
    removeSelectedPromo() {
        // Assuming this.promocodeList is an array of objects with a 'selected' property
        for (let i = 0; i < this.promocodeList.length; i++) {
            this.promocodeList[i].selected = false;
        }
        // Reset the radio button selection
        const radioButtons = document.getElementsByName("cpnRadio");
        for (let i = 0; i < radioButtons.length; i++) {
            const radioButton = radioButtons[i] as HTMLInputElement;
            radioButton.checked = false;
        }
        this.selectedPromocode = "";
        this.txtCouponCodeValue="";
        this.disableApplyPromo = false;
        this.cdRef.detectChanges();
        this.hotelService.hotelPromocode.next({
            promocode: ''
        });
        localStorage.setItem('hotelPromocode', JSON.stringify(''));
    }
    setPromoCode(promocode) {
        this.selectedPromocode = promocode.promo_code;
        this.hotelService.hotelPromocode.next({
            promocode: promocode
        });
        localStorage.setItem('hotelPromocode', JSON.stringify(promocode));
    }

    setSelectedPromo(promocode, index) {
        this.promocodeList.forEach((code, i) => {
            code.selected = (i === index); // Set selected to true only for the clicked index
        });
        this.txtCouponCodeValue = `${promocode.promo_code}`;
        this.isInvalidPromo = false;
        this.disableApplyPromo = true;
        this.cdRef.detectChanges();
        this.setPromoCode(promocode);
      }
      setEarlyBooking(value){
        let amount: number
        amount = (value / 100);
        this.early_discount_value = this.hotel.Price.Amount * amount;
      }
      removeSelectedEarly() {
        this.early_discount_value = 0;
        const earlyBirdRadio = document.querySelector('input[name="cpnDiscount"][value="earlyBooking"]') as HTMLInputElement;
        if (earlyBirdRadio) {
            earlyBirdRadio.checked = false;
        }

        this.cdRef.detectChanges();
    
        // Reset promocode or related state if necessary
        // this.selectedPromocode = "";
        // this.hotelService.hotelPromocode.next({
        //     promocode: ''
        // });
        localStorage.setItem('activityDiscount', JSON.stringify(''));
    }
    removeSelectedDuration() {
        this.duration_discount_value = 0;
        const earlyBirdRadio = document.querySelector('input[name="cpnDiscounts"][value="durationOfStay"]') as HTMLInputElement;
        if (earlyBirdRadio) {
            earlyBirdRadio.checked = false;
        }

        this.cdRef.detectChanges();
    
        // Reset promocode or related state if necessary
        // this.selectedPromocode = "";
        // this.hotelService.hotelPromocode.next({
        //     promocode: ''
        // });
        localStorage.setItem('activityDiscount', JSON.stringify(''));
    }
 
      setDurationStay(value){
        let amount: number
        amount = (value / 100);
        this.duration_discount_value = this.hotel.Price.Amount * amount;
      }
       
      
      openFlightSearch(): void {
        sessionStorage.setItem('activeIdString','left');
        this.dialog.open(CustomDialogWrapperComponent, {
            width: '80vw',
            height: '70vh',
            maxWidth: '100vw',
            maxHeight: '65%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
            data: {
                component: FlightComponent,
                title: 'Flight Search'
            }
        });
    }

    openTransferSearch(): void {
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

    addToCartWithMessage(type: string): void {
        this.addBundleBooking();
        this.cartMessage = `Hotel added to cart!`;
        if (type === 'flight') {
            this.openFlightSearch();
          } else if (type === 'transfer') {
            this.openTransferSearch();
          }
        setTimeout(() => {
          this.cartMessage = null;
        }, 5000); 
      }


      addBundleBooking() {
        const cartData = JSON.parse(localStorage.getItem("cartData"));
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.hotel['ResultToken']}`,
            exitingToken: cartData ? cartData.ResultIndex : "",
            module: "hotel",
            bookingSource: this.hotel.searchRequest.booking_source,
        }
        this.cartService.addCart(item);
        this.cdRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
