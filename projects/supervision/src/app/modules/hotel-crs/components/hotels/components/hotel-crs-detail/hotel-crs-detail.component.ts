import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, HostListener  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Logger } from '../../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { tap } from 'rxjs/operators';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

export interface LocationI {
  cityId: string;
  cityName: string;
  countryCode: string;
  status: boolean;
  source: string;
}
const log = new Logger('Hotel/AddUpdateHotel');
@Component({
  selector: 'app-hotel-crs-detail',
  templateUrl: './hotel-crs-detail.component.html',
  styleUrls: ['./hotel-crs-detail.component.scss']
})
export class HotelCrsDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('check_in_time', { static: false }) check_in_time: ElementRef<HTMLElement>;
  @ViewChild('check_out_time', { static: false }) check_out_time: ElementRef<HTMLElement>;
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
  mapOptions: google.maps.MapOptions;
  marker: google.maps.Marker;
  center!: google.maps.LatLngLiteral;
  searchBox!: google.maps.places.SearchBox;

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  hotelForm: FormGroup;
  requestForm: FormGroup;
  userTypeForm:FormGroup
  isHotelImage: boolean;
  submittedHotel: boolean = false;
  submittedHotelImage: boolean = false;
  addedHotelDetail: any;
  coreCityList: any[] = [];
  @Input() hotelOne: any;
  @Output() callResult = new EventEmitter<any>();
  @Output() isHotelDetails = new EventEmitter<any>()
  @Output() someEvent = new EventEmitter<any>();
  imagePath: any;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    // containerClass: 'theme-green'
  };
  selectedCityName: string = '';
  selectedCityCode: string = '';
  isHotelDetail: boolean;
  multiSelectAmenity = [];
  noData: boolean;
  hotelAmenityList: any[] = [];
  hotelData: any;
  hotelTypeList: any[] = [];
  coreCountryList: any[] = [];
  coreStateList: any[] = [];
  imgURL;
  updateImage;
  isHotelImageActive: boolean;
  dropdownSettingsForHotel = {};
  dropdownSettingsForAmentities={}
  isOpen = false as boolean;
  isDepartureCityLoading: boolean = false;
  departureLocations = [];
  lastKeyupTstamp: number = 0;
  city: LocationI;
  toCityId: any;
  dropdownSettingsForview = {}
  currencyList: any;
  mealPrice: any;
  timezones: string[] = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
    'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+05:30', 'UTC+06:00',
    'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00', 'UTC+13:00', 'UTC+14:00'
  ];
  times: string[] = [
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
    '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
    '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
    '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
  ];
  viewList: any[] = [];
  mealList: any[] = [];
  datas = [
    { item_id: 1, item_text: 'Thursday' },
    { item_id: 2, item_text: 'Friday' },
    { item_id: 3, item_text: 'Saturday' },
    { item_id: 4, item_text: 'Sunday' },

  ];
  dropdownSettingsForWeek = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    maxHeight: 197,
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  city_name: any;
  isChildrenAllow: any;
  isChilderns: boolean = false;
  disableCurrency: boolean = false;
  disableUserType: boolean = false;
  loggedInUser: any;
  currencyRequest: boolean = false;
  usertypeRequest:boolean = false;
  filteredCurrencyList: any;
  isB2BDefault = false;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  filteredOptions: any[] = [
    { value: "B2C", label: "B2C" },
    { value: "B2B", label: "B2B" },
    { value: "Both", label: "Both" }
  ];
  minDate = new Date();
  userTypeSubmit: boolean = false;
  edit: boolean = false;
  constructor(private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef) {
    this.dropdownSettingsForHotel = {
      singleSelection: false,
      idField: 'id',
      textField: 'meals',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
      this.dropdownSettingsForAmentities = {
      singleSelection: false,
      idField: 'id',
      textField: 'hotel_amenity_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForview = {
      singleSelection: false,
      idField: 'id',
      textField: 'views',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    //  this.getHotelAmenityList();
    this.getScreenSize()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getScreenSize();
    // Perform actions based on new screen size
    // e.g., update component styles, change content
  }

  getScreenSize() {
    console.log( window.innerWidth, window.innerHeight);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth < 1510) {
      this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'meals',
        maxHeight: 197,
        itemsShowLimit: 1,
      };
           this.dropdownSettingsForAmentities = {
      singleSelection: false,
      idField: 'id',
      textField: 'hotel_amenity_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
      this.dropdownSettingsForview = {
        singleSelection: false,
        idField: 'id',
        textField: 'views',
        maxHeight: 197,
        itemsShowLimit: 1,
      };
    } else {
      this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'meals',
        maxHeight: 197,
        itemsShowLimit: 2,
      };
           this.dropdownSettingsForAmentities = {
      singleSelection: false,
      idField: 'id',
      textField: 'hotel_amenity_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
      this.dropdownSettingsForview = {
        singleSelection: false,
        idField: 'id',
        textField: 'views',
        maxHeight: 197,
        itemsShowLimit: 2 ,
      };
    }
  }
  ngOnInit() {
    console.log("hotelOne", this.hotelOne)
    this.loggedInUser = JSON.parse(sessionStorage.getItem("currentSupervisionUser"));
    this.createHotelDetailForm();
    // this.getHotelAmenityList();
    this.getHotelTypeList();
    this.getCoreCountryList();
    this.getMealList();
    this.getStayAmenityList()
    this.getViewList();
    this.getCurrencyList();
    if (this.loggedInUser.auth_role_id === 7) {
      let supplier_type = this.loggedInUser.supplier_type;
      if(supplier_type === 'B2C,B2B') {
        supplier_type = 'Both'
      }
      this.isB2BDefault = true;
      this.hotelForm.get('user_type').setValue(supplier_type);
      this.hotelForm.get('user_type').disable();
    } else {
      this.isB2BDefault = false;
      this.hotelForm.get('user_type').enable();
    }
    // this.mapInitializer();
    // try {
      this.requestForm = this.fb.group({
        currency: ['',Validators.required],
      });
      this.userTypeForm = this.fb.group({
        user_type: [''],
      });
    this.hotelCrsService.updateData.subscribe((data => {
      this.loading = true;
      console.log("data", data)
      this.hotelOne = data || {};
      console.log("Object.keys(data).length", Object.keys(this.hotelOne).length)
      if (Object.keys(this.hotelOne).length) {
        // if (!this.utilityService.isEmpty(this.hotelOne)) {
        this.edit = true;
        console.log("this.hotelOne", this.hotelOne)
        const data = [
          { id: this.hotelOne['id'] }
        ];
        data['topic'] = 'editHotel';
        this.hotelCrsService.fetch(data).subscribe(resp => {
          if (resp.statusCode == 200) {
            this.noData = false;
            this.hotelData = resp.data;
            this.getMealList();
            this.loading = false;
          } else {
            this.noData = true;
            this.swalService.alert.oops();
            this.loading = false;
          }
        });
        //}
      } else {
        this.edit = false;
        this.loading = false;
      }
    }))

    // } catch (e) { console.log(e); }
  }
 ngAfterViewInit() {
  this.getGeoCoords();
}
  
  getGeoCoords() {
    if (this.hotelData && this.hotelData.latitude && this.hotelData.longitude) {
      this.center = {
        lat: parseFloat(this.hotelData.latitude),
        lng: parseFloat(this.hotelData.longitude)
      };
      this.mapInitializer();
    } else {
      navigator.geolocation.getCurrentPosition(pos => {
        this.center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.mapInitializer();
      }, err => {
        console.error(`Browser does not support GeoLocation`, err);
      });
    }
    this.cdRef.detectChanges();
  }

 async patchHotel() {
  if(this.loggedInUser.auth_role_id == 6 || this.loggedInUser.auth_role_id == 7){
    this.disableCurrency = true;
    this.hotelForm.get('currency').disable();
  }
  if(this.loggedInUser.auth_role_id == 6 || this.loggedInUser.auth_role_id == 7){
    this.disableUserType = true;
    this.hotelForm.get('user_type').disable();
  }
  
  this.dropdownSettingsForHotel = {
    singleSelection: false,
    idField: 'id',
    textField: 'meals',
    maxHeight: 197,
    itemsShowLimit: 2
  };
  this.dropdownSettingsForAmentities = {
    singleSelection: false,
    idField: 'id',
    textField: 'hotel_amenity_name',
    maxHeight: 197,
    itemsShowLimit: 2,
  };
  this.dropdownSettingsForview = {
    singleSelection: false,
    idField: 'id',
    textField: 'views',
    maxHeight: 197,
    itemsShowLimit: 2,
  };
  this.dropdownSettingsForWeek = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    maxHeight: 197,
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  
  const selectedCountryId = this.hotelData['core_country_id'];
  await this.getCityListAuto({ target: { value: selectedCountryId } });
  this.updateMapWithCityAndCountry(this.hotelData.city_name, 'CountryName');
  console.log("this.hotelData", this.hotelData);
  
  // CRITICAL FIX: Check which field has the amenities data
  let stayAmenitiesData = '';
  if (this.hotelData['stay_amenities']) {
    stayAmenitiesData = this.hotelData['stay_amenities'];
  } else if (this.hotelData['hotel_hotel_amenities']) {
    stayAmenitiesData = this.hotelData['hotel_hotel_amenities'];
  } else if (this.hotelData['hotel_hotel_amenities_ids']) {
    stayAmenitiesData = this.hotelData['hotel_hotel_amenities_ids'];
  }
  
  console.log("Stay amenities data from API:", stayAmenitiesData);
  
  this.hotelForm.patchValue({
    hotel_name: this.hotelData['hotel_name'] || '',
    contract_expiry_date: this.hotelData['contract_expiry_date'] ? `${(moment(this.hotelData['contract_expiry_date'])).format('DD/MM/YYYY')}` : null,
    star_rating: this.hotelData['star_rating'] == 0 ? 'Unrated' : this.hotelData['star_rating'],
    hotel_description: this.hotelData['hotel_description'] || '',
    hotel_hotel_type_id: this.hotelData['hotel_hotel_type_id'] || '',
    core_country_id: this.hotelData['core_country_id'] || '',
    core_state_id: this.hotelData['core_state_id'] || '',
    city_name: this.hotelData['city_name'] || '',
    address: this.hotelData['address'] || '',
    latitude: this.hotelData['latitude'] || '',
    longitude: this.hotelData['longitude'] || '',
    phone_number: this.hotelData['phone_number'] || '',
    email: this.hotelData['email'] || '',
    image: this.hotelData['image'] || '',
    xl_hotel_code: this.hotelData['xl_hotel_code'] || '',
    gst_state: this.hotelData['gst_state'] || '',
    gst_number: this.hotelData['gst_number'] || '',
    ifsc_code: this.hotelData['ifsc_code'] || '',
    beneficiary_account_number: this.hotelData['beneficiary_account_number'] || '',
    beneficiary_name: this.hotelData['beneficiary_name'] || '',
    bank_name: this.hotelData['bank_name'] || '',
    location: this.hotelData['location'] || '',
    status: Number(this.hotelData['status']) ? true : false,
    hotel_hotel_amenities: '',
    check_in_time: (this.hotelData['check_in_time']) || '',
    check_out_time: (this.hotelData['check_out_time']) || '',
    // FIX: Use the correct method for stay amenities
    stay_amenities: this.getAlreadySelectedStayAmenities(stayAmenitiesData),
    meal_plans: this.getAlreadySelectedMealPlans(this.hotelData['meal_plans']),
    weekend_days: this.getAlreadySelectedWeek(this.hotelData['weekend_days']),
    room_view_ids: this.getAlreadySelectedView(this.hotelData['room_view_ids']),
    currency: this.getCurrencyNameById(this.hotelData['currency']),
    children_free_before: this.hotelData.children_free_before || 0,
    paid_children_from_age: this.hotelData.paid_children_from_age || 0,
    paid_children_to_age: this.hotelData.paid_children_to_age || 0,
    local_timezone: this.hotelData.local_timezone,
    meal_price: this.hotelData.meal_price || 0,
    accomodation_or_meal: this.hotelData.accomodation_or_meal || '',
    channel: this.hotelData.channel,
    user_type: this.hotelData.user_type,
    hotel_policy: this.hotelData.hotelPolicy || ''
  });
  
  if (this.hotelData.paid_children_from_age != 0 && this.hotelData.meal_price != 0) {
    this.isChilderns = true;
    this.mealPrice = true;
  } else {
    this.isChilderns = true;
  }
  
  console.log("hotelForm after patch", this.hotelForm.value);
  this.updateImage = this.hotelData['image'];
}

// NEW METHOD: For stay amenities (using amenitiesList, not mealList)
getAlreadySelectedStayAmenities(amenities) {
  if (!amenities || amenities === 'undefined' || amenities === 'null' || amenities === '') {
    console.log("No stay amenities provided, returning empty array");
    return [];
  }
  
  const amenityIds = amenities.split(',');
  console.log("Stay amenity IDs:", amenityIds);
  
  // Make sure amenitiesList is loaded
  if (!this.amenitiesList || !this.amenitiesList.length) {
    console.log("Amenities list not loaded yet");
    return [];
  }
  
  // Filter using amenitiesList, not mealList
  const selectedAmenities = this.amenitiesList.filter(amenity => 
    amenityIds.includes(String(amenity.hotel_amenity_name)) || 
    amenityIds.includes(String(amenity.id))
  );
  console.log("Selected stay amenities:", selectedAmenities);
  return selectedAmenities;
}

// NEW METHOD: For meal plans (using mealList)
getAlreadySelectedMealPlans(mealPlans) {
  if (!mealPlans || mealPlans === 'undefined' || mealPlans === 'null' || mealPlans === '') {
    console.log("No meal plans provided, returning empty array");
    return [];
  }
  
  const mealIds = mealPlans.split(',');
  console.log("Meal plan IDs:", mealIds);
  
  if (!this.mealList || !this.mealList.length) {
    console.log("Meal list not loaded yet");
    return [];
  }
  
  const selectedMeals = this.mealList.filter(meal => 
    mealIds.includes(String(meal.meals)) || 
    mealIds.includes(String(meal.id))
  );
  console.log("Selected meal plans:", selectedMeals);
  return selectedMeals;
}

// Keep existing methods for view and week
getAlreadySelectedView(amenities) {
  if (!amenities || amenities === 'undefined' || amenities === 'null' || amenities === '') {
    console.log("No view amenities provided, returning empty array");
    return [];
  }
  
  const amenityIds = amenities.split(',');
  console.log("View IDs:", amenityIds);
  
  if (!this.viewList || !this.viewList.length) {
    console.log("View list not loaded yet");
    return [];
  }
  
  const selectedView = this.viewList.filter(amenity => 
    amenityIds.includes(String(amenity.views)) || 
    amenityIds.includes(String(amenity.id))
  );
  console.log("Selected views:", selectedView);
  return selectedView;
}

getAlreadySelectedWeek(amenities) {
  if (!amenities || amenities === 'undefined' || amenities === 'null' || amenities === '') {
    console.log("No week days provided, returning empty array");
    return [];
  }
  
  const amenityIds = amenities.split(',');
  console.log("Week days:", amenityIds);
  
  const selectedMeal = this.datas.filter(amenity => 
    amenityIds.includes(String(amenity.item_text))
  );
  console.log("Selected week days:", selectedMeal);
  return selectedMeal;
}
  

  supplierRequest(){
    this.filterCurrencyList();
    this.currencyRequest = true;
  }
  supplierUserRequest(){
    // this.filterCurrencyList();
    this.usertypeRequest = true;
  }
  updateCurrencyRequest(){
    const request = {
      fromCurrency: this.hotelData.currency,
      currency: this.requestForm.controls.currency.value,
      hotelCode: this.hotelData.hotel_code,
      email: this.loggedInUser.email
    }
    this.apiHandlerService.apiHandler('supplierRequest', 'POST', '', '', request)
    .subscribe((resp: any) => {
      if (resp.statusCode == 201 || resp.statusCode == 200) {
        this.swalService.alert.success("Request Sent successfully!");
        this.currencyRequest = false;
        this.cdRef.detectChanges();
      }
    }, err => {
      this.swalService.alert.oops("Something went wrong...");
      this.currencyRequest = false;
    });
    this.requestForm.reset();
  }

  updateUserTypeRequest(){
    this.userTypeSubmit = true;
    if (!this.userTypeForm.valid) {
      return;
    }
    const request = {
      fromUserType: this.hotelData.user_type,
      userType: this.userTypeForm.controls.user_type.value,
      hotelCode: this.hotelData.hotel_code,
      email: this.loggedInUser.email
    }
    this.apiHandlerService.apiHandler('supplierRequest', 'POST', '', '', request)
    .subscribe((resp: any) => {
      if (resp.statusCode == 201 || resp.statusCode == 200) {
        this.userTypeSubmit = false;
        this.swalService.alert.success("Request Sent successfully!");
        this.usertypeRequest = false;
        this.cdRef.detectChanges();
      }
    }, err => {
      this.swalService.alert.oops("Something went wrong...");
      this.usertypeRequest = false;
       this.userTypeSubmit = false;
    });
    this.userTypeForm.reset();
  }

  getCurrencyNameById(id: any) {
    // Ensure that the id is treated as a number for comparison
    const numericId = String(id);
    const currency = this.currencyList.find(item => item.currency === numericId);
    return currency ? currency.currency : ''; // Return the currency name
  }
  formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes as 'MM'
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted time string in 'HH:MM AM/PM' format
    return `${hours}:${formattedMinutes} ${ampm}`;
  }
