import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwalService } from '../../../core/services/swal.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../../../core/services/utility.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { untilDestroyed } from '../../../core/services';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
export interface LocationI {
  cityId: string;
  cityName: string;
  countryCode: string;
  status: boolean;
  source: string;
}
@Component({
  selector: 'app-supplier-b2c',
  templateUrl: './supplier-b2c.component.html',
  styleUrls: ['./supplier-b2c.component.scss']
})
export class SupplierB2cComponent implements OnInit {
  // @ViewChild('multiSelect') multiSelect;
  @Output() b2cUserUpdate = new EventEmitter<any>();
  @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
  mapOptions: google.maps.MapOptions;
  marker: google.maps.Marker;
  center!: google.maps.LatLngLiteral;
  searchBox!: google.maps.places.SearchBox;
 @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  private subSunk = new SubSink();
  subagentId;
  userTitleList: Array<any> = [];
  userTypeList: Array<any> = [];
  phoneCodeList: Array<any> = [];
  regConfig: FormGroup;
  otpForm: FormGroup;
  mealPrice:any;
 
  isOpen = false as boolean;
  setMinDate: any;
  addOrUpdate: string = '';
  bsDateConf = {
      isAnimated: true,
      dateInputFormat: 'YYYY-MM-DD',
      rangeInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-blue',
      showWeekNumbers: false
  };
  loading:boolean = false;
  isDepartureCityLoading: boolean = false;
  departureLocations = [];
  maxDate = new Date();
  countryCode: string = '';
  dropdownSettingsForHotel = {};
  dropdownSettingsForview ={}
  dropdownSettingsForWeek ={};
   city: LocationI;
  hotelTypeList: any;
  viewList:any;
  mealList:any;
  weekendDaysList:any;
  currencyList: Array<{}> = [];
  showOtpInput: boolean = false;
  propertyForm:boolean = false;
lastKeyupTstamp: number = 0;
errorMessage = '';
CityCode:any;
locations: LocationI[] = [];
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


selectedMealCheckboxes: Array<any> = [];
selectedWeekCheckboxes:Array<any> = [];
selectedViewCheckboxes:Array<any> = [];
coreCountryList: any;
// coreCityList:any;
selectedCityName: string = '';
toCityId: any;
submittedHotel: boolean = false;
submittedSupplier: boolean = false;
isChildrenAllow: boolean = false;
isChilderns: boolean = false;
emailVerified: boolean = false;
otpResendEnabled = false;
otpResendTimer: Subscription;
otpResendCounter = 40;
coreCityList: any;
userCityList: any;
selectedCityCode: string =  '';
public validationOtp: boolean = false;
registerStates: any[] = [];
registerCities : any[] = [];
filteredCities: any[] = [];
userFilteredCities: any[] = [];
loadingSpinner: boolean = false;
secondaryColour: any;
primaryColour: any;
loadingTemplate: any;
selectedSuppliers: any;

  constructor(
      private router: Router,
      private SupplierService: AuthService,
      private swalService: SwalService,
      private fb: FormBuilder,
      private utility: UtilityService,
      private apiHandlerService: ApiHandlerService,
      private cdRef:ChangeDetectorRef,
      private alertService: AlertService,
     // private appService: AppService
  ) {
     // this.countryCode = this.appService.countryCode;
     this.dropdownSettingsForWeek = {
      singleSelection: false,
      idField: 'id',
      textField: 'day',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
     this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'meals',
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



  }

  ngOnInit() {
      this.createForm();
      //  this.getPhoneCodeList();
      this.getCoreCountryList();
      this.getTitleList();
      this.getMealList();
      this.getViewList();
      this.getWeekList();
      // this.getCityList();
      this.getHotelTypeList();
      this.getCurrencyList();
      this.listCities();
      this.SupplierService.selectedSuppliers.subscribe((res) => {
        console.log(res);
        if (res.length > 0) {
          this.selectedSuppliers = res;
        } else {
          const selectedSuppliers = localStorage.getItem('selectedSuppliers');
          this.selectedSuppliers = JSON.parse(selectedSuppliers);
        }
      })

    //  this.mapInitializer();
    //  this. weekendDaysList;
   

  }
  ngOnChanges(){
 
    // this.getMealList();
    // this.getViewList();
  }
  getTitleList() {
    this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {}, {}).subscribe(res => {
    //   this.apiHandlerService.userTitleList.next(res.data);
      if (res.data.length) {
        const data = res.data;
        this.userTitleList = data.filter((item: any) => item.pax_type === 'ADULT');
        this.cdRef.detectChanges();
      }
    });
  }


