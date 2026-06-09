import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder, Validators } from '@angular/forms';
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
  public fileToUpload: File = null;
  public imageSrc: any;

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
          description: resp.description || '',
          image_url: resp.image_url || '',
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
        this.imageSrc = resp.image_url || '';
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
    this.addUpdateTreatmentTypeListForm = this.formBuilder.group({
      treatment_name: ['', Validators.required],
      therapy_name: ['', Validators.required],
      description: ['', Validators.required],
      image_url: [''],
      status: [true]
    });
  }

  previewImage(event: any) {
    const file = event.target.files && event.target.files.length ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    const maxSize = 500 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.swalService.alert.oops('Only JPG, JPEG, PNG, SVG, and WEBP formats are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.swalService.alert.oops('Image exceeds 500 KB size limit.');
      event.target.value = '';
      return;
    }

    this.fileToUpload = file;
    this.addUpdateTreatmentTypeListForm.patchValue({ image_url: file.name });

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }

  resetForm() {
    this.addUpdateTreatmentTypeListForm.reset({ status: true });
    this.fileToUpload = null;
    this.imageSrc = '';
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateTreatmentTypeListForm.invalid) {
      return;
    }

    if (!this.isEdit && !this.fileToUpload) {
      this.swalService.alert.oops('Please select image to upload.');
      return;
    }

      const formData = new FormData();
      formData.append('treatment_name', this.addUpdateTreatmentTypeListForm.value.treatment_name);
      formData.append('therapy_name', this.addUpdateTreatmentTypeListForm.value.therapy_name);
      formData.append('description', this.addUpdateTreatmentTypeListForm.value.description);
      formData.append('status', this.addUpdateTreatmentTypeListForm.value.status ? '1' : '0');

      if(this.isEdit) {
        formData.append('id', this.wellnessCrsService.getEditData.value.id);
      }

      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
      }

      let data: any = [formData];
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
              this.fileToUpload = null;
              this.imageSrc = '';
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