mapInitializer() {
  if (!this.gmap) return;

  this.mapOptions = {
    center: this.center,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

  this.placeMarker();
  this.initializeSearchBox();
}
  placeMarker() {
    this.marker = new google.maps.Marker({
      position: this.center,
      map: this.map
    });

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.marker.setPosition(event.latLng);
        this.hotelForm.get('latitude').setValue(event.latLng.lat());
        this.hotelForm.get('longitude').setValue(event.latLng.lng());

        // Fetch the correct timezone from Google API
        this.getTimezoneOffset(event.latLng.lat(), event.latLng.lng());

        // Get address from coordinates
        this.getAddress(event.latLng);
      }
    });


    this.marker.addListener('dblclick', () => {
      this.map.setZoom(12);
      this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
    });
  }

initializeSearchBox() {
  const input = this.searchInput.nativeElement as HTMLInputElement;

  const options: google.maps.places.AutocompleteOptions = {
    types: ['lodging'], // 🔥 only hotels
    componentRestrictions: { country: 'in' } // restrict to India
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // 🔥 STRICT CITY BOUNDING
  if (this.selectedCityName) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.selectedCityName }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const bounds = results[0].geometry.viewport;

        autocomplete.setBounds(bounds);
        autocomplete.setOptions({ strictBounds: true }); // ✅ VERY IMPORTANT
      }
    });
  }

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      this.swalService.alert.oops("Invalid location");
      return;
    }

    // 🔥 EXTRA VALIDATION (MOST IMPORTANT FIX)
    const address = place.formatted_address || '';
    if (!address.toLowerCase().includes(this.selectedCityName.toLowerCase())) {
      this.swalService.alert.oops(`Please select hotel only in ${this.selectedCityName}`);
      input.value = '';
      return;
    }

    const location = place.geometry.location;

    // Move map
    this.map.setCenter(location);
    this.marker.setPosition(location);

    // Fill form
    this.hotelForm.get('latitude').setValue(location.lat());
    this.hotelForm.get('longitude').setValue(location.lng());
    this.hotelForm.get('address').setValue(place.formatted_address);

    // Optional: autofill hotel name
    this.hotelForm.get('hotel_name').setValue(place.name);

    this.getTimezoneOffset(location.lat(), location.lng());
  });
}

  getAddress(latLng: google.maps.LatLng) {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.hotelForm.get('address').setValue(results[0].formatted_address);
        } else {
          console.error('No results found');
        }
      } else {
        console.error(`Geocoder failed due to: ${status}`);
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

  getHotelTypeList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelTypeList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.hotelTypeList = resp.data.filter(p => p.status == 1);
      }
    });
  }
  getCoreCountryList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'countryList';
    this.hotelCrsService.fetch(data).subscribe(
      resp => {
        this.coreCountryList = resp.data.countries;
         setTimeout(() => {
      this.getCityListAuto('India');
    });
      }
    )
  }
  getAutoCompleteLocations(event, control) {
    let inpValue = event.target.value;

    this.departureLocations.length = 0;
    if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp > 10)) {
      if (control == 'city') {
        this.isDepartureCityLoading = true;
      }

      const query = `${event.target.value}`;
      this.getCityList(event, control, query);
    }
  }
  getCityList(event, control, city_name) {
    let request = { 'query': city_name, }
    this.apiHandlerService.apiHandler('supplierCityList', 'POST', '', '', request)
      .pipe(
        tap(() => {
          this.isDepartureCityLoading = false;
        })
      )
      .subscribe((resp: any) => {
        if (resp.statusCode == 201) {
          if (control == 'city') {
            this.departureLocations = resp.data;
            console.log("departureLocations", this.departureLocations)
          }
          this.cdRef.detectChanges();
        }
      }, err => {
      });
    this.lastKeyupTstamp = event.timeStamp;
  }
  selectedLocation(control, location) {
    console.log("location", location)
    // this.locationSelected = true;
    this.city = location;
    if (control == 'city') {
      this.hotelForm.patchValue({
        city: `${location['city_name']}`,

      })
      this.departureLocations = [];
      this.toCityId = location['id'];
      this.city_name = location['city_name'];
    }
    return;
  }
  getStateList(event) {
    let country_id = event.target.value
    const data = [{ core_country_id: country_id, offset: 0, limit: 10 }]
    data['topic'] = 'stateList';
    this.hotelCrsService.fetch(data).subscribe(
      resp => {
        this.coreStateList = resp.data;
        console.log("coreStateList", this.coreStateList)
      }
    )
  }
 getCityListAuto(event): void {
  let state_id;

  if (typeof event === 'string') {
    state_id = event; // ✅ FIX for 'India'
  } else if (event.target.value) {
    state_id = event.target.value;
  } else {
    return;
  }

      const selectedCountry = (this.coreCountryList || []).find(country => country.name == state_id);
  const countryCode = selectedCountry ? selectedCountry.two_code : '';

  const data = [{
    offset: 0,
    limit: 10,
    country_name: state_id
  }];

  this.hotelForm.patchValue({
    country_code: countryCode
  });

  data['topic'] = 'commonCityList';

  this.hotelCrsService.fetch(data).subscribe(resp => {
    this.coreCityList = resp.data;
  });
}
  createHotelDetailForm(): void {
    this.hotelForm = this.fb.group({
      hotel_name: ['', Validators.required],
      star_rating: ['', [Validators.required]],
      hotel_hotel_type_id: ['', Validators.required],
      core_country_id: ['India', Validators.required],
      // core_state_id: ['', Validators.required],
      city_name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      meal_plans: [[], Validators.required],
      stay_amenities: [[], Validators.required],
      weekend_days: [[], Validators.required],
      room_view_ids: [[], Validators.required],
      local_timezone: ['UTC+05:30', Validators.required],
      check_in_time: ['', Validators.required],
      check_out_time: ['', Validators.required],
      hotel_policy: [`<ol>
        <li>Your booking confirmation number is required upon check-in.</li>
        <li>Valid passport or personal ID copy is required upon check-in.</li>
        <li>Early check-in and late check-out are based on hotel availability and might be extra charged according to the hotel policy.</li>
        <li>Early check-out will be charged the full booking amount.</li>
        <li>Pets are not allowed in this property.</li>
      </ol>`],
      country_code:['',],
      contract_expiry_date: [null],
      children_free_before: [''],
      paid_children_from_age: [''],
      paid_children_to_age: [''],
      meal_price: [''],
      channel: ['Extranet', Validators.required],
      user_type: ['B2C', Validators.required],
      currency: [{ value: 'INR', disabled: false }, Validators.required],
      status: [true],
      hotel_description: [''],
      hotel_hotel_amenities: [],
      phone_number: ['0'],
      xl_hotel_code: ['0'],
      gst_state: [''],
      gst_number: [''],
      location: [''],
      bank_name: [''],
      beneficiary_name: [''],
      beneficiary_account_number: [''],
      ifsc_code: [''],
      city_code: [''],
      // fax_number:[''],
      // postal_code:[''],
      email: ['',],
      // image: ['', Validators.required],
      accomodation_or_meal: [''],
    });
  }
