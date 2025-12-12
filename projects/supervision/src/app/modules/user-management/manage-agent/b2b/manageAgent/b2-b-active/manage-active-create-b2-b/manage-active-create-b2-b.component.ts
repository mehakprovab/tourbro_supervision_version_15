import { Component, OnDestroy, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from '../../../../../user-management.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { AppService } from 'projects/supervision/src/app/app.service';
import * as moment from 'moment';
import {
  CountryISO,
  SearchCountryField
} from "ngx-intl-tel-input";

@Component({
  selector: 'app-manage-active-create-b2-b',
  templateUrl: './manage-active-create-b2-b.component.html',
  styleUrls: ['./manage-active-create-b2-b.component.scss']
})
export class ManageActiveCreateB2BComponent implements OnInit, OnDestroy {
  @Output() b2bUserUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  subagentId;
  userTitleList: Array<any> = [];
  userTypeList: Array<any> = [];
  phoneCodeList: Array<any> = [];
  errorMessage = '';
  hide: boolean = false;
  currencyList: any;
  registerCountries: any[] = [];
  registerStates: any[] = [];
  registerCities: any[] = [];
  filteredStates: any[] = [];
  filteredCities: any[] = [];
  registerForm: FormGroup;
  regConfig: FormGroup;
  isOpen = false as boolean;
  setMinDate: any;
  addOrUpdate: string = '';
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'YYYY-MM-DD',
    rangeInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  maxDate = this.addYearsToDate(-12);
  countriesList = [];
  agentList = [];
  countryCode: string;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
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
  supplier_type:any;
  selectedCountry:any;
  //   apiList = [
  //     { id: 'ZBAPINO00002', name: 'Travelport',isChecked:false},
  //     { id: 'ZBAPINO00003', name: 'Amadeus',isChecked:false},
  //     { id: 'ZBAPINO00007', name: 'Sabre',isChecked:false},
  //     { id: 'ZBAPINO00008', name: 'US Bangla',isChecked:false },
  //     { id: 'ZBAPINO00009', name: 'Novo',isChecked:false },
  //     { id: 'ZBAPINO00010', name: 'Travelomatix',isChecked:false }
  // ];
  // hotelApiList = [
  //   { id: 'ZBAPINO00008', name: 'Hotel Beds',isChecked:true},
  //   { id: 'TLAPINO00004', name: 'Amadeus',isChecked:false},
  // ];
  noData: boolean = true;
  respData: any = [];
  hotelapiList: any = [];
  flightApiList: any = [];
  activityapiList: any = [];
  transferapiList: any = [];
  tourapiList: any = []
  selectedApiCheckboxes = [];
  selectedHotelCheckboxes = [];
  selectedActivityCheckboxes = [];
  selectedTransferCheckboxes = [];
  selectedTourCheckboxes = [];
  loading : boolean = false;
  loadingTemplate: any;
  secondaryColour: any;
  primaryColour: any;
  hsSelect: boolean = false;
  asSelect: boolean = false;
  tsSelect: boolean = false;
  hpsSelect: boolean = false;
  selectedSuppliers: any[] = [];
  supplier_type_name: any;
  selectAllCheck: Boolean = false;

  constructor(
    private router: Router,
    private userManagementService: UserManagementService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
     private activatedRoute: ActivatedRoute
  ) {
    this.countryCode = this.appService.countryId
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.supplier_type_name = params['supplier_type'];
      this.supplier_type = params['supplier_type'] == "DMC" ? 7 : GlobalConstants.B2B_AUTH_ROLE_ID;
  });
    this.listCountries();
    // this.listStates();
    this.listCities();
    this.getTitleList();
    this.getTypeList();
    this.createForm();
    this.createAgentForm();
    this.getPhoneCodeList();
    // this.getCountriesList();
    this.getAgentList();
    this.getCurrencyList();
    this.updateEmailControlState();
    // Wait for both flight and hotel lists to load before calling getToUpdate()
    Promise.all([
      this.loading = true,
      // this.listStates(),
      this.getFlightList('Flight').then((data) => {
        this.flightApiList = data;
      }),
      this.getFlightList('Hotel').then((data) => {
        this.hotelapiList = data;
      }),
      this.getFlightList('Activity').then((data) => {
        this.activityapiList = data;
      }),
      this.getFlightList('Transfer').then((data) => {
        this.transferapiList = data;
      }),
      this.getFlightList('Sightseeing').then((data) => {
        this.tourapiList = data;
      }),
    ]).then(() => {
      // Call getToUpdate only after both lists are loaded
      setTimeout(()=>{
        this.getToUpdate();
      },1500)
    }).catch(error => {
      console.error("Error loading API lists:", error);
    });
  }


  getCountriesList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
      this.countriesList = res.data.popular_countries.concat(res.data.countries);

    });
  }




  createAgentForm() {
    this.registerForm = this.fb.group({
      title: [''],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required]],
      business_name: ['', [Validators.required]],
      // business_number: [''],
      country_of_registartion: ['', [Validators.required]],
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
      payment_pref: this.supplier_type === 7 ? [] : ['', [Validators.required]],
      PhoneCode: ['', [Validators.required]],
      alterPhoneCode: ['', [Validators.required]],
      dir_phone_code: [''],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
      // business_phone: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(11)]],
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
      alter_email: ['', [Validators.required, Validators.email]],
      acc_email: ['', [Validators.required, Validators.email]],
      acc_tel_no: ['', [Validators.required]],
      password: [''],
      currency: ['',],
      affiliations: [''],
      affiliation_number: [''],
      confirm_password: new FormControl(''),
      address1: ['', [Validators.required]],
      address2: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip_code: ['', [Validators.required]],
      status: new FormControl('1', [Validators.required]),
      auth_role_id: new FormControl(GlobalConstants.B2B_AUTH_ROLE_ID, [Validators.required]),
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
      selectedSuppliers: [],
      supplier_type: []
    }, {
      validator: this.matchPassword
    });
  }

  updateEmailControlState() {
    if (this.addOrUpdate === 'update') {
      this.registerForm.get('email').disable();
    } else {
      this.registerForm.get('email').enable();
    }
  }


  // listStates() {
  //   this.apiHandlerService.apiHandler('registerState', 'POST', '', '', {})
  //     .subscribe(async res => {
  //       if (res.data) {
  //         this.registerStates = await res.data;
  //       } else {
  //         this.errorMessage = res.data.msg;
  //       }
  //     });
  // }

  listStates(country_code: string) {
    const payload = { country_code };
  
    this.apiHandlerService.apiHandler('registerState', 'POST', '', '', payload)
      .subscribe(res => {
        if (res.data) {
          this.registerStates = res.data;
          console.log('States List:', this.registerStates); // Debugging
  
          // ✅ Trigger change detection
          this.cdr.markForCheck();  
        } else {
          this.errorMessage = res.data.msg;
          this.registerStates = []; // Ensure list is cleared on error
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
    const countryCode = (event.target as HTMLSelectElement).value;
   
    console.log('Selected Country Code:', countryCode); // Debugging
  
    if (countryCode) {
      this.listStates(countryCode); // Fetch states based on selected country
    }
  
    // Reset state selection when country changes
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

  listCountries(): Promise<void> {
    return new Promise(resolve => {
      this.apiHandlerService.apiHandler('registerCountry', 'POST', '', '', {})
        .subscribe(res => {
          if (res.data) {
            this.registerCountries = res.data;
          }
          resolve();
        });
    });
  }


  getTitleList() {
    this.subSunk.sink = this.userManagementService.fetchTitleList()
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.userTitleList = resp.data.length
            ? resp.data.filter(item => item.pax_type === 'ADULT')
            : [];

        } else {
          this.swalService.alert.oops();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      })
  }
  getFlightList(moduleType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subSunk.sink = this.apiHandlerService.apiHandler("manageApiList", "post", {}, {}, { module_type: moduleType })
        .subscribe((resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.noData = false;
            this.respData = resp.data || [];
            resolve(this.respData);
          } else {
            this.noData = true;
            this.swalService.alert.error(resp.msg || "");
            reject(resp.msg || "Error fetching flight list");
          }
        }, (err) => {
          this.swalService.alert.oops(err.msg || "");
          reject(err.msg || "Error fetching flight list");
        });
    });
  }

  getTypeList() {
    this.subSunk.sink = this.userManagementService.getUserTypeList()
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.userTypeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

        } else {
          this.swalService.alert.oops();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      })
  }

  createForm() {
    this.regConfig = this.fb.group({
      id: new FormControl(''),
      uuid: new FormControl(''),
      business_name: new FormControl(''),
      iata: new FormControl(''),
      business_phone: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl(''),
      last_name: new FormControl('', [Validators.required]),
      country: new FormControl(this.countryCode, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl(''),
      confirm_password: new FormControl(''),
      phone_code: new FormControl(this.countryCode, [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      //date_of_birth: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip_code: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this.utility.regExp.numbOnly)]),
      status: new FormControl('1', [Validators.required]),
      auth_role_id: new FormControl(GlobalConstants.B2B_AUTH_ROLE_ID, [Validators.required]),
      // api_list: this.formBuilder.array([]),
      // hotel_list:this.formBuilder.array([]),
      agent_group_id: new FormControl(0),
      // hotel_api_list:this.formBuilder.array([])
    },
      {
        validator: this.matchPassword
      });
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

  convertToArray(value: any): string[] {
  if (!value) return [];
  return value.split(',').map(v => v.trim());
}

updateSelectAllStatus() {
  this.selectAllCheck = Object.values(this.apiGroups)
    .every((list: any) => list.length > 0 && list.every(api => api.isChecked));
}
public apiGroups: any;
  getToUpdate() {
    this.loading = true;
    this.subSunk.sink = this.userManagementService.b2bUserUpdateData.subscribe(async data => {
      if (!this.utility.isEmpty(data)) {
        this.addOrUpdate = 'update';
        this.updateEmailControlState();
        if(data.license){
          this.showAffiliationNumber = true;
        } 
        
        // Ensure countries are loaded before proceeding
        if (!this.registerCountries || this.registerCountries.length === 0) {
          await this.listCountries(); // Wait for countries to be loaded
        }
  
        // Find the country object based on ID
        console.log("supplier_type",this.supplier_type)
        if(this.supplier_type == 7){
          this.selectedCountry = this.registerCountries.find(country => country.id === parseInt(data.country)); 
       }else{
         this.selectedCountry = this.registerCountries.find(country => country.id === data.country);
 
       }
        // const selectedCountry = this.registerCountries.find(country => country.id === data.country);
  
        if (this.selectedCountry) {
          this.registerForm.patchValue(
            {
              country: this.selectedCountry.sortname, // Patch sortname
            },
            { emitEvent: false }
          );
  
          await this.listStates(this.selectedCountry.sortname); // Fetch states based on country sortname
        }
  
        // Wait for states to be fetched, then patch the state
        setTimeout(() => {
          this.registerForm.patchValue(
            {
              state: data.state ? data.state : '',
            },
            { emitEvent: false }
          );
        }, 300);
    
          const selectedAPIs = {
    flight: this.convertToArray(data.api_list),
    hotel: this.convertToArray(data.hotel_api_list),
    activity: this.convertToArray(data.activity_api_list),
    transfer: this.convertToArray(data.transfer_api_list),
    tour: this.convertToArray(data.holiday_api_list)
  };

  // 2️⃣ Assign API groups
  this.apiGroups = {
    flight: this.flightApiList,
    hotel: this.hotelapiList,
    activity: this.activityapiList,
    transfer: this.transferapiList,
    tour: this.tourapiList
  };

  // 3️⃣ Apply checked values
  Object.keys(this.apiGroups).forEach(group => {
    const list = this.apiGroups[group];
    const selectedKeys = selectedAPIs[group];

    list.forEach(api => {
      api.isChecked = selectedKeys.includes(api.source_key);
    });
  });

  // 4️⃣ Update Select All status
  this.updateSelectAllStatus();

        // this.filteredStates = await this.registerStates.filter(state => state.country_id == data.country);
        this.cdr.detectChanges();
        this.registerForm.patchValue({
          id: data.id ? data.id : '',
          uuid: data.uuid ? data.uuid : '',
          business_name: data.business_name ? data.business_name : '',
          business_phone: data.business_phone ? data.business_phone : '',
          iata: data.iata ? data.iata : '',
          title: data.title ? data.title : '',
          first_name: data.first_name ? data.first_name : '',
          middle_name: data.middle_name ? data.middle_name : '',
          last_name: data.last_name ? data.last_name : '',
          email: data.email ? data.email : '',
          country_name: data.country_name ? data.country_name : '',
          phone_code: data.phone_code ? data.phone_code : '',
          phone: data.phone ? data.phone : '',
          // country: data.country ? data.country : '',
          address1: data.address1 ? data.address1 : '',
          address2: data.address2 ? data.address2 : '',
          city: data.city ? data.city : '',
          state: data.state ? data.state : '',
          zip_code: data.zip_code ? data.zip_code : '',
          agent_group_id: data.agent_group_id ? data.agent_group_id : 0,
          license: data.license ? data.license : '',
          auth_role_id: data.auth_role_id ? data.auth_role_id : '',
          business_number: data.business_number ? data.business_number : '',
          date_of_birth: data.date_of_birth ? data.date_of_birth : '',
          image: data.image ? data.image : '',
          address: data.address ? data.address : '',
          core_city_id: data.core_city_id ? data.core_city_id : '',
          privilege_access: data.privilege_access ? data.privilege_access : '',
          socialuserid: data.socialuserid ? data.socialuserid : '',
          user_type: data.user_type ? data.user_type : '',
          created_by_id: data.created_by_id ? data.created_by_id : '',
          created_at: data.created_at ? data.created_at : '',
          updated_at: data.updated_at ? data.updated_at : '',
          agent_balance: data.agent_balance ? data.agent_balance : '',
          credit_limit: data.credit_limit ? data.credit_limit : '',
          due_amount: data.due_amount ? data.due_amount : '',
          expire_time: data.expire_time ? data.expire_time : '',
          currency_id: data.currency_id ? data.currency_id : '',
          currency_name: data.currency_name ? data.currency_name : '',
          affiliation_number: data.affiliation_number ? data.affiliation_number : '',
          affiliations: data.affiliations ? data.affiliations : '',
          api_list: data.api_list ? data.api_list : '',
          hotel_api_list: data.hotel_api_list ? data.hotel_api_list : '',
          activity_api_list: data.activity_api_list ? data.activity_api_list : '',
          transfer_api_list: data.transfer_api_list ? data.transfer_api_list : '',
          business_trade_name: data.business_trade_name ? data.business_trade_name : '',
          registered_legal_name: data.registered_legal_name ? data.registered_legal_name : '',
          business_chain_name: data.business_chain_name ? data.business_chain_name : '',
          business_website: data.business_website ? data.business_website : '',
          registration_number: data.registration_number ? data.registration_number : '',
          country_of_registartion: data.country_of_registartion ? data.country_of_registartion : '',
          tax_reg_no: data.tax_reg_no ? data.tax_reg_no : '',
          payment_pref: data.payment_pref ? data.payment_pref : '',
          acc_email: data.acc_email ? data.acc_email : '',
          bank_name: data.bank_name ? data.bank_name : '',
          branch_addrs: data.branch_addrs ? data.branch_addrs : '',
          acc_holder_name: data.acc_holder_name ? data.acc_holder_name : '',
          acc_number: data.acc_number ? data.acc_number : '',
          iban: data.iban ? data.iban : '',
          swift_code: data.swift_code ? data.swift_code : '',
          office_number: data.office_number ? data.office_number : '',
          currency: data.currency ? data.currency : '',
          alter_email: data.alter_email ? data.alter_email : '',
          PhoneCode: data.PhoneCode ? data.PhoneCode.replace('+', '') : '',
          alterPhoneCode: data.alterPhoneCode ? data.alterPhoneCode.replace('+', '')  : '',
          dir_phone_code: data.dir_phone_code ? data.dir_phone_code.replace('+', '')  : '',
          acc_tel_no: data.acc_tel_no ? data.acc_tel_no : '',
          dir_title: data.dir_title ? data.dir_title : '1',
          dir_email: data.dir_email ? data.dir_email : '',
          acc_title: data.acc_title ? data.acc_title : '',
          acc_name: data.acc_name ? data.acc_name : '',
          dir_name: data.dir_name ? data.dir_name : '',
          dir_contact: data.dir_contact ? data.dir_contact : '',
          holiday_api_list: data.holiday_api_list ? data.holiday_api_list : '',
          password: '1234',
          confirm_password: '1234',
          //date_of_birth: data.date_of_birth ? data.date_of_birth : '',
          status: data.status == 1 ? '1' : '0',
          supplier_type: data.supplier_type ? data.supplier_type : '',
          // supplierCurrency: data.currency ? data.currency : '',

        }, { emitEvent: false })
        if(data.selectedSuppliers) {
          const selectedSuppliers = data.selectedSuppliers.split(',');
        
          selectedSuppliers.forEach(s => {
            const flag = this.toggleSupplierByName(s.trim());
            console.log(s, flag);
          });

          const selectedSuppliersList = data.selectedSuppliers.split(',');
          const codeMap: { [key: string]: string } = {
            Hotel: 'HS',
            Activity: 'AS',
            Transfer: 'TS',
            Tour: 'HPS'
          };
          this.selectedSuppliers = selectedSuppliersList.map(code => codeMap[code] || code);
        }
        
        //   const property = codeMap[supplierType];
        // const selectedSuppliersList = selectedSuppliers.map(code => codeMap[code] || code);
        // console.log(selectedSuppliersList)
        if (data) {
          this.selectedApiCheckboxes = data.api_list ? data.api_list.replace(/^,/, '').split(',') : [];
          this.selectedHotelCheckboxes = data.hotel_api_list ? data.hotel_api_list.split(',') : [];
          this.selectedActivityCheckboxes = data.activity_api_list ? data.activity_api_list.replace(/^,/, '').split(',') : [];
          this.selectedTransferCheckboxes = data.transfer_api_list ? data.transfer_api_list.replace(/^,/, '').split(',') : [];
          this.selectedTourCheckboxes = data.holiday_api_list ? data.holiday_api_list.split(',') : [];
      } else {
          this.selectedApiCheckboxes = [];
          this.selectedHotelCheckboxes = [];
          this.selectedActivityCheckboxes = [];
          this.selectedTransferCheckboxes = [];
          this.selectedTourCheckboxes = [];
      }

        this.hotelapiList.forEach(module => {
          if (this.selectedHotelCheckboxes.includes(module.source_key)) {
            if (data.status == 1 || data.status == 0) {
              module.isChecked = true;
            } else {
              module.isChecked = false;
            }
          }
        });
        this.flightApiList.forEach(api => {
          if (this.selectedApiCheckboxes.includes(api.source_key)) {
            if (data.status == 1 || data.status == 0) {
              api.isChecked = true;
            } else {
              api.isChecked = false;
            }
          }
        });
        this.activityapiList.forEach(api => {
          if (this.selectedActivityCheckboxes.includes(api.source_key)) {
            if (data.status == 1 || data.status == 0) {
              api.isChecked = true;
            } else {
              api.isChecked = false;
            }
          }
        });
        this.transferapiList.forEach(api => {
          if (this.selectedTransferCheckboxes.includes(api.source_key)) {
            if (data.status == 1 || data.status == 0) {
              api.isChecked = true;
            } else {
              api.isChecked = false;
            }
          }
        });
        this.tourapiList.forEach(api => {
          if (this.selectedTourCheckboxes.includes(api.source_key)) {
            if (data.status == 1 || data.status == 0) {
              api.isChecked = true;
            } else {
              api.isChecked = false;
            }
          }
        });
      } else {
        this.addOrUpdate = 'add';
        this.updateEmailControlState();
      }

      // this.makePasswordRequired();
    })
    this.loading = false;
  }

  toggleSupplierByName(supplierName: string) {
    let flag = false;

    const codeMap: { [key: string]: string } = {
      Hotel: 'hsSelect',
      Activity: 'asSelect',
      Transfer: 'tsSelect',
      Tour: 'hpsSelect'
    };

    const property = codeMap[supplierName];

    if (property) {
      this[property] = !this[property];
      flag = this[property];
    }

    return flag;
  }


  numbersOnly(event): boolean {
    return this.utility.numberOnly(event);
}

  makePasswordRequired() {
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirm_password');
    if (this.addOrUpdate == 'add') {
      password.setValidators([Validators.required]);
      confirmPassword.setValidators([Validators.required]);
      confirmPassword.setErrors({ matchPassword: true });
    } else {
      password.clearValidators();
      confirmPassword.clearValidators();
      confirmPassword.setErrors(null)
    }
    password.updateValueAndValidity();
    confirmPassword.updateValueAndValidity();
  }

  getPhoneCodeList() {
    this.subSunk.sink = this.userManagementService.fetchPhoneCodeList()
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.phoneCodeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

        } else {
          this.swalService.alert.oops();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      })
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    const currentDomainUser = localStorage.getItem('currentDomainUser');
    const authUser = JSON.parse(currentDomainUser)['auth_role_id'];
    if(this.selectedSuppliers.length === 0 && authUser === 3 && this.supplier_type_name === 'DMC') {
      this.swalService.alert.oops('Please Select at least one Service');
      return ;
    }

    this.registerForm.get('email').enable();
    let req = JSON.parse(JSON.stringify(this.registerForm.value));

    const selectedCountry = this.registerCountries.find(
      (country) => country.sortname === req['country']
    );
    req['country'] = selectedCountry ? String(selectedCountry.id) : null;

    req['auth_role_id'] = this.supplier_type;
    req['title'] = parseInt(req['title']);
    req['zip_code'] = (req['zip_code']);
    req['api_list'] = this.selectedApiCheckboxes.join(',');
    req['hotel_api_list'] = this.selectedHotelCheckboxes.join(',');
    req['activity_api_list'] = this.selectedActivityCheckboxes.join(',');
    req['holiday_api_list'] = this.selectedTourCheckboxes.join(',');
    req['transfer_api_list'] = this.selectedTransferCheckboxes.join(',');
    this.loading = true;
    switch (this.addOrUpdate) {
      case 'add':
        delete req.uuid;
        delete req.id;
        delete req.confirm_password;
        delete req.password;
        const codeMap: { [key: string]: string } = {
          HS: 'Hotel',
          AS: 'Activity',
          TS: 'Transfer',
          HPS: 'Tour'
        };
        req['selectedSuppliers'] = this.selectedSuppliers.map(code => codeMap[code] || code).join(',');
        this.subSunk.sink = this.userManagementService.addUsers(req)
          .subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
              this.loading = false;
              this.swalService.alert.success("User added successfully.");
              this.registerForm.reset();
              this.b2bUserUpdate.emit({ tabId: 'b2cUsers_list' });
            } else {
              this.loading = false;
              this.swalService.alert.oops("Unable to create user.");
            }
          }, (err: HttpErrorResponse) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
          });
        break;

      case 'update':
        if (req.password === '1234' && req.confirm_password === '1234') {
          delete req.password;
          delete req.confirm_password;
        }
        delete req.password;
        delete req.confirm_password;
        const codeMap1: { [key: string]: string } = {
          HS: 'Hotel',
          AS: 'Activity',
          TS: 'Transfer',
          HPS: 'Tour'
        };
        req['selectedSuppliers'] = this.selectedSuppliers.map(code => codeMap1[code] || code).join(',');
        this.subSunk.sink = this.userManagementService.updateUsers(req)
          .subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
              this.loading = false;
              resp.password = '1234';
              resp.confirm_password = '1234';
              this.swalService.alert.success("User updated successfully.");
              this.registerForm.reset();
              this.b2bUserUpdate.emit({ tabId: 'b2cUsers_list' });
            } else {
              this.loading = false;
              this.swalService.alert.oops("Unable to update user.");
            }
          }, (err: HttpErrorResponse) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
          });
        break;

      default:
        break;
    }
  }


  omitSpecialCharacters(event) {
    return this.utility.omitSpecialCharacters(event);
  }


  addYearsToDate(y: number) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year + y, month, day);
    return c;
  }

  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
  }

  onReset() {
    this.userManagementService.b2bUserUpdateData.next({});
    this.registerForm.reset();
    this.addOrUpdate = 'add';
  }

  // onCheckBoxChange(e) {
  //     const api_list: FormArray = this.registerForm.get('api_list') as FormArray;
  //     if (e.target.checked) {
  //         api_list.push(new FormControl(e.target.value));
  //     } else {
  //         let i = 0;
  //         api_list.controls.forEach((item: FormControl) => {
  //             if (item.value === e.target.value) {
  //                 api_list.removeAt(i);
  //                 return;
  //             }
  //             i++;
  //         });
  //     }
  // }
  onApiCheckBoxChange(checked: Boolean, inclusion: String) {
    console.log("this.selectedApiCheckboxes.length", this.selectedApiCheckboxes.length)
    if (checked) {
      if (this.selectedApiCheckboxes.length === 0 || !this.selectedApiCheckboxes.includes(inclusion)) {
        this.selectedApiCheckboxes.push(inclusion);
      }
    } else {
      const index = this.selectedApiCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedApiCheckboxes.splice(index, 1);
      }
    }
  }
  public disableHotelSelection: boolean = false;
  onHotelCheckBoxChangeSelectAll(isChecked: Boolean) {
   
    this.selectedHotelCheckboxes.join(',');
    this.selectedActivityCheckboxes.join(',');
    this.selectedTourCheckboxes.join(',');
    this.selectedTransferCheckboxes.join(',');

    // Flight
    this.flightApiList.forEach(api => {
      api.isChecked = isChecked;
      if(isChecked) {
        if (!this.selectedApiCheckboxes.includes(api.source_key)) {
          this.selectedApiCheckboxes.push(api.source_key);
        }
      } else {
        const index = this.selectedApiCheckboxes.indexOf(api.source_key);
        if (index >= 0) {
          this.selectedApiCheckboxes.splice(index, 1);
        }
      }
      
    });

    // Hotel
    this.hotelapiList.forEach(api => {
      api.isChecked = isChecked;
      if(isChecked) {
        if (!this.selectedHotelCheckboxes.includes(api.source_key)) {
          this.selectedHotelCheckboxes.push(api.source_key);
        }
      } else {
        const index = this.selectedHotelCheckboxes.indexOf(api.source_key);
        if (index >= 0) {
          this.selectedHotelCheckboxes.splice(index, 1);
        }
      }
     
    });

    // Activity
    this.activityapiList.forEach(api => {
      api.isChecked = isChecked;
      if(isChecked) {
        if (!this.selectedActivityCheckboxes.includes(api.source_key)) {
          this.selectedActivityCheckboxes.push(api.source_key);
        }
      } else {
        const index = this.selectedActivityCheckboxes.indexOf(api.source_key);
        if (index >= 0) {
          this.selectedActivityCheckboxes.splice(index, 1);
        }
      }
    });

    // Transfer
    this.transferapiList.forEach(api => {
      api.isChecked = isChecked;
      if(isChecked) {
        if (!this.selectedTransferCheckboxes.includes(api.source_key)) {
          this.selectedTransferCheckboxes.push(api.source_key);
        }
      } else {
        const index = this.selectedTransferCheckboxes.indexOf(api.source_key);
        if (index >= 0) {
          this.selectedTransferCheckboxes.splice(index, 1);
        }
      }
    });

    // Tour
    this.tourapiList.forEach(api => {
      api.isChecked = isChecked;
      if(isChecked) {
        if (!this.selectedTourCheckboxes.includes(api.source_key)) {
          this.selectedTourCheckboxes.push(api.source_key);
        }
      } else {
        const index = this.selectedTourCheckboxes.indexOf(api.source_key);
        if (index >= 0) {
          this.selectedTourCheckboxes.splice(index, 1);
        }
      }
    });
    this.selectAllCheck = isChecked;
  }

  onHotelCheckBoxChange(checked: Boolean, inclusion: String) {
    console.log("inclusion", inclusion)
    
    if (checked) {
      console.log("selectedHotelCheckboxes", this.selectedHotelCheckboxes)
      if (!this.selectedHotelCheckboxes.includes(inclusion)) {
        this.selectedHotelCheckboxes.push(inclusion);
      }
    } else {
      console.log("this.selectedHotelCheckboxes", this.selectedHotelCheckboxes)
      const index = this.selectedHotelCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedHotelCheckboxes.splice(index, 1);
      }
    }
  }
  onActivityCheckBoxChange(checked: Boolean, inclusion: String) {
    if (checked) {
      if (this.selectedActivityCheckboxes.length === 0 || !this.selectedActivityCheckboxes.includes(inclusion)) {
        this.selectedActivityCheckboxes.push(inclusion);
      }
    } else {
      const index = this.selectedActivityCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedActivityCheckboxes.splice(index, 1);
      }
    }
  }
  onTransferCheckBoxChange(checked: Boolean, inclusion: String) {
    if (checked) {
      if (this.selectedTransferCheckboxes.length === 0 || !this.selectedTransferCheckboxes.includes(inclusion)) {
        this.selectedTransferCheckboxes.push(inclusion);
      }
    } else {
      const index = this.selectedTransferCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedTransferCheckboxes.splice(index, 1);
      }
    }
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

  onTourCheckBoxChange(checked: Boolean, inclusion: String) {
    if (checked) {
      if (this.selectedTourCheckboxes.length === 0 || !this.selectedTourCheckboxes.includes(inclusion)) {
        this.selectedTourCheckboxes.push(inclusion);
      }
    } else {
      const index = this.selectedTourCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedTourCheckboxes.splice(index, 1);
      }
    }
  }
  //   onHotelCheckBoxChange(e) {
  //     const api_list: FormArray = this.registerForm.get('hotel_api_list') as FormArray;
  //     if (e.target.checked) {
  //         api_list.push(new FormControl(e.target.value));
  //     } else {
  //         let i = 0;
  //         api_list.controls.forEach((item: FormControl) => {
  //             if (item.value === e.target.value) {
  //                 api_list.removeAt(i);
  //                 return;
  //             }
  //             i++;
  //         });
  //     }
  // }

  setSelectedApi(data) {
    if (data.api_list) {
      let setSelectedApiList = data.api_list.split(",");
      const api_list: FormArray = this.registerForm.get('api_list') as FormArray;
      for (let api of setSelectedApiList) {
        api_list.push(new FormControl(api));
        console.log("this.respData ff", this.respData)
        let setSelectedAp = this.respData.find(el => (el.source_key == api));
        console.log("setSelectedAp", setSelectedAp)
        if (setSelectedAp)
          setSelectedAp.isChecked = true;
      }
    }
  }

  setHotelSelectedApi(data: any) {
    // Parse the api_list JSON string
    const apiList = JSON.parse(data.api_list.replace(/'/g, '"'));
    console.log("apiList", apiList)
    // Extract flight and hotel values
    const flightApi = apiList.flight ? [apiList.flight] : [];
    const hotelApis = apiList.hotel ? apiList.hotel.split(',') : [];

    // Patch values to the flight and hotel checkbox FormArrays
    this.patchFormArrayValues('api_list', flightApi);
    this.patchFormArrayValues('hotel_list', hotelApis);
  }

  patchFormArrayValues(formArrayName: string, values: string[]) {
    const formArray: FormArray = this.registerForm.get(formArrayName) as FormArray;

    // Clear any existing values in the FormArray
    formArray.clear();

    // Add each value from the parsed data
    values.forEach(value => {
      formArray.push(new FormControl(value));
    });
    console.log("formArrayName", formArrayName)
    console.log("flightApiList", this.flightApiList)

    if (formArrayName === 'api_list') {
      this.getFlightList("Flight");
      this.flightApiList.forEach(api => {
        console.log("api 1", api)
        api.isChecked = values.includes(api.source_key);
      });
    } else if (formArrayName === 'hotel_list') {
      this.getFlightList("Hotel");
      this.hotelapiList.forEach(api => {
        console.log("api 2", api)
        api.isChecked = values.includes(api.source_key);
      });
    }


  }

  getAgentList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', '', '',{status: 1}).subscribe(res => {
      this.agentList = res.data;

    });
  }
  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }

  // onSupplierSelect(supplierType) {
  //   let flag = false;

  //   if (supplierType === 'HS') {
  //     this.hsSelect = !this.hsSelect;
  //     flag = this.hsSelect;
  //   }
  //   if (supplierType === 'AS') {
  //     this.asSelect = !this.asSelect;
  //     flag = this.asSelect;
  //   }
  //   if (supplierType === 'TS') {
  //     this.tsSelect = !this.tsSelect;
  //     flag = this.tsSelect;
  //   }
  //   if (supplierType === 'HPS') {
  //     this.hpsSelect = !this.hpsSelect;
  //     flag = this.hpsSelect;
  //   }
  //   if (!this.selectedSuppliers.includes(supplierType)) {
  //     this.selectedSuppliers.push(supplierType);
  //   }
  // }

  onSupplierSelect(supplierType: string) {
  // toggle the boolean manually
  if (supplierType === 'HS') this.hsSelect = !this.hsSelect;
  if (supplierType === 'AS') this.asSelect = !this.asSelect;
  if (supplierType === 'TS') this.tsSelect = !this.tsSelect;
  if (supplierType === 'HPS') this.hpsSelect = !this.hpsSelect;

  // now update selectedSuppliers array
  this.updateSelectedSuppliers(supplierType);
}

onSupplierCheckboxChange(supplierType: string, event: any) {
  // event.target.checked gives true/false directly
  if (supplierType === 'HS') this.hsSelect = event.target.checked;
  if (supplierType === 'AS') this.asSelect = event.target.checked;
  if (supplierType === 'TS') this.tsSelect = event.target.checked;
  if (supplierType === 'HPS') this.hpsSelect = event.target.checked;

  this.updateSelectedSuppliers(supplierType);
}

updateSelectedSuppliers(supplierType: string) {
  const isSelected =
    (supplierType === 'HS' && this.hsSelect) ||
    (supplierType === 'AS' && this.asSelect) ||
    (supplierType === 'TS' && this.tsSelect) ||
    (supplierType === 'HPS' && this.hpsSelect);

  const index = this.selectedSuppliers.indexOf(supplierType);

  if (isSelected && index === -1) {
    this.selectedSuppliers.push(supplierType);
  } else if (!isSelected && index > -1) {
    this.selectedSuppliers.splice(index, 1);
  }

  console.log('Selected Suppliers:', this.selectedSuppliers);
}

}
