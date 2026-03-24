import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray:Array<any>=[]

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  
  enabledForm:boolean=false;
  editForm:boolean=false;
  tourRegionCounrtyDataList:any[]=[];
  displayColumn:string[]=['Sl. No.','Country','Current State','Actions'];
  pageSize = 100;
  page = 1;
  collectionSize: number;    
  searchText:string='';
  tourRegionCounrtyDataListForSort:any[]=[];
  searchSpin:boolean=true;

  subSunk=new SubSink();
  loggedInUserData: any;

  constructor( private fb:FormBuilder, private swalService:SwalService, private router:Router,
                private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    const cuurentUser = localStorage.getItem('currentDomainUser');
    this.loggedInUserData = JSON.parse(cuurentUser);
    // if (this.loggedInUserData.auth_role_id !== 7) {
    //   this.displayColumn.push( 'State Change','Action')
    // }
    this.getTourCountryData()
  }
  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
  }

 getTourCountryData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterCountryList','post',{},{},{}).subscribe(response => {
      console.log("Full response:", response); // Log full response for debugging
      
      // Check if response and data exist
      if (response && (response.statusCode === 200 || response.statusCode === 201)) {
          
          // Safe navigation to handle nested data
          const countriesData = response.data.data.countries;
          
          if (countriesData && Array.isArray(countriesData)) {
              this.tourRegionCounrtyDataList = countriesData;
              
              this.tourRegionCounrtyDataListForSort = [...this.tourRegionCounrtyDataList];
              this.collectionSize = this.tourRegionCounrtyDataList.length;
          } else {
              this.tourRegionCounrtyDataList = [];
              this.collectionSize = 0;
          }
          
          this.searchSpin = false;
      } else {
          this.swalService.alert.error(response.Message || 'Failed to load countries');
          this.searchSpin = false;
      }
    }, error => {
      this.swalService.alert.error('Failed to connect to server');
      this.searchSpin = false;
    });
}

  onStateChange(inputRecordStateChange:any){
    //api call to change current status 
    this.subSunk.sink = this.apiHandlerService.apiHandler('statusChangeMasterCountry', 'post', {}, {},
              {
                "Id":inputRecordStateChange.id,
                "Status":Number(inputRecordStateChange.status) == 1 ? 0 : 1
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success(" Country data status has been changed successfully");
                  this.getTourCountryData();
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMasterCountry', 'post', {}, {},
                {"id":inputRecordToDeleted.id})
                .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.swalService.alert.success(" Country data has been deleted successfully");
                    this.getTourCountryData();
                }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  insertedRecordReceived(newlyInsertedRecord){
    this.tourRegionCounrtyDataList.unshift(newlyInsertedRecord);
    this.getTourCountryData();
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.tourRegionCounrtyDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.tourRegionCounrtyDataList = data;
        return;
    }
    this.tourRegionCounrtyDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case ' Region': return this.compare(a.continent_name ? a.continent_name.toLowerCase():a.continent_name, b.continent_name ? b.continent_name.toLowerCase():b.continent_name, isAsc);
            case ' Country': return this.compare(a.name ? a.name.toLowerCase():a.name, b.name ? b.name.toLowerCase(): b.name, isAsc);
            case 'Current State': return this.compare(a.status, b.status, isAsc);
            case 'State Change': return this.compare(a.status, b.status, isAsc);
            default: return 0;
        }
    });
  }

//   compare(a: number | string, b: number | string, isAsc: boolean) {
//     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
//   }
    compare(a: number | string | null | undefined, b: number | string | null | undefined, isAsc: boolean) {
        if (a === null || a === undefined) {
            return 1;
        }
        if (b === null || b === undefined) {
            return -1; 
        }
        
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  
}
