import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-update-health-goal-type',
  templateUrl: './add-update-health-goal-type.component.html',
  styleUrls: ['./add-update-health-goal-type.component.scss']
})
export class AddUpdateHealthGoalTypeComponent implements OnInit {


  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) { }

  public addUpdateHealthGoalTypeListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;

  ngOnInit() {

    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateHealthGoalTypeListForm.patchValue({
          name: resp.name,
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
this.addUpdateHealthGoalTypeListForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: [true]
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateHealthGoalTypeListForm.invalid) {
      return;
    }
    if(this.isEdit) {
      this.addUpdateHealthGoalTypeListForm.value['id'] = this.wellnessCrsService.getEditData.value.id;
    }
     let data = Object.assign({}, this.addUpdateHealthGoalTypeListForm.value);
      data = [data];
      data['topic'] = this.isEdit ? 'updateHealthGoalCondition' : 'addHealthGoalCondition';
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
           this.router.navigate(
  ['/wellnesscrs/health-goals-condition'],
  {
    queryParams: {
      tab: 'list_health-goals'
    }
  }
);
              this.submitted = false;
              this.swalService.alert.success();
          } else {
              this.swalService.alert.error();
          }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

}
