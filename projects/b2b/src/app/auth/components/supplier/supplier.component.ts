import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

public registerImage: any = "assets/images/register-banner.png";
    @ViewChild('theFile', { static: false }) fileUploader: ElementRef;
    slideConfig2 = {
        className: 'center',
        centerMode: true,
        infinite: true,
        centerPadding: '0',
        slidesToShow: 1,
        speed: 500,
        dots: false,
    };
    separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];

    data = [];
    staticCountries = []
    registerForm: FormGroup;
    selectRegisterForm:FormGroup
    loading = false;
    submitted: Boolean = false;
    returnUrl: string;
    countries: any = [];
    errorMessage = '';
    hide: boolean = false;
    currencyList: any;
    registerCountries: any[] = [];
    registerStates: any[] = [];
    registerCities: any[] = [];
    filteredStates: any[] = [];
    filteredCities: any[] = [];
    phoneCodes: any;
    get email() { return this.registerForm.get('email'); }
    userTitleList: Array<any> = [];
    protected subs = new SubSink();
    bankLogo: string;
    imageSrc;
    logoConfig: FormGroup;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false,
    };
    requestTypes: Array<any> = [
        { name: "IATA" },
        { name: "ATOL" },
        { name: "ABTA" },
        { name: "ASTA" },
    ];
    showAffiliationNumber: boolean = false;
    terms: any;
    registerId: any;
    cityList: any;
    isRate:any;
    isRateData:boolean =false;
    isSupplier:boolean = false;
    isContractSelected = false;
    domainInfo: any;
    selectedSuppliers: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private dialog: MatDialog,
        private swalService: SwalService,
        private utility: UtilityService,
        private cdr: ChangeDetectorRef
    ) {
        if (sessionStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
        this.listCountries();
        this.listStates();
        this.listCities();
        this.getPhoneCodeList();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            this.staticCountries = res.data.popular_countries.concat(res.data.countries);
        });
        this.apiHandlerService.apiHandler('hotelCurrencyConverison', 'post').subscribe(resp => {
            if (resp.Status && resp.data) {
                this.currencyList = resp.data.filter(t => t.status == 1);
            }
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
        })
        this.authService.selectedSuppliers.subscribe((res) => {
            const supplierMap: { [key: string]: string } = {
                DMC: "Hotel",
                AS:  "Activity",
                TS:  "Transfer",
                HPS: "Tour"
            };
            if (res.length > 0) {
                const selectedSuppliers = res;
                this.selectedSuppliers = selectedSuppliers.map(code => supplierMap[code] || code);
            } else {
                const selectedSuppliers = localStorage.getItem('selectedSuppliers');
                const selectedSupplier = JSON.parse(selectedSuppliers);
                this.selectedSuppliers = selectedSupplier.map(code => supplierMap[code] || code);
                console.log(this.selectedSuppliers)
            }
        })
        this.selectCreateForm()
        this.createForm();
        this.getTitleList();
        this.getCities();
        this.getDomainInfo();
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    objectValidator(keys: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
          
            if (!value || typeof value !== 'object') {
                return { invalidObject: true };
            }
         
            if (value.number && value.number.trim() !== '') {
                return null; 
            }
            return { invalidPhoneNumber: true };
        };
    }

    getTitleList() {
        this.apiHandlerService.apiHandler('userTitleList', 'POST', '', '', {})
            .subscribe(
                resp => {
                    if (resp.statusCode === 200 || resp.statusCode === 201) {

                        this.userTitleList = resp.data.length
                            ? resp.data.filter(item => item.paxType === 'ADULT')
                            : [];
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

    getCountries() {
        this.apiHandlerService.apiHandler('CountryList', 'POST', '', '', {})
            .subscribe(res => {
                if (res.data) {
                    this.staticCountries = res.data.popular_countries.concat(res.data.countries);
                } else {
                    this.errorMessage = res.data.msg;
                }
            });

    }
    getCities() {
        this.apiHandlerService.apiHandler('commonCityList', 'POST', '', '', {})
            .subscribe(res => {
                if (res.data) {
                    this.cityList = res.data;
                } else {
                    this.errorMessage = res.data.msg;
                }
            });

    }

    listCountries() {
        this.apiHandlerService.apiHandler('registerCountry', 'POST', '', '', {})
            .subscribe(res => {
                if (res.data) {
                    this.registerCountries = res.data;
                } else {
                    this.errorMessage = res.data.msg;
                }
            });
    }
    listStates() {
        this.apiHandlerService.apiHandler('registerState', 'POST', '', '', {})
            .subscribe(res => {
                if (res.data) {
                    this.registerStates = res.data;
                } else {
                    this.errorMessage = res.data.msg;
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

    onCountryChange(event: Event): void {
        const countryId = (event.target as HTMLSelectElement).value;
        this.filteredStates = this.registerStates.filter((state) => state.country_id == countryId);
        this.registerForm.controls['state'].setValue('');
        this.filteredCities = [];
    }

    onStateChange(event: Event): void {
        const stateId = (event.target as HTMLSelectElement).value;
        this.filteredCities = this.registerCities.filter((city) => city.state_id == stateId);
        this.registerForm.controls['city'].setValue('');
    }

    onCurrencyChange(event: Event): void {
        const stateId = (event.target as HTMLSelectElement).value;
        this.filteredCities = this.registerCities.filter((city) => city.state_id == stateId);
        this.registerForm.controls['city'].setValue('');
    }

    filterCities(searchTerm: string): void {
        const stateId = this.registerForm.controls['state'].value;
        if (stateId) {
            this.filteredCities = this.registerCities.filter(
                (city) =>
                    city.state_id == stateId && city.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    }



    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }


    createForm() {
        this.registerForm = this.fb.group({
            title: [''],
            // DHC:[''],
            // DMC:[''],
            first_name: ['', [Validators.required, Validators.minLength(3)]],
            last_name: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            // business_number: [''],
            country_of_registartion: ['', [Validators.required]],
            country_name:[''],
            business_trade_name: ['', [Validators.required]],
            business_chain_name: [''],
            business_website: [''],
            registration_number: ['', [Validators.required]],
            tax_reg_no: ['', [Validators.required]],
            office_number:  ['', [this.objectValidator(['number', 'dialCode'])]],
            bank_name: [''],
            branch_addrs: [''],
            acc_holder_name: [''],
            acc_number: [''],
            iban: [''],
            swift_code: [''],
            payment_pref: [''],
            PhoneCode: [''],
            alterPhoneCode: [''],
            phone: ['', [this.objectValidator(['number', 'dialCode'])]],
            // business_phone: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(11)]],
            email: ['', [Validators.required, Validators.email]],
            alter_email: ['', [Validators.required, Validators.email]],
            acc_email: ['', [Validators.required, Validators.email]],
            acc_tel_no: ['', [Validators.required]],
            password: [''],
            currency: ['',],
            confirmCheckbox: [false, [Validators.required]],
            affiliations: [''],
            affiliation_number: [''],
            confirm_password: new FormControl(''),
            address1: ['', [Validators.required]],
            address2: [''],
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            city: ['', [Validators.required]],
            zip_code: ['', [Validators.required]],
            supplier:['DMC'],
            supplier_type: ['',[Validators.required]],
            selectedSuppliers: [ [] ],
            supplierCurrency: ['',[Validators.required]]
        }, {
            validator: this.matchPassword
        });
        this.logoConfig = this.fb.group({
            bank_logo: new FormControl("", [Validators.required]),
        })
    }
    selectCreateForm() {
        this.selectRegisterForm = this.fb.group({
            DHC:[''],
        });
    }
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file && file.size) {
            let result = this.validateFileSize(file.size);
            if (!result) {
                this.bankLogo = "";
                this.imageSrc = ""
                this.fileUploader.nativeElement.value = null;
                this.logoConfig.reset();
                // this.logoConfig.get('bank_logo').reset();
                return;
            }
        }
        if (file.name) {
            this.bankLogo = "";
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ bank_logo: file });
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    validateFileSize(fileSize) {
        if (fileSize > 1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            return false;
        }
        else {
            return true
        }
    }
    onTerm(e) {
        this.terms = e

    }

    transformToLowerCase(event: KeyboardEvent): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toLowerCase();
        if(this.registerForm.value.email === this.registerForm.value.alter_email ) {
            this.swalService.alert.oops('Email and Alternate Email Should not be same.');
            this.registerForm.get('alter_email').setValue('')
        }
      }

      
    onTerms() {
        sessionStorage.setItem('static_title', 'Travel Agent Terms and conditions');
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms'])
        );
        window.open('#' + url, '_blank');
    }

    constructFormData(): FormData {
        const formData = new FormData();
        const formValues = this.registerForm.value;
    
        // const countryName = this.registerCountries.find(
        //     (c) => c.id.toString() === formValues.country
        // ).name;
    
        // const stateName = this.registerStates.find(
        //     (s) => s.id.toString() === formValues.state
        // ).name;
        formData.append('country_name', this.registerForm.value.country_of_registartion);
        const cityName = formValues.city;
    
        Object.keys(this.registerForm.controls).forEach((key) => {
            let value = this.registerForm.get(key).value;
            
            if (key === 'confirmCheckbox') {
                return; 
            }
            if (key === 'country') {
                value = value;
            } else if (key === 'state') {
                value = value;
            } else if (key === 'city') {
                value = cityName || value;
            }
    
            if (key === 'phone' && typeof value === 'object') {
                if (value.number) {
                    formData.append('phone', value.number);
                }
                if (value.dialCode) {
                    formData.append('PhoneCode', value.dialCode);
                }
                return;
            } else if (key === 'office_number' && typeof value === 'object') {
                if (value.number) {
                    formData.append('office_number', value.number);
                }
                if (value.dialCode) {
                    formData.append('alterPhoneCode', value.dialCode);
                }
                return; 
            }
    
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });
        // formData.append('supplier_type', 'B2B');
    
        return formData;
    }      

    getPhoneCodeList() {
        this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                    this.phoneCodes = res.data;
                    this.cdr.detectChanges();
                }
            });
    }


    async onRegister(t: any) {
        this.submitted = true;
          
        // if (t.invalid) {
        //     return;
        // } else {
        //     const formData = await new FormData();
        //     await formData.append('title', this.registerForm.controls['title'].value,);
        //     await formData.append('first_name', this.registerForm.controls['first_name'].value,);
        //     await formData.append('last_name', this.registerForm.controls['last_name'].value,);
        //     await formData.append('phone', this.registerForm.controls['phone'].value,);
        //     await formData.append('business_phone', this.registerForm.controls['business_phone'].value,);
        //     await formData.append('affiliations', this.registerForm.controls['affiliations'].value,);
        //     await formData.append('affiliation_number', this.registerForm.controls['affiliation_number'].value,);
        //     await formData.append('country_name', this.registerForm.controls['country_name'].value,);
        //     await formData.append('currency', this.registerForm.controls['currency'].value);
        //     await formData.append('address', this.registerForm.controls['address'].value,);
        //     await formData.append('zip_code', this.registerForm.controls['zip_code'].value);
        //     await formData.append('city', this.registerForm.controls['city'].value,);
        //     await formData.append('password', this.registerForm.controls['password'].value);
        //     await formData.append('email', this.registerForm.controls['email'].value);

        //     if (this.logoConfig.get('bank_logo').value) {
        //       await formData.append('license', this.logoConfig.get('bank_logo').value);
        //     }
        // const formdata = {
        //     first_name: this.registerForm.controls['first_name'].value,
        //     last_name: this.registerForm.controls['last_name'].value,
        //     email: this.registerForm.controls['email'].value,
        //     business_name: this.registerForm.controls['business_name'].value,
        //     password: this.registerForm.controls['password'].value,
        //     business_phone: this.registerForm.controls['business_number'].value,
        //     country: this.registerForm.controls['country'].value,
        //     currency: this.registerForm.controls['currency'].value,
        //     phone: this.registerForm.controls['phone'].value,
        // }
        // const formdata1 = JSON.stringify(formdata)
        this.registerForm.patchValue({
            selectedSuppliers: this.selectedSuppliers
        })
        if (this.registerForm.valid) {
            const formData = this.constructFormData();
            this.subs.sink = this.apiHandlerService.apiHandler('supplier', 'POST', '', '', formData)
                .subscribe(res => {

                    if (res.Status == true) {
                        console.log("res", res)
                        this.authService.registerId.next(res.data.id)
                        localStorage.setItem('registerId', JSON.stringify(res.data.id))
                        this.router.navigate(['/director', res.data.id]); // Pass ID dynamically

                        // this.registerId = res.id
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
                            this.router.navigate(['/auth/login']);
                        }, 1000)

                    } else {
                        this.hide = true;
                        this.errorMessage = res.data.msg;
                        this.swalService.alert.oops(res.Message);
                    }
                }, (errorResponse) => {
                    this.hide = true;
                    if (errorResponse.error.Message == "403 Already exists") {
                        this.swalService.alert.oops("Email Already Exists.");
                    } else {
                        this.swalService.alert.oops(errorResponse.error.msg);
                    }
                });
        }
        // }
    }

    public openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'dialog-container';
        dialogConfig.width = '354px';
        dialogConfig.height = '203px';
        dialogConfig.autoFocus = true;
        this.dialog
            .open(ForgotPasswordComponent, dialogConfig)
            .afterClosed()
    }

    getCurrencyList() {
        this.apiHandlerService.apiHandler('hotelCurrencyConverison', 'POST', '', '', {}).subscribe(resp => {
            if (resp.Status && resp.data) {
                this.currencyList = resp.data.filter(t => t.status == 1);
            }
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
        })
    }

    openStaticPage(page_title) {
        sessionStorage.setItem('static_title', page_title);
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms/'])
        );
        window.open('#' + url, '_blank');
    }

    onStaticContent() {
        sessionStorage.setItem('static_title', "Terms and conditions");
        this.router.createUrlTree(['auth/cms'])
    }
    numbersOnly(event): boolean {
        return this.utility.numberOnly(event);
    }
    onSelect(selectedValue: string): void {
        this.showAffiliationNumber = selectedValue !== 'Select License' && selectedValue !== '';
        this.registerForm.get('affiliation_number').reset();
        if (this.showAffiliationNumber) {
            this.registerForm.get('affiliation_number').setValidators(Validators.required);
        } else {
            this.registerForm.get('affiliation_number').clearValidators();
        }
        this.registerForm.get('affiliation_number').updateValueAndValidity();
    }

    private matchPassword(AC: AbstractControl) {
        const password = AC.get('password').value
        const confirm_password = AC.get('confirm_password').value
        if (password != confirm_password) {
            AC.get('confirm_password').setErrors({ matchPassword: true })
        } else {
            AC.get('confirm_password').setErrors(null);
        }
    }
    
onRateChange(event: any) {
    this.isContractSelected = !!event.target.value;
    this.isRate = event.target.value;
    console.log("event.target.value",event.target.value)
    if (this.isRate == 'DMC') {
      this.isRateData = true;
      this.isSupplier = false; 
    }else if(this.isRate == 'DHC'){
        this.isSupplier = true;
        this.isRateData = false;
    }else{
        this.isRateData = false;
        this.isSupplier = false;  
    }
  }
  getDomainInfo() {
           this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
              .subscribe(res => {
                  if (res.statusCode == 200 || res.statusCode == 201) {
                      this.domainInfo = res.data[0];
                  }
              }, (err: HttpErrorResponse) => {
                //   log.debug(err);
                  console.error(err);
              });
      }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    selectdistributionChannel(selectedChannel) {
        this.registerForm.patchValue({
            supplier_type: selectedChannel
        })
    }

}
