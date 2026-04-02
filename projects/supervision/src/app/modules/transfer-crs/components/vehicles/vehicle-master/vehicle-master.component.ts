import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSelect, MatSlideToggleChange, Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
const baseUrl = environment.SA_URL;
interface Country {
  id?: number;
  name: string;
  sortname?: string;
}

interface City {
  id: number;
  city_name: string;
  country_id?: number;
}

@Component({
    selector: 'app-vehicle-master',
    templateUrl: './vehicle-master.component.html',
    styleUrls: ['./vehicle-master.component.scss']
})

export class VehicleMasterComponent implements OnInit {
addUpdateVehcleForm: FormGroup;
  enabledForm = true;
  saveTextName = 'Save';
  id: number;
searchText: string = '';
searchSpin = true;
isSubmitted
 countryList: Country[] = [];
  cityList: City[] = [];
  currentCountry: Country = null;
   public loadingCities: boolean = false;
displayColumn = [
  'Sl.No',
  'Status',
  'City',
  'Vehicle Name',
  'Vehicle Type',
  'Vehicle Reg No',
  'Capacity',
  'Ride Type',
  'Category',
  'Combustion Type',
  'Cancellation Rule',
  'Image',
  'Action'
];

page = 1;
 public secondaryColour: string = '#f44336';
 public primaryColour: string = '#1976d2';
pageSize = 20;
collectionSize: number;
  vehiclesType: any[] = [];
  vehicleMasterDataList: any[] = [];
combustionList: any[] = [];
  private destroy$ = new Subject<void>();
  seatCapacity = Array.from({ length: 71 }, (_, i) => i + 1);
  acType = [{ key: 'Yes' }, { key: 'No' }];
  rideType = [{ key: 'private', value: 'private' }];
  ratingList = [
    { key: 'Standard' },
    { key: 'Premium' },
    { key: 'Luxury' }
  ];    public loading: boolean = false;
  vehicleImage: any;
  imageFile: File;
  loggedInUserId: number;
driverList:any=[]
  carAmenityList:any;
      dropdownSettingsForRoom = {};
  constructor(
    private fb: FormBuilder,
    private api: ApiHandlerService,
    private swal: SwalService
  ) {

         this.dropdownSettingsForRoom = {
        singleSelection: false,
        idField: 'id',
        textField: 'amenties',
        maxHeight: 197,
        itemsShowLimit: 2,
    };
  }
getCombustionList() {
  this.api.apiHandler('VehicleCombustionList', 'POST', {}, {}, {})
    .subscribe((res: any) => {
      if (res.Status) {
        this.combustionList = res.data || [];
      } else {
        this.combustionList = [];
      }
    });
}
  ngOnInit() {
    this.loggedInUserId = JSON.parse(sessionStorage.getItem('currentSupervisionUser')).id;
        this.createForm();
      this.getCountryList();
    this.setupCountryChangeListener();
this.getVendorList()
    this.getVehicleTypeList();
    this.getVehicleMasterList();
    this.getAminities();
    this.getCombustionList();
    this.setupVehicleTypeListener();
    this.searchSubject.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(search => {
  this.citySkip = 1;
  this.hasMoreCities = true;
  this.cityList = [];
  this.citySearchText = search;

  this.getCityListByCountry(this.currentCountry, search);
});
  }

