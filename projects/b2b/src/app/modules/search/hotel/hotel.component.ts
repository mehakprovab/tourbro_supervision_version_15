import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { browserRefresh } from '../../../../app/app.component';
import { ApiHandlerService } from '../../../core/api-handlers';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { untilDestroyed } from '../../../core/services';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { ThemeOptions } from '../../../theme-options';
import { HotelService } from './hotel.service';
import { PlatformLocation } from '@angular/common';
import { UtilityService } from '../../../core/services/utility.service';
import { Subject } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { SwalService } from '../../../core/services/swal.service';


@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit, OnDestroy, OnChanges {

    @ViewChild('destination_name', { static: false }) destination_name: ElementRef<HTMLElement>;
    @ViewChild('checkinDate', { static: false }) checkinDate: ElementRef<HTMLElement>;
    @ViewChild('checkoutDate', { static: false }) checkoutDate: ElementRef<HTMLElement>;
    @ViewChild('noOfNights', { static: false }) noOfNights: ElementRef<HTMLElement>;
    @ViewChild('rangePicker', { static:false}) rangePicker!: BsDaterangepickerDirective;
    minDate = new Date();
    setMinDate: any;
    protected subs = new SubSink();
    searchedList: Array<any> = Array();
    public browserRefresh: boolean;
    regConfig: FormGroup;
    isOpen = false as boolean;
    depart = false as boolean;
    bsDateConf = {
        isAnimated: true,
        displayMonths:2,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    tabSubscription: any;
    roomError = false;
    travellersFadeinn = false;
    travellerCountError = false;
    submitSessionHotelSearchKeyCheck;
    @Output() callResult = new EventEmitter<any>();
    city: any;
    booking_source: any;
    primaryColour: any;
    secondaryColour: any;
    dateRange: Date[] = [null, null];
    loadingTemplate: any;
    noOfRooms: any = 1;
    noOfAdults: any = 1;
    noOfChild: any = 0;
    loading: boolean;
    currentUser: any;
    hotels: Array<any> = [];
    countries: any = [];
    nights: number[];
    isResultScreen:boolean = false;
    setMaxDate=new Date();
    searchId:any;
    errorMessage: string;
    private searchCancellation$ = new Subject<void>(); // Subject to manage cancellation
    private destroy$ = new Subject<void>();
    private unsubscribe$ = new Subject();
    private searchTrigger$ = new Subject<any>();
    searchTitle: string;
    loggedInUser: any;
    getBookingSourceList: any;

    constructor(
        private fb: FormBuilder,
        public location: PlatformLocation,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private hotelService: HotelService,
        public globals: ThemeOptions,
        private utility: UtilityService,
        private cdr:ChangeDetectorRef,
        private swalService: SwalService   
    ) { 
        console.log(this.globals.toggleSidebar)
    }
    ngOnChanges(changes: SimpleChanges): void {
      console.log(this.globals.toggleSidebar)
        console.log(changes)
    }

    ngOnInit() {
        this.hotelService.countryList.subscribe(res => {
            this.countries = res;
        });
        this.updateUI();
     
        this.createSearchForm();
       
        this.maxDate(this.setMaxDate);
       
        this.currentUser = this.utility.readStorage('currentUser', sessionStorage)['user_id'];
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        let data1 = sessionStorage.getItem('hotelSearchData');
        data1 = JSON.parse(data1) || {};
        if(data1){
            this.setRoomUI(data1);
            this.setChildUI(data1);
        }
        this.browserRefresh = browserRefresh;
        // const autoSearchData = JSON.parse(sessionStorage.getItem('autoSearchData'));
        if ((this.hotelService.formFilled || this.browserRefresh)) {
            let data = sessionStorage.getItem('hotelSearchData');
        
            data = JSON.parse(data);
            if(data){
            this.regConfig.patchValue({
                destination_name: '',
                destination_id: data['destination_id'],
                destination_source: data1['destination_source'],
                check_in_date: new Date(data['check_in_date']),
                check_out_date: new Date(data['check_out_date']),
                traveller: data['traveller'],
                market:data['market'],
                noOfNights:data['noOfNights'],
                searchId: data['searchId'],
                countryCode: data['countryCode']

            });
            this.enableControl();
            this.setdateRange();
        }
        }
        if (this.browserRefresh == false && data1.hasOwnProperty('destination_name')) {
            this.regConfig.patchValue({
                destination_name: data1['destination_name'],
                destination_id: data1['destination_id'],
                destination_source: data1['destination_source'],
                check_in_date: new Date(data1['check_in_date']),
                check_out_date: new Date(data1['check_out_date']),
                traveller: data1['traveller'],
                market:data1['market'],
                noOfNights:data1['noOfNights'],
                searchId: data1['searchId'],
                countryCode: data1['countryCode']
            });
            this.enableControl();
            this.setdateRange();

        }
        this.location.onPopState(() => {
            this.regConfig.patchValue({
                destination_name: data1['destination_name'],
                destination_id: data1['destination_id'],
                destination_source: data1['destination_source'],
                check_in_date: new Date(data1['check_in_date']),
                check_out_date: new Date(data1['check_out_date']),
                traveller: data1['traveller'],
                market:data1['market'],
                noOfNights:data1['noOfNights'],
                searchId: data1['searchId'],
                countryCode: data1['countryCode']
            });
            this.enableControl();


        });
       
        this.setAutoHotelData();
        this.generateNightsList();
        this.setAdultChildCount(this.regConfig.value['traveller']);
        this.hotelService.hotels.subscribe(h => {
            this.hotels = h;
        });

        
    }
    
    generateNightsList(): void {
        this.nights = Array.from({ length: 30 }, (_, i) => i + 1);
      }

      updateUI() {
        const currentUrl = this.router.url;
        if (currentUrl.includes('hotel/result') || currentUrl.includes('hotel/booking')) {
            this.isResultScreen = true;
            this.searchTitle = 'New Search'
        } else {
            this.isResultScreen = false;
            this.searchTitle = 'Search'
        }
    }

    getMinDate(inDate) {
        const d = new Date(inDate);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year, month, day + 1);
        return c;

    }
    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
        }
    }

    createSearchForm() {
        this.regConfig = this.fb.group({
            destination_name: ['', [Validators.required]],
            destination_id: [''],
            destination_source: [''],
            check_in_date: ['', [Validators.required]],
            check_out_date: ['', [Validators.required]],
            traveller: this.fb.array([this.createTravellerForm()]),
            market: ['GBR',[Validators.required]],
            noOfNights:['', [Validators.required]],
            searchId:[],
            countryCode: ['']
        });
        this.regConfig.get('noOfNights').disable();
    }

    createTravellerForm() {
        return this.fb.group({
            adults: 1,
            childrens: 0,
            childAges:this.fb.array([])
        });
    }

    travellers(controlName: string): FormArray {
        return this.regConfig.get(controlName) as FormArray;
    }

    addRoom() {
        if (this.regConfig.value['traveller'].length < 6) {
            this.noOfRooms++;
            this.noOfAdults++;
            this.travellers('traveller').push(this.createTravellerForm())
        } else {
            this.swalService.alert.oops('You can allow maximum 6 rooms.');
            return ''
        }
    }

    removeRoom(i) {
        if (this.regConfig.value['traveller'].length > 0) {
            this.noOfRooms--;
            this.noOfAdults -= this.regConfig.value['traveller'][i]['adults'];
            this.noOfChild -= this.regConfig.value['traveller'][i]['childrens'];
            this.travellers('traveller').removeAt(i);
        }
    }

    onUpdateTraveller(i: any, travellerType: string, operation: string) {
        let traveller = this.travellers('traveller');
        let item = traveller.at(i);
        const adults = item.value['adults'];
        const childrens = item.value['childrens'];
        const control = traveller.controls[i]['controls'][travellerType];
        const childAge = item['controls']['childAges'] as FormArray;
        let result = 0;
        if (operation === 'minus') {
            result = control.value < 1 ? control.value : control.value - 1;
            if (travellerType == 'adults' && adults > 1) {
                this.noOfAdults -= 1;
            } else if (travellerType == 'childrens' && this.noOfChild >= 0) {
                if(childAge.controls && childAge.controls.length>0){
                    let length=childAge.controls.length-1;
                    this.noOfChild -= 1;
                    childAge.removeAt(length);
                }
            }
        } else {
            result = control.value + 1;
        }
        let adultCount = 0, childCount = 0;
        if (travellerType == 'adults') {
            adultCount = adults;
            if (operation == 'plus' && adultCount <= 9) {
                this.noOfAdults += 1;
            }
        }
        if (travellerType == 'childrens') {
            childCount = childrens;
            if (operation == 'plus' && childCount <= 2) {
                this.noOfChild += 1;
                childAge.push(this.setChildAgeArray())
            }
        }
        if (operation === 'minus' && travellerType == 'adults' && result < 1) {
            return false;
        }
        if (adultCount > 9 && operation === 'plus') {
            this.travellerCountError = true;
            this.roomError = false;
            return false;
        }
        if (childCount > 2 && operation === 'plus') {
            this.travellerCountError = true;
            this.roomError = false;
            return false;
        }
        this.travellerCountError = false;
        control.setValue(result);
        this.regConfig.patchValue({
            traveller: [control]
        });
    }

    onSubmitTraveller() {
        this.travellersFadeinn = false;
    }

    closeTravellers() {
        this.travellersFadeinn = false;
    }

   
    getSearchedList(event: any): void {
        const target = event.target as HTMLInputElement;
    
        if (target.id === 'destination_name') {
          this.depart = true;
        } else {
          this.depart = false;
        }
    
        if (target && target.value) {
          const city_name = target.value.trim();
          console.log("city_name", city_name);
    
          // Cancel any previous ongoing request
          this.searchCancellation$.next();
    
          this.apiHandlerService.apiHandler('cityList', 'POST', '', '', { city_name,"userType": "B2B", "userId": this.loggedInUser.id })
            .pipe(
              takeUntil(this.searchCancellation$), // Cancel previous request when a new one starts
              takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
            )
            .subscribe((resp: any) => {
              if (resp.Status) {
                this.searchedList = resp.data;
                const getBookingSource: any = [...new Set(resp.data.map(data => data.booking_source))];
                this.getBookingSourceList =  getBookingSource[0].split(',')
                .map(code => ({code} ));
                sessionStorage.setItem("Hotel_API_List", JSON.stringify(this.getBookingSourceList));
                this.cdr.detectChanges();
              } else {
                this.searchedList = [];
                console.log("No data found");
              }
            }, error => {
              console.error("Error in API call", error);
              this.searchedList = [];
            });
        }
      }
    getCity(event: any): void {
        this.city = `${event.cityId}`;
        this.booking_source = `${event.booking_source}`;
        this.searchId = `${event.searchId}`;
        let cityName = `${event.cityName} (${event.countryCode})`;
        if (cityName) {
            this.regConfig.patchValue({ destination_name: cityName });
            this.regConfig.patchValue({ countryCode: event.countryCode });
            this.checkinDate.nativeElement.click();
            this.searchedList.length = 0;
        }
    }

    submitForm(data: any) {
        this.hotelService.hotelsCopy.next([]);
        this.hotelService.hotels.next([]);
        this.callResult.emit(data);
    }

    onSubmit(): void {
        this.hotelService.loading.next(true);
        this.globals.toggleSidebar = true;
        this.submitSessionHotelSearchKeyCheck = true;
        this.hotelService.formFilled = {};
        if(this.errorMessage)
         {
            return;
          }        
          if (this.city) {
            this.regConfig.value['destination_id'] = this.city;
            if (!this.regConfig.value['booking_source'])
                this.regConfig.value['destination_source'] = this.booking_source;
                this.regConfig.value['searchId'] = this.searchId;
        }

        
        this.hotelService.formFilled = this.regConfig.value;
        sessionStorage.removeItem('hotelSearchData');
        sessionStorage.removeItem('autoSearchData');
         sessionStorage.setItem('hotelSearchData', JSON.stringify(this.regConfig.value));
        console.log("this.regConfig.value",this.regConfig.value)
        sessionStorage.setItem('submitSessionHotelSearchKeyCheck', 'true');
        setTimeout(() => {
            this.isOpen = false;
            this.travellersFadeinn = false;
        }, 100);

        if (this.router.url == '/search/flight/result' || this.router.url == '/search/flight/booking'||
            this.router.url === '/search/activity/activity-booking' || this.router.url === '/search/transfer/transfers-bookings'
        ) {
            this.hotelService.formFilled = this.regConfig.value;
            this.prepareSearchPayloadFromSessionData('hotelSearchData');
            this.router.navigate(
                [
                    "search/hotel/result",
                ]
            );
        }

        if (this.router.url == "/dashboard") {
            this.router.navigate(
                [
                    "search/hotel/result",
                ]
            );
        } else {
            this.hotelService.isCollapsed.next(true);
            let RoomGuests = [];
            this.regConfig.controls.traveller.value.forEach(element => {
                RoomGuests.push({
                    "NoOfAdults": Number(element['adults']),
                    "NoOfChild": Number(element['childrens']),
                    "ChildAge": element['childAges']
                })
            });
            const formData = {
                UserId: this.currentUser,
                UserType: "B2B",
                CheckIn: this.regConfig.controls.check_in_date.value,
                CheckOut: this.regConfig.controls.check_out_date.value,
                Currency: "GBP",
                Market: this.regConfig.controls.market.value,
                CancellationPolicy: true,
                CityIds: [this.regConfig.value['destination_id']],
                NoOfRooms: this.regConfig.controls.traveller.value.length,
                RoomGuests: RoomGuests,
                booking_source: this.regConfig.controls.destination_source.value,
                searchId:this.searchId,
                NoOfNights:this.regConfig.controls.noOfNights.value,
                CountryCode: this.regConfig.controls.countryCode.value
            };
            this.submitForm(formData);
        }

    }

    

    prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
        console.log("ssd",ssd)
        let RoomGuests = [];
        ssd['traveller'].forEach(element => {
            RoomGuests.push({
                "NoOfAdults": Number(element['adults']),
                "NoOfChild": Number(element['childrens']),
                "ChildAge":element['childAges']
            })
        });

        let reqBody = {
            "CheckIn": `${ssd['check_in_date']}`,
            "CheckOut": `${ssd['check_out_date']}`,
            "Currency": 'GBP',
            "Market": `${ssd['market']}`,
            "CancellationPolicy": true,
            "CityIds": [
                `${ssd['destination_id']['cityId']}`
            ],
            "NoOfNights": `${ssd['noOfNights']}`,
            NoOfRooms: Number(ssd['traveller'].length),
            RoomGuests,
            booking_source: `${ssd['destination_source']}`,
            searchId:`${ssd['searchId']}`,
            CountryCode: `${ssd['countryCode']}`
        }
        this.hotelService.searchResult(reqBody);
    }

    onCheckIn(event) {
        console.log("event",event)
        if (event) {
            const eventDate = new Date(event);
            eventDate.setDate(eventDate.getDate() + 1);
            this.regConfig.patchValue({
                check_out_date: eventDate
            });
            this.setMinDate = eventDate;
            this.maxDate(event);
            this.setNoOfNights();
        }
        
    }

    maxDate(event) {
        const date = new Date(event);
        date.setDate(date.getDate() + 30);
        this.setMaxDate = date;
        this.cdr.detectChanges();
    }

    onCheckOut(event) {
        if (event) {
            this.setNoOfNights();
        }
    }
    setNoOfNights() {
        var check_in_date =  new Date(this.regConfig.get('check_in_date').value);
        var check_out_date =  new Date(this.regConfig.get('check_out_date').value);
        var timeDiff = Math.abs(check_out_date.getTime() - check_in_date.getTime());
        var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        this.regConfig.patchValue({
            noOfNights:numberOfNights
        })
        this.enableControl();
    }
    enableControl(){
        this.regConfig.get('noOfNights').enable();
    }
    getAge(empIndex: number): FormArray {
        return this.travellers('traveller').at(empIndex).get("childAges") as FormArray
    }

    onChange(value, index, ageIndex) {
        const childAges = this.getAge(index);
        childAges.controls[ageIndex].patchValue({ childAge: value });
    }

    setChildAgeArray(){
        return this.fb.group({
            childAge: 2,
        });  
      }

      setRoomUI(data1){
        if(data1 && data1.traveller){
            this.setAdultChildCount(data1.traveller);
            this.noOfRooms=0;
            this.noOfRooms=data1.traveller.length;
            if (data1['traveller'] && data1['traveller'].length > 1) {
                const traveller = this.regConfig.get('traveller') as FormArray;
                for (let i = 0; i < (data1['traveller'].length - 1); i++) {
                    traveller.push(this.createTravellerForm())
                }
            }
        }
        if (data1) {
            localStorage.setItem('selectedLocation', JSON.stringify(data1)); // Use localStorage
            console.log('Show Data', data1)
        } else {
            console.error('Location is undefined or null');
        }
    }

    setChildUI(data1) {
        if (data1['traveller'] && data1['traveller'].length) {
            const traveller = this.regConfig.get('traveller') as FormArray;
            for (let i = 0; i < data1['traveller'].length; i++) {
                const childAge = traveller.controls[i]['controls']['childAges'] as FormArray;
                for (let index= 0; index < data1['traveller'][i].childAges.length; index++) {
                    childAge.push(this.setChildAgeArray())
                }
            }
        }
    }

    setAdultChildCount(traveller){
        if(traveller){
        this.noOfAdults=0;
        this.noOfChild=0;
            traveller.forEach(element => {
                this.noOfAdults += element.adults;
                this.noOfChild += element.childrens;
            });
        }
    }
    
    ngOnDestroy() {
        // Ensure to call untilDestroyed to complete the subscription properly
        // This is crucial to avoid memory leaks
        // Example:
        this.destroy$.next(); // Signal to complete any observables listening for this
        this.destroy$.complete(); // Complete the destroy subject
        this.searchCancellation$.next(); // Ensure any active search requests are canceled
        this.searchCancellation$.complete(); 
    }

    openDateRangePicker(): void {
        this.rangePicker.show();
      }

      onChangeType(value: number) {
        console.log("value",value)
        const checkInDate = new Date(this.regConfig.get('check_in_date').value);
        
        // Calculate new check-out date based on the selected number of nights
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + (+value));
    
        // Update the date range
        this.dateRange = [checkInDate, checkOutDate];
    
        // Patch the values to the form
        this.regConfig.patchValue({
            check_out_date: checkOutDate,
        });
    
        // Optional: Validate the new date range
        if (checkInDate.getTime() === checkOutDate.getTime()) {
            this.errorMessage = 'Check-Out date cannot be the same as Check-In date.';
            return;
        }
    
        this.setNoOfNights();
    }

    onRangeChange(value: Date[]): void {
        this.errorMessage =''
        this.dateRange = value;
        // let checkin = formatDate(this.dateRange[0], 'DD-MM-YYYY'); // String((<Date>this.regConfig.value.checkinDate[0]).toLocaleDateString());
        // let checkout = formatDate(this.dateRange[1], 'DD-MM-YYYY');
        this.regConfig.patchValue({
            check_in_date:this.dateRange[0],
            check_out_date: this.dateRange[1]
        });
        const [checkIn, checkOut] = value;
        
        // Validate Check-In and Check-Out dates
        if (checkIn.getTime() === checkOut.getTime()) {
            this.errorMessage = 'Check-Out date cannot be the same as Check-In date.';
          return;
        }
        this.setNoOfNights();
      }

      setdateRange(){
        const checkinValue = this.regConfig.get('check_in_date').value;
        const checkoutValue = this.regConfig.get('check_out_date').value;
        let value=[];
        // Push only if the value is not null or undefined
        if (checkinValue) {
            value.push(checkinValue);
        }
        if (checkoutValue) {
            value.push(checkoutValue);
        }
        this.dateRange=value;
      }

      setAutoHotelData() {
        //this.createSearchForm();
        const autoSearchData = JSON.parse(sessionStorage.getItem('autoSearchData'));
        console.log("autoSearchData", autoSearchData);
    
        if (autoSearchData) {
            const today = new Date();
            const check_in = new Date(autoSearchData['date']);
            const check_out = new Date(check_in);
            check_out.setDate(check_in.getDate() + 1);
    
            const validCheckIn = check_in >= today ? check_in : today;
            const validCheckOut = check_out > validCheckIn ? check_out : new Date(validCheckIn.setDate(validCheckIn.getDate() + 1));
    
            //this.booking_source = "TLAPINO00004"; // Static booking source
            this.booking_source = autoSearchData.hotelInfo[0]['booking_source'];
            //this.destination_name = autoSearchData.hotelInfo[0]['cityName']
            const city = {
                cityId: autoSearchData.hotelInfo[0]['cityId'],
                destination_id: autoSearchData.hotelInfo[0]['cityId'],
                destination_name: autoSearchData.hotelInfo[0]['cityName'],
                countryCode: autoSearchData.hotelInfo[0]['countryCode'],
                status: true,
                source: "",
                check_in_date: validCheckIn,
            };
    
            this.city = city;
            this.searchId = autoSearchData.hotelInfo[0]['searchId']; // Extract searchId
    
            // Patch values into the form
            if (autoSearchData && autoSearchData.hotelInfo && autoSearchData.hotelInfo.length > 0) {
            this.regConfig.patchValue({
                destination_name: autoSearchData.hotelInfo[0]['cityName'],
                check_in_date: validCheckIn,
                check_out_date: validCheckOut,
                destination_id: city,
                searchId:this.searchId,
                destination_source: this.booking_source,
            });
            console.log('dname', autoSearchData.hotelInfo[0]['cityName']);
            } else {
                console.error("autoSearchData or hotelInfo is invalid");
            }
            //this.enableControl();
            this.setdateRange();
            this.setNoOfNights();
        } else {
            console.warn("AutoSearchData is missing or incomplete.");
        }
    }


}
