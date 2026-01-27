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
  selector: 'app-vender-master',
  templateUrl: './vender-master.component.html',
  styleUrls: ['./vender-master.component.scss']
})

export class VenderMasterComponent implements OnInit, OnDestroy {
   public addUpdateVendorForm: FormGroup;
  public editForm: boolean = false;
  public searchText: string;
  public enabledForm: boolean = true;
  public saveTextName: string = 'Save';
  public id: number;
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
    'Status',
    'Name',
    'Mobile',
    'Email',
    'Country',
    'City',
    'Address',
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

  ngOnInit(): void {

    const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
    if (currentSupervisionUser) {
      const user = JSON.parse(currentSupervisionUser);
      this.loggedInUserId = user['id'];
    }
    
    this.createForm();
    this.getVendorList();
    this.getCountryList();
    this.getPhoneList();
    
    this.setupCountryChangeListener();
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
      name: ['', [Validators.required]],
      phone_code: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      country: [null, [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      status: [1]
    });

    // Mark all controls as untouched initially
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) {
        control.markAsUntouched();
      }
    });
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

onVendorSave() {
  this.isSubmitted=true
  // Mark all fields as touched to trigger validation
  this.markAllFieldsAsTouched();
  
  if (!this.addUpdateVendorForm.valid) {
    this.swalService.alert.oops('Please fill all required fields correctly');
    return;
  }
  
  this.loading = true;
  
  const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
  let created_by_id = 1;
  
  if (currentSupervisionUser) {
    const user = JSON.parse(currentSupervisionUser);
    const loggedInAuthUser = user['auth_role_id'];
    if (loggedInAuthUser === 7) {
      created_by_id = user['id'];
    }
  }
  
  // Extract the form values
  const formValue = this.addUpdateVendorForm.value;
  
  // Extract country name from the country object
  const countryName = formValue.country ? 
    (formValue.country.country_name || formValue.country.name || '') : '';
  
  // Also extract country ID if available
  const countryId = formValue.country ? formValue.country.id || null : null;
  
  // Prepare payload with country as string name
  const payload = {
    name: formValue.name,
    phone_code: formValue.phone_code,
    mobile: formValue.mobile,
    email: formValue.email,
    country: countryName, // Send country as string name
    city: formValue.city,
    address: formValue.address,
    status: formValue.status ? 1 : 0,
    created_by_id: created_by_id
  };
  
  console.log('Saving payload:', payload); // For debugging
  
  this.apiHandlerServices.apiHandler('createVendorMaster', 'POST', {}, {}, payload).subscribe({
    next: (res: any) => {
      if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
        this.loading = false;
        this.isSubmitted=false
        this.addUpdateVendorForm.reset({ status: 1 });
        this.swalService.alert.success(res.Message);
        this.getVendorList();
      } else {
        this.loading = false;
            this.isSubmitted=false
        this.swalService.alert.oops(res.Message);
      }
    },
    error: (err: any) => {
      this.loading = false;
      const errorMessage = err.error && err.error.Message ? err.error.Message : 'An error occurred';
      this.swalService.alert.error(errorMessage);
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

  getVendorList() {
    this.searchSpin = true;

    this.apiHandlerServices
      .apiHandler('vendorList', 'POST', {}, {}, {})
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
const selectedCountry = this.countryList.find(
    c => c.name === data.country
  );

  if (selectedCountry) {
    this.addUpdateVendorForm.patchValue({
      country: selectedCountry
    });
 const countryParam = selectedCountry.sortname || selectedCountry.name;
    // 🚀 LOAD CITIES FIRST
   this.apiHandlerServices
  .apiHandler('supervisionCityLists', 'post', {}, {}, { country_code: countryParam })
  .subscribe((resp: any) => {
    if (resp.Status && resp.data) {
      this.cityList = resp.data;

      // Find the city object
      const selectedCity = this.cityList.find(
        c => c.city_name === data.city || c.id === data.city
      );

      if (selectedCity) {
        this.addUpdateVendorForm.patchValue({
          city: selectedCity.city_name // match your select [value]
        });
      }
    }
  });
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

  onDeleteVendor(id: number) {
    this.swalService.alert.delete((action: boolean) => {
      if (!action) return;

      this.loading = true;

      this.apiHandlerServices
        .apiHandler('deleteVendor', 'POST', {}, {}, { id })
        .subscribe({
          next: (res: any) => {
            if (res.Status) {
              this.swalService.alert.success('Vendor deleted successfully');
              this.getVendorList();
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

updateVendor() {
  this.isSubmitted=true
  // Mark all fields as touched to trigger validation
  this.markAllFieldsAsTouched();
  
  if (!this.addUpdateVendorForm.valid) {
    this.swalService.alert.oops('Please fill all required fields correctly');
    return;
  }
  
  this.loading = true;

  // Extract the form values
  const formValue = this.addUpdateVendorForm.value;
  
  // Extract country name from the country object
  const countryName = formValue.country ? 
    (formValue.country.country_name || formValue.country.name || '') : '';
  
  // Also extract country ID if available
  const countryId = formValue.country ? formValue.country.id || null : null;

  const payload = {
    name: formValue.name,
    phone_code: formValue.phone_code,
    mobile: formValue.mobile,
    email: formValue.email,
    country: countryName, // Send country as string name
    city: formValue.city,
    address: formValue.address,
    status: formValue.status ? 1 : 0,
    id: this.id
  };

  console.log('Update payload:', payload); // For debugging

  this.apiHandlerServices
    .apiHandler('updateVendor', 'POST', {}, {}, payload)
    .subscribe({
      next: (res: any) => {
        if (res.Status) {
          this.swalService.alert.success(res.Message);
          this.getVendorList();
          this.addUpdateVendorForm.reset({ status: 1 });
          this.saveTextName = 'Save';
          
          // Reset validation states
          Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
            const control = this.addUpdateVendorForm.get(key);
            if (control) {
              control.markAsUntouched();
            }
          });
          this.isSubmitted=false
        } else {
          this.swalService.alert.oops(res.Message);
          this.isSubmitted=false
        }
        this.loading = false;
      },
      error: () => {
        this.isSubmitted=false
        this.loading = false;
      }
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
        this.getVendorList();
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