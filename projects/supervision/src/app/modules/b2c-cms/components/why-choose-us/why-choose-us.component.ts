import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { CmsService } from '../../../cms/cms.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-why-choose-us',
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent implements OnInit {
 regConfig: FormGroup;
 whyChooseData:any
  selectedImages: File[] = [];
existingImages: string[] = [];
imagePreviews: string[] = [];
  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit() {

    this.createForm();
     this.getWhyChooseData();
  }
getWhyChooseData() {
 this.apiHandlerService
    .apiHandler('whyChooseUs', 'POST', '', '', '')
    .subscribe(res => {

      if ((res.statusCode === 200 || res.statusCode === 201) && res.data) {

        this.whyChooseData = res.data[0];
// ✅ store existing images
this.existingImages = [
  this.whyChooseData.image1,
  this.whyChooseData.image2
].filter(img => !!img); // remove empty/null
        this.regConfig.patchValue({
          main_heading: this.whyChooseData.main_heading || '',
          sub_heading: this.whyChooseData.sub_heading || '',

          stat1_value: this.whyChooseData.stat1_value || '',
          stat1_label: this.whyChooseData.stat1_label || '',

          stat2_value: this.whyChooseData.stat2_value || '',
          stat2_label: this.whyChooseData.stat2_label || '',

          stat3_value: this.whyChooseData.stat3_value || '',
          stat3_label: this.whyChooseData.stat3_label || '',

          header1: this.whyChooseData.header1 || '',
          description1: this.whyChooseData.description1 || '',

          header2: this.whyChooseData.header2 || '',
          description2: this.whyChooseData.description2 || '',

          header3: this.whyChooseData.header3 || '',
          description3: this.whyChooseData.description3 || '',

          // optional (if API sends)
          header4: this.whyChooseData.header4 || '',
          description4: this.whyChooseData.description4 || '',

          header5: this.whyChooseData.header5 || '',
          description5: this.whyChooseData.description5 || '',

          header6: this.whyChooseData.header6 || '',
          description6: this.whyChooseData.description6 || ''
        });

      }
    });
}

  createForm() {
    this.regConfig = this.fb.group({
      main_heading: ['', Validators.required],
      sub_heading: ['', Validators.required],

      stat1_value: ['', Validators.required],
      stat1_label: ['', Validators.required],

      stat2_value: ['', Validators.required],
      stat2_label: ['', Validators.required],

      stat3_value: ['', Validators.required],
      stat3_label: ['', Validators.required],

      header1: ['', Validators.required],
      description1: ['', Validators.required],

      header2: ['', Validators.required],
      description2: ['', Validators.required],

      header3: ['', Validators.required],
      description3: ['', Validators.required],
    });
  }

  // ✅ IMAGE VALIDATION
  validateFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.swalService.alert.oops("Only JPG/PNG allowed");
      return false;
    }

    if (file.size > 1048576) {
      this.swalService.alert.oops("Max size 1MB");
      return false;
    }

    return true;
  }

onFileSelected(event) {
  const files: FileList = event.target.files;

  this.selectedImages = [];
  this.imagePreviews = []; // reset previews

  for (let i = 0; i < files.length && i < 2; i++) {
    if (this.validateFile(files[i])) {

      this.selectedImages.push(files[i]);

      // ✅ generate preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  console.log('Selected Images:', this.selectedImages);
}
uploadImages(): Promise<any[]> {
  return new Promise((resolve, reject) => {

    if (!this.selectedImages.length) {
      resolve([]);
      return;
    }

    const formData = new FormData();

    this.selectedImages.forEach(file => {
      formData.append('WhyChooseImage', file); // confirm key with backend
    });

    this.apiHandlerService
      .apiHandler('uploadWhyChooseImage', 'POST', {}, {}, formData)
      .subscribe(
        (res: any) => {
          console.log('Upload Response:', res);

          if (res.statusCode === 200 || res.statusCode === 201) {

            // ✅ HANDLE DIFFERENT RESPONSE FORMATS
            const images = (res.data || []).map(item => {
              if (typeof item === 'string') return item;
              return item.image_url || item.url || item.path || '';
            });

            resolve(images);

          } else {
            reject(res);
          }
        },
        err => reject(err)
      );
  });
}

 async onSubmit() {

  if (this.regConfig.invalid) {
    this.regConfig.markAllAsTouched();
    this.swalService.alert.oops("Fill all required fields");
    return;
  }

  try {
    const uploadedImages = await this.uploadImages();

    console.log('Uploaded Images:', uploadedImages);

    const req = {
      ...this.regConfig.value,

      // ✅ FIX: HANDLE EDIT + NEW UPLOAD BOTH
      image1: uploadedImages[0] || this.whyChooseData.image1 || '',
      image2: uploadedImages[1] || this.whyChooseData.image2 || ''
    };

    console.log('Final Payload:', req);

    this.apiHandlerService
      .apiHandler('addwhyChooseusData', 'POST', {}, {}, req)
      .subscribe(
        (resp: any) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success("Saved successfully");

            this.regConfig.reset();
            this.selectedImages = [];

            this.getWhyChooseData(); // reload data
          } else {
            this.swalService.alert.oops();
          }
        },
        err => {
          console.error(err);
          this.swalService.alert.oops();
        }
      );

  } catch (e) {
    console.error(e);
    this.swalService.alert.oops("Image upload failed");
  }
}

  onReset() {
    this.regConfig.reset();
    this.selectedImages = [];
  }
}