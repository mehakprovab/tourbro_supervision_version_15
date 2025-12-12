import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Router } from "@angular/router";
import { browserRefresh } from "projects/b2b/src/app/app.component";
import { ApiHandlerService } from "projects/b2b/src/app/core/api-handlers";
import { SwalService } from "projects/b2b/src/app/core/services/swal.service";
import { UtilityService } from "projects/b2b/src/app/core/services/utility.service";
import { TransferService } from "../transfer.service";
import { SubSink } from "subsink";
import { TransferLoaderComponent } from "./components/transfer-loader/transfer-loader.component";
import { environment } from "projects/b2b/src/environments/environment.prod";
const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-transfer-result',
  templateUrl: './transfer-result.component.html',
  styleUrls: ['./transfer-result.component.scss']
})
export class TransferResultComponent implements OnInit {

  throttle;
  protected subs = new SubSink();
  public browserRefresh: boolean;
  loading: boolean;
  searchPayload: any;
  noTransferMessage: any;
  searchingTransfer: boolean = false;
  noTransfer = false;
  transferList: any = [];
  endSlice: number = 20;
  isCollapsed = true;
  isCollapsedArr = [];
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  transferFormData: any;
  travellerAdult: any = 0;
	travellerChild: any = 0;
  travellerInfant: any =0;

  constructor(
    private util: UtilityService,
    private transferService: TransferService,
    private dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) { }


  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.transferService.loading.next(true);
      this.transferService.dialogClose.next(false);
      this.transferService.loading.subscribe(res => {
        this.loading = res;
      });
    }
    this.subs.sink = this.transferService.isCollapsed.subscribe(res => {
      this.isCollapsed = res;
  });
  this.transferService.dialogClose.next(false);
    this.searchPayload = this.prepareSearchPayloadFromSessionData('transferSearchData');
    this.transferService.formFilled.next(JSON.parse(sessionStorage.getItem('transferFormData')));
    this.transferFormData = JSON.parse(sessionStorage.getItem('transferFormData'));
    this.searchResult(this.searchPayload);
    this.searchPayload.paxes.forEach(element => {
			this.travellerAdult += element.adultCount;
			this.travellerChild += element.childCount;
      this.travellerInfant+= element.infantCount;
		});
    this.setResult();
    this.transferService.loading.subscribe(res => {
      this.loading = res;
    });
    this.transferService.dialogClose.subscribe(res => {
      if (res)
      this.dialog.closeAll();
    });
  }

  prepareSearchPayloadFromSessionData(sessionKey: string): any {
    const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
    let paxes =[];
    ssd['paxes'].forEach(element => {
			paxes.push({
				"adultCount": Number(element['adultCount']),
				"childCount": Number(element['childCount']),
        "infantCount":Number(element['infantCount']),
			})
		});

    if (ssd) {
      const reqBody = {
        FromCityId: ssd.FromCityId,
        ToCityId: ssd.ToCityId,
        ArrivalDate: ssd.ArrivalDate,
        ReturnDate: ssd.ReturnDate,
        paxes: ssd.paxes,
        Destination_source: ssd.Destination_source,
        IsReturn: ssd.IsReturn,
        departureCity:ssd.departureCity,
        destinationCity:ssd.destinationCity,
        deapartureCountryCode:ssd.deapartureCountryCode,
        departureLatitude:ssd.departureLatitude,
        departureLongitude:ssd.departureLongitude,
        destinationCountryCode:ssd.destinationCountryCode,
        destinationLatitude:ssd.destinationLatitude,
        destinationLongitude:ssd.destinationLongitude,
        destinationCityId: ssd.destinationCityId,
        departureCityId: ssd.departureCityId
      };
      return reqBody;
    }
    else {
      this.router.navigate(['/']);
    }
  }


  searchResult(data: any) {
    this.transferService.formFilled.subscribe(d => {
      if (!this.util.isEmpty(d)) {
        const params = d;
        if (params) {
          let config = new MatDialogConfig();
          config.height = '600px';
          config.width = '1000px';
          config.disableClose = true;
          config.panelClass = "copy-items-modal";
          config.data = {
            data: this.transferService.formFilled
          }
         let copyDialog = this.dialog.open(TransferLoaderComponent, config);
        }
      }
    })
    this.transferService.searchResult(data);
  }

  setResponse(res) {
    console.log("res",res)
    if (!res.length ) {
       this.transferList = [];
      if (res.Message)
        this.dialog.closeAll();
      this.noTransferMessage = res.Message;
    } else {
      this.transferService.loading.next(false);
      this.isCollapsedArr = new Array(res.length).fill(true);
      this.transferList = res || [];
       this.cd.detectChanges();
      if (!this.loading) {
        setTimeout(_ => {
          this.dialog.closeAll();
        }, 100);
      }
    }
  }

    resetAll(){
      this.transferService.resetFilter();
      
    }

    setResult() {
      // this.transferService.loading.next(true);
      this.transferService.searchingTransfer.subscribe(res => {
        this.searchingTransfer = res;
      });
      this.transferService.loading.subscribe(res => {
        this.loading = res;
      });
      this.transferService.transfer.subscribe(res => {
        this.setResponse(res)
      });
      this.transferService.changeDetectionEmitter.subscribe(
        () => {
          this.cd.detectChanges();
        },
        (err) => {
        }
      );
      this.transferService.noTransfer.subscribe(res => {
        this.noTransfer = res;
      });
      // this.transferService.loading.next(false);
    }
  
    onScrollDown() {
      this.endSlice += 20;
    }
  
    onScrollUp() {
      if (this.endSlice != 20) {
        this.endSlice -= 20;
      }
    }
  
    showViewMore(index: any) {
      this.isCollapsedArr.forEach((_, i) => {
        if (i !== index) {
          this.isCollapsedArr[i] = true;
        }
      });
      this.isCollapsedArr[index] = !this.isCollapsedArr[index];
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

    onBookNow(transfer: any) {
      const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'];
      this.transferService.loading.next(true);
      this.apiHandlerService.apiHandler('productDetails', 'POST', '', '', {
        ResultToken: transfer.ResultIndex,
        BookingSource: transfer.BookingSource,
        UserId: created_by_id,
        UserType: "B2B",
        Currency:  transfer.Price.Currency
      }).subscribe(res => {
        if ( res.data) {
          this.transferService.bookingTransferData.next(res.data);
          localStorage.setItem('bookingTransferData', JSON.stringify(this.transferService.bookingTransferData.getValue()));
          this.router.navigate(['search/transfer/transfers-details']);
        } else {
          this.transferService.loading.next(false);
          this.swalService.alert.oops("Unable To Get Details");
        }
        this.transferService.loading.next(false);
        this.cd.detectChanges();
      },
        (err) => {
          this.swalService.alert.oops(err.error.Message)
          this.transferService.loading.next(false);
          this.cd.detectChanges();
        });
    }

      getImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }
  }
  