  onCitySearch(value: string) {
  this.searchSubject.next(value);
}
filteredSeatCapacity: number[] = [];

setupVehicleTypeListener() {
  this.addUpdateVehcleForm.get('vehicle_type').valueChanges
    .pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$))
    .subscribe((selectedVehicleTypeId: any) => {

      const selectedVehicle = this.vehiclesType.find(
        v => v.id == selectedVehicleTypeId
      );

      if (selectedVehicle && selectedVehicle.capacity) {

        // ✅ Always restrict dropdown
        this.filteredSeatCapacity = this.seatCapacity.filter(
          c => c <= selectedVehicle.capacity
        );

        // ❌ DO NOT override in edit mode
        if (!this.isEditMode) {
          this.addUpdateVehcleForm.patchValue({
            max_capacity: selectedVehicle.capacity
          });
        }
      } else {
        this.filteredSeatCapacity = [];
      }
    });
}
    getVendorList() {
    this.searchSpin = true;
  this.loading = true;
    this.api
      .apiHandler('driverList', 'POST', {}, {}, {})
      .subscribe({
        next: (res: any) => {
          if (res.Status) {
            this.driverList = res.data || [];
              this.loading = false;
          } else {
            this.driverList = [];
             this.loading = false;
          }
        },
        error: () => {
          this.driverList = [];
           this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
setupCountryChangeListener() {
  const countryControl = this.addUpdateVehcleForm.get('country');

  if (countryControl) {
    countryControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$)) // ❌ no debounce
      .subscribe((country: Country) => {

        this.currentCountry = country;

        this.citySkip = 1;
        this.cityList = [];
        this.hasMoreCities = true;

        if (country) {
          const cityIdToSend = this.isEditTrigger
            ? this.selectedCityForEdit
            : null;

          this.getCityListByCountry(
            country,
            '',
            cityIdToSend
          );

          // ✅ reset AFTER using
          this.isEditTrigger = false;
        } else {
          this.cityList = [];
        }
      });
  }
}

 getCountryList() {
  this.api.apiHandler('supervisionCountryLists', 'post', {}, {})
    .subscribe((resp: any) => {
      if (resp.Status && resp.data) {
        this.countryList = resp.data;

        // ✅ Set India as default
        const india = this.countryList.find(c =>
          c.name.toLowerCase() === 'india'
        );

        if (india) {
          this.addUpdateVehcleForm.patchValue({
            country: india
          });

          // ✅ also load cities for India
          this.currentCountry = india;

          this.citySkip = 1;
          this.cityList = [];
          this.hasMoreCities = true;

          // this.getCityListByCountry(india);
        }
      }
    });
}

getCityListByCountry(
  country: Country,
  search: string = '',
  selectedCity?: any
) {
  if (!country) return;

  this.loadingCities = true;

  const countryParam = country.sortname || country.name;

  this.api.apiHandler(
    'supervisionCityLists',
    'post',
    {},
    {},
    {
      country_code: countryParam,
      skipLimit: this.citySkip,
      search: search,
      cityId: selectedCity
    }
  ).subscribe((resp: any) => {

    this.loadingCities = false;

    if (resp.Status && resp.data) {

      if (this.citySkip === 1) {
        this.cityList = resp.data;
      } else {
        this.cityList = [...this.cityList, ...resp.data];
      }

      if (resp.data.length < this.cityLimit) {
        this.hasMoreCities = false;
      }

      // ✅ AUTO SELECT (edit case)
      if (selectedCity) {
        setTimeout(() => {
          const found = this.cityList.find(c => c.id == selectedCity);
          if (found) {
            this.addUpdateVehcleForm.get('city').setValue(found.id);
             this.selectedCityForEdit = null;
      this.isEditMode = false;
          }
        });
      }
    }
  });
}
  get f() { return this.addUpdateVehcleForm.controls; }

  createForm() {
    this.addUpdateVehcleForm = this.fb.group({
      trip_type: ['', Validators.required],
      vehicle_reg_no: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]+$/)]],
      vehicle_type: ['', [Validators.required]],
      vehicle_name: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      ac_vehicle: ['', Validators.required],
      max_capacity: ['', Validators.required],
      driver_id: ['', Validators.required],
      ratings: ['', Validators.required],
      luggage_allowances: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      // cordinates: ['', Validators.required],
      duration_hours: [''],
      duration_minutes: [''],
     cancellation_rule:['',Validators.required],
      combustion_type:['',Validators.required],
      image: [''],
      status: [true],
      amenities:[null],
      

    // route: this.fb.array([]),
    // route_name: this.fb.array([])
    });
  }
// get route(): FormArray {
//   return this.addUpdateVehcleForm.get('route') as FormArray;
// }

// get routeName(): FormArray {
//   return this.addUpdateVehcleForm.get('route_name') as FormArray;
// }

// addRoute() {
//   this.route.push(this.fb.control('', Validators.required));
//   this.routeName.push(this.fb.control('', Validators.required));
// }

