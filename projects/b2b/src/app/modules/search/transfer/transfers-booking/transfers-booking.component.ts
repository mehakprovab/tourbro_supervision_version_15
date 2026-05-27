import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { formatDate } from '@angular/common';
import { TransferService } from '../transfer.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { CustomDialogWrapperComponent } from '../../../custom-dialog-wrapper/custom-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../cart-booking/cart.service';
import { ActivitySearchFormComponent } from '../../activity/components/activity-search-form/activity-search-form.component';
import { FlightComponent } from '../../flight/flight.component';
import { HotelComponent } from '../../hotel/hotel.component';
import { FlightService } from '../../flight/flight.service';
import { environment } from "projects/b2b/src/environments/environment.prod";
const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-transfers-booking',
  templateUrl: './transfers-booking.component.html',
  styleUrls: ['./transfers-booking.component.scss']
})
export class TransfersBookingComponent implements OnInit {
  blockedTransfer: any = [];
  transferTraveller: any = [];
  travellerForm: FormGroup;
  titleList: any = 0;
  noOfAdult: any = 0;
  noOfChild: any = 0;
  noOfSenior: any = 0;
  searchedList;
  depPoint: boolean;
  noOfYouth: any = 0;
  noOfAdults:any = 0;
  searchedAirLineList: any = {};
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
  contactForm: FormGroup;
  dynamicForm!: FormGroup;
  adultLeadPax: boolean = false;
  txtCouponCodeValue: string = ''; // Variable to hold the input value
  disableApplyPromo: boolean = false;
  isInvalidPromo: boolean = false;
  protected subs = new SubSink();
  promocodeList: any = [];
  selectedPromocode = '';
  browserRefresh: boolean;
  travelList: any = [];
  selectedTitle;
  isUpdatePassengers = false;
  transferSearchData: any;
  selectedExtras: { [key: number]: number | string } = {};
  extasTotal:number=0;
  selectedValues:any=[];
  shouldPreferedAirLineHide:any;
  autoSearchData: any;
  selectedCity: any;
  selectedLocation: any;
  cartMessage: string;
  cartItems: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private transferService: TransferService,
    private fb: FormBuilder,
    private util: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef,
    private swalService: SwalService,
    private cartService: CartService,
    private dialog: MatDialog,
    private flightService: FlightService
  ) { }

  ngOnInit(): void {

    const storedLocation = sessionStorage.getItem('selectedLocation');
         const storedCity = sessionStorage.getItem('selectedCity');
        if (storedLocation) {
            this.selectedLocation = JSON.parse(storedLocation);
            console.log('Parsed Location Object:', this.selectedLocation); // Debug: Check parsed object
            this.addAutoSearchData(this.selectedLocation);
        } else {
            console.error('No data found in sessionStorage for "selectedLocation"');
        }

        if (storedCity) {
            this.selectedCity = JSON.parse(storedCity);
            console.log('Parsed Location Object:', this.selectedCity); // Debug: Check parsed object
            this.addAutoSearchData(this.selectedCity);
        } else {
            console.error('No data found in sessionStorage for "selectedLocation"');
        }
        
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.getTravellersList();
    }
    this.browserRefresh = browserRefresh;
    this.setBlockedTransferData();
    this.getPromoCodeList();
    this.setTraveller();
    this.getTitleList();
    this.getPhoneCodeList();
    this.transferSearchData=JSON.parse(sessionStorage.getItem('transferSearchData'));
    !this.browserRefresh? this.removePromoCode(): null;
    this.transferService.loading.subscribe(res => {
      this.showLoader = res;
    });
    this.transferService.transferTraveller.subscribe(res => {
      this.transferTraveller = res;
    })
    this.transferService.blockedTransferData.subscribe(res => {
      this.blockedTransfer = res;
      this.setKey();
      this.addBookingQuestions();
    });
    this.createTravellerForm();
    this.patchEmailFromSession(0)
  }

  setKey(){
    if (this.blockedTransfer && this.blockedTransfer.Extras) {
      this.blockedTransfer.Extras.forEach((_, index) => {
        this.selectedExtras[index] = ''; // Initialize with empty string or desired default value
      });
    }
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
//   get shouldPreferedAirLineHide(): boolean {
//     try {
//         return !!this.searchedAirLineList.length ? true : false;
//     } catch (error) {
//     }
// }

setExtras(isChecked: boolean, value: any, index: number, defaultValue) {
   //value.Price = 10;
  if (isChecked) {
    this.selectedExtras[index] = defaultValue;
    value.selectedCount = defaultValue;
    if (!this.selectedValues.find(v => v.ExtrasCode === value.ExtrasCode)) {
      this.selectedValues.push(value);
    }
  } else {
    this.selectedExtras[index] = '';
    value.selectedCount = 0;
    this.selectedValues = this.selectedValues.filter(v => v.ExtrasCode !== value.ExtrasCode);
  }
  this.calculateTotal();
}

calculateTotal(){
  this.extasTotal = 0;
  this.selectedValues.forEach(v => {
      this.extasTotal += v.Price * v.selectedCount; // Adjust total based on selected counts
  });
  this.transferService.extrasValues.next(this.extasTotal);
}

generateOptions(maxNumberOfExtras: number): number[] {
  return Array.from({ length: maxNumberOfExtras }, (_, i) => i + 1);
}

  isChecked(value: any): boolean {
    const index = this.selectedValues.findIndex(v => v.ExtrasCode === value.ExtrasCode);
    return index !== -1;
  }

  addBookingQuestions() {
    const bookingQuestionsArray = this.travellerForm.get('bookingQuestions') as FormArray;
    // Clear existing booking questions if needed
    bookingQuestionsArray.clear();
    for (const question of this.blockedTransfer.BookingQuestions) {
      bookingQuestionsArray.push(this.createBookingQuestionForm(question));
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

  setTraveller() {
    const storedState = localStorage.getItem('transferTraveller');
    if (storedState) {
      this.transferService.transferTraveller.next(JSON.parse(storedState));
    }
  }

  setBlockedTransferData() {
    const storedState = localStorage.getItem('blockedTransferData');
    if (storedState) {
      this.transferService.blockedTransferData.next(JSON.parse(storedState));
    }
  }

  createTravellerForm() {
    this.travellerForm = this.fb.group({
      adult: this.fb.array([]),
      senior: this.fb.array([]),
      child: this.fb.array([]),
      youth: this.fb.array([]),
      infant: this.fb.array([]),
       inbound_notes:[''],
      outbound_notes: [''],
      address: this.fb.array([this.addAddressForm()]),
      journey1: this.fb.array([this.addJouney1Form()]),
      journey2: this.fb.array([this.addJouney2Form()]),
      accomodation: this.fb.array([this.addAccomodationForm()]),
      bookingQuestions: this.fb.array([]),
    });
    this.addAdult();
    // this.addSenior();
    // this.addChild();
    // this.addYouth();
    // this.addInfant();
    this.noOfTravellers =  this.transferSearchData;
  }

  addJouney1Form(): FormGroup {
    const baseControls1 = {
      DepCity: new FormControl(''),
      DepPoint: new FormControl(''),
      DepInfo: new FormControl(''),
      DepExtraInfo: new FormControl('')
    };
    if (this.blockedTransfer.LocTypeFrom === 'AP') {
      baseControls1.DepCity = new FormControl('', Validators.required);
      baseControls1.DepPoint = new FormControl('', Validators.required);
      baseControls1.DepInfo = new FormControl('', Validators.required);
      baseControls1.DepExtraInfo = new FormControl('', Validators.required);
    }
    return this.fb.group(baseControls1);
    // return this.fb.group({
    //   DepCity: new FormControl('', [Validators.required]),
    //   DepPoint: new FormControl('', [Validators.required]),
    //   DepInfo: new FormControl('', [Validators.required]),
    //   DepExtraInfo: new FormControl('', [Validators.required]),
    // })
  }

  addJouney2Form(): FormGroup {
    // Define the base form controls with default values
    const baseControls = {
      RetPoint: new FormControl(''),
      RetCity: new FormControl(''),
      RetInfo: new FormControl(''),
      RetExtraInfo: new FormControl('')
    };
    // Conditionally add validators if IsAccomadationAddress equals 1
    if (this.blockedTransfer.IsReturn == 1 && (this.blockedTransfer.LocTypeTo === 'AP' || this.blockedTransfer.LocTypeFrom === 'AP')) {
      baseControls.RetPoint = new FormControl('', Validators.required);
      baseControls.RetCity = new FormControl('', Validators.required);
      baseControls.RetInfo = new FormControl('', Validators.required);
      baseControls.RetExtraInfo = new FormControl('', Validators.required);
    }
    // Return the form group with the configured controls
    return this.fb.group(baseControls);
  }

  getPrefferedAirlineList(event: any,value): void {
    this.shouldPreferedAirLineHide=value;
    if (event && event.target.value) {
        const name = `${event.target.value}`;
        this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', { name })
            .pipe(
                shareReplay(1),
                untilDestroyed(this)
            )
            .subscribe((resp: any) => {
                if (resp.Status) {
                    this.searchedAirLineList = resp.data;
                } else {
                    const msg = resp['Message'];
                    this.searchedAirLineList.length = 0;
                }
                this.cdRef.detectChanges()
            });
    }
}


  addAccomodationForm(): FormGroup {
    // Define base form controls with default values
    const baseControls = {
      J1_AccommodationAddress: new FormControl(''),
      J1_PropertyName: new FormControl(''),
      AccommodationAddress: new FormControl(this.blockedTransfer.Destination)
    };
    console.log(this.blockedTransfer);
   // baseControls.AccommodationAddress.disable();
    // Conditionally add validators if IsAccomadationAddress is true
    if (this.blockedTransfer.IsAccomadationAddress) {
      baseControls.J1_AccommodationAddress = new FormControl(this.blockedTransfer.Origin, Validators.required);
      baseControls.J1_PropertyName = new FormControl(this.blockedTransfer.Origin, Validators.required);
      baseControls.AccommodationAddress = new FormControl(this.blockedTransfer.Origin, Validators.required);
    }
    // Return the form group with the configured controls
    return this.fb.group(baseControls);
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
      customerEmail: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      PhoneCode: new FormControl('44', [Validators.required]),
      PhoneCodeC: new FormControl('44', [Validators.required]),
      Contact: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.phoneNo)]),
      customer_phone: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.phoneNo)]),
      Country: new FormControl('UK', [Validators.required]),
    })
  }

  addAdult() {
    this.noOfAdult = this.transferSearchData.paxes[0].adultCount;
    this.noOfAdults = 1;
    for (let i = 0; i < this.noOfAdult; i++) {
      this.adultLeadPax = true;
      if (this.travellerForm.value['adult'].length < this.noOfAdults) {
        this.trevellers('adult').push(this.addTravellersDeatils('adult', i));
      }
    }
    // this.adultLeadPax = true;
    // this.trevellers('adult').push(this.addTravellersDeatils('adult', 0));

  }

  addChild() {
    this.noOfChild = this.transferSearchData.paxes[0].childCount;
    for (let i = 0; i < this.noOfChild; i++) {
      if (this.travellerForm.value['child'].length < this.noOfChild) {
        this.trevellers('child').push(this.addTravellersDeatils('child', i));
      }
    }
  }

  addSenior() {
    this.noOfSenior = this.transferTraveller.senior;
    for (let i = 0; i < this.noOfSenior; i++) {
      if (this.travellerForm.value['senior'].length < this.noOfSenior) {
        this.trevellers('senior').push(this.addTravellersDeatils('senior', i));
      }
    }
  }

  addYouth() {
    this.noOfYouth = this.transferTraveller.youth;
    for (let i = 0; i < this.noOfYouth; i++) {
      if (this.travellerForm.value['youth'].length < this.noOfYouth) {
        this.trevellers('youth').push(this.addTravellersDeatils('youth', i));
      }
    }
  }

  addInfant() {
    this.noOfInfant = this.transferSearchData.paxes[0].infantCount;
    for (let i = 0; i < this.noOfInfant; i++) {
      if (this.travellerForm.value['infant'].length < this.noOfInfant) {
        this.trevellers('infant').push(this.addTravellersDeatils('infant', i));
      }
    }
  }

  getPreferredAirLineList(event: any): void {
    let city = `${event.name}`;
    city = city.replace(/\s+/g, '');
    city = city.replace(/\b\w/g, char => char.toUpperCase());
    //let city = `${event.name}, (${event.code})`;
    if (city) {
      if (event.inputFor === 'prefferedAirline') {
        let controls=this.travellerForm.get('journey1') as FormArray;
        let journeyControl = controls.at(0); // For the first journey
        journeyControl.patchValue({
          DepExtraInfo:city
        })
      } else {
        let controls=this.travellerForm.get('journey2') as FormArray;
        let journeyControl = controls.at(0); // For the first journey
        journeyControl.patchValue({
          RetExtraInfo:city
        })
      }
      this.searchedAirLineList.length = 0;
  }
  this.cdRef.detectChanges();
  }

  onSelectModule(moduleName: string) {
    this.router.navigate([""]);
    return;
}

  
addTravellersDeatils(paxType, index, lead = 0): FormGroup {
  const paxValue = (paxType == 'adult' || paxType == 'senior') ? 1 : (paxType == 'infant' ? 3 : 2);
  let isLeadPassenger = false;
  if (this.adultLeadPax && paxType == 'adult' && index == 0) {
    isLeadPassenger = true;
  }
  // if (!this.adultLeadPax && paxType == 'senior' && index == 0) {
  //   isLeadPassenger = true;
  // }
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
    PassportIssuingCountry: ['IN',],
    Nationality: ['IN',],
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
    // Email:new FormControl('', [Validators.required,Validators.email]),
  })
}

  clearDetails(index, selectedSection) {
    this.travellerForm.controls[selectedSection]['controls'][index].patchValue({
        Title: '',
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Gender: '',
        PassportNumber: '',
        PassportIssuingCountry: 'IN',
        Dob: '',
        PassportExpiryDate: '',
        AddressLine1: '',
        AddressLine2: '',
        Email: '',
        PinCode: '',
        City: '',
        Nationality: 'IN',
        PassengerSelection: ''
    });
    if(selectedSection === 'adult' && index == 0){
      this.travellerForm.controls['address']['controls'][index].patchValue({
        Email: '',
        Contact: '',
      });
    }
}


  setPaxDetails(passengerDetails, index, selectedSection) {
    this.setPassengerTitle(passengerDetails, selectedSection);
    this.travellerForm.controls[selectedSection]['controls'][index].patchValue({
      Title: passengerDetails.title,
      FirstName: passengerDetails.first_name.toUpperCase(),
      LastName: passengerDetails.last_name.toUpperCase(),
      // Gender: passengerDetails.gender,
      // PassportNumber: passengerDetails.passport_no,
      // Dob: new Date(formatDate(new Date(passengerDetails.date_of_birth), 'yyyy-MM-dd', 'en-US')),
      // AddressLine1: passengerDetails.address,         
      // AddressLine2: passengerDetails.address1,
      // Email: passengerDetails.email,
      // PinCode: passengerDetails.postal_code,
      // City: passengerDetails.city,
      // Nationality: passengerDetails.country,
    });
    if(selectedSection === 'adult' && index == 0){
      this.travellerForm.controls['address']['controls'][index].patchValue({
        // Email: passengerDetails.email,
        PinCode: passengerDetails.postal_code,
        Contact: passengerDetails.phone_number,
      });
    }
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

  getTitleList() {
    this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {}, {}).subscribe(res => {
      this.transferService.userTitleList.next(res.data);
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
    let filteredSenior = this.travellerForm.controls.senior.value;
    let filteredTravellers;
    if (travellerAdult && travellerAdult.length > 0) {
      filteredTravellers = travellerAdult.filter(traveller => traveller.LeadPassenger === true);
    }
    if (filteredSenior && filteredSenior.length > 0) {
      filteredTravellers = filteredSenior.filter(traveller => traveller.LeadPassenger === true);
    }

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
    this.transferService.loading.next(true);
    this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
      module: "transfer"
    }).subscribe(res => {
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
        this.addPaxDetails(res.data);
      }
      else {
        this.transferService.loading.next(false);
      }
    }, (error) => {
      this.transferService.loading.next(false);
    }
    );
  }

  addPaxDetails(appRef) {
   const inboundCtrl = this.travellerForm.get('inbound_notes');
const outboundCtrl = this.travellerForm.get('outbound_notes');
const { BookingSource, body } = this.blockedTransfer;

if (BookingSource === 'ZBAPINO00022') {
  // Set validators based on return type
  inboundCtrl.setValidators([Validators.required]);

  if (body.IsReturn === 1) {
    outboundCtrl.setValidators([Validators.required]);
  } else {
    outboundCtrl.clearValidators();
  }
} else {
  inboundCtrl.clearValidators();
  outboundCtrl.clearValidators();
}

// Update form state
inboundCtrl.updateValueAndValidity();
outboundCtrl.updateValueAndValidity();

// 🔒 Validate before proceeding
if (BookingSource === 'ZBAPINO00022') {
  const inboundEmpty = !inboundCtrl.value.trim();
  const outboundEmpty = !outboundCtrl.value.trim();

  if (body.IsReturn === 0 && inboundEmpty) {
    this.swalService.alert.oops('Please fill Inbound Meeting point details.');
    this.transferService.loading.next(false);
    return;
  }

  if (body.IsReturn === 1 && (inboundEmpty || outboundEmpty)) {
    this.swalService.alert.oops('Please fill Meeting point details.');
    this.transferService.loading.next(false);
    return;
  }
}

    let passengerDetails = this.generatePassengerDetails();
    let addressDetails = this.travellerForm.get('address').value;
    let bookingQuestions = this.travellerForm.get('bookingQuestions').value;
    let accomodation=this.travellerForm.get('accomodation').value;
    let journey1=this.travellerForm.get('journey1').value;
    let journey2=this.travellerForm.get('journey2').value;
    let extras=this.updateSelectedValues();
    let request = {
      ResultToken: this.blockedTransfer.BookingSource === "ZBAPINO00022" ?  this.blockedTransfer.ResultToken : this.blockedTransfer.ResultIndex,
      AppReference: appRef,
      UserType: 'B2B',
      Currency: this.blockedTransfer.Price.Currency,
      UserId: this.currentUser.id ? this.currentUser.id : 0,
      PromoCode: this.selectedPromocode,
      PassengerDetails: passengerDetails,
      AddressDetails: addressDetails[0],
      BookingQuestions: bookingQuestions,
      BookingSource: this.blockedTransfer.BookingSource,
      DepExtraInfo:journey1[0].DepExtraInfo,
      DepInfo:journey1[0].DepInfo,
      DepPoint:journey1[0].DepPoint,
      J1_AccommodationAddress:accomodation[0].J1_AccommodationAddress,
      J1_PropertyName:accomodation[0].J1_PropertyName,
      PropertyName:this.blockedTransfer.Destination,
      AccommodationAddress:accomodation[0].AccommodationAddress,
      RetExtraInfo:journey2[0].RetExtraInfo,
      RetInfo:journey2[0].RetInfo,
      RetPoint:journey2[0].RetPoint,
      Extras:extras,
      inbound_notes: this.travellerForm.value.inbound_notes,
      outbound_notes: this.travellerForm.value.outbound_notes

    }
    
    // if (this.currentUser.id == null) {
    //   delete request.UserId
    // }

    this.apiHandlerService.apiHandler('transferAddPax', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.transferService.loading.next(false);
        this.transferService.paxDetails.next(response.data);
        localStorage.setItem('paxDetails', JSON.stringify(response.data));
        this.router.navigate(['/search/transfer/transfers-confirm']);
      }
      else {
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable To Add Pax Details");
      }
    }, (err) => {
      this.transferService.loading.next(false);
      this.cdRef.detectChanges();
      this.swalService.alert.oops(err.error.Message);
    });
  }

  updateSelectedValues() {
    const updatedValues = this.selectedValues.map((value) => {
      if (value) {
        return {
          id: value.ExtrasID,
          NoOf: value.selectedCount || 0,
          code: value.ExtrasCode,
          name:value.Extras_Description
        };
      }
      return []; 
    }).filter(Boolean); 
    return updatedValues; // Return the filtered array
  }

  getSearchedList(event: any,value): void {
    this.depPoint=value;
    if (event && event.target.value) {
        const text = `${event.target.value}`.trim();
        if(text && text.length>=3){
        this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { text })
            .pipe(
                shareReplay(1),
                untilDestroyed(this)
            )
            .subscribe((resp: any) => {
                if (resp.Status) {
                    this.searchedList = resp.data;
                } else {
                    const msg = resp['Message'];
                    this.searchedList=[];
                }
                this.cdRef.detectChanges()
            });
        }
        else{
            this.searchedList=[];
        }
    }
}

  generatePassengerDetails() {
    let passengerDetails: any = [];
    passengerDetails.push(this.travellerForm.get('adult').value);
    passengerDetails.push(this.travellerForm.get('senior').value);
    passengerDetails.push(this.travellerForm.get('child').value);
    passengerDetails.push(this.travellerForm.get('youth').value);
    passengerDetails.push(this.travellerForm.get('infant').value);
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
          this.promocodeList = res.data.filter(element => element.category == 'Transfer');
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
    this.selectedPromocode = "";
    //this.txtCouponCodeValue="";
    this.disableApplyPromo = false;
    this.cdRef.detectChanges();
    this.transferService.transferPromocode.next({
      promocode: ''
    });
    localStorage.setItem('transferPromocode', JSON.stringify(''));
  }

  applyCoupon() {
    this.transferService.loading.next(true);
    let coupon = this.txtCouponCodeValue;
    this.removeSelectedPromo();
    let request = {
      promocode: coupon
    }
    this.apiHandlerService.apiHandler('getPromoCodeInfo', 'POST', '', '', request).subscribe(response => {
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data && response.data[0]) {
        this.disableApplyPromo = true;
        this.transferService.loading.next(false);
        this.cdRef.detectChanges();
        this.setPromoCode(response.data[0]);
      }
      else {
        this.disableApplyPromo = false;
        this.txtCouponCodeValue = "";
        this.transferService.loading.next(false);
        this.cdRef.detectChanges();
      }
    }, (error) => {
      this.txtCouponCodeValue = "";
      this.transferService.loading.next(false);
      this.disableApplyPromo = false;
      this.cdRef.detectChanges();
    }
    );
  }

  setPromoCode(promocode) {
    this.selectedPromocode = promocode.promo_code;
    this.transferService.transferPromocode.next({
      promocode: promocode
    });
    localStorage.setItem('transferPromocode', JSON.stringify(promocode));
  }

  setSelectedPromo(promocode, index) {
    this.promocodeList.forEach((code, i) => {
      code.selected = (i === index); // Set selected to true only for the clicked index
    });
    this.txtCouponCodeValue = "";
    this.setPromoCode(promocode);
  }

  removePromoCode() {
    this.transferService.transferPromocode.next({
      promocode: ''
    });
    localStorage.setItem('transferPromocode', JSON.stringify(''));
  }

  getCity(event: any): void {
    let city = `${event.AirportCity}, ${event.CountryName}, ${event.AirportName}(${event.AirportCode})`;
    if (city) {
        if (event.inputFor === 'DepCity') {
          let controls=this.travellerForm.get('journey1') as FormArray;
          let journeyControl = controls.at(0); // For the first journey
          journeyControl.patchValue({
            DepPoint:event.AirportCode,
            DepCity:city
          })
        } else {
          let controls=this.travellerForm.get('journey2') as FormArray;
          let journeyControl = controls.at(0); // For the first journey
          journeyControl.patchValue({
            RetPoint:event.AirportCode,
            RetCity:city
          })
        }
        this.searchedList.length = 0;
    }
    this.cdRef.detectChanges();
  }
  onDropdownChange(value: number, index: number, selectedValue: any) {
    let data = this.selectedValues.find(v => v.ExtrasCode === selectedValue.ExtrasCode);

    if (data) {
      // Update the selected count
      data.selectedCount = (+value);
    }
    this.selectedExtras[index] = value;
    this.calculateTotal();
    // Update the checkbox state based on the dropdown value
    if (value > 0) {
      this.setExtras(true, selectedValue, index,value);
    } else {
      this.setExtras(false, selectedValue, index,value);
    }
  }
  openStaticPage(page_title) {
    sessionStorage.setItem('static_title', page_title);
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['auth/cms'])
    );
    window.open('#' + url, '_blank');
}
patchEmailFromSession(index: number): void {
  // Ensure the session data exists
  
  if (this.currentUser && this.currentUser.email) {
    const addressArray = this.travellerForm.get('address') as FormArray;
    if (addressArray && addressArray.at(index)) {
      const addressGroup = addressArray.at(index) as FormGroup;
      addressGroup.get('Email').patchValue(this.currentUser.email);
      // addressGroup.get('Email').disable();
    } else {
      console.error('Invalid index or FormArray not found');
    }
  } else {
    console.error('Email not found in session storage');
  }
}


