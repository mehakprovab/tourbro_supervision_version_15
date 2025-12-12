import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { TourService } from '../../../tour.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { BsDatepickerConfig, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
const baseUrl = environment.SA_URL;

@Component({
  selector: 'app-b2b-tour-details',
  templateUrl: './b2b-tour-details.component.html',
  styleUrls: ['./b2b-tour-details.component.scss']
})
export class B2bTourDetailsComponent implements OnInit {

  relatedToursOption: OwlOptions = {
    autoplay: true,
    autoHeight: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    margin: 30,
    animateOut: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },

  }

  tourDetails: any;
  grandTotal: any;
  noOfAdults: number = 0;
  noOfChild: number = 0;
  noOfInfant: number = 0;
  noOfStudent: number = 0;
  noOfMilitary: number = 0;
  noOfSenior: number = 0;
  noOfOthers: number = 0;
  tourVisiterFrom: FormGroup
  childrenPrice: number;
  enquiryForm: FormGroup
  isEnquiry: boolean = false;
  isBookNow: boolean = false;
  priceFound: boolean = false;
  submitted: boolean;
  bsDateConf: Partial<BsDatepickerConfig> = {};
  minDate = new Date();
  subSunk = new SubSink();
  currentUser: any;
  tours: any;
  tourList: any[];
  tourSearchData: any;
  CityName: any;
  tourData: any;
  showWarning: boolean = false;
  adultPrice: any = 0;
  childPrice: any = 0;
  infantPrice: any = 0;
  studentPrice: any = 0;
  seniorPrice: any = 0;
  militaryPrice: any = 0;
  otherPrice: any = 0;
  departureId: any;
  primaryColour: any;
	secondaryColour: any;
	loadingTemplate: any;
  loading: boolean;
  departureDates: any[] = [];
  getUserData: any[] = [];
  roomDetailsOptions:any[] = [];
  showAccommadation: boolean = false;
  selectedRooms: any[] = [];
  public paxCount: any;
  public disableSelect: boolean = false;
  public selectedCrsBeds: {
    [optionId: number]: {
      accommodation?: any;
      travelers?: number;
    };
  } = {};
  public selectedBeds: {
    [optionId: number]: {
      accommodation: any;
      adult?: number;
      child?: number;
      infant?: number;
      student?: number;
      senior?: number;
      military?: number;
      other?: number;
    };
  } = {};
  // selectedOptions: any[] = [];

  selectedOptions: { [key: string]: number } = {};
  finalSelections: { [key: string]: number[] } = {};
  travelerCount: number;
  public showPriceBreakDown: boolean = false;
  public totalTravelerPrice: any[] = [];
  public getIdTraveler: any;
  showRoomSelection: any;
  priceBreakDown: any;
  accommadationDetails: any;
  childCount: any[] = [];
  infantCount: any[] = [];
  studentCount: any[] = [];
  seniorCount: any[] = [];
  militaryCount: any[] = [];
  otherCount: any[] = [];
  noofChildSelected: any;
  childSelect: boolean = false;
  totalPrice: any;
  guidedLanguages: any;
  numberOfTravelers: any;
  numberOfChildrens: any;
  disableChildSelect: boolean = false;
  offerApplied: boolean = false;
  formInValid: boolean = false;
  showBookNow: boolean = false;
  optionalExtras: any[] = [];
  optionalExtraPaxCount: any;
  mandatoryAddon: any;
  mandatoryAddonPax: any;
  mandatoryAddingPrice = 0;
  mandatoryAddonObj: any;
  cruisData: any;
  optionalAddOnCount: any;
  optionalAddOnCPrice: any;
  optionalData: any[] = [];
  optionalAddonPrice = 0;
  resultPriceBreak: any[] = [];
  allotedChildWithAdult: boolean = false;
  adultOptions: any;
  childOptions: any;
  displayValidationMessage: any;
  showSelectionError: boolean = false;
  selectedId: any;
  roomValidationErrors : any = {};
  totalAdults: any;
  totalPaxCount: any;
  totlSelectedCount: any;
  disableSelectAccommodation:boolean = false;
  disableAdultSelection: boolean = false;
  localPaymentType: any;
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
  maxDateChild: any;
minDateChild: any;
minChilAge: any;
maxChilAge: any;
selectedChildAge: any;
selectedDateofDeparture: any;
public fromAgeRange = Array.from({ length: 17 }, (_, index) => index +1 );

