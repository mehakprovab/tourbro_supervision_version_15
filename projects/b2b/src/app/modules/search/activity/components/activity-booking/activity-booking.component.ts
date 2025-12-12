import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesService } from '../../activities.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { formatDate } from '@angular/common';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { CustomDialogWrapperComponent } from '../../../../custom-dialog-wrapper/custom-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { TransferSearchComponent } from '../../../transfer/transfer-search/transfer-search.component';
import { CartService } from '../../../../cart-booking/cart.service';
import { FlightComponent } from '../../../flight/flight.component';
import { HotelComponent } from '../../../hotel/hotel.component';
import * as moment from 'moment';
import { FlightService } from '../../../flight/flight.service';
@Component({
  selector: 'app-activity-booking',
  templateUrl: './activity-booking.component.html',
  styleUrls: ['./activity-booking.component.scss']
})
export class ActivityBookingComponent implements OnInit {
  blockedActivity: any = [];
  activityTraveller: any = [];
  travellerForm: FormGroup;
  titleList: any = 0;
  noOfAdult: any = 0;
  noOfChild: any = 0;
  noOfSenior: any = 0;
  noOfYouth: any = 0;
  noOfInfant: any = 0;
  noOfTravellers: any = 0;
  submitted: boolean = false;
  phoneCodes: any;
  terms: boolean = false;
  showLoader: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  currentUser: any;
  dynamicForm!: FormGroup;
  adultLeadPax:boolean=false;
  txtCouponCodeValue: string = ''; // Variable to hold the input value
  disableApplyPromo:boolean = false;
  protected subs = new SubSink();
  promocodeList:any=[];
  selectedPromocode='';
  browserRefresh: boolean;
  addressDetails: any=[];
  travelList: any = [];
  selectedTitle: string;
  traveller: any;
  noOfAdults: number = 0;
  noOfChilds: number = 0;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false,
    // datesEnabled: this.datesEnabled
  };
  emailVerified:boolean=false;
  autoSearchData: any;
  cartMessage: string;
  minChildAge: any;
  maxChildAge: any;
  cartItems: any;
  grandTotalPrice: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivitiesService,
    private fb: FormBuilder,
    private util: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef,
    private swalService:SwalService,
    private dialog: MatDialog,
    private cartService: CartService,
    private flightService: FlightService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
 console.log("currentUser",this.currentUser)
    if (this.currentUser) {
      this.getTravellersList();
    }
    this.setTraveller();
    //this.createTravellerForm;
    this.browserRefresh = browserRefresh;
    this.traveller = this.activityService.traveller;
    this.setBlockedActivityData();
    this.getPromoCodeList();
    this.getTitleList();
    this.getPhoneCodeList();
    this.createTravellerForm();
    !this.browserRefresh? this.removePromoCode(): null;
    this.activityService.loading.subscribe(res => {
      this.showLoader = res;
    });
    // this.activityService.activityTraveller.subscribe(res => {
    //   console.log("res traveller",res)
    //   this.activityTraveller = res;
    //   this.createTravellerForm();
    // })
    this.activityService.blockedActivityData.subscribe(res => {
      console.log("res",res)
      if(res.BookingSource === "ZBAPINO00004") {
        this.blockedActivity = res;
        this.grandTotalPrice = this.blockedActivity.Price.TotalDisplayFare;
      } else {
        this.blockedActivity = res[0];
        this.grandTotalPrice = this.blockedActivity.Price.TotalDisplayFare;
      }
      
      this.addBookingQuestions();
      this.patchEmailFromSession(0);
    });
    this.minChildAge = this.addYearsToDate(-17, 1);
    this.maxChildAge = this.addYearsToDate(-1, 1);

  }

  addBookingQuestions() {
    const bookingQuestionsArray = this.travellerForm.get('bookingQuestions') as FormArray;
    // Clear existing booking questions if needed
    bookingQuestionsArray.clear();
    for (const question of this.blockedActivity.BookingQuestions) {
      bookingQuestionsArray.push(this.createBookingQuestionForm(question));
    }
  }
  patchEmailFromSession(index: number): void {
    // Ensure the session data exists
    
    if (this.currentUser && this.currentUser.email) {
      const addressArray = this.travellerForm.get('address') as FormArray;
      if (addressArray && addressArray.at(index)) {
        const addressGroup = addressArray.at(index) as FormGroup;
        addressGroup.get('Email').patchValue(this.currentUser.email);
        addressGroup.get('Contact').patchValue(this.currentUser.phone);
        this.emailVerified = true;
        // addressGroup.get('Email').disable();
      } else {
        console.error('Invalid index or FormArray not found');
      }
    } else {
      console.error('Email not found in session storage');
    }
  }
  

  createBookingQuestionForm(question: any): FormGroup {
    const formGroup = this.fb.group({
      answer: new FormControl('', [Validators.required]),
      // You can add more fields based on the structure of the question object
    });

    for (const key in question) {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        formGroup.addControl(key, new FormControl(question[key]));
      }
    }

    return formGroup;
  }

  
  getTravellersList() {
    this.subs.sink = this.apiHandlerService.apiHandler('travellerManagementList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.travelList = res.data;
          this.cdRef.detectChanges();
        }
      });
  }
  setTraveller(){
  this.activityService.setHotelTraveller()
  }
  // setTraveller() {
  //   const storedState = localStorage.getItem('activityTraveller');
  //   if (storedState) {
      //this.activityService.activityTraveller.next(JSON.parse(storedState));
  //   }
  // }

  setBlockedActivityData() {
    const storedState = localStorage.getItem('blockedActivityData');
    if (storedState) {
      this.activityService.blockedActivityData.next(JSON.parse(storedState));
    }
  }

  createTravellerForm() {
    this.travellerForm = this.fb.group({
      adult: this.fb.array([]),
      // senior: this.fb.array([]),
      child: this.fb.array([]),
      // youth: this.fb.array([]),
      // infant: this.fb.array([]),
      address: this.fb.array([this.addAddressForm()]),
      bookingQuestions: this.fb.array([]),
      operatedLanguage: [''],
      timing: [''],
      pickupHotelName:['']
    });
    console.log("travellerForm",this.travellerForm)
    this.addAdult();
   
    // this.addSenior();
    this.addChild();
    // this.addYouth();
    // this.addInfant();
    this.noOfTravellers = (this.traveller[0].adults + this.traveller[0].childrens);

  }
 
  addAddressForm(): FormGroup {
    return this.fb.group({
      Title: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      Address: new FormControl('Bangalore', [Validators.required, Validators.maxLength(120), Validators.minLength(2)]),
      Address2: new FormControl('Bangalore', [Validators.maxLength(120), Validators.minLength(2)]),
      City: new FormControl('Bangalore', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.util.regExp.userName)]),
      State: new FormControl('Karnataka', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.util.regExp.userName)]),
      PostalCode: new FormControl('560010', [Validators.required, Validators.pattern(this.util.regExp.zipCode), Validators.maxLength(10)]),
      Email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      PhoneCode: new FormControl('44', [Validators.required, Validators.maxLength(6)]),
      CustomerEmail: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      Contact: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.phoneNo)]),
      Country: new FormControl('UK', [Validators.required])
    })
  }

  addAdult() {
    console.log("this.traveller",this.traveller)
    this.traveller.forEach((element, index) => {
      console.log("element",element)
      this.noOfAdults = element.adults;
     // this.noOfChilds += element.childrens;
    // this.noOfAdult = this.activityTraveller.adult;

    for (let i = 0; i < this.noOfAdults; i++) {
      this.adultLeadPax=true;
      if (this.travellerForm.value['adult'].length < this.noOfAdults) {
        this.trevellers('adult').push(this.addTravellersDeatils('adult', index));
      }
    }
  })
  }

  addChild() {
    this.traveller.forEach((element, index) => {
      console.log("element",element)
      this.noOfChilds += element.childrens;
      let childAges = element.ChildAge || [];
//this.noOfChild = this.activityTraveller.child;
    childAges.forEach((child, i) => {
      if (this.travellerForm.value['child'].length < this.noOfChilds) {
        this.trevellers('child').push(this.addTravellersDeatils('child', index, 0, +child.childAge));
      }
    })
  })
  }

  // addSenior() {
  //   this.noOfSenior = this.activityTraveller.senior;
  //   for (let i = 0; i < this.noOfSenior; i++) {
  //     if (this.travellerForm.value['senior'].length < this.noOfSenior) {
  //       this.trevellers('senior').push(this.addTravellersDeatils('senior', i));
  //     }
  //   }
  // }

  // addYouth() {
  //   this.noOfYouth = this.activityTraveller.youth;
  //   for (let i = 0; i < this.noOfYouth; i++) {
  //     if (this.travellerForm.value['youth'].length < this.noOfYouth) {
  //       this.trevellers('youth').push(this.addTravellersDeatils('youth', i));
  //     }
  //   }
  // }

  // addInfant() {
  //   this.noOfInfant = this.activityTraveller.infant;
  //   for (let i = 0; i < this.noOfInfant; i++) {
  //     if (this.travellerForm.value['infant'].length < this.noOfInfant) {
  //       this.trevellers('infant').push(this.addTravellersDeatils('infant', i));
  //     }
  //   }
  // }

  addTravellersDeatils(paxType, index,lead = 0, childAge?: number): FormGroup {
    console.log("paxType",paxType)
    console.log("index",index)
    const paxValue = (paxType == 'adult' || paxType == 'senior') ? 1 : (paxType == 'infant' ? 3 : 2);
    let isLeadPassenger=false;
    if (this.adultLeadPax && paxType == 'adult' && index == 0) {
      isLeadPassenger = true;
    }
    // if (!this.adultLeadPax && paxType == 'senior' && index == 0) {
    //   isLeadPassenger = true;
    // }
     let minDate = null;
  let maxDate = null;

  if (paxType === 'child' && childAge) {
    const today = new Date();
    maxDate = new Date(today.getFullYear() - childAge, today.getMonth(), today.getDate());
    minDate = new Date(today.getFullYear() - (childAge + 1), today.getMonth(), today.getDate() + 1);
  }


    return this.fb.group({
      IsLeadPax: lead,
      Title: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      Dob: new FormControl('1996-05-12', [Validators.required]),
      PaxType: new FormControl(paxValue, [Validators.required]),
      LeadPassenger: new FormControl(isLeadPassenger, [Validators.required]),
      travellerType: paxType,
      travellerTypeCount: index + 1,
      PassengerSelection: '',
      Gender: '',
      PassportIssuingCountry: ['IND',],
      Nationality: ['IND',],
      CountryCode: '',
      CountryName: '',
      ContactNo: '',
      PhoneAreaCode: '',
      PhoneExtensionCode: '',
      City: '',
      PinCode: '',
      AddressLine1: '',
      AddressLine2: '',
      Email: '',
      minDate: new FormControl(minDate),
      maxDate: new FormControl(maxDate)
    })
  }

  getTitleList() {
    this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {}, {}).subscribe(res => {
      this.activityService.userTitleList.next(res.data);
      if (res.data.length) {
        this.titleList = res.data;
        this.cdRef.detectChanges();
      }
    });
  }

  trevellers(controlName: string): FormArray {
    return this.travellerForm.get(controlName) as FormArray;
  }

  confirmBooking() {
    this.submitted = true;
    let travellerAdult = this.travellerForm.controls.adult.value;
    // let filteredSenior = this.travellerForm.controls.senior.value;
    let filteredTravellers;
    let filteredTravellersData;
    if(travellerAdult && travellerAdult.length>0)
    {
       filteredTravellers = travellerAdult.filter(traveller => traveller.LeadPassenger === true);
    }
    // if(filteredSenior && filteredSenior.length>0)
    // {
    //   filteredTravellersData = filteredSenior.filter(traveller => traveller.LeadPassenger === true);
    //   if(filteredTravellersData.length >0 ){
    //     filteredTravellers = filteredTravellersData;
    //   }
    // }

    this.travellerForm.controls['address']['controls'][0].patchValue({
      Title: filteredTravellers[0].Title,
      FirstName: filteredTravellers[0].FirstName,
      LastName: filteredTravellers[0].LastName
    });
    if (!this.travellerForm.valid) {
     return;
    }
      if (!this.terms) {
      return;
    }
    this.createAppReference();
  }

  createAppReference() {
    if (this.blockedActivity.BookingSource === "ZBAPINO00004" && (this.travellerForm.value.operatedLanguage === '' || this.travellerForm.value.timing === ''|| this.travellerForm.value.pickupHotelName === '')) {
      this.swalService.alert.oops('Please Select Operated Language, Preferred Timing & Pickup Hotel Name');
      return ;
    }
    this.activityService.loading.next(true);
    this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
      module: "activity"
    }).subscribe(res => {
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
        this.addPaxDetails(res.data);
      }
      else {
        this.activityService.loading.next(false);
      }
    }, (error) => {
      this.activityService.loading.next(false);
    }
    );
  }

  addPaxDetails(appRef) {
    let passengerDetails = this.generatePassengerDetails();
    this.addressDetails = this.travellerForm.get('address').value;
    let bookingQuestions = this.travellerForm.get('bookingQuestions').value;
console.log("this.blockedActivity",this.blockedActivity)
    // passengerDetails.map((data)=>{
    //   return moment(new Date(data.Dob)).format('YYYY-MM-DD');
    // })
    console.log(passengerDetails)
    let request = {
      ResultToken: this.blockedActivity.BookingSource === 'ZBAPINO00004' ?  this.blockedActivity.ResultIndex : this.blockedActivity.ResultToken,
      AppReference: appRef,
      UserType: 'B2B',
      UserId: this.currentUser.id || '',
      PromoCode:this.selectedPromocode,
      PassengerDetails: passengerDetails,
      AddressDetails: this.addressDetails[0],
      BookingQuestions:bookingQuestions,
      booking_source: this.blockedActivity.BookingSource,
      timing: this.travellerForm.value.timing,
      operatedLanguage: this.travellerForm.value.operatedLanguage,
      pickupHotelName: this.travellerForm.value.pickupHotelName
    }
    
    if (this.currentUser.id == null) {
      delete request.UserId
    }

    this.apiHandlerService.apiHandler('activityAddPax', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.activityService.loading.next(false);
        this.activityService.paxDetails.next(response.data);
        localStorage.setItem('paxDetails', JSON.stringify(response.data));
        this.router.navigate(['search/activity/activity-confirm']);
      }
      else {
        this.activityService.loading.next(false);
        this.swalService.alert.oops("Unable To Add Pax Details");
      }
    }, (err) => {
      this.activityService.loading.next(false);
      this.cdRef.detectChanges();
      this.swalService.alert.oops(err.error.Message);
    });
  }

  generatePassengerDetails() {
    let passengerDetails: any = [];
    passengerDetails.push(this.travellerForm.get('adult').value);
    // passengerDetails.push(this.travellerForm.get('senior').value);
 
    // ;
    passengerDetails.push(this.travellerForm.get('child').value);
    // passengerDetails.push(this.travellerForm.get('youth').value);
    // passengerDetails.push(this.travellerForm.get('infant').value);
    passengerDetails = passengerDetails.filter(element => {
      if (Object.keys(element).length !== 0) {
        return true;
      }
      return false;
    });
    passengerDetails = passengerDetails.flat();
    return passengerDetails;
  }

  hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.travellerForm.get(arrayControl) as FormArray;
      return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    } else {
      return ((this.submitted || this.travellerForm.controls[controlName].touched) && this.travellerForm.controls[controlName].hasError(errorName));
    }
  }

  getPhoneCodeList() {
    this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.phoneCodes = res.data;
          this.cdRef.detectChanges();
        }
      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onTerms(e) {
    this.terms = e
  }

  getPromoCodeList() {
    this.subs.sink = this.apiHandlerService.apiHandler('listPromocode', 'POST')
        .subscribe(res => {
            if (res) {
                this.promocodeList=res.data.filter(element=>element.category=='Activity');
                this.cdRef.detectChanges();
            }
        });
}

  removeSelectedPromo() {
    // Assuming this.promocodeList is an array of objects with a 'selected' property
    for (let i = 0; i < this.promocodeList.length; i++) {
        this.promocodeList[i].selected = false;
    }
    // Reset the radio button selection
    const radioButtons = document.getElementsByName("cpnRadio");
    for (let i = 0; i < radioButtons.length; i++) {
        const radioButton = radioButtons[i] as HTMLInputElement;
        radioButton.checked = false;
    }
    this.selectedPromocode="";
    //this.txtCouponCodeValue="";
    this.disableApplyPromo=false;
    this.cdRef.detectChanges();
    this.activityService.activityPromocode.next({
        promocode: ''
    });
    localStorage.setItem('activityPromocode', JSON.stringify(''));
}

