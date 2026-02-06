import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, Form } from '@angular/forms';
import { TransferCrsService } from '../../../transfer-crs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
const log = new Logger('transfer-crs/TransferVehicleAddComponent');

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class TransferVehicleAddComponent implements OnInit {

  @Output() someEvent = new EventEmitter<any>();
  public addUpdateVehcleForm: FormGroup;
  public countryList: any[] = [];
  public cityList: any[] = [];
  public currencyList: any[] = [];
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-green'
  };
  public rideType = [
    { key: 'private', value: 'private' },
    { key: 'public', value: 'public' }
  ];
  public cancellationType = [
    { key: 'Free' },
    { key: 'Paid' }
  ];
  public chargeType = [
    { key: 'Percent' },
    { key: 'Fixed' }
  ];
  public vehiclesType: any[] = [];
  public ratingList = [
    { key: 'Standard' },
    { key: 'Premium' },
    { key: 'Mid-Luxury' },
    { key: 'Luxury' },
    { key: 'Ultra-Luxury' }
  ];
  public acType = [{ key: 'Yes' }, { key: 'No' }]
  public seatCapacity = Array.from({ length: 71 }, (_, index) => index + 1);
  public isOpen = false as boolean;
  public minDate = new Date();
  public endMinDate = new Date();
  public submittedVehicle: boolean = false;
  public submitted: boolean = false;
  public imageFile: any;

  groupedLocations = {
    airports: [],
    googleMaps: [],
    recentSearches: [],
  };
  groupedDestinationLocations =
    {
      airports: [],
      googleMaps: [],
      recentSearches: [],
    };

  public transferCityList: any[] = []
  public locationSelected: any;
  public startingPointLocations: any;
  public endPointLocations: any;
  public routesNamesLocation: any[] =[];

  public startPointSelectedLocation: any;
  public endPointSelectedLocation: any;
  public isReturnShow: boolean = false;
  public selectedMultipleLocation: any[] = [];
  private citySearchTimeout: any;
  public isDesitnationCityLoading: boolean = false;
  public isDepartureCityLoading: boolean = false;
  public isAddRouteCityLoading: boolean[] = [];;

  public loadingTemplate: any
  public secondaryColour: any;
  public primaryColour: any;
  public loading: boolean = false;
  public vehicleMasterDataList: any[] = [];
  public vehicleNamesList: any[] = [];
  public loggedInUserId: any;
  public loggedUserCurrency: any;
  constructor(
    private apiHandlerServices: ApiHandlerService,
    private fb: FormBuilder,
    private transferCrsService: TransferCrsService,
    private swalService: SwalService,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    // this.transferCrsService.updatTransferData.subscribe((data) => {
    //   if(data) {
    //     console.log(data);
    //     this.getVehiclePrice(data.id)
    //   }
    // })
    this.createForm();
    this.getCoreCountryList();
    // this.getCurrencyList();
    this.getVehicleTypeList();
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.loggedInUserId = JSON.parse(currentDomainUser)['id'];
    this.loggedUserCurrency = JSON.parse(currentDomainUser)['currency'];
  }

  getVehiclePrice(id) {
    const req = {id: id}
      this.apiHandlerServices.apiHandler('getVehiclePriceList', 'POST', {}, {}, req).subscribe({
        next: (res) => {
          if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
              this.loading = false;
          } else {
              this.loading = false;
          }

          console.log(res)
        }, error: (err) => {
          this.loading = false;
          console.log(err);
          this.swalService.alert.error(err.Message);
        }
    })    
  }