disableAdultSelectionMap: { [roomId: string]: boolean } = {};
totalAdultPax = 0; // assign your total adult pax

  constructor(private apiHandlerService: ApiHandlerService,
    private tourServe: TourService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router,
    private util: UtilityService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getTourDetailsData()
    this.CityName = (JSON.parse(sessionStorage.getItem('tourSearchData')))['CityName'];
    this.getUserData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.subSunk.sink = this.tourServe.loading.subscribe(res => {
			this.loading = res;
		});
   
    this.createEnquiryForm();
    this.getToursdata();
    this.printTourDataForTest();
    this.getTourDetailsResponse();
  }

  getToursdata() {
    this.tourServe.tourCopy.subscribe(res => {
      if (res) {
        this.tourSearchData = res;
      }
      else {
        this.tourSearchData = localStorage.getItem(JSON.parse("tourSearchResult"));
      }
    });
  }

  createTourForm() {
    if (this.tourDetails.BookingSource === 'BGTAPINO00002') {
      const group: any = {
        departureDate: new FormControl('', [Validators.required])
      };
  
      this.tourDetails.paxPriceDetails.forEach(category => {
        // You can use title, title_plural or external_reference as keys
        const key = category.title.toLowerCase(); // safer for form keys
        group[key] = new FormControl(0, [Validators.required]);
      });
  
      this.tourVisiterFrom = this.fb.group(group);
    } else {
      this.tourVisiterFrom = this.fb.group({
        travellers: this.fb.array([]),
        adult: new FormControl(1, [Validators.required]),
        child: new FormControl(0, [Validators.required]),
        departureDate: new FormControl('', [Validators.required])
      })
    }
   
  }

  createEnquiryForm() {
    this.enquiryForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1), Validators.pattern(this.util.regExp.fullName)]),
      contactNumber: new FormControl('', [Validators.required, Validators.pattern(this.util.regExp.phoneNo)]),
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.util.regExp.email)]),
      // departurePlace: new FormControl('',[Validators.required,Validators.maxLength(100), Validators.minLength(2)]),
      departureDate: new FormControl('', [Validators.required]),
      //message: new FormControl('',[Validators.required,Validators.maxLength(100), Validators.minLength(2)]),
    })
  }

  onRedirect(tour: any) {
    this.tourServe.loading.next(true);
    const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'];
    const currency = this.util.readStorage('currentUser', sessionStorage)['currency'];
    this.subSunk.sink = this.apiHandlerService.apiHandler('tourDetail', 'POST', '', '', {
      ResultToken: tour.ResultIndex,
      BookingSource: tour.BookingSource,
      Currency: currency,
      UserId: created_by_id,
      UserType: "B2B"
    }).subscribe(async res => {
      if (res.data.length > 0 || res.data) {
        this.tourServe.bookingTourData.next(res.data);
        sessionStorage.setItem('tourBookingInfo', JSON.stringify(res.data));
        const childAgeMax = res.data.tourPrice;


           if ( res.tourPrice.length ) {
            res.tourPrice.forEach((price, index) => {
              if(price.child_age_groups.length) {
                const groups = price.child_age_groups;
                const minAge = Math.min(...groups.map(g => Number(g.from_age)));
                const maxAge = Math.max(...groups.map(g => Number(g.to_age)));
                this.minChilAge = minAge;
                this.maxChilAge = maxAge;
              }
            })
      }
            
        // this.router.navigate(['/tour-details']);
        await this.getTourDetailsData();
        this.getTourDetailsResponse();
        window.scroll(0, 0);
      } else {
        this.tourServe.loading.next(false);
        this.swalService.alert.oops(res.Message)
      }
      this.tourServe.loading.next(false);
      this.cdr.detectChanges();
    },
      (err) => {
        this.swalService.alert.oops(err.error.Message)
        this.tourServe.loading.next(false);
        this.cdr.detectChanges();
      });
  }

       addYearsToDate(baseDate: Date, y: number, m: number, d: number): Date {
        return new Date(
            baseDate.getFullYear() + y,
            baseDate.getMonth() + m,
            baseDate.getDate() + d
        );
}
  getTourDetailsData() {
    const result = JSON.parse(sessionStorage.getItem('tourBookingInfo'));
    if (result && Object.keys(result).length > 0) {
      this.tourDetails = result;
      const childAgeMax = result.tourPrice;
      let minFromAge: number | null = null;
      let maxToAge: number | null = null;
      if ( result.tourPrice.length ) {
        result.tourPrice.forEach((price, index) => {
          if(price.child_age_groups.length) {
            const groups = price.child_age_groups;
            const minAge = Math.min(...groups.map(g => Number(g.from_age)));
            const maxAge = Math.max(...groups.map(g => Number(g.to_age)));
            this.minChilAge = minAge;
            this.maxChilAge = maxAge;
          }
        })
        console.log(`Min from_age: ${minFromAge}, Max to_age: ${maxToAge}`);
      }
      
      this.cruisData = result.transport ? result.transport[0] : [];
      this.createTourForm();
      this.guidedLanguages = this.tourDetails.guideLanguage ? this.tourDetails.guideLanguage.map(lang => lang.name).join(', ') : [];
      this.grandTotal = result.tourPrice[0].adult_airliner_price;
      this.adultPrice =  result.tourPrice[0].adult_airliner_price;
      this.childrenPrice = result.tourPrice[0].child_airliner_price;
      this.updateGrandTotalPrice();
    }
  }

  getTourImage(img) {
    return `${baseUrl + '/sa/tour/tours/getBannerImage/' + img}`;
  }

  printTourDataForTest() {
  }

  getTourValuation() {
    this.tourServe.loading.next(true);
    const formData = this.tourVisiterFrom.value;
    this.subSunk.sink = this.apiHandlerService.apiHandler('tourValuation', 'POST', '', '', {
      ResultToken: this.tourDetails.ResultIndex,
      BookingSource:  this.tourDetails.BookingSource,
      DepartureId: this.departureId,
      AdultCount: formData.adult,
      ChildCount: formData.child,
      InfantCount: formData.infant,
      StudentCount: formData.student,
      SeniorCount: formData.senior,
      MilitaryCount: formData.military,
      OthersCount: formData.other
    }).subscribe(async res => {
      if (res.data.length > 0 || res.data) {
        this.tourServe.loading.next(false);
        this.tourServe.bookingTourData.next(res.data);
        sessionStorage.setItem('tourBookingInfo', JSON.stringify(res.data));
        // this.router.navigate(['/tour-details']);
        this.router.navigate(['/search/tour/tour-final-booking'], {
          state: {
            adult: formData.adult,
            child: formData.child,
            infant: formData.infant,
            student: formData.student,
            senior: formData.senior,
            military: formData.military,
            other: formData.other,
            departureDate: formData.departureDate,
            childAges: formData.travellers
          }
        });
      } else {
        this.tourServe.loading.next(false);
        this.swalService.alert.oops(res.Message)
      }
      this.tourServe.loading.next(false);
      this.cdr.detectChanges();
    },
      (err) => {
        this.swalService.alert.oops(err.error.Message)
        this.tourServe.loading.next(false);
        this.cdr.detectChanges();
      });
  }

  onContactInput(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onBookNow() {
    const formData = this.tourVisiterFrom.value;
     if (!this.tourVisiterFrom.valid) {
      return;
    }
    // Navigate to the next route with state
    if(this.tourDetails.BookingSource === 'BGTAPINO00002') {
      this.bookTour();
    }
    else {
      this.router.navigate(['/search/tour/tour-final-booking'], {
        state: {
          adult: formData.adult,
          child: formData.child,
          departureDate: formData.departureDate,
          childAges: formData.travellers
        }
      });
    }
  }

  onSubmitEnquiryForm() {
    this.submitted = true;
    this.currentUser = this.util.readStorage('currentUser', sessionStorage);
    if (!this.enquiryForm.valid) {
      console.log('from is not valid')
      return;
    } else {
      const enquiryData = {
        TourId: this.tourDetails.id,
        Name: this.enquiryForm.get('name').value,
        ContactNumber: this.enquiryForm.get('contactNumber').value,
        Email: this.enquiryForm.get('email').value,
        DepartureDate: this.enquiryForm.get('departureDate').value,
        DeparturePlace: this.tourDetails.startCity,
        // Message: this.enquiryForm.get('message').value,
        UserId: this.currentUser.id,
        UserType: 'B2B'
      }
      this.subSunk.sink = this.apiHandlerService.apiHandler('sendEnquiry', 'post', '', '', enquiryData).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.swalService.alert.success("You enquiry has been submitted. Our representative will get back to you soon!!")
            this.submitted = false;
            this.isEnquiry = false;
            this.enquiryForm.reset();
          }
        }, (err) => {
          this.submitted = false;
          this.swalService.alert.success(err.error.message)
        }
      );
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.tourVisiterFrom.controls[controlName].touched) && this.tourVisiterFrom.controls[controlName].hasError(errorName));
  }
  hasErrorEnquiry = (controlName: string, errorName: string) => {
    return ((this.submitted || this.enquiryForm.controls[controlName].touched) && this.enquiryForm.controls[controlName].hasError(errorName));
  }

  onSendEnquiry(tour: any) {

  }
  enableSendEnquiryForm() {
    this.isEnquiry = true;
  }
  cancelEnquiry() {
    this.isEnquiry = false
    this.isBookNow = false;
    // this.tourVisiterFrom.reset();
    this.enquiryForm.reset();
    this.enquiryForm.markAsUntouched();
    this.enquiryForm.clearValidators();
  }
  onUpdateTourTraveller(tourPersonType: string, operation: string) {
    if (operation === 'minus') {
      if ((tourPersonType == 'adult'|| tourPersonType == 'Adult')  && this.noOfAdults > 1) {
        this.noOfAdults -= 1;
      } else if ((tourPersonType == 'child' || tourPersonType == 'Child')  && this.noOfChild > 0) {
        if (this.tourDetails.BookingSource !== 'BGTAPINO00002') {
          const travellersArray = this.tourVisiterFrom.get('travellers') as FormArray;
        const lastIndex = travellersArray.length - 1;
        this.removeAges(lastIndex);
        }
        
        this.noOfChild -= 1;
      }
      else if ((tourPersonType === 'infant' || tourPersonType === 'Infant')  && this.noOfInfant > 0) {
        this.noOfInfant -= 1;
      } else if ((tourPersonType === 'student' || tourPersonType === 'Student')  && this.noOfStudent > 0) {
        this.noOfStudent -= 1;
      } else if ((tourPersonType === 'senior' || tourPersonType === 'Senior')  && this.noOfSenior > 0) {
        this.noOfSenior -= 1;
      } else if ((tourPersonType === 'military' || tourPersonType === 'Military')  && this.noOfMilitary > 0) {
        this.noOfMilitary -= 1;
      } else if ((tourPersonType === 'other' || tourPersonType === 'Other')  && this.noOfOthers > 0) {
        this.noOfOthers -= 1;
      }
    } else {
      if (tourPersonType == 'adult' || tourPersonType == 'Adult') {
        this.noOfAdults += 1;
      } else if (tourPersonType == 'child' || tourPersonType == 'Child') {
        if (this.tourDetails.BookingSource !== 'BGTAPINO00002') {
          this.addChildTraveller();
        }
        this.noOfChild += 1;
      } else if(tourPersonType === 'infant' || tourPersonType === 'Infant') {
        this.noOfInfant += 1;
      } else if (tourPersonType === 'student' || tourPersonType === 'Student') {
        this.noOfStudent += 1;
      } else if (tourPersonType === 'senior' || tourPersonType === 'Senior') {
        this.noOfSenior += 1;
      } else if (tourPersonType === 'military' || tourPersonType === 'Military') {
        this.noOfMilitary += 1;
      } else if (tourPersonType === 'other' || tourPersonType === 'Other') {
        this.noOfOthers += 1;
      }
    }
    this.tourVisiterFrom.patchValue({
      adult: this.noOfAdults ,
      child: this.noOfChild,
      infant: this.noOfInfant,
      student: this.noOfStudent,
      senior: this.noOfSenior,
      military: this.noOfMilitary,
      other: this.noOfOthers
    })
    // this.tourVisiterFrom.get('adult').patchValue(this.noOfAdults);
    // this.tourVisiterFrom.get('child').patchValue(this.noOfChild);
    this.updateGrandTotalPrice();
  }

  addChildTraveller() {
    const traveller = this.fb.group({
      childAge: new FormControl('', [Validators.required]),
      ages:['']
    })
    this.childAges.push(traveller);
  }

  get childAges(): FormArray {
    return this.tourVisiterFrom.get('travellers') as FormArray;
  }
  
  removeAges(index: number) {
    this.childAges.removeAt(index);
  }

  updateGrandTotalPrice() {
    this.grandTotal = (this.noOfAdults * this.adultPrice) + (this.noOfChild * this.childrenPrice);
  }


  setBlockedTourData(selectedDate: Date) {
    this.priceFound = false; // Reset priceFound
    this.selectedDateofDeparture = selectedDate;
    if (this.tourDetails && this.tourDetails.BookingSource === "BGTAPINO00002") {
      for (const price of this.tourDetails.tourPrice) {
        const depDate = new Date(price.dep_date).toDateString();
        const selectedDateStr = new Date(selectedDate).toDateString();
        if (selectedDateStr === depDate) {
          this.adultPrice = price.adult_airliner_price;
          this.childPrice = price.child_airliner_price;
          this.departureId = price.id
          this.priceFound = true;
          this.formInValid = false;
          break;
        }
      }
    }
  
    if (this.tourDetails && this.tourDetails.BookingSource === "BGTAPINO00001") {
      for (const price of this.tourDetails.tourPrice) {
        const fromDate = new Date(price.from_date);
        const toDate = new Date(price.to_date);
        if (selectedDate >= fromDate && selectedDate <= toDate) {
          this.adultPrice = price.adult_airliner_price;
          this.childPrice = price.child_airliner_price;
          this.formInValid = false;
          this.priceFound = true;
          break;
        }
      }
    }
  
    this.showWarning = !this.priceFound;
  }
  


  onUpdateTourTravellerCount(tourPersonType: string, operation: string) {
    let maxCount = 9; // Maximum total count of adult and children
    let totalPersons = this.noOfAdults + this.noOfChild;

    if (operation === 'minus') {
      if (tourPersonType === 'adult' && this.noOfAdults > 1) {
        this.noOfAdults -= 1;
      } else if (tourPersonType === 'child' && this.noOfChild > 0) {
        this.noOfChild -= 1;
      }
    } else {
      if (totalPersons < maxCount) {
        if (tourPersonType === 'adult') {
          this.noOfAdults += 1;
        } else if (tourPersonType === 'child') {
          this.noOfChild += 1;
        }
      }
    }

    this.noOfAdults = Math.min(this.noOfAdults, maxCount - this.noOfChild); // Ensure noOfAdults doesn't exceed the difference between maxCount and noOfChild
    this.noOfChild = Math.min(this.noOfChild, maxCount - this.noOfAdults); // Ensure noOfChild doesn't exceed the difference between maxCount and noOfAdults

    this.tourVisiterFrom.get('adult').patchValue(this.noOfAdults);
    this.tourVisiterFrom.get('child').patchValue(this.noOfChild);

    this.updateGrandTotalPrice();
  }

