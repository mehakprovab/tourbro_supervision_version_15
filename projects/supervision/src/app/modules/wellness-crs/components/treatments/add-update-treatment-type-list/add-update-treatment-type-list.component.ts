import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-update-treatment-type-list',
  templateUrl: './add-update-treatment-type-list.component.html',
  styleUrls: ['./add-update-treatment-type-list.component.scss']
})
export class AddUpdateTreatmentTypeListComponent implements OnInit {

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) { }
  public therapyList: any;
  public addUpdateTreatmentTypeListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;
  public dropdownSettingsForTherapy={};

  ngOnInit() {

    this.createForm();
    this.getAllTherapyList();
    this.dropdownSettingsForTherapy = {
      singleSelection: false,
      idField: 'therapy_name',
      textField: 'therapy_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateTreatmentTypeListForm.patchValue({
          treatment_name: resp.treatment_name,
          therapy_name: resp.therapy_name,
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
this.addUpdateTreatmentTypeListForm = this.formBuilder.group({
      treatment_name: ['', Validators.required],
      therapy_name: ['', Validators.required],
      status: [true]
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateTreatmentTypeListForm.invalid) {
      return;
    }
    if(this.isEdit) {
      this.addUpdateTreatmentTypeListForm.value['id'] = this.wellnessCrsService.getEditData.value.id;
    }
     let data = Object.assign({}, this.addUpdateTreatmentTypeListForm.value);
      data = [data];
      data['topic'] = this.isEdit ? 'updateTreatment' : 'addTreatment';
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
           this.router.navigate(
  ['/wellnesscrs/treatments'],
  {
    queryParams: {
      tab: 'list_treatments'
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

  getAllTherapyList() {
    const data = {
          topic: "therapyTypeList",
        };
        this.wellnessCrsService.fetch(data).subscribe((resp) => {
          if (
            resp.Status === true &&
            (resp.statusCode === 200 || resp.statusCode === 201)
          ) {
            this.therapyList = resp.data.filter((item: any) => item.therapy_name) || [];
          } else if (resp.statusCode === 404) {
            this.therapyList = [];
          }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
  }
}
