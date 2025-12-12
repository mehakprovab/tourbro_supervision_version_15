import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-activities',
  templateUrl: './add-activities.component.html',
  styleUrls: ['./add-activities.component.scss']
})
export class AddActivitiesComponent implements OnInit {

  @Output() insertedRecord=new EventEmitter<any>();
  subSunk=new SubSink();
  activitiesForm:FormGroup;
  constructor(private fb:FormBuilder,private swalService:SwalService,private apiHandlerService:ApiHandlerService) { }

  ngOnInit() {
    this.createActivityForm()
  }

  createActivityForm(){
    this.activitiesForm=this.fb.group({
      activitiesName:new FormControl('',[Validators.required,this.inputValidator])
    })
  }

  onActivitiesSave(){
    //api to save data in db
    let saveContinentData={
      'tour_activity':this.activitiesForm.get('activitiesName').value,
      'status':1
    }
    if(this.activitiesForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('addTourActivity', 'post', {}, {},
              {"TourActivity":saveContinentData.tour_activity})
              .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                      this.swalService.alert.success("Tour Activity  data has been saved successfully");
                      this.insertedRecord.emit(response.data);
                      this.activitiesForm.reset();
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