// removeRoute(index: number) {
//   this.route.removeAt(index);
//   this.routeName.removeAt(index);
// }
onVehicleMasterSave() {
   this.isSubmitted = true;
 if (this.addUpdateVehcleForm.invalid) {
    this.addUpdateVehcleForm.markAllAsTouched(); // 🔥 force validation UI
    this.swal.alert.oops('Please fill all required fields');
    return;
  }
 const features = {
  vehicle:this.f.amenities.value.map(v => v.amenties),
  driver: [],
  services: []
};
  const formData = new FormData();
    formData.append('features', JSON.stringify(features));
  formData.append('vehicle_id', this.f.vehicle_type.value);
  formData.append('vehicle_type', this.f.vehicle_type.value);
  formData.append('trip_type', this.f.trip_type.value);
    formData.append('vehicle_reg_no', this.f.vehicle_reg_no.value);
  formData.append('driver_id', this.f.driver_id.value);
  formData.append('vehicle_name', this.f.vehicle_name.value);
  formData.append('ac_vehicle', this.f.ac_vehicle.value);
  formData.append('max_capacity', this.f.max_capacity.value);
  formData.append('ratings', this.f.ratings.value);
  formData.append('duration_hours', String(this.f.duration_hours.value));
  formData.append('duration_minutes', String(this.f.duration_minutes.value));
  formData.append('status', 'true');
  formData.append('country', this.f.country.value.name);
  formData.append('city', this.f.city.value);
  formData.append('combustion_type', this.f.combustion_type.value);
  formData.append('cancellation_rule', this.f.cancellation_rule.value);
  formData.append('luggage_allowances', this.f.luggage_allowances.value || '');
  formData.append('created_by_id', String(this.loggedInUserId));

  // only append image if file is selected
  if (this.imageFile) {
    formData.append('image', this.imageFile);
  }

  // Call API
  this.api.apiHandler('addVehicleMaster', 'POST', {}, {}, formData)
    .subscribe(res => {
      if (res.Status) {
        this.getVehicleMasterList();
        this.onCancel();
        this.swal.alert.success(res.Message);
      }
    });
}

  getAminities() {
    this.api.apiHandler('listCarAmenities', 'post', {}, {})
      .subscribe((resp: any) => {
        if (resp.Status && resp.data) {
          this.carAmenityList = resp.data;
        }
      });
  }
upateVehicleMaster() {
   let features = {
  vehicle:this.f.amenities.value.map(v => v.amenties),
  driver: [],
  services: []
};
  const formData = new FormData();
  formData.append('vehicle_id', this.f.vehicle_type.value);
  formData.append('vehicle_type', this.f.vehicle_type.value);
  formData.append('trip_type', this.f.trip_type.value);
  formData.append('vehicle_reg_no', this.f.vehicle_reg_no.value);
  formData.append('driver_id', this.f.driver_id.value);
  formData.append('vehicle_name', this.f.vehicle_name.value);
  formData.append('ac_vehicle', this.f.ac_vehicle.value);
  formData.append('max_capacity', this.f.max_capacity.value);
  formData.append('ratings', this.f.ratings.value);
  formData.append('duration_hours', String(this.f.duration_hours.value));
  formData.append('duration_minutes', String(this.f.duration_minutes.value));
  formData.append('status', this.f.status.value);
  formData.append('country', this.f.country.value.name);
    formData.append('features', JSON.stringify(features));
  formData.append('city', this.f.city.value);
    formData.append('cancellation_rule', this.f.cancellation_rule.value);
     formData.append('combustion_type', this.f.combustion_type.value);
  formData.append('luggage_allowances', this.f.luggage_allowances.value || '');
  formData.append('created_by_id', String(this.loggedInUserId));
  formData.append('id', String(this.id));

  if (this.imageFile) {
    formData.append('image', this.imageFile);
  }

  this.api.apiHandler('editVehicleMaster', 'POST', {}, {}, formData)
    .subscribe(() => {
      this.getVehicleMasterList();
      this.onCancel();
      this.swal.alert.success('Updated Successfully');
    });
}

