import { DatePipe, PlatformLocation } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { takeUntil, tap } from 'rxjs/operators';
import { TransferService } from '../transfer.service';
import { DateTime } from '../DateTime';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Subject } from 'rxjs';
import * as moment from 'moment';
export let browserRefresh = false;

@Component({
  selector: 'app-transfer-search',
  templateUrl: './transfer-search.component.html',
  styleUrls: ['./transfer-search.component.scss']
})
export class TransferSearchComponent implements OnInit {
    @ViewChild('popoverRef',  { static: false }) private _popoverRef: PopoverDirective;
    @ViewChild('popoverRefReturn',  { static: false }) private _popoverRefReturn: PopoverDirective;
    @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
    @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
    @ViewChild('arrivalDate', { static: false }) arrivalDate: ElementRef<HTMLElement>;
    @ViewChild('returnDate', { static: false }) returnDate: ElementRef<HTMLElement>;
    bsDateConf: Partial<BsDatepickerConfig> = {
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-blue',
      showWeekNumbers: false
    };
    fadeinn = false;
    travellersFadeinn = false;
    isResultScreen: boolean = false;
    travellerForm: FormGroup;
    regConfig: FormGroup;
    submitted: boolean = false;
    ReturnDate : boolean = false;
    hideLabel : boolean = true;
    travellerCountError: boolean = false;
    infantError: boolean = false;
    @Output() callResult = new EventEmitter<any>();
    departureLocations = [];
    desitnationLocations = [];
    isDesitnationCityLoading: boolean = false;
    isDepartureCityLoading: boolean = false;
    lastKeyupTstamp: number = 0;
    fromCityId: any;
    toCityId: any;
    city: any;
    formFilled: boolean;
    browserRefresh: boolean;
    locationSelected: boolean = false;
    noOfAdults: any = 1;
    noOfChild: any = 0;
    booking_source: any;
    noOfInfants: any = 0;
    arrivalDateTime: string;
    departureDateTime: string;
    myDateValue: Date;
    time: any;
    date:Date;
    isDateVisible: boolean = true;
  isMeridian: boolean = false;
  //dateTime = new Date();
  minDate = new Date();
  deptDate: Date;
  departureTime: Date;
  errorMessage: string;
  private searchCancellation$ = new Subject<void>(); // Subject to manage cancellation
  private destroy$ = new Subject<void>();
  searchTitle: string;
  ngOnInit(): void {
    this.minDate = new Date();
    this.myDateValue = new Date();
    this.updateModify();
    this.location.onPopState(() => {
      this.setFormValues(false);
    });
    this.createForm();
      this.setModifySearch();
      this.setAutoTransferData();
    }
    
    groupedLocations = {
      airports: [],
      googleMaps: [],
      recentSearches: [],
    };
  
    groupedDestinationLocations=
     {
      airports: [],
      googleMaps: [],
      recentSearches: [],
    };

    constructor(private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private transferService: TransferService,
      private apiHandlerService: ApiHandlerService,
      private cdr: ChangeDetectorRef,
      public location: PlatformLocation,
      private datePipe: DatePipe
    ) { }
  
    close() {
      if (this._popoverRef) {
        this._popoverRef.hide();
      }
    }

    closeRef() {
      if (this._popoverRefReturn) {
        this._popoverRefReturn.hide();
      }
    }

