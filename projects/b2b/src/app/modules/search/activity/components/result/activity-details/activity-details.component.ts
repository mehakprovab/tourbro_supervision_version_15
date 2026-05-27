import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivitiesService } from '../../../activities.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivitiesLoaderComponent } from '../../activity-loader/activities-loader.component';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
// import { ActivitiesLoaderComponent } from '../../activity-loader/activities-loader.component';
// import { ApiHandlerService } from 'projects/b2c/src/app/core/api-handlers';
// import { UtilityService } from 'projects/b2c/src/app/core/services/utility.service';
// import { SwalService } from 'projects/b2c/src/app/core/services/swal.service';
@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {

  selectedIndex: any;
  minDate = new Date();
  isOpen = false as boolean;
  fadeinn = false;
  activityFadeinn = false;
  datesEnabled = []
  totalTraveller: number = 1;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false,
    datesEnabled: this.datesEnabled
  };
  showMore:Boolean=false;
  showMoreServices: Boolean = false;
  showMoreMeetingPoint: Boolean = false;
  showMoreReviews: Boolean=false;
  isAdultLeadPax:boolean=false;
  activity: any;
  calendarData: any; // Store your JSON data here
  selectedDate: string = '';
  adultCount: number = 1;
  childCount: number = 0;
  infantCount: number = 0;
  seniorCount: number = 0;
  youthCount: number = 0;
  travellerConfig: FormGroup;
  activityList: any = [];
  loading: boolean = false;
  noActivity: Boolean = false;
  currentUserId: string = "";
  showLoader: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  desableAvailability:boolean=false;
  productList: any=[];
  currentPage: number = 1;
  reviewPerPage: number = 5;
  uniqueActivityList: any[];
  rateLanguage: any;
  maxLength = 200;
  showFullRemarks: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private activityService: ActivitiesService,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private swalService:SwalService,
    private cd: ChangeDetectorRef,
    public datepipe: DatePipe,
    private dialog: MatDialog,) { }


    uniqueGradeTitles: any[] = [];
    selectedGradeTitle: string = '';
    selectedPrice: number = 0;
  ngOnInit(): void {
    this.currentUserId = this.utility.readStorage('b2cUser', sessionStorage)['id'];
    this.activityService.loading.subscribe(res => {
      this.showLoader = res;
    });
    this.setActivityData();
    this.setTraveller();
    //this.createTravellerForm();
    this.activityService.bookingActivityData.subscribe(res => {
      this.activity = res;
      this.rateLanguage = res.rate_langauges;
      this.selectedDate = this.activity.Product_available_date[0];
     // this.setCallenderDates();
      // this.setLeadPax();
      //this.getTripList()
    })
    // this.activityService.formFilled.next(JSON.parse(sessionStorage.getItem('activityFormData')));
    this.getTripList();
  }

  // onLanguageChange(activityTrip: any): void {
  //   // Hide the fare
  //   activityTrip.isFareVisible = false;
  
  //   console.log(`Language changed for trip:`, activityTrip.selectedLanguage);
  
  //   // After 1 second, show the fare again
  //   setTimeout(() => {
  //     activityTrip.isFareVisible = true;
  //   }, 1000);
  // }
  
  onTripLanguageChange(trip: any, selectedLang: any): void {
    // Find the selected language object for the specific trip
    const selectedLanguage = trip.language.find(
      (lang) => lang.langCode === selectedLang.langCode
    );
    if (selectedLanguage) {
      // Update the selectedPrice for the specific trip
      trip.selectedPrice = selectedLanguage.Price;
      trip.selectedCancellation = selectedLanguage.from[0];
    }
  }

  setCallenderDates() {
    if (this.activity && this.activity.Product_available_date) {
      const dates = this.activity.Product_available_date;
      Object.keys(dates).forEach((year) => {
        dates[year].forEach((date) => {
          this.datesEnabled.push(new Date(`${year}-${date}`));
          this.travellerConfig.patchValue
            ({
              date: this.datesEnabled[0]
            })
        });
      });
    }
  }
  setTraveller(){
    this.activityService.setHotelTraveller()
    }
  // setLeadPax() {
  //   if (this.activity && this.activity.Product_AgeBands) {
  //     console.log("his.activity.Product_AgeBands",this.activity.Product_AgeBands)
  //     let adultPax = this.activity.Product_AgeBands.filter(element => element.description == 'Adult');
  //     let seniorPax = this.activity.Product_AgeBands.filter(element => element.description == 'Senior');
  //     if(adultPax && adultPax.length==0 && seniorPax && seniorPax.length==0)
  //     {
  //       this.desableAvailability=true;
  //       return;
  //     }
  //     this.desableAvailability=false;
  //     if ((adultPax && adultPax.length>0) || (adultPax && adultPax.length>0 && seniorPax && seniorPax.length>0)) {
  //       this.travellerConfig.patchValue({
  //         adult: 1
  //       });
  //       this.isAdultLeadPax=true;
  //       this.onUpdateTraveller('Adult', 'plus');
  //     }
  //     if ((adultPax && adultPax.length==0) && (seniorPax && seniorPax.length>0)) {
  //       this.travellerConfig.patchValue({
  //         senior: 1
  //       });
  //       this.isAdultLeadPax=false;
  //       this.onUpdateTraveller('Senior', 'plus');
  //     }
  //   }
  // }

  onSubmitTraveller() {
    this.activityFadeinn = false;
  }

  closeTravellers() {
    this.activityFadeinn = false;
  }

  setActivityData() {
    const storedState = localStorage.getItem('bookingActivityData');
    if (storedState) {
      this.activityService.bookingActivityData.next(JSON.parse(storedState));
    }
  }

  // onUpdateTraveller(travellerType: string, operation: string) {
  //   let countToUpdate = 0;
  //   switch (travellerType) {
  //     case 'Adult':
  //       countToUpdate = this.adultCount;
  //       if(operation === 'minus' && (this.adultCount==0 || (this.adultCount==1 && this.isAdultLeadPax)))
  //       return;
  //       break;
  //     case 'Senior':
  //       countToUpdate = this.seniorCount;
  //       if(operation === 'minus' && (this.seniorCount==0 || (this.seniorCount==1 && !this.isAdultLeadPax)))
  //       return;
  //       break;
  //     case 'Youth':
  //       countToUpdate = this.youthCount;
  //       if(operation === 'minus' && this.youthCount==0)
  //       return;
  //       break;
  //     case 'Child':
  //       countToUpdate = this.childCount;
  //       if(operation === 'minus' && this.childCount==0)
  //       return;
  //       break;
  //     case 'Infant':
  //       countToUpdate = this.infantCount;
  //       if(operation === 'minus' && this.infantCount==0)
  //       return;
  //       break;
  //     default:
  //       break;
  //   }

  //   if (operation === 'plus' && this.activity.MaxTravellerCount > this.totalTraveller) {
  //     countToUpdate += 1;
  //     this.totalTraveller += 1;
  //   } else if (operation === 'minus') {
  //     countToUpdate -= 1;
  //     this.totalTraveller -= 1;
  //   }

  //   switch (travellerType) {
  //     case 'Adult':
  //       this.adultCount = countToUpdate;
  //       break;
  //     case 'Senior':
  //       this.seniorCount = countToUpdate;
  //       break;
  //     case 'Youth':
  //       this.youthCount = countToUpdate;
  //       break;
  //     case 'Child':
  //       this.childCount = countToUpdate;
  //       break;
  //     case 'Infant':
  //       this.infantCount = countToUpdate;
  //       break;
  //     default:
  //       break;
  //   }

  //   this.travellerConfig.patchValue({
  //     adult: this.adultCount,
  //     child: this.childCount,
  //     infant: this.infantCount,
  //     senior: this.seniorCount,
  //     youth: this.youthCount
  //   });
  // }

  // createTravellerForm() {
  //   this.travellerConfig = this.fb.group({
  //     date: new FormControl(Validators.required),
  //     adult: new FormControl(1, [Validators.required]),
  //     senior: new FormControl(1, [Validators.required]),
  //     child: new FormControl(0, [Validators.required]),
  //     youth: new FormControl(0, [Validators.required]),
  //     infant: new FormControl(0, [Validators.required]),

  //   })
  // }

  blocktrip(activityTrip) {
    this.activityService.loading.next(true);
    let selectedResultToken;
    if (this.activity.BookingSource === 'ZBAPINO00003') {
      const selectedLanguage = activityTrip.language.find(
      (lang) => lang.langCode === activityTrip.selectedLanguage
    );
    selectedResultToken = selectedLanguage.ResultIndex;
    } 

    if (this.activity.BookingSource === 'ZBAPINO00004') {
      selectedResultToken = activityTrip.ResultIndex
    }
    
    const dateParts = activityTrip.selectedDate.split('-'); // Split into [day, month, year]
    const dateObj = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); // Create Date object (month is 0-based)
    const formattedDate = this.datepipe.transform(dateObj, 'yyyy-MM-dd');
    const reqBody = {
      "ResultToken": selectedResultToken,
      "booking_source": this.activity.BookingSource,
      "from":formattedDate
    }
    this.apiHandlerService.apiHandler('activityBlockTrip', 'POST', '', '', reqBody
    ).subscribe(res => {
      if (res.data.length > 0 || res.data) {
        this.activityService.blockedActivityData.next(res.data);
        // sessionStorage.setItem('activeId','');
        // this.activityService.activityTraveller.next(this.travellerConfig.value);
        //localStorage.setItem('activityTraveller', JSON.stringify(this.activityService.activityTraveller.getValue()));
        localStorage.setItem('blockedActivityData', JSON.stringify(this.activityService.blockedActivityData.getValue()));
        this.activityService.loading.next(false);
        this.router.navigate(['search/activity/activity-booking']);
      } else {
        this.activityService.loading.next(false);
      }
      this.cd.detectChanges();
    },
      (err) => {
        this.activityService.loading.next(false);
        this.cd.detectChanges();
      });
  }

  getTripList() {
    const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    
   // console.log("activity tt",activity)
    this.loading = true;
    this.activityList = [];
    this.noActivity = false;
    const reqBody = {
      "ResultToken": this.activity.ResultToken,
      "booking_source": this.activity.BookingSource,
      "UserId" : created_by_id,
      "UserType": "B2B"
    }
    this.apiHandlerService.apiHandler('activityTripList', 'POST', '', '', reqBody
    ).subscribe(res => {
      if (res.data.length > 0 || res.data) {
        this.activityList = res.data[0].ActivityListNew;
       
       

        this.uniqueActivityList = (this.activityList);
        if (this.uniqueActivityList.length > 0 && this.activity.BookingSource !== 'ZBAPINO00004') {
          this.uniqueActivityList.forEach((activityTrip: any) => {
            activityTrip.selectedLanguage = activityTrip.language.length > 0 ? activityTrip.language[0].langCode : null;
            const defaultLanguage = activityTrip.language.find(
              (lang) => lang.langCode === activityTrip.selectedLanguage
            );
            if (defaultLanguage) {
              activityTrip.selectedPrice = defaultLanguage.Price;
              activityTrip.selectedCancellation = defaultLanguage.from[0];
            }
            // activityTrip.isFareVisible = true;
          });
        }    
   
        this.sortApiResponse();
        this.setDefaultDate();
        this.productList=res.data[0].ProductDetails;
        this.loading = false;
        this.noActivity = false;
        this.cd.detectChanges();
      } else {
        this.activityList = [];
        this.noActivity = true;
        this.loading = false;
        this.swalService.alert.oops("Unable To Get Result");
      }
      this.cd.detectChanges();
    },
      (err) => {
        this.noActivity = true;
        this.activityList = [];
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
        this.cd.detectChanges();
      });
  }

  setValue(value,index,activity)
  {
    this.selectedIndex=index;
    activity.selectedDate = value;

  }
  

  getUniqueActivities(list: any[]): any[] {
    const seenTitles = new Set();
    return list.filter((item) => {
      if (seenTitles.has(item.PackageUniqueId)) {
        return false;
      }
      seenTitles.add(item.PackageUniqueId);
      return true;
    });
  }

  scrollToDate() {
    const datestabElement = this.elementRef.nativeElement.querySelector('#pckg_optn');
    if (datestabElement) {
      datestabElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  showMoreReview(){
    this.currentPage++;
  }
  getStarArray(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = Math.round(num);
    return starArr;
  }

  setDefaultDate(){
    for(let value of this.uniqueActivityList)
    {
     value.selectedDate=this.activity.Product_available_date[0];
    }
   }
 
   sortApiResponse(){
   this.uniqueActivityList.sort((a, b) => {
     if (a != null && b != null) { 
     return a.Price.TotalDisplayFare - b.Price.TotalDisplayFare;
     }
 });
   }

  getStarArrayRemaining(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = 5 - Math.round(num);
    return starArr;
  }
  searchResult(data: any) {
    // this.activityService.formFilled.subscribe(d => {
    //   if (!this.utility.isEmpty(d)) {
    //     const params = d;
    //     if (params) {
    //       let config = new MatDialogConfig();
    //       config.height = '600px';
    //       config.width = '1000px';
    //       config.panelClass = "copy-items-modal";
    //       config.data = {
    //         data: this.activityService.formFilled.value
    //       }
    //       let copyDialog = this.dialog.open(ActivitiesLoaderComponent, config);
    //     }
    //   }
    // })
    this.router.navigate["/search/activity/activity-results"];
    // this.activityService.searchResult(data);
  }
  // gotobooking() {
  //   this.router.navigate(['/activity-booking']);
  // }

  toggleRemarks() {
    this.showFullRemarks = !this.showFullRemarks;
  }
  
  getShortText(text: string, showFull: boolean): string {
    if (!text) return '';
    return showFull || text.length <= this.maxLength
      ? text
      : text.substring(0, this.maxLength) + '...';
  }
  
  isTextTruncated(text: string): boolean {
    return text && text.length > this.maxLength;
  }

  getJSONParseData(data) {
    if(data) {
      return JSON.parse(data);
    }
  }
}
