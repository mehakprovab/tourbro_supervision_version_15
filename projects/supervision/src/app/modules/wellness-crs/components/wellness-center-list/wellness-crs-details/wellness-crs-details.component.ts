import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-wellness-crs-details',
  templateUrl: './wellness-crs-details.component.html',
  styleUrls: ['./wellness-crs-details.component.scss']
})
export class WellnessCrsDetailsComponent implements OnInit, AfterViewInit {

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { }

  public therapyList: any = [];
  public packageTypeList: any = [];
  public mealPlanList: any = []
  public facilitiesList: any = [];
  public treatmentList: any = [];
  public healthGoalsList: any = [];

  public wellnessForm!: FormGroup;

  dropdownSettingsForTherapy={};
  dropdownSettingsForHealthGoals={};
  dropdownSettingsForTreatments={};
  dropdownSettingsForFacilities={};
  dropdownSettingsForMealPlans={};

  //Map

  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
    map: google.maps.Map;
    geocoder: google.maps.Geocoder;
    mapOptions: google.maps.MapOptions;
    marker: google.maps.Marker;
    center!: google.maps.LatLngLiteral;
    searchBox!: google.maps.places.SearchBox;

    currencyList: any;
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
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  coreCountryList: any;
  selectedCityName: string = '';
  selectedCityCode: string = '';
  coreCityList: any;
  toCityId: any;
  public loggedUserData: any;
  @Input() hotelOne: any;
  submittedWellness: boolean = false;
  editWellnessData: any;
  isEdit = false;
  editCityListLoaded = false;

  ngOnInit() {
    this.createFrom();
    this.onPageLoad();
    const userData = sessionStorage.getItem('currentSupervisionUser');
    this.loggedUserData = userData ? JSON.parse(userData) : null;
    this.wellnessCrsService.getEditData.subscribe((data) => {
      console.log(data);
      if (data && (data.center_code || data.id)) {
        this.editWellnessData = data;
        this.isEdit = true;
        this.editCityListLoaded = false;
        this.patchEditData();
      }
    })
  }

  createFrom() {
      this.wellnessForm = this.fb.group({
        therapy_types: ['', [Validators.required]],
        health_goals: ['', [Validators.required]],
        treatments: ['', [Validators.required]],
        facilities: ['', [Validators.required]],
        meal_plans: ['', [Validators.required]],
        status: [true],
        center_name: ['', [Validators.required]],
        supplier_name: [''],
        supplier_email: [''],
        country_code: ['', [Validators.required]],
        city_code: ['', [Validators.required]],
        country: ['', [Validators.required]],
        state: [''],
        city: ['', [Validators.required]],
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        currency: ['INR', [Validators.required]],
        local_timezone: ['UTC+05:30', [Validators.required]],
        stay_options:['', [Validators.required]],
        ideal_duration: ['', [Validators.required]],
        inclusions: ['', [Validators.required]],
        booking_method: ['', [Validators.required]],
        contract_expiry: [''],
        check_in_time: ['', [Validators.required]],
        check_out_time: ['', [Validators.required]],
        center_policy: [`<ol>
        <li>Your booking confirmation number is required upon check-in.</li>
        <li>Valid passport or personal ID copy is required upon check-in.</li>
        <li>Early check-in and late check-out are based on hotel availability and might be extra charged according to the hotel policy.</li>
        <li>Early check-out will be charged the full booking amount.</li>
        <li>Pets are not allowed in this property.</li>
      </ol>`, [Validators.required]],
        user_type: ['B2C'],
      });
  }

  onSubmit() {
    this.submittedWellness = true;

if(this.wellnessForm.invalid) {
  this.swalService.alert.oops('Please fill all required fields.')
  return;
}
    
    const formData = {
  ...this.wellnessForm.value,
...(this.isEdit && this.editWellnessData.id && { id: this.editWellnessData.id }),
...(this.isEdit && this.editWellnessData.center_code && { center_code: this.editWellnessData.center_code }),
contract_expiry: this.wellnessForm.value.contract_expiry || null,
check_in_time: this.formatTimeWithSeconds(this.wellnessForm.value.check_in_time),
check_out_time: this.formatTimeWithSeconds(this.wellnessForm.value.check_out_time),

inclusions: [this.wellnessForm.value.inclusions],
supplier_email: this.loggedUserData ? this.loggedUserData.email : this.wellnessForm.value.supplier_email,
supplier_name: this.loggedUserData ? this.loggedUserData.first_name +' '+ this.loggedUserData.last_name : this.wellnessForm.value.supplier_name,
  therapy_types: this.wellnessForm.value.therapy_types.map(
    item => item.therapy_name
  ),

  health_goals: this.wellnessForm.value.health_goals.map(
    item => item.name
  ),

  treatments: this.wellnessForm.value.treatments.map(
    item => item.treatment_name
  ),

  facilities: this.wellnessForm.value.facilities.map(
    item => item.name
  ),

  meal_plans: this.wellnessForm.value.meal_plans
    .map(item => item.meals)
    .join(',')
};
console.log('Form Data to Submit:', formData);
// const data = [{ id: id }];
//         data["topic"] = "addWellnessCenter";
//   }

  let data = Object.assign({}, formData);
      data = [data];
      data['topic'] = this.isEdit ? "updateWellnessCenter" : "addWellnessCenter";
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            console.log('Wellness Center created successfully:', resp);
            this.swalService.alert.success(this.isEdit ? 'Wellness Center updated successfully.' : 'Wellness Center created successfully.');
            this.submittedWellness = false;
            this.isEdit = false;
            this.editWellnessData = null;
            this.wellnessCrsService.getEditData.next('');
            this.router.navigate([], {
      queryParams: {
        tab: 'list_wellness'
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
          }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
}

  normalizeToArray(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (data === null || data === undefined || data === '') {
      return [];
    }

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);

        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (error) {
        // Fallback to comma-separated values below.
      }

      return data.split(',').map(item => item.trim()).filter(item => item);
    }

    return [data];
  }

