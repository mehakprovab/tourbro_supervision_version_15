import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-update-therapy-list',
  templateUrl: './add-update-therapy-list.component.html',
  styleUrls: ['./add-update-therapy-list.component.scss']
})
export class AddUpdateTherapyListComponent implements OnInit {


  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) { }

  public addUpdateTherapyListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;

  ngOnInit() {

    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateTherapyListForm.patchValue({
          therapy_name: resp.therapy_name,
          status: (resp.status === 1 || resp.status === '1') ? true : false
        });
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
this.addUpdateTherapyListForm = this.formBuilder.group({
      therapy_name: ['', Validators.required],
      status: [true]
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateTherapyListForm.invalid) {
      return;
    }
    if(this.isEdit) {
      this.addUpdateTherapyListForm.value['id'] = this.wellnessCrsService.getEditData.value.id;
    }
     let data = Object.assign({}, this.addUpdateTherapyListForm.value);
      data = [data];
      data['topic'] = this.isEdit ? 'updateTherapyType' : 'addTherapyType';
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
           this.router.navigate(
  ['/wellnesscrs/therapy-type'],
  {
    queryParams: {
      tab: 'list_therapy'
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
