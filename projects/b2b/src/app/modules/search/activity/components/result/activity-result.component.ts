import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivitiesService } from '../../activities.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ActivitiesLoaderComponent } from '../activity-loader/activities-loader.component';
import { Router } from '@angular/router';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { SubSink } from "subsink";
import * as moment from 'moment';
import { ActivitiesLoaderComponent } from '../activity-loader/activities-loader.component';

@Component({
  selector: 'app-activity-result',
  templateUrl: './activity-result.component.html',
  styleUrls: ['./activity-result.component.scss']
})
export class ActivityResultComponent implements OnInit {
  throttle: any;
  public browserRefresh: boolean;
  searchingActivity: boolean = false;
  loading: boolean;
  noActivity = false;
  noActivityMessage: any;
  activityList: any = [];
  isCollapsedArr = [];
  searchPayload: any;
  endSlice: number = 20;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  traveller: any;
	travellerAdult: any = 0;
	travellerChild: any = 0;
  from: any;
	to: any;
	destination: any;
  
  constructor(
    private util: UtilityService,
    private activityService: ActivitiesService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    // private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.activityService.loading.next(true);
      this.activityService.loading.subscribe(res => {
        this.loading = res;
      });
    }
    this.clearAdultChildCount();

    this.activityService.formFilled.next(JSON.parse(sessionStorage.getItem('activityFormData')));
    this.searchPayload = this.prepareSearchPayloadFromSessionData('activitySearchData');
    this.searchPayload.paxes.forEach(element => {
			this.travellerAdult += element.adultCount;
			this.travellerChild += element.childCount;
			this.traveller = [{
				adults: element.adultCount,
				childrens: element.childCount,
        ChildAge: element.ChildAge
			}];
		});
    this.searchResult(this.searchPayload);
    this.setResult();
  }

  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }

  searchResult(data: any) {
    this.activityService.formFilled.subscribe(d => {
      if (!this.util.isEmpty(d)) {
        const params = d;
        if (params) {
          let config = new MatDialogConfig();
          config.height = '600px';
          config.width = '1000px';
          config.panelClass = "copy-items-modal";
          config.data = {
            data: this.activityService.formFilled.value
          }
          let copyDialog = this.dialog.open(ActivitiesLoaderComponent, config);
        }
      }
    })
    this.activityService.searchResult(data);
  }


  setResult() {
    this.activityService.loading.next(true);
    this.activityService.searchingActivity.subscribe(res => {
      this.searchingActivity = res;
    });

    this.activityService.loading.subscribe(res => {
      this.loading = res;
    });
    this.activityService.activity.subscribe(res => {
      this.setResponse(res)

    });
    this.activityService.changeDetectionEmitter.subscribe(
      () => {
        this.cd.detectChanges();
      },
      (err) => {
      }
    );
    this.activityService.noActivity.subscribe(res => {
      this.noActivity = res;
    });
    this.activityService.loading.next(false);
  }
  private prepareSearchPayloadFromSessionData(sessionKey: string): any {
    const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
    //const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
		if(!ssd){
			this.router.navigate(['/']);
		}
		let paxes = [];
		this.clearAdultChildCount();
		ssd['paxes'].forEach(element => {
			this.setAdultChildCount(element);
			paxes.push({
				"adultCount": Number(element['adultCount']),
				"childCount": Number(element['childCount']),
				 "ChildAge":element['ChildAge']
			})
		});
    if (ssd) {
      const reqBody = {
        destination: ssd.destination,
        "from": `${(moment(ssd['from'])).format('YYYY-MM-DD')}`,
			  "to": `${moment(ssd['to']).format('YYYY-MM-DD')}`,
			  // "Currency": 'GBP',
        paxes:ssd['paxes'],
			 booking_source: `${ssd['booking_source']}`,
       destinationId: `${ssd['destinationId']}`
      };
      return reqBody;
    }
    else {
      this.router.navigate(['/']);
    }

  }

  setResponse(res) {
    if (!res.length) {
      this.activityList = [];
      if (res.Message)
        this.dialog.closeAll();
      this.noActivityMessage = res.Message;
    } else {
      this.activityService.loading.next(false);
      this.isCollapsedArr = new Array(res.length).fill(true);
      this.activityList = res || [];
      if (!this.loading) {
        setTimeout(_ => {
          this.dialog.closeAll();
        }, 100);
      }
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

  onBookNow(activity: any) {
    const created_by_id = this.util.readStorage('currentUser', sessionStorage)['id'];
    this.activityService.loading.next(true);
    this.apiHandlerService.apiHandler('activityProductDetails', 'POST', '', '', {
      ResultToken: activity.ResultIndex,
      BookingSource: activity.BookingSource,
      UserType: "B2B",
      UserId: created_by_id,
      Currency:  JSON.parse(sessionStorage.getItem('currentUser'))['currency']    }).subscribe(res => {
      if (res.data.length > 0 || res.data) {
        this.activityService.bookingActivityData.next(res.data);
        this.activityService.traveller = this.traveller;
        localStorage.setItem('activityTraveller', JSON.stringify(this.activityService.traveller));
        localStorage.setItem('bookingActivityData', JSON.stringify(this.activityService.bookingActivityData.getValue()));
        //this.activityservice.resultToken = res.ResultToken;
        this.router.navigate(['search/activity/activity-details']);
      } else {
        this.activityService.loading.next(false);
      }
      this.activityService.loading.next(false);
      this.cd.detectChanges();
    },
      (err) => {
        this.swalService.alert.oops("Regret, this tour is fully booked for the selected dates. Please, try another tour.")
        this.activityService.loading.next(false);
        this.cd.detectChanges();
      });
  }

  resetAll() {
    this.activityService.resetFilter();
  }

	setAdultChildCount(element){
		this.travellerAdult += Number(element['adults']);
		this.travellerChild += Number(element['childrens']);
	}

	clearAdultChildCount(){
		this.travellerAdult=0;
		this.travellerChild=0;
	}

}
