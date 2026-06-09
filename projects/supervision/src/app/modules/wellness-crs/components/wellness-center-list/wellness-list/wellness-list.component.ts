import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wellness-list',
  templateUrl: './wellness-list.component.html',
  styleUrls: ['./wellness-list.component.scss']
})
export class WellnessListComponent implements OnInit {

  constructor(
    private router: Router, 
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService
  ) { }
  public wellnessList: any;
  @Output() toUpdate = new EventEmitter<any>();
  countData: any;
  statusUpdating = {};
  trendingUpdating = {};
    pageSize = 10;
    page = 1;
  ngOnInit() {
    this.getWellnessList();
    this.getWellnessCount();
  }

  getWellnessCount(): void {
        let reqBody = {};
       
        const data = [reqBody]
        data['topic'] = 'wellnessCentersCount';
        this.wellnessCrsService.fetch(data).subscribe(resp => {
            
            if (resp.statusCode == 200) {
                this.countData = resp.data.wellness_centers_count;
                console.log("this.countData",this.countData)
            }
            else if (resp.statusCode == 404) {
               
                this.swalService.alert.error();
            }
        },
        (err: HttpErrorResponse) => {
        });
    }

  getWellnessList(event?: any) {
     if(event){
            this.pageSize = event;
        }
        const offset = (this.page -1)*this.pageSize;
    const data = [{
    "center_name": "",
    "center_code": "",
    "city_name": "",
    "supplier_name": "",
    "supplier_email": "",
    "offset": offset,
    "limit": this.pageSize
}];
        data["topic"] = "wellnessCenterList";
      this.wellnessCrsService.fetch(data).subscribe((res) => {
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
          this.wellnessList = res.data || [];
        }
      }, (err) => {
        console.error(err);
      });
  }
  updateHotel(data,ev) {
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        console.log("data",data)
        this.toUpdate.emit({ tabId: 'add_wellness', wellness: data,wellnessTrigger:ev });
        
    }

  updateList(data,ev) {
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
        console.log("data",data)
        const reqBody = [{ id: data.id }];
        reqBody['topic'] = 'editCenter';
        this.wellnessCrsService.fetch(reqBody).subscribe((resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            const editData = { ...data, ...(Array.isArray(resp.data) ? resp.data[0] : resp.data) };
            this.wellnessCrsService.getEditData.next(editData);
            this.toUpdate.emit({ tabId: 'add_wellness', wellness: editData,wellnessTrigger:ev });
          }
        }, (err: HttpErrorResponse) => {
          this.swalService.alert.error(err['error']['Message']);
        });
  }

    onDelete(id) {
      this.swalService.alert.delete((action) => {
            if (action) {
              const data = [{ center_code: id.center_code }];
              data["topic"] = "deleteWellnessCenter";
              this.wellnessCrsService.fetch(data).subscribe(
                (response) => {
                  if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success(
                      `Wellness Package has been deleted successfully`,
                    );
                    this.getWellnessList();
                  }
                },
                (err: HttpErrorResponse) => {
                  this.swalService.alert.error(err["error"]["Message"]);
                },
              );
            }
      });
  }

  onStatusChange(wellness: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const previousStatus = wellness.status;
    const status = input.checked ? 1 : 0;

    wellness.status = status;
    this.statusUpdating[wellness.center_code] = true;

    const data = [{
      status,
      center_code: wellness.center_code
    }];
    data["topic"] = "wellnessStatusUpdate";

    this.wellnessCrsService.update(data).subscribe(
      (response) => {
        this.statusUpdating[wellness.center_code] = false;

        if (response.Status === true && (response.statusCode === 200 || response.statusCode === 201)) {
          this.swalService.alert.success("Status updated successfully.");
          return;
        }

        wellness.status = previousStatus;
        input.checked = !!previousStatus;
        this.swalService.alert.oops(response.Message || response.message || "Status update failed.");
      },
      (err: HttpErrorResponse) => {
        this.statusUpdating[wellness.center_code] = false;
        wellness.status = previousStatus;
        input.checked = !!previousStatus;
        this.swalService.alert.error(err["error"] && err["error"]["Message"] ? err["error"]["Message"] : "Status update failed.");
      }
    );
  }

  onTrendingChange(wellness: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const previousTrending = wellness.is_trending;
    const is_trending = input.checked ? 1 : 0;

    wellness.is_trending = is_trending;
    this.trendingUpdating[wellness.center_code] = true;

    const data = [{
      is_trending,
      center_code: wellness.center_code
    }];
    data["topic"] = "wellnessSetTrending";

    this.wellnessCrsService.update(data).subscribe(
      (response) => {
        this.trendingUpdating[wellness.center_code] = false;

        if (response.statusCode === 200 || response.statusCode === 201) {
          this.swalService.alert.success(is_trending ? "Successfully added to trending list." : "Successfully removed from trending list.");
          return;
        }

        wellness.is_trending = previousTrending;
        input.checked = previousTrending === 1 || previousTrending === true;
        this.swalService.alert.oops(response.Message || response.message || "Trending update failed.");
      },
      (err: HttpErrorResponse) => {
        this.trendingUpdating[wellness.center_code] = false;
        wellness.is_trending = previousTrending;
        input.checked = previousTrending === 1 || previousTrending === true;
        this.swalService.alert.error(err["error"] && err["error"]["Message"] ? err["error"]["Message"] : "Trending update failed.");
      }
    );
  }
}
