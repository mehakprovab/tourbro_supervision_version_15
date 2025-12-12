import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../../core/api-handlers/api-handlers.service';
import { formatDate } from 'ngx-bootstrap/chronos';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { HotelService } from '../../../../hotel.service';
import { LowBalanceAlertComponent } from '../low-balance-alert/low-balance-alert.component';
import { FlightComponent } from '../../../../../flight/flight.component';
import { TransferSearchComponent } from '../../../../../transfer/transfer-search/transfer-search.component';
import { CustomDialogWrapperComponent } from '../../../../../../custom-dialog-wrapper/custom-dialog-wrapper.component';
import { CartService } from '../../../../../../cart-booking/cart.service';
import { ActivitySearchFormComponent } from '../../../../../activity/components/activity-search-form/activity-search-form.component';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import * as moment from 'moment';
import { FlightService } from '../../../../../flight/flight.service';
@Component({
    selector: 'app-hotel-guest-details',
    templateUrl: './hotel-guest-details.component.html',
    styleUrls: ['./hotel-guest-details.component.scss']
})
export class HotelGuestDetailsComponent implements OnInit {

    nights: any;
    currentUser: any;
    travellerForm: FormGroup;
    addressForm: FormGroup;
    titleList: any;
    hotel: any;
    traveller: any;
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    noOfAdultsExt: number = 0;
    noOfChildsExt: number = 0;
    roomWiseAdultsChilds = [];
    protected subs = new SubSink();
    guestData: any = {};
    countries: Array<any> = [];
    private subSunk = new SubSink();
    regConfig: FormGroup;
    submitted: boolean = false;
    lastKeyupTstamp: number = 0;
    openRooms: boolean = false;
    adults: number[] = [1];
    childs: number[] = [0];
    noOfRooms: number = 0;
    maxDateAdult: Date;
    minChildDate: Date;
    maxChildDate: Date;
    minDate = new Date();
    bsConfig: Partial<BsDatepickerConfig> = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        showWeekNumbers: false,
        containerClass: 'theme-blue',
    };
    isLoading: boolean = false;
    guestCountData: {} = {};
    noOfRoomArr = [];
    phoneCodes: any;
    respData: any = [];
    selectedTitle;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean;
    adult=0;
    child=0;
    maxDateChild: Date;
    minDateChild: Date;
    cartItems: any;
    autoSearchData: any;
    cartMessage: string;
    selectedLocation: any;
    selectedCity: any;
    remarksData: any;
    showFullRemarks: boolean = false;
    maxLength = 200;
    flattenedGuests: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private router: Router,
        private hotelService: HotelService,
        private util: UtilityService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
        private cartService: CartService,
        private swalService: SwalService,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.getTravellersList();
        this.currentUser = this.util.getStorage('currentUser');
        this.setHotelTraveller();
        this.setblockHotelRoomState();
        this.subSunk.sink = this.hotelService.blockHotelRoom.subscribe(res => {
            if(!res){
                this.router.navigate(['/dashboard']);
            }
            this.hotel = res.data;
            this.remarksData = this.hotel.RoomDetails[0].remarks;
            console.log(" this.hotel ", this.hotel )
        })
        this.traveller = this.hotelService.traveller;
     
        const storedLocation = localStorage.getItem('selectedLocation');
        this.selectedLocation = JSON.parse(storedLocation);
            if(this.selectedLocation){
            console.log('Parsed Location Object:', this.selectedLocation); // Debug: Check parsed object
            this.addAutoSearchData(this.selectedLocation);  
        } else {
            console.error('No data found in sessionStorage for "selectedLocation"');
        }
        const storedCity = localStorage.getItem('selectedCity');
            this.selectedCity = JSON.parse(storedCity);
            if(this.selectedCity){
            console.log('Parsed Location Object:', this.selectedCity); // Debug: Check parsed object
            this.addAutoSearchData(this.selectedCity);
        } else {
            console.error('No data found in sessionStorage for "selectedLocation"');
        }
        this.getCountryList();
        this.getTitleList();
        this.getPhoneCodeList();
        this.createTravellerForm();
        this.getBlockRoomData();
        this.patchEmailFromSession(0)
        if (this.hotel.booking_source === "TLAPINO00007") {
            this.hotel.CheckIn = this.hotel.CheckIn.split('-').reverse().join('-');
            this.hotel.CheckOut = this.hotel.CheckOut.split('-').reverse().join('-');
        }
        this.nights = (new Date(this.hotel.CheckOut).getTime() - new Date(this.hotel.CheckIn).getTime()) / (1000 * 60 * 60 * 24);
        // if (this.currentUser.agent_balance <= 50) {
        //     this.dialog.open(LowBalanceAlertComponent, {
        //         data: this.currentUser.agent_balance
        //     });
        // }
        this.maxDateChild = new Date();  
        this.minDateChild = this.strtotime('-18 years');

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
            // adults: this.fb.array([]),//this.addTravellers()
            // childs: this.fb.array([]),
            address: this.fb.array([this.addAddressForm()]),
            Aggreed: new FormControl(false, [Validators.required])
        });
        this.addRooms();
    }
    addRooms() {
        this.traveller.forEach((element, index) => {
            this.noOfAdults += element.adults;
            this.noOfChilds += element.childrens;
            this.adult += element.adults;
            this.child += element.childrens;
            const roomGroup = this.fb.group({
            RoomId: [index + 1], // Assign RoomId
            PassengerSelection: [''],
            travellers: this.fb.array([]) // Group travellers within each room
          });
      
          // Add room group to the form
          (this.travellerForm.get('rooms') as FormArray).push(roomGroup);
      
          // Add adults and children to the respective room
          for (let i = 0; i < element.adults; i++) {
            let dateOfBirth = formatDate(this.maxDateAdult, 'YYYY-MM-DD');
            let age = this.util.calculateAge(dateOfBirth);
            let isLeadPax = (i === 0);
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'adult','1',dateOfBirth,age,index + 1));
          }
          for (let i = 0; i < element.childrens; i++) {
            // let dateOfBirth=formatDate(this.maxChildDate, 'YYYY-MM-DD');
            // let age = this.util.calculateAge(dateOfBirth); 
            let age = Number(element.childAges[i].childAge || 0); // Get child age from data, default to 0 if not found
            let dateOfBirth = this.calculateDateOfBirthFromAge(age); // Convert age to DOB
            let isLeadPax=false;
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers(isLeadPax,'child','0',dateOfBirth,age,index + 1));
          }
        });
      }

      calculateDateOfBirthFromAge(age: number): string {
        let birthYear = new Date().getFullYear() - age;
        let birthDate = new Date(birthYear, 0, 1); // Assuming Jan 1st as birth date
        return birthDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

      get roomsFormArray(): FormArray {
        return this.travellerForm.get('rooms') as FormArray;
      }
    // addAdults() {
    //     this.traveller.forEach((element, index) => {
    //         this.noOfAdults +=  element.adults;
    //         this.noOfChilds += element.childrens;
    //         this.adult += element.adults;
    //         this.child += element.childrens;
    //         this.noOfRooms += 1;
    //         this.noOfRoomArr.push(1)

    //         for (let i = 0; i < element.adults; i++) {
    //             if (this.travellerForm.value['adults'].length < this.noOfAdults) {
    //                 this.travellers('adults').push(this.addTravellers(index + 1));
    //             }
    //         }
    //         for (let i = 0; i < element.childrens; i++) {
    //             if (this.travellers('childs').length < this.noOfChilds) {
    //                 this.travellers('childs').push(this.addChildTravellersFrom(index + 1));
    //             }
    //         }
    //     });
    // }

    getNoOfpassengerForRoom(i) {
        return this.traveller[i].adults
    }
    getNoOfChildrenForRoom(i) {
        return this.traveller[i].childrens
    }

    getCountryList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 && resp.data) {
                this.countries = resp.data.countries;
            }
        })
    }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitlelist', 'POST', {}, {}, {}).subscribe(res => {
            this.hotelService.userTitleList.next(res.data);
            if (res.data.length) {
                this.titleList = res.data
            }
        });
    }

    getPhoneCodeList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                    this.phoneCodes = res.data;
                }
            });
    }

    getBlockRoomData() {
    }

    getHotelData() {
        this.subSunk.sink = this.hotelService.blockHotelRoom.subscribe(d => {
            console.log(d)
            this.hotel = d;
        })
    }

    addTravellers(isLeadPax,type: string,PaxType,dateOfBirth,age,room?: number): FormGroup {
        return this.fb.group({
            type: [type], 
            Title: new FormControl('', [Validators.required]),
            FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            LastName: new FormControl('', [Validators.required,Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.fullName)]),
            Dob: new FormControl(dateOfBirth),
            //  Dob:new Date(formatDate(new Date(dateOfBirth), 'DD-MM-YYYY')),
          
            Age: new FormControl(age),
            RoomId:room,
            LeadPassenger:new FormControl(isLeadPax),
            PaxType:new FormControl(PaxType),
            PassengerSelectionAdult:''// Used for passenger selection
        })
    }

    addChildTravellersFrom(room?: number): FormGroup {
        return this.fb.group({
            Title: new FormControl(''),
            FirstName: new FormControl('', [Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            LastName: new FormControl('', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.userName)]),
            Dob: new FormControl('',[Validators.required]),
            RoomId:room,
            PassengerSelectionChild:''// Used for passenger selection
        })
    }

    addAddressForm(): FormGroup {
        return this.fb.group({
            // Title: new FormControl('', [Validators.required]),
            // FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
            // LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.userName)]),
            Address: new FormControl(''),
            // Address2: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
            City: new FormControl('',),
            State: new FormControl(''),
            PostalCode: new FormControl('', [Validators.maxLength(20)]),
            CustomerEmail: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
            Email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
            // PhoneCode: new FormControl('', [Validators.required]),
            PhoneCode: new FormControl('44', [Validators.required, Validators.maxLength(6)]), // Validators.pattern(this.util.regExp.phoneCode)
            Contact: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.phoneNo)]),
            Country: new FormControl('GBR',)
        })
    }

    onUpdatePassenges(phonecode: any) {
        const result = this.phoneCodes.find(c => c.phone_code == phonecode);
        this.travellers('address').patchValue([{
            PhoneCode: result.phone_code
        }])
    }

    travellers(controlName: string): FormArray {
        return this.travellerForm.get(controlName) as FormArray;
    }

    // addAdultTravellers() {
    //     if (this.travellerForm.value['adults'].length < this.noOfAdults) {
    //         this.travellers('adults').push(this.addTravellers());
    //     }
    // }

    // addChildTravellers() {
    //     if (this.travellers('childs').length < this.noOfChilds) {
    //         this.travellers('childs').push(this.addChildTravellersFrom());
    //     }
    // }

    removeAdultTravellers(index?): void {
        if (this.travellers('adults').length > 1) {
            this.travellers('adults').removeAt(index);
        }
    }

    removeChildTravellers(index?): void {
        if (this.travellers('childs').length > 0) {
            this.travellers('childs').removeAt(index);
        }
    }

    // hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
    //     if (typeof arrayControl !== 'undefined') {
    //         let formArrayName = this.travellerForm.get(arrayControl) as FormArray;
    //         return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    //     } else {
    //         return ((this.submitted || this.travellerForm.controls[controlName].touched) && this.travellerForm.controls[controlName].hasError(errorName));
    //     }
    // }
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

    formAnotherReq() {

        let rooms = []
        this.traveller.forEach((element, index) => {
            let adults = []
            let childs = []
            this.travellerForm.get('adults').value.forEach((adult, i) => {
                if (adult['Room'] == index + 1) {
                    // let age = this.util.calculateAge(adult['Dob']);
                    // adult['Dob'] = formatDate(adult['Dob'], 'YYYY-MM-DD');
                    adult = Object.assign(adult, {PaxType: '1', LeadPassenger: i == 0 ? true : false })
                    adults.push(adult)
                }
            });

            this.travellerForm.get('childs').value.forEach(child => {
                if (child['Room'] == index + 1) {
                    let age = this.util.calculateAge(child['Dob']);
                    child['Dob'] = formatDate(child['Dob'], 'YYYY-MM-DD');
                    child = Object.assign(child, { Age: age,PaxType: '0', LeadPassenger: false })
                    childs.push(child);
                }
            });
            rooms.push(adults, childs)
        })

        const reqBody = {
            ResultToken: `${this.hotel['ResultIndex']}`,
            BlockRoomId: 0,
            //AppReference: AppReference,
            UserId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser'))['id'] : 0,
            RoomDetails: [
                {
                    PassengerDetails: rooms,
                    AddressDetails: this.travellerForm.get('address').value[0],
                }
            ],
            booking_source: `${this.hotel['booking_source']}`,
            BookingSource: 'B2B'
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
            module: "hotel"
        }).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                reqBody['AppReference'] = res.data;
                console.log(reqBody)
                this.subSunk.sink = this.apiHandlerService.apiHandler('addPaxDetails', 'post', {}, {}, reqBody).subscribe(resp => {
                    if (resp.statusCode == 200) {
                        this.hotelService.addHotelBookingPaxDetails.next(resp.data);
                        this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: reqBody['AppReference'], source: `${this.hotel.searchRequest.booking_source}` } });
                    }
                }, err => {
                    console.error(err);
                })
                this.hotelService.loading.next(false);
            }
        })
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
      
                 if (traveller.PaxType === '0') {
                // let age = this.util.calculateAge(traveller.Dob);
                // traveller.Age = age;
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
        let date = (new Date().getTime()).toString();
        //   let AppReference = `HB${date.substr(10)}-${date.substr(0, 7)}-${date.substr(7)}`
        const reqBody = {
            BlockRoomId: 0,
           // AppReference: AppReference,
            UserId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser'))['id'] : 0,
            RoomDetails: [
                {
                    PassengerDetails: passengerDetails,
                    AddressDetails: this.travellerForm.get('address').value[0],
                }
            ],
            booking_source: this.hotel.searchRequest.booking_source,
            BookingSource: 'B2B',
            ResultToken: `${this.hotel['ResultToken']}`,
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
            module: "hotel"
        }).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                reqBody['AppReference'] = res.data;
                console.log(reqBody)
                
                this.subSunk.sink = this.apiHandlerService.apiHandler('addPaxDetails', 'post', {}, {}, reqBody).subscribe(resp => {
                    if (resp.statusCode == 200) {
                        this.loading =false;
                        this.hotelService.addHotelBookingPaxDetails.next(resp.data);
                        this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: reqBody['AppReference'], source:  reqBody['booking_source'] } });
                    } else {
                        this.loading =false;
                        this.swalService.alert.oops("Something went wrong, please try again later");
                    }
                }, err => {
                    console.error(err);
                    this.loading =false;
                    this.swalService.alert.oops("Something went wrong, please try again later");
                })
                this.hotelService.loading.next(false);
            }
        })
    }

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
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

    getTravellersList() {
       this.apiHandlerService.apiHandler("travellerManagementList", "POST").subscribe((res) => {
            if (res && res.data.length) {
             this.respData = res.data;
              this.cdRef.detectChanges();
            }
          });
      }

    //   setAdultDetails(passengerDetails,index,selectedSection) {
    //     this.setPassengerTitle(passengerDetails,selectedSection);
    //         this.travellerForm.controls['adults']['controls'][index].patchValue({
    //             Title:this.selectedTitle,
    //             FirstName:passengerDetails.first_name.toUpperCase(),
    //             LastName:passengerDetails.last_name.toUpperCase(),
    //           //  Dob:new Date(formatDate(new Date(passengerDetails.date_of_birth), 'DD/MM/YYYY')),
    //             Room: new FormControl(index || 0)
    //         });
    //    }

    //    setChildDetails(passengerDetails,index,selectedSection) {
    //     this.setPassengerTitle(passengerDetails,selectedSection);
    //         this.travellerForm.controls['childs']['controls'][index].patchValue({
    //             Title:this.selectedTitle,
    //             FirstName:passengerDetails.first_name.toUpperCase(),
    //             LastName:passengerDetails.last_name.toUpperCase(),
    //             Dob:new Date(formatDate(new Date(passengerDetails.date_of_birth), 'DD/MM/YYYY')),
    //             Room: new FormControl(index || 0)
    //         });
    //    }


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

    clearAdultDetails(index) {
        this.travellerForm.controls['adults']['controls'][index].patchValue({
            Title: '',
            FirstName: '',
            LastName: '',
           // Dob:'',
            //Room: index,
            PassengerSelectionAdult:''
        });
    }

    clearChildDetails(index) {
        this.travellerForm.controls['childs']['controls'][index].patchValue({
            Title: '',
            FirstName: '',
            LastName: '',
            Dob:'',
           // Room: index,
            PassengerSelectionChild:''
        });
    }

    openStaticPage(page_title) {
        sessionStorage.setItem('static_title', page_title);
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms'])
        );
        window.open('#' + url, '_blank');
    }

    setHotelTraveller(){
        this.hotelService.setHotelTraveller();
    }

    setblockHotelRoomState(){
        const storedState = localStorage.getItem('blockHotelRoomState');
        if (storedState) {
            this.hotelService.blockHotelRoom.next(JSON.parse(storedState));
        }
    }
    patchEmailFromSession(index: number): void {
        // Ensure the session data exists
        
        if (this.currentUser && this.currentUser.email) {
          const addressArray = this.travellerForm.get('address') as FormArray;
          if (addressArray && addressArray.at(index)) {
            const addressGroup = addressArray.at(index) as FormGroup;
            addressGroup.get('Email').patchValue(this.currentUser.email);
            // this.emailVerified = true;
            // addressGroup.get('Email').disable();
          } else {
            console.error('Invalid index or FormArray not found');
          }
        } else {
          console.error('Email not found in session storage');
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
                dobArray.setFullYear(dobArray.getFullYear() - 18, dobArray.getMonth(), dobArray.getDate());
                return new Date(dobArray.setDate(dobArray.getDate() + 1)); // Explicitly add 1 day
            default:
                return new Date();
        }
    }
    setAdultDetails(option: any, roomIndex: number, type: string) {
        const roomsFormArray = this.travellerForm.get('rooms') as FormArray;
      
        // Validate roomIndex
        if (roomIndex >= roomsFormArray.length) {
          console.error(`Room at index ${roomIndex} does not exist.`);
          return;
        }
      
        const roomGroup = roomsFormArray.at(roomIndex) as FormGroup;
        console.log("roomGroup",roomGroup)
        const travellersArray = roomGroup.get('travellers') as FormArray;
      
        // Find the first traveller of the specified type ('adults')
        const travellerGroup = travellersArray.controls.find(
          (control) => control.value.type === type
        ) as FormGroup;
      
        if (travellerGroup) {
          // Patch the selected adult's details into the form controls
          travellerGroup.patchValue({
            FirstName: option.first_name,
            LastName: option.last_name,
            Title: option.title || '', // Assume title is part of the option object
          });
        } else {
          console.warn(`Traveller of type ${type} not found in room ${roomIndex}.`);
        }
      }
      
      clearDetails(roomIndex: number, type: string): void {
        const roomsFormArray = this.travellerForm.get('rooms') as FormArray;
      
        // Validate the room index
        if (roomIndex >= roomsFormArray.length || roomIndex < 0) {
          console.error(`Room at index ${roomIndex} does not exist.`);
          return;
        }
      
        const roomGroup = roomsFormArray.at(roomIndex) as FormGroup;
        const travellersArray = roomGroup.get('travellers') as FormArray;
      
        // Find the traveller of the specified type
        const travellerGroup = travellersArray.controls.find(
          (control) => control.value.type === type
        ) as FormGroup;
      
        if (!travellerGroup) {
          console.warn(`Traveller of type ${type} not found in room ${roomIndex}.`);
          return;
        }
      
        // Clear the traveller's details
        travellerGroup.patchValue({
          FirstName: '',
          LastName: '',
          Title: '',
        });
      
        console.log(`Details cleared for roomIndex: ${roomIndex}, type: ${type}`);
      }

   
      openSearch(type) {
        if (type === 'flight') {
            this.openFlightSearch(type);
        } else if (type === 'transfer') {
            this.openTransferSearch(type);
        }
        else if (type === 'activity') {
            this.openActivitySearch(type);
        }

    }

    openFlightSearch(data?): void {
        sessionStorage.setItem('activeId','left');
        this.flightService.emitChange("");
        this.dialog.open(CustomDialogWrapperComponent, {
            width: '80vw',
            height: '70vh',
            maxWidth: '100vw',
            maxHeight: '65%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
            data: {
                component: FlightComponent,
                title: 'Flight Search',
                tabvalue: 'flights'
            }
        });
    }



    openTransferSearch(data?): void {
        sessionStorage.setItem('activeId','transfer');
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
        sessionStorage.setItem('activeId','activity');
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
       

        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        console.log(cartData);
        const currentCart = this.cartService.getCartList(); 
        await this.addBundleBooking();
            await this.addAutoSearchData(location);
        // if (!cartData) { // Add check here
        //     await this.addBundleBooking();
        //     await this.addAutoSearchData(location);
        // } else {
        //     this.cartMessage = 'Item already in cart'; // Handle message if item is already added
        // }

        //      await this.addBundleBooking(); // Add item if it's not already in the cart
        //      await this.addAutoSearchData(location); // Add any related data
        // // if (!cartData) {
        // //     await this.addBundleBooking(); // Add item if it's not already in the cart
        // //      await this.addAutoSearchData(location); // Add any related data
        // // } else {
        // //     this.cartMessage = 'Item already in cart'; // Handle message if item is already added
        // // }

        setTimeout(() => {
            this.cartMessage = '';
            this.cdRef.detectChanges(); 
        }, 2000); 
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
            if(key === 'hotel') {
                const req = {
                ResultToken: this.cartItems.ResultIndex,
                refNumber: this.cartItems.refNumber || null,
                module: 'hotel',
                };
            
                this.cartService.removeCart(req).subscribe(
                (res) => {
                    this.cartService.cartItemsSubject.next(res.data);
                    sessionStorage.setItem('cartData', JSON.stringify(res.data));

                    this.hotelAddToCart();
                },
                (error) => {
                    this.swalService.alert.oops();
                }
                );
            }
        })
      })
    }
    
    hotelAddToCart() {
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        const currentCart = this.cartService.getCartList(); 
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
        });
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.hotel['ResultToken']}`,
            exitingToken: this.cartItems ? this.cartItems.ResultIndex : "",
            module: "hotel",
            bookingSource: this.hotel.searchRequest.booking_source,
        }
        this.cartMessage = `Hotel added to cart!`;
        console.log("Adding item to cart:", item);
        this.cartService.addCart(item); // Make sure this method updates cart state properly
        this.cdRef.detectChanges();
    }
    async addBundleBooking() {
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        const currentCart = this.cartService.getCartList(); 
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
          });
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.hotel['ResultToken']}`,
            exitingToken: this.cartItems ? this.cartItems.ResultIndex : "",
            module: "hotel",
            bookingSource: this.hotel.searchRequest.booking_source,
        }
        

        if (!this.isItemAlreadyInCart(item)) {
            this.cartMessage = `Hotel added to cart!`;
            console.log("Adding item to cart:", item);
            this.cartService.addCart(item); // Make sure this method updates cart state properly
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
        console.log("Current Cart:", currentCart);
        return currentCart.some(cartItem =>
            // cartItem.ResultToken === item.ResultToken &&
            // cartItem.exitingToken === item.exitingToken && 
            // cartItem.refNumber === item.refNumber 
            cartItem.module === item.module
        );
    }

    isSameRoomGuests(roomGuests: any[]): boolean {
        if (!roomGuests || roomGuests.length === 0) return false;
        return roomGuests.every(guest => 
            guest.NoOfAdults === roomGuests[0].NoOfAdults && 
            guest.NoOfChild === roomGuests[0].NoOfChild
        );
    }

    

    async addAutoSearchData(location){
        console.log("Hotel Data", this.hotel);
        let item = {
            //"city_code": '',
            "city_code": this.selectedCity ? this.selectedCity.AirportCode : this.selectedLocation.destination_id.city_code,
            "city_name": this.selectedLocation.destination_name,
            "module": "hotel",
            "userType": "B2B",
            "date": this.hotel.searchRequest.CheckIn
        }
      
        
        this.subs.sink = this.apiHandlerService.apiHandler('cartSearchInfo', 'POST',{},{},item)
        .subscribe(res => {
            if (res) {
                console.log("res",res)
                this.autoSearchData = res.data;
                //this.hotelService.hotelAutoFetchData.next(res)
                console.log('datas',this.autoSearchData);
                sessionStorage.setItem('autoSearchData', JSON.stringify(this.autoSearchData));
            }
        });
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
      }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    toggleRemarks() {
        this.showFullRemarks = !this.showFullRemarks;
      }
      
      getShortText(text: string, showFull: boolean): string {
        if (!text) return '';
        return showFull || text.length <= this.maxLength
          ? text
          : text.substring(0, this.maxLength) + '...';
      }
      
      isTextTruncated(text: string): boolean {
        return text && text.length > this.maxLength;
      }

      getCancellationPolicy(data) {
        if (data) {
           return data.split(';');
        } else {
            return '';
        }
      }

      getRepeatArray(count: number): number[] {
  return Array(count).fill(0).map((_, i) => i);
}

getRoomStartIndex(index: number): number {
  let count = 0;
  for (let i = 0; i < index; i++) {
    count += this.hotel.RoomDetails[i].Rooms;
  }
  return count;
}

flattenRoomGuests() {
  const guestDetails = this.hotel.searchRequest.RoomGuests;
  this.flattenedGuests = [];

  guestDetails.forEach((guest) => {
    const roomCount = guest.Rooms || 1;
    for (let i = 0; i < roomCount; i++) {
      this.flattenedGuests.push({
        NoOfAdults: guest.NoOfAdults,
        NoOfChild: guest.NoOfChild,
        ChildAge: guest.ChildAge
      });
    }
  });
}

}
