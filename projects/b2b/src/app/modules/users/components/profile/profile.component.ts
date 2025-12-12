import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/b2b/src/app/auth/auth.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const baseUrl2 = environment.B2B_URL
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('theFile', { static: true }) theFile: ElementRef;
    logoUri = baseUrl2;
    maxDate = new Date();
    userTitleList: Array<any> = [];
    public profile_logo = "assets/images/login-images/assets/profile_logo.png";
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    onFileChange(files: FileList) {
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');

        this.fileToUpload = files.item(0);
        if (this.fileToUpload.name) {
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'user_image': this.fileToUpload });
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }
    formImport: FormGroup;
    logoConfig: FormGroup;
    registerForm: FormGroup;
    fileToUpload: File = null;
    profileForm: FormGroup;
    countries: any = [];
    currentUser: any = {};
    currencyList: any;
    registerCountries: any[] = [];
    registerStates: any[] = [];
    registerCities: any[] = [];
    filteredStates: any[] = [];
    filteredCities: any[] = [];
    phoneCodeList: Array<any> = [];
    protected subs = new SubSink();
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    submitted: boolean = false;
    userImage: string;
    agentData: any;
    errorMessage = '';


    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
      };
      countriesList = [];
      agentList = [];
      countryCode: string;
      separateDialCode = false;
      requestTypes: Array<any> = [
        { name: "IATA" },
        { name: "ATOL" },
        { name: "ABTA" },
        { name: "ASTA" },
      ];
      showAffiliationNumber: boolean = false;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private authService: AuthService,
        private swalService: SwalService,
        private datePipe: DatePipe,
        private util: UtilityService
    ) { }

    ngOnInit() {
        this.maxDate.setDate(this.maxDate.getDate() - (18 * 356));
        this.getTitleList();
        this.getCurrencyList();
        this.getPhoneCodeList();
        this.listCountries();
        this.listStates();
        this.listCities();
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
        this.createAgentForm();
        this.createForm();
        this.getAgentById();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
            .subscribe(res => {
                if (res.Status) {
                    this.countries = res.data.popular_countries.concat(res.data.countries);
                }
            });

            Promise.all([
             
              this.listStates()
            ]).then(() => {
              setTimeout(()=>{
                this.setDataToForm(this.currentUser)
              },1000)
            }).catch(error => {
              console.error("Error loading:", error);
            });
    }

    getTitleList() {
        this.subs.sink = this.apiHandlerService.apiHandler('userTitlelist', 'post', '', '').subscribe(res => {
            if(res.data && res.data.length){
                this.userTitleList = res.data.filter(item => item.pax_type === 'ADULT')
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
    
      filterCities(searchTerm: string): void {
        const stateId = this.registerForm.controls['state'].value;
        if (stateId) {
          this.filteredCities = this.registerCities.filter(
            (city) =>
              city.state_id == stateId && city.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
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

      getPhoneCodeList() {
        this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                    this.phoneCodeList = res.data;
                }
            });
    }
    


      createAgentForm() {
        this.registerForm = this.fb.group({
          title: [''],
          first_name: ['', [Validators.required, Validators.minLength(3)]],
          last_name: ['', [Validators.required]],
          business_name: ['', [Validators.required]],
          // business_number: [''],
          country_name: ['', [Validators.required]],
          business_trade_name: ['', [Validators.required]],
          business_chain_name: [''],
          business_website: [''],
          registration_number: ['', [Validators.required]],
          tax_reg_no: ['', [Validators.required]],
          office_number: ['', [Validators.required]],
          bank_name: [''],
          branch_addrs: [''],
          acc_holder_name: [''],
          acc_number: [''],
          iban: [''],
          swift_code: [''],
          payment_pref: ['', [Validators.required]],
          PhoneCode: ['', [Validators.required]],
          alterPhoneCode: ['', [Validators.required]],
          dir_phone_code: [''],
          phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
          email: ['', [Validators.required, Validators.email]],
          alter_email: ['', [Validators.required, Validators.email]],
          acc_email: ['', [Validators.required, Validators.email]],
          acc_tel_no: ['', [Validators.required]],
          // password: [''],
          currency: ['', [Validators.required]],
          affiliations: [''],
          affiliation_number: [''],
          // confirm_password: new FormControl(''),
          address1: ['', [Validators.required]],
          address2: [''],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          zip_code: ['', [Validators.required]],
          status: new FormControl('1', [Validators.required]),
          agent_group_id: new FormControl(0),
          id: new FormControl(''),
          uuid: new FormControl(''),
          iata: new FormControl(''),
          dir_title: ['1'],
          dir_name: [''],
          dir_contact: [''],
          dir_email: ['',],
          acc_title: [''],
          acc_name: ['',],
        });
      }

    getAgentById() {
        this.subs.sink = this.apiHandlerService.apiHandler('getAgentById', 'POST', {}, {}, { "id": this.currentUser.id })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.agentData = res.data;
                    console.log(this.agentData);
                    setTimeout(() => {
                      this.setDataToForm(this.agentData);
                    }, 1000);
                }
            });
    }

    createForm() {
        this.profileForm = this.fb.group({
            id: [],
            title: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            date_of_birth: ['', [Validators.required]],
            country: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            business_phone: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            business_number: ['', [Validators.required]],
            image: [''],
            importFile: [''],
            status: ['1', [Validators.required]],
            // user_id: [this.currentUser.user_id]
        });
        this.logoConfig = this.fb.group({
            user_image: new FormControl('')
        })
    }

    async setDataToForm(userInfo) {
       await this.listStates();
        this.registerForm.patchValue({
            id: userInfo.id ? userInfo.id : '',
            uuid: userInfo.uuid ? userInfo.uuid : '',
            business_name: userInfo.business_name ? userInfo.business_name : '',
            business_phone: userInfo.business_phone ? userInfo.business_phone : '',
            iata: userInfo.iata ? userInfo.iata : '',
            title: userInfo.title ? userInfo.title : '',
            first_name: userInfo.first_name ? userInfo.first_name : '',
            middle_name: userInfo.middle_name ? userInfo.middle_name : '',
            last_name: userInfo.last_name ? userInfo.last_name : '',
            email: userInfo.email ? userInfo.email : '',
            country_name: userInfo.country_name ? userInfo.country_name : '',
            phone_code: userInfo.phone_code ? userInfo.phone_code : '',
            phone: userInfo.phone ? userInfo.phone : '',
            country: userInfo.country ? userInfo.country : '',
            agent_group_id: userInfo.agent_group_id ? userInfo.agent_group_id : 0,
            address1: userInfo.address1 ? userInfo.address1 : '',
            address2: userInfo.address2 ? userInfo.address2 : '',
            city: userInfo.city ? userInfo.city : '',
            state: userInfo.state ? userInfo.state : '',
            zip_code: userInfo.zip_code ? userInfo.zip_code : '',
            license: userInfo.license ? userInfo.license : '',
            auth_role_id: userInfo.auth_role_id ? userInfo.auth_role_id : '',
            business_number: userInfo.business_number ? userInfo.business_number : '',
            date_of_birth: userInfo.date_of_birth ? userInfo.date_of_birth : '',
            image: userInfo.image ? userInfo.image : '',
            address: userInfo.address ? userInfo.address : '',
            core_city_id: userInfo.core_city_id ? userInfo.core_city_id : '',
            privilege_access: userInfo.privilege_access ? userInfo.privilege_access : '',
            socialuserid: userInfo.socialuserid ? userInfo.socialuserid : '',
            user_type: userInfo.user_type ? userInfo.user_type : '',
            created_by_id: userInfo.created_by_id ? userInfo.created_by_id : '',
            created_at: userInfo.created_at ? userInfo.created_at : '',
            updated_at: userInfo.updated_at ? userInfo.updated_at : '',
            agent_balance: userInfo.agent_balance ? userInfo.agent_balance : '',
            credit_limit: userInfo.credit_limit ? userInfo.credit_limit : '',
            due_amount: userInfo.due_amount ? userInfo.due_amount : '',
            expire_time: userInfo.expire_time ? userInfo.expire_time : '',
            currency_id: userInfo.currency_id ? userInfo.currency_id : '',
            currency_name: userInfo.currency_name ? userInfo.currency_name : '',
            affiliation_number: userInfo.affiliation_number ? userInfo.affiliation_number : '',
            affiliations: userInfo.affiliations ? userInfo.affiliations : '',
            api_list: userInfo.api_list ? userInfo.api_list : '',
            hotel_api_list: userInfo.hotel_api_list ? userInfo.hotel_api_list : '',
            activity_api_list: userInfo.activity_api_list ? userInfo.activity_api_list : '',
            transfer_api_list: userInfo.transfer_api_list ? userInfo.transfer_api_list : '',
            business_trade_name: userInfo.business_trade_name ? userInfo.business_trade_name : '',
            registered_legal_name: userInfo.registered_legal_name ? userInfo.registered_legal_name : '',
            business_chain_name: userInfo.business_chain_name ? userInfo.business_chain_name : '',
            business_website: userInfo.business_website ? userInfo.business_website : '',
            registration_number: userInfo.registration_number ? userInfo.registration_number : '',
            country_of_registartion: userInfo.country_of_registartion ? userInfo.country_of_registartion : '',
            tax_reg_no: userInfo.tax_reg_no ? userInfo.tax_reg_no : '',
            payment_pref: userInfo.payment_pref ? userInfo.payment_pref : '',
            acc_email: userInfo.acc_email ? userInfo.acc_email : '',
            bank_name: userInfo.bank_name ? userInfo.bank_name : '',
            branch_addrs: userInfo.branch_addrs ? userInfo.branch_addrs : '',
            acc_holder_name: userInfo.acc_holder_name ? userInfo.acc_holder_name : '',
            acc_number: userInfo.acc_number ? userInfo.acc_number : '',
            iban: userInfo.iban ? userInfo.iban : '',
            swift_code: userInfo.swift_code ? userInfo.swift_code : '',
            office_number: userInfo.office_number ? userInfo.office_number : '',
            currency: userInfo.currency ? userInfo.currency : '',
            alter_email: userInfo.alter_email ? userInfo.alter_email : '',
            PhoneCode: userInfo.PhoneCode ? userInfo.PhoneCode.replace('+', '') : '',
            alterPhoneCode: userInfo.alterPhoneCode ? userInfo.alterPhoneCode.replace('+', '')  : '',
            dir_phone_code: userInfo.dir_phone_code ? userInfo.dir_phone_code.replace('+', '')  : '',
            acc_tel_no: userInfo.acc_tel_no ? userInfo.acc_tel_no : '',
            dir_title: userInfo.dir_title ? userInfo.dir_title : '1',
            dir_email: userInfo.dir_email ? userInfo.dir_email : '',
            acc_title: userInfo.acc_title ? userInfo.acc_title : '',
            acc_name: userInfo.acc_name ? userInfo.acc_name : '',
            dir_name: userInfo.dir_name ? userInfo.dir_name : '',
            dir_contact: userInfo.dir_contact ? userInfo.dir_contact : ''
        });
        console.log("hiii",this.profileForm)
        this.userImage = userInfo.image ? userInfo.image : '';

    }
     convertTimestampToDate(timestampMs: number): string {
        // Convert milliseconds to seconds
        const timestampS = timestampMs / 1000;
        
        // Create a new Date object
        const date = new Date(timestampS * 1000);
        
        // Extract the day, month, and year from the Date object
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getUTCFullYear();
    
        // Format the date as dd/mm/yyyy
        return `${month}/${day}/${year}`;
    }
    
 
    
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    imageSrc;
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file.name) {
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'user_image': file });
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    uploadImg() {
        const formData = new FormData();
        formData.append('image', this.logoConfig.get('user_image').value);
        console.log(formData)
        this.subs.sink = this.apiHandlerService.apiHandler('uploadUserProfilePhoto', 'post', {}, {}, formData).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data) {
                this.imgObj.isUploaded = true;
                this.currentUser['image'] = resp.data;
                setTimeout(() => {
                    this.userImage = resp.data;
                    this.update({ image: resp.data });
                    // this.authService.logout();
                }, 1000)
            } else {
                this.imgObj.isUploaded = false;
            }
        })
    }

    onReset() {
        this.registerForm.reset();
      }
      
    onSubmit() {

        if (this.registerForm.invalid) {
            return
        }
        let req = JSON.parse(JSON.stringify(this.registerForm.value));
        // const jsonData = {
        //     id: this.currentUser.id,
        //     business_name: data.business_name,
        //     business_number: data.business_number,
        //     title: this.currentUser.title,
        //     address: data.address,
        //     first_name: this.currentUser.first_name,
        //     last_name: this.currentUser.last_name,
        //     phone: this.currentUser.phone,
        //     country: this.currentUser.country,
        //     date_of_birth: data.date_of_birth,
        //     business_phone: data.business_phone,
        //     image: data.image
        // }
        // let req = JSON.parse(JSON.stringify(this.profileForm.value));
        // req['country'] = (this.profileForm.value.country);
        // req['title'] = parseInt(this.profileForm.value.title);
        // req['status'] = parseInt(this.profileForm.value.status);
        // delete req['importFile'];
        // //  req['date_of_birth']=formatDate(this.profileForm.value.date_of_birth, 'YYYY-MM-DD')
        // if (!this.imgObj.isLogoToUpdate) {
        //     req['image'] = this.userImage;
        // }
        // this.subs.sink = this.apiHandlerService.apiHandler('updateAgent', 'POST', '', '', { ...jsonData })
        this.subs.sink = this.apiHandlerService.apiHandler('updateAgent', 'POST', '', '', req)
            .subscribe(res => {
                if (res.statusCode == 201) {
                    if (this.imgObj.isLogoToUpdate) {
                        this.uploadImg();
                        this.submitted = false;

                    }
                    this.currentUser['first_name'] = req['first_name'];
                    this.currentUser['last_name'] = req['last_name'];
                    this.currentUser['phone'] = req['phone'];
                    this.swalService.alert.success("Profile updated successfully.");
                    setTimeout(() => {
                        this.update({ first_name: req['first_name'], last_name: req['last_name'], phone: req['phone'] });
                        // this.authService.logout();
                    }, 1000)

                } else {
                    // this.alertService.error(res.Message);
                    this.swalService.alert.error(res.Message);
                }
            });
    }

    update(value) {
        let prevData = this.currentUser;
        Object.keys(value).forEach(function (val, key) {

            prevData[val] = value[val];
        })
        sessionStorage.setItem('currentUser', JSON.stringify(prevData));
        this.authService.b2bUserSubject.next(JSON.parse(sessionStorage.getItem('currentUser')));
    }

    numbersOnly(event): boolean {
        return this.util.numberOnly(event);
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
    


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
