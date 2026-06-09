import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { FormBuilder, Validators } from '@angular/forms';
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
  public fileToUpload: File = null;
  public imageSrc: any;
  public imageBaseUrl = 'http://tourbro.com/dev/node/dist/apps/supervision/';

  ngOnInit() {

    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateHealthGoalTypeListForm.patchValue({
          name: resp.name,
          description: resp.description || '',
          image_url: resp.image_url || resp.image || '',
          status: (resp.status === '1' || resp.status === 1) ? true : false
        });
        this.imageSrc = this.getImageUrl(resp.image_url || resp.image || '');
      } else {
        this.isEdit = false;
      }
    });
    
  }

  createForm() {
    this.addUpdateHealthGoalTypeListForm = this.formBuilder.group({
      name: ['', Validators.required],
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
    this.addUpdateHealthGoalTypeListForm.patchValue({ image_url: file.name });

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }

  getImageUrl(imageUrl: string) {
    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    return `${this.imageBaseUrl}${imageUrl.replace(/^\/+/, '')}`;
  }

  resetForm() {
    this.addUpdateHealthGoalTypeListForm.reset({ status: true });
    this.fileToUpload = null;
    this.imageSrc = '';
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if(this.addUpdateHealthGoalTypeListForm.invalid) {
      return;
    }

    if (!this.isEdit && !this.fileToUpload) {
      this.swalService.alert.oops('Please select image to upload.');
      return;
    }

      const formData = new FormData();
      formData.append('name', this.addUpdateHealthGoalTypeListForm.value.name);
      formData.append('description', this.addUpdateHealthGoalTypeListForm.value.description);
      formData.append('status', this.addUpdateHealthGoalTypeListForm.value.status ? '1' : '0');

      if(this.isEdit) {
        formData.append('id', this.wellnessCrsService.getEditData.value.id);
      }

      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
      }

      let data: any = [formData];
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

}