  getHotelTypeList(): void {
    const data = [{}]
    data['topic'] = 'hotelType';
    this.SupplierService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 201) {
            this.hotelTypeList = resp.data.filter(p => p.status == 1);
        }
    });
}




getMealList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'mealList';
    this.SupplierService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 201) {
            this.mealList = resp.data.filter(p => p.status == 1);
            console.log(" this.mealList", this.mealList)
        }
     this.cdRef.detectChanges();
    });
}
getWeekList(): void {
  const data = [{ offset: 0, limit: 10 }]
  data['topic'] = 'weekList';
  this.SupplierService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 201) {
          this.weekendDaysList = resp.data;
          console.log("this.weekendDaysList",this.weekendDaysList)
      }
   this.cdRef.detectChanges();
  });
}
getViewList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'viewList';
    this.SupplierService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 201) {
            this.viewList = resp.data.filter(p => p.status == 1);
        }
        this.cdRef.detectChanges();
    });
}

onMealCheckBoxChange(checked:Boolean,inclusion:Number) {
    if (checked) {
      this.selectedMealCheckboxes.push(inclusion);
    } else {
      const index = this.selectedMealCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedMealCheckboxes.splice(index, 1);
      }
   }
  }
  onWeekCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedWeekCheckboxes.push(inclusion);
    } else {
      const index = this.selectedWeekCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedWeekCheckboxes.splice(index, 1);
      }
   }
  }
  onViewCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedViewCheckboxes.push(inclusion);
    } else {
      const index = this.selectedViewCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedViewCheckboxes.splice(index, 1);
      }
   }
  }
//   getCheckInTimeAsISOString() {
//     const propertyGroup = this.regConfig.get('properties') as FormGroup;
//     const checkInTime = propertyGroup.get('checkInTime').value;

//     if (!checkInTime) return null; // Handle cases where checkInTime might be empty

//     // Assume checkInTime is in the format 'hh:mm AM/PM'
//     const [time, modifier] = checkInTime.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (modifier === 'PM' && hours < 12) {
//         hours += 12;
//     } else if (modifier === 'AM' && hours === 12) {
//         hours = 0;
//     }

//     // Create a Date object with today's date and the parsed time
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);

//     // Convert to ISO string, include the date part and time part
//     const isoString = date.toISOString(); // Full ISO string: 'YYYY-MM-DDTHH:mm:ss.sssZ'

//     return isoString;
// }

// getCheckOutTimeAsISOString() {
//     const propertyGroup = this.regConfig.get('properties') as FormGroup;
//     const checkOutTime = propertyGroup.get('checkOutTime').value;

//     if (!checkOutTime) return null; // Handle cases where checkOutTime might be empty

//     // Assume checkOutTime is in the format 'hh:mm AM/PM'
//     const [time, modifier] = checkOutTime.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (modifier === 'PM' && hours < 12) {
//         hours += 12;
//     } else if (modifier === 'AM' && hours === 12) {
//         hours = 0;
//     }

//     // Create a Date object with today's date and the parsed time
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);

//     // Convert to ISO string, include the date part and time part
//     const isoString = date.toISOString(); // Full ISO string: 'YYYY-MM-DDTHH:mm:ss.sssZ'

