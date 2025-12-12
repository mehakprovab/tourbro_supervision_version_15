import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { AdministratorService } from '../../administrator.service';

@Component({
  selector: 'app-add-traveller',
  templateUrl: './add-traveller.component.html',
  styleUrls: ['./add-traveller.component.scss']
})
export class AddTravellerComponent implements OnInit, OnDestroy {
  addTravellerForm: FormGroup;
  userTitleList: Array<any> = [];
  phoneCodeList: Array<any> = [];
  private subSunk = new SubSink();
  addOrUpdate: string;
  staticCountries = [];
  protected subs = new SubSink();
  country = [];
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeeks: false
  };
  maxDate = new Date();
  MaxDateForPassPort: string;
  isOpen = false as boolean;
  minDate = new Date();
  countryCode: any;
  countryList: any = [];
  public state = false;
 
  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private administratorService: AdministratorService,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private location: Location,
    private utility: UtilityService,
    public datepipe: DatePipe
  ) { }
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  ngOnInit() {
    // this.maxDate.setDate(this.maxDate.getDate() - (18 * 356));
    // this.minDate = moment(new Date()).format('YYYY-MM-DD')
    this.MaxDateForPassPort = "2035-09-08"
    this.addOrUpdate = 'add';
    this.createForm();
    this.getTitleList();
    this.getPhoneCodeList();
    this.getCountriesList();
    this.getTravellerUpdateData();

  }

  getCountriesList() {
    this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
      this.staticCountries = res.data.popular_countries.concat(res.data.countries);
      this.country = this.staticCountries.map(item => item.code);
    });
  }

  getTravellerUpdateData() {
    this.subs.sink = this.administratorService.travellerUpdateData.subscribe((params) => {

      if (!this.utility.isEmpty(params)) {
        this.addOrUpdate = 'update';
        this.addTravellerForm.patchValue({
          id: params.id ? params.id : '',
          title: params.title ? params.title : '',
          first_name: params.first_name ? params.first_name : '',
          middle_name: params.middle_name ? params.middle_name : '',
          last_name: params.last_name ? params.last_name : '',
          email: params.email ? params.email : '',
          //date_of_birth: params.date_of_birth ? params.date_of_birth : '',
          phone_number: params.phone_number ? params.phone_number : '',
          phone_code: params.phone_code ? params.phone_code : '',
          address: 'Bangalore',
          address1: 'Bangalore',
          city: 'Banaglore',
          state: '9583422512',
          country: params.country ? params.country : '',
          postal_code: '560100',
          gender: params.gender ? params.gender : '',
          passport_no: params.passport_no ? params.passport_no : '',
          issuing_country: params.issuing_country ? params.issuing_country : '',
          passport_expiry: params.passport_expiry ? params.passport_expiry : '',

        })
        if (params.co_travellers) {
          this.patchCotravellers(params.co_travellers);
        }
      }
    })
  }

  patchCotravellers(travellers) {
    travellers.forEach((item) => {
      this.addMoreTravellers();
    });
    this.cotraveller.patchValue(travellers);
  }

  getTitleList() {
    this.subSunk.sink = this.administratorService.fetchTitleList()
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.userTitleList = resp.data.length ? resp.data : this.administratorService.isDevelopement;

        } else {
          this.swalService.alert.oops();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      })
  }

  getPhoneCodeList() {
    this.subSunk.sink = this.administratorService.fetchPhoneCodeList()
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.phoneCodeList = resp.data.length ? resp.data : this.administratorService.isDevelopement;

        } else {
          this.swalService.alert.oops();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      })
  }

  createForm() {
    this.addTravellerForm = this.fb.group({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl(''),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      //date_of_birth: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      phone_code: new FormControl('44'),
      gender: new FormControl('', Validators.required),
      passport_no: new FormControl('', Validators.required),
      issuing_country: new FormControl('GBR', Validators.required),
      passport_expiry: new FormControl('', Validators.required),
      address: new FormControl('', [Validators.required]),
      address1: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('GBR', [Validators.required]),
      postal_code: new FormControl(''),
      co_travellers: this.fb.array([]),
    });
  }
  onItemSelect(item: any) {
    this.countryList.push(item);
  }
  getCountryCodeList(ids) {
    return this.staticCountries.filter(item => ids.includes(item.code));
  }
  get cotraveller(): FormArray {
    return this.addTravellerForm.get('co_travellers') as FormArray;
  }
  co_travellers(): FormArray {
    return this.addTravellerForm.get("co_travellers") as FormArray
  }
  moreTravellers(): FormGroup {
    return this.fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      //date_of_birth: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
    })
  }
  addMoreTravellers() {
    this.co_travellers().push(this.moreTravellers());
  }
  removeTraveller(i: number) {
    this.co_travellers().removeAt(i);
  }

  onAddTraveller() {
    this.patchDefaultValues();
    if (this.addTravellerForm.invalid) {
      return;
    }
    let req = JSON.parse(JSON.stringify(this.addTravellerForm.value));
    //req['date_of_birth']=this.datepipe.transform(this.addTravellerForm.controls['date_of_birth'].value, 'yyyy-MM-dd');
    req['passport_expiry']=this.datepipe.transform(this.addTravellerForm.controls['passport_expiry'].value, 'yyyy-MM-dd');
    switch (this.addOrUpdate) {
      case 'add':
        // delete req.passport_no;
        // delete req.passport_expiry;
        const request = {
          // id: req.id,
          title: req.title,
          first_name: req.first_name,
          middle_name: req.middle_name,
          last_name: req.last_name,
          email: req.email,
          //date_of_birth: req['date_of_birth'],
          phone_number: req.phone_number,
          phone_code: req.phone_code,
          gender: req.gender,
          passport_no: req.passport_no,
          issuing_country: req.issuing_country,
          passport_expiry: req.passport_expiry,
          address: 'House 11/B Road; 130 Gulshan-1',
          address1: 'House 11/B Road; 130 Gulshan-1',
          city: 'Gulshan Dhaka',
          state: '9583422512',
          country: req.country,
          postal_code: '1212',
          co_travellers: req.co_travellers
        }
        this.subSunk.sink = this.administratorService.addTraveller(request)
          .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Traveller added successfully.");
              this.addTravellerForm.reset();
              this.location.back();
            } else {
              this.swalService.alert.success("Traveller added successfully.");
              this.addTravellerForm.reset();
              this.location.back()
            }
          }, (err: HttpErrorResponse) => {
            console.log("err",err)
            if (err.error.Message == "403 Email already exists!") {
              this.swalService.alert.oops("Email Already Exists!");
          }else{
              this.swalService.alert.oops(err.error.Message);
          }
          })
        break;
      case 'update':
        const response = {
          id: req.id,
          title: req.title,
          first_name: req.first_name,
          middle_name: req.middle_name,
          last_name: req.last_name,
          email: req.email,
          //date_of_birth: req['date_of_birth'],
          phone_number: req.phone_number,
          phone_code: req.phone_code,
          gender: req.gender,
          passport_no: req.passport_no,
          issuing_country: req.issuing_country,
          passport_expiry: req.passport_expiry,
          address: 'House 11/B Road; 130 Gulshan-1',
          address1: 'House 11/B Road; 130 Gulshan-1',
          city: 'Gulshan Dhaka',
          state: '9583422512',
          country: req.country,
          postal_code: '1212',
          co_travellers: req.co_travellers
        }
        this.subSunk.sink = this.administratorService.updateTraveller(response)
          .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Traveller updated successfully.");
              this.addTravellerForm.reset();
              this.location.back();
            } else {
              this.swalService.alert.oops();
            }
          }, (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops();
          })
        break;
      default:
        break;
    }
  }

  patchDefaultValues(){
    this.addTravellerForm.patchValue({
        address: 'Bangalore',
        city: 'Banaglore',
        state: '9583422512',
      })
  }

  goBack() {
    this.location.back();
    this.addTravellerForm.reset();
    this.addOrUpdate = "add";
  }

  onReset() {
    this.addTravellerForm.reset();
    this.addOrUpdate = "add";
    this.administratorService.travellerUpdateData.next({});
  }

  numberOnly(event): boolean {
    // this.openCustomdropdown=false;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  
  alphaNumberOnly (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

  omitSpecialCharacters(event) {
    let k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
