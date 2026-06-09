import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  // Data arrays
  userTitleList = [
    { id: 1, name: 'Mr' },
    { id: 2, name: 'Ms' },
    { id: 3, name: 'Mrs' },
    { id: 4, name: 'Dr' }
  ];
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
    { label: 'Travel & Heli Services', value: 'travel-heli' },
     { label: 'Wellness Retreat', value: 'wellness-retreat' },
  ];
  
  selectedServices: string[] = [];
  
  // File variables
  panDocument: File | null = null;
  panDocumentName: string = '';
  aadhaarDocument: File | null = null;
  aadhaarDocumentName: string = '';
  licenseDocument: File | null = null;
  licenseDocumentName: string = '';

  private apiUrl = 'http://54.92.243.81:2002/webservice/supplier/create';

  constructor(
    private fb: FormBuilder,
    private router: Router,
        private route: ActivatedRoute,
        private apiHandlerServices: ApiHandlerService,
         private authService: AuthService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCountries();
    // this.loadCities();
     this.getSelectedServicesFromQueryParams();
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
  selectedServiceValues: string[] = [];
    // Get selected services from query params
 // Get selected services from query params
  getSelectedServicesFromQueryParams() {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      
      const serviceParam = params['service'];
      let servicesArray: string[] = [];
      
      if (serviceParam) {
        servicesArray = [serviceParam];
      } else {
        const servicesParam = params['services'];
        if (servicesParam) {
          servicesArray = servicesParam.split(',');
        }
      }
      
      console.log('Services Array:', servicesArray);
      
      // Filter the selected services from all services
      this.selectedServicesFromQuery = this.availableServices.filter(service => 
        servicesArray.includes(service.value)
      );
      
      this.selectedServiceValues = this.selectedServicesFromQuery.map(s => s.value);
      
      console.log('Selected Services from query:', this.selectedServicesFromQuery);
      console.log('Selected Service Values:', this.selectedServiceValues);
    });
  }


  createForm() {
    this.registerForm = this.fb.group({
      // Section 1
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
      
      // Section 6
      is_agreed: [false, Validators.requiredTrue]
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

trackByCountry(index: number, item: any) {
  return item.id || item.name || index;
}

trackByState(index: number, item: any) {
  return item.id || item.name || index;
}

trackByCity(index: number, item: any) {
  return item.id || item.cityName || item.name || index;
}

loadStates(countryId: string) {
    const requestId = ++this.stateRequestId;
    const req = { country_id: Number(countryId) };
    this.apiHandlerServices.apiHandler('getMasterState', 'POST', {}, {}, req).subscribe({
        next: (res) => {
            if (requestId !== this.stateRequestId) {
                return;
            }
            if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                this.registerStates = res.data.data;
                this.filteredStates = this.registerStates || [];
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

// loadCities() {
//     const req = {};
//     this.apiHandlerServices.apiHandler('getMasterCityList', 'POST', {}, {}, req).subscribe({
//         next: (res) => {
//             if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
//                 this.registerCities = res.data.data;
//             }
//         },
//         error: (err) => {
//             console.error(err);
//         }
//     });
// }
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

    this.registerForm.controls['state'].setValue('');
    this.registerForm.controls['city'].setValue('');
    this.registerStates = [];
    this.filteredStates = [];
    this.registerCities = [];
    this.filteredCities = [];

    if (countryId) {
        this.loadStates(countryId);
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
        Swal.fire('Error', 'File size should be less than 5MB', 'error');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Error', 'Only PDF, JPEG, JPG, PNG files are allowed', 'error');
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

openStaticPage(pageType: string) {
    sessionStorage.setItem('static_title', pageType);
    
    // Navigate and preserve hash
    this.router.navigateByUrl('/auth/static-content');
}

onRegister(form: FormGroup) {
  this.submitted = true;

  if (this.selectedServiceValues.length === 0) {
    Swal.fire('Error', 'Please select at least one service', 'error');
    return;
  }

  if (form.invalid) {
    const firstInvalid = document.querySelector('.ng-invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  this.loading = true;

  const formData = new FormData();
  const formValues = this.registerForm.value;

  Object.keys(formValues).forEach(key => {
    const value = formValues[key];
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });

  formData.append('services', JSON.stringify(this.selectedServiceValues));
  if (this.panDocument) {
    formData.append('pan', this.panDocument);
  }
  if (this.aadhaarDocument) {
    formData.append('aadhaar', this.aadhaarDocument);
  }
  if (this.licenseDocument) {
    formData.append('license', this.licenseDocument);
  }

  this.authService.onRegister(formData).subscribe({
    next: (res: any) => {
      this.loading = false;
      
      // Check if response is successful
      if (res.statusCode === 200 || res.statusCode === 201) {
        const supplierId = res.data.id || res.id;
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.Message,
          showConfirmButton: true
        }).then(() => {
          console.log(this.selectedServiceValues,"this.selectedServiceValues")
       this.router.navigate(['/auth/login']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: res.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    },
    error: (error: any) => {
      this.loading = false;
      console.log(error)
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
      
      console.error('API Error:', error);
    }
  });
}
  }
