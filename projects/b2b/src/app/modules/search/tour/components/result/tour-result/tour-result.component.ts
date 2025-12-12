import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TourService } from '../../../tour.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { SubSink } from "subsink";
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { TourSearchLoaderComponent } from '../../tour-search-loader/tour-search-loader.component';

const baseUrl = environment.SA_URL;

@Component({
  selector: 'app-tour-result',
  templateUrl: './tour-result.component.html',
  styleUrls: ['./tour-result.component.scss']
})
export class TourResultComponent implements OnInit {

  throttle;
  noPhoto;
  protected subs = new SubSink();
  public browserRefresh: boolean;
  bannerImageUrl = `${baseUrl}/sa/tour/tours/getBannerImage/`;
  searchingTour: boolean = false;
  loading: boolean;
  noTour = false;
  noTourMessage: any;
  tourList: any = [];
  isCollapsedArr = [];
  searchPayload: any;
  endSlice: number = 20;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  isCollapsed = true;
  CityName: any;

  constructor(
    private util: UtilityService,
    private tourService: TourService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) { }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.tourService.loading.next(true);
      this.tourService.loading.subscribe(res => {
        this.loading = res;
      });
    }
    this.subs.sink = this.tourService.isCollapsed.subscribe(res => {
      this.isCollapsed = res;
  });
    this.tourList = [];
    this.tourService.formFilled.next(JSON.parse(sessionStorage.getItem('tourFormData')));
    this.searchPayload = this.prepareSearchPayloadFromSessionData('tourSearchData');
    this.CityName = (JSON.parse(sessionStorage.getItem('tourSearchData')))['CityName'];
    this.searchResult(this.searchPayload);
    this.setResult();
    this.resetAll();
  }

  searchResult(data: any) {
    this.tourService.tour.next([]);
    this.tourService.tourCopy.next([]);
    this.tourList = [];
    this.tourService.formFilled.subscribe(d => {
      if (!this.util.isEmpty(d)) {
        const params = d;
        if (params) {
          let config = new MatDialogConfig();
          config.height = '600px';
          config.width = '1000px';
          config.panelClass = "copy-items-modal";
          config.data = {
            data: this.tourService.formFilled.value
          }
         let copyDialog = this.dialog.open(TourSearchLoaderComponent, config);
        }
      }
    })
    this.tourService.searchResult(data);
  }


  setResult() {
    this.tourService.loading.next(true);
    this.tourService.searchingTour.subscribe(res => {
      this.searchingTour = res;
    });

    this.tourService.loading.subscribe(res => {
      this.loading = res;
    });
    this.tourService.tour.subscribe(res => {
      this.tourList = [];
      if (res) this.setResponse(res)

    });
    this.tourService.changeDetectionEmitter.subscribe(
      () => {
        this.cd.detectChanges();
      },
      (err) => {
      }
    );
    this.tourService.noTour.subscribe(res => {
      this.noTour = res;
    });
    this.tourService.loading.next(false);
  }
  private prepareSearchPayloadFromSessionData(sessionKey: string): any {
    const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
    if (ssd) {
      const reqBody = {
        FromCityId: ssd.FromCityId,
        ToCityId: ssd.ToCityId,
        JourneyDate: ssd.JourneyDate,
        Destination_source: ssd.Destination_source
      };
      return reqBody;
    }
    else {
      this.router.navigate(['/']);
    }

  }

  setResponse(res) {
    this.loading = true;
    this.tourList = [];
    if (!res.length) {
      this.loading = false;
      this.tourList = [];
      if (res.message)
      this.noTourMessage = res.message;
    } else {
      this.loading = false;
      this.tourService.loading.next(false);
      this.isCollapsedArr = new Array(res.length).fill(true);
      this.tourList = res || [];
    }
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
  
  onBookNow(tour: any) {
    const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'];
    const currency = this.util.readStorage('currentUser', sessionStorage)['currency'];
		this.tourService.loading.next(true);
		this.subs.sink = this.apiHandlerService.apiHandler('tourDetail', 'POST', '', '', {
      ResultToken: tour.ResultIndex,
      BookingSource: tour.BookingSource,
      UserType: "B2B",
      UserId: created_by_id,
      Currency: currency
		}).subscribe(res => {
			if (res.data.length > 0 || res.data) {
				this.tourService.bookingTourData.next(res.data);
				sessionStorage.setItem('tourBookingInfo', JSON.stringify(res.data));
        this.router.navigate(['/search/tour/tour-details']);
			} else {
				this.tourService.loading.next(false);
				this.swalService.alert.oops(res.Message)
			}
			this.tourService.loading.next(false);
			this.cd.detectChanges();
		},
			(err) => {
				this.swalService.alert.oops(err.error.Message)
				this.tourService.loading.next(false);
				this.cd.detectChanges();
			});
	}

  // onBookNow(tour: any) {
  //   const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'];
  //   this.tourService.loading.next(true);
  //   this.apiHandlerService.apiHandler('tourDetail', 'POST', '', '', {
  //     ResultToken: tour.ResultIndex,
  //     BookingSource: tour.BookingSource,
  //     UserType: "B2B",
  //     UserId: created_by_id
  //   }).subscribe(res => {
  //     if (res.data.length > 0 || res.data) {
  //       this.tourService.bookingTourData.next(res.data);
  //       localStorage.setItem('tourBookingInfo', JSON.stringify(this.tourService.bookingTourData.getValue()));
  //       this.router.navigate(['/search/tour/tour-details']);
  //     } else {
  //       this.tourService.loading.next(false);
  //     }
  //     this.tourService.loading.next(false);
  //     this.cd.detectChanges();
  //   },
  //     (err) => {
  //       this.swalService.alert.oops(err.error.Message)
  //       this.tourService.loading.next(false);
  //       this.cd.detectChanges();
  //     });
  // }

  resetAll() {
    this.tourService.resetFilter();
  }
  resetFilter(){
    
  }

}
