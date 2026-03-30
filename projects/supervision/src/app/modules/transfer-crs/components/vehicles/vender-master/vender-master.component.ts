import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ViewChild, AfterViewInit } from '@angular/core';

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
   @ViewChild('citySelect', { static: false }) citySelect: MatSelect;
   public addUpdateVendorForm: FormGroup;
   isEditMode = false;
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
      name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      phone_code: ['91', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
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

selectedCityForEdit: string | null = null;
isEditTrigger = false;
setupCountryChangeListener() {
  this.addUpdateVendorForm.get('country').valueChanges
    .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
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

        // ✅ reset AFTER passing value
        this.isEditTrigger = false;
      } else {
        this.cityList = [];
      }
    });
}

getCityListByCountry(
  country: Country,
  search: string = '',
  selectedCity?: any
) {
  if (!country) return;
console.log(selectedCity,"selectedCityselectedCity")
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
      // limit: this.cityLimit,
      // type:'limit',
      search: search,
      cityId:selectedCity
    }
  ).subscribe((resp: any) => {

    this.loadingCities = false;

    if (resp.Status && resp.data) {

      if (this.citySkip === 1) {
        this.cityList = resp.data;
      } else {
        this.cityList = [...this.cityList, ...resp.data];
      }

      // ✅ check more data
      if (resp.data.length < this.cityLimit) {
        this.hasMoreCities = false;
      }

      // ✅ AUTO SELECT CITY (edit case)
    if (selectedCity) {
  setTimeout(() => {
    const found = this.cityList.find(c => c.id == selectedCity);

    if (found) {
      this.addUpdateVendorForm.get('city').setValue(found.id);
        // ✅ RESET HERE (after successful set)
      this.isEditMode = false;
      this.selectedCityForEdit = null;
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
  this.isEditMode = true;
  this.isEditTrigger = true; // 🔥 important

  this.id = data.id;

  this.saveTextName = 'Update';
  this.enabledForm = true;

  this.addUpdateVendorForm.reset();

  const selectedCountry = this.countryList.find(
    c => c.name === data.country
  );

  // store city id
  this.selectedCityForEdit = data.city_id;

  // ✅ this will trigger valueChanges
  this.addUpdateVendorForm.patchValue({
    name: data.name,
    phone_code: data.phone_code,
    mobile: data.mobile,
    email: data.email,
    country: selectedCountry,
    address: data.address,
    status: data.status === 1
  });
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

        // ✅ Set India as default
        const india = this.countryList.find(c => 
          c.name.toLowerCase() === 'india'
        );

        if (india) {
          this.addUpdateVendorForm.patchValue({
            country: india
          });

          // Optional: load cities for India automatically
          this.getCityListByCountry(india);
        }
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


private searchSubject = new Subject<string>();
citySearchText = '';
ngAfterViewInit() {
  this.citySelect.openedChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(open => {
      if (open) {
        setTimeout(() => {
          const panel = document.querySelector('.city-panel .mat-select-panel');

          if (panel) {
            panel.addEventListener('scroll', this.onCityScroll.bind(this));
          }
        });
      }
    });
}

citySkip = 1;
cityLimit = 20;
hasMoreCities = true;

onCityScroll(event: any) {
  const panel = event.target;

  const atBottom =
    panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 10;

  if (atBottom && this.hasMoreCities && !this.loadingCities) {
    this.citySkip += 1; // OR += this.cityLimit (depends on API)
    
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

      console.log(panel, 'panel');

      if (panel) {
        panel.addEventListener('scroll', this.onCityScroll.bind(this));
      }
    });
  }
}
}