//     return isoString;
// }
VerifyOtp(eamil:any){
  this.submittedSupplier = true;
  const supplierGroup = this.regConfig.get('supplier');

  // Mark all controls in the `supplier` form group as touched
  supplierGroup.markAllAsTouched();

  // Check if the `supplier` form group is valid before proceeding
  if (supplierGroup.valid) {
  
  this.loading =true;
  const payload = {
    email: eamil,
  };
  this.SupplierService.generateOTP(payload).subscribe(
    res => {
      if (res.statusCode === 201) {
        this.loading =false;
        this.showOtpInput = true;
        this.propertyForm = false;
        this.emailVerified = true;
        this.errorMessage ="";
        this.startOtpResendTimer();
          this.getGeoCoords()

        this.cdRef.detectChanges();
        console.log("showOtpInput",this.showOtpInput)
      }
    },(err) => {
        console.log("jjjj",err)
        this.loading = false;
        this.errorMessage = err.error.Message;
        this.cdRef.detectChanges(); 
      },() => {
        this.loading = false;
        console.log('Loading set to false');
        // this.cdRef.detectChanges(); // Ensure change detection is triggered
    });
  }else {
    return;
}
}
startOtpResendTimer(): void {
  this.otpResendEnabled = false;
  this.otpResendCounter = 40;

  if (this.otpResendTimer) {
    this.otpResendTimer.unsubscribe();
  }

  this.otpResendTimer = interval(1000).subscribe(() => {
    this.otpResendCounter--;
    this.cdRef.detectChanges();
    if (this.otpResendCounter === 0) {
      this.otpResendEnabled = true;
      this.otpResendCounter = null; // Hide the counter
      this.otpResendTimer.unsubscribe();
      this.cdRef.detectChanges();
    }
  });
}
onValidateOtp(){
  this.errorMessage='';
  if(!this.otpForm.valid){
      return;
  }
  const email = this.regConfig.get('supplier.email').value
  const payload = {
    email: email,
    otp: this.otpForm.get('otp').value,
  };
  this.loading = true;
      this.subSunk.sink = this.SupplierService.validateOtp(payload)
          .subscribe(res => {
              if (res.statusCode == 201) {
                this.loading = false;
                this.swalService.alert.success("OTP Validate Successfully") 
                this.loading = true;
                setTimeout(() => {
                  // this.getGeoCoords()
                  this.onBackToLogin();
                  this.cdRef.detectChanges();
                  // this.loading = true;
                }, 1000);
                // this.onBackToLogin();
                this.errorMessage ="";
                this.validationOtp = true;
                this.cdRef.detectChanges();
              } else {
                  this.alertService.error('Invalid Credentials');
                  this.errorMessage = 'Invalid Credentials';
              }
          }, (err) => {
            console.log("jjjj",err)
            this.loading = false;
            this.errorMessage = err.error.Message;
            this.cdRef.detectChanges(); 
          },() => {
            this.loading = false;
            console.log('Loading set to false');
            this.cdRef.detectChanges(); // Ensure change detection is triggered
        });
}

selectRoomView(event) {
  (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
    const viewPlans = propertyGroup.get('roomViews').value || [];
    propertyGroup.get('roomViews').setValue(
      viewPlans
    );

  });
}

selectWeenDays(event) {
  (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
    const weekDays = propertyGroup.get('weekendDays').value || [];
    propertyGroup.get('weekendDays').setValue(
      weekDays
    );

  });
}

selectMealPlan(event) {
  (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
    const mealPlans = propertyGroup.get('mealPlans').value || [];
    propertyGroup.get('mealPlans').setValue(
      mealPlans
    );

  });
}