getTourDetailsResponse() {
  const result = this.tourDetails;
  if (result && result.tourPrice && result.tourPrice.length > 0) {
    if (result.BookingSource === "BGTAPINO00001") {
      const dates: Date[] = [];
      const startDate = new Date(result.start_date);
      const endDate = new Date(result.expire_date);

      for (
        let currentDate = new Date(startDate);
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const dateOnly = new Date(currentDate);
        dateOnly.setHours(0, 0, 0, 0);
        dates.push(dateOnly);
      }
      const date = new Date();
      this.departureDates = dates.filter(dateStr => new Date(dateStr) >= date);;
      if (this.departureDates.length > 0) {
        this.minDate = new Date(this.departureDates[0]);
      }

    } else {
      this.departureDates = result.tourPrice.map((tour) => {
        const date = new Date(tour.dep_date);
        date.setHours(0, 0, 0, 0);
        return date;
      });

      if (this.departureDates.length > 0) {
        this.minDate = new Date(this.departureDates[0]);
      }
    }

    this.bsDateConf = {
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-blue',
      showWeekNumbers: false,
      dateCustomClasses: this.getDateCustomClasses(),
      customTodayClass: 'today-highlight',
      datesEnabled: this.departureDates
    };
  }
}


  getDateCustomClasses(): DatepickerDateCustomClasses[] {
    const customClasses: DatepickerDateCustomClasses[] = [];

    // Assign departure-highlight class to each departure date
    if (this.departureDates && this.departureDates.length > 0) {
      this.departureDates.forEach((date) => {
        customClasses.push({
          date: date, // Ensure it's a valid Date object
          classes: ['bg-primary', 'text-white']
        });
      });
    }

    return customClasses;
  }

  clearSelectedBeds() {
    this.roomValidationErrors = {}; 
    this.checkAccommadation();
  }

  checkAccommadation() {
    this.disableAdultSelectionMap = {};
    if (!this.tourVisiterFrom.valid) {
      this.formInValid = true;
      return ;
    }
    if (this.tourVisiterFrom.value.adult <= 0) {
      return;
    }
    this.formInValid = false;
    this.loading = true;
    this.showAccommadation = true;
    this.disableSelect = false;
    this.selectedBeds = {}
    this.childCount = [];
    this.studentCount = [];
    this.seniorCount = [];
    this.infantCount = [];
    this.militaryCount = [];
    this.otherCount = [];
    const formData = this.tourVisiterFrom.value;
    this.disableChildSelect = false;
    this.totalAdults = formData.adult
    this.paxCount = this.tourDetails.BookingSource === 'BGTAPINO00002' ? formData.adult : formData.adult + formData.child + formData.infant + formData.student + formData.senior + formData.military + formData.other;
    this.numberOfTravelers = this.tourDetails.BookingSource === 'BGTAPINO00002' ? formData.adult : formData.adult + formData.child + formData.infant + formData.student + formData.senior + formData.military + formData.other;
    const payLoad = {
      ResultToken: this.tourDetails.ResultIndex,
      BookingSource: this.tourDetails.BookingSource,
      DepartureId: this.departureId,
      AdultCount: formData.adult ? formData.adult : 0,
      ChildCount: formData.child ? formData.child : 0,
      InfantCount: formData.infant ? formData.infant : 0,
      StudentCount: formData.student ? formData.student : 0 ,
      SeniorCount: formData.senior ? formData.senior : 0,
      MilitaryCount: formData.military ? formData.military : 0 ,
      OthersCount: formData.other ? formData.other : 0,
      UserType: "B2B",
      UserId: this.getUserData['id'],
      Currency: this.getUserData['currency']
    }
    this.showPriceBreakDown = false;
    this.apiHandlerService.apiHandler('getAccommadationDetails', 'POST', '', '', payLoad).subscribe(
      (resp) => {
        this.loading = false;
        if (resp.statusCode === 200 && resp.data) {
          const element = document.getElementById('accommadationDetails');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          resp.data.prices.accommodations.map(data => {
            if (data.code === "STANDARD" &&
              data.beds_number < this.tourVisiterFrom.value.adult) {
              data.beds_number = this.tourVisiterFrom.value.adult
            }
            if (data.beds_number === null ) {
              data.beds_number = formData.adult
            }
          });
          this.accommadationDetails = resp.data;
          this.roomDetailsOptions = resp.data.prices.accommodations;
         
          this.optionalExtras = resp.data.prices.optional_extras;
          this.optionalExtraPaxCount = formData.adult * 1 + (formData.child || 0) * 1 + (formData.infant || 0) * 1 + (formData.student || 0) * 1
          +(formData.senior || 0) * 1 + (formData.military || 0) * 1 + (formData.other || 0) * 1;
          this.mandatoryAddon = resp.data.prices.mandatory_addons;
          console.log(this.optionalExtras)
          this.showRoomSelection = resp.data.prices.based_on;
          this.priceBreakDown = resp.data.prices.accommodations[0];
          for (let i = 0; i < Number(this.tourVisiterFrom.value.child); i++) {
            this.childCount.push(i + 1) || [];
          }
          for (let i = 0; i < Number(this.tourVisiterFrom.value.infant); i++) {
            this.infantCount.push(i + 1) || [];
          }
          for (let i = 0; i < Number(this.tourVisiterFrom.value.student); i++) {
            this.studentCount.push(i + 1) || [];
          }
          for (let i = 0; i < Number(this.tourVisiterFrom.value.senior); i++) {
            this.seniorCount.push(i + 1) || [];
          }
          for (let i = 0; i < Number(this.tourVisiterFrom.value.military); i++) {
            this.militaryCount.push(i + 1) || [];
          }
          for (let i = 0; i < Number(this.tourVisiterFrom.value.other); i++) {
            this.otherCount.push(i + 1) || [];
          }
          resp.data.prices.accommodations.forEach(data => {
            if (data.code === "STANDARD") {
              data.beds_number = formData.adult
              data.price_tiers.forEach((res) => {
                if (res.pax_min === 1 && res.pax_max === null || res.pax_max === '') {
                  this.disableSelectAccommodation = true;
                  let type;
                  type = formData.adult ? 'adult' : 'child';
                  const dataTravel = { target: { value: formData.adult}}
                  this.onBedsSelected(data.id, dataTravel, data, type, this.mandatoryAddon)
                }
              })
            }
          });
        } else {
          this.roomDetailsOptions = [];
          this.loading = false;
          this.showAccommadation = false;
          this.swalService.alert.error(resp.Message || 'Something went wrong please try again.!')
        }

      }, (err) => {
        this.loading = false;
        this.showAccommadation = false;
        this.swalService.alert.error(err.Message || 'Something went wrong please try again.!')
      }
    )
  }

  generateNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  
  generateNumberArray2(option): number[] {

    const formData = this.tourVisiterFrom.value;
    // const totalAdults = formData.adult || 0;
    // const childCount = formData.child || 0;
    // const maxBeds = option.beds_number;

    // const hasChildPricing = option.price_tiers.some(tier => tier.pax_type === 'Child');

    let maxAdults;

    // if (!option.is_shared) {
    //   if (hasChildPricing) {
    //     maxAdults = (maxBeds ) ;
    //   }
    // }

    // if (!option.is_shared && !hasChildPricing) {
    //   maxAdults = maxBeds;
    // }

    // if (option.is_shared === true) {
      maxAdults = formData.adult;
    // }

    // maxAdults = Math.min(maxAdults);

    // if (maxAdults < 0) return [];

    return Array.from({ length: maxAdults + 1 }, (_, i) => i);
  }

  generateChildNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.child || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Child');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

   generateInfantNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.infant || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Infant');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

   generateStudentNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.student || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Student');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

   generateSeniorNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.senior || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Senior');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

   generateMilitaryNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.military || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Military');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

   generateOtherNumberArray(option): number[] {
  const formData = this.tourVisiterFrom.value;
  const totalChildren = formData.other || 0;

  const hasChildPricing = option.price_tiers.some(t => t.pax_type === 'Other');
  if (!hasChildPricing) return [];

  return Array.from({ length: totalChildren + 1 }, (_, i) => i);
  }

