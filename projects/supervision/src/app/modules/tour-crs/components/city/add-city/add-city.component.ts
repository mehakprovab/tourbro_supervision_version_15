import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {

  selectedCountryId:number;
  countryDataList:Array<any>=[];
  subSunk=new SubSink();
  @Output() insertedRecord=new EventEmitter<any>();
  cityForm:FormGroup;

  constructor(private fb:FormBuilder, private swalService:SwalService,private apiHandlerService:ApiHandlerService) { }

  ngOnInit() {
    this.createCityForm()
    this.getCountryList()
  }
  
  createCityForm(){
    this.cityForm=this.fb.group({
      countryName:new FormControl('',[Validators.required]),
      cityName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }

  getCountryList(){
    this.subSunk.sink=this.apiHandlerService.apiHandler('getTourCountryList','post',{},{},{}).subscribe(response=>{
      if(response.Status==200 || response.statusCode==201 && response.data){
          this.countryDataList=response['data'];
          console.log(" this.countryDataList", response)
          this.sortCountry()
        }
    })
  }

  sortCountry(){
    this.countryDataList.sort((a, b) => 
        a.name.localeCompare(b.name)
    );
    console.log("this.countryDataList......",this.countryDataList)
  }

  onCitySave(){
    let selectedCountryName;
    this.countryDataList.forEach(item=>{
      if(item.id==this.selectedCountryId){
        selectedCountryName=item.name;
      }
     })
    
    let citySaveData={
        'CityName':this.cityForm.get('cityName').value,
        'CountryName':selectedCountryName,
    }
    //api to save data in db
    if(this.cityForm.valid){
        this.subSunk.sink=this.apiHandlerService.apiHandler('addTourCity','post',{},{},{
          "CityName":citySaveData.CityName.split(','),  // name of the cities you want to add
          "CountryId": this.selectedCountryId   
          }).subscribe(respose=>{
            if(respose.statusCode==200 || respose.statusCode==201 && respose.Status){
              this.swalService.alert.success("City has been saved successfully")
              this.insertedRecord.emit(citySaveData);
              this.cityForm.reset();
            }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message'].replace("400 ", ""));
        })
    }
  }

  selectedCountry(countryId){
    this.selectedCountryId=countryId;
  }

  inputValidator(control: FormControl) {
    const value = control.value;
    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      return { startOrEndSpace: true };
    }
    if (value && /\d+/.test(value)) {
      return { invalidString: true };
    }
     return null;
  }
  
  validateInput() {
    this.cityForm.get('cityName').markAsTouched();
  }
}
