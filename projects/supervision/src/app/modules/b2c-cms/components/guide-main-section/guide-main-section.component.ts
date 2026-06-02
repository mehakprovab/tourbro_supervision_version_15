
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';


let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-guide-main-section',
  templateUrl: './guide-main-section.component.html',
  styleUrls: ['./guide-main-section.component.scss']
})
export class GuideMainSectionComponent implements OnInit, OnDestroy,AfterViewInit {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();
  private subSunk = new SubSink();

  searchValue = new FormControl("", {});
  fileToUpload: File = null;
  imageSrc;
  regConfig: FormGroup;
  btnName: string = "Add";
  guideImage: string = "";
  editingId: string = "";

  pageSize = 10;
  page = 1;
  collectionSize: number;
  displayColumn = [
    { key: 'id', value: 'Sl No.' },
    { key: 'title', value: 'Title' },
    { key: 'description', value: 'Description' },
    { key: 'image', value: 'Image' },
     { key: 'status', value: 'Publish' }, 
    { key: 'actions', value: 'Actions' }
  ];

  noData: boolean = true;
  respData: Array<any> = [];
  respDataCopy: Array<any> = [];
selectedFileName: string = '';
  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private utility: UtilityService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.createForm();
    this.getGuideSections();
  }
onPublishChange(data: any, event: any) {
  const isChecked = event.target.checked;

  // Convert to 1 / 0
  const status = isChecked ? 1 : 0;

  let payload = {
    id: data.id,
    publishStatus: status
  };

  this.apiHandlerService
    .apiHandler('updateGuideSectionStatus', 'post', {}, {}, payload)
    .subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.swalService.alert.success('Status updated successfully');

          // Update UI instantly
          this.getGuideSections()
        } else {
          this.swalService.alert.error('Failed to update status');
          // revert UI
          data.publishStatus = data.publishStatus === 1 ? 0 : 1;
        }
      },
      error: () => {
        this.swalService.alert.error('Something went wrong');
        // revert UI
        data.status = data.status === 1 ? 0 : 1;
      }
    });
}
  createForm() {
    this.regConfig = this.fb.group({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      status: new FormControl('active')
    });
  }

onFileChange(files: FileList) {
  if (!files || files.length === 0) return;

  const file = files.item(0);
this.selectedFileName = file.name;
  // ✅ File type validation
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    this.swalService.alert.error("Only JPG and PNG images are allowed.");
    this.fileInput.nativeElement.value = '';
    return;
  }

  this.fileToUpload = file;

  // ✅ File size validation
  if (!this.validateFileSize(file.size)) {
    this.fileToUpload = null;
    this.imageSrc = "";
    this.regConfig.controls['image'].reset();
    this.fileInput.nativeElement.value = '';
    return;
  }

  // ✅ Preview
  const reader = new FileReader();
  reader.onload = () => {
    this.imageSrc = reader.result as string;
    this.regConfig.patchValue({ image: this.imageSrc });
  };
  reader.readAsDataURL(file);
}

validateFileSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024; // ✅ 5 MB in bytes

  if (size > maxSize) {
    this.swalService.alert.oops("Maximum upload file size: 5 MB");

    const imgControl = this.regConfig.get('image');
    imgControl.setValidators([Validators.required]);
    imgControl.updateValueAndValidity();

    return false;
  }

  return true;
}

  getGuideSections() {
    this.noData = true;
    this.respData = [];
    this.subSunk.sink = this.apiHandlerService.apiHandler('getGuideSections', 'post', {}, {}, {})
      .subscribe(resp => {
        if ((resp.statusCode === 200 || resp.statusCode === 201) && resp.data) {
          this.noData = false;
          this.respData = resp.data || [];
          this.respDataCopy = [...this.respData];
          this.collectionSize = this.respData.length;
        } else {
          this.noData = false;
          this.respData = [];
        }
      }, () => {
        this.noData = false;
        this.respData = [];
      });
    this.cdr.detectChanges();
  }

  getImage(img) {
    const url = 'http://tourbro.com/node/dist/apps/supervision/';
    return `${url + img}`;
  }



editList(data) {
  this.onReset();
  this.editingId = data.id;
  this.btnName = 'Update';
  this.guideImage = data.image_url || "";

  this.regConfig.patchValue({
    title: data.title || '',
    description: data.description || '',
    id: data.id || '',
    status: data.status || 'active'
  });

  if (data.image_url) {
    const imageControl = this.regConfig.get('image');
    imageControl.clearValidators();
    imageControl.setValue(data.image_url);
    imageControl.updateValueAndValidity();

    this.imageSrc = this.getImage(data.image_url);

    // ✅ Extract & show filename
    this.selectedFileName = data.image_url.split('/').pop();
  }

  window.scroll(0, 0);
}

  onReset() {
    this.btnName = 'Add';
    this.editingId = "";
    this.fileToUpload = null;
    this.imageSrc = "";
    this.guideImage = "";
 this.selectedFileName = '';
    const imageControl = this.regConfig.get('image');
    imageControl.setValidators([Validators.required]);
    imageControl.updateValueAndValidity();

    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.regConfig.reset();
  }

  onSearchSubmit() {
    if (!this.regConfig || this.regConfig.invalid) {
      this.swalService.alert.error("Please fill in all required fields.");
      return;
    }

    const formValues = this.regConfig.value;
    let req = new FormData();
    req.append('title', formValues.title);
    req.append('description', formValues.description);
    req.append('publishStatus', '0');

    if (this.editingId) req.append('id', this.editingId);

    if (this.fileToUpload) {
      req.append('image', this.fileToUpload);
    } else if (this.guideImage && this.editingId) {
      req.append('existing_image', this.guideImage);
    } else {
      this.swalService.alert.warning("Please upload an image.");
      return;
    }

    const apiEndpoint = this.editingId ? 'updateGuideSection' : 'addGuideSection';

    this.subSunk.sink = this.apiHandlerService.apiHandler(apiEndpoint, 'post', {}, {}, req)
      .subscribe({
        next: (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            const message = this.editingId ? "Updated successfully." : "Added successfully.";
            this.swalService.alert.success(message);
            this.onReset();
            this.getGuideSections();
          } else {
            this.swalService.alert.error("Operation failed. Please try again.");
          }
        },
        error: (err) => {
          console.error(err);
          this.swalService.alert.error(`Error: ${err.message || "Unexpected error"}`);
        }
      });
  }

  onDelete(id) {
    this.swalService.alert.delete(willDelete => {
      if (willDelete) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteGuideSection', 'post', {}, {}, { id })
          .subscribe(resp => {
            this.swalService.alert.success("Deleted successfully.");
            this.getGuideSections();
          }, err => {
            this.swalService.alert.oops(err.message);
          });
      }
    });
  }

  ngAfterViewInit() {
    // search or other view init logic
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subSunk.unsubscribe();
  }
}