validateChildInfantAllocation(result: any[], formData: any): boolean {
  let allocatedChild = 0;
  let allocatedInfant = 0;

  const totalChild = formData.child || 0;
  const totalInfant = formData.infant || 0;

  for (const entry of result) {
    const roomId = Object.keys(entry)[0];
    const paxArray = entry[roomId];

    let hasAdult = paxArray.some(p => p.PaxType === "Adult");
    let hasStudent = paxArray.some(p => p.PaxType === "Student");
    let guardianPresent = hasAdult || hasStudent;

    // Count children
    let childCount = paxArray
      .filter(p => p.PaxType === "Child")
      .reduce((sum, p) => sum + Number(Object.values(p).find(v => typeof v === "number")), 0);

    // Count infants
    let infantCount = paxArray
      .filter(p => p.PaxType === "Infant")
      .reduce((sum, p) => sum + Number(Object.values(p).find(v => typeof v === "number")), 0);

    allocatedChild += childCount;
    allocatedInfant += infantCount;

    // ❌ Child must be with Adult OR Student
    if (childCount > 0 && !guardianPresent) return false;

    // ❌ Infant must be with Adult OR Student
    if (infantCount > 0 && !guardianPresent) return false;
  }

  // Ensure all children & infants are allocated
  if (allocatedChild !== totalChild) return false;
  if (allocatedInfant !== totalInfant) return false;

  return true;
}


  getCategoryId(option, type: string) {
     if (!option || !Array.isArray(option.price_tiers)) return null;

    const tier = option.price_tiers.find(
      t => t.pax_type.toLowerCase() === type.toLowerCase()
    );

    return (tier && tier.price_category_id) ? tier.price_category_id : null;
  }

  onBedsSelected(optionId: number, selectedTravelers: any, option: any, type , mandatoryAddon): void {
    if (this.tourDetails.BookingSource === 'BGTAPINO00002') {
      if (!this.selectedBeds[optionId] ) {
        this.selectedBeds[optionId] = {
          accommodation: option,
          adult: type === 'adult' ? selectedTravelers.target.value : 0,
          child: type === 'child' ? selectedTravelers.target.value : 0,
          infant: type === 'infant' ? selectedTravelers.target.value : 0,
          student: type === 'student' ? selectedTravelers.target.value : 0,
          senior: type === 'senior' ? selectedTravelers.target.value : 0,
          military: type === 'military' ? selectedTravelers.target.value : 0,
          other: type === 'other' ? selectedTravelers.target.value : 0
        };
      }
      this.selectedId = optionId;

    const selectedCount = Number(selectedTravelers.target.value);
    const totalAdults = this.tourVisiterFrom.value.adult;

     if (!this.disableAdultSelectionMap || Object.keys(this.disableAdultSelectionMap).length === 0) {
      this.disableAdultSelectionMap = {};
      this.roomDetailsOptions.forEach(room => {
        this.disableAdultSelectionMap[room.id] = false;
      });
    }


    Object.keys(this.disableAdultSelectionMap).forEach(id => {
      this.disableAdultSelectionMap[id] = true;
    });
    this.disableAdultSelectionMap[optionId] = false;

    if (selectedCount === totalAdults) {

        Object.keys(this.disableAdultSelectionMap).forEach(id => {
            if (Number(id) != Number(optionId)) this.disableAdultSelectionMap[id] = true;
        });

    } else {
        Object.keys(this.disableAdultSelectionMap).forEach(id => {
            this.disableAdultSelectionMap[id] = false;
        });
    }
      this.selectedBeds[optionId][type] =  Number(selectedTravelers.target.value);;

      const totalTravelers = Object.values(this.selectedBeds).reduce((acc, data) => {
        return acc + (data.adult || 0);
      }, 0);

      const totalPaxCount = Object.values(this.selectedBeds).reduce((acc, data) => {
        return acc + (data.adult || 0) + (data.child || 0) + (data.infant || 0) + (data.student || 0)
          + (data.senior || 0) + (data.military || 0) + (data.other || 0);
      }, 0);
      this.totalPaxCount = totalPaxCount;


      const formData = this.tourVisiterFrom.value;
      const paxCount = formData.adult;
      const paxChild = formData.child ? formData.child : 0;
      const paxInfant = formData.infant ? formData.infant : 0;
      const paxStudent = formData.student ? formData.student : 0;
      const paxSenior = formData.senior ? formData.senior : 0;
      const paxMilitary = formData.military ? formData.military : 0;
      const paxOther = formData.other ? formData.other : 0;
      const totalCount = formData.adult * 1 + paxChild * 1 + paxInfant *1 + paxStudent * 1 + paxSenior * 1 + paxMilitary * 1 + paxOther * 1;
      this.totlSelectedCount = totalCount;
      this.mandatoryAddonPax = totalCount;
      
      if (totalPaxCount === totalCount ) {
        this.showBookNow = true;
      } else {
        this.showBookNow = false;
      }
      this.numberOfTravelers = paxCount - totalTravelers;

      if (totalTravelers === paxCount) {
        this.disableSelect = true;
      }

      this.selectedRooms = Object.values(this.selectedBeds).map(data => ({
        ...data.accommodation,
        travelers: (data.adult || 0),
        childCount: data.child || 0,
        infantCount: data.infant || 0,
        studentCount: data.student || 0,
        seniorCount: data.senior || 0,
        militaryCount: data.military || 0,
        otherCount: data.other || 0
      }));
      this.mandatoryAddingPrice = mandatoryAddon.reduce((total, room) => {
        let adultPrice = 0;
        
        if (Array.isArray(room.price_tiers)) {
          for (const tier of room.price_tiers) {
            adultPrice = Number(tier.price);
          }
        }
        return total + (this.mandatoryAddonPax * adultPrice);
      }, 0);
      
      this.totalPrice = this.selectedRooms.reduce((total, room) => {
        const adultCount = room.travelers || 0;
        const childCount = room.childCount || 0;
        const infantCount = room.infantCount || 0;
        const studentCount = room.studentCount || 0;
        const seniorCount = room.seniorCount || 0;
        const militaryCount = room.militaryCount || 0;
        const otherCount = room.otherCount || 0;

        let adultPrice = 0;
        let childPrice = 0;
        let infantPrice = 0;
        let studentPrice = 0;
        let seniorPrice = 0;
        let militaryPrice = 0;
        let othersPrice = 0;

        if (Array.isArray(room.price_tiers)) {
          for (const tier of room.price_tiers) {
            if (tier.pax_type === 'Adult') adultPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Child') childPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Infant') infantPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Student') studentPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Senior') seniorPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Military') militaryPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Other') othersPrice = Number(tier.promotion_price);
          }
        }
        return total + (adultCount * adultPrice) + (childCount * childPrice) +
        (infantCount * infantPrice) + (studentCount * studentPrice) + (seniorCount * seniorPrice) +
        (militaryCount * militaryPrice) + ( otherCount + othersPrice) ;
      }, 0);

      this.getIdTraveler = Object.values(this.selectedBeds).reduce((acc: any, data: any) => {
        acc[data.accommodation.id] = (data.adult || 0);
        return acc;
      }, {} as Record<string, string>);

      const allocatedPax = totalTravelers;
      this.paxCount = paxCount - allocatedPax;
      this.showPriceBreakDown = selectedTravelers.target.value <= paxCount;

      const result: any[] = [];
      for (const [roomId, data] of Object.entries(this.selectedBeds)) {
        const roomArr: any[] = [];

        const adultCategoryId =  this.getCategoryId(option, 'adult');
        const childCategoryId = this.getCategoryId(option, 'child');
        const infantCategoryId = this.getCategoryId(option, 'infant')
        const studentCategoryId = this.getCategoryId(option, 'student')
        const seniorCategoryId = this.getCategoryId(option, 'senior')
        const militaryCategoryId = this.getCategoryId(option, 'military')
        const otherCategoryId = this.getCategoryId(option, 'other')

        if (data.adult && adultCategoryId) {
          roomArr.push({
            [adultCategoryId]: data.adult,
            PaxType: "Adult"
          });
        }

        if (data.child && childCategoryId) {
          roomArr.push({
            [childCategoryId]: data.child,
            PaxType: "Child"
          });
        }

        if (data.infant && infantCategoryId) {
          roomArr.push({
            [infantCategoryId]: data.infant,
            PaxType: "Infant"
          });
        }
        if (data.student && studentCategoryId) {
          roomArr.push({
            [studentCategoryId]: data.student,
            PaxType: "Student"
          });
        }
        if (data.senior && seniorCategoryId) {
          roomArr.push({
            [seniorCategoryId]: data.senior,
            PaxType: "Senior"
          });
        }
        if (data.military && militaryCategoryId) {
          roomArr.push({
            [militaryCategoryId]: data.military,
            PaxType: "Military"
          });
        }

        if (data.other && otherCategoryId) {
          roomArr.push({
            [otherCategoryId]: data.other,
            PaxType: "Other"
          });
        }

        const entry: any = {
          [roomId]: roomArr
        };

        result.push(entry);
      }
      const isValid = this.validateChildInfantAllocation(result, this.tourVisiterFrom.value);

      this.allotedChildWithAdult = isValid;
      this.getIdTraveler = result;

      const childTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Child") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            childCount: total
        };
    });


    const infantTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Infant") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            infantCount: total
        };
    });


    const studentTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Student") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            studentCount: total
        };
    });

    const seniorTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Senior") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            seniorCount: total
        };
    });

    const militaryTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Military") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            militaryCount: total
        };
    });

    const otherTotal = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Other") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            otherCount: total
        };
    });

    const childTotalCount = childTotal.reduce((sum, data) => {
      return sum + data.childCount
    }, 0);

    const infantTotalCount = infantTotal.reduce((sum, data) => {
      return sum + data.infantCount
    }, 0);

    const studentTotalCount = studentTotal.reduce((sum, data) => {
      return sum + data.studentCount
    }, 0);

    const seniorTotalCount = seniorTotal.reduce((sum, data) => {
      return sum + data.seniorCount
    }, 0);

    const militaryTotalCount = militaryTotal.reduce((sum, data) => {
      return sum + data.militaryCount
    }, 0);

    const otherTotalCount = otherTotal.reduce((sum, data) => {
      return sum + data.otherCount
    }, 0);

    console.log(childTotalCount,"rdytfuygiuhoij")

    const adultCount = result.map(obj => {
        const roomId = Object.keys(obj)[0];
        const total = obj[roomId].reduce((sum, pax) => {
            if (pax.PaxType === "Adult") {
                const count = Object.values(pax).find(val => typeof val === "number") || 0;
                return sum + count;
            }
            return sum;
        }, 0);
    
        return {
            id: Number(roomId),
            adultCount: total
        };
    });

    const adultTotalCount = adultCount.reduce((sum, data) => {
      return sum + data.adultCount
    }, 0)

    console.log(adultTotalCount,"rtdyfugyihoijpok");

      if (type === 'child' && childTotalCount * 1 === this.tourVisiterFrom.value.child) {
        this.disableChildSelect = true;
      }
      this.validateRoomSelections();