applyCoupon() {
  this.activityService.loading.next(true);
  let coupon=this.txtCouponCodeValue;
  this.removeSelectedPromo();
  let request = {
      promocode: this.txtCouponCodeValue,
  }
  this.apiHandlerService.apiHandler('getPromoCodeInfo', 'POST', '', '', request).subscribe(response => {
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data && response.data[0]) {
          this.disableApplyPromo=true;
          this.activityService.loading.next(false);
          this.cdRef.detectChanges();
          this.setPromoCode(response.data[0]);
      }
      else {
          this.disableApplyPromo=false;
          this.txtCouponCodeValue="";
          this.activityService.loading.next(false);
          this.cdRef.detectChanges();
      }
  }, (error) => {
      this.txtCouponCodeValue="";
      this.activityService.loading.next(false);
      this.disableApplyPromo=false;
      this.cdRef.detectChanges();
  }
  );
}

clearDetails(index, selectedSection) {
  this.travellerForm.controls[selectedSection]['controls'][index].patchValue({
      Title: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      Gender: '',
      PassportNumber: '',
      PassportIssuingCountry: 'IND',
      Dob: '',
      PassportExpiryDate: '',
      AddressLine1: '',
      AddressLine2: '',
      Email: '',
      PinCode: '',
      City: '',
      Nationality: 'IND',
      PassengerSelection: ''
  });
  // if(selectedSection === 'adult' && index == 0){
  //   this.travellerForm.controls['address']['controls'][index].patchValue({
  //     Email: '',
  //     Contact: '',
  //   });
  // }
}


