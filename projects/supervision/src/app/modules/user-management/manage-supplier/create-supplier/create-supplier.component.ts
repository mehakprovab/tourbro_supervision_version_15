import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../user-management.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent implements OnInit {

 
  private subSunk = new SubSink();
  @Output() b2cUserUpdate = new EventEmitter<any>();
  @Input() propertyId:any;
registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  // Data arrays
  userTitleList: any[] = [];
  registerCountries: any[] = [];
  registerCities: any[] = [];
  registerStates: any[] = [];
  filteredStates: any[] = [];
  filteredCities: any[] = [];
  private stateRequestId = 0;
  private cityRequestId = 0;
  
  // Available services
  availableServices = [
    { label: 'Stays', value: 'stays' },
    { label: 'Yatra Packages', value: 'yatra-packages' },
    { label: 'Experiences', value: 'experiences' },
    { label: 'Cabs', value: 'cabs' },
    { label: 'Bus', value: 'bus' },
    { label: 'Travel & Heli Services', value: 'travel-heli' },
     { label: 'Wellness Retreat', value: 'wellness-retreat' },
  ];
  
  selectedServices: string[] = [];
  private supplierId: any;
  private supplierUserId: any;
  
  // File variables
  panDocument: File | null = null;
  panDocumentName: string = '';
  aadhaarDocument: File | null = null;
  aadhaarDocumentName: string = '';
  licenseDocument: File | null = null;
  licenseDocumentName: string = '';


addOrUpdate: 'add' | 'update' = 'add';
  constructor(
      private userManagementService: UserManagementService,
    private swalService: SwalService,
    private utility: UtilityService,
     private fb: FormBuilder,
        private router: Router,
        private apiHandlerServices: ApiHandlerService,
       
  ) {}

  ngOnInit() {
    this.createForm();
    this.getToUpdate();
   this.loadCountries();
    this.getTitleList();
  }

  resetSupplierForm(clearEditData: boolean = false) {
    this.addOrUpdate = 'add';
    this.submitted = false;
    this.loading = false;
    this.panDocument = null;
    this.panDocumentName = '';
    this.aadhaarDocument = null;
    this.aadhaarDocumentName = '';
    this.licenseDocument = null;
    this.licenseDocumentName = '';
    this.supplierId = null;
    this.supplierUserId = null;
    this.registerStates = [];
    this.filteredStates = [];
    this.registerCities = [];
    this.filteredCities = [];

    if (this.registerForm) {
      this.registerForm.reset({
        id: '',
        title: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        registered_legal_name: '',
        trade_name: '',
        chain_name: '',
        company_website: '',
        services: [],
        registration_number: '',
        country_of_registration: '',
        pan_number: '',
        aadhaar_number: '',
        license_number: '',
        office_phone: '',
        alt_company_email: '',
        address_line1: '',
        address_line2: '',
        country: '',
        state: '',
        city: '',
        zip_code: '',
        accounting_email: '',
        accounting_phone: '',
        bank_name: '',
        branch_address: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
      });
      this.registerForm.markAsPristine();
      this.registerForm.markAsUntouched();
    }

    if (clearEditData) {
      this.userManagementService.supplierUpdateData.next({});
    }
  }

      getTitleList() {
        this.apiHandlerServices.apiHandler('userTitleList', 'POST', '', '', {})
            .subscribe(
                resp => {
                    if (resp.statusCode === 200 || resp.statusCode === 201) {

                        const titleList = resp.data || [];
                        const adultTitles = titleList.filter(item => !item.paxType || item.paxType === 'ADULT');
                        this.userTitleList = adultTitles.map(item => ({
                            id: item.id,
                            title: item.title || item.name || ''
                        }));
                    } else {
                        this.swalService.alert.oops();
                    }
                },
                (err: HttpErrorResponse) => {
                    console.error(err);
                    this.swalService.alert.oops();
                }
            );
    }
 filterCities(searchTerm: string): void {
    const stateId = this.registerForm.controls['state'].value;
    if (stateId) {
        this.filteredCities = this.registerCities.filter(
            (city) => (city.state_id == stateId || city.stateId == stateId) && 
            (city.cityName || city.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}
  // Selected services from previous page (read-only)
  selectedServicesFromQuery: any[] = [];
    // Get selected services from query params
 // Get selected services from query params
  

  createForm() {
    this.registerForm = this.fb.group({
      // Section 1
       id: [''],
      title: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      
      // Section 2
      registered_legal_name: ['', Validators.required],
      trade_name: ['', Validators.required],
      chain_name: [''],
      company_website: [''],
        services: [[], Validators.required], // ✅ ADD THIS
      registration_number: ['', Validators.required],
      country_of_registration: ['', Validators.required],
      pan_number: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      aadhaar_number: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      license_number: [''],
      office_phone: ['', Validators.required],
      alt_company_email: ['', [Validators.required, Validators.email]],
      
      // Section 3
      address_line1: ['', Validators.required],
      address_line2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zip_code: ['', Validators.required],
      
      // Section 4
      accounting_email: ['', [Validators.required, Validators.email]],
      accounting_phone: ['', Validators.required],
      bank_name: [''],
      branch_address: [''],
      account_holder_name: [''],
      account_number: [''],
      ifsc_code: [''],
      
    });
  }

loadCountries() {
    const req = {};
    this.apiHandlerServices.apiHandler('getMasterCountryList', 'POST', {}, {}, req).subscribe({
        next: (res) => {
            if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                this.registerCountries = res.data.data.countries;
                
            }
        },
        error: (err) => {
            console.error(err);
        }
    });
}
trackByState(index: number, item: any) {
  return item.id;
}
trackByCity(index: number, item: any) {
  return item.id || item.cityName || item.name || index;
}
loadStates(countryId:any) {
  const requestId = ++this.stateRequestId;
  this.apiHandlerServices.apiHandler('getMasterState', 'POST', {}, {}, { country_id: Number(countryId) })
    .subscribe({
      next: (res) => {
        if (requestId !== this.stateRequestId) {
          return;
        }
        if (res.Status && (res.statusCode === 200 || res.statusCode === 201)) {
          this.registerStates = res.data.data;

          // ✅ ADD THIS LINE
          this.filteredStates = [...this.registerStates];
        }
      },
      error: (err) => {
        if (requestId !== this.stateRequestId) {
          return;
        }
        this.registerStates = [];
        this.filteredStates = [];
        console.error(err);
      }
    });
}


loadCitiesByCountry(countryId: string) {
    const requestId = ++this.cityRequestId;
    const req = { id: Number(countryId) };
    this.apiHandlerServices.apiHandler('getMasterCityList', 'POST', {}, {}, req).subscribe({
        next: (res) => {
            if (requestId !== this.cityRequestId) {
                return;
            }
            if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                this.registerCities = res.data.data || [];
            }
        },
        error: (err) => {
            if (requestId !== this.cityRequestId) {
                return;
            }
            this.registerCities = [];
            this.filteredCities = [];
            console.error(err);
        }
    });
}
onCountryChange(event: Event): void {
    const countryId = (event.target as HTMLSelectElement).value;
    console.log(countryId,"countryId")
    // Filter states by country
    // this.filteredStates = this.registerStates.filter(
    //     (state) => state.country_id == countryId || state.countryId == countryId
    // );
    
    // Load cities by country
    this.registerForm.controls['state'].setValue('');
    this.registerForm.controls['city'].setValue('');
    this.registerStates = [];
    this.filteredStates = [];
    this.registerCities = [];
    this.filteredCities = [];

    if (countryId) {
      this.loadStates(countryId)
        this.loadCitiesByCountry(countryId);
    }
}

onStateChange(event: Event): void {
    const stateId = (event.target as HTMLSelectElement).value;
    this.filteredCities = this.registerCities.filter(
        (city) => city.state_id == stateId || city.stateId == stateId
    );
    this.registerForm.controls['city'].setValue('');
}
 

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.swalService.alert.oops('Error', 'File size should be less than 5MB', 'error');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.swalService.alert.oops('Error', 'Only PDF, JPEG, JPG, PNG files are allowed', 'error');
        return;
      }
      
      switch (fileType) {
        case 'pan_document':
          this.panDocument = file;
          this.panDocumentName = file.name;
          break;
        case 'aadhaar_document':
          this.aadhaarDocument = file;
          this.aadhaarDocumentName = file.name;
          break;
        case 'license_document':
          this.licenseDocument = file;
          this.licenseDocumentName = file.name;
          break;
      }
    }
  }

  // Input validators
  numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  alphaNumericOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);
    const pattern = /^[a-zA-Z0-9]+$/;
    if (charCode > 31 && !pattern.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  omitSpecialCharacters(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const isValid = (charCode > 64 && charCode < 91) || 
                    (charCode > 96 && charCode < 123) || 
                    charCode === 8 || charCode === 32;
    if (!isValid) {
      event.preventDefault();
    }
    return isValid;
  }

  transformToLowerCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLowerCase();
  }

  openStaticPage(page_title: string) {
    console.log('Opening page:', page_title);
  }

