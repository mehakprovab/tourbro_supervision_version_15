import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { TourService } from '../../../tour.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ThemeOptions } from 'projects/b2b/src/app/theme-options';

const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-tour-final-booking',
  templateUrl: './tour-final-booking.component.html',
  styleUrls: ['./tour-final-booking.component.scss']
})
export class TourFinalBookingComponent implements OnInit {

  bannerImageUrl = `${baseUrl}/sa/tour/tours/getBannerImage/`;
  bookingContactForm: FormGroup
  couponInfoForm: FormGroup
  preBookingInfo: any
  PaxDetails: any;
  titleList: any;
  tourData: any;
  showWarning: boolean = false;
  adultPrice: any = 0;
  childPrice: any = 0;
  noOfAdult: number = 0;
  noOfChild: number = 0;
  addChild: boolean = false;
  adultForms: FormGroup[] = [];
  childForms: FormGroup[] = [];
  tourDetailsName = [
    { name: 'No of Guest', value: 'NoOfGuest' },
    { name: 'No of Adult', value: 'NoOfAdults' },
    { name: 'No of Children', value: 'NoOfChild' },
    { name: 'Check-in Date', value: 'CheckInDate' },
    { name: 'Total Price', value: 'TotalPrice' },
    { name: 'Taxes&Service fee', value: 'TaxesAndServiceFee' },
    { name: 'Convenience fee', value: 'ConvenienceFee' },
    { name: 'Grand Total', value: 'GrandTotal' },
  ]
  saluations = ['Mr', 'Ms', 'Mrs'];
  countries: Array<any> = [];
  phoneCodes: any
  submitted: boolean = false;
  showAdultForm: boolean = true;
  showChildForm: boolean = false;
  subSunk = new SubSink();
  maxDateAdult: Date;
  minChildDate: Date;
  maxChildDate: Date;
  minDate = new Date();
  datesEnabled = []
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-default',
  };
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false,
    datesEnabled: this.datesEnabled
  };
  isLoading: boolean = false;
  formGroup: FormGroup;
  hideOther: boolean = false;
  maxDate = new Date();
  minDateAdult: any;
  appReference: any;
  state: { [k: string]: any; };
  maxDateChild: Date;
  minDateChild: Date;
  tourValuation: any;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  loading: boolean;
  bookingFields: any;
  guestInfoFields: any;
  bookingFieldForm: FormGroup;
  txtCouponCodeValue: string = ''; // Variable to hold the input value
  disableApplyPromo: boolean = false;
  selectedPromocode = '';
  promocodeList: any = [];
  promocode: any;
  discount_value: number = 0.00;
  totalDisplayFare = 0.00;
  currentUser: any;

  showTermsPopup = false;
  agreedInPopup = false;

  bookingForm: FormGroup;
  formValuesData: any;
  genderList: any[] = [];
  childTitles: any[] = [];
  priceBreakDownData: any;
  bedPreference = [{
    title: 'Single Bed'

  }, { title: 'Twin Bed' }]
  showMandatoty: boolean = false;
  stateCopy: any;
  optional_tours: number = 0;
   noOfPaxCount: any;
    optionalTourPrices: any[] = [];
    selectedOptionalTours: { id: number; noOfPax: number; price: number; name: string }[] = [];
    addingOptionalTours: boolean = false;
    maxPax: number;
     bsDateConf1 = {
        isAnimated: true,
        displayMonths: 1,
        placement: 'top',
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        adaptivePosition: false,
        showWeekNumbers: false
    };
    titleGenderMap: any = {
  'Mr': 'Male',
  'Master': 'Male',
  'Mstr': 'Male',
  'Mrs': 'Female',
  'Miss': 'Female',
  'Ms': 'Female'
};
  public tarvelDate: any;
  public singleChildPrice: any[] =[];
  public singleAdultPrice: any;
  public selectedChildAges: any[] = [];
  public noOfInfant: number = 0;
  public noOfStudent: number = 0;
  public noOfSenior: number = 0;
  public noOfMilitary: number = 0;
  public noOfOther: number = 0;
  public bookingFiledsForm: any;

  constructor(private datePipe: DatePipe,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private util: UtilityService,
    private tourService: TourService,
    private swalService: SwalService,
    public globals: ThemeOptions,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state;

    if (state) {
      this.state = state;
      this.stateCopy = state;
      this.noOfAdult = state.adult;
      this.noOfChild = state.child;
      this.noOfInfant = state.infant;
      this.noOfStudent = state.student;
      this.noOfSenior = state.senior;
      this.noOfMilitary = state.military;
      this.noOfOther = state.other;
      this.tarvelDate = state.departureDate;
      this.selectedChildAges = state.childAges || [];
      this.maxPax = this.noOfAdult+this.noOfChild +this.noOfInfant + this.noOfStudent + this.noOfSenior + this.noOfMilitary + this.noOfOther;

    } else {
      this.router.navigate(['/search/tour/tour-details']);
    }
    this.bookingFieldForm = this.fb.group({
      bookingFieldsArray: this.fb.array([]) // Initialize as an empty FormArray
    });

  }

  ngOnInit(): void {
    this.tourService.tourPriceBreakDown.subscribe((data) => {
      if (data) {
        console.log(data)
        const priceData = data.flat();
        const merged = Object.values(
          priceData.reduce((acc, curr) => {
            const key = `${curr.name}-${curr.value}`;
            if (!acc[key]) {
              acc[key] = { ...curr };
            } else {
              acc[key].travellercount += curr.travellercount;
            }
            return acc;
          }, {})
        );
        this.priceBreakDownData = merged;
        console.log(this.priceBreakDownData)
      }

    })
    const storedState = sessionStorage.getItem('tourBookingInfo');
    this.currentUser = this.util.getStorage('currentUser');
    if (storedState) {
      this.tourService.blockedTourData.next(JSON.parse(storedState));
    }

    this.subSunk.sink = this.tourService.loading.subscribe(res => {
      this.loading = res;
    });
    this.createBookingForm();
    this.tourService.blockedTourData.subscribe(res => {
      this.tourData = res;
      if (this.tourData.optional_tours && this.tourData.optional_tours !== '' ) {
          this.tourData.optional_tours.map(t => ({
          ...t,
          noOfPax: 0   // initialize to 0
        }));
      }
      
      if (this.tourData.bookingField) {
        let formValuesData = this.tourData.bookingField ? this.tourData.bookingField.filter((f) => f.main_pax === 'mandatory' || f.additional_pax === 'mandatory') : '';
        const phoneExists = formValuesData.some(f => f.name === "phone_number");
        if (!phoneExists) {
          formValuesData.push({
            name: "phone_number",
            label: "Phone Number",
            group: "Contact",
            type: "phone",
            main_pax: "mandatory",
            additional_pax: "mandatory"
          });
        }
        const countryObj = {
          "name": "Phone Code",
          "label": "Phone Code",
          "group": "Country",
          "type": "string",
          "main_pax": "mandatory",
          "additional_pax": "mandatory"
        }
        // this.formValuesData = [...formValuesData, countryObj];
        const phoneIndex = formValuesData.findIndex(f => f.name === "phone_number");

        if (phoneIndex !== -1) {
          // Insert just before phone_number
          formValuesData.splice(phoneIndex, 0, countryObj);
        } else {
          // If phone_number not found, just push at end
          formValuesData.push(countryObj);
        }

        this.formValuesData = formValuesData;
      }

      this.setBlockedTourData(this.state.departureDate);
      this.createTourContactForm(this.state);
      // this.adultPrice = this.tourData.tourPrice[0]?.adult_airliner_price;
      // this.childPrice = parseFloat(this.tourData.tourPrice[0]?.child_airliner_price || '0');

      // Initialize bookingFields
      if (this.tourData.bookingField) {
       
        this.bookingFiledsForm = this.tourData.bookingField.filter(data=> data.main_pax !== 'mandatory')
        .map(field => ({
          // key: field.key,   // Include key in the field object
          name: field.name,
          label: field.label,
          type: field.type || 'string',  // Add type here if it's part of the data
          mandatoryMainPax: false,
          mandatoryAdditionalPax: false
        })) ;

        // Initialize the form array for booking fields
        this.bookingFieldForm.setControl('bookingFieldsArray', this.fb.array(this.createBookingFields()));
      }

    });
    this.genderList = [
      { key: 'Male', value: 'male' },
      { key: 'Female', value: 'female' }
    ]
    this.childTitles = [
      { title: 'Mr' },
      { title: 'Ms' }
    ]
    // Other initializations
    this.createCouponForm();
    this.getTitleList();
    this.getTourValuation();
    this.getPhoneCodeList();
    this.getCountryList();
    this.patchEmailFromSession();
    const adultmin_age = this.tourData.paxPriceDetails[0].age_min ? this.tourData.paxPriceDetails[0].age_min : 18;
    const adultmax_age = this.tourData.paxPriceDetails[0].age_max ? this.tourData.paxPriceDetails[0].age_max : 100;
    // Date settings
    this.maxDateAdult = this.strtotime(`-${adultmin_age} years -1 day`);  // Max age for adult (18 years and above)
    this.minDateAdult = this.strtotime(`-${adultmax_age} years +1 day`); // Min age for adult (up to 100 years)

    let childmin_age = 7;
    let childmax_age = 17;
    if (this.tourData.paxPriceDetails[1]) {
      childmin_age = this.tourData.paxPriceDetails[1].age_min ? this.tourData.paxPriceDetails[1].age_min : 7;
      childmax_age = this.tourData.paxPriceDetails[1].age_max ? this.tourData.paxPriceDetails[1].age_max : 17;
    }

    // const childmin_age = this.tourData.paxPriceDetails[1].age_min ? this.tourData.paxPriceDetails[1].age_min : 7;
    // const childmax_age = this.tourData.paxPriceDetails[1].age_max ? this.tourData.paxPriceDetails[1].age_max : 17;

    // Set the range for child DOB (age between 2 and 18 years)
    // this.maxDateChild = this.strtotime(`-${childmin_age} years -1 day`);   // Max age for child (2 years old)
    // this.minDateChild = this.strtotime(`-${childmax_age} years`);         // Min age for child (up to 18 years old)

    this.tourService.tourPromocode.subscribe(res => {
      console.log("res", res)
      if (res && Object.keys(res).length > 0) {
        this.promocode = res['promocode'];
        if (this.promocode && this.promocode != "") {
          if (this.promocode.discount_type == "percentage") {
            let amount: number
            amount = (this.promocode.discount_value / 100);
            this.discount_value = this.totalDisplayFare * amount;
          }
          if (this.promocode.discount_type == "plus") {
            this.discount_value = this.promocode.discount_value;
          }
        }
        else {
          this.discount_value = 0;
        }

      }
      this.cdRef.detectChanges();
    });
  }


  createBookingFields(): FormGroup[] {
    console.log(this.bookingFiledsForm)
    const bookingFiledsForm = this.bookingFiledsForm.filter( b => !this.formValuesData.some(d => d.name === b.name))
    // const bookingFiledsForm = this.bookingFiledsForm.filter(data => !data.mandatoryMainPax);
    return bookingFiledsForm.map(field => {
      return this.fb.group({
        name: [field.name],
        value: ['']
      });
    });
  }

  get bookingFieldsArray(): FormArray {
    return this.bookingFieldForm.get('bookingFieldsArray') as FormArray;
  }

  openTourTermsPopup() {
    this.showTermsPopup = true;
  }

  closeTourTermsPopup() {
    this.showTermsPopup = false;
  }



  setBlockedTourData(selectedDate: Date) {
    if (this.tourData && this.tourData.BookingSource === "BGTAPINO00002") {
      for (const price of this.tourData.tourPrice) {
        const depDate = new Date(price.dep_date).toDateString();
        const selectedDateStr = new Date(selectedDate).toDateString();
        if (selectedDateStr === depDate) {
          this.adultPrice = price.adult_airliner_price * this.noOfAdult;
          this.childPrice = price.child_airliner_price * this.noOfChild;
          break;
        }
      }
    }

    if (this.tourData && this.tourData.BookingSource === "BGTAPINO00001") {
      for (const price of this.tourData.tourPrice) {
        const fromDate = new Date(price.from_date);
        const toDate = new Date(price.to_date);
        if (selectedDate >= fromDate && selectedDate <= toDate) {
          this.singleAdultPrice = price.ex_adult_airliner_price;
          this.adultPrice = price.ex_adult_airliner_price * this.noOfAdult;
          // this.childPrice = price.ex_child_airliner_price;
          const updatedTravellers = this.stateCopy.childAges.map(traveller => {
            const travellerAge = Number(traveller.ages);
            const policy = price.child_age_groups.find(p =>
              travellerAge >= Number(p.from_age) &&
              travellerAge <= Number(p.to_age)
            );
            this.singleChildPrice.push(policy ? policy.price : 0);
            return {
              ...traveller,
              price: policy ? policy.price : 0
            };
          });
          // Calculate total
          this.childPrice = updatedTravellers.reduce((sum, t) => sum + t.price, 0) ;
          break;
        }
      }
    }
  }

  get adultformArray(): FormArray {
    return this.bookingContactForm.get('adultPaxDetails') as FormArray;
  }

  get childformArray(): FormArray {
    return this.bookingContactForm.get('childPaxDetails') as FormArray;
  }

  addAdultFormToFormArray() {
    const formGroup = this.fb.group({
      Title: new FormControl('Mr', [Validators.required]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.userName)]),
      Dob: [''],
      PaxType: ['1'],
      Nationality: [''],
      Gender: ['Male', [Validators.required]]
    });

     formGroup.get('Title')!.valueChanges.subscribe(title => {
      const gender = this.titleGenderMap[title] || '';
      formGroup.get('Gender')!.setValue(gender, { emitEvent: false });
    });

    this.adultformArray.push(formGroup);

   
    // this.noOfAdult++;
  }

  addChildFormToFormArray(childAge) {
     let minDate = null;
    let maxDate = null;
    const today = new Date(this.tarvelDate);
   maxDate = new Date(today.getFullYear() - Number(childAge-1), today.getMonth(), today.getDate()-1);
  minDate = new Date(today.getFullYear() - Number(childAge-1) - 1, today.getMonth(), today.getDate() );
    const formGroup = this.fb.group({
      Title: new FormControl('Mstr', [Validators.required]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2), Validators.pattern(this.util.regExp.userName)]),
      Dob: [''],
      minAge: new FormControl(minDate),
      maxAge: new FormControl(maxDate),
      PaxType: ['0'],
      Nationality: [''],
      Gender: ['Male', [Validators.required]]
    });
    formGroup.get('Title')!.valueChanges.subscribe(title => {
      const gender = this.titleGenderMap[title] || '';
      formGroup.get('Gender')!.setValue(gender, { emitEvent: false });
    });
    // this.noOfChild++;
    this.childformArray.push(formGroup);
  }

  removeChildFormFromFormArray(index: number) {
    this.childformArray.removeAt(index);
    this.noOfChild--;
  }

  removeAdultFormFromFormArray(index: number) {
    this.adultformArray.removeAt(index);
    this.noOfAdult--;
  }


  createTourContactForm(state: any) {
    this.bookingContactForm = this.fb.group({
      adultPaxDetails: this.fb.array([]),
      childPaxDetails: this.fb.array([]),
      selectedDate: new FormControl(state.departureDate, [Validators.required]),
      remarks: new FormControl(''),
      streetNumber: new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]),
      streetAddress: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
      city: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
      province: new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]),
      country: new FormControl(''),
      postalCode: new FormControl('', [Validators.pattern(this.util.regExp.zipCode), Validators.maxLength(10)]),
      emailAddress: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      CustomerEmail: new FormControl('', [Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      contactNumber: new FormControl('', [this.inputContactValidator]),
      PhoneCode: new FormControl('44',),
      Aggreed: new FormControl(false, [Validators.required]),
    });
    this.clearChildAdultForm();
    const getCustomerEmail = this.bookingContactForm.get('CustomerEmail');
    const getContactNum = this.bookingContactForm.get('contactNumber');
    const getPhoneCode = this.bookingContactForm.get('PhoneCode');
    if (this.tourData.BookingSource === 'BGTAPINO00001') {
      getCustomerEmail.setValidators(Validators.required);
      getCustomerEmail.updateValueAndValidity();
      getContactNum.setValidators(Validators.required);
      getContactNum.updateValueAndValidity();
      getPhoneCode.setValidators(Validators.required);
      getPhoneCode.updateValueAndValidity();
    } else {
      getContactNum.clearValidators();
      getPhoneCode.clearValidators();
      getContactNum.updateValueAndValidity();
      getCustomerEmail.clearValidators();
      getCustomerEmail.updateValueAndValidity();
      getPhoneCode.updateValueAndValidity();
    }

    // Add adults and children based on the number passed from the previous form
    for (let i = 0; i < state.adult; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00001') {
        this.addAdultFormToFormArray();
      }
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.adultForm.push(this.createAdultFormFields(i === 0));
        
      }
    }
    for (let i = 0; i < state.child; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00001') {
      const age = state.childAges[i].ages;
        this.addChildFormToFormArray(age);
        
      }
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.childForm.push(this.createAdultFormFields(false));
      }
    }

    for(let i = 0; i < state.infant; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.infantForm.push(this.createAdultFormFields(false));
      }
    }

    for(let i = 0; i < state.student; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.studentForm.push(this.createAdultFormFields(false));
      }
    }

    for(let i = 0; i < state.senior; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.seniorForm.push(this.createAdultFormFields(false));
      }
    }

    for(let i = 0; i < state.military; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.militaryForm.push(this.createAdultFormFields(false));
      }
    }

    for(let i = 0; i < state.other; i++) {
      if (this.tourData.BookingSource === 'BGTAPINO00002') {
        this.otherForm.push(this.createAdultFormFields(false));
      }
    }
    // const childArray = this.childformArray as FormArray;
    //   state.childAges.forEach((traveller, index) => {
    //     if (childArray.at(index)) {
    //       childArray.at(index).patchValue({
    //         Dob: (traveller.childAge),
    //       });
    //     }
    //   });
   
    // if (state.childAges) {
    //    const childArray = this.childformArray as FormArray;
    //   state.childAges.forEach((traveller, index) => {
    //       const utcDate = new Date(traveller.childAge);
    //     const localDate = new Date(
    //         utcDate.getUTCFullYear(),
    //         utcDate.getUTCMonth(),
    //         utcDate.getUTCDate()
    //       );

    //       if (childArray.at(index)) {
    //         childArray.at(index).patchValue({
    //           Dob: localDate,
    //         });
    //       }
    //     });
    // }
        
    this.fillBookingForm();
  }

  toggleChildForm(): void {
    this.addChild = !this.addChild;
  }

  fillBookingForm() {
    if (localStorage.getItem('userEmail')) {
      this.bookingContactForm.get('email').patchValue(localStorage.getItem('userEmail'));
    }
    if (localStorage.getItem('contactNumber')) {
      this.bookingContactForm.get('contactNumber').patchValue(localStorage.getItem('contactNumber'))
    }
    if (localStorage.getItem('PhoneCode')) {
      this.bookingContactForm.get('PhoneCode').patchValue(localStorage.getItem('PhoneCode'))
    }
  }


  getTitleList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {}, {}).subscribe(res => {
      this.tourService.userTitleList.next(res.data);
      if (res.data.length) {
        this.titleList = res.data;
        this.cdRef.detectChanges();
      }
    });
  }

  createCouponForm() {
    this.couponInfoForm = this.fb.group({
      coupon: new FormControl('')
    })
  }

  getTourValuation() {
    this.preBookingInfo = JSON.parse(sessionStorage.getItem('tourValuation'));
  }

  addYearsToDate(y: number) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year + y, month, day);
    return c;
  }


  strtotime(modifier: string): Date {
    const adultmin_age = this.tourData.paxPriceDetails[0].age_min ? this.tourData.paxPriceDetails[0].age_min : 18;
    const adultmax_age = this.tourData.paxPriceDetails[0].age_max ? this.tourData.paxPriceDetails[0].age_max : 100;

    let childmin_age = 7;
    let childmax_age = 17;
    if (this.tourData.paxPriceDetails[1]) {
      childmin_age = this.tourData.paxPriceDetails[1].age_min ? this.tourData.paxPriceDetails[1].age_min : 7;
      childmax_age = this.tourData.paxPriceDetails[1].age_max ? this.tourData.paxPriceDetails[1].age_max : 17;
    }
    const dobArray = new Date(); // Use the current date as the base
    switch (modifier) {
      case `-${adultmax_age} years +1 day`:
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - adultmax_age, dobArray.getMonth(), dobArray.getDate() + 1));
      case `-${adultmin_age} years -1 day`:
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - adultmin_age, dobArray.getMonth(), dobArray.getDate() - 1));
      case `-${childmin_age} years -1 day`:
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - childmin_age, dobArray.getMonth(), dobArray.getDate() - 1));
      case `-${childmax_age} years`:
        return new Date(dobArray.setFullYear(dobArray.getFullYear() - childmax_age, dobArray.getMonth(), dobArray.getDate()));
      default:
        return new Date();
    }
  }


  getPhoneCodeList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.phoneCodes = res.data;
          this.cdRef.detectChanges();
        }
      });
  }

  getCountryList(): void {
    this.subSunk.sink = this.apiHandlerService.apiHandler('tourCountryList', 'post', {}, {}, {}).subscribe(resp => {
      if (resp.statusCode == 200 && resp.data) {
        this.countries = resp.data;
        this.cdRef.detectChanges();
      }
    })
  }

  hasError = (controlName: string, errorName: string, arrayControl: string, i: number) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.bookingContactForm.get(arrayControl) as FormArray;
      return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    } else {
      return ((this.submitted || this.bookingContactForm.controls[controlName].touched) && this.bookingContactForm.controls[controlName].hasError(errorName));
    }
  }

  markFormGroupAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      }
    });
  }
  inputContactValidator(control: FormControl) {
    const value = control.value.toString();
    if (value && value.length < 10) {
      return { lessDigit: true };
    }
    if (value && value.length > 10) {
      return { moreDigit: true };
    }
  }


  validateEmailInput() {
    this.bookingContactForm.get('email').markAsTouched();
  }

  validateEmail(control: FormControl) {
    const value = control.value;
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value && !regex.test(value)) {
      return { invalidEmail: true };
    }
  }
  numberOnly(event): boolean {
    return this.util.numberOnly(event);
  }

  validatecontactInput() {
    this.bookingContactForm.get('contactNumber').markAsTouched();
  }

  // openStaticPage(page_title) {
  //   sessionStorage.removeItem('static_title');
  //   const url = this.router.serializeUrl(
  //     // this.router.createUrlTree(['auth/cms/page_title'])
  //     this.router.createUrlTree(['auth', 'cms', page_title])
  // );
  //   window.open('#' + url, '_blank');
  // }
  openStaticPage(page_title) {
    sessionStorage.setItem('static_title', page_title);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['auth/cms'])
    );
    window.open('#' + url, '_blank');
  }

  onContinue() {
    this.submitted = true;
    // this.phoneCodes.find((data) => {
    //   if (data.phone_code === this.bookingContactForm.get('PhoneCode').value) {
    //     this.bookingContactForm.patchValue({country: data.two_code})
    //   }
    // });
    let reqBody;
    if (this.tourData.BookingSource === 'BGTAPINO00001') {
      if (!this.bookingContactForm.valid) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        return;
      }
      this.tourService.loading.next(true);

      const formValues = this.bookingContactForm.getRawValue();
      this.PaxDetails = formValues.adultPaxDetails || [];
      if (formValues.childPaxDetails && formValues.childPaxDetails.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.childPaxDetails);
      }
      const selectedCountryCode = this.bookingContactForm.get('country').value;
      const selectedCountry = this.countries.find(country => country.code === selectedCountryCode);
      let childDobList = [];
      const selectedCountryName = selectedCountry ? selectedCountry.name : '';
      this.PaxDetails.forEach(passenger => {
        // Skip setting DOB for adults
        if (passenger.hasOwnProperty('Dob') && passenger.Dob) {
          const date = new Date(passenger.Dob);
          passenger.Dob = date.toISOString().split('T')[0]; // Format only for children
          childDobList.push(passenger.Dob)
        }

        passenger.Nationality = selectedCountryName;

        if (passenger.Title === 'Mr' || passenger.Title === 'Mstr') {
          passenger.Gender = 'male';
        } else if (['Ms', 'Mrs', 'Miss'].includes(passenger.Title)) {
          passenger.Gender = 'female';
        }
      });

      reqBody = {
        ResultToken: JSON.parse(sessionStorage.getItem('tourBookingInfo'))['ResultIndex'] || '',
        UserType: 'B2B',
        UserId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser'))['id'] : 0,
        Remarks: this.bookingContactForm.get('remarks').value || '',

        AdultCount: formValues.adultPaxDetails.length || 0,
        ChildCount: formValues.childPaxDetails.length || 0,
        childDob: childDobList,
        booking_source: this.tourData.BookingSource || '',
        PromoCode: '',
        optional_tours: this.selectedOptionalTours.map(({ id, noOfPax }) => ({ id, noOfPax })),
        TourDetails: [
          {
            selectedDate: moment(this.bookingContactForm.get('selectedDate').value).format("YYYY-MM-DD"),
            PassengerDetails: this.PaxDetails,
            AddressDetails: {
              Title: formValues.adultPaxDetails[0].Title || '',
              FirstName: formValues.adultPaxDetails[0].FirstName || '',
              LastName: formValues.adultPaxDetails[0].LastName || '',
              Address: this.bookingContactForm.get('streetNumber').value || '',
              Address2: this.bookingContactForm.get('streetAddress').value || '',
              City: this.bookingContactForm.get('city').value || '',
              State: this.bookingContactForm.get('province').value || '',
              PostalCode: this.bookingContactForm.get('postalCode').value || '',
              Email: this.bookingContactForm.get('emailAddress').value || '',
              CustomerEmail: this.bookingContactForm.get('CustomerEmail').value || '',
              PhoneCode: this.bookingContactForm.get('PhoneCode').value || '',
              Contact: this.bookingContactForm.get('contactNumber').value || '',
              Country: this.bookingContactForm.get('country').value || '',
            },
           
          }
        ],
      };

    }

    if (this.tourData.BookingSource === 'BGTAPINO00002') {
  
      if (!this.bookingForm.valid || !this.bookingContactForm.get('Aggreed').value
        ||  !this.bookingFieldForm.valid) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        return;
      }

      this.tourService.loading.next(true);

      const formValues = this.bookingForm.getRawValue();
      formValues.adultForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '1'
      })
      formValues.childForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      formValues.infantForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      formValues.studentForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      formValues.studentForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      formValues.seniorForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      formValues.otherForm.map((data) => {
        data['PhoneCode'] = this.getPhoneCode(data),
          data['date_of_birth'] = moment(data.date_of_birth).format("YYYY-MM-DD"),
          data['PaxType'] = '0'
      })

      this.PaxDetails = formValues.adultForm || [];
      if (formValues.childForm && formValues.childForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.childForm);
      }

      if (formValues.infantForm && formValues.infantForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.infantForm);
      }
      if (formValues.studentForm && formValues.studentForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.studentForm);
      }
      if (formValues.seniorForm && formValues.seniorForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.seniorForm);
      }
      if (formValues.militaryForm && formValues.militaryForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.militaryForm);
      }
      if (formValues.otherForm && formValues.otherForm.length) {
        this.PaxDetails = this.PaxDetails.concat(formValues.otherForm);
      }

      let formData = this.bookingForm.getRawValue();
      reqBody = {
        ResultToken: JSON.parse(sessionStorage.getItem('tourBookingInfo'))['ResultIndex'] || '',
        UserType: 'B2B',
        UserId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser'))['id'] : 0,
        Remarks: this.bookingContactForm.get('remarks').value || '',

        AdultCount: formValues.adultForm.length || 0,
        ChildCount: formValues.childForm.length || 0,
        InfantCount: formValues.infantForm.length || 0,
        StudentCount: formValues.studentForm.length || 0,
        SeniorCount: formValues.seniorForm.length || 0,
        MilitaryCount: formValues.militaryForm.length || 0,
        OthersCount: formValues.otherForm.length || 0,
        booking_source: this.tourData.BookingSource || '',
        TourDetails: [
          {
            selectedDate: moment(this.bookingContactForm.get('selectedDate').value).format("YYYY-MM-DD"),
            PassengerDetails: this.PaxDetails,
            AddressDetails: {
              Title: formData.adultForm[0].title || '',
              FirstName: formData.adultForm[0].first_name || '',
              LastName: formData.adultForm[0].last_name || '',
              Address: this.bookingContactForm.get('streetNumber').value || '',
              Address2: this.bookingContactForm.get('streetAddress').value || '',
              City: this.bookingContactForm.get('city').value || '',
              State: this.bookingContactForm.get('province').value || '',
              PostalCode: this.bookingContactForm.get('postalCode').value || '',
              Email: this.bookingContactForm.get('emailAddress').value || '',
              Country: this.bookingContactForm.get('country').value || '',
            },
             BookingFields: this.getBookingFields()
          }
        ],
      }

    }


    this.subSunk.sink = this.apiHandlerService.apiHandler('createAppRef', 'POST', '', '', {
      module: "tour"
    }).subscribe(res => {
      if ((res.statusCode === 200 || res.statusCode === 201) && res.data) {
        this.tourService.loading.next(false);
        const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'] || 0;
        reqBody['AppReference'] = res.data;
        reqBody['UserId'] = created_by_id;

        this.subSunk.sink = this.apiHandlerService.apiHandler('tourAddPax', 'POST', {}, {}, reqBody)
          .subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
              this.tourService.addTourBookingPaxDetails.next(resp.data);
              sessionStorage.setItem("tourPaxData", JSON.stringify(resp.data));
              this.router.navigate(['/search/tour/tour-confirm']);
            }
          }, err => {
            this.swalService.alert.oops(err.error.Message);
            console.error(err);
          });
        this.tourService.loading.next(false);
      }
    }, err => {
      console.error('Error creating app reference:', err);
    });

    this.markFormGroupAsTouched(this.bookingContactForm);
  }

 getPhoneCode(data) {
  const phone_code = data.PhoneCode ? data.PhoneCode : '';

  if (!phone_code) return '';      // or return null / undefined

  return phone_code.includes("+")
    ? phone_code
    : `+${phone_code}`;
}

  getBookingFields() {
    const bookingFieldsArray = this.bookingFieldForm.get('bookingFieldsArray') as FormArray;

    let bookingFields = {};
    if (bookingFieldsArray && bookingFieldsArray.controls) {
      bookingFieldsArray.controls.forEach(control => {
        const fieldName = control.get('name').value;
        const fieldValue = control.get('value').value;

        if (fieldName) {
          bookingFields[fieldName] = fieldValue || '';
        }
      });
    }
    bookingFields['date_of_birth'] = moment(bookingFields['date_of_birth']).format("YYYY-MM-DD")
    return bookingFields;
  }



  confirmBooking() {
    this.tourService.loading.next(true);
    let request = {
      AppReference: this.appReference,
      UserType: "B2B",
      UserId: "0",
      booking_source: "BGTAPINO00002",
    }
    this.apiHandlerService.apiHandler('tourConfirm', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.tourService.loading.next(false);
        this.router.navigate(['/search/tour/tour-voucher'], {
          queryParams: {
            AppReference: this.appReference,
            // orderId: this.finalData.orderId
          },
        });
      }
      else {
        this.tourService.loading.next(false);
        this.swalService.alert.oops("Unable to Confirm Booking");
        this.router.navigate(['/search/tour/tour-voucher'], {
          queryParams: {
            AppReference: this.appReference,
            // orderId: this.finalData.orderId
          },
        });
      }
    }, (err) => {
      this.tourService.loading.next(false);
      this.swalService.alert.oops(err.error.Message);
      this.router.navigate(['/search/tour/tour-voucher'], {
        queryParams: {
          AppReference: this.appReference,
          // orderId: this.finalData.orderId
        },
      });
    });
  }
  patchEmailFromSession(): void {
    // Ensure the session data exists

    if (this.currentUser && this.currentUser.email) {
      this.bookingContactForm.get('emailAddress').patchValue(this.currentUser.email);
    } else {
      console.error('Email not found in session storage');
    }
  }


  createBookingForm() {
    this.bookingForm = this.fb.group({
      adultForm: this.fb.array([]),
      childForm: this.fb.array([]),
      infantForm: this.fb.array([]),
      studentForm: this.fb.array([]),
      seniorForm: this.fb.array([]),
      militaryForm: this.fb.array([]),
      otherForm: this.fb.array([])
    })
  }

  get adultForm(): FormArray {
    return this.bookingForm.get('adultForm') as FormArray;
  }

  get childForm(): FormArray {
    return this.bookingForm.get('childForm') as FormArray;
  }

  get infantForm(): FormArray {
    return this.bookingForm.get('infantForm') as FormArray;
  }

  get studentForm(): FormArray {
    return this.bookingForm.get('studentForm') as FormArray;
  }

  get seniorForm(): FormArray {
    return this.bookingForm.get('seniorForm') as FormArray;
  }

  get militaryForm(): FormArray {
    return this.bookingForm.get('militaryForm') as FormArray;
  }

  get otherForm(): FormArray {
    return this.bookingForm.get('otherForm') as FormArray;
  }

  createAdultFormFields(isFirstAdult: boolean = false): FormGroup {
  const group: { [key: string]: FormControl } = {};

  this.formValuesData.forEach(field => {

    // Hide for non–first adult
    const isPhoneCode = field.label === 'Phone Code';
    const isPhoneNumber = field.label === 'Phone Number';

    if (!isFirstAdult && (isPhoneCode || isPhoneNumber)) {
      return; // Do not create these controls
    }

    let validators = [];
    
    // Required logic
    if (field.main_pax === 'mandatory' && isFirstAdult) {
      validators.push(Validators.required);
    }
    if (!isFirstAdult && field.additional_pax === 'mandatory') {
      validators.push(Validators.required);
    }

    // Email validation
    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    // Phone validation (only 1st adult)
    if (field.type === 'phone') {
      if (isFirstAdult) {
        validators.push(
          Validators.required,
          this.inputContactValidator,
          Validators.minLength(10),
          Validators.maxLength(15)
        );
      } else {
        return; // Skip phone number for others
      }
    }

    group[field.name] = new FormControl('', validators);
  });

  return this.fb.group(group);
}


  clearChildAdultForm() {
    this.adultForm.clear();
    this.childForm.clear();
    this.infantForm.clear();
    this.studentForm.clear();
    this.seniorForm.clear();
    this.militaryForm.clear();
    this.otherForm.clear();
  }

  getInputType(type: string): string {
    switch (type) {
      case 'email':
        return 'email';
      case 'date':
        return 'date';
      case 'phone':
        return 'tel';
      default:
        return 'text';
    }
  }

  getPriceDown(data) {
    let priceData;
    if (data.type === 'Adult') {
      priceData = `${data.travellercount} Adult x ${data.value}`
    } else if (data.type === 'Child') {
      priceData = `${data.travellercount} Child x ${data.value}`
    } else {
      priceData = `${data.travellercount} Traveler x ${data.value}`
    }
    return priceData;
  }

  getPrices(quantity, price) {
    if(quantity && price) {
      return Number(quantity)*Number(price)
    }
  }

  getMandatoryLocal(data) {
    if (data) {
      data.forEach((res) => {
        if (res.payment_type === 'local') {
          this.showMandatoty = true;
        }
      })
      return this.showMandatoty;
    }

  }

  getMandatoryPrice(data) {
    return data.reduce((sum, item) => {
      return sum + item.prices.reduce((priceSum, price) => priceSum + price.value, 0);
    }, 0);
  }


