import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,FormControl } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-theme-type',
  templateUrl: './update-theme-type.component.html',
  styleUrls: ['./update-theme-type.component.scss']
})
export class UpdateThemeTypeComponent implements OnInit {

  themeTypeForm:FormGroup;
  themeTypeId:number;
  subSunk=new SubSink();

  constructor(private fb:FormBuilder,private swalService:SwalService,private route:ActivatedRoute,
              private apiHandlerService:ApiHandlerService, private router:Router) { }

  ngOnInit() {
    this.createThemeTypeForm()
    this.route.queryParams.subscribe(data=>{
      this.themeTypeForm.get('themeTypeName').patchValue(data['tour_subtheme'])
      this.themeTypeId=data['id'];
    })
  }

  createThemeTypeForm(){
    this.themeTypeForm=this.fb.group({
      themeTypeName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }
  
  onThemeTypeSave(){
    //api to save data in db
    let updatedThemeType=this.themeTypeForm.get('themeTypeName').value;
    if(this.themeTypeForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('editTourTheme', 'post', {}, {},
              {
                "SubThemeId":this.themeTypeId,    
                "TourSubtheme":updatedThemeType
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                  this.swalService.alert.success("Tour Theme Type has been updated successfully");
                  this.router.navigate(["tour-crs/theme-type"]);
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
    this.themeTypeForm.get('themeTypeName').markAsTouched();
  }

}