onRegister() {
  this.submitted = true;

  const requiredDocumentsMissing = !this.panDocumentName || !this.aadhaarDocumentName;

  // PAN and Aadhaar uploads are not form controls, so validate them explicitly.
  if (this.registerForm.invalid || requiredDocumentsMissing) {

    const invalidControls = Object.keys(this.registerForm.controls)
      .filter(key => this.registerForm.get(key).invalid);

    console.log('❌ Invalid Controls:', invalidControls);

    invalidControls.forEach(control => {
      console.log(control, this.registerForm.get(control).errors);
    });
    const firstInvalid = document.querySelector('.ng-invalid, .required-document-error');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  this.loading = true;

  const formData = new FormData();
  const formValues = this.registerForm.value;

  // ✅ APPEND FORM VALUES
  Object.keys(formValues).forEach(key => {
    if (key === 'id' || key === 'services') {
      return;
    }
    const value = formValues[key];
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  // ✅ EXTRA DATA
  formData.append('services', JSON.stringify(formValues.services || []));
  if(this.propertyId)
  formData.append('property_id', this.propertyId);

  // ✅ FILES
  if (this.panDocument) formData.append('pan', this.panDocument);
  if (this.aadhaarDocument) formData.append('aadhaar', this.aadhaarDocument);
  if (this.licenseDocument) formData.append('license', this.licenseDocument);

  // ✅ ADD / UPDATE SWITCH
  if (this.addOrUpdate === 'add') {
    formData.delete('id'); // ensure no id

    this.subSunk.sink = this.userManagementService.addSupplier(formData)
      .subscribe({
        next: (resp: any) => {
          this.loading = false;

          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success("Supplier added successfully");

            this.resetSupplierForm(true);

            this.b2cUserUpdate.emit({ tabId: 'supplier_list' });
          } else {
            this.swalService.alert.oops("Unable to add supplier");
          }
        },
        error: (err) => {
          this.loading = false;
          this.swalService.alert.oops(err.error.Message || 'Error occurred');
        }
      });

  } else {
    // ✅ UPDATE
    formData.append('supplier_id', String(this.supplierId || formValues.id));
    formData.append('user_id', String(this.supplierUserId || this.supplierId || formValues.id));

    this.subSunk.sink = this.userManagementService.updateSupplier(formData)
      .subscribe({
        next: (resp: any) => {
          this.loading = false;

          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success("Supplier updated successfully");

            this.resetSupplierForm(true);

            this.b2cUserUpdate.emit({ tabId: 'supplier_list' });
          } else {
            this.swalService.alert.oops("Unable to update supplier");
          }
        },
        error: (err) => {
          this.loading = false;
          this.swalService.alert.oops(err.error.Message || 'Error occurred');
        }
      });
  }
}

onServiceChange(event: any) {
  const services = this.registerForm.get('services').value || [];

  if (event.target.checked) {
    services.push(event.target.value);
  } else {
    const index = services.indexOf(event.target.value);
    if (index >= 0) {
      services.splice(index, 1);
    }
  }

  this.registerForm.get('services').setValue(services);
  this.registerForm.get('services').markAsTouched();
}

isServiceSelected(service: string): boolean {
  const services = this.registerForm.get('services').value || [];
  return services.includes(service);
}

private normalizeServices(data: any): string[] {
  let services = data.services || data.selectedSuppliers || [];

  if (typeof services === 'string') {
    services = this.parseServicesValue(services);
  }

  if (!Array.isArray(services)) {
    return [];
  }

  return services.reduce((result, service) => {
    return result.concat(this.parseServicesValue(service));
  }, []).map((service) => {
    const supplier = String(service).trim();
    if (supplier === 'transfer') {
      return 'cabs';
    }
    if (supplier === 'heli') {
      return 'travel-heli';
    }
    return supplier;
  }).filter((service, index, list) => service && list.indexOf(service) === index);
}

private parseServicesValue(value: any): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  const serviceValue = String(value).trim();
  if (!serviceValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(serviceValue);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
  }

  return serviceValue.split(',');
}

