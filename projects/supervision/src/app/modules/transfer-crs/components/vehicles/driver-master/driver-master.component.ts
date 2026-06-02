import { Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const baseUrl = environment.SA_URL;
interface Country {
  id?: number;
  name: string;
  sortname?: string;
  phone_code?: string;
  // Add other properties if needed
}

interface City {
  id: number;
  city_name: string;
  country_id?: number;
  // Add other properties if needed
}

@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
  styleUrls: ['./driver-master.component.scss']
})
export class DriverMasterComponent implements OnInit, OnDestroy {
  
  isEditTrigger = false;
selectedCityForEdit: number | null = null;
  public addUpdateVendorForm: FormGroup;
  public editForm: boolean = false;
  public searchText: string;
  public enabledForm: boolean = true;
  public saveTextName: string = 'Save';
  public id: any;
  public noData: boolean = true;
  public respData: any[] = []; public vendorList: any[] = [];
  public driverList: any[] = [];
  public searchSpin: boolean = true;
  public loading: boolean = false;
  public primaryColour: string = '#1976d2';
  public secondaryColour: string = '#f44336';
  public loadingCities: boolean = false;
  displayColumn = [
    'Sl.No',
    'Status',
    'Name',

    'Age',
    'DL No',
    'Mobile',
    'Email',
    'Country',
    'City',
    'Vendor Id',
    'Image',
    'Action'
  ];

imagePreview: any | null = null;   // new selected image
existingImage: string | null = null;  // backend image
isEditMode = false;


  countryList: Country[] = [];
  cityList: City[] = [];
  private currentCountry: Country = null;
  private destroy$ = new Subject<void>();
@ViewChild('labelImport', { static: false })
labelImport!: ElementRef;
  public pageSize = 20;
  public page = 1;
  public collectionSize: number = 0;

  public loggedInUserId: any;
  isSubmitted = false;
carAmenityList:any;

  constructor(
    private fb: FormBuilder,
    private apiHandlerServices: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef
  ) { 
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getImage(img) {
    let url = 'http://tourbro.com/node/dist/apps/supervision/'
    return `${ img}`;
  }




  ngOnInit(): void {

    const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
    if (currentSupervisionUser) {
      const user = JSON.parse(currentSupervisionUser);
      this.loggedInUserId = user['id'];
    }

    this.createForm();
    
    this.getVendorList()
    this.getDriverList();
    this.getCountryList();
    this.getPhoneList();
    this.setupCountryChangeListener();
this.searchSubject.pipe(

  distinctUntilChanged()
).subscribe(search => {

  // ✅ BLOCK during edit (prevents 2nd API call)
  if (this.isEditTrigger) return;

  this.citySkip = 1;
  this.hasMoreCities = true;
  this.cityList = [];
  this.citySearchText = search;

  this.getCityListByCountry(
    this.currentCountry,
    search
  );
});
  }

onCityScroll(event: any) {

  if (this.isCityLoadingForEdit) return; // ✅ IMPORTANT

  const panel = event.target;

  const atBottom =
    panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 10;

  if (atBottom && this.hasMoreCities && !this.loadingCities) {
    this.citySkip += 1;

    this.getCityListByCountry(
      this.currentCountry,
      this.citySearchText
    );
  }
}
onCityDropdownOpen(open: boolean) {
  if (open) {
    setTimeout(() => {
      const panel = this.citySelect.panel.nativeElement;

      if (panel) {
        panel.addEventListener('scroll', this.onCityScroll.bind(this));
      }
    });
  }
}
  getVendorList() {

    this.apiHandlerServices
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
  // Compare function for country objects
  compareCountries(c1: Country, c2: Country): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  // Compare function for city objects
  compareCities(c1: City, c2: City): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  createForm() {
    this.addUpdateVendorForm = this.fb.group({
      image: [null, Validators.required],
      amenities: [null],
      vendor_id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_code: ['91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(18)]],
      dl_no: [
  '',
  [
    Validators.required,
    Validators.pattern('^[A-Za-z0-9-]+$'),
    Validators.maxLength(25)
  ]
],
      country: [null, Validators.required],
      city: ['', Validators.required],

    });

    // Mark all controls as untouched initially
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
      }
    });
  }
  
onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  const allowedTypes = ['image/jpeg', 'image/png'];

  // ❌ Type validation
  if (!allowedTypes.includes(file.type)) {
    this.swalService.alert.oops('Only JPEG and PNG images are allowed');
    input.value = '';
    this.imagePreview = null;
    this.addUpdateVendorForm.get('image').setErrors({ invalidType: true });
    return;
  }

  // ❌ Size validation (200 KB)
  if (file.size > 200 * 1024) {
    this.swalService.alert.oops('Maximum file size allowed is 200 KB');
    input.value = '';
    this.imagePreview = null;
    this.addUpdateVendorForm.get('image').setErrors({ maxSize: true });
    return;
  }

