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
        this.wellnessCrsService.getEditData.next(data);
        this.toUpdate.emit({ tabId: 'add_wellness', wellness: data,wellnessTrigger:ev });
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
}
