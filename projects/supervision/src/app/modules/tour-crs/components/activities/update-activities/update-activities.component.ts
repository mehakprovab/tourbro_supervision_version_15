import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';{ }

@Component({
  selector: 'app-update-activities',
  templateUrl: './update-activities.component.html',
  styleUrls: ['./update-activities.component.scss']
})
export class UpdateActivitiesComponent implements OnInit {

  activitiesForm:FormGroup;
  activityId:number;
  subSunk=new SubSink();
  constructor(private fb:FormBuilder,private swalService:SwalService,private route:ActivatedRoute,
              private apiHandlerService:ApiHandlerService, private router:Router ) { }

  ngOnInit() {
    this.createAcivityForm()
    this.route.queryParams.subscribe(data=>{
      this.activitiesForm.get('activitiesName').patchValue(data['tour_activity'])
      this.activityId=data['id']
    })
  }

  createAcivityForm(){
    this.activitiesForm=this.fb.group({
      activitiesName: new FormControl('',[Validators.required,this.inputValidator])
    })
  }
  
  onActivitiesSave(){
    //api to save data in db
    let  updatedActivities=this.activitiesForm.get('activitiesName').value
    if(this.activitiesForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('editTourActivity', 'post', {}, {},
              {
                "ActivityId":this.activityId,          
                "TourActivity":updatedActivities 
              }).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.Status) {
                      this.swalService.alert.success("Tour Activity has been updated successfully");
                      this.router.navigate(["tour-crs/activities"]);
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
    this.activitiesForm.get('activitiesName').markAsTouched();
  }
}