onEditVehicleType(v: any) {
  this.saveTextName = 'Update';
  this.id = v.id;

  this.isEditMode = true;
  this.isEditTrigger = true; // ✅ IMPORTANT

  this.selectedCityForEdit = v.city_id; // ✅ use city_id

  this.vehicleImage = this.getImage(v.image);

  const selectedCountry = this.countryList.find(
    c => c.name === v.country_name
  );

  this.addUpdateVehcleForm.reset();
let features: any = { vehicle: [] };

if (v.amenities) {

    features = JSON.parse(v.amenities)
  
}
console.log(features.vehicle,"features.vehicle",this.carAmenityList)
// ✅ Map safely
const selectedAmenities = this.carAmenityList.filter(a =>
  features.vehicle.includes(a.amenties)
);
  this.addUpdateVehcleForm.patchValue({
    trip_type: v.trip_type,
    vehicle_reg_no: v.vehicle_reg_no,
    vehicle_type: v.vehicle_type,
    vehicle_name: v.vehicle_name,
    ac_vehicle: v.ac_vehicle,
    max_capacity: v.max_capacity,
    driver_id: v.driver_id,
    ratings: v.ratings,
    luggage_allowances: v.luggage_allowances,
    country: selectedCountry || null, // 👈 triggers valueChanges
    cancellation_rule: v.cancellation_rule,
    combustion_type: v.combustion_type,
    duration_hours: v.duration_hours,
    duration_minutes: v.duration_minutes,
    status: v.status === 1 || v.status === true,
    amenities: selectedAmenities
  });

  // ❌ REMOVE THIS COMPLETELY
  /*
  this.getCityListByCountry(selectedCountry, '', v.city_id);
  */

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
  onDeletedRecord(id) {
    this.swal.alert.delete(ok => {
      if (ok) {
        this.api.apiHandler('deleteVehicleMasters', 'POST', {}, {}, { id })
          .subscribe(() => {
            this.getVehicleMasterList();
            this.swal.alert.success('Deleted successfully');
          });
      }
    });
  }


   onStatusChange(event: MatSlideToggleChange, id: number) {
    const payload = {
      id,
      status: event.checked ? true : false
    };

    this.api
      .apiHandler('updateVehicle', 'POST', {}, {}, payload)
      .subscribe(() => {
        this.getVehicleMasterList();
      });
  }

              // <-- for preview

onFileSelected(event: any) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  const allowedTypes = ['image/jpeg', 'image/png'];

  // ❌ Type validation
  if (!allowedTypes.includes(file.type)) {
    this.swal.alert.oops('Only JPEG and PNG images are allowed');
    input.value = '';
    this.imageFile = null;
    this.vehicleImage = null;
    return;
  }

  // ❌ Size validation (200 KB)
  if (file.size > 200 * 1024) {
    this.swal.alert.oops('Maximum file size allowed is 200 KB');
    input.value = '';
    this.imageFile = null;
    this.vehicleImage = null;
    return;
  }

  // ✅ Valid file
  this.imageFile = file;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.vehicleImage = e.target.result; // preview
  };
  reader.readAsDataURL(file);
}

  uploadImage(id) {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('image', this.imageFile);
    // this.api.apiHandler('addTransferImage', 'POST', {}, {}, fd).subscribe();
  }

  onCancel() {
    this.addUpdateVehcleForm.reset({ ride_type: 'private', country: 'India' });
    this.saveTextName = 'Save';
    this.vehicleImage = '';
  }

  getVehicleTypeList() {
    this.api.apiHandler('getVehicleType', 'POST', {}, {}, { created_by_id: '1' })
      .subscribe(res => this.vehiclesType = res.data || []);
  }

getVehicleMasterList() {
  this.searchSpin = true;

  this.api.apiHandler('listVehicleMaster', 'POST', {}, {}, {})
    .subscribe(
      (res: any) => {
        if (res.Status && Array.isArray(res.data)) {
          this.vehicleMasterDataList = res.data.map(item => ({
            ...item
           
          }));
        } else {
          this.vehicleMasterDataList = [];
        }

        this.collectionSize = this.vehicleMasterDataList.length;
        this.searchSpin = false;
      },
      () => {
        this.vehicleMasterDataList = [];
        this.collectionSize = 0;
        this.searchSpin = false;
      }
    );
}


  getImage(img) {
    return `${img}`;
  }
@ViewChild('citySelect', { static: false }) citySelect: MatSelect;

private searchSubject = new Subject<string>();
citySearchText = '';

citySkip = 1;
cityLimit = 20;
hasMoreCities = true;
isEditTrigger = false;
isEditMode = false;
selectedCityForEdit: number | null = null;
  ngAfterViewInit() {
  // this.citySelect.openedChange
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe(open => {
  //     if (open) {
  //       setTimeout(() => {
  //         const panel = document.querySelector('.city-panel .mat-select-panel');

  //         if (panel) {
  //           panel.addEventListener('scroll', this.onCityScroll.bind(this));
  //         }
  //       });
  //     }
  //   });
}

onCityScroll(event: any) {
  const panel = event.target;

  const atBottom =
    panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 10;

  if (atBottom && this.hasMoreCities && !this.loadingCities) {
    this.citySkip += 1;
    this.getCityListByCountry(this.currentCountry, this.citySearchText);
  }
}

onCityScrollBind: any;

onCityDropdownOpen(open: boolean) {
  if (open) {
    setTimeout(() => {
      const panel = this.citySelect.panel.nativeElement;

      if (panel) {
        panel.removeEventListener('scroll', this.onCityScrollBind);

        this.onCityScrollBind = this.onCityScroll.bind(this);
        panel.addEventListener('scroll', this.onCityScrollBind);
      }
    });
  }
}
}
