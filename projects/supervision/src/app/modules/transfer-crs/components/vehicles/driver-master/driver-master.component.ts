import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSlideToggleChange } from '@angular/material';
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
  public addUpdateVendorForm: FormGroup;
  public editForm: boolean = false;
  public searchText: string;
  public enabledForm: boolean = true;
  public saveTextName: string = 'Save';
  public id: any;
  public noData: boolean = true;
  public respData: any[] = [];
  public vendorList: any[] = [];
  public searchSpin: boolean = true;
  public loading: boolean = false;
  public primaryColour: string = '#1976d2';
  public secondaryColour: string = '#f44336';
  public loadingCities: boolean = false;
  displayColumn = [
    'Sl.No',
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


  countryList: Country[] = [];
  cityList: City[] = [];
  private currentCountry: Country = null;
  private destroy$ = new Subject<void>();

  public pageSize = 20;
  public page = 1;
  public collectionSize: number = 0;

  public loggedInUserId: any;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private apiHandlerServices: ApiHandlerService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getImage(img) {
    let url = 'http://54.92.243.81/tourbro/node/dist/apps/supervision/'
    return `${url + img}`;
  }

  ngOnInit(): void {

    const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
    if (currentSupervisionUser) {
      const user = JSON.parse(currentSupervisionUser);
      this.loggedInUserId = user['id'];
    }

    this.createForm();
    this.getDriverList();
    this.getCountryList();
    this.getPhoneList();
    this.getVendorList()
    this.setupCountryChangeListener();
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

      vendor_id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_code: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(18)]],
      dl_no: ['', Validators.required],
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
  onImageChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.addUpdateVendorForm.patchValue({
        image: file
      });
    }
  }

  setupCountryChangeListener() {
    const countryControl = this.addUpdateVendorForm.get('country');
    if (countryControl) {
      countryControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((country: Country) => {
          console.log('Selected country:', country);

          if (country && country.name) {
            this.getCityListByCountry(country);
          } else {
            // Clear city list if no country selected
            this.cityList = [];
            const cityControl = this.addUpdateVendorForm.get('city');
            if (cityControl) {
              cityControl.setValue('');
            }
          }
        });
    }
  }

  getCityListByCountry(country: Country, selectedCity?: any) {
    if (this.currentCountry && country &&
      this.currentCountry.name === country.name) {
      return;
    }

    this.currentCountry = country;
    this.loadingCities = true;

    this.cityList = [];
    const cityControl = this.addUpdateVendorForm.get('city');
    if (cityControl) {
      cityControl.setValue('');
    }

    const countryParam = country.sortname || country.name;
    console.log(countryParam)
    this.apiHandlerServices
      .apiHandler('supervisionCityLists', 'post', {}, {}, { country_code: countryParam })
      .subscribe(
        (resp: any) => {
          this.loadingCities = false;

          if (resp.Status && resp.data) {
            this.cityList = resp.data;

            if (selectedCity && cityControl) {
              const cityExists = this.cityList.find(c =>
                c.id === selectedCity || c.city_name === selectedCity
              );

              if (cityExists) {
                if (cityExists.id !== undefined && cityExists.id !== null) {
                  cityControl.setValue(cityExists.id);
                } else {
                  cityControl.setValue(cityExists.city_name);
                }
              }
            }
          }
        },
        () => {
          this.loadingCities = false;
        }
      );
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
  onSave() {
    this.isSubmitted = true;
    this.markAllFieldsAsTouched();

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

    this.loading = true;

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
          } else {
            this.swalService.alert.oops(res.Message);
          }
        },
        error: () => (this.loading = false)
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
            this.vendorList = res.data || [];
            this.collectionSize = this.vendorList.length;
          } else {
            this.vendorList = [];
            this.collectionSize = 0;
          }
          this.searchSpin = false;
        },
        error: () => {
          this.vendorList = [];
          this.collectionSize = 0;
          this.searchSpin = false;
        }
      });
  }

  onEditVendor(data: any) {
    this.id = data.id;
    this.saveTextName = 'Update';
    this.enabledForm = true;

    // Reset form and validation states first
    this.addUpdateVendorForm.reset();

    // Mark all controls as untouched to hide validation errors
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
      }
    });

    // Find the country object from countryList
    let countryObj: Country = null;
    if (data.country_name || data.country) {
      // Find the country object by name
      countryObj = this.countryList.find(c =>
        c.name === data.country_name || c.name === data.country
      );

      // If not found by name, try to find by id
      if (!countryObj && data.country_id) {
        countryObj = this.countryList.find(c => c.id === data.country_id);
      }
    }
    this.id = data.id
    // Patch values - use the country object, not string
    this.addUpdateVendorForm.patchValue({
      name: data.name,
      phone_code: data.phone_code,
      mobile: data.mobile,
      email: data.email,
      country: countryObj, // This should be the country object
      // city: data.city_id || data.city, // Use city_id or city
      address: data.address,

      status: data.status === 1
    });

    // Get cities for the selected country
    if (countryObj) {
      this.getCityListByCountry(countryObj, data.city_id || data.city);
    }

    window.scroll({ top: 0, behavior: 'smooth' });
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
    this.apiHandlerServices.apiHandler('supervisionCountryLists', 'post', {}, {})
      .subscribe((resp: any) => {
        if (resp.Status && resp.data) {
          this.countryList = resp.data;
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
    this.addUpdateVendorForm.reset({ status: 1 });

    // Reset validation states
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null); // Clear any validation errors
      }
    });

    // Clear any country selection to reset cities
    this.currentCountry = null;
    this.cityList = [];
  }

  update() {
    const formValue = this.addUpdateVendorForm.value;
    const fd = new FormData();

    if (formValue.image) {
      fd.append('image', formValue.image);
    }

    fd.append('vendor_id', formValue.vendor_id);
    fd.append('name', formValue.name);
    fd.append('email', formValue.email);
    fd.append('phone_code', formValue.phone_code);
    fd.append('mobile', formValue.mobile);
    fd.append('age', formValue.age);
    fd.append('dl_no', formValue.dl_no);
    fd.append('country', formValue.country);
    fd.append('city', formValue.city);
    fd.append('id', this.id);

    this.apiHandlerServices
      .apiHandler('updateDriver', 'POST', {}, {}, fd)
      .subscribe(() => {
        this.getDriverList();
        this.saveTextName = 'Save';
      });
  }



  onStatusChange(event: MatSlideToggleChange, id: number) {
    const payload = {
      id,
      status: event.checked ? 1 : 0
    };

    this.apiHandlerServices
      .apiHandler('updateVendor', 'POST', {}, {}, payload)
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
}