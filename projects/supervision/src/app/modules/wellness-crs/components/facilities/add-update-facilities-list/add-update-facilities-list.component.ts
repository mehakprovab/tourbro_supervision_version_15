import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-update-facilities-list',
  templateUrl: './add-update-facilities-list.component.html',
  styleUrls: ['./add-update-facilities-list.component.scss']
})
export class AddUpdateFacilitiesListComponent implements OnInit {

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) { }

  public addUpdateFacilitiesListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;

  ngOnInit() {
    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateFacilitiesListForm.patchValue({
          name: resp.name,
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  createForm() {
    this.addUpdateFacilitiesListForm = this.formBuilder.group({
      name: new FormControl('',[Validators.required]),
      status: new FormControl(true)
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateFacilitiesListForm.invalid) {
      return;
    }
    if(this.isEdit) {
      this.addUpdateFacilitiesListForm.value['id'] = this.wellnessCrsService.getEditData.value.id;
    }
     let data = Object.assign({}, this.addUpdateFacilitiesListForm.value);
      data = [data];
      data['topic'] = this.isEdit ? 'updateFacilities' : 'addFacilities';
      this.wellnessCrsService.create(data).subscribe(resp => {
          if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
           this.router.navigate(
  ['/wellnesscrs/facilities'],
  {
    queryParams: {
      tab: 'list_facilities'
    }
  }
);
              this.submitted = false;
              // this.addUpdateFacilitiesListForm.reset();
              // this.getAllFacilitiesList();
              this.swalService.alert.success();
          } else {
              // this.swalService.alert.error();
          }
      });
  }

}