async addToCartWithMessage(): Promise<void> {

 

  const cartTransferData = JSON.parse(sessionStorage.getItem("cartData"));
//   if (!cartTransferData) {
//       await this.addBundleBooking(); // Add item if it's not already in the cart
//       await this.addAutoSearchData(location); 
//   } else {
//       this.cartMessage = 'Item already in cart'; 
//  }

      await this.addBundleBooking(); // Add item if it's not already in the cart
      await this.addAutoSearchData(location); 

  setTimeout(() => {
    this.cartMessage = '';
    this.cdRef.detectChanges(); 
  }, 2000);
}

openSearch(type) {
  if (type === 'flight') {
      this.openFlightSearch(type);
  } else if (type === 'hotel') {
      this.openHotelSearch(type);
  }
  else if (type === 'activity') {
  this.openActivitySearch(type);
}

}


openFlightSearch(data?): void {
  console.log('Flight data', data);
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
          tabvalue: 'flights'
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

openActivitySearch(data?): void {
        this.dialog.open(CustomDialogWrapperComponent, {
            width: '80vw',
            height: '70vh',
            maxWidth: '100vw',
            maxHeight: '65%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
            data: {
                component: ActivitySearchFormComponent,
                title: 'Activity Search'
            }
        });
    }

// addBundleBooking() {
//   const cartData = JSON.parse(sessionStorage.getItem("cartData"));
//   let item = {
//       refNumber: cartData ? cartData.refNumber : null,
//       ResultToken: this.blockedTransfer.ResultIndex,
//       exitingToken: cartData ? cartData.ResultIndex : "",
//       module: "transfer",
//       bookingSource: this.blockedTransfer.BookingSource,
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
            if(key === 'transfer') {
                const req = {
                ResultToken: this.cartItems.ResultIndex,
                refNumber: this.cartItems.refNumber || null,
                module: 'transfer',
                };
            
                this.cartService.removeCart(req).subscribe(
                (res) => {
                    this.cartService.cartItemsSubject.next(res.data);
                    sessionStorage.setItem('cartData', JSON.stringify(res.data));

                    this.transferAddToCart();
                },
                (error) => {
                    this.swalService.alert.oops();
                }
                );
            }
        })
      })
    }
    
    transferAddToCart() {
        const cartData = JSON.parse(sessionStorage.getItem("cartData"));
        const currentCart = this.cartService.getCartList(); 
        this.cartService.cartItems.subscribe((items) => {
            console.log("items",items)
            this.cartItems = items;
        });
        let item = {
            refNumber: cartData ? cartData.refNumber : null,
            ResultToken: `${this.blockedTransfer.ResultIndex}`,
            exitingToken: this.cartItems ? this.cartItems.ResultIndex : "",
            module: "transfer",
            bookingSource: this.blockedTransfer.BookingSource,
        }
        this.cartMessage = `Transfer added to cart!`;
        console.log("Adding item to cart:", item);
        this.cartService.addCart(item); // Make sure this method updates cart state properly
        this.cdRef.detectChanges();
    }


