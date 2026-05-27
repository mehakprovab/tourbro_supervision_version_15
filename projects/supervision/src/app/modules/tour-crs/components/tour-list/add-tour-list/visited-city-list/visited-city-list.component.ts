import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { AddVisitedCityListComponent } from './add-visited-city-list/add-visited-city-list.component';
import { TourCrsService } from '../../../../tour-crs.service';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-visited-city-list',
  templateUrl: './visited-city-list.component.html',
  styleUrls: ['./visited-city-list.component.scss']
})
export class VisitedCityListComponent implements OnInit {

  @ViewChild(AddVisitedCityListComponent, { static: false })
  addVisitedCityListComponent!: AddVisitedCityListComponent;

  subSunk=new SubSink();
  tourId:number
  nightsAlreadyAdded:number;
  tourName:string=''
  isEditVisitedCity:string='';
  updateTourCities:string='';
  isAddTourCity:boolean=true;
  visitedCityListForSort:any[]=[];
  constructor(private fb:FormBuilder, private swalService:SwalService,private apiHandlerService:ApiHandlerService,
    private tourService:TourCrsService
  ) { }

  displayColumn=['S.N','City','No of Nights','Action']
  visitedCityList:any[]=[];
  countryDataList:any[]=[];
  searchSpin:boolean=true;

  ngOnInit() {
    this.tourId=Number(sessionStorage.getItem('tourId'))
    this.tourName=localStorage.getItem('tourName')
    this.updateTourCities=localStorage.getItem('updateTourCities');
    if(this.updateTourCities=='Yes'){
      console.log('update tour itennerary')
      this.updateTourCitiesInfo()
      //localStorage.removeItem('updateTourCities')
    }
    this.getNoOfNightDetails();
  }

  
  getNoOfNightDetails(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourVisitedCities', 'post', {}, {},
            {
              "toursId":this.tourId
            })
            .subscribe(response => {
              if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                    this.visitedCityList=response.data || [];
                    this,this.visitedCityListForSort=this.visitedCityList;
                    this.searchSpin=false;
                    this.totalNoOfNight(response.data);
                  }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
            });
  }

  totalNoOfNight(reposeData:any){
     this.nightsAlreadyAdded = reposeData.reduce((acc, obj) => {
      const noOfNights = parseInt(obj.no_of_nights);
      if (!isNaN(noOfNights)) {
        return acc + noOfNights;
      }
      return acc;
    }, 0);
    
  }

  insertedRecordReceived(){
    this.getNoOfNightDetails();
  }

  onDeletedRecord(inputRecordToDeleted){
    //api call to delete the record 
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTourVisitedCities', 'post', {}, {},
            { 
              "Id":inputRecordToDeleted.id
  
            })
            .subscribe(response => {
              if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                    this.swalService.alert.success("Depature date has been deleted successfully");
                    this.getNoOfNightDetails();
                    this.addVisitedCityListComponent.onParentRecordDeleted(inputRecordToDeleted.id);
                  }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  updateTourCitiesInfo(){
    this.isAddTourCity=false;
  }

  editTourVisitedCity(data){
    this.tourService.editTourCityData.next(data);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.visitedCityListForSort];
    if (!sort.active || sort.direction === '') {
        this.visitedCityList = data;
        return;
    }
    this.visitedCityList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'S.N': return this.compare(+a.id, +b.id, isAsc);
            case 'City': return this.compare(a.CityName.toLowerCase(), b.CityName.toLowerCase(), isAsc);
            case 'No of Nights': return this.compare(a.no_of_nights, b.no_of_nights, isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