onCityChange(event: any) {
  if (!this.coreCityList || !Array.isArray(this.coreCityList) || this.coreCityList.length === 0) {
    console.warn('City list not ready yet');
    return;
  }

  if (!event) return;

  const cityName = typeof event === 'string' ? event : event.target.value;

  if (!cityName) return;

  const selectedCity = this.coreCityList.find(
    city => city.cityName === cityName
  );

  if (!selectedCity) {
    console.warn('City not found in list:', cityName);
    this.selectedCityName = '';
    this.selectedCityCode = '';
    return;
  }

  this.selectedCityName = selectedCity.cityName;
  this.selectedCityCode = selectedCity.cityCode;
  this.toCityId = selectedCity.id;

  this.updateMapWithCityAndCountry(this.selectedCityName, 'CountryName');

  setTimeout(() => {
    this.initializeSearchBox();
  }, 500);
}
  updateMapWithCityAndCountry(city: string, country: string) {
    console.log("city", city)
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: `${city}, ${country}` }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        this.center = { lat: location.lat(), lng: location.lng() };
        this.map.setCenter(this.center);
        this.marker.setPosition(this.center);
        this.hotelForm.get("latitude").setValue(this.center.lat);
        this.hotelForm.get("longitude").setValue(this.center.lng);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  onSubmitHotelDetail() {
  console.log("Form Valid:", this.hotelForm.valid);
  console.log("Form Errors:", this.hotelForm.errors);
  console.log("Form Controls:", this.hotelForm.controls);
  
  // Log individual control errors
  Object.keys(this.hotelForm.controls).forEach(key => {
    const control = this.hotelForm.get(key);
    if (control && control.errors) {
      console.log(`${key} errors:`, control.errors);
    }  });
    this.submittedHotel = true;
    this.hotelForm.get('currency').enable();
    if (this.hotelForm.valid) {
      // const dt = new Date(this.hotelForm.value.contract_expiry_date);
      // this.hotelForm.value.contract_expiry_date = formatDate(dt, '');
this.hotelForm.value.hotel_hotel_amenities =
  this.hotelForm.value.stay_amenities.map(v => v.hotel_amenity_name).join(",") || '';
      this.hotelForm.value.meal_plans = this.hotelForm.value.meal_plans.map(v => v.meals).join(",");
       this.hotelForm.value.stay_amenities = this.hotelForm.value.stay_amenities.map(v => v.stay_amenities).join(",");
      this.hotelForm.value.room_view_ids = this.hotelForm.value.room_view_ids.map(v => v.views).join(",");
      this.hotelForm.value.weekend_days = this.hotelForm.value.weekend_days.map(v => v.item_text).join(",");
      this.hotelForm.value.city = this.toCityId;
      this.hotelForm.value.checkInTime = this.hotelForm.value.checkInTime;
      this.hotelForm.value.checkOutTime = this.hotelForm.value.checkOutTime;
      // this.hotelForm.value.contract_expiry_date = this.hotelForm.value.contract_expiry_date ? `${(moment(this.hotelForm.value.contract_expiry_date)).format('YYYY-MM-DD')}` : null,
      this.hotelForm.value.contract_expiry_date = this.hotelForm.value.contract_expiry_date ? moment(this.hotelForm.value.contract_expiry_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
      this.hotelForm.value.children_free_before = this.hotelForm.value.children_free_before || 0;
      this.hotelForm.value.paid_children_from_age = this.hotelForm.value.paid_children_from_age || 0;
      this.hotelForm.value.paid_children_to_age = this.hotelForm.value.paid_children_to_age || 0;
      this.hotelForm.value.user_type = this.hotelForm.get('user_type').value || '';
      let data = Object.assign({}, this.hotelForm.value);
      try {
        if (this.hotelOne && !this.utilityService.isEmpty(this.hotelOne)) {
          console.log("hotelOne", this.hotelOne)
          data['id'] = this.hotelOne['id'];
          if (this.selectedCityCode != '' && this.selectedCityName != '') {
            data['city_code'] = this.selectedCityCode;
            data['city_name'] = this.selectedCityName;
          }
          else {
            data['city_code'] = this.hotelOne.city_code || '';
            data['city_name'] = this.hotelOne.city_name || this.hotelForm.value.city_name || '';
          }
          data = [data];
          data['topic'] = 'updateHotel';
        }
        else {
          if (this.selectedCityCode != '' && this.selectedCityName != '') {
            data['city_name'] = this.selectedCityName;
            data['city_code'] = this.selectedCityCode;
          }
          else {
            data['city_code'] = this.hotelForm.value.city_code || '';
            data['city_name'] = this.hotelForm.value.city_name || '';
          }
          data = [data];
          data['topic'] = 'addHotel';
        }
      } catch (error) {
        log.debug(error)
      }
      this.hotelCrsService.update(data).subscribe(resp => {
        console.log("resp", resp)
        if (resp.statusCode == 201) {
          this.addedHotelDetail = resp['data'];
          console.log("addedHotelDetail", this.addedHotelDetail)
          // this.onSubmitHotelImage( this.addedHotelDetail);
          // this.hotelCrsService.addedHotelDetail.next(this.addedHotelDetail);
          console.log(" this.addedHotelDetail['id']", this.addedHotelDetail['id'])
          if (this.imagePath) {
            const formData = new FormData();
            formData.append('image', this.imagePath);
            formData.append('id', this.addedHotelDetail['id'])
            data = [{ data: formData }];
            data['topic'] = 'uploadHotelLogo';
            this.hotelCrsService.update(data).subscribe(res => {
              if (res.statusCode == 201) {
                log.debug("Image Uploaded Successfully... ", res)
              }
            })
          }
          this.hotelForm.reset();
          this.isHotelDetail = false;
          if (data['topic'] == 'addHotel') {
            this.swalService.alert.success("Hotel detail added successfully!")
          } else {
            this.swalService.alert.success("Hotel detail Updated successfully!")
          }
          this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
        } else if (resp.statusCode == 400) {
          this.swalService.alert.oops(resp.msg)
        }
        else {
          this.swalService.alert.oops(resp.msg);
        }
      },(error)=>{
 this.swalService.alert.oops(error.error.Message)
      })
    } else {
      return;
    }
  }

  preview(event) {
    this.updateImage = ""
    if (!event.target.files[0])
      return;
    var reader = new FileReader();
    this.imagePath = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
  getHotelAmenityList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelAmenityList';
    this.hotelCrsService.fetch(data).subscribe(
      resp => {
        this.hotelAmenityList = resp.data.filter(p => p.status == 1);
        if (this.hotelData) {
          this.patchHotel();
        }
        console.log(" this.hotelAmenityList", this.hotelAmenityList)
      }
    )
  }

  patchHotelAfterAmenitiesLoaded() {
    // If amenities are already loaded, patch the hotel form
    if (this.hotelAmenityList) {
      this.patchHotel();
    }
  }
  // backToHotel() {
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //   this.router.onSameUrlNavigation = 'reload';
  //   this.router.navigate(['/hotels/hotel-crs-lists']);
  // }
  backToHotel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
    });
}
  getMealList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'mealList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.mealList = resp.data.filter(p => p.status == 1);
        if (this.hotelData) {
          this.patchHotel();
        }
        console.log(" this.mealList", this.mealList)
      }
    });
  }