async addBundleBooking() {
  const cartTransferData = JSON.parse(sessionStorage.getItem("cartData"));
  let item = {
    refNumber: cartTransferData ? cartTransferData.refNumber : null,
    ResultToken: this.blockedTransfer.ResultIndex,
    exitingToken: cartTransferData ? cartTransferData.ResultIndex : "",
    module: "transfer",
    bookingSource: this.blockedTransfer.BookingSource,
}
  
  // // Check if item is already in the cart before adding it
  if (!this.isItemAlreadyInCart(item)) {
      this.cartService.addCart(item); // Add item to cart via CartService
      this.cartMessage = `Transfer added to cart!`;
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
  console.log("Transfer Data", this.blockedTransfer);
  let item = {
      // "city_code": this.selectedLocation.code,
      // "city_name": this.selectedLocation.location_name,
      "city_code": this.selectedCity.AirportCode,
      "city_name": this.selectedLocation.destination_id.cityName,
      "module": "transfer",
      "userType": "B2B",
      "date": this.blockedTransfer.BookingDate
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

restrictNumbers(event: KeyboardEvent) {
  const regex = /^[a-zA-Z\s]*$/;
  if (!regex.test(event.key)) {
    event.preventDefault(); // Prevent input if not a letter or space
  }
}


  ngOnDestroy(): void {
  }

        getImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }

}
