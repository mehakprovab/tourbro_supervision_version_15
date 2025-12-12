import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,FormControl } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-country',
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.scss']
})
export class UpdateCountryComponent implements OnInit {

  countryForm:FormGroup;
  subSunk=new SubSink();
  countryId:number;
  continentDataList:any[] = []
  public selectedContinentId: any;
  
  constructor(private fb:FormBuilder, private swalService:SwalService,private route:ActivatedRoute,
              private apiHandlerService:ApiHandlerService, private router:Router) { }

  ngOnInit() {
    this.createCountryForm();
    this.route.queryParams.subscribe(data=>{
      this.countryForm.get('countryName').patchValue(data['name']);
      this.countryForm.get('continentName').patchValue(data['continent']);
      this.countryId=data['id'];
    });
    this.getContinentData();
  }

    selectedContinent(countryId){
    this.selectedContinentId=countryId;
  }


  createCountryForm(){
    this.countryForm=this.fb.group({
      continentName: new FormControl('',[Validators.required]),
      countryName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }

   getContinentData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourContinet', 'post', {}, {},{})
    .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
            this.continentDataList = response.data || [];
        }
    });
  }
  
  onCountySave(){
    //api to save data in db
    let updatedCountryName=this.countryForm.get('countryName').value
    if(this.countryForm.valid){
            this.subSunk.sink=this.apiHandlerService.apiHandler('editTourCountry','post',{},{},{
              "Name":updatedCountryName, 
              "CountryId":Number(this.countryId)  
            }).subscribe(respose=>{
              if(respose.statusCode==200 || respose.statusCode==201 && respose.Status){
                this.swalService.alert.success("Country has been saved successfully")
                this.router.navigate(["tour-crs/country"]);
              }
            },(err: HttpErrorResponse) => {
              this.swalService.alert.error(err['error']['Message']);
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
    this.countryForm.get('countryName').markAsTouched();
  }
}