setPaxDetails(passengerDetails, index, selectedSection) {
  this.setPassengerTitle(passengerDetails, selectedSection);
  this.travellerForm.controls[selectedSection]['controls'][index].patchValue({
    Title:  passengerDetails.title,
    FirstName: passengerDetails.first_name.toUpperCase(),
    LastName: passengerDetails.last_name.toUpperCase(),
    // Gender: passengerDetails.gender,
    // PassportNumber: passengerDetails.passport_no,
    Dob: new Date(formatDate(new Date(passengerDetails.date_of_birth), 'yyyy-MM-dd', 'en-US')),
    // AddressLine1: passengerDetails.address,         
    // AddressLine2: passengerDetails.address1,
    // Email: passengerDetails.email,
    // PinCode: passengerDetails.postal_code,
    // City: passengerDetails.city,
    // Nationality: passengerDetails.country,
  });
  // if(selectedSection === 'adult' && index == 0){
  //   this.travellerForm.controls['address']['controls'][index].patchValue({
  //     // Email: passengerDetails.email,
  //     // PinCode: passengerDetails.postal_code,
  //     // Contact: passengerDetails.phone_number,
  //   });
  // }
}


setPassengerTitle(passengerDetails, selectedSection) {
  let titleArray;
  if (selectedSection === 'adult'  || selectedSection === 'senior') {
    titleArray = this.titleList.filter(element => (element.paxType === "ADULT" && element.titleName === passengerDetails.title));
  }
  else {
    titleArray = this.titleList.filter(element => (element.paxType === "CHILD" && element.titleName === passengerDetails.title));
  }
  if (titleArray.length == 0) {
    this.selectedTitle = "";
  } else {
    this.selectedTitle = passengerDetails.title;
  }
}