  // ✅ Valid file
  this.addUpdateVendorForm.get('image').setValue(file);
  this.addUpdateVendorForm.get('image').updateValueAndValidity();

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    this.cdr.detectChanges();
  };
  reader.readAsDataURL(file);
}


isCityLoadingForEdit = false;
setupCountryChangeListener() {
  this.addUpdateVendorForm.get('country').valueChanges
    .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
    .subscribe((country: Country) => {

      this.currentCountry = country;

      this.citySkip = 1;
      this.cityList = [];
      this.hasMoreCities = true;

      if (!country) return;

      // ✅ STOP duplicate call during edit
      if (this.isCityLoadingForEdit) return;

      const cityIdToSend = this.isEditTrigger
        ? this.selectedCityForEdit
        : null;

      this.getCityListByCountry(country, '', cityIdToSend);
    });
}
onCitySearch(value: string) {
  this.searchSubject.next(value);
}
getCityListByCountry(
  country: Country,
  search: string = '',
  selectedCity?: any
) {
  if (!country) return;

  this.loadingCities = true;

  const countryParam = country.sortname || country.name;

  this.apiHandlerServices.apiHandler(
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

      // ✅ AUTO SELECT (ONLY ONCE)
    if (selectedCity) {
  setTimeout(() => {
    const found = this.cityList.find(c => c.id == selectedCity);
    if (found) {
      this.addUpdateVendorForm.get('city').setValue(found.id);

      // ✅ RESET FLAGS AFTER SUCCESS
      this.selectedCityForEdit = null;
      this.isEditTrigger = false;
      this.isCityLoadingForEdit = false;
    }
  });
}
    }
  });
}




  // Helper method to get country display name
  getCountryDisplay(country: Country): string {
    return country ? country.name : '';
  }




  onAddButtonClicked() {
    this.saveTextName = 'Save';
    this.addUpdateVendorForm.reset({ status: 1 });

    // Reset validation states
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });

    this.enabledForm = true;
  }
  getBearerToken(): string | null {
  const userStr = localStorage.getItem('currentDomainUser');
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  return user.access_token || null;
}

  onSave() {
const token = this.getBearerToken();
    this.isSubmitted = true;
   
  // ✅ IMPORTANT
  this.addUpdateVendorForm.markAllAsTouched();

  if (this.addUpdateVendorForm.invalid) {
    this.swalService.alert.oops('Please fill all required fields');
    return;
  }

    const formValue = this.addUpdateVendorForm.value;
    const fd = new FormData();
    fd.append('image', formValue.image);
    fd.append('vendor_id', formValue.vendor_id);
    fd.append('name', formValue.name);
    fd.append('email', formValue.email);
    fd.append('phone_code', formValue.phone_code);
    fd.append('mobile', formValue.mobile);
    fd.append('age', formValue.age);
    fd.append('dl_no', formValue.dl_no);
    fd.append('country', formValue.country.name);
    fd.append('city', formValue.city);
    fd.append('status', '1');

    this.loading = true;
 {
      Authorization: `Bearer ${token}`
    }
    this.apiHandlerServices
      .apiHandler('addDriver', 'POST', {}, {}, fd)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.Status) {
            this.swalService.alert.success(res.Message);
            this.addUpdateVendorForm.reset({ status: 1 });
            this.getDriverList();
            this.isSubmitted = false;
             this.imagePreview = '';
 this.existingImage=null
          } else {
            this.swalService.alert.oops(res.Message);
          }
        },
