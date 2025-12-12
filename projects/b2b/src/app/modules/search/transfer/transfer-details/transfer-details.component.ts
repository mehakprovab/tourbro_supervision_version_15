import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransferService } from '../transfer.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TransferLoaderComponent } from '../transfer-result/components/transfer-loader/transfer-loader.component';
import { environment } from "projects/b2b/src/environments/environment.prod";
const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.scss']
})
export class TransferDetailsComponent implements OnInit {

  minDate = new Date();
  isOpen = false as boolean;
  fadeinn = false;
  travellersFadeinn = false;
  datesEnabled = []
  totalTraveller: number = 0;
  transfers: any;
  calendarData: any; // Store your JSON data here
  selectedDate: string = '';
  adultCount: number = 0;
  childCount: number = 0;
  infantCount: number = 0;
  seniorCount:number=0;
  youthCount:number=0;
  travellerConfig: FormGroup;
  transferList: any = [];
  loading: boolean = false;
  noTransfer: Boolean = false;
  currentUserId: string = "";
  showLoader: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  showMore:Boolean=false;
  isAdultLeadPax:boolean=false;
  desableAvailability:boolean=false;
  productList:any=[];
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false,
    datesEnabled: this.datesEnabled
  };
  
  constructor(private router: Router,
    private elementRef: ElementRef,
    private transferService: TransferService,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private swalService:SwalService) { }

  ngOnInit(): void {
    this.currentUserId = this.utility.readStorage('currentUser', sessionStorage)['id'];
    this.transferService.loading.subscribe(res => {
      this.showLoader = res;
    });
    this.setTransferData();
    this.createTravellerForm();
    this.transferService.bookingTransferData.subscribe(res => {
      this.transfers = res;
      this.setCallenderDates();
      this.setLeadPax();
    })
    // this.transferService.formFilled.next(JSON.parse(sessionStorage.getItem('transferFormData')));
  }

  setCallenderDates() {
    if (this.transfers && this.transfers.Product_available_date) {
      const dates = this.transfers.Product_available_date;
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

  setLeadPax() {
    if (this.transfers && this.transfers.Product_AgeBands) {
      let adultPax = this.transfers.Product_AgeBands.filter(element => element.description == 'Adult');
      let seniorPax = this.transfers.Product_AgeBands.filter(element => element.description == 'Senior');
      if(adultPax && adultPax.length==0 && seniorPax && seniorPax.length==0)
      {
        this.desableAvailability=true;
        return;
      }
      this.desableAvailability=false;
      if ((adultPax && adultPax.length>0) || (adultPax && adultPax.length>0 && seniorPax && seniorPax.length>0)) {
        this.travellerConfig.patchValue({
          adult: 1
        });
        this.isAdultLeadPax=true;
        this.onUpdateTraveller('Adult', 'plus');
      }
      if ((adultPax && adultPax.length==0) && (seniorPax && seniorPax.length>0)) {
        this.travellerConfig.patchValue({
          senior: 1
        });
        this.isAdultLeadPax=false;
        this.onUpdateTraveller('Senior', 'plus');
      }
    }
  }

  onSubmitTraveller() {
    this.travellersFadeinn = false;
  }

  closeTravellers() {
    this.travellersFadeinn = false;
  }

  setTransferData() {
    const storedState = localStorage.getItem('bookingTransferData');
    if (storedState) {
      this.transferService.bookingTransferData.next(JSON.parse(storedState));
    }
  }

  searchResult(data: any) {
    // this.transferService.formFilled.subscribe(d => {
    //   if (!this.utility.isEmpty(d)) {
    //     const params = d;
    //     if (params) {
    //       const config = new MatDialogConfig();
    //       config.height = '600px';
    //       config.width = '1000px';
    //       config.disableClose = true;
    //       config.panelClass = "copy-items-modal";
    //       config.data = {
    //         data: this.transferService.formFilled,
    //       };
    //       this.dialog.open(TransferLoaderComponent, config);
    //     }
    //   }
    // });
  
    // Clear or replace query parameters as needed
    this.router.navigate(['/search/transfer/transfers-result']);
  }
  

  onUpdateTraveller(travellerType: string, operation: string) {
    let countToUpdate = 0;
    switch (travellerType) {
      case 'Adult':
        countToUpdate = this.adultCount;
        if(operation === 'minus' && (this.adultCount==0 || (this.adultCount==1 && this.isAdultLeadPax)))
        return;
        break;
      case 'Senior':
        countToUpdate = this.seniorCount;
        if(operation === 'minus' && (this.seniorCount==0 || (this.seniorCount==1 && !this.isAdultLeadPax)))
        return;
        break;
      case 'Youth':
        countToUpdate = this.youthCount;
        if(operation === 'minus' && this.youthCount==0)
        return;
        break;
      case 'Child':
        countToUpdate = this.childCount;
        if(operation === 'minus' && this.childCount==0)
        return;
        break;
      case 'Infant':
        countToUpdate = this.infantCount;
        if(operation === 'minus' && this.infantCount==0)
        return;
        break;
      default:
        break;
    }

    if (operation === 'plus' && this.transfers.MaxTravellerCount > this.totalTraveller) {
      countToUpdate += 1;
      this.totalTraveller += 1;
    } else if (operation === 'minus') {
      countToUpdate -= 1;
      this.totalTraveller -= 1;
    }

    switch (travellerType) {
      case 'Adult':
        this.adultCount = countToUpdate;
        break;
      case 'Senior':
        this.seniorCount = countToUpdate;
        break;
      case 'Youth':
        this.youthCount = countToUpdate;
        break;
      case 'Child':
        this.childCount = countToUpdate;
        break;
      case 'Infant':
        this.infantCount = countToUpdate;
        break;
      default:
        break;
    }

    this.travellerConfig.patchValue({
      adult: this.adultCount,
      child: this.childCount,
      infant: this.infantCount,
      senior:this.seniorCount,
      youth:this.youthCount
    });
  }

  createTravellerForm() {
    this.travellerConfig = this.fb.group({
      date: new FormControl(Validators.required),
      adult: new FormControl(0, [Validators.required]),
      senior: new FormControl(0, [Validators.required]),
      child: new FormControl(0, [Validators.required]),
      youth: new FormControl(0, [Validators.required]),
      infant: new FormControl(0, [Validators.required])
    })
  }

  blocktrip(transfer) {
    this.transferService.loading.next(true);
    const reqBody = {
      "ResultToken": transfer.ResultToken,
      "UserType": "B2B",
      "UserId": this.currentUserId,
      "BookingSource": this.transfers.BookingSource
    }
    this.apiHandlerService.apiHandler('blocktrip', 'POST', '', '', reqBody
    ).subscribe(res => {
      if (res.data.length > 0 || res.data) {
        this.transferService.blockedTransferData.next(res.data);
        this.transferService.transferTraveller.next(this.travellerConfig.value);
        localStorage.setItem('transferTraveller', JSON.stringify(this.transferService.transferTraveller.getValue()));
        localStorage.setItem('blockedTransferData', JSON.stringify(this.transferService.blockedTransferData.getValue()));
        this.transferService.loading.next(false);
        // sessionStorage.setItem('activeId','');
        this.router.navigate(['search/transfer/transfers-bookings']);
      } else {
        this.transferService.loading.next(false);
        this.swalService.alert.oops("Unable To Block Transfer");
      }
      this.cd.detectChanges();
    },
      (err) => {
        this.transferService.loading.next(false);
        this.swalService.alert.oops(err.error.Message);
        this.cd.detectChanges();
      });
  }

  getTripList(transfer) {
    this.loading = true;
    this.transferList = [];
    this.productList=[];
    this.noTransfer = false;
    const reqBody = {
      "ResultToken": transfer.ResultIndex,
      "BookingDate": this.travellerConfig.get('date').value,
      "AdultCount": this.adultCount,
      "ChildCount": this.childCount,
      "SeniorCount":this.seniorCount,
      "YouthCount":this.youthCount,
      "InfantCount": this.infantCount,
      "UserType": "B2B",
      "UserId": this.currentUserId,
      "BookingSource": transfer.BookingSource
    }
    this.apiHandlerService.apiHandler('tripList', 'POST', '', '', reqBody
    ).subscribe(res => {
      if (res.data.length > 0 || res.data) {
        this.transferList = res.data.TransferList;
        this.productList=res.data.ProductDetails;
        this.loading = false;
        this.noTransfer = false;
      } else {
        this.transferList = [];
        this.productList=[];
        this.noTransfer = true;
        this.loading = false;
        this.swalService.alert.oops("Unable To Get Result");
      }
      this.cd.detectChanges();
    },
      (err) => {
        this.noTransfer = true;
        this.transferList = [];
        this.productList=[];
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
        this.cd.detectChanges();
      });
  }

  scrollToDate() {
    const datestabElement = this.elementRef.nativeElement.querySelector('#prc_rght');
    if (datestabElement) {
      datestabElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getStarArray(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = Math.round(num);
    return starArr;
  }

  getStarArrayRemaining(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = 5 - Math.round(num);
    return starArr;
  }

    getImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }
}