setPromoCode(promocode){
  this.selectedPromocode = promocode.promo_code;
  this.activityService.activityPromocode.next({
      promocode: promocode
  });
  localStorage.setItem('activityPromocode', JSON.stringify(promocode));
}

setSelectedPromo(promocode, index) {
  this.promocodeList.forEach((code, i) => {
      code.selected = (i === index); // Set selected to true only for the clicked index
  });
  this.txtCouponCodeValue="";
  this.setPromoCode(promocode);
}

removePromoCode(){
  this.activityService.activityPromocode.next({
      promocode: ''
  });
  localStorage.setItem('activityPromocode', JSON.stringify(''));
}
openStaticPage(page_title) {
  sessionStorage.setItem('static_title', page_title);
  const url = this.router.serializeUrl(
    this.router.createUrlTree(['auth/cms'])
);
  window.open('#' + url, '_blank');
}

openSearch(type) {
  if (type === 'flight') {
      this.openFlightSearch(type);
  } else if (type === 'transfer') {
      this.openTransferSearch(type);
  }
  else if (type === 'hotel') {
      this.openHotelSearch(type);
  }

}

openFlightSearch(data?): void {
  sessionStorage.setItem('activeId','left');
  this.flightService.emitChange("");
  this.dialog.open(CustomDialogWrapperComponent, {
      width: '80vw',
      height: '70vh',
      maxWidth: '100vw',
      maxHeight: '65%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
          component: FlightComponent,
          title: 'Flight Search',
          tabvalue: 'flight'
      }
  });
}