onVehicleSelect(event) {
  const vehicle_type = event.target.value;
  this.vehicleNamesList = [];
  this.addUpdateVehcleForm.patchValue({
    vehicle_id: Number(vehicle_type)
  })
  this.addUpdateVehcleForm.get('ac_vehicle').setValue('');
  this.addUpdateVehcleForm.get('max_capacity').setValue(''),
  this.addUpdateVehcleForm.get('ride_type').setValue(''),
  this.addUpdateVehcleForm.get('ratings').setValue(''),
  this.addUpdateVehcleForm.get('luggage_allowances').setValue('');
  this.getVehicleMasterList(vehicle_type);

}


  getVehicleMasterList(vehicle_type) {
    const payLoad = {
      vehicle_type: Number(vehicle_type)
    }
    this.apiHandlerServices.apiHandler('vehicleMasterDataList', 'POST', {}, {}, payLoad).subscribe({
      next: (res) => {
          if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
            
              this.vehicleMasterDataList = res.data;
              const vehicleNameList = this.vehicleMasterDataList.map((data) => data.vehicle_name);
              this.vehicleNamesList = vehicleNameList;
              console.log(this.vehicleNamesList)
          } else {
              this.vehicleMasterDataList = [];
              this.vehicleNamesList = [];
          }
      }, error: (err) => {
        this.vehicleNamesList = [];
        this.vehicleMasterDataList = [];
      }
    })
  }

  onVehicleNameSelect(event) {
    console.log(event.target.value);
    const selectedVehicleName = event.target.value;
    const selectedVehicle = this.vehicleMasterDataList.find((data) => data.vehicle_name === selectedVehicleName);
    console.log(selectedVehicle);

    this.addUpdateVehcleForm.patchValue({
      ac_vehicle: selectedVehicle.ac_vehicle,
      max_capacity: selectedVehicle.max_capacity,
      ride_type: selectedVehicle.ride_type,
      ratings: selectedVehicle.ratings,
      luggage_allowances: selectedVehicle.luggage_allowances,
      image: selectedVehicle.image
    })
  }

  getVehicleTypeList() {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    const currentDomainUserAuth = JSON.parse(currentDomainUser)['auth_role_id'];
    let created_by_id;
    // if(currentDomainUserAuth !== 7) {
      created_by_id = 1;
    // } else {
      // created_by_id = JSON.parse(currentDomainUser)['id'];
    // }
    const req ={created_by_id: created_by_id}
    this.apiHandlerServices.apiHandler('vehicleMasterList', 'POST', {}, {}, req).subscribe({
      next: (res) => {
        if(res.Status === true && (res.statusCode=== 200 || res.statusCode === 201)) {
          this.vehiclesType = res.data
        } else {
          this.vehiclesType = [];
        }
      }, error: (err) => {
        this.vehiclesType = [];
      }
    })
  }

  createForm() {
    this.addUpdateVehcleForm = this.fb.group({
      vehicle_type: [0, Validators.required],
      vehicle_name: ['', Validators.required],
      ac_vehicle: ['', Validators.required],
      max_capacity: ['', Validators.required],
      ride_type: ['', Validators.required],
      ratings: ['', Validators.required],
      image: [''],
      status: [false, Validators.required],
      luggage_allowances: ['', Validators.required],
      starting_point: ['', Validators.required],
      country_id: ['', Validators.required],
      end_point: ['', Validators.required],
      route: [''],
      route_name:[''],
      duration_hours: ['', Validators.required],
      duration_minutes: ['', Validators.required],
      routes: this.fb.array([]),
      vehicle_id:[''],
      vehicle_pricing_details: this.fb.array([])
    })
    this.addPolicy();
    this.addRoutes();
  }

  get multipleRoutes(): FormArray {
    return this.addUpdateVehcleForm.get('routes') as FormArray;
  }

  addRoutes() {
    const addingRoutes = this.fb.group({
      route: [''],
      route_name: ['']
    });
    this.multipleRoutes.push(addingRoutes);
  }
  removeRoutes(index: number) {
    this.multipleRoutes.removeAt(index);
  }
  get cancellationPolicies(): FormArray {
    return this.addUpdateVehcleForm.get('vehicle_pricing_details') as FormArray;
  }

  seasonMinDates: Date[] = [];
  endMinDates: Date[] = [];

  addPolicy() {
    
    const policies = this.cancellationPolicies;
    const lastPolicy = policies.length > 0 ? policies.at(policies.length - 1) : null;

  //   // Default start & end dates
  // let dateFrom = '';
  // let dateTo = '';

  // if (lastPolicy) {
  //   const prevEndDate = new Date(lastPolicy.get('date_to').value);

  //   if (!isNaN(prevEndDate.getTime())) {
  //     // Set new start date as the next day after previous end date
  //     const nextDay = new Date(prevEndDate);
  //     nextDay.setDate(prevEndDate.getDate() + 1);

  //     dateFrom = nextDay.toISOString().split('T')[0];
  //   }


    
  // }

  const policyGroup = this.fb.group({
      date_from: ['', Validators.required],
      date_to: ['', Validators.required],
      is_return: [false],
      base_price: ['', Validators.required],
      same_day_return: [0],
      diff_day_return: [0],
      is_refundable: ['false'],
      charge_type: ['Percentage'],
      cancellation_charge: [0],
      refundable_before_days: [0],
      additional_info: [''],
    });

    const lastIndex = this.cancellationPolicies.length - 1;
    if (lastIndex >= 0) {
      const prevEnd = this.cancellationPolicies.at(lastIndex).get('date_to').value;
      const nextDay = prevEnd ? new Date(new Date(prevEnd).getTime() + 24 * 60 * 60 * 1000) : this.minDate;
      this.seasonMinDates.push(nextDay);
    } else {
      this.seasonMinDates.push(this.minDate);
    }

    this.endMinDates.push(this.minDate);

    this.cancellationPolicies.push(policyGroup);
  }

   onStartDateChange(event: Date, seasonIndex: number) {
    this.endMinDates[seasonIndex] = new Date(event);
    const season = this.cancellationPolicies.at(seasonIndex);
    const endDateCtrl = season.get('date_to');
    if (endDateCtrl.value && new Date(endDateCtrl.value) < event) {
      endDateCtrl.setValue('');
    }
  }

