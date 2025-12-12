import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  subSunk=new SubSink();
  enabledForm:boolean=false;
  editForm:boolean=false;
  tourCounrtyCityDataList:any[]=[];
  displayColumn:string[]=['Sl. No.','Tour Country','Tour City',]
  pageSize = 100;
  page = 1;
  collectionSize: number; 
  continentForm:FormGroup;   
  searchText:string='';
  tourCounrtyCityDataListForSort:any[]=[]
  searchSpin:boolean=true
  loggedInUserData: any;

  constructor( private fb:FormBuilder, private swalService:SwalService, private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    const cuurentUser = localStorage.getItem('currentDomainUser');
    this.loggedInUserData = JSON.parse(cuurentUser);
    if (this.loggedInUserData.auth_role_id !== 7) {
      this.displayColumn.push('Action')
    }
    this.getTourCityData()
    this.createContinetForm
  }

  createContinetForm(){
    this.continentForm=this.fb.group({
      continentName:['',Validators.required]
    })
  }

  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
  }

  getTourCityData(){
    //api to fetch data from DB
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourCityList', 'post', {}, {},{})
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                      this.tourCounrtyCityDataList = response.data || [];
                      this.tourCounrtyCityDataListForSort=this.tourCounrtyCityDataList;
                      this.collectionSize = this.tourCounrtyCityDataList.length;
                      this.searchSpin=false;
                  }
              });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTourCity', 'post', {}, {},
                {"Id":inputRecordToDeleted.id})
                .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.swalService.alert.success("Tour City data has been deleted successfully");
                    this.getTourCityData();
                }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  insertedRecordReceived(newlyInsertedRecord){
    this.tourCounrtyCityDataList.unshift(newlyInsertedRecord);
    this.getTourCityData();
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.tourCounrtyCityDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.tourCounrtyCityDataList = data;
        return;
    }
    this.tourCounrtyCityDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'Tour Country': return this.compare(a.CountryName.toLowerCase(), b.CountryName.toLowerCase(), isAsc);
            case 'Tour City': return this.compare(a.CityName.toLowerCase(), b.CityName.toLowerCase(), isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
