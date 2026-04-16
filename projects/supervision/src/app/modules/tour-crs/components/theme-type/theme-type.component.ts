import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-theme-type',
  templateUrl: './theme-type.component.html',
  styleUrls: ['./theme-type.component.scss']
})
export class ThemeTypeComponent implements OnInit {
  enabledForm:boolean=false;
  editForm:boolean=false;
  tourThemeDataList:any[]=[];
  displayColumn:string[]=['Sl. No.','Tour Theme','Current State',]
  subSunk=new SubSink();
  pageSize = 100;
  page = 1;
  collectionSize: number;  
  searchText:string='';
  tourThemeDataListForSort:any[]=[];
  searchSpin:boolean=true;
  loggedInUserData: any;

  constructor( private fb:FormBuilder, private swalService:SwalService,private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    const cuurentUser = localStorage.getItem('currentDomainUser');
    this.loggedInUserData = JSON.parse(cuurentUser);
    if (this.loggedInUserData.auth_role_id !== 7) {
      this.displayColumn.push( 'State Change','Action')
    }
    this.getTourThemeData()
  }
  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
  }

  getTourThemeData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourThemeList', 'post', {}, {},{})
      .subscribe(response => {
          if (response.statusCode == 200 || response.statusCode == 201 && response.data) {               
            this.tourThemeDataList = response.data || [];
            this.tourThemeDataListForSort=this.tourThemeDataList;
            this.collectionSize=this.tourThemeDataList.length;
            this.searchSpin=false;
          }
      });
  }

  onStateChange(inputRecordStateChange:any){
    //api call to change current status
    this.subSunk.sink = this.apiHandlerService.apiHandler('statusChangeTourTheme', 'post', {}, {},
              {
                "SubThemeId":inputRecordStateChange.id,
                "Status":Number(inputRecordStateChange.status) == 1 ? 0 : 1
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success("Tour theme type status has been changed successfully");
                  this.getTourThemeData();
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
             });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTourTheme', 'post', {}, {},
            {"SubThemeId":inputRecordToDeleted.id})
            .subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                this.swalService.alert.success("Deleted successfully");
                this.getTourThemeData();
            }
            },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  insertedRecordReceived(event){
    this.tourThemeDataList.unshift(event);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.tourThemeDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.tourThemeDataList = data;
        return;
    }
    this.tourThemeDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'Tour Theme': return this.compare(a.tour_subtheme.toLowerCase(), b.tour_subtheme.toLowerCase(), isAsc);
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