onEndDateChange(event: Date, seasonIndex: number) {
  const nextIndex = seasonIndex + 1;
  if (nextIndex < this.cancellationPolicies.length) {
    this.seasonMinDates[nextIndex] = new Date(event);
  }
}
  removePolicy(index: number) {
    this.cancellationPolicies.removeAt(index);
  }

  getMinDate(index: number): Date | null {
  if (index === 0) return this.minDate || new Date();

  const prevPolicy = this.cancellationPolicies.at(index - 1);
  const prevEnd = prevPolicy.get('date_to').value;
  if (!prevEnd) return null;

  const nextDay = new Date(prevEnd);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

  get f() { return this.addUpdateVehcleForm.controls; }
  hasError = (controlName: string, errorName: string) => {
    return ((this.addUpdateVehcleForm || this.addUpdateVehcleForm.controls[controlName].touched) && this.addUpdateVehcleForm.controls[controlName].hasError(errorName));
  }

  getCoreCountryList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'countryList';
    this.transferCrsService.fetch(data).subscribe(
      resp => {
        this.countryList = resp.data.countries;
      }
    )
  }

  getCityListAuto(event): void {
    let state_id = event.target.value;
    const selectedCountry = this.countryList.find(country => country.name == state_id);
    const countryCode = selectedCountry ? selectedCountry.two_code : '';
    const data = [{
      offset: 0, limit: 10, "country_name": state_id
    }];
    data['topic'] = 'commonCityList';
    this.transferCrsService.fetch(data).subscribe(
      resp => {
        this.cityList = resp.data;
      }
    )
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.type);
      // Example validation
      const allowedTypes = [
        'image/jpeg',
        'image/png'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type!");
        event.target.value = ''; // reset input
      } else {
        this.imageFile = file;
      }

    }
  }

  getCurrencyList() {
    const data = [{}]
    data['topic'] = 'hotelCurrencyConverison';
    this.transferCrsService.fetch(data).subscribe(resp => {
      if (resp.Status && resp.data) {
        this.currencyList = resp.data.filter(t => t.status == 1);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
    })
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('id', this.loggedInUserId);
    formData.append('image',this.imageFile);
    this.apiHandlerServices.apiHandler('addTransferImage','POST',{},{},formData).subscribe({
      next: (res) => {

      }, error: (err) => {

      }
    })
  }

  onSubmit() {
    console.log(this.addUpdateVehcleForm);
    if (!this.addUpdateVehcleForm.valid) {
      return;
    }
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    const loggedInAuthUser = JSON.parse(currentDomainUser)['auth_role_id'];
    let created_by_id;
    // if(loggedInAuthUser !== 7) {
    //     created_by_id = 1
    // } else {
        created_by_id = JSON.parse(currentDomainUser)['id'];
    // }
    const getSelectedId = this.selectedMultipleLocation.map(data=> data.id);
    const getSelectedLocation = this.selectedMultipleLocation.map(data=> data.location_name);
    this.addUpdateVehcleForm.patchValue({
      route: getSelectedId,
      route_name: getSelectedLocation,
      starting_point: this.startPointSelectedLocation.id,
      end_point: this.endPointSelectedLocation.id,
      vehicle_type: Number(this.addUpdateVehcleForm.value.vehicle_type),
      duration_minutes: String(this.addUpdateVehcleForm.value.duration_minutes),
      duration_hours: String(this.addUpdateVehcleForm.value.duration_hours),
      max_capacity : String(this.addUpdateVehcleForm.value.max_capacity ),
      // is_refundable: this.addUpdateVehcleForm.value.is_refundable === "true" ? true : false,
      // return: this.addUpdateVehcleForm.value.return === false ? 0 : 1
    })
    this.addUpdateVehcleForm.removeControl('routes');
    const rawValue = this.addUpdateVehcleForm.value;

    const formattedRequest = {
      ...rawValue,
      created_by_id: created_by_id,
      vehicle_pricing_details: rawValue.vehicle_pricing_details.map((detail: any) => ({
        ...detail,
        is_refundable: detail.is_refundable === "true" ? true : false,
        is_return: detail.is_return === false ? 0 : 1
      }))
    };
    if (!this.addUpdateVehcleForm.valid) {
      return;
    }

    // req.append('image', this.imageFile);
    // req.append('data', JSON.stringify());
    this.loading = true;
    this.apiHandlerServices.apiHandler('transferCreate', 'POST', {}, {}, formattedRequest).subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
          this.loading = false;
          this.swalService.alert.success('Transfer Vehicle Added Scuccessfully');
          this.router.navigate(['/transfers/transfer-crs-list']);
          this.router.navigate(['/transfers/transfer-crs-list'],{
            state: { tab: 'list_vehicles' }
          });
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
      }, error: (err) => {
        this.loading = false;
        this.addUpdateVehcleForm.reset();
        this.swalService.alert.error(err.Message);
      }
    })
    // } else {
    //   this.swalService.alert.oops('Please Updload Image');
    // }
    
  }
  clearLocationIfNotSelected(control) {
    if (!this.locationSelected) {
      this.addUpdateVehcleForm.patchValue({ end_point: '', starting_point: '' });
    }
  }

  getAutoCompleteLocations(event, control, index) {
    let inpValue = event.target.value;
    if (this.addUpdateVehcleForm.get('end_point').value != '' && this.addUpdateVehcleForm.get('starting_point').value != '' && this.addUpdateVehcleForm.get('end_point').value == this.addUpdateVehcleForm.get('starting_point').value) {
      this.swalService.alert.oops('Departure and destination city cannot be same');
      return;
    }
    const routesArray = this.addUpdateVehcleForm.get('routes') as FormArray;

    if (routesArray && routesArray.at(index)) {
      const routeGroup = routesArray.at(index) as FormGroup;
      if (inpValue && inpValue.trim() !== '') {
        routeGroup.get('route_name').setValidators([Validators.required]);
      } else {
        routeGroup.get('route_name').clearValidators();
      }
      routeGroup.get('route_name').updateValueAndValidity();
    }

    if (this.routesNamesLocation && !this.routesNamesLocation[index]) {
      this.routesNamesLocation[index] = [];
    }

    clearTimeout(this.citySearchTimeout);
    const city_name = `${event.target.value}`;
    // Set a new timer
    if (control === 'startPoint') {
      this.isDepartureCityLoading = true;
    }
    if (control === 'endPoint') {
      this.isDesitnationCityLoading = true;
    }
    if (control === 'route_name') {
      this.isAddRouteCityLoading[index] = true;
    }
    this.citySearchTimeout = setTimeout(() => {
      this.getCityList(event, control, city_name, index);
    }, 1000); 
  }

  getCityList(event, control, city_name, index) {
    let request = { 'Name': city_name, 'userType': 'B2C' };
    this.apiHandlerServices.apiHandler('transferCityList', 'POST', '', '', request)
     .pipe(debounceTime(2000))
      .subscribe((resp: any) => {
        if ((resp.statusCode === 200 || resp.statusCode === 201) && resp.Status === true) {
          console.log(resp);
          this.loading = false;
          if (control === 'startPoint') {
            this.isDepartureCityLoading = false;
            this.startingPointLocations = resp.data;
          }
          if (control === 'endPoint') {
            this.isDesitnationCityLoading = false;
            this.endPointLocations = resp.data;
          }
          if (control === 'route_name') {
            this.isAddRouteCityLoading[index] = false;
            this.routesNamesLocation[index] = resp.data;
          }
          if (resp.data.length === 0) {
            const getCountryId = this.addUpdateVehcleForm.value.country_id;
            const selectedCountry = this.countryList.find(country => country.id == getCountryId);
            const req = {
              CityName: city_name,
              CountryName: selectedCountry.name
            }
            this.apiHandlerServices.apiHandler('addTransferCity', 'POST', {} , {}, req).subscribe({
              next: (res) => {
                console.log(res)
                if ((res.statusCode === 200 || res.statusCode === 201) && res.Status === true) {
                  this.loading = false;
                  console.log(res);
                  if (control === 'startPoint') {
                    this.isDepartureCityLoading = false;
                    this.startingPointLocations = res.data;
                  }
                  if (control === 'endPoint') {
                    this.isDesitnationCityLoading = false;
                    this.endPointLocations = res.data;
                  }
                  if (control === 'route_name') {
                    this.isAddRouteCityLoading[index] = false;
                    this.routesNamesLocation[index] = res.data;
                  }
                }else {
                  this.loading = false;
                  this.transferCityList = [];
                  this.routesNamesLocation[index] = [];
                  this.endPointLocations = [];
                  this.startingPointLocations = [];
                }
              }, error : (err) => {
                this.loading = false;
                console.log(err)
                this.transferCityList = [];
                this.routesNamesLocation[index] = [];
                this.endPointLocations = [];
                this.startingPointLocations = [];
              }
            })
          }

        } else {
          this.loading = false;
          this.transferCityList = [];
          this.routesNamesLocation[index] = [];
          this.endPointLocations = [];
          this.startingPointLocations = [];
        }
      }, err => {
        this.loading = false;
        console.error("API error:", err);
        this.transferCityList = [];
        this.routesNamesLocation[index] = [];
        this.endPointLocations = [];
        this.startingPointLocations = [];
      });
  }

  selectedLocation(event, control, index) {
    console.log(event);
    if (event) {
      this.locationSelected = event;
      if (control === 'starting_point') {
        this.isDepartureCityLoading = false;
        this.startPointSelectedLocation = event;
        this.addUpdateVehcleForm.patchValue({
          starting_point: event.location_name,
        });
      }
      if (control === 'end_point') {
        this.isDesitnationCityLoading = false;
        this.endPointSelectedLocation = event;
        this.addUpdateVehcleForm.patchValue({
          end_point: event.location_name
        });
      }
      if (control === 'route_name') {
        this.isAddRouteCityLoading[index] = false;
        const routesArray = this.addUpdateVehcleForm.get('routes') as FormArray;
        const selectedRouteName = event.location_name;

        const startPoint = this.addUpdateVehcleForm.get('starting_point').value;
        const endPoint = this.addUpdateVehcleForm.get('end_point').value;

        const existingRouteNames = routesArray.controls
          .map((ctrl, i) => (i !== index ? ctrl.get('route_name').value : null))
          .filter(v => !!v);

        if (
          selectedRouteName === startPoint ||
          selectedRouteName === endPoint ||
          existingRouteNames.includes(selectedRouteName)
        ) {
          this.swalService.alert.oops(
            'This route location cannot be same as starting point, end point, or another route name.'
          );
          routesArray.at(index).get('route_name').setValue('');
          return;
        }
        if (
          selectedRouteName !== startPoint ||
          selectedRouteName !== endPoint ||
          !existingRouteNames.includes(selectedRouteName)
        ) {
          this.selectedMultipleLocation.push(event);
        }
        routesArray.at(index).get('route_name').setValue(selectedRouteName);
      }

      if (this.addUpdateVehcleForm.get('end_point').value != '' && this.addUpdateVehcleForm.get('starting_point').value != '' && this.addUpdateVehcleForm.get('end_point').value == this.addUpdateVehcleForm.get('starting_point').value) {
        this.swalService.alert.oops('Departure and destination city cannot be same');
        if (control === 'starting_point') {
          this.addUpdateVehcleForm.patchValue({
            starting_point: '',
          });
        }
        if (control === 'end_point') {
          this.addUpdateVehcleForm.patchValue({
            end_point: ''
          });
        }
        return;
      }
      this.endPointLocations = [];
      this.startingPointLocations = [];
      this.transferCityList = [];
      this.routesNamesLocation[index ? index : 0] = [];
    }
  }

  onCheckboxChange(event, index) {
    const checked = event.target.checked;
    this.isReturnShow = checked;
    const policyGroup = this.cancellationPolicies.at(index) as FormGroup;
    policyGroup.patchValue({
      is_return: checked ? 1 : 0,
    });
    const sameDayCtrl = policyGroup.get('same_day_return');
    const diffDayCtrl = policyGroup.get('diff_day_return');
    if (checked) {
      sameDayCtrl.setValidators([Validators.required]);
      diffDayCtrl.setValidators([Validators.required]);
    } else {
      sameDayCtrl.clearValidators();
      diffDayCtrl.clearValidators();
      sameDayCtrl.setValue(0);
      diffDayCtrl.setValue(0);
    }

    sameDayCtrl.updateValueAndValidity();
    diffDayCtrl.updateValueAndValidity();
  }

  resetForm() {
    this.addUpdateVehcleForm.reset();
    this.multipleRoutes.clear();
    this.cancellationPolicies.clear();
    this.addRoutes();
    this.addPolicy();
    this.addRoutes();
    this.router.navigate(['/transfers/transfer-crs-list'],{
      state: { tab: 'add_vehicle_transfer' }
    });
  }

  onRefundableChange(event, index) {
    console.log(event.target.value);
    const policyGroup = this.cancellationPolicies.at(index) as FormGroup;
    const refundable_before_days = policyGroup.get('refundable_before_days');
    const cancellation_charge = policyGroup.get('refundable_before_days');
    const checked = event.target.value;
    if(checked === 'true' || checked === true) {
      refundable_before_days.setValidators([Validators.required]);
      cancellation_charge.setValidators([Validators.required]);
    } else {
      refundable_before_days.clearValidators();
      cancellation_charge.clearValidators();
      refundable_before_days.setValue(0);
      cancellation_charge.setValue(0);
    }
    refundable_before_days.updateValueAndValidity();
    cancellation_charge.updateValueAndValidity();
  }

  ondateChange(event) {
    this.endMinDate = new Date(event)
  }
}
