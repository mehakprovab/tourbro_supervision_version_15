import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent implements OnInit {

  countryForm:FormGroup;
  selectedContinentId:string;
  subSunk=new SubSink();
  continentDataList:Array<any>=[];

  @Output() insertedRecord=new EventEmitter<any>();

  constructor(private fb:FormBuilder, 
              private swalService:SwalService, 
              private apiHandlerService:ApiHandlerService
    ) { }    

  ngOnInit() {
    this.createCountryForm();
    this.getContinentData();
  }
  createCountryForm(){
    this.countryForm=this.fb.group({
      continentName:new FormControl('',[Validators.required]),
      countryName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }

  oncountrySave(){
    // to get continent name on the basis of id
    let selectedContinentName;
    this.continentDataList.forEach(item=>{
      if(item.id==this.selectedContinentId){
        selectedContinentName=item.name;
      }
     })
     
    let countrySaveData={
        'name':this.countryForm.get('countryName').value,
        
        'continent_name':selectedContinentName,
         'status':1
    }
    if(this.countryForm.valid){
          this.subSunk.sink=this.apiHandlerService.apiHandler('addTourCountry','post',{},{},{
              "Name":countrySaveData.name,
              "IsoCode": "",
              "Continent":this.selectedContinentId  
            }).subscribe(respose=>{
              if(respose.statusCode==200 || respose.statusCode==201 && respose.Status){
                this.swalService.alert.success("Country has been saved successfully")
                this.insertedRecord.emit(countrySaveData);
                this.countryForm.reset();
              }
            },(err: HttpErrorResponse) => {
              this.swalService.alert.error(err['error']['Message'].replace("400 ", ""));
          });
    }
  }

  getContinentData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourContinet', 'post', {}, {},{})
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                      this.continentDataList = response.data || [];
                      this.sortContinent()
                  }
              });
  }

  sortContinent(){
    this.continentDataList.sort((a, b) => 
        a.name.localeCompare(b.name)
    );
  }
  selectedContinent(countryId){
    this.selectedContinentId=countryId;
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
    this.countryForm.get('countryName').markAsTouched();
  }

}
