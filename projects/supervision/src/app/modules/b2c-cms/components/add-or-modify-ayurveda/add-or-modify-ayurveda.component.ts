import {
  Component, OnDestroy, OnInit, ViewChild,
  ElementRef, ChangeDetectorRef, Renderer2, AfterViewInit
} from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import {  ExportAsService } from 'ngx-export-as';
import { environment } from '../../../../../environments/environment';


const baseUrl = environment.baseUrl;
const log = new Logger('b2c-cms/AddOrModifyHotelWidgetComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-add-or-modify-ayurveda',
  templateUrl: './add-or-modify-ayurveda.component.html',
  styleUrls: ['./add-or-modify-ayurveda.component.scss']
})
export class AddOrModifyAyurvedaComponent implements OnInit, OnDestroy,AfterViewInit {

@ViewChild('labelImport', { static: false })
labelImport!: ElementRef;
@ViewChild('fileInput', { static: false })
fileInput!: ElementRef<HTMLInputElement>;

private destroy$ = new Subject<void>();

  searchValue = new FormControl("", {});
  onFileChange(files: FileList) {
    if (!files || files.length === 0) return;

    this.fileToUpload = files.item(0);
    const file = this.fileToUpload;

    if (file && file.size) {
        let isValidSize = this.validateFileSize(file.size);
        if (!isValidSize) {
            this.fileToUpload = null;
            this.imageSrc = "";
            this.regConfig.controls['image'].reset();
            this.labelImport.nativeElement.value = null;
            this.labelImport.nativeElement.innerText = "Upload Image";
            return;
        }
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageSrc = reader.result as string;
            this.regConfig.patchValue({ image: this.imageSrc });
        };
        reader.readAsDataURL(file);
    }
}

  private subSunk = new SubSink();
  fileToUpload: File = null;
  imageSrc;
  regConfig: FormGroup;
  isOpen = false as boolean;
  minDate = new Date();
  bsDateConf = {
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-blue',
      showWeekNumbers: false
  };

  pageSize = 10;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'center_name', value: 'Center Name' },
      { key: 'location', value: 'Location' },
      { key: 'short_description', value: 'Description' },
      { key: 'image', value: 'Image' },
       { key: 'actions', value: 'Actions' }
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  countryList: Array<any> = [];
  segments: {} = {};
  locationsOrigin: Array<any> = [];
  locationsDestination: Array<any> = [];
  lastKeyupTstamp: number = 0;
  btnName: string = "Add";
  ayurvedaImage: string = "";
  editingId: string = "";

  constructor(
      private apiHandlerService: ApiHandlerService,
      private fb: FormBuilder,
      private swalService: SwalService,
      private exportAsService: ExportAsService,
      private utility: UtilityService,
      private cdr: ChangeDetectorRef,
      private router: Router,
      private renderer: Renderer2) { }

  ngOnInit() {
      this.createForm();
      this.getAyurvedaCentersList();
    
  }

  createForm() {
    this.regConfig = this.fb.group({
        id: new FormControl(''),
        center_name: new FormControl('', [Validators.required]),
        location: new FormControl('', [Validators.required]),
        short_description: new FormControl('', [Validators.required]),
        image: new FormControl('', [Validators.required]),
        status: new FormControl('active')
    });
  }

  getAyurvedaCentersList() {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('getAyurvedaCenters', 'post', {}, {}, {})
          .subscribe(resp => {
              if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                  this.noData = false;
                  this.respData = resp.data || [];
                  respDataCopy = [...this.respData];
                  this.collectionSize = respDataCopy.length;
              }
              else {
                  this.noData = false;
                  this.respData=[];
              }
          }, (err) => {
              this.noData = false;
              this.respData = [];
          });
      this.cdr.detectChanges();
  }


  ngAfterViewInit() {
    this.fetchSearchData();
  }

  fetchSearchData() {
    this.searchValue.valueChanges
        .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        takeUntil(this.destroy$)  // Now this should work
      )
        .subscribe(value => {
            const searchTerm = value.trim();
            if (!searchTerm) {
                this.pageSize = 10;
                this.getAyurvedaCentersList();
            } else {
                this.searchValueData(searchTerm);
            }
        });
  }

  searchValueData(searchTerm: string): void {
    this.noData = true;
    this.respData = [];
    
    this.subSunk.sink = this.apiHandlerService.apiHandler('searchAyurvedaCenters', 'post', {}, {}, { search: searchTerm })
        .subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.noData = !(resp.data.length > 0);
                this.respData = resp.data || [];
                this.collectionSize = this.respData.length;
            } else {
                this.noData = true;
                this.respData = [];
            }
            this.cdr.detectChanges();
        }, () => {
            this.noData = true;
            this.respData = [];
            this.cdr.detectChanges();
        });
  }

  getImage(img) {
    let url='http://54.92.243.81/tourbro/node/dist/apps/supervision/'
      return `${url+img}`;
  }

  editList(centerData) {
      this.onReset();
      this.editingId = centerData.id;
      this.btnName = 'Update';
      this.ayurvedaImage = centerData.image_url  || "";
      
      this.regConfig.patchValue({
          center_name: centerData.center_name || '',
          location: centerData.location || '',
          short_description: centerData.short_description || '',
          id: centerData.id || '',
          status: centerData.status || 'active',
      });
      
     if (centerData.image_url) {
    const imageControl = this.regConfig.get('image');
    imageControl.clearValidators();
    imageControl.setValue(centerData.image_url);
    imageControl.updateValueAndValidity();

    this.imageSrc = this.getImage(centerData.image_url);
  }

      if (this.labelImport && this.labelImport.nativeElement) {
          this.labelImport.nativeElement.innerText = centerData.image || "Upload Image";
      }
      
      window.scroll(0, 0);
  }

  onDelete(id) {
      this.swalService.alert.delete(willDelete => {
          if (willDelete) {
              this.deleteAyurvedaCenter(id);
          } else {
              console.log("Not delete")
          }
      })
  }

  onReset() {
      this.btnName = 'Add';
      this.editingId = "";
      this.fileToUpload = null;
      this.imageSrc = "";
      this.ayurvedaImage = "";
    
  
      const imageControl = this.regConfig.get('image');
      imageControl.setValidators([Validators.required]);
      imageControl.updateValueAndValidity();
      if (this.fileInput) {
  this.fileInput.nativeElement.value = '';
}
  this.regConfig.reset();
  }

  onSearchSubmit() {
    if (!this.regConfig || this.regConfig.invalid) {
        this.swalService.alert.error("Please fill in all required fields.");
        return;
    }

    try {
        let req = new FormData();
        const formValues = this.regConfig.value;

        req.append('center_name', formValues.center_name);
        req.append('location', formValues.location);
        req.append('short_description', formValues.short_description);
        req.append('status', formValues.status);

        if (this.editingId) {
            req.append('id', this.editingId);
        }

        if (this.fileToUpload) {
            req.append('image', this.fileToUpload);
        } else if (this.ayurvedaImage && this.editingId) {
            req.append('existing_image', this.ayurvedaImage);
        } else {
            this.swalService.alert.warning("Please upload an image.");
            return;
        }

        const apiEndpoint = this.editingId ? 'updateAyurvedaCenter' : 'addAyurvedaCenter';
        
        this.subSunk.sink = this.apiHandlerService.apiHandler(apiEndpoint, 'post', {}, {}, req)
            .subscribe({
                next: (resp) => {
                    if (resp.statusCode === 201 || resp.statusCode === 200) {
                        const message = this.editingId ? "Updated successfully." : "Added successfully.";
                        this.swalService.alert.success(message);
                        this.onReset();
                        this.getAyurvedaCentersList();
                    } else {
                        this.swalService.alert.error("Operation failed. Please try again.");
                    }
                },
                error: (error) => {
                    console.error("API Upload Error:", error);
                    this.swalService.alert.error(`Error: ${error.message || "An unexpected error occurred. Please try again."}`);
                }
            });

    } catch (error) {
        console.error("Unexpected Error:", error);
        this.swalService.alert.error("Something went wrong. Please refresh the page and try again.");
    }
  }

  deleteAyurvedaCenter(id) {
      this.subSunk.sink = this.apiHandlerService.apiHandler('deleteAyurvedaCenter', 'post', {}, {}, { "id": id })
          .subscribe(resp => {
              if (resp && resp.data) {
                  this.swalService.alert.success("Deleted successfully.");
                  this.getAyurvedaCentersList();
              }
          }, (err) => {
              this.swalService.alert.oops(err.message);
          });
  }

  uploadImage(id) {
      let reqBody = new FormData();
      reqBody.append('image', this.fileToUpload);
      reqBody.append('id', id);
      this.apiHandlerService.apiHandler('uploadAyurvedaCenterImage', 'post', {}, {}, reqBody)
          .subscribe(resp => {
              if (resp) {
                  // Success handling
              }
          })
  }

  validateFileSize(fileSize) {
      if (fileSize > 1048576) {
          this.swalService.alert.oops("Maximum upload file size: 1 MB");
          const imageControl = this.regConfig.get('image');
          imageControl.setValidators([Validators.required]);
          imageControl.updateValueAndValidity();
          return false;
      }
      else {
          return true;
      }
  }

  sortData(sort: Sort) {
      const data = filterArray.length ? filterArray : [...respDataCopy];
      if (!sort.active || sort.direction === '') {
          this.respData = data;
          return;
      }
      
      this.respData = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
              case 'center_name': 
                  const nameA = a.center_name ? a.center_name.toLowerCase() : '';
                  const nameB = b.center_name ? b.center_name.toLowerCase() : '';
                  return this.utility.compare(nameA, nameB, isAsc);
              case 'location': 
                  const locA = a.location ? a.location.toLowerCase() : '';
                  const locB = b.location ? b.location.toLowerCase() : '';
                  return this.utility.compare(locA, locB, isAsc);
              case 'status': 
                  return this.utility.compare(a.status || '', b.status || '', isAsc);
              default: 
                  return 0;
          }
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.subSunk.unsubscribe();
  }
}