const keys = [
  "travelers",
  "childCount",
  "infantCount",
  "studentCount",
  "seniorCount",
  "militaryCount",
  "otherCount"
];
this.selectedRooms.filter(item =>
  keys.some(key => item[key] > 0)
);
      console.log(this.selectedRooms, "The FInal Selected Rooms =============================")
    }
    else {

      this.selectedCrsBeds[optionId] = {
        accommodation: option,
        travelers: selectedTravelers.target.value
      };

      const totalTravelers = Object.values(this.selectedCrsBeds).reduce((acc, data) => {
        return acc + Number(data.travelers);
      }, 0);

      const formData = this.tourVisiterFrom.value;
      const paxCount = formData.child + formData.adult;
      this.mandatoryAddonPax = paxCount;
      if (totalTravelers === paxCount) {
        this.disableSelect = true;
      }
      this.numberOfTravelers = paxCount - totalTravelers;
      this.selectedRooms = Object.values(this.selectedCrsBeds).map(data => ({
        ...data.accommodation,
        travelers: Number(data.travelers)
      }));
      this.totalPrice = this.selectedRooms.reduce((total, room) => {
        const adultCount = room.travelers || 0;
        const childCount = room.childCount || 0;

        let adultPrice = 0;
        let childPrice = 0;

        if (Array.isArray(room.price_tiers)) {
          for (const tier of room.price_tiers) {
            if (tier.pax_type === 'Adult') adultPrice = Number(tier.promotion_price);
            if (tier.pax_type === 'Child') childPrice = Number(tier.promotion_price);
          }
        }

        return total + (adultCount * adultPrice) + (childCount * childPrice);
      }, 0);

      this.getIdTraveler = Object.values(this.selectedCrsBeds).reduce((acc: any, data: any) => {
        acc[data.accommodation.id] = data.travelers;
        return acc;
      }, {} as Record<string, string>);

      const allocatedPax = Object.values(this.selectedCrsBeds).reduce((acc, data) => {
        return acc + Number(data.travelers);
      }, 0);
      this.paxCount = paxCount - allocatedPax;
      if (selectedTravelers.target.value > paxCount) {
        this.showPriceBreakDown = false;
      } else {
        this.showPriceBreakDown = true;
      }
    }
  }

  validateRoomSelections(): void {
  let hasErrors = false;
 this.roomValidationErrors = {};
  Object.keys(this.selectedBeds).forEach(optionId => {
    const selected = this.selectedBeds[optionId];
    const accommodation = this.roomDetailsOptions.find(opt => opt.id == +optionId);

    this.roomValidationErrors[optionId] = '';

    if (!accommodation) return;

    const bedCount = accommodation.beds_number;
    const adult = selected.adult || 0;
    const child = selected.child || 0;
    const infant = selected.infant || 0;
    const student = selected.student || 0;
    const senior = selected.senior || 0;
    const military = selected.military || 0;
    const other = selected.other || 0;
    const total = adult + child + infant + student + senior + military + other;

    if ((adult > 0 || child > 0 || infant > 0 || student > 0 || senior > 0 || military > 0 || other > 0) && total % bedCount !== 0) {
      const remainder = bedCount - (total % bedCount);
      this.roomValidationErrors[optionId] =
        `This accommodation requires groups of ${bedCount} travelers. Please add ${remainder} more traveler(s) or choose another type.`;
      hasErrors = true;
    }
    // if (this.tourVisiterFrom.value.adult === selected.adult) {
    //   this.disableAdultSelection = true;
    // } else {
    //   this.disableAdultSelection = false;
    // }
  });

  

  this.showSelectionError = hasErrors;
  // this.showBookNow = !hasErrors;
}


  getTotalPrice() {
    const selectedRoom = this.selectedRooms;
    setTimeout(() => {
      return selectedRoom.reduce((total, room) => {
        const adultCount = room.travelers || 0;
        const childCount = room.childCount || 0;

        let adultPrice = 0;
        let childPrice = 0;

        if (Array.isArray(room.price_tiers)) {
          for (const tier of room.price_tiers) {
            if (tier.pax_type === 'Adult') adultPrice = Number(tier.price);
            if (tier.pax_type === 'Child') childPrice = Number(tier.price);
          }
        }

        return total + (adultCount * adultPrice) + (childCount * childPrice);
      }, 0);
    }, 2500)
  }


  getAdultCount(data: any): number {
    return data.travelers;
  }

  getAdultPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Adult');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getChildUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Child');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getInfantUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Infant');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getStudentUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Student');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getSeniorUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Senior');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getMilitaryUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Military');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getOtherUnitPrice(data: any): number {
    if (data) {
      const tier = data.price_tiers.find(t => t.pax_type === 'Other');
      let price = 0;
      if (tier) {
        price = tier.promotion_id ? (tier.promotion_price || 0) : (tier.promotion_price || 0);
      }
      return price;
    }
  }

  getChildPrice(data: any): number {
    const price = this.getChildUnitPrice(data);
    return data.childCount ? price * data.childCount : 0;
  }

  getInfantPrice(data: any): number {
    const price = this.getInfantUnitPrice(data);
    return data.infantCount ? price * data.infantCount : 0;
  }

  getStudentPrice(data: any): number {
    const price = this.getStudentUnitPrice(data);
    return data.studentCount ? price * data.studentCount : 0;
  }

  getSeniorPrice(data: any): number {
    const price = this.getSeniorUnitPrice(data);
    return data.seniorCount ? price * data.seniorCount : 0;
  }

  getMilitaryPrice(data: any): number {
    const price = this.getMilitaryUnitPrice(data);
    return data.militaryCount ? price * data.militaryCount : 0;
  }

  getOtherPrice(data: any): number {
    const price = this.getOtherUnitPrice(data);
    return data.otherCount ? price * data.otherCount : 0;
  }


  getPrice(data: any): number {
    const adultPrice = this.getAdultPrice(data);
    const adultCount = this.getAdultCount(data);
    return (adultCount * adultPrice);
  }


  bookTour() {
    const filterEmptyId = this.getIdTraveler.filter(obj => {
      const key = Object.keys(obj)[0];
      return obj[key].length > 0;
  });
    const formData = this.tourVisiterFrom.value;
    this.tourServe.loading.next(true);
    const payLoad = {
      ResultToken: this.tourDetails.ResultIndex,
      BookingSource: this.tourDetails.BookingSource,
      DepartureId: this.departureId,
      AdultCount: formData.adult ? formData.adult : 0,
      ChildCount: formData.child ? formData.child : 0,
      InfantCount: formData.infant ? formData.infant : 0,
      StudentCount: formData.student ? formData.student : 0,
      SeniorCount: formData.senior ? formData.senior : 0,
      MilitaryCount: formData.military ? formData.military : 0,
      OthersCount: formData.other ? formData.other : 0,
      AccommadationId: filterEmptyId,
      UserType: "B2B",
      UserId: this.getUserData['id'],
      Currency: this.getUserData['currency'],
      optional_extras: this.mandatoryAddonObj ? this.mandatoryAddonObj : []
    }

    this.apiHandlerService.apiHandler('tourEvaluation', 'POST', '', '', payLoad).subscribe(async res => {
      if (res.data.length > 0 || res.data) {
        const mandatory_addons = res.data.mandatory_addons.forEach((data) => {
          data.prices.forEach((response) => {

          })
        })
        // const paxData = this.roomDetailsOptions.reduce((acc, item) => {
        //   item.price_tiers.forEach(tier => {
        //     acc.push({
        //       name: item.name,
        //       value: tier.promotion_price,
        //       type: tier.pax_type,
        //       paxCountAdult: formData.adult ? formData.adult : 0,
        //       paxCountChild: formData.child ? formData.child : 0
        //     });
        //   });
        //   return acc;
        // }, []);
        // const result = [];
        // this.mandatoryAddon.reduce((acc, item) => {
        //   item.price_tiers.forEach(tier => {
        //     acc.push({
        //       name: item.name,
        //       value: tier.value,
        //       payment_type: item.payment_type,
        //       travellercount: this.mandatoryAddonPax
        //     });
        //   });
        //   this.resultPriceBreak.push(acc,...this.optionalData)
        //   return acc;
        // }, []);

        res.data.mandatory_addons.forEach((room) => {
        room.prices.forEach(tier => {
          const base = {
            name: room.name,
            payment_type: room.payment_type,
            value: tier.price,
            type: "traveler",
            travellercount: tier.quantity
          };
          room.payment_type !== 'local' ? this.resultPriceBreak.push(base) : '';
        });
      })

        const paxMap = {};

        this.getIdTraveler.forEach(entry => {
          const [roomId, paxList]: any = Object.entries(entry)[0];
          paxMap[roomId] = {};
          paxList.forEach(p => {
            const id = Object.keys(p).find(k => k !== "PaxType");
            paxMap[roomId][p.PaxType] = (paxMap[roomId][p.PaxType] || 0) + p[id];
          });
        });

       res.data.accommodations.forEach((room) => {
  const paxCounts = paxMap[room.id] || {};

  room.prices.forEach(tier => {
    const base = {
      name: room.name,
      payment_type: room.payment_type,
      value: tier.price,
      type: tier.pax_type,
      travellercount: paxCounts[tier.pax_type] || 0
    };
    this.resultPriceBreak.push(base);
  });
});
        this.tourServe.loading.next(false);
        this.tourServe.bookingTourData.next(res.data);
        sessionStorage.setItem('tourBookingInfo', JSON.stringify(res.data));
        this.tourServe.tourPriceBreakDown.next(this.resultPriceBreak);
        sessionStorage.setItem('tourPriceBreakDown', JSON.stringify(this.resultPriceBreak));
        this.router.navigate(['/search/tour/tour-final-booking'], {
          state: {
            adult: formData.adult,
            child: formData.child,
            infant: formData.infant,
            student: formData.student,
            senior: formData.senior,
            military: formData.military,
            other: formData.other,
            departureDate: formData.departureDate,
            childAges: formData.travellers
          }
        });
      } else {
        console.log("test")
        this.tourServe.loading.next(false);
        this.swalService.alert.oops(res.Message)
      }
      this.tourServe.loading.next(false);
      this.cdr.detectChanges();
    },
      (err) => {
        this.swalService.alert.oops(err.error.Message)
        this.tourServe.loading.next(false);
        this.cdr.detectChanges();
      });

  }

  // isOptionDisabledStrict(bedNumber: number, option: any): boolean {
  //   // if (!option.is_shared) {
  //   //   // Private room: allow ONLY when beds match paxCount
  //   //   return option.beds_number !== this.paxCount || bedNumber !== this.paxCount;
  //   // } else {
  //   //   // Shared room: allow options up to paxCount
  //   //   return bedNumber > this.paxCount;
  //   // }
  //   const hasSelected = this.selectedBeds[option.id];

  //   if (!option.is_shared) {
  //     // Private room
  //     if (this.paxCount > option.beds_number) {
  //       return false; // Allow
  //     } else if (this.paxCount < option.beds_number) {
  //       return true; // Restrict
  //     } else {
  //       return bedNumber !== this.paxCount; // Allow only exact match
  //     }
  //   } else {
  //     // Shared room
  //     if (hasSelected) {
  //       return false; // Allow re-selection
  //     }
  //     return bedNumber > this.paxCount;
  //   }
    
  // }

