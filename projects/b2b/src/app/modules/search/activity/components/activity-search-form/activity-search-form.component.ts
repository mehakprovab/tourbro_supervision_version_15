import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig, BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { ActivitiesService } from '../../activities.service';
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
  selector: 'app-activity-search-form',
  templateUrl: './activity-search-form.component.html',
  styleUrls: ['./activity-search-form.component.scss']
})
export class ActivitySearchFormComponent implements OnInit {

 
  @ViewChild('destination_name', { static: false }) destination_name: ElementRef<HTMLElement>;
  @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
  @ViewChild('departureDate', { static: false }) departureDate: ElementRef<HTMLElement>;
  @ViewChild('returnDate', { static: false }) returnDate: ElementRef<HTMLElement>;
  @ViewChild('rangePicker', { static: false }) rangePicker!: BsDaterangepickerDirective;

  minDate = new Date();
  isOpen = false as boolean;
  bsDateConf: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    displayMonths: 2,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-blue',
  };
  isResultScreen: boolean = false;
  isHomeScreen: boolean = false;
  isDetailsScreen: boolean = false;

  locations: LocationI[] = [];
  lastKeyupTstamp: number = 0;
  isLoading: boolean = false;
  submitted: boolean = false;
  regConfig: FormGroup;
  city: LocationI;
  booking_source: any;
  setMinDate: any;

  departureLocations = [];
  desitnationLocations = [];
  isDesitnationCityLoading: boolean = false;
  isDepartureCityLoading: boolean = false;
  fromCityId: any;
  toCityId: any;
  formFilled: boolean;
  browserRefresh: boolean;
  tmxactivityApi: boolean = false;
  @Output() callResult = new EventEmitter<any>();
  locationSelected: boolean = false;
  travellersFadeinn: any;
  travellerCountError = false;
  noOfAdults: any = 1;
  noOfChild: any = 0;
  dateRange: Date[] = [new Date(), new Date()];
  searchTitle: string;
  constructor(
    private cdr: ChangeDetectorRef,
    private apiHandlerService: ApiHandlerService,
    private activityService: ActivitiesService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public location: PlatformLocation,
   // private appGlobal: AppGlobal
  ) { }

  ngOnInit(): void {
    this.updateUI();
    this.updateModify();
    this.createForm();
    this.setModifySearch();
  
    this.location.onPopState(() => {
      this.setFormValues(false);
    });
    this.setAutoActivityData();
  }


  createForm(): void {
    this.regConfig = this.fb.group({
      departureCity: ['', [Validators.required]],
      departureDate:  new FormControl('', [Validators.required]), 
      returnDate:  new FormControl('', [Validators.required]),
      traveller: this.fb.array([this.createTravellerForm()]),
      destination_source: [''],
      destinationId:['']
    });
  }
  closeTravellers() {
    this.travellersFadeinn = false;
}
onSubmitTraveller() {
  this.travellersFadeinn = false;
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
      } else if (travellerType == 'childrens' && this.noOfChild >0 && control.value>0) {
          this.noOfChild -= 1;
          if(childAge.controls && childAge.controls.length>0){
            let length=childAge.controls.length-1
            childAge.removeAt(length);
        }
      }
  } else {
      result = control.value + 1;
  }
  let adultCount = 0, childCount = 0;
  if (travellerType == 'adults') {
      adultCount = adults;
      if (operation == 'plus' && adultCount <= 19) {
          this.noOfAdults += 1;
      }
  }
  if (travellerType == 'childrens') {
      childCount = childrens;
      if (operation == 'plus' && childCount <= 19) {
          this.noOfChild += 1;
          childAge.push(this.setChildAgeArray())
      }
  }
  
  if (operation === 'minus' && travellerType == 'adults' && result < 1) {
      return false;
  }
  if (adultCount > 19 && operation === 'plus') {
      this.travellerCountError = true;
      return false;
  }
  if (childCount > 19 && operation === 'plus') {
      this.travellerCountError = true;
      return false;
  }
  this.travellerCountError = false;
  control.setValue(result);
  this.regConfig.patchValue({
      traveller: [control]
  });
}
setChildAgeArray(){
  return this.fb.group({
      childAge: 1,
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

  getCityList(event, control, city_name) {
    let request = { 'Name': city_name }
    this.apiHandlerService.apiHandler('activityCityList', 'POST', '', '', request)
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

  clearLocationIfNotSelected() {
    if (!this.locationSelected) {
      this.regConfig.patchValue({ departureCity: '' });
    }
  }

  selectedLocation(control, location) {
    this.locationSelected = true;
    this.city = location;
    this.booking_source = `${location['BookingSource']}`;
    if (control == 'departureCity') {
      this.regConfig.patchValue({
        departureCity: `${location['destination_name']}`,
        destination_source: `${location['BookingSource']}`,
        destinationId: `${location['origin']}`
      })
      this.departureLocations = [];
      this.toCityId = location['iataCode'];
      this.desitnationLocations = [];
    }
    return;
  }

  setValidator(control) {
    this.regConfig.get(control).setValidators(Validators.required);
    this.regConfig.get(control).updateValueAndValidity();
  }

  onCheckIn(event) {
    if (event) {
      setTimeout(() => {
        this.returnDate.nativeElement.focus();
        this.returnDate.nativeElement.click();
        this.setMinDate = event;
      }, 10)
    }
  }

  onCheckOut(event) {
    if (event) {
      setTimeout(() => {
      }, 100)
    }
  }

  updateUI() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('activities-index') || currentUrl.includes('activity-results') ||  currentUrl.includes('activity-details')) {
      this.isHomeScreen = true;
      this.searchTitle = 'New Search'
    } else {
      this.isHomeScreen = false;
      this.searchTitle = 'Search'
    }
  }

  updateModify() {
    //const api = this.appGlobal.ActivityApi;
    // if (api == 'TMX') {
    //   this.tmxactivityApi = true;
    // }
    const currentUrl = this.router.url;
    if (currentUrl.includes('activity-results') || currentUrl.includes('activity-details')) {
      this.isResultScreen = true;
    } else {
      this.isResultScreen = false;
    }

  }

  setFormValues(value) {
    let RoomGuests = [];
      this.regConfig.controls.traveller.value.forEach(element => {
        console.log("element",element)
          RoomGuests.push({
              "adultCount": Number(element['adults']),
              "childCount": Number(element['childrens']),
              "ChildAge": element['childAges']
          })
      });
    const formData = {
      destination: this.toCityId,
      from: this.regConfig.value.departureDate,
      to: this.regConfig.value.returnDate,
      booking_source:this.regConfig.value.destination_source,
      destinationId: this.regConfig.value.destinationId,
      paxes: RoomGuests,
      // currency:"GBP",
      // userId: 0,
      // userType: "B2C"
    };
    sessionStorage.setItem('activityFormData', JSON.stringify(this.regConfig.value));
    sessionStorage.setItem('activitySearchData', JSON.stringify(formData));
    this.activityService.formFilled.next(JSON.parse(sessionStorage.getItem('activityFormData')));
    this.activityService.activityCopy.next([]);
    this.activityService.activity.next([]);
    if (value) {
      return formData;
    }
  }
  getAge(empIndex:number) : FormArray {
    return this.travellers('traveller').at(empIndex).get("childAges") as FormArray
}
onChange(value, index, ageIndex) {
    const childAges =this.getAge(index);
    childAges.controls[ageIndex].patchValue({ childAge: value });
}
  onSubmit() {
    this.submitted = true;
    if (!this.regConfig.valid) {
      return;
    }
    const formData = this.setFormValues(true);
    this.submitForm(formData);
    this.activityService.formFilled.next(this.regConfig.value);
    if (this.router.url == 'search/activity/activity-results') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl("search/activity/activity-results");
    }
    else {
      this.router.navigateByUrl("search/activity/activity-results");
    }
  }

  submitForm(data: any) {
    this.activityService.activityCopy.next([]);
    this.activityService.activity.next([]);
    this.callResult.emit(data);
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
setModifySearch() {
  this.activityService.formFilled.subscribe(data => {
    if (data && data.hasOwnProperty('departureCity')) {
    if (!this.formFilled) { 
        this.setChildUI(data);
      }
      this.formFilled = true;
    } else {
      this.formFilled = false;
    }
  });

  this.browserRefresh = browserRefresh;

  if (this.formFilled) {
    let activityFormData = sessionStorage.getItem('activityFormData');
    activityFormData = JSON.parse(activityFormData);
    console.log("activityFormData", activityFormData);

    let searchData = sessionStorage.getItem('activitySearchData');
    searchData = JSON.parse(searchData);
    this.toCityId = searchData['destination'];

    if (activityFormData) {
      this.regConfig.patchValue({
        departureCity: activityFormData['departureCity'],
        departureDate: new Date(activityFormData['departureDate']),
        returnDate: new Date(activityFormData['returnDate']),
        destination_source: activityFormData['destination_source'],
        traveller: activityFormData['traveller'],
        destinationId: activityFormData['destinationId']
      });
    }
    this.setdateRange();

    this.setAdultChildCount(this.regConfig.value['traveller']);
  }
}

  setAdultChildCount(traveller){
    if(traveller){
    this.noOfAdults=0;
    this.noOfChild=0
        traveller.forEach(element => {
            this.noOfAdults += element.adults;
            this.noOfChild += element.childrens;
        });
    }
}
  hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
  }

  openDateRangePicker(): void {
    this.rangePicker.show();
  }
  
  onRangeChange(value: Date[]): void {
    this.dateRange = value;
  
    this.regConfig.patchValue({
      departureDate:this.dateRange[0],
      returnDate: this.dateRange[1]
  });
  
  }

  setAutoActivityData() {
    const autoSearchData = JSON.parse(sessionStorage.getItem('autoSearchData'));
    console.log("autoSearchData", autoSearchData);

    if (autoSearchData && autoSearchData.activityInfo && autoSearchData.activityInfo[0]) {
        const today = new Date();
        const check_in = new Date(autoSearchData['date']);
        const check_out = new Date(check_in);
        check_out.setDate(check_in.getDate() + 1);

        const validCheckIn = check_in >= today ? check_in : today;
        const validCheckOut = check_out > validCheckIn ? check_out : new Date(validCheckIn.setDate(validCheckIn.getDate() + 1));

        //this.booking_source = "TLAPINO00004"; // Static booking source
        this.booking_source = autoSearchData.activityInfo[0]['BookingSource'];
        this.toCityId = autoSearchData.activityInfo[0]['iataCode'];
        console.log(autoSearchData.activityInfo[0]['BookingSource']);
        const city = {
            cityId: autoSearchData.activityInfo[0]['origin'],
            cityName: autoSearchData.activityInfo[0]['destination_name'],
            countryCode: autoSearchData.activityInfo[0]['iataCode'],
            status: true,
            source: "",
            checkin: validCheckIn,
        };

        this.city = city;

        // Patch values into the form
        this.regConfig.patchValue({   
          departureCity: autoSearchData.activityInfo[0]['destination_name'],
          departureDate: validCheckIn,
          returnDate: validCheckOut,
          toCityId: autoSearchData.activityInfo[0]['iataCode'],
          //DepartDate: validCheckIn,
          booking_source:autoSearchData.activityInfo[0]['booking_source'],
          //traveller: this.fb.array([this.createTravellerForm()]),
          //paxes: RoomGuestsAuto,
          //userId: 0,
        });

        this.setdateRange();
    } else {
        console.warn("AutoSearchData is missing or incomplete.");
    }
}
  
  setdateRange(){
    const checkinValue = this.regConfig.get('departureDate').value;
    const checkoutValue = this.regConfig.get('returnDate').value;
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

}