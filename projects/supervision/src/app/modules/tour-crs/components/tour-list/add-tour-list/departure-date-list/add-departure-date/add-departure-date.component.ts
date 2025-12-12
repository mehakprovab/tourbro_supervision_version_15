import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-departure-date',
  templateUrl: './add-departure-date.component.html',
  styleUrls: ['./add-departure-date.component.scss']
})
export class AddDepartureDateComponent implements OnInit {

  subSunk=new SubSink();
  saveButtonEnable:boolean=false;
  departureForm:FormGroup;
  tourId:number;
  @Output() insertedRecord=new EventEmitter<any>();
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  minDate= new Date()
  updateDepartureDate:string=''
  updateDepature:boolean=false;

  constructor(private fb:FormBuilder, private swalService:SwalService, private apiHandlerService:ApiHandlerService,
              private router:Router ) { }

  ngOnInit() {
    this.tourId=Number(localStorage.getItem('tourId'));
    this.updateDepartureDate=localStorage.getItem('updateDepartureDate');
    if(this.updateDepartureDate=='Yes'){
      this.updateDepature=true;
      //localStorage.removeItem('updateDepartureDate')
    }
    this.createDepartureForm();
  }
  createDepartureForm(){
    this.departureForm=this.fb.group({
      departureDate:new FormControl('',[Validators.required])
    })
  }
  
  onDepartureSave(){
    //api to save data in db
    if(this.departureForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('addDepartureDateList', 'post', {}, {},{
              "tourId":this.tourId,
              "date":this.departureForm.get('departureDate').value
            }).subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
              if(response.data){
                this.swalService.alert.success("Departure Date has been saved successfully");
                this.insertedRecord.emit();
                this.departureForm.reset();
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
  }
  departureDateSelected(){
    this.saveButtonEnable=true;
  }
  nextButton(){
    localStorage.removeItem('updateTourCities');
    this.router.navigate(["/tour-crs/tour-list/add-tour/visited-city"])
  }

}