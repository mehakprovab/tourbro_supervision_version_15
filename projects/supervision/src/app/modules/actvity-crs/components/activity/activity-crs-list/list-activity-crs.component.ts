import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivityCrsService } from '../../../activity-crs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
const log = new Logger('transfer-crs/TransferVehicleListComponent');

@Component({
  selector: 'app-list-activity-crs',
  templateUrl: './list-activity-crs.component.html',
  styleUrls: ['./list-activity-crs.component.scss']
})
export class ActivityCRSListComponent implements OnInit {
  pageSize = 10;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
    { key: "Slno", value: 'SI No.' },
    { key: "activity_name", value: 'Activity Name' },
    { key: "supplier_name", value: 'Supplier Name' },
    { key: "prime_user_name", value: 'Prime User' },
    { key: "distribution_channel", value: 'Distribution Channel' },
    { key: "activity_type", value: 'Activity Type' },
    { key: "activity_country_name", value: 'Country' },
    { key: "activity_city_name", value: 'City' },
    { key: "activity_duration", value: 'Duration' },
    { key: "currency", value: 'Currency' },
    { key: "enddate", value: 'Valid Till' },
    { key: "publish_status", value: 'Publish Status' },
    { key: "book_now", value: 'Book Now' },
    { key: "action", value: 'Action' },
  ];
  public noData: boolean = true;
  public respData: any[] = [];
  public editPricing: boolean = false;
  status;
  @Output() toUpdate = new EventEmitter<any>();

  public searchText: string = '';
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  subSunk = new SubSink();
  public loggedInUser: any;
  public activity_id: any;

  constructor(
    private apiHandlers: ApiHandlerService,
    private swalService: SwalService,
    private activiCrsService: ActivityCrsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // const currentDomainUser = localStorage.getItem('currentDomainUser');
    // this.loggedInUser = JSON.parse(currentDomainUser);
    // if (this.loggedInUser.auth_role_id === 7) {
    //   this.displayColumn.splice(this.displayColumn.length - 2, 1);
    // }
    this.getActivityCrsList();
  }


  getActivityCrsList() {
    this.apiHandlers.apiHandler('getActivityCRSList', 'POST', {}, {}, {}).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201) && res.data.length) {
          this.respData = res.data;
          this.collectionSize = res.data.length;
          this.noData = false;
        } else {
          this.respData = [];
          this.noData = false;
        }
        console.log(res)
      }, error: (err) => {
        this.respData = [];
        this.noData = false;
        this.swalService.alert.error(err.Message)
      }
    })
  }


  updateActivity(data) {
    console.log(data);
    this.editPricing = false;
    this.router.navigate(
      ['/activity/activity-crs'],
      { queryParams: { tab: 'add_activitycrs' } }
    );
    this.activiCrsService.getActivityUpdateData.next(data);
  }


  cancelDeletePopup(id) {
    const req = {
      activity_id: id
    }
    this.loading = true;
    this.swalService.alert.delete((action) => {
      if (action) {
        this.subSunk.sink = this.apiHandlers.apiHandler('deleteActivity', 'post', {}, {}, req)
          .subscribe(response => {
            if (response.Status === true && (response.statusCode == 200 || response.statusCode == 201)) {
              this.loading = false;
              this.swalService.alert.success('Activity CRS has been deleted successfully')
              this.getActivityCrsList();
            } else {
              this.swalService.alert.oops(response.Message)
              this.loading = false;
            }
          }, (err: HttpErrorResponse) => {
            this.loading = false;
            this.swalService.alert.error(err['error']['Message']);
          });
      }
    })
  }


  enablePublish(checked: boolean, publishRecord: any) {
    this.subSunk.sink = this.apiHandlers.apiHandler('updateActivityStatus', 'post', {}, {}, {
      "activity_id": publishRecord.activity_id,
      "publish_status": checked == true ? 1 : 0,
    })
      .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          if (checked) {
            this.swalService.alert.success('Successfully Enabled Publish')
            if (this.loggedInUser.auth_role_id === 7) {
              this.enableBookNow(true, publishRecord)
            }

          } else {
            if (this.loggedInUser.auth_role_id === 7) {
              this.enableBookNow(false, publishRecord)
            }
            this.swalService.alert.success('Successfully Disabled')
          }
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  enableBookNow(checked: boolean, publishRecord: any) {
    this.subSunk.sink = this.apiHandlers.apiHandler('updateActivityStatus', 'post', {}, {}, {
      "activity_id": publishRecord.activity_id,
      "book_now_status": checked == true ? 1 : 0,
    })
      .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          if (checked) {
            this.swalService.alert.success('Successfully Enabled Book Now')
          } else {
            this.swalService.alert.success('Successfully Disabled')
          }
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  getValidTillDate(data) {
    if (data.length) {
      return data.map(s => s.end_date)
        .reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
    }
  }
}