openTransferSearch(data?): void {
  this.dialog.open(CustomDialogWrapperComponent, {
      width: '80vw',
      height: '70vh',
      maxWidth: '100vw',
      maxHeight: '65%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
          component: TransferSearchComponent,
          title: 'Transfer Search'
      }
  });
}
openHotelSearch(data?): void {
  console.log('hotel data', data);
  this.dialog.open(CustomDialogWrapperComponent, {
      width: '80vw',
      height: '70vh',
      maxWidth: '100vw',
      maxHeight: '65%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
          component: HotelComponent,
          title: 'Hotel Search'
      }
  });
}


async addToCartWithMessage(): Promise<void> {
 

  // Ensure that the item is not already in the cart before adding it
  const cartDataActivity = JSON.parse(sessionStorage.getItem("cartData"));
  await this.addBundleBooking(); // Add item if it's not already in the cart
  await this.addAutoSearchData(location); // Add any related data
  // if (!cartDataActivity) {
  //     await this.addBundleBooking(); // Add item if it's not already in the cart
  //     await this.addAutoSearchData(location); // Add any related data
  // } else {
  //     this.cartMessage = 'Item already in cart'; // Handle message if item is already added
  // }

  // Keep the message for a specific duration before clearing it
  setTimeout(() => {
      this.cartMessage = '';
      this.cdRef.detectChanges(); // Trigger change detection if needed
  }, 2000); // Adjust the timeout duration as required
}