getTotalAmount(amount) {
  if(this.optional_tours) {
    const optionalTourTotalPrice = this.selectedOptionalTours.reduce((sum, item) => {
      return sum + (item.noOfPax * item.price);
    }, 0);
    const amnt = amount*(this.noOfAdult+this.noOfChild);
    return this.adultPrice + this.childPrice - this.discount_value + amnt + optionalTourTotalPrice;
  }
  if (!this.optional_tours) {
    let optionalTourTotalPrice = 0;
    if (this.addingOptionalTours && this.selectedOptionalTours.length) {
      optionalTourTotalPrice = this.selectedOptionalTours.reduce((sum, item) => {
        if (item.noOfPax && item.noOfPax > 0) {
      return sum + (item.noOfPax * item.price);
    }
    return sum;
      }, 0);
    }
    return this.adultPrice + this.childPrice + optionalTourTotalPrice - this.discount_value;
  }
}


onCheckboxChange(event: any, tour) {
   const isChecked = event.target.checked;

  if (isChecked) {
    // Add only if not already selected
    if (!this.selectedOptionalTours.find(t => t.id === tour.id)) {
      this.selectedOptionalTours.push({ id: tour.id, noOfPax: tour.noOfPax, price: tour.price, name: tour.name  || 0 });
    }
  } else {
    // Remove if unchecked
    this.addingOptionalTours = false;
    this.selectedOptionalTours = this.selectedOptionalTours.filter(t => t.id !== tour.id);
  }

  console.log('Selected Tours:', this.selectedOptionalTours);
}
onPaxChange(tour: any) {
  if (tour.noOfPax > this.maxPax) {
    tour.noOfPax = 0;
    this.swalService.alert.oops('Please Enter less or selected Pax Count')
  } else {
  const selected = this.selectedOptionalTours.find(t => t.id === tour.id);
  if (selected) {
    selected.noOfPax = tour.noOfPax || 0;
  }
}

  console.log('Updated Selected Tours:', this.selectedOptionalTours);
}

