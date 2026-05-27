
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-general-modal-image',
  templateUrl: './general-modal-image.component.html',
  styleUrls: ['./general-modal-image.component.scss']
})
export class GeneralModalImageComponent implements OnInit {
@ViewChild('fileInput', { static: false })
fileInput!: ElementRef<HTMLInputElement>;

  regConfig: FormGroup;
  btnName = 'Add';

  fileToUpload: File = null;
  imageSrc: any = '';
  selectedFileName = '';

  editingId = '';
  existingImage = '';

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.createForm();
    // this.getData(); // load existing if any
  }

  createForm() {
    this.regConfig = this.fb.group({
      type: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  // ✅ File Upload
  onFileChange(files: FileList) {
    if (!files.length) return;

    const file = files[0];
    this.selectedFileName = file.name;

    // Type validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.swalService.alert.error("Only JPG/PNG allowed");
      this.resetFile();
      return;
    }

    // Size validation (1MB)
    if (file.size > 1048576) {
      this.swalService.alert.error("Max file size is 1MB");
      this.resetFile();
      return;
    }

    this.fileToUpload = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(file);

    this.regConfig.patchValue({ image: file });
  }

  resetFile() {
    this.fileToUpload = null;
    this.imageSrc = '';
    this.selectedFileName = '';
    this.fileInput.nativeElement.value = '';
  }

  // ✅ Get existing (for edit)
  getData() {
    this.apiHandlerService.apiHandler('getAuthImage', 'post', {}, {}, {})
      .subscribe((resp: any) => {
        if (resp.data) {
          const data = resp.data;

          this.editingId = data.id;
          this.btnName = 'Update';

          this.regConfig.patchValue({
            type: data.type
          });

          this.imageSrc = data.image_url;
          this.selectedFileName = data.image_url.split('/').pop();
          this.existingImage = data.image_url;

          // remove required validator for edit
          this.regConfig.get('image').clearValidators();
          this.regConfig.get('image').updateValueAndValidity();
        }
      });
  }

  // ✅ Submit
  onSubmit() {
    if (this.regConfig.invalid) {
      this.swalService.alert.error("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append('page_type', this.regConfig.value.type);

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload);
    } else {
      this.swalService.alert.error("Image required");
      return;
    }

  

    this.apiHandlerService.apiHandler('addAuthImage', 'post', {}, {}, formData)
      .subscribe((resp: any) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.swalService.alert.success(
             "Added"
          );
          this.onReset(); // reload
        }
      });
  }

  // ✅ Reset
  onReset() {
    this.btnName = 'Add';
    this.editingId = '';
    this.existingImage = '';
    this.resetFile();

    this.regConfig.reset();

    this.regConfig.get('image').setValidators([Validators.required]);
    this.regConfig.get('image').updateValueAndValidity();
  }
}