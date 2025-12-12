import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { TourService } from '../../tour.service';
import { PlatformLocation } from '@angular/common';
export let browserRefresh = false;

export interface LocationI {
  cityId: string;
  cityName: string;
  countryCode: string;
  status: boolean;
  source: string;
}
@Component({
  selector: 'app-tour-search-form',
  templateUrl: './tour-search-form.component.html',
  styleUrls: ['./tour-search-form.component.scss']
})
export class TourSearchFormComponent implements OnInit {

  minDate = new Date();
  isOpen = false as boolean;
  bsDateConf: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-blue',
  };
  setMinDate: any;
  regConfig: FormGroup;
  departureLocations = [];
  desitnationLocations = [];
  isDesitnationCityLoading: boolean = false;
  isDepartureCityLoading: boolean = false;
  lastKeyupTstamp: number = 0;
  submitted: boolean = false;
  city: any;
  fromCityId: any;
  toCityId: any;
  @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
  @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
  @ViewChild('checkinDate', { static: false }) checkinDate: ElementRef<HTMLElement>;
  @Output() callResult = new EventEmitter<any>();
  public browserRefresh: boolean;
  formFilled:boolean;
  searchTitle: string;
  isResultScreen: boolean;
  currentUser: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private tourService: TourService,
    public location: PlatformLocation) {
  }

    ngOnInit(): void {
      this.location.onPopState(() => {
        this.setFormValues(false);
      });
        this.createForm();
        this.updateUI();
        this.setModifySearch();
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    }

  onCheckIn(event) {
    if (event) {
      setTimeout(() => {
        this.setMinDate = event;
      }, 10)
    }
  }

  updateUI() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('tour-result')) {
        this.isResultScreen = true;
        this.searchTitle = 'New Search';
    } else {
        this.isResultScreen = false;
        this.searchTitle = 'Search';
    }
}

  setFormValues(value) {
    const formData = {
      FromCityId: this.fromCityId,
      ToCityId: this.toCityId,
      CityName: this.regConfig.value.departureCity,
      JourneyDate: this.regConfig.value.departureDate,
      Destination_source:this.regConfig.value.destination_source
    };
    sessionStorage.setItem('tourFormData', JSON.stringify(this.regConfig.value));
    sessionStorage.setItem('tourSearchData', JSON.stringify(formData));
    this.tourService.formFilled.next(JSON.parse(sessionStorage.getItem('tourFormData')));
    this.tourService.tourCopy.next([]);
    this.tourService.tour.next([]);
    if (value) {
      return formData;
    }
  }

  createForm(): void {
    this.regConfig = this.fb.group({
      departureCity: ['', [Validators.required]],
      destination_source: ['']
    });
  }

  getAutoCompleteLocations(event, control) {
    let inpValue = event.target.value;
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

  setValidator(control){
    this.regConfig.get(control).setValidators(Validators.required);
    this.regConfig.get(control).updateValueAndValidity();
}


getCityList(event, control, city_name) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  let request = { 'Name': city_name,
      "userType": "B2B",
      "userId": currentUser.id
    }
  this.apiHandlerService.apiHandler('tourAutocompleteCity', 'POST', '', '', request)
    .pipe(
      tap(() => {
        this.isDepartureCityLoading = false;
        this.isDesitnationCityLoading = false;
      })
    )
    .subscribe((resp: any) => {
      if (resp.statusCode == 200) {
        if (control == 'departureCity') {
          this.departureLocations = resp.data;
        }
        else {
          this.desitnationLocations = resp.data
        }
        this.cdr.detectChanges();
      }
    }, err => {
    });
  this.lastKeyupTstamp = event.timeStamp;
}

  hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
  }

  selectedLocation(control, location) {
  //  this.locationSelected = true;
    this.city = location;
    if (control == 'departureCity') {
      this.regConfig.patchValue({
        departureCity: location['name'] ? `${location['CityName']}, ${location['name']}`: `${location['CityName']}`,
        destination_source: `${location['booking_source']}`
      })
      this.fromCityId = location['CityId'];
      this.departureLocations = [];
    }
    else {
      this.regConfig.patchValue({
        destinationCity: location['name'] ? `${location['CityName']}, ${location['name']}`: `${location['CityName']}`,
        destination_source: `${location['booking_source']}`
      })
      this.toCityId = location['destination_id'];
      this.desitnationLocations = [];
    }
    return;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.regConfig.valid) {
      return;
    }
    const formData = this.setFormValues(true);
    this.submitForm(formData);
    this.tourService.tour.next([]);
    this.tourService.tourCopy.next([]);
    this.cdr.detectChanges();
    this.tourService.formFilled.next(this.regConfig.value);
    if (this.router.url == '/search/tour/tour-results') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl("/search/tour/tour-results");
    }
    else {
      this.router.navigateByUrl("/search/tour/tour-results");
    }
  }


  submitForm(data: any) {
    this.tourService.tourCopy.next([]);
    this.tourService.tour.next([]);
    this.callResult.emit(data);
  }

  setModifySearch() {
    this.tourService.formFilled.subscribe(data => {
      if (data && data.hasOwnProperty('departureCity')) {
        this.formFilled = true;
      }
      else {
        this.formFilled = false;
      }
    });
    this.browserRefresh = browserRefresh;
    if (this.formFilled) {
      let tourFormData = sessionStorage.getItem('tourFormData');
      tourFormData = JSON.parse(tourFormData);
      let searchData = sessionStorage.getItem('tourSearchData');
      searchData = JSON.parse(searchData);
      this.fromCityId = searchData['FromCityId'];
      this.toCityId = searchData['ToCityId'];
      if (tourFormData) {
        this.regConfig = this.fb.group({
          departureCity: tourFormData['departureCity'],
          destinationCity: tourFormData['destinationCity'],
          departureDate: new Date(tourFormData['departureDate']),
          destination_source:tourFormData['destination_source']
        })
      }
    }
  }
}