logValue(event,id) {
  if (id) {}
  this.noOfPaxCount = event.target.value;
}

onConfirmOptionalTour(id,data) {
  this.addingOptionalTours = true;
  // const optionalPriceTotal = this.selectedOptionalTours.reduce(())
   const selected = this.selectedOptionalTours.find(t => t.id === id);
   if (!selected.noOfPax) {
    this.swalService.alert.oops('Please add Pax Counnt');
    return;
   }
  if (selected) {
    this.swalService.alert.success('You have added Optional Tours Successfully');
    console.log('Confirmed Tour:', selected);
  }
}

getToursPrices(price, pax) {
  if(price&& pax) {
    const currency = this.tourData.tourPrice[0].Currency;
    const prices = (price * pax).toFixed(2);
    return `${currency} ${prices}`
  }
}

getChildPriceArray(){
  return Array.from({ length: this.noOfChild }, (_, index) => index );
}

onTitleSelect(selectedTitle: string, arrayName: string, formIndex: number): void {
  /**
   * Handles title selection for adult/child pax details
   * @param selectedTitle - The selected title value (e.g., 'Mr', 'Ms', 'Mrs')
   * @param arrayName - FormArray name ('adultPaxDetails' or 'childPaxDetails')
   * @param formIndex - Index of the form group in the array
   */
  if (!selectedTitle) {
    console.warn('No title selected');
    return;
  }

  const formArray = this.bookingContactForm.get(arrayName) as FormArray;
  if (!formArray || !formArray.controls[formIndex]) {
    console.error(`FormArray '${arrayName}' or index ${formIndex} not found`);
    return;
  }

  const formGroup = formArray.at(formIndex) as FormGroup;
  console.log(`Selected Title: ${selectedTitle} for ${arrayName}[${formIndex}]`);

  // Patch the selected title value
  formGroup.patchValue({
    Title: selectedTitle,
    Gender: selectedTitle === 'Mr' || selectedTitle === 'Mstr' ? 'Male' : 'Female'
  });

  // You can add additional logic here based on the selected title
  // For example:
  // - Update gender field based on title
  // - Validate against age restrictions
  // - Update salutation display
  
  console.log('Form updated with title:', formGroup.value);
}

getChildAges() {
  if (this.selectedChildAges) {
    return this.selectedChildAges.map(age => age.ages);
  }
}

}
