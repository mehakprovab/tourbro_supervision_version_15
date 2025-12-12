import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-update-city',
  templateUrl: './update-city.component.html',
  styleUrls: ['./update-city.component.scss']
})
export class UpdateCityComponent implements OnInit {

  subSunk=new SubSink();
  cityId:number;
  cityForm:FormGroup
  countryDataList:Array<any>=[];
  selectedCountryId:number;

  constructor(private fb:FormBuilder, private swalService:SwalService,private route:ActivatedRoute,
              private apiHandlerService:ApiHandlerService, private router:Router) { }

  ngOnInit() {
    this.createCityForm();
    this.getCountryList();
    this.route.queryParams.subscribe(data=>{
      this.cityForm.get('cityName').patchValue(data['CityName']);
      this.cityForm.get('countryName').patchValue(data['country_id']);
      this.cityId=data['id'];
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

    selectedCountry(countryId){
    this.selectedCountryId=countryId;
  }

  sortCountry(){
    this.countryDataList.sort((a, b) => 
        a.name.localeCompare(b.name)
    );
    console.log("this.countryDataList......",this.countryDataList)
  }

  createCityForm(){
    this.cityForm=this.fb.group({
      countryName: new FormControl('',[Validators.required]),
      cityName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }
  
  onCitySave(){
    let selectedCountryName;
    this.countryDataList.forEach(item=>{
      if(item.id==this.selectedCountryId){
        selectedCountryName=item.name;
      }
     })
    //api to save data in db
    let updatedCityName=this.cityForm.get('cityName').value
    if(this.cityForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('editTourCity', 'post', {}, {},
              {
                "Name":updatedCityName,   
                "CityId":Number(this.cityId) 
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success("Tour City data has been updated successfully");
                  this.router.navigate(["tour-crs/city"]);
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message'].replace("400 ", ""));
            });
      }

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