getTotalSelected(type: 'adult' | 'child'): number {
  let total = 0;
  Object.values(this.selectedBeds).forEach(sel => {
    total += sel[type] || 0;
  });
  return total;
}

  isOptionDisabledStrict(adultCount: number, option: any): boolean {
const bedCount = option.beds_number;
  const selected = this.selectedBeds[option.id];

  // ✅ Allow all selections initially
  if (!selected || (selected.child === undefined && selected.adult === undefined)) {
    return false;
  }

  const currentChildCount = selected.child || 0;
  const total = adultCount + currentChildCount;

  return total % bedCount !== 0;
}

isChildOptionDisabledStrict(childCount: number, option: any): boolean {
 const bedCount = option.beds_number;
  const selected = this.selectedBeds[option.id];

  // ✅ Allow all selections initially
  if (!selected || (selected.adult === undefined && selected.child === undefined)) {
    return false;
  }

  const currentAdultCount = selected.adult || 0;
  const total = childCount + currentAdultCount;

  return total % bedCount !== 0;
}

  getPriceBreak() {
    const price = this.priceBreakDown.price_tiers[0].promotion_price * this.paxCount;
    return price;
  }

  getTourDates() {
    if (this.accommadationDetails) {
      const startDate = this.accommadationDetails.date;
      const daysAvailable = parseInt(this.tourDetails.duration, 10);
      const toDate = moment(startDate).add(daysAvailable-1, 'days').format("YYYY-MM-DD");
      return toDate;
    }
  }

  getTravelerName(titles) {
    const hasAdult = titles.some(t => t.title === 'Adult');
    const hasChild = titles.some(t => t.title === 'Child');
  
    if (hasAdult && hasChild) {
      return ['Adult', 'Child'];
    } else if (hasAdult) {
      return ['Traveler'];
    } else if (hasChild) {
      return ['Child'];
    } else {
      return [];
    }
  }

  onOptionalExtraSelection(id: string, value: number, optional: any) {
    const numericValue = Number(value);
    this.optionalAddOnCount = value;
    this.optionalAddOnCount = value;
    const addonName = optional.name || '';
    const addonPrice = optional.price_tiers[0].price || 0;
    
    if (!Array.isArray(this.optionalData)) {
      this.optionalData = [];
    }
  
    const existingIndex = this.optionalData.findIndex(
      (item) => item.name === addonName
    );
  
    if (existingIndex !== -1) {
      this.optionalData[existingIndex].travellercount = numericValue;
    } else {
      this.optionalData.push({
        name: addonName,
        price: addonPrice,
        travellercount: numericValue
      });
      this.resultPriceBreak.push({
        name: addonName,
        value: addonPrice,
        travellercount: numericValue
      })
    }

    this.optionalAddonPrice = this.optionalData.reduce((sum, item) => {
      return sum + (item.price * item.travellercount);
    }, 0);

    this.finalSelections[id] = Array.from({ length: numericValue }, (_, i) => i + 1);
    const result = [this.finalSelections];
    this.mandatoryAddonObj = result;
  }

  paymentType (type) {
    this.localPaymentType = type;
  }

   setSelectedDate(event: any, index: number) {
      const travellersArray = this.tourVisiterFrom.get('travellers') as FormArray;
      if (event) {
        // const start = new Date(event); // child DOB
        // const end = new Date();               // selected date

        // let years = end.getFullYear() - start.getFullYear();
        // let months = end.getMonth() - start.getMonth();
        // const days = end.getDate() - start.getDate();

        // if (days < 0) { months--; }
        // if (months < 0) { years--; months += 12; }
        this.selectedChildAge = event.target.value;
        console.log(`Age: ${this.selectedChildAge}`);
        (travellersArray.at(index) as FormGroup).patchValue({
        childAge: (event.target.value),
        ages: Math.ceil(this.selectedChildAge)
      });
      }
      
      
    }

      getCancPolicies(data) {
    if(data) {
      return JSON.parse(data);
    }
  }
  getActivities(data) {
    if(data) {
      return data.split(',')
    }
  }
  getCancellationDate(policy, time) {
    if (this.selectedDateofDeparture) {
      const date = new Date(this.selectedDateofDeparture);
      date.setDate(date.getDate() - policy);
      const cancellationDate = moment(new Date(date)).format('DD-MM-YYYY');
      return `${cancellationDate} ${time}`; ;
    } else {
      return policy;
    }

    
  }

   getTitle(type) {
    if (type) {
      return type.toString().toLowerCase();
    }
  }