  selectDropdownItems(sourceList: any[], selectedValues: any[], key: string): any[] {
    return (sourceList || []).filter(item => selectedValues.includes(item[key]));
  }

  normalizeDate(date: any): any {
    if (!date) {
      return '';
    }

    return String(date).split('T')[0];
  }

  normalizeTime(time: any): any {
    if (!time) {
      return '';
    }

    const timeValue = String(time).trim();
    return timeValue.replace(/^(\d{1,2}:\d{2}):\d{2}(\s*(AM|PM))$/i, '$1$2');
  }

  patchEditData(): void {
    if (!this.editWellnessData || !this.wellnessForm) {
      return;
    }

    const data = this.editWellnessData;
    const therapyTypes = this.normalizeToArray(data.therapy_types);
    const healthGoals = this.normalizeToArray(data.health_goals);
    const treatments = this.normalizeToArray(data.treatments);
    const facilities = this.normalizeToArray(data.facilities);
    const mealPlans = this.normalizeToArray(data.meal_plans);

    this.wellnessForm.patchValue({
      therapy_types: this.selectDropdownItems(this.therapyList, therapyTypes, 'therapy_name'),
      health_goals: this.selectDropdownItems(this.healthGoalsList, healthGoals, 'name'),
      treatments: this.selectDropdownItems(this.treatmentList, treatments, 'treatment_name'),
      facilities: this.selectDropdownItems(this.facilitiesList, facilities, 'name'),
      meal_plans: this.selectDropdownItems(this.mealPlanList, mealPlans, 'meals'),
      status: data.status === 1 || data.status === true,
      center_name: data.center_name || '',
      supplier_name: data.supplier_name || '',
      supplier_email: data.supplier_email || '',
      country_code: data.country_code || '',
      city_code: data.city_code || '',
      country: data.country || data.core_country_id || '',
      state: data.state || '',
      city: data.city || data.city_name || '',
      address: data.address || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      currency: data.currency || 'INR',
      local_timezone: data.local_timezone || 'UTC+05:30',
      stay_options: data.stay_options || '',
      ideal_duration: data.ideal_duration || '',
      inclusions: Array.isArray(data.inclusions) ? data.inclusions.join(', ') : (data.inclusions || ''),
      booking_method: data.booking_method || '',
      contract_expiry: this.normalizeDate(data.contract_expiry || data.contract_expiry_date),
      check_in_time: this.normalizeTime(data.check_in_time),
      check_out_time: this.normalizeTime(data.check_out_time),
      center_policy: data.center_policy || this.wellnessForm.value.center_policy,
      user_type: data.user_type || 'B2C',
    });

    if (!this.editCityListLoaded && this.coreCountryList && this.coreCountryList.length && (data.country || data.core_country_id)) {
      this.editCityListLoaded = true;
      this.getCityListAuto(data.country || data.core_country_id);
    }

    if (data.latitude && data.longitude) {
      this.center = {
        lat: Number(data.latitude),
        lng: Number(data.longitude)
      };

      if (this.map && this.marker) {
        this.map.setCenter(this.center);
        this.marker.setPosition(this.center);
      }
    }
  }