onSubmitHotelDetail() {
    this.submittedHotel = true;
    if(!this.regConfig.valid) {
      return;
    }
   if (this.regConfig.valid) {
        (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
          const mealPlans = propertyGroup.get('mealPlans').value;
          const viewPlans = propertyGroup.get('roomViews').value;
          const weekDays = propertyGroup.get('weekendDays').value;
          // propertyGroup.get('city').patchValue(this.toCityId);
          propertyGroup.get('city_code').setValue(this.selectedCityCode);
          propertyGroup.get('mealPlans').setValue(mealPlans.map((meal) => meal.meals));
          propertyGroup.get('roomViews').setValue(viewPlans.map((views) => views.views));
         propertyGroup.get('weekendDays').setValue(weekDays.map((views) => views.day));
         propertyGroup.value.childrenFreeBefore =  propertyGroup.get('childrenFreeBefore').value || 0;
         propertyGroup.value.paidChildrenFromAge = propertyGroup.get('paidChildrenFromAge').value || 0;
         propertyGroup.value.paidChildrenToAge  = propertyGroup.get('paidChildrenToAge').value || 0;
        });
       const countryValue = this.regConfig.get('supplier.country').value;
       const countryCode = this.coreCountryList.filter(item => countryValue === item.name);
       this.regConfig.get('supplier.country').setValue(countryCode[0] ? countryCode[0].id: '');
       let data = Object.assign({}, this.regConfig.value);
       console.log("data",data)
        // console.log("this.selectedMealCheckboxes",this.selectedMealCheckboxes)
        // data['mealPlans'] = this.selectedMealCheckboxes;
        // data['weekendDays'] = this.selectedWeekCheckboxes;
        // data['roomViews'] = this.selectedViewCheckboxes;
        try {
            // if (!this.utility.isEmpty(this.hotelOne)) {
            //     data['id'] = this.hotelOne['id'];
            //     data['city_code']=this.hotelOne['city_code'];
            //     data = [data];
            //     data['topic'] = 'updateHotel';
            // }
            // else {
              // data['city']=this.selectedCityName;
              // data['city_code']=this.selectedCityCode;
                data = [data];
                data['topic'] = 'addSupplier';
                data['supplier_type'] = 'B2B';
            //}
        } catch (error) {
            //log.debug(error)
        }
        this.loadingSpinner = true;
        this.SupplierService.fetch(data).subscribe(resp => {
            console.log("resp",resp)
            if (resp.statusCode == 201) {
              this.loadingSpinner = false;
                // this.regConfig.reset();
              
                  Swal.fire({
                                         icon: 'success',
                                         title: 'Success',
                                         html: `
                                           Your request has been successfully submitted. TourBro.com's team will check your request 
                                           and may contact you by email if any other verifications are required. You should expect your 
                                           account and login details to be validated in 5 working days - If not, please contact us at 
                                           support@tourbro.com.
                                       
                                           Thanks for your interest in working with TourBro.com.
                                         `,
                                         timer: 95000,            // Time in milliseconds
                                         showConfirmButton: true, // Keep the OK button
                                         allowOutsideClick: false // Disable outside clicks
                                       });
                                     setTimeout(() => {
                                      const suppliersList = ['DMC','AS','TS','HPS'];
                                      const anyPresent = suppliersList.some(supplier => 
                                          this.selectedSuppliers.includes(supplier)
                                        );
                                        if (anyPresent) {
                                           this.router.navigate(['/auth/supplier']);
                                        } else {
                                          this.router.navigate(['/auth/login']);
                                        }
                                        
                                     }, 1000)
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                // this.router.onSameUrlNavigation = 'reload';
                
            } else if (resp.statusCode == 409) {
                this.swalService.alert.oops(resp.msg)
                this.loadingSpinner = false;
                (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
                  propertyGroup.get('mealPlans').reset()
                  propertyGroup.get('roomViews').reset()
                  propertyGroup.get('weekendDays').reset()
                })
            }
            else {
                this.swalService.alert.oops(resp.msg);
                this.loadingSpinner = false;
                (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
                  propertyGroup.get('mealPlans').reset()
                  propertyGroup.get('roomViews').reset()
                  propertyGroup.get('weekendDays').reset()
                })
            }
        },err => {
          console.log("err err",err)
            this.swalService.alert.oops(err.error.Message)
            this.loadingSpinner = false;
            (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
              propertyGroup.get('mealPlans').reset()
              propertyGroup.get('roomViews').reset()
              propertyGroup.get('weekendDays').reset()
            })
          })
   
      } else {
        return;
    }
}


  // createForm() {
  //     this.regConfig = this.fb.group({
  //       properties: this.fb.array([this.addPropertyForm()]),
  //       supplier:this.fb.array([this.addSupplierForm()]),
  //     });
  //     console.log("this.regConfig",this.regConfig)
  // }
  createForm() {
    this.regConfig = this.fb.group({
      childrenAllow:[''],
      properties: this.fb.array([this.createProperty()]),
    supplier: this.fb.group({
      title: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      job_title: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(12)]],
      alternate_phone_number:['', [ Validators.minLength(8),Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      alternate_email:['', [ Validators.email]],
      supplier_type:['B2B'],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    })
    })
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });
  }
  createProperty(): FormGroup {
    return this.fb.group({
      propertyName: ['', Validators.required],
      propertyType: ['', Validators.required],
      propertyRating: ['', Validators.required],
      country: ['', Validators.required],
      currency:['', Validators.required],
      country_code:[''],
      city: ['', Validators.required],
      propertyAddress: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      mealPlans: new FormControl([], Validators.required),
      weekendDays: new FormControl([], Validators.required),
      roomViews: new FormControl([], Validators.required),
      propertyLocalTimezone: ['', Validators.required],
      checkInTime: ['', Validators.required],
      checkOutTime: ['', Validators.required],
      childrenFreeBefore: [''],
      paidChildrenFromAge: [''],
      paidChildrenToAge: [''],
      channel: ['Extranet', Validators.required],
      Aggreed: [false, Validators.required],
      city_code:[''],
      meal_price:[''],
      user_type:['B2B'],
    });
  }

  makePasswordRequired() {
      const password = this.regConfig.get('password');
      const confirmPassword = this.regConfig.get('confirm_password');
      if (this.addOrUpdate == 'addd') {
          password.setValidators([Validators.required]);
          confirmPassword.setValidators([Validators.required]);
          confirmPassword.setErrors({ matchPassword: true });
      } else {
          password.clearValidators();
          confirmPassword.clearValidators();
          confirmPassword.setErrors(null)
      }
      password.updateValueAndValidity();
      confirmPassword.updateValueAndValidity();
  }

  getPhoneCodeList() {
      this.subSunk.sink = this.SupplierService.fetchPhoneCodeList()
          .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.phoneCodeList = resp.data ;
                  // console.log(this.phoneCodeList);

              } else {
                  this.swalService.alert.oops();
              }
          }, (err: HttpErrorResponse) => {
              console.error(err);
              this.swalService.alert.oops();
          })
  }
  getCoreCountryList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'supplierCountryList';
    this.SupplierService.fetch(data).subscribe(
        resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.coreCountryList = resp.data;
        }
      }
    )
}

