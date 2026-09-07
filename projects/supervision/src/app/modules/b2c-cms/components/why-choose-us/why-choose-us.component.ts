import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { CmsService } from '../../../cms/cms.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { resolveStaticUploadUrl } from 'projects/supervision/src/app/core/services/media-url';

@Component({
  selector: 'app-why-choose-us',
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent implements OnInit, OnDestroy {
 regConfig: FormGroup;
 whyChooseData: any = {};
  selectedImages: File[] = [];
existingImages: string[] = [];
imagePreviews: string[] = [];
previewError = "";
readonly maxImages = 2;
private selectionVersion = 0;
@ViewChild('imageInput') imageInput: ElementRef<HTMLInputElement>;
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

        this.whyChooseData = res.data[0] || {};
this.existingImages = [
  this.whyChooseData.image1,
  this.whyChooseData.image2
].filter(img => !!img).map(img => resolveStaticUploadUrl(img));
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.swalService.alert.oops("Only JPG/JPEG/PNG/WEBP allowed");
      return false;
    }

    if (file.size > 1048576) {
      this.swalService.alert.oops("Max size 1MB");
      return false;
    }

    return true;
  }

async onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (!files.length) return;

  if (files.length > this.maxImages) {
    this.swalService.alert.oops("Maximum 2 images allowed");
    input.value = '';
    return;
  }
  if (!files.every(file => this.validateFile(file))) {
    input.value = '';
    return;
  }

  const selectionVersion = ++this.selectionVersion;
  try {
    for (const file of files) {
      const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      if (selectionVersion !== this.selectionVersion) return;
      const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
        .every((value, index) => bytes[index] === value);
      const webp = String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
        && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
      if (!jpeg && !png && !webp) {
        input.value = '';
        this.swalService.alert.oops(`"${file.name}" does not contain JPG, JPEG, PNG or WEBP image data. Download the actual image, not the webpage.`);
        return;
      }
    }
  } catch {
    if (selectionVersion !== this.selectionVersion) return;
    input.value = '';
    this.swalService.alert.oops('Unable to read the selected file. Please select it again.');
    return;
  }

  this.clearSelectedImages();
  const version = this.selectionVersion;
  this.selectedImages = files;
  this.imagePreviews = files.map(file => URL.createObjectURL(file));
  this.imagePreviews.forEach((src, index) => {
    const image = new Image();
    image.onerror = () => {
      if (version === this.selectionVersion) {
        const filename = files[index].name;
        this.previewError = `Preview unavailable for "${filename}". The file is still selected and can be uploaded.`;
      }
    };
    image.src = src;
  });
}

private clearSelectedImages() {
  this.selectionVersion++;
  this.previewError = "";
  this.imagePreviews.forEach(src => URL.revokeObjectURL(src));
  this.selectedImages = [];
  this.imagePreviews = [];
  if (this.imageInput) this.imageInput.nativeElement.value = '';
}

ngOnDestroy() {
  this.clearSelectedImages();
}

trackImage(index: number): number {
  return index;
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

            const imageData = res.data && res.data.images;
            const uploadData = imageData
              ? (Array.isArray(imageData) ? imageData : [imageData.image1, imageData.image2])
              : (Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
            const images = uploadData.map(item => {
              if (typeof item === 'string') return item;
              return item && (item.image_url || item.url || item.path || item.filename) || '';
            }).filter(img => !!img);

            if (images.length !== this.selectedImages.length) {
              reject(new Error('Upload response did not include all image paths'));
              return;
            }
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
            this.clearSelectedImages();

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

  getDisplayImages(): { label: string, src: string }[] {
    const selectedPreviews = this.imagePreviews.filter(src => !!src).map(src => ({ label: 'New', src }));
    const remainingExistingImages = this.existingImages
      .slice(this.selectedImages.length, this.maxImages)
      .map(src => ({ label: 'Existing', src }));

    return selectedPreviews.concat(remainingExistingImages).slice(0, this.maxImages);
  }

  onReset() {
    this.regConfig.reset();
    this.clearSelectedImages();
  }
}