  formatTimeWithSeconds(time: string): string {
    if (!time) {
      return time;
    }

    const trimmedTime = time.trim();
    const meridiemMatch = trimmedTime.match(/\s+(AM|PM)$/i);
    const meridiem = meridiemMatch ? meridiemMatch[0] : '';
    const timeValue = meridiem ? trimmedTime.replace(/\s+(AM|PM)$/i, '') : trimmedTime;

    if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeValue)) {
      return `${timeValue}${meridiem}`;
    }

    if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
      return `${timeValue}:00${meridiem}`;
    }

    return trimmedTime;
  }

  onPageLoad() {
    this.getPackageTypeList();
    this.getAllTherapyList();
    this.getMealPlanList();
    this.getFacilitiesList();
    this.getTreatmentList();
    this.getHealthGoalsList();
    this.getCurrencyList();
    this.getCoreCountryList();
     this.dropdownSettingsForTherapy = {
      singleSelection: false,
      idField: 'id',
      textField: 'therapy_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForHealthGoals = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForTreatments = {
      singleSelection: false,
      idField: 'id',
      textField: 'treatment_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForFacilities = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForMealPlans = {
      singleSelection: false,
      idField: 'id',
      textField: 'meals',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
  }

  getCoreCountryList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'countryList';
    this.wellnessCrsService.fetch(data).subscribe(
      resp => {
        this.coreCountryList = resp.data.countries;
        this.patchEditData();
         setTimeout(() => {
      // this.getCityListAuto('India');
    });
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

  const selectedCountry = this.coreCountryList.find(country => country.name == state_id);
  const countryCode = selectedCountry ? selectedCountry.two_code : '';

  const data = [{
    offset: 0,
    limit: 10,
    country_name: state_id
  }];

  this.wellnessForm.patchValue({
    country_code: countryCode
  });

  data['topic'] = 'commonCityList';

  this.wellnessCrsService.fetch(data).subscribe(resp => {
    this.coreCityList = resp.data;
    this.patchEditData();
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
  this.wellnessForm.patchValue({
    city_code: this.toCityId
  });

  this.updateMapWithCityAndCountry(this.selectedCityName, 'CountryName');

  setTimeout(() => {
    this.initializeSearchBox();
  }, 500);
}

  getCurrencyList() {
    const data = [{}]
    data['topic'] = 'hotelCurrencyConverison';
    this.wellnessCrsService.fetch(data).subscribe(resp => {
      if (resp.Status && resp.data) {
        this.currencyList = resp.data.filter(t => t.status == 1);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
    })
  }

  getPackageTypeList() {
    const data = {
          topic: "packageTypeList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.packageTypeList = resp.data || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.packageTypeList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  getAllTherapyList() {
    const data = {
          topic: "therapyTypeList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.therapyList = resp.data.filter((item: any) => item.therapy_name) || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.therapyList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  getMealPlanList() {
    const data = {
          topic: "mealPlanList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.mealPlanList = resp.data || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.mealPlanList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  getFacilitiesList() {
    const data = {
          topic: "facilitiesList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.facilitiesList = resp.data || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.facilitiesList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  getTreatmentList() {
    const data = {
          topic: "treatmentList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.treatmentList = resp.data || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.treatmentList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  getHealthGoalsList() {
    const data = {
          topic: "healthGoalConditionList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.healthGoalsList = resp.data || [];
            this.patchEditData();
          } else if (resp.statusCode === 404) {
            this.healthGoalsList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }

  ngAfterViewInit() {
  this.getGeoCoords();
}

getGeoCoords() {
    // if (this.hotelData && this.hotelData.latitude && this.hotelData.longitude) {
    //   this.center = {
    //     lat: parseFloat(this.hotelData.latitude),
    //     lng: parseFloat(this.hotelData.longitude)
    //   };
    //   this.mapInitializer();
    // } else {
      navigator.geolocation.getCurrentPosition(pos => {
        this.center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.mapInitializer();
      }, err => {
        console.error(`Browser does not support GeoLocation`, err);
      });
    // }
    this.cdRef.detectChanges();
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
        this.wellnessForm.get('latitude').setValue(event.latLng.lat());
        this.wellnessForm.get('longitude').setValue(event.latLng.lng());

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
    this.wellnessForm.get('latitude').setValue(location.lat());
    this.wellnessForm.get('longitude').setValue(location.lng());
    this.wellnessForm.get('address').setValue(place.formatted_address);

    // // Optional: autofill hotel name
    // this.hotelForm.get('hotel_name').setValue(place.name);

    this.getTimezoneOffset(location.lat(), location.lng());
  });
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
        this.wellnessForm.get("latitude").setValue(this.center.lat);
        this.wellnessForm.get("longitude").setValue(this.center.lng);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  getAddress(latLng: google.maps.LatLng) {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.wellnessForm.get('address').setValue(results[0].formatted_address);
        } else {
          console.error('No results found');
        }
      } else {
        console.error(`Geocoder failed due to: ${status}`);
      }
    });
  }


  
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
          this.wellnessForm.get('local_timezone').setValue(formattedOffset);
        } else {
          console.error('Error fetching timezone:', data.status);
          this.wellnessForm.get('local_timezone').setValue('UTC+05:30'); // Default
        }
      })
      .catch(error => {
        console.error('Failed to fetch timezone:', error);
        this.wellnessForm.get('local_timezone').setValue('UTC+05:30'); // Default
      });
  }


}