amenitiesList:any[] = []

    getStayAmenityList(): void {
     const data = [{ offset: 0, limit: 100 }]
        data['topic'] = 'hotelAmenityList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.amenitiesList = resp.data;
             
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        });
  }
  getViewList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'viewList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.viewList = resp.data.filter(p => p.status == 1);
      }
    });
  }
  getCurrencyList() {
    const data = [{}]
    data['topic'] = 'hotelCurrencyConverison';
    this.hotelCrsService.fetch(data).subscribe(resp => {
      if (resp.Status && resp.data) {
        this.currencyList = resp.data.filter(t => t.status == 1);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
    })
  }
  clearExpiryDate() {
    // Clear the form control value
    this.hotelForm.get('contract_expiry_date').setValue(null);
  }

  filterCurrencyList() {
    this.filteredCurrencyList = this.currencyList.filter(currency => currency.currency !== this.hotelData.currency);
  }
  // getTimezoneOffset(longitude: number): string {
  //   const offset = Math.round(longitude / 15); // Each timezone is 15 degrees
  //   const formattedOffset = offset >= 0 ? `UTC+${offset.toString().padStart(2, '0')}:00` : `UTC${offset.toString().padStart(3, '0')}:00`;
  //   return this.timezones.includes(formattedOffset) ? formattedOffset : 'UTC+00:00'; // Default to UTC+00:00 if not found
  // }

  getTimezoneOffset(lat: number, lng: number): void {
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const apiKey = 'AIzaSyDhkXfAF11o4mGvk5ft6nECxXknFe-Xj5c'; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const rawOffset = data.rawOffset / 3600; // Convert seconds to hours
          const dstOffset = data.dstOffset / 3600; // Convert seconds to hours
          const totalOffset = rawOffset + dstOffset; // Total UTC offset

          // Ensure proper formatting to match your array (UTC+05:30)
          let formattedOffset = totalOffset >= 0
            ? `UTC+${totalOffset.toFixed(2).padStart(5, '0')}`
            : `UTC${totalOffset.toFixed(2).padStart(6, '0')}`;

          // Ensure proper formatting (fix decimal cases)
          formattedOffset = formattedOffset.replace('.00', ':00').replace('.50', ':30');

          // Check if the formattedOffset exists in timezones array
          if (!this.timezones.includes(formattedOffset)) {
            formattedOffset = 'UTC+00:00'; // Default if not found
          }

          console.log("Final Timezone Selected:", formattedOffset);
          this.hotelForm.get('local_timezone').setValue(formattedOffset);
        } else {
          console.error('Error fetching timezone:', data.status);
          this.hotelForm.get('local_timezone').setValue('UTC+00:00'); // Default
        }
      })
      .catch(error => {
        console.error('Failed to fetch timezone:', error);
        this.hotelForm.get('local_timezone').setValue('UTC+00:00'); // Default
      });
  }

  showUserType(type): boolean {
    if(this.edit && this.hotelOne && this.hotelOne['id']) {
      if (type === 7) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  get hotel() { return this.hotelForm.controls; }

}
