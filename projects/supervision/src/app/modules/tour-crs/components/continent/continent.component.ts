import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
 
let filterArray: Array<any> = [];

@Component({
  selector: 'app-continent',
  templateUrl: './continent.component.html',
  styleUrls: ['./continent.component.scss']
})
export class ContinentComponent implements OnInit {
  enabledForm:boolean=false;
  editForm:boolean=false;
  tourRegionDataList:any[]=[];
  displayColumn:string[]=['Sl. No.','Tour Region','Current State']   
  subSunk=new SubSink();
  pageSize = 100;
  page = 1;
  collectionSize: number;
  searchText:string='';
  tourRegionDataListForSorting:any[]=[];
  searchSpin:boolean=true;
  loggedInUserData: any;
  
  constructor( private fb:FormBuilder, private swalService:SwalService, private router:Router,
                private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    this.getTourRegionData();
    const cuurentUser = localStorage.getItem('currentDomainUser');
    this.loggedInUserData = JSON.parse(cuurentUser);
    if (this.loggedInUserData.auth_role_id !== 7) {
      this.displayColumn.push( 'State Change','Action')
    }
  }
  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
  }

  getTourRegionData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterContinet', 'post', {}, {},{})
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.tourRegionDataList = response.data || [];
                    this.tourRegionDataListForSorting=this.tourRegionDataList;
                    this.collectionSize=this.tourRegionDataList.length;
                    this.searchSpin=false;
                  }
              });
  }

  onStateChange(inputRecordStateChange:any){
    //api call to change current status 
    this.subSunk.sink = this.apiHandlerService.apiHandler('statusChangeMasterContinent', 'post', {}, {},
              {
                "Id":inputRecordStateChange.id,
                "Status":Number(inputRecordStateChange.status) == 1 ? 0 : 1
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success("Region data status has been changed successfully");
                  this.getTourRegionData();
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    this.swalService.alert.delete((action)=>{
        if(action){
            //api call to delete the record 
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMasterContinent', 'post', {}, {},
                    {"Id":inputRecordToDeleted.id})
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                        this.swalService.alert.success("Region data has been deleted successfully");
                        this.getTourRegionData();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })

  }

  onEditRecords(editRecordData:any){
    this.router.navigate(['/continent/update'])
  }

  insertedRecordReceived(event){
    this.tourRegionDataList.unshift(event);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.tourRegionDataListForSorting];
    if (!sort.active || sort.direction === '') {
        this.tourRegionDataList = data;
        return;
    }
    this.tourRegionDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'Region': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
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