// onCityChange(event) {
//   console.log("event",event)
//   let cityId = event;
//   const selectedCity = this.coreCityList.find(city => city.city_name === cityId);
//   console.log("selectedCity mmmmm",selectedCity)
//   this.selectedCityName = selectedCity ? selectedCity.CityCode : '';
//   console.log(" this.selectedCityName ",this.selectedCityName)
// }
  

  omitSpecialCharacters(event) {
     // return this.utility.omitSpecialCharacters(event);
  }
  numberOnly(event): boolean {
      return this.utility.numberOnly(event);
  }

  onReset() {
    //  this.SupplierService.b2cUserUpdateData.next({});
      this.regConfig.reset();
      this.addOrUpdate = 'add';
  }
  get supplier() {
    return this.regConfig.get('supplier') as FormGroup;
  }
  // getAutoCompleteLocations(event, control) {
  //   let inpValue = event.target.value;
  
  //   this.departureLocations.length = 0;
  //   if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp > 10)) {
  //     if (control == 'city') {
  //       this.isDepartureCityLoading = true;
  //     }
 
  //     const query = `${event.target.value}`;
  //     this.getCityList(event, control, query);
  //   }
  // }

  getUserCityListAuto(event): void {
    console.log("event",event)
    let state_id = event.target.value
    const data = [{  offset: 0, limit: 10,"country_name":state_id
 }]
 const selectedCountry = this.coreCountryList.find(country => country.name == state_id);
 const countryCode = selectedCountry ? selectedCountry.two_code : '';
  if (countryCode) {
    this.listStates(countryCode); // Fetch states based on selected country
  }
 this.patchCountryCode(0, countryCode);
    data['topic'] = 'commonCityList';
    this.SupplierService.fetch(data).subscribe(
        resp => {
            this.userCityList = resp.data;
        }
    )
}

  getCityListAuto(event): void {
    console.log("event",event)
    let state_id = event.target.value
    const data = [{  offset: 0, limit: 10,"country_name":state_id
 }]
 const selectedCountry = this.coreCountryList.find(country => country.name == state_id);
 const countryCode = selectedCountry ? selectedCountry.two_code : '';
  if (countryCode) {
    this.listStates(countryCode); // Fetch states based on selected country
  }
 this.patchCountryCode(0, countryCode);
    data['topic'] = 'commonCityList';
    this.SupplierService.fetch(data).subscribe(
        resp => {
            this.coreCityList = resp.data;
        }
    )
}

