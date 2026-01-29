import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSlideToggleChange, Sort } from '@angular/material';
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
 countryList: Country[] = [];
  cityList: City[] = [];
  currentCountry: Country = null;
displayColumn = [
  'Sl.No',
  'Vehicle Name',
  'Vehicle Type',
  'Capacity',
  'Ride Type',
  'Category',
  'Image',
  'Action'
];

page = 1;
pageSize = 20;
collectionSize: number;
  vehiclesType: any[] = [];
  vehicleMasterDataList: any[] = [];

  private destroy$ = new Subject<void>();
  seatCapacity = Array.from({ length: 71 }, (_, i) => i + 1);
  acType = [{ key: 'Yes' }, { key: 'No' }];
  rideType = [{ key: 'private', value: 'private' }];
  ratingList = [
    { key: 'Standard' },
    { key: 'Premium' },
    { key: 'Luxury' }
  ];

  vehicleImage: any;
  imageFile: File;
  loggedInUserId: number;
vendorList:any=[]
  constructor(
    private fb: FormBuilder,
    private api: ApiHandlerService,
    private swal: SwalService
  ) {}

  ngOnInit() {
    this.loggedInUserId = JSON.parse(sessionStorage.getItem('currentSupervisionUser')).id;
        this.createForm();
      this.getCountryList();
    this.setupCountryChangeListener();
this.getVendorList()
    this.getVehicleTypeList();
    this.getVehicleMasterList();
  }
    getVendorList() {
    this.searchSpin = true;

    this.api
      .apiHandler('vendorList', 'POST', {}, {}, {})
      .subscribe({
        next: (res: any) => {
          if (res.Status) {
            this.vendorList = res.data || [];
          } else {
            this.vendorList = [];
          }
        },
        error: () => {
          this.vendorList = [];
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
        .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((country: Country) => {
          if (country) this.getCityListByCountry(country);
          else this.cityList = [];
        });
    }
  }

  getCountryList() {
    this.api.apiHandler('supervisionCountryLists', 'post', {}, {})
      .subscribe((resp: any) => { if (resp.Status) this.countryList = resp.data; });
  }

  getCityListByCountry(country: Country) {
    this.currentCountry = country;
    const countryParam = country.sortname || country.name;
    this.api.apiHandler('supervisionCityLists', 'post', {}, {}, { country_code: countryParam })
      .subscribe((resp: any) => { if (resp.Status) this.cityList = resp.data; });
  }
  get f() { return this.addUpdateVehcleForm.controls; }

  createForm() {
    this.addUpdateVehcleForm = this.fb.group({
      trip_type: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      vehicle_name: ['', Validators.required],
      ac_vehicle: ['', Validators.required],
      max_capacity: ['', Validators.required],
      vendor_id: ['', Validators.required],
      ratings: ['', Validators.required],
      luggage_allowances: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      // cordinates: ['', Validators.required],
      duration_hours: ['', Validators.required],
      duration_minutes: ['', Validators.required],
     
      image: [''],
      status: [true],
      

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
  if (this.addUpdateVehcleForm.invalid) {
    this.swal.alert.oops('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('vehicle_id', this.f.vehicle_type.value);
  formData.append('vehicle_type', this.f.vehicle_type.value);
  formData.append('trip_type', '1');
  formData.append('vendor_id', this.f.vendor_id.value);
  formData.append('vehicle_name', this.f.vehicle_name.value);
  formData.append('ac_vehicle', this.f.ac_vehicle.value);
  formData.append('max_capacity', this.f.max_capacity.value);
  formData.append('ratings', this.f.ratings.value);
  formData.append('duration_hours', String(this.f.duration_hours.value));
  formData.append('duration_minutes', String(this.f.duration_minutes.value));
  formData.append('status', 'true');
  formData.append('country', this.f.country.value.name);
  formData.append('city', this.f.city.value);
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


upateVehicleMaster() {
  const formData = new FormData();
  formData.append('vehicle_id', this.f.vehicle_type.value);
  formData.append('vehicle_type', this.f.vehicle_type.value);
  formData.append('trip_type', '1');
  formData.append('vendor_id', this.f.vendor_id.value);
  formData.append('vehicle_name', this.f.vehicle_name.value);
  formData.append('ac_vehicle', this.f.ac_vehicle.value);
  formData.append('max_capacity', this.f.max_capacity.value);
  formData.append('ratings', this.f.ratings.value);
  formData.append('duration_hours', String(this.f.duration_hours.value));
  formData.append('duration_minutes', String(this.f.duration_minutes.value));
  formData.append('status', 'true');
  formData.append('country', this.f.country.value.name);
  formData.append('city', this.f.city.value);
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

  // set image preview (URL string)
  this.vehicleImage = this.getImage(v.image);

  // 🔹 find country object by name or id
  const selectedCountry = this.countryList.find(
    c => c.name === v.country_name 
  );

  // patch form (NO direct patch of country string)
  this.addUpdateVehcleForm.patchValue({
    trip_type: v.trip_type,
    vehicle_type: v.vehicle_type,
    vehicle_name: v.vehicle_name,
    ac_vehicle: v.ac_vehicle,
    max_capacity: v.max_capacity,
    vendor_id: v.vendor_id,
    ratings: v.ratings,
    luggage_allowances: v.luggage_allowances,
    country: selectedCountry || null,
    city: v.city,
    // cordinates: v.cordinates,
    duration_hours: v.duration_hours,
    duration_minutes: v.duration_minutes,
    status: v.status
  });

  // 🔹 load cities AFTER country patch
  if (selectedCountry) {
    this.getCityListByCountry(selectedCountry);
  }

  // 🔹 patch routes
  // this.route.clear();
  // this.routeName.clear();

  // if (v.route.length) {
  //   v.route.forEach((r: string, i: number) => {
  //     this.route.push(this.fb.control(r, Validators.required));
  //     this.routeName.push(
  //       this.fb.control(v.route_name[i], Validators.required)
  //     );
  //   });
  // }

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

  onStatusChange(e: MatSlideToggleChange, id) {
    this.api.apiHandler('updateVehicleMasterStatus', 'POST', {}, {}, {
      id,
      status: e.checked
    }).subscribe();
  }
              // <-- for preview

onFileSelected(event: any) {
  const file = event.target.files[0]; // get the first selected file
  if (file) {
    this.imageFile = file;           // ✅ store for FormData
    const reader = new FileReader(); 
    reader.onload = (e: any) => {
      this.vehicleImage = e.target.result; // ✅ for preview
    };
    reader.readAsDataURL(file);
  }
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

  
}
