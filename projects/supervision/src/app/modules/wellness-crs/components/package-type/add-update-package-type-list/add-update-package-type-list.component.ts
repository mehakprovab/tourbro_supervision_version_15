import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-update-package-type-list',
  templateUrl: './add-update-package-type-list.component.html',
  styleUrls: ['./add-update-package-type-list.component.scss']
})
export class AddUpdatePackageTypeListComponent implements OnInit {

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) { }

  public addUpdatePackageTypeListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;

  ngOnInit() {

    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdatePackageTypeListForm.patchValue({
          name: resp.name,
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
this.addUpdatePackageTypeListForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: [true]
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdatePackageTypeListForm.invalid) {
      return;
    }
    if(this.isEdit) {
      this.addUpdatePackageTypeListForm.value['id'] = this.wellnessCrsService.getEditData.value.id;
    }
     let data = Object.assign({}, this.addUpdatePackageTypeListForm.value);
      data = [data];
      data['topic'] = this.isEdit ? 'updatePackageType' : 'addPackageType';
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
           this.router.navigate(
  ['/wellnesscrs/package-type'],
  {
    queryParams: {
      tab: 'list_package-type'
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