findOthersPrice(data) {
  if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'other');
}
findMilitaryPirce(data) {
   if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'military');
}

findSeniorPirce(data) {
   if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'senior');
}

findStudentPirce(data) {
   if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'student');
}

findInfantPirce(data) {
   if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'infant');
}

findChildPrice(data) {
  if (!data || !Array.isArray(data)) {
    return false;
  }

  return data.some(item => item.pax_type.toLowerCase() === 'child');
}

getPromotionId(data, type) {
  if (!data) return null;

  const match = data.find(item => item.pax_type.toLowerCase() === type.toLowerCase());
  return match ? match.promotion_id : null;
}

getValuePromotion(data, type) {
  if (!data) return null;

  const match = data.find(item => item.pax_type.toLowerCase() === type.toLowerCase());
  return match ? match.value_promotion : null;
}

getPriceValue(data, type) {
  if (!data) return null;

  const match = data.find(item => item.pax_type.toLowerCase() === type.toLowerCase());
  return match ? match.price : null;
}

getPromotionPrice(data, type) {
  if (!data) return null;

  const match = data.find(item => item.pax_type.toLowerCase() === type.toLowerCase());
  return match ? match.promotion_price : null;
}

getCancellationPercent(data) {
  if(data) {
    return `will be Chargable ${data} %`
  }
}
}