// addBundleBooking() {
//   const cartData = JSON.parse(sessionStorage.getItem("cartData"));
//   let item = {
//       refNumber: cartData ? cartData.refNumber : null,
//       ResultToken: this.blockedActivity.ResultToken,
//       exitingToken: cartData ? cartData.ResultIndex : "",
//       module: "activity",
//       bookingSource: this.blockedActivity.BookingSource,
//   }
//   this.cartService.addCart(item);
//   this.cdRef.detectChanges();
// }

getBundleBookings() {
        this.cartService.cartItems.subscribe((items) => {
        this.cartItems = items;
        });
        const req = {
            ResultToken: this.cartItems ? this.cartItems.ResultIndex : ''
        };
        this.apiHandlerService
      .apiHandler('getBundleBooking', 'POST', '', '', req).subscribe((res) => {
        console.log(res);
        Object.keys(res.data).forEach((key) => {
            if(key === 'activity') {
                const req = {
                ResultToken: this.cartItems.ResultIndex,
                refNumber: this.cartItems.refNumber || null,
                module: 'activity',
                };
            
                this.cartService.removeCart(req).subscribe(
                (res) => {
                    this.cartService.cartItemsSubject.next(res.data);
                    sessionStorage.setItem('cartData', JSON.stringify(res.data));

                    this.activityAddToCart();
                },
                (error) => {
                    this.swalService.alert.oops();
                }
                );
            }
        })
      })
    }
    
    activityAddToCart() {
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        const currentCart = this.cartService.getCartList(); 
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
        });
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.blockedActivity.ResultToken}`,
            exitingToken: this.cartItems ? this.cartItems.ResultIndex : "",
            module: "activity",
            bookingSource: this.blockedActivity.BookingSource,
        }
        this.cartMessage = `Activity added to cart!`;
        console.log("Adding item to cart:", item);
        this.cartService.addCart(item); // Make sure this method updates cart state properly
        this.cdRef.detectChanges();
    }

async addBundleBooking() {
  const cartDataActivity = JSON.parse(sessionStorage.getItem("cartData"));
  let item = {
      refNumber: cartDataActivity ? cartDataActivity.refNumber : null,
      ResultToken: this.blockedActivity.ResultToken,
      exitingToken: cartDataActivity ? cartDataActivity.ResultIndex : "",
      module: "activity",
      bookingSource: this.blockedActivity.BookingSource,
  }
  // Check if item is already in the cart before adding it
  if (!this.isItemAlreadyInCart(item)) {
    this.cartMessage = `Activity added to cart!`;
      this.cartService.addCart(item); // Add item to cart via CartService
      this.cdRef.detectChanges();
  } else {
    this.getBundleBookings();
  }
}

isItemAlreadyInCart(item: any): boolean {
  let currentCart: any = this.cartService.getCartList();  

  // If the current cart is empty, attempt to retrieve it from sessionStorage
  if (currentCart.length === 0) {
    const storedCart = sessionStorage.getItem('cartListSource');
    currentCart = storedCart ? JSON.parse(storedCart) : []; // Default to an empty array if null
  }
return currentCart.some(cartItem => 
  // cartItem.ResultToken === item.ResultToken &&
  // cartItem.exitingToken === item.exitingToken &&
  // cartItem.refNumber === item.refNumber 
  cartItem.module === item.module 
  // cartItem.bookingSource === item.bookingSource

);
}

async addAutoSearchData(location){
  console.log("activity Data", this.blockedActivity);
  console.log("activity City", this.blockedActivity.body.destination);
  console.log("activity Location", this.blockedActivity.Destination);

  let item = {
      "city_code": this.blockedActivity.body.destination,
      "city_name": this.blockedActivity.Destination,
      "module": "activity",
      "userType": "B2B",
      "date": this.blockedActivity.BookingDate
  }
  
  this.subs.sink = this.apiHandlerService.apiHandler('cartSearchInfo', 'POST',{},{},item)
  .subscribe(res => {
      if (res) {
          console.log("res",res)
          this.autoSearchData = res.data;
          //this.hotelService.hotelAutoFetchData.next(res)
          console.log('datas',this.autoSearchData);
          sessionStorage.setItem('autoSearchData', JSON.stringify(this.autoSearchData));
      }
  });
}

addYearsToDate(y: number, m: number): Date {
  const d = new Date();
  return new Date(d.getFullYear() + y, d.getMonth() + m, d.getDate());
}   

getPackageTimeData(data) {
  if (data) {
    return data.split(',')
  }
}

}
