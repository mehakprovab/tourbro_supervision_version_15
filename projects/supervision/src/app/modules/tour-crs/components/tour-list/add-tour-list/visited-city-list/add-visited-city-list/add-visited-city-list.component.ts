import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import {FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TourCrsService } from '../../../../../tour-crs.service';

@Component({
  selector: 'app-add-visited-city-list',
  templateUrl: './add-visited-city-list.component.html',
  styleUrls: ['./add-visited-city-list.component.scss']
})
export class AddVisitedCityListComponent implements OnInit {

  saveButtonEnable:boolean=false;
  visitedCity:FormGroup
  cityList:Array<any>=[];
  selectedCity:Array<any>[]=[];
  tourDuration:string=''//'8 Days / 7 Nights'
  tourId:number
  totalAvailableNight:number;
  enableNext:boolean=false;

  subSunk=new SubSink();
  @Output() insertedRecord=new EventEmitter<any>();
  @Input() totalAddedNight;
  public updateVisitedCity:boolean=false;
  public tourEditId:number;

  noOfNights=[{'id':1,'name':'1Night'},
  {'id':2,'name':'2Nights'},
  {'id':3,'name':'3Nights'},
  {'id':4,'name':'4Nights'},
  {'id':5,'name':'5Nights'},
  {'id':6,'name':'6Nights'},
  {'id':7,'name':'7Nights'},
  {'id':8,'name':'8Nights'},
  {'id':9,'name':'9Nights'},
  {'id':10,'name':'10Nights'},
  {'id':11,'name':'11Nights'},
  {'id':12,'name':'12Nights'},
  {'id':13,'name':'13Nights'},
  {'id':14,'name':'14Nights'},
  {'id':15,'name':'15Nights'},
  {'id':16,'name':'16Nights'},
  {'id':17,'name':'17Nights'},
  {'id':18,'name':'18Nights'},
  {'id':19,'name':'19Nights'},
  {'id':20,'name':'20Nights'},
  {'id':21,'name':'21Nights'},
  {'id':22,'name':'22Nights'},
  {'id':23,'name':'23Nights'},
  {'id':24,'name':'24Nights'},
  {'id':25,'name':'25Nights'},
  {'id':26,'name':'26Nights'},
  {'id':27,'name':'27Nights'},
  {'id':28,'name':'28Nights'},
  {'id':29,'name':'29Nights'},
  {'id':30,'name':'30Nights'},
  {'id':31,'name':'31Nights'}
  ]  
  constructor( private fb:FormBuilder, private apiHandlerService:ApiHandlerService, private swalService:SwalService,
    private tourService:TourCrsService
  ) { }

  ngOnInit() {
    this.tourId=Number(sessionStorage.getItem('tourId'));
    this.createVistedForm()
    this.getTourRelatedInitailFilledData();
    this.tourService.editTourCityData.subscribe(data=>{
      if(data){
        this.updateVisitedCity = true;
        this.tourEditId = data.id;
        this.visitedCity.get('choosenCity').patchValue(data.CityName);
        this.visitedCity.get('choosenDuration').patchValue(data.no_of_nights);
      } else {
        this.updateVisitedCity = false;
      }
    });
  }
  createVistedForm(){
    this.visitedCity=this.fb.group({
      tourDuration:new FormControl('',[Validators.required]),
      choosenCity:new FormControl('',[Validators.required]),
      choosenDuration:new FormControl('',[Validators.required])
    })
  }
  getTourDuration(){
    this.visitedCity.get('tourDuration').patchValue(this.tourDuration);
  }

  selectCity(inputSelectedCity:any){
    if(this.selectedCity.length>0){
      this.selectedCity.pop();
    }
    this.selectedCity.push(inputSelectedCity)
    this.visitedCity.get('choosenCity').patchValue(inputSelectedCity);
  }

  getTourRelatedInitailFilledData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourVisitedCityList', 'post', {}, {},{
     "toursId":this.tourId 
       }).subscribe(response => {
           if (response.statusCode == 200 || response.statusCode == 201) {
            if(response.data){
                this.tourDuration=response.data[0]['duration'];
                this.tourService.editTourCityData.next(null);
                this.updateVisitedCity = false;
                localStorage.setItem('tourDuration',this.tourDuration);
                this.totalAvailableNight=parseInt(this.tourDuration.split("|")[1])
                this.visitedCity.get('tourDuration').patchValue(this.tourDuration);
                this.cityList = response.data[0]['city_name'] || [];
               
                this.shouldEnableNext();
            }else{
                this.swalService.alert.oops(response.Message);
            }
           }else{
            this.swalService.alert.oops(response.Message);
           }
       },(err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
    });
 }

 vistedCityFormSubmit(){
  let currentNightSelected=parseInt(this.visitedCity.get('choosenDuration').value);
  if(this.visitedCity.valid){
      if(this.totalAvailableNight >= (currentNightSelected)){
        this.subSunk.sink = this.apiHandlerService.apiHandler('addTourVisitedCities', 'post', {}, {},{
          "toursId":this.tourId,              
          "noOfNights": this.visitedCity.get('choosenDuration').value,      
          "cityName": this.visitedCity.get('choosenCity').value  
          }).subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
              if(response.data){
                this.enableNext = true;
                this.swalService.alert.success("Visted City List is added successfully");
                this.insertedRecord.emit();
                this.getTourRelatedInitailFilledData();
              }else{
                  this.swalService.alert.oops(response.Message);
              }
              }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message'].replace("400 ", ""));
        });
      }else{
        this.swalService.alert.oops("Total choosen no of night is more than tour duration nights, please correct it according !!");
      }
      
  }
 }

 updateTourVisitedCityFormSubmit(){
  let currentNightSelected=parseInt(this.visitedCity.get('choosenDuration').value);
  if(this.visitedCity.valid){
      if(this.totalAvailableNight >= (currentNightSelected)){
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourVisitedCities', 'post', {}, {},{
          "Id":this.tourEditId,              
          "noOfNights": this.visitedCity.get('choosenDuration').value,      
          "cityName": this.visitedCity.get('choosenCity').value  
          }).subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
              if(response.data){
                this.enableNext = true;
                this.swalService.alert.success("Visted City List is added successfully");
                this.insertedRecord.emit();
                this.getTourRelatedInitailFilledData();
              }else{
                  this.swalService.alert.oops(response.Message);
              }
              }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
      }else{
        this.swalService.alert.oops("Total choosen no of night is more than tour duration nights, please correct it according !!");
      }
      
  }
 }

  onParentRecordDeleted(deletedRecordId){
    this.enableNext = false;
  }

 shouldEnableNext(){
  
 }
}
