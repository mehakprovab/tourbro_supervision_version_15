import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  enabledForm:boolean=false;
  editForm:boolean=false;
  tourActivitiesDataList:any[]=[];
  subSunk=new SubSink();
  pageSize = 100;
  page = 1;
  collectionSize: number; 
  searchText:string='' 
  tourActivitiesDataListForSort:any[]=[];
  searchSpin:boolean=true;
loggedInUserData: any;
  displayColumn:string[]=['Sl. No.','Tour Activities','Current State',]

  constructor( private fb:FormBuilder, private swalService:SwalService, private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    const cuurentUser = localStorage.getItem('currentDomainUser');
    this.loggedInUserData = JSON.parse(cuurentUser);
    if (this.loggedInUserData.auth_role_id !== 7) {
      this.displayColumn.push( 'State Change','Action')
    }
    this.getTourActivitiesData()
  }

  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
  }

  getTourActivitiesData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourActivityList', 'post', {}, {},{})
    .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
            this.tourActivitiesDataList = response.data || [];
            this.tourActivitiesDataListForSort=this.tourActivitiesDataList;
            this.collectionSize=this.tourActivitiesDataList.length;
            this.searchSpin=false;
        }
    });
  }

  onStateChange(inputRecordStateChange:any){
    //api call to change current status
    this.subSunk.sink = this.apiHandlerService.apiHandler('statusChangeTourActivity', 'post', {}, {},
    {
      "ActivityId":inputRecordStateChange.id,
      "Status":Number(inputRecordStateChange.status) == 1 ? 0 : 1
    }).subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
            this.swalService.alert.success("Tour Acivity status has been changed successfully");
            this.getTourActivitiesData();
          }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
  });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTourActivity', 'post', {}, {},
            {"ActivityId":inputRecordToDeleted.id})
            .subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.swalService.alert.success("Tour Activity has been deleted successfully");
                    this.getTourActivitiesData();
                  }
            },(err: HttpErrorResponse) => {
              this.swalService.alert.error(err['error']['Message']);
          });
        }
    })
  }

  insertedRecordReceived(event){
    this.tourActivitiesDataList.unshift(event);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.tourActivitiesDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.tourActivitiesDataList = data;
        return;
    }
    this.tourActivitiesDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'Tour Activities': return this.compare(a.tour_activity.toLowerCase(), b.tour_activity.toLowerCase(), isAsc);
            case 'Current State': return this.compare(a.status, b.status, isAsc);
            case 'State Change': return this.compare(a.status, b.status, isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
