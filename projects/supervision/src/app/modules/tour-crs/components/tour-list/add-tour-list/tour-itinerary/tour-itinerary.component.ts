import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tour-itinerary',
  templateUrl: './tour-itinerary.component.html',
  styleUrls: ['./tour-itinerary.component.scss']
})
export class TourItineraryComponent implements OnInit {

  tourItinerayForm;
  inputFields: FormArray;
  tourDuration:string=''
  totalDaysOfTour:number;
  selectedCheckboxes = [];
  tourId:number;
  tourName:string='';
  subSunk=new SubSink();
  cityVisited:any=[];
  inclusions=['Hotel','Meals','Sightseeing','Transfer']
  cityDataList=[];
  updateTourItenary:string='';
  updateTourItenaryData:any[]=[];
  isUpdateTourIternary:boolean=false;

  constructor( private fb:FormBuilder, private router:Router,private apiHandlerService:ApiHandlerService,
                private swalService:SwalService ) { }

  ngOnInit() {
    this.tourId=Number(sessionStorage.getItem('tourId'));
    this.tourName=localStorage.getItem('tourName');
    this.tourDuration=localStorage.getItem('tourDuration');
    this.totalDaysOfTour=parseInt(this.tourDuration.split("|")[0])
    this.createTourItinerayForm();
    this.getTourRelatedData();
    this.updateTourItenary=localStorage.getItem('updateTourPackage');
    if(this.updateTourItenary=='Yes'){
      console.log('update tour itennerary')
      this.getUpdateTourItineraryData()
      localStorage.removeItem('updateTourPackage')
    }
  }
  getDaysOfTour(tourDuration:string):number{
    let regex = /\d+(?=\sDays)/;
    let result = Number(tourDuration.match(regex)[0]);
    return result
  }

  createTourItinerayForm(){
    this.tourItinerayForm=this.fb.group({
      inputFields: this.fb.array([])
    });
    this.addInputField();
  }

  getTourRelatedData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourItineraryPageData', 'post', {}, {},{
              "toursId":this.tourId
             })
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201) {
                      this.cityDataList = response.data || [];
                  }else{
                    this.swalService.alert.oops(response.Message);
                  }
              });
  }

  addInputField() {
    for(let i=1;i<=this.totalDaysOfTour;i++){
        this.inputFields = this.tourItinerayForm.get('inputFields') as FormArray;
        this.inputFields.push(this.fb.group({
          visitedCity: ['', Validators.required],
          programTitle: ['',Validators.required],
          programDes: ['']
        }));
      }
  }
  
  inclusionSelection(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedCheckboxes.push(inclusion);
    } else {
      const index = this.selectedCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedCheckboxes.splice(index, 1);
      }
    }
  }

  submitItineryForm(){
    let fromValue=this.tourItinerayForm.value.inputFields
    let day=1
    const updatedData = fromValue.map(obj => {
      return {
        ...obj,
        visitedCityDay:day++,
        programDes: obj.programDes.replace(/\n$/, '')
      };
    });

    if(this.tourItinerayForm.valid){
      if(!this.isUpdateTourIternary){
        this.subSunk.sink = this.apiHandlerService.apiHandler('addTourItinerary', 'post', {}, {},{
          "tourId": this.tourId,  
          "itenary": updatedData ,
          "inclusionsChecks": this.selectedCheckboxes
        })
          .subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
                  this.swalService.alert.success('Itinerary data has been added successfully')
                  this.router.navigate(["tour-crs/tour-list/add-tour/tour-descriptions"]);
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
      }else{
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourItinerary', 'post', {}, {},{
          "tourId": this.tourId,  
          "itenary": updatedData ,
          "inclusionsChecks": this.selectedCheckboxes
        })
          .subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
                  this.swalService.alert.success('Itinerary data has been updated successfully')
                  this.router.navigate(["tour-crs/tour-list"]);
              }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
      }
    }
    
  }

  getUpdateTourItineraryData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourItinerary', 'post', {}, {},{
      "toursId":this.tourId
     })
      .subscribe(response => {
          if (response.statusCode == 200 || response.statusCode == 201) {
              this.updateTourItenaryData = response.data || [];
              this.sortUpdateData(this.updateTourItenaryData)
              this.preFillFormWithUpdateData(this.updateTourItenaryData);
          }
        },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
  }

  sortUpdateData(updateTourData:any){
    updateTourData.sort((a, b) => {
      if (a.visited_city_day < b.visited_city_day) {
        return -1;
      }
      if (a.visited_city_day > b.visited_city_day) {
        return 1;
      }
      return 0;
    });
  }

  preFillFormWithUpdateData(updaeData:any){
    for(let i=0;i<this.totalDaysOfTour;i++){
      (this.tourItinerayForm.get('inputFields') as FormArray).at(i).get('visitedCity').patchValue(updaeData[i]["CityName"]);
      (this.tourItinerayForm.get('inputFields') as FormArray).at(i).get('programTitle').patchValue(updaeData[i]["program_title"]);
      (this.tourItinerayForm.get('inputFields') as FormArray).at(i).get('programDes').patchValue(updaeData[i]["program_des"]);
    }
    this.selectedCheckboxes=updaeData[0]["inclusions_checks"].split(',');
    this.isUpdateTourIternary=true
  }
}