error: (err) => {
  this.loading = false;

  const message =
    err.error.Message ||
    err.erro.message ||
    err.message ||
    'Something went wrong';

  this.swalService.alert.error(message);
}
      });
  }


  markAllFieldsAsTouched() {
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getDriverList() {
    this.searchSpin = true;

    this.apiHandlerServices
      .apiHandler('driverList', 'POST', {}, {}, {})
      .subscribe({
        next: (res: any) => {
          if (res.Status) {
            this.driverList = res.data || [];
            this.collectionSize = this.driverList.length;
          } else {
            this.driverList = [];
            this.collectionSize = 0;
          }
          this.searchSpin = false;
        },
        error: () => {
          this.driverList = [];
          this.collectionSize = 0;
          this.searchSpin = false;
        }
      });
  }
getVendorName(vendorId: any): string {
  if (!vendorId || !this.vendorList.length) {
    return '-';
  }

  const vendor = this.vendorList.find(v => v.id === vendorId);
  return vendor ? vendor.name : '-';
}

editDriver(driver: any) {
  this.saveTextName = 'Update';
  this.enabledForm = true;
  this.id = driver.id;

  // ✅ BLOCK extra triggers
  this.isCityLoadingForEdit = true;
  this.isEditTrigger = true;
  this.selectedCityForEdit = driver.city_id;

  // PATCH BASIC
  this.addUpdateVendorForm.patchValue({
    name: driver.name,
    age: driver.age,
    email: driver.email,
    mobile: driver.mobile,
    phone_code: driver.phone_code,
    dl_no: driver.dl_no,
    vendor_id: driver.vendor_id
  });

  const selectedCountry = this.countryList.find(
    c => c.name === driver.country
  );

  if (selectedCountry) {
    // ❌ DO NOT trigger valueChanges
    this.addUpdateVendorForm.get('country').setValue(selectedCountry, { emitEvent: false });

    this.currentCountry = selectedCountry;

    // ✅ MANUAL SINGLE API CALL
    this.citySkip = 1;
    this.cityList = [];

    this.getCityListByCountry(
      selectedCountry,
      '',
      driver.city_id
    );
  }

  this.existingImage = driver.dl_image;
}
  
  getPhoneList() {
    this.apiHandlerServices.apiHandler('phoneCodeList', 'post', {}, {})
      .subscribe((resp: any) => {
        if (resp.statusCode === 200 && resp.data) {
          this.respData = resp.data;
        }
      });
  }

getCountryList() {
  this.apiHandlerServices
    .apiHandler('supervisionCountryLists', 'post', {}, {})
    .subscribe((resp: any) => {
      if (resp.Status && resp.data) {
        this.countryList = resp.data;

        const india = this.countryList.find(
          c => c.name.toLowerCase() === 'india'
        );

        if (india) {
          this.addUpdateVendorForm.patchValue({
            country: india,
            phone_code: india.phone_code || '91' // ✅ ALSO SET HERE
          });

          this.currentCountry = india;

          this.citySkip = 1;
          this.cityList = [];
          this.hasMoreCities = true;

          this.getCityListByCountry(india);
        }
      }
    });
}
  onDelete(id: number) {
    this.swalService.alert.delete((action: boolean) => {
      if (!action) return;

      this.loading = true;

      this.apiHandlerServices
        .apiHandler('deleteDriver', 'POST', {}, {}, { id })
        .subscribe({
          next: (res: any) => {
            if (res.Status) {
              this.swalService.alert.success('Driver deleted successfully');
              this.getDriverList();
            } else {
              this.swalService.alert.oops(res.Message);
            }
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    });
  }


  onCancel() {
    this.saveTextName = 'Save';
    this.isSubmitted = false; // Reset the submission flag
    this.addUpdateVendorForm.reset({ status: true });

    // Reset validation states
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null); // Clear any validation errors
      }
    });
 this.imagePreview = '';
 this.existingImage=null
    // Clear any country selection to reset cities
    this.currentCountry = null;
    this.cityList = [];
  }

  update() {
    const formValue = this.addUpdateVendorForm.value;
    const fd = new FormData();


// If user selected new image, use it
if (formValue.image) {
  fd.append('image', formValue.image);
} else if (this.existingImage) {
  // No new file, send the existing image name or URL
  fd.append('existing_image', this.existingImage);
}

    fd.append('vendor_id', formValue.vendor_id);
    fd.append('name', formValue.name);
    fd.append('email', formValue.email);
    fd.append('phone_code', formValue.phone_code);
    fd.append('mobile', formValue.mobile);
    fd.append('age', formValue.age);
    fd.append('dl_no', formValue.dl_no);
    fd.append('country', formValue.country.name);
    fd.append('city', formValue.city);
    fd.append('id', this.id);
fd.append('status', 'true');
    this.apiHandlerServices
      .apiHandler('updateDriver', 'POST', {}, {}, fd)
      .subscribe((res) => {
        if (res.Status) {
            this.swalService.alert.success(res.Message);
            this.addUpdateVendorForm.reset({ status: 1 });
            this.getDriverList();
            this.isSubmitted = false;
              this.imagePreview = '';
 this.existingImage=null
          } else {
            this.swalService.alert.oops(res.Message);
          }
        //    this.swalService.alert.success(res.Message);
        //     this.addUpdateVendorForm.reset({ status: 1 });
        // this.getDriverList();
        // this.saveTextName = 'Save';
      });
  }



  onStatusChange(event: MatSlideToggleChange, id: number) {
    const payload = {
      id,
      status: event.checked ? 1 : 0
    };

    this.apiHandlerServices
      .apiHandler('editDriverStatus', 'POST', {}, {}, payload)
      .subscribe(() => {
        this.getDriverList();
      });
  }



  // Helper method to check if a field has error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.addUpdateVendorForm.get(controlName);
    if (control) {
      return control.hasError(errorType) && (control.touched || control.dirty);
    }
    return false;
  }

  @ViewChild('citySelect', { static: false }) citySelect: MatSelect;

private searchSubject = new Subject<string>();
citySearchText = '';

citySkip = 1;
cityLimit = 20;
hasMoreCities = true;
}