listStates(country_code: string) {
  const payload = { country_code };

  this.apiHandlerService.apiHandler('registerState', 'POST', '', '', payload)
    .subscribe(res => {
      if (res.data) {
        this.registerStates = res.data;
        console.log('States List:', this.registerStates); // Debugging

        // ✅ Trigger change detection
        this.cdRef.markForCheck();  
      } else {
        this.errorMessage = res.data.msg;
        this.registerStates = []; // Ensure list is cleared on error
      }
    });
}

listCities() {
  this.apiHandlerService.apiHandler('registerCity', 'POST', '', '', {})
    .subscribe(res => {
      if (res.data) {
        this.registerCities = res.data;
      } else {
        this.errorMessage = res.data.msg;
      }
    });
}

onStateChange(event: Event): void {
  const stateId = (event.target as HTMLSelectElement).value;
  this.filteredCities = this.registerCities.filter((city) => city.state_id == stateId);
}

onUserStateChange(event: Event): void {
  const stateId = (event.target as HTMLSelectElement).value;
  this.userFilteredCities = this.registerCities.filter((city) => city.state_id == stateId);
  const newProperty = this.createProperty();
  newProperty.get('city').setValue('');
}

patchCountryCode(index: number, countryCode: string): void {
  const propertiesArray = this.regConfig.get('properties') as FormArray;

  if (propertiesArray && propertiesArray.controls[index]) {
    propertiesArray.at(index).patchValue({
      country_code: countryCode
    });
  }
}


  // getCityList(event, control, city_name) {
  //   console.log("city_name",city_name)
  //   console.log("control",control)
  //   let request = { 'query': city_name }
  //   this.apiHandlerService.apiHandler('supplierCityList', 'POST', '', '', request)
  //     .pipe(
  //       tap(() => {
  //         this.isDepartureCityLoading = false;
  //       })
  //     )
  //     .subscribe((resp: any) => {
  //       if (resp.statusCode == 201) {
  //         if (control == 'city') {
  //           this.departureLocations = resp.data;
  //           console.log("this.departureLocations",this.departureLocations)
  //         }
  //         this.cdRef.detectChanges();
  //       }
  //     }, err => {
  //     });
  //   this.lastKeyupTstamp = event.timeStamp;
  // }
  // selectedLocation(control, location) {
  //   console.log("location",location)
  //   // this.locationSelected = true;
  //   this.city = location;
  //   if (control == 'city') {
  //     this.regConfig.patchValue({
  //       city: `${location['city_name']}`,
  //     })
  //     this.departureLocations = [];
  //     this.toCityId = location['city_name'];
  //     this.CityCode = location['CityCode']
  //     this.updateMapWithCityAndCountry(this.toCityId, 'CountryName');

  //   }
  //   return;
  // }
  onCityChange(event) {
    console.log("event",event)
    let cityId = event;
    const selectedCity = this.coreCityList.find(city => city.cityName === cityId);
    console.log("selectedCity",selectedCity)
    this.selectedCityName = selectedCity ? selectedCity.cityName : '';
    this.selectedCityCode = selectedCity ? selectedCity.cityId : '';
    this.updateMapWithCityAndCountry(this.selectedCityName, 'CountryName'); // Adjust the country as needed
  }
  updateMapWithCityAndCountry(city: string, country: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: `${city}, ${country}` }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const long = location.lng();
        this.center = { lat: lat, lng: long };
        this.map = new google.maps.Map(this.gmap.nativeElement, {
          center: this.center,
          zoom: 12
        });
      
        this.marker = new google.maps.Marker({
          map: this.map,
          position: this.center
        });
        (this.regConfig.get('properties') as FormArray).controls.forEach((propertyGroup: AbstractControl) => {
          // this.hotelForm.get("latitude").setValue(this.center.lat);
          // this.hotelForm.get("longitude").setValue(this.center.lng);
          propertyGroup.get('latitude').setValue(lat)
          propertyGroup.get('longitude').setValue(long)
          this.getTimezoneOffset( results[0].geometry.location.lat(),results[0].geometry.location.lng());
        })
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  getCurrencyList() {
    this.apiHandlerService.apiHandler('currencyConverison', 'post', {}, {}, {})
        .pipe(untilDestroyed(this))
        .subscribe(resp => {
            if (resp.Status && resp.data) {
                this.currencyList = resp.data.filter(t => t.status == 1);
            }
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
        })
}