private getDocumentName(documentUrl: string): string {
  if (!documentUrl) {
    return '';
  }

  return decodeURIComponent(documentUrl.split('/').pop() || '');
}

getToUpdate() {
  this.subSunk.sink = this.userManagementService.supplierUpdateData.subscribe(data => {

    if (data && Object.keys(data).length > 0) {

      this.addOrUpdate = 'update';
      const services = this.normalizeServices(data);
      this.supplierId = data.supplier_id || data.id;
      this.supplierUserId = data.user_id || data.userId || data.id || data.supplier_id;

      this.registerForm.patchValue({
        id: this.supplierId,
        title: data.title ? Number(data.title) : '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone_number: data.phone_number || data.phone || '',
        email: data.email || '',
        services: services,
        registered_legal_name: data.registered_legal_name || '',
        trade_name: data.trade_name || '',
        chain_name: data.chain_name || '',
        company_website: data.company_website || '',
        registration_number: data.registration_number || '',
        country_of_registration: data.country_of_registration || '',

        pan_number: data.pan_number || '',
        aadhaar_number: data.aadhaar_number || '',
        license_number: data.license_number || '',
        office_phone: data.office_phone || '',
        alt_company_email: data.alt_company_email || '',

        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        zip_code: data.zip_code || '',

        accounting_email: data.accounting_email || '',
        accounting_phone: data.accounting_phone || '',

        bank_name: data.bank_name || '',
        branch_address: data.branch_address || '',
        account_holder_name: data.account_holder_name || '',
        account_number: data.account_number || '',
        ifsc_code: data.ifsc_code || '',

      });

      if (data.country) {
        this.loadStates(data.country);
        this.loadCitiesByCountry(data.country);
      }

      // ✅ Optional: patch files name (UI only)
      this.panDocumentName = data.pan_document_name || this.getDocumentName(data.pan_document);
      this.aadhaarDocumentName = data.aadhaar_document_name || this.getDocumentName(data.aadhaar_document);
      this.licenseDocumentName = data.license_document_name || this.getDocumentName(data.license_document);
    } else {
      this.resetSupplierForm(false);
    }
  });
}
}
