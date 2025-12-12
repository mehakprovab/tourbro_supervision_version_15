import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Route } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-continent',
  templateUrl: './update-continent.component.html',
  styleUrls: ['./update-continent.component.scss']
})
export class UpdateContinentComponent implements OnInit {

  continentForm:FormGroup;
  continetId:number;
  subSunk=new SubSink();

  constructor(private fb:FormBuilder,private swalService:SwalService,private route:ActivatedRoute,
              private apiHandlerService:ApiHandlerService,private router:Router) { }

  ngOnInit() {
    this.createContinentForm()
    this.route.queryParams.subscribe(data=>{
      this.continentForm.get('continentName').patchValue(data['name'])
      this.continetId=Number(data['id']);
    })
  }

  createContinentForm(){
    this.continentForm=this.fb.group({
      continentName:new FormControl('', [Validators.required,this.inputValidator])
    })
  }
  
  onContinentSave(){
    // get updated name from form
    let updatedName=this.continentForm.get('continentName').value; 
    if(this.continentForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourContinent', 'post', {}, {},
              {
                "ContinentId":this.continetId,
                "Name":updatedName
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success("Tour Region  data has been updated successfully");
                  this.router.navigate(["tour-crs/continent"]);
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
    this.continentForm.get('continentName').markAsTouched();
  }
}