initializeDropdownSettings() {
  this.dropdownSettingsForWeek = {
    singleSelection: false,
    idField: 'id',
    textField: 'day',
    maxHeight: 197,
    itemsShowLimit: 2,
  };

  this.dropdownSettingsForHotel = {
    singleSelection: false,
    idField: 'id',
    textField: 'meals',
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
}

onBackToLogin() {
  if(!this.errorMessage){
    this.loading = false;
  //   this.dropdownSettingsForWeek = {
  //     singleSelection: false,
  //     idField: 'id',
  //     textField: 'day',
  //     maxHeight: 197,
  //     itemsShowLimit: 2,
  //   };
  //    this.dropdownSettingsForHotel = {
  //       singleSelection: false,
  //       idField: 'id',
  //       textField: 'meals',
  //       maxHeight: 197,
  //       itemsShowLimit: 2,
  //   };
  //   this.dropdownSettingsForview = {
  //     singleSelection: false,
  //     idField: 'id',
  //     textField: 'views',
  //     maxHeight: 197,
  //     itemsShowLimit: 2,
  // };

  this.showOtpInput = false;
  this.propertyForm =true;
  // this.createForm()
  // this.getMealList();
  // this.getViewList();
  // this.getWeekList();
  // // this.mapInitializer()
  // setTimeout(() => {
  //   this.getGeoCoords()
  // }, 1000);
  Promise.all([
    this.getMealList(),
    this.getViewList(),
    this.getWeekList(),
    this.initializeDropdownSettings()
  ]).then(() => {
    setTimeout(() => {
      this.getGeoCoords(); // Ensure the map is loaded after meal/view/week data
    }, 1000);
  }).catch(error => {
    console.error('Error loading data:', error);
    this.errorMessage = 'Failed to load data';
  });
  }else{
    this.errorMessage = "Invalid otp you can't go back";
  }


}

ngAfterViewInit(){
   this.getGeoCoords();
}
  getGeoCoords() {
      navigator.geolocation.getCurrentPosition(pos => {
          this.center = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
          };
          console.log("his.center",this.center)
          if (this.center) {
              this.mapInitializer();
          }
      }, err => {
          // log.error(`Browser dose not support GeoLocation`, err);
      })
  }

  mapInitializer() {
    this.mapOptions = {
        center: this.center,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    console.log("map",this.map)
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
      const propertiesArray = this.regConfig.get('properties') as FormArray;
       const propertyGroup = propertiesArray.at(0) as FormGroup; // Adjust index as needed
         propertyGroup.get('latitude').setValue(event.latLng.lat());
         propertyGroup.get('longitude').setValue(event.latLng.lng());
         this.getTimezoneOffset(event.latLng.lat(), event.latLng.lng());
        //  propertyGroup.get('propertyLocalTimezone').setValue(timezone);
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
  this.searchBox = new google.maps.places.SearchBox(input);

  this.map.addListener('bounds_changed', () => {
    this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
  });

  this.searchBox.addListener('places_changed', () => {
    const places = this.searchBox.getPlaces();
    if (!places || places.length === 0) {
      return;
    }

    const place = places[0];
    if (!place.geometry || !place.geometry.location) {
      console.error('Place has no geometry');
      return;
    }

    // Update the map center and marker position
    const location = place.geometry.location;
    this.marker.setPosition(location);
    this.map.setCenter(location);

    // Update form fields
    const propertiesArray = this.regConfig.get('properties') as FormArray;
const propertyGroup = propertiesArray.at(0) as FormGroup; // Adjust index as needed
    propertyGroup.get('latitude').setValue(location.lat());
    propertyGroup.get('longitude').setValue(location.lng());
    this.getTimezoneOffset(location.lat(), location.lng());
    // propertyGroup.get('propertyLocalTimezone').setValue(timezone);
    propertyGroup.get('propertyAddress').setValue(place.formatted_address);
  });
}
// getTimezoneOffset(longitude: number): string {
//   const offset = Math.round(longitude / 15); // Each timezone is 15 degrees
//   const formattedOffset = offset >= 0 ? `UTC+${offset.toString().padStart(2, '0')}:00` : `UTC${offset.toString().padStart(3, '0')}:00`;
//   return this.timezones.includes(formattedOffset) ? formattedOffset : 'UTC+00:00'; // Default to UTC+00:00 if not found
// }
getTimezoneOffset(lat: number, lng: number): void {
  const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const apiKey = 'AIzaSyB3N3Rg1vCjF6FmEc9qisxtS2JOpVUTKDM'; // Replace with your actual API key
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
        const propertiesArray = this.regConfig.get('properties') as FormArray;
        const propertyGroup = propertiesArray.at(0) as FormGroup; // Adjust index as needed
          // propertyGroup.get('latitude').setValue(event.latLng.lat());
          // propertyGroup.get('longitude').setValue(event.latLng.lng());
          // const timezone = this.getTimezoneOffset(event.latLng.lng());
          // propertyGroup.get('propertyLocalTimezone').setValue(timezone);
        // Check if the formattedOffset exists in timezones array
        if (!this.timezones.includes(formattedOffset)) {
          formattedOffset = 'UTC+00:00'; // Default if not found
        }

        console.log("Final Timezone Selected:", formattedOffset);
        propertyGroup.get('propertyLocalTimezone').setValue(formattedOffset);
      } else {
        console.error('Error fetching timezone:', data.status);
        // this.hotelForm.get('local_timezone').setValue('UTC+00:00'); // Default
      }
    })
    .catch(error => {
      console.error('Failed to fetch timezone:', error);
      // this.hotelForm.get('local_timezone').setValue('UTC+00:00'); // Default
    });
}
getAddress(latLng: google.maps.LatLng) {
  this.geocoder = new google.maps.Geocoder();
  this.geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      const propertiesArray = this.regConfig.get('properties') as FormArray;
      const propertyGroup = propertiesArray.at(0) as FormGroup; // Adjust index as needed
      if (results[0]) {
        propertyGroup.get('propertyAddress').setValue(results[0].formatted_address);
      } else {
        console.error('No results found');
      }
    } else {
      console.error(`Geocoder failed due to: ${status}`);
    }
  });
}
    // getAddress(latLng) {
    //     let geocoder = new google.maps.Geocoder();
    //     let self = this;
    //     geocoder.geocode({ 'location': latLng }, (results, status) => {
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             if (results[0]) {
    //                 self.hotelForm.get("address").setValue(results[0]['formatted_address']);
    //                 let address = results[0].address_components;
    //                 let zipcode = address[address.length - 1].long_name;
    //                 // self.hotelForm.get("postal_code").setValue(zipcode);
    //             }
    //             else {
    //             }
    //         }
    //         else {
    //         }
    //     });
    // }
  //   getAddress(latLng, index) {
  //     let geocoder = new google.maps.Geocoder();
  //     geocoder.geocode({ 'location': latLng }, (results, status) => {
  //       console.log("status",status)
  //       console.log("google.maps.GeocoderStatus",google.maps.GeocoderStatus)
  //         if (status === google.maps.GeocoderStatus.OK) {
  //             if (results[0]) {
  //               console.log("results[0]",results[0])
  //                 const address = results[0]['formatted_address'];
  //                 const propertyFormArray = this.regConfig.get('properties') as FormArray;
  //                 const propertyFormGroup = propertyFormArray.at(index) as FormGroup;
  
  //                 // Set propertyAddress, latitude, and longitude for the specific property
  //                 propertyFormGroup.get('propertyAddress').setValue(address);
  //                 propertyFormGroup.get('latitude').setValue(latLng.lat());
  //                 propertyFormGroup.get('longitude').setValue(latLng.lng());
  
  //                 // Optionally, handle other address components like postal code if needed
  //                 let addressComponents = results[0].address_components;
  //                 let zipcode = addressComponents[addressComponents.length - 1].long_name;
  //                 // propertyFormGroup.get('postal_code').setValue(zipcode);  // if postal_code is needed
  //             }
  //         }
  //     });
  // }
  
  openStaticPage(page_title) {
    sessionStorage.setItem('static_title',page_title);
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['auth/cms'])
    );
   window.open('#'+url, '_blank');
}

  ngOnDestroy() {
      this.subSunk.unsubscribe();
  }

}
