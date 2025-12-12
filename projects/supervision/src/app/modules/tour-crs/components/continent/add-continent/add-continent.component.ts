import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-continent',
  templateUrl: './add-continent.component.html',
  styleUrls: ['./add-continent.component.scss']
})
export class AddContinentComponent implements OnInit {

  continentForm:FormGroup;
  subSunk=new SubSink()
  @Output() insertedRecord=new EventEmitter<any>();

  constructor(private fb:FormBuilder,private swalService:SwalService, private apiHandlerService:ApiHandlerService ) { }

  ngOnInit() {
    this.createContinentForm()
  }

  createContinentForm(){
    this.continentForm=this.fb.group({
      continentName:new FormControl('', [Validators.required,this.inputValidator]),
    })
  }

  onContinentSave(){
    //api to save data in db
    let continetName=this.continentForm.get('continentName').value 
    if(this.continentForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('addTourContinent', 'post', {}, {},
              {"Name":continetName})
              .subscribe(response => {
                console.log(response);
                if (response.statusCode === 200 || response.statusCode === 201 && response.data) {
                  this.swalService.alert.success("Tour Region  data has been saved successfully");
                  this.insertedRecord.emit(response.data);
                  this.continentForm.reset();
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            }
        );
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