    updateModify() {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/search/transfer/transfers-result') || currentUrl.includes('/search/transfer/transfers-details')) {
        this.isResultScreen = true;
        this.searchTitle = 'New Search'
      } else {
        this.isResultScreen = false;
        this.searchTitle = 'Search'
      }
    }
  
    
    clearLocationIfNotSelected() {
      if (!this.locationSelected) {
        this.regConfig.patchValue({ departureCity: '' });
      }
    }
  
    onSubmitTraveller() {
      this.travellersFadeinn = false;
    }
  
    closeTravellers() {
      this.travellersFadeinn = false;
    }
  
    createTravellerForm() {
      return this.fb.group({
          adults: 1,
          childrens: 0,
          infant:0,
      });
    }
    travellers(controlName: string): FormArray {
      return this.regConfig.get(controlName) as FormArray;
    }
    createForm(): void {
      this.regConfig = this.fb.group({
        departureCity: ['', [Validators.required]],
        departureLatitude:['', [Validators.required]],
        departureLongitude:['', [Validators.required]],
        deapartureCountryCode:['', [Validators.required]],
        destinationCity:['', [Validators.required]],
        destinationLatitude:['', [Validators.required]],
        destinationLongitude:['', [Validators.required]],
        destinationCountryCode:['', [Validators.required]],
        arrivalDate: new FormControl('', [Validators.required]), 
        returnDate: new FormControl(''),
        traveller: this.fb.array([this.createTravellerForm()]),
        destination_source: [''],
        IsReturn:[0],
        departureCityId:[''],
        destinationCityId: ['']
      });
    }
  
    hasError = (controlName: string, errorName: string) => {
      return ((this.submitted || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
    }
    
    onUpdateTraveller(i: any, travellerType: string, operation: string) {
      let traveller = this.travellers('traveller');
      let item = traveller.at(i);
      const adults = item.value['adults'];
      const childrens = item.value['childrens'];
      const infant = item.value['infant'];
      const control = traveller.controls[i]['controls'][travellerType];
      let result = 0;
      if (operation === 'minus') {
          result = control.value < 1 ? control.value : control.value - 1;
          if (travellerType == 'adults' && adults > 1) {
              this.noOfAdults -= 1;
          } else if (travellerType == 'childrens' && this.noOfChild >0 && control.value>0) {
              this.noOfChild -= 1;
          } else if (travellerType == 'infant' && infant > 0) {
            this.noOfInfants -= 1;
        }
      } else {
          result = control.value + 1;
      }
      let adultCount = 0, childCount = 0,infantCount =0;
      if (travellerType == 'adults') {
          adultCount = adults;
          if (operation == 'plus' && adultCount <= 99) {
              this.noOfAdults += 1;
          }
      }
      if (travellerType == 'childrens') {
          childCount = childrens;
          if (operation == 'plus' && childCount <= 99) {
              this.noOfChild += 1;
          }
      }
      if (travellerType == 'infant') {
        infantCount = infant;
        if (operation == 'plus' && infantCount <= 99) {
            this.noOfInfants += 1;
        }
    }
      if (operation === 'minus' && travellerType == 'adults' && result < 1) {
          return false;
      }
      if (adultCount > 99 && operation === 'plus') {
          this.travellerCountError = true;
          return false;
      }
      if (childCount > 99 && operation === 'plus') {
          this.travellerCountError = true;
          return false;
      }
      if (infantCount > 99 && operation === 'plus') {
        this.travellerCountError = true;
        return false;
    }
      this.travellerCountError = false;
      control.setValue(result);
      this.regConfig.patchValue({
          traveller: [control]
      });
    }
  
  onSubmit() {
    if (this._popoverRef) {
      this._popoverRef.hide();
    }
    
    this.submitted = true;
    this.errorMessage = '';
    const isReturn = this.regConfig.get('IsReturn').value;
    const pickupDate = moment(this.arrivalDateTime, 'DD/MM/YYYY hh:mm A', true);
    const returnDate = moment(this.departureDateTime, 'DD/MM/YYYY hh:mm A', true);
    if (this.regConfig.get('destinationCity').value != '' && this.regConfig.get('departureCity').value != '' && this.regConfig.get('destinationCity').value == this.regConfig.get('departureCity').value) {
      this.errorMessage = 'Departure and destination city cannot be same';
      return;
    }
    if (isReturn && pickupDate > returnDate) {
      this.errorMessage = 'Pickup date cannot be greater than return date.';
      return;
  }
    //  this.errorMessage = '';
    if (this.regConfig.get('IsReturn').value == 1) {
    
      this.regConfig.patchValue({
        arrivalDate: this.arrivalDateTime,
        returnDate: this.departureDateTime
      })
    }
    if (this.regConfig.get('IsReturn').value == 0) {
      this.regConfig.patchValue({
        arrivalDate: this.arrivalDateTime,
      })
    }
    if (!this.regConfig.valid) {
      return;
    }
    const formData = this.setFormValues(true);
      this.submitForm(formData);
      this.transferService.formFilled.next(this.regConfig.value);
      if (this.router.url == '/search/transfer/transfers-result' || this.router.url == '/search/transfer/transfers-details') {
      }
      else {
        this.router.navigateByUrl("/search/transfer/transfers-result");
      }
    }
  
    submitForm(data: any) {
      this.transferService.transferCopy.next([]);
      this.transferService.transfer.next([]);
      this.callResult.emit(data);
    }
  
    getAutoCompleteLocations(event, control) {
      this.clearValues();
      let inpValue = event.target.value;
      if (this.regConfig.get('destinationCity').value != '' && this.regConfig.get('departureCity').value != '' && this.regConfig.get('destinationCity').value == this.regConfig.get('departureCity').value) {
        this.errorMessage = 'Departure and destination city cannot be same';
        return;
      }
      if (inpValue == "") {
        this.setValidator(control);
      }
      this.departureLocations.length = 0;
      this.desitnationLocations.length = 0;
      if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp > 10)) {
        if (control == 'departureCity') {
          this.isDepartureCityLoading = true;
        }
        else {
          this.isDesitnationCityLoading = true;
        }
        const city_name = `${event.target.value}`;
        this.getCityList(event, control, city_name);
      }
    }
  
    getCityList(event, control, city_name) {
      let request = {userType: "B2B", 'Name': city_name }
      this.searchCancellation$.next();
      this.apiHandlerService.apiHandler('transferCityList', 'POST', '', '', request)
        .pipe(
          takeUntil(this.searchCancellation$), // Cancel previous request when a new one starts
          takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
          tap(() => {
            this.isDepartureCityLoading = false;
            this.isDesitnationCityLoading = false;
          })
        )
        .subscribe((resp: any) => {
          if (resp.statusCode == 200) {
            if (control == 'departureCity') {
              this.departureLocations = resp.data;
              this.groupLocation();
            }
            else {
              this.desitnationLocations = resp.data;
              this.groupDestinationLocation();
            }
            this.cdr.detectChanges();
          }
        }, err => {
        });
      this.lastKeyupTstamp = event.timeStamp;
    }
  
    clearValues(){
      this.groupedDestinationLocations = {
        airports: [],
        recentSearches: [],
        googleMaps: []
      };
      this.groupedLocations = {
        airports: [],
        recentSearches: [],
        googleMaps: []
      };
      
    }
    groupDestinationLocation() {
      this.desitnationLocations.forEach(location => {
        const locationTypeMap = {
          'AP': 'airports',
          'PT': 'recentSearches',
          'RT': 'recentSearches', // Assuming 'RT' should be for hotels, correct if needed
          'TN': 'recentSearches',
          'GoogleMap': 'googleMaps'
        };
        const groupKey = locationTypeMap[location.location_type];
        if (groupKey) {
          this.groupedDestinationLocations[groupKey].push(location);
        } else {
          this.groupedDestinationLocations.recentSearches.push(location);
        }
      });
    }
    
    selectedLocation(control, location) {
      console.log("location", location)
      console.log("control", control)
      this.locationSelected = true;
      this.city = location;
      if (control == 'departureCity') {
        console.log("location 1", location)
        this.regConfig.patchValue({
          departureCityId: `${location['id']}`,
          departureCity: `${location['location_name']}`,
          deapartureCountryCode: `${location['country_code']}`,
          departureLatitude: `${location['latitude']}`,
          departureLongitude: `${location['longitude']}`,
          destination_source: `${location['BookingSource']}`,
          location_data: `${location['location_type']}`,
        })
        if (location) {
          localStorage.setItem('selectedLocation', JSON.stringify(location)); // Use localStorage
        } else {
          console.error('Location is undefined or null');
        }
        // this.fromCityId = location['id'];
        //this.toCityId = location['destination_id'];
        this.departureLocations = [];
      }
      else {
        console.log("location 2", location)
        this.regConfig.patchValue({
          destinationCityId: `${location['id']}`,
          destinationCity: `${location['location_name']}`,
          destination_source: `${location['BookingSource']}`,
          destinationCountryCode: `${location['country_code']}`,
          destinationLatitude: `${location['latitude']}`,
          destinationLongitude: `${location['longitude']}`,
          destinationLocationData: `${location['location_type']}`,
        })
        this.toCityId = location['id'];
        this.desitnationLocations = [];
        this.arrivalDate.nativeElement.focus();
        this.arrivalDate.nativeElement.click();
      }
      return;
    }
  
    setFormValues(value) {
      let RoomGuests = [];
        this.regConfig.controls.traveller.value.forEach(element => {
            RoomGuests.push({
              "adultCount": Number(element['adults']),
              "childCount": Number(element['childrens']),
              "infantCount": Number(element['infant']),
            })
        });
      const formData = {
        FromCityId: this.fromCityId,
        ToCityId: this.toCityId,
        ArrivalDate: this.parseCustomDate(this.arrivalDateTime),
        ReturnDate: this.parseCustomDate(this.departureDateTime),
        paxes: RoomGuests,
        Destination_source:this.regConfig.value.destination_source,
        IsReturn:this.regConfig.value.IsReturn,
        departureCity:this.regConfig.value.departureCity,
        destinationCity:this.regConfig.value.destinationCity,
        deapartureCountryCode:this.regConfig.value.deapartureCountryCode,
        departureLatitude:this.regConfig.value.departureLatitude,
        departureLongitude:this.regConfig.value.departureLongitude,
        destinationCountryCode:this.regConfig.value.destinationCountryCode,
        destinationLatitude:this.regConfig.value.destinationLatitude,
        destinationLongitude:this.regConfig.value.destinationLongitude,
        destinationCityId: this.regConfig.value.destinationCityId,
        departureCityId: this.regConfig.value.departureCityId
      };
      sessionStorage.setItem('transferFormData', JSON.stringify(this.regConfig.value));
      sessionStorage.setItem('transferSearchData', JSON.stringify(formData));
      this.transferService.formFilled.next(JSON.parse(sessionStorage.getItem('transferFormData')));
      this.transferService.transferCopy.next([]);
      this.transferService.transfer.next([]);
      if (value) {
        return formData;
      }
    }

   parseCustomDate(dateStr: string): string | null {
    try {
      const parts = dateStr.trim().split(" "); // ["30/09/2025", "08:00", "PM"]
      if (parts.length < 3) return null;

      const [day, month, year] = parts[0].split("/").map(Number);

      let [hoursStr, minutesStr] = parts[1].split(":");
      let hours = Number(hoursStr);
      let minutes = Number(minutesStr);

      const meridian = parts[2].toUpperCase();
      if (meridian === "PM" && hours < 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;

      // create Date
      const jsDate = new Date(year, month - 1, day, hours, minutes);

      if (isNaN(jsDate.getTime())) return null;

      // Build ISO-like string but without converting to UTC
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00.000`;
    } catch {
      return null;
    }
  }

    showReturn(){
      this.regConfig.get('returnDate').setValidators(Validators.required);
      this.regConfig.patchValue({'IsReturn':1})
      this.ReturnDate = true;
      this.hideLabel = false;
    }
  
    setModifySearch() {
      this.transferService.formFilled.subscribe(data => {
        if (data && data.hasOwnProperty('departureCity')) {
          this.formFilled = true;
        }
        else {
          this.formFilled = false;
        }
      });
      this.browserRefresh = browserRefresh;
      if (this.formFilled) {
        let transferFormData = sessionStorage.getItem('transferFormData');
        transferFormData = JSON.parse(transferFormData);
        // if (transferFormData['arrivalDate']) {
        //   // Split into date and time parts
        //   const [dateStr, timeStr] = transferFormData['arrivalDate'].split(' ');
        
        //   // Split the date (dd/MM/yyyy) and parse it to a Date object
        //   const [day, month, year] = dateStr.split('/');
        //   this.date = new Date(`${month}/${day}/${year}`); // Create Date object for the date part
        
        //   // Parse the time part (e.g., '12:00 AM')
        //   const timeParts = timeStr.split(':'); // Split the time into hours and minutes
        //   let hours = parseInt(timeParts[0]);
        //   const minutes = parseInt(timeParts[1]);
        
        //   // Handle AM/PM
        //   const isPM = timeStr.includes('PM');
        //   if (isPM && hours < 12) {
        //     hours += 12; // Convert PM time to 24-hour format
        //   } else if (!isPM && hours === 12) {
        //     hours = 0; // Convert 12 AM to 0 hours
        //   }
        
        //   // Set the hours and minutes on the date
        //   this.date.setHours(hours, minutes, 0, 0); // Apply time to the date object
        
        //   // Now format the arrivalDateTime with both date and time
        //   this.arrivalDateTime = this.datePipe.transform(this.date, 'dd/MM/yyyy hh:mm a');
          
        //   // If you also need to store the time separately, set it as a string
        //   this.time = timeStr; // Store the time as a string, like '12:00 AM'
        // }
        
        let searchData = sessionStorage.getItem('transferSearchData');
        searchData = JSON.parse(searchData);
        if(searchData['ArrivalDate']) {
          const rawValue = searchData['ArrivalDate'];

          let jsDate: Date | null = null;

          if (rawValue.includes('T')) {
            // ISO format → parse directly
            jsDate = new Date(rawValue);
          } else {
            // Old format: "30/09/2025 12:00 AM"
            const [dateStr, timeStr] = rawValue.split(' ');

            if (dateStr && timeStr) {
              const [day, month, year] = dateStr.split('/').map(Number);
              jsDate = new Date(year, month - 1, day);

              const [hoursStr, minutesStr] = timeStr.split(':');
              let hours = parseInt(hoursStr, 10);
              const minutes = parseInt(minutesStr, 10) || 0;

              const isPM = timeStr.toUpperCase().includes('PM');
              if (isPM && hours < 12) hours += 12;
              if (!isPM && hours === 12) hours = 0;

              jsDate.setHours(hours, minutes, 0, 0);
            }
          }

          if (jsDate && !isNaN(jsDate.getTime())) {
            this.date = jsDate;
            this.arrivalDateTime = this.datePipe.transform(jsDate, 'dd/MM/yyyy hh:mm a');
            this.time = this.datePipe.transform(jsDate, 'hh:mm a'); // e.g., "12:00 AM"
          }
        }
        // transferFormData['IsReturn']==0?(this.arrivalDateTime=transferFormData['arrivalDate']):(this.arrivalDateTime=transferFormData['arrivalDate'],this.departureDateTime=transferFormData['returnDate']);
        // let searchData = sessionStorage.getItem('transferSearchData');
        // searchData = JSON.parse(searchData);
        this.fromCityId = searchData['FromCityId'];
        this.toCityId = searchData['ToCityId'];
        this.noOfAdults=0;
      
        transferFormData['traveller'].forEach(element => {
          this.noOfAdults+= Number(element['adults']);
          this.noOfChild+= Number(element['childrens']);
          this.noOfInfants+= Number(element['infant']);
      });
      if (transferFormData) {
        this.minDate= new Date();
        this.minDate.setDate(this.minDate.getDate() - 1);
        this.createForm();
        // Patch the form values
        this.regConfig.patchValue({
          departureCity: transferFormData['departureCity'],
          destinationCity: transferFormData['destinationCity'],
          arrivalDate: new Date(transferFormData['ArrivalDate']),
          returnDate: new Date(transferFormData['ReturnDate']),
          destination_source: transferFormData['destination_source'],
          IsReturn: transferFormData['IsReturn'],
          departureLatitude:transferFormData['departureLatitude'],
          departureLongitude:transferFormData['departureLongitude'],
          deapartureCountryCode:transferFormData['deapartureCountryCode'],
          destinationLatitude:transferFormData['destinationLatitude'],
          destinationLongitude:transferFormData['destinationLongitude'],
          destinationCountryCode:transferFormData['deapartureCountryCode'],
          destinationCityId: transferFormData['destinationCityId'],
          departureCityId:  transferFormData['departureCityId']

        });
        console.log()
        transferFormData['IsReturn']==1?this.showReturn():null;
        // Handle patching FormArray
        const travellersArray = this.regConfig.get('traveller') as FormArray;
        travellersArray.clear(); // Clear existing controls
        if (transferFormData['traveller']) {
          transferFormData['traveller'].forEach(traveller => {
            travellersArray.push(this.fb.group(traveller));
          });
        }
      }
      
      } else {
        let searchData = sessionStorage.getItem('transferSearchData');
        searchData = JSON.parse(searchData);
        this.regConfig.patchValue({
          departureCity: searchData['departureCity'],
          destinationCity: searchData['destinationCity'],
          destinationCityId: searchData['destinationCityId'],
          departureCityId:  searchData['departureCityId']
        })
  if (searchData['ArrivalDate']) {
  const rawValue = searchData['ArrivalDate'];

  let jsDate: Date | null = null;

  if (rawValue.includes('T')) {
    // ISO format → parse directly
    jsDate = new Date(rawValue);
  } else {
    // Old format: "30/09/2025 12:00 AM"
    const [dateStr, timeStr] = rawValue.split(' ');

    if (dateStr && timeStr) {
      const [day, month, year] = dateStr.split('/').map(Number);
      jsDate = new Date(year, month - 1, day);

      const [hoursStr, minutesStr] = timeStr.split(':');
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10) || 0;

      const isPM = timeStr.toUpperCase().includes('PM');
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      jsDate.setHours(hours, minutes, 0, 0);
    }
  }

  if (jsDate && !isNaN(jsDate.getTime())) {
    this.date = jsDate;
    this.arrivalDateTime = this.datePipe.transform(jsDate, 'dd/MM/yyyy hh:mm a');
    this.time = this.datePipe.transform(jsDate, 'hh:mm a'); // e.g., "12:00 AM"
  }
}

        if (searchData['ReturnDate']) {
          // Split into date and time parts
          const [dateStr, timeStr] = searchData['ReturnDate'].split(' ');
        
          // Split the date (dd/MM/yyyy) and parse it to a Date object
          const [day, month, year] = dateStr.split('/');
          this.date = new Date(`${month}/${day}/${year}`); // Create Date object for the date part
        
          // Parse the time part (e.g., '12:00 AM')
          const timeParts = timeStr.split(':'); // Split the time into hours and minutes
          let hours = parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1]);
        
          // Handle AM/PM
          const isPM = timeStr.includes('PM');
          if (isPM && hours < 12) {
            hours += 12; // Convert PM time to 24-hour format
          } else if (!isPM && hours === 12) {
            hours = 0; // Convert 12 AM to 0 hours
          }
        
          // Set the hours and minutes on the date
          this.date.setHours(hours, minutes, 0, 0); // Apply time to the date object
        
          // Now format the arrivalDateTime with both date and time
          this.departureDateTime = this.datePipe.transform(this.date, 'dd/MM/yyyy hh:mm a');
          
          // If you also need to store the time separately, set it as a string
          this.time = timeStr; // Store the time as a string, like '12:00 AM'
        }
         searchData['paxes'].forEach(element => {
          this.noOfAdults= Number(element['adultCount']);
          this.noOfChild= Number(element['childCount']);
          this.noOfInfants= Number(element['infantCount']);
      });
        // this.arrivalDateTime = this.datePipe.transform(searchData['ArrivalDate'], 'dd/MM/yyyy hh:mm a');
        // this.departureDateTime = this.datePipe.transform(searchData['ReturnDate'], 'dd/MM/yyyy hh:mm a');
      }
    }

    updateDepartureTime(){
        if (this.departureTime) {
          this.departureDateTime = this.datePipe.transform(DateTime.getDateTime(this.deptDate, this.departureTime), 'dd/MM/yyyy hh:mm a');
        }
    }

    updateDeptDate(){
      if (this.deptDate) {
        this.departureDateTime = this.datePipe.transform(DateTime.getDateTime(this.deptDate, this.departureTime), 'dd/MM/yyyy hh:mm a');
      }
      if (!this.departureTime) {
        this.departureTime = new Date(this.deptDate); // Copy the deptDate
        this.departureTime.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
      }
  }

  setValue(){
    this.desitnationLocations = [];
    this.departureLocations = [];
    this.closeRef();
  }

  setData(){
    this.close();
  }


//   updateTime(){
//     if (this.time) {
//       this.arrivalDateTime = this.datePipe.transform(DateTime.getDateTime(this.date, this.time), 'dd/MM/yyyy hh:mm a');
//     }
// }

// updateDate(){
//   if (this.date) {
//     this.arrivalDateTime = this.datePipe.transform(DateTime.getDateTime(this.date, this.time), 'dd/MM/yyyy hh:mm a');
//   }
//   if (!this.time) {
//     this.time = new Date(this.date); // Copy the deptDate
//     this.time.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
//   }
// }
updateTime() {
  if (this.time) {
    // Format the combined date and time
    this.arrivalDateTime = this.datePipe.transform(
      DateTime.getDateTime(this.date, this.time), // Pass both date and time as Date objects
      'dd/MM/yyyy hh:mm a'  // Desired format
    );
    console.log("arrivalDateTime",this.arrivalDateTime)
  }
}


updateDate() {
  // Ensure `this.date` is valid
  if (this.date instanceof Date && !isNaN(this.date.getTime())) {
    // If `this.time` is a valid Date, update `this.date` with the time from `this.time`
    if (this.time instanceof Date && !isNaN(this.time.getTime())) {
      const hours = this.time.getHours();
      const minutes = this.time.getMinutes();
      this.date.setHours(hours, minutes, 0, 0); // Set the hours and minutes to `this.date`
    } else {
      // If `this.time` is not valid, set default time to midnight
      this.time = new Date();
      this.time.setHours(0, 0, 0, 0); // Set time to 00:00
    }

    // Format `arrivalDateTime` with the updated `this.date`
    this.arrivalDateTime = this.datePipe.transform(this.date, 'dd/MM/yyyy hh:mm a');
  } else {
    console.error('Invalid date:', this.date);
  }
}





    
    setTraveller() {
      return this.fb.group({
        adults: [this.noOfAdults],
        childrens: [this.noOfChild],
        infant: [this.noOfInfants]
      });
    }
  
    setValidator(control) {
      this.regConfig.get(control).setValidators(Validators.required);
      this.regConfig.get(control).updateValueAndValidity();
    }
  
    removeDate() {
      this.regConfig.get('returnDate').clearValidators();
      this.regConfig.get('returnDate').updateValueAndValidity();
      this.regConfig.patchValue({'IsReturn':0})
      this.ReturnDate = false;
      this.hideLabel = true;
    }


    setAutoTransferData() {
      const autoSearchData = JSON.parse(sessionStorage.getItem('autoSearchData'));
      console.log("autoSearchData", autoSearchData);
  
      if (autoSearchData && autoSearchData.transferInfo && autoSearchData.transferInfo[0]) {
  
          this.booking_source = autoSearchData.transferInfo[0]['BookingSource'];
          const city = {
              cityId: autoSearchData.transferInfo[0]['code'],
              cityName: autoSearchData.transferInfo[0]['location_name'],
              countryCode: autoSearchData.transferInfo[0]['country_code'],
              status: true,
              source: "",
              //checkin: formatDate(autoSearchData['date']),
          };
  
          this.city = city;
  
          // Patch values into the form
        this.regConfig.patchValue({
  
          booking_source: autoSearchData.transferInfo[0]['booking_source'],
          FromCityId: autoSearchData.transferInfo[0]['code'],
          arrivalDate: new Date(autoSearchData['date']),
          //returnDate: validCheckOut,
          destination_source: this.booking_source,
          departureCity: autoSearchData.transferInfo[0]['location_name'],
          deapartureCountryCode: autoSearchData.transferInfo[0]['country_code'],
          departureLatitude: autoSearchData.transferInfo[0]['latitude'],
          departureLongitude: autoSearchData.transferInfo[0]['longitude'],
          //destinationCountryCode:this.regConfig.value.destinationCountryCode,
          //destinationLatitude:this.regConfig.value.destinationLatitude,
          //destinationLongitude:this.regConfig.value.destinationLongitude,
          // location_data:this.regConfig.value.location_data, 
          // destinationLocationData :this.regConfig.value.destinationLocationData, 
  
        });
        autoSearchData['IsReturn']==1?this.showReturn():null;
        this.arrivalDateTime = this.datePipe.transform(autoSearchData['date'], 'dd-MM-yyyy hh:mm a');
  
        // Handle patching FormArray
        
  
      } else {
          console.warn("AutoSearchData is missing or incomplete.");
      }
  }


    groupLocation() {
      
      this.departureLocations.forEach(location => {
        const locationTypeMap = {
          'AP': 'airports',
          'PT': 'recentSearches',
          'RT': 'recentSearches', // Assuming 'RT' should be for hotels, correct if needed
          'TN': 'recentSearches',
          'GoogleMap': 'googleMaps'
        };
        const groupKey = locationTypeMap[location.location_type];
        if (groupKey) {
          this.groupedLocations[groupKey].push(location);
        } else {
          this.groupedLocations.recentSearches.push(location);
        }
      });
    }
    ngOnDestroy() {
      this.destroy$.next(); // Signal to complete any observables listening for this
      this.destroy$.complete(); // Complete the destroy subject
      this.searchCancellation$.next(); // Ensure any active search requests are canceled
      this.searchCancellation$.complete(); 
  }
  
  }
  