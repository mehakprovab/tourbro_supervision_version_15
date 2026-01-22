import {
  Component, OnDestroy, OnInit, ViewChild,
  ElementRef, ChangeDetectorRef, Renderer2, AfterViewInit
} from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material';
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
  selector: 'app-add-or-modify-meditation-retreat',
  templateUrl: './add-or-modify-meditation-retreat.component.html',
  styleUrls: ['./add-or-modify-meditation-retreat.component.scss']
})
export class AddOrModifyMeditationRetreatComponent implements OnInit, OnDestroy,AfterViewInit {

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
      { key: 'action', value: 'Action' },
      { key: 'retreat_name', value: 'Retreat Name' },
      { key: 'duration', value: 'duration' },
      { key: 'description', value: 'Description' },
      { key: 'image', value: 'Image' },
       { key: 'actions', value: 'Actions' }
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  segments: {} = {};
  lastKeyupTstamp: number = 0;
  btnName: string = "Add";
  meditationImage: string = "";
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
      this.getMeditationRetreatList();
      
  }

  createForm() {
    this.regConfig = this.fb.group({
        id: new FormControl(''),
       retreat_name: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  getMeditationRetreatList() {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('getMeditationRetreat', 'post', {}, {}, {})
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
                this.getMeditationRetreatList();
            } else {
                this.searchValueData(searchTerm);
            }
        });
  }

  searchValueData(searchTerm: string): void {
    this.noData = true;
    this.respData = [];
    
    this.subSunk.sink = this.apiHandlerService.apiHandler('searchMeditationRetreat', 'post', {}, {}, { search: searchTerm })
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
      this.meditationImage = centerData.image_url  || "";
      
      this.regConfig.patchValue({
              retreat_name: centerData.retreat_name,
      duration: centerData.duration,
      description: centerData.description,
          id: centerData.id || '',
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

  deleteList(id) {
      this.swalService.alert.delete(willDelete => {
          if (willDelete) {
              this.deleteMeditationRetreat(id);
          } else {
              console.log("Not delete")
          }
      })
  }

onReset() {
  this.btnName = 'Add';
  this.editingId = '';
  this.fileToUpload = null;
  this.imageSrc = '';
  this.meditationImage = '';

  // Reset form with defaults
  this.regConfig.reset({
    id: '',
    retreat_name: '',
    duration: '',
    description: '',
    image: ''
  });

  // Reset image validator
      const imageControl = this.regConfig.get('image');
      imageControl.setValidators([Validators.required]);
      imageControl.updateValueAndValidity();
if (this.fileInput) {
  this.fileInput.nativeElement.value = '';
}
  this.regConfig.reset();
  // Reset file input DOM element
//   if (this.labelImport?.nativeElement) {
//     this.labelImport.nativeElement.value = null;
//     this.labelImport.nativeElement.innerText = 'Upload Image';
//   }

  // Force UI refresh
  this.cdr.detectChanges();
}


  onSearchSubmit() {
  if (this.regConfig.invalid) {
      this.swalService.alert.error('Please fill all required fields');
      return;
    }

    const form = this.regConfig.value;
    const req = new FormData();

    req.append('retreat_name', form.retreat_name);
    req.append('duration', form.duration);
    req.append('description', form.description);

    if (this.editingId) req.append('id', this.editingId);

    if (this.fileToUpload) {
      req.append('image', this.fileToUpload);
    } else if (this.meditationImage && this.editingId) {
      req.append('existing_image', this.meditationImage);
    } else {
      this.swalService.alert.warning('Please upload image');
      return;
    }

        const apiEndpoint = this.editingId ? 'updateMeditationRetreat' : 'addMeditationRetreat';
        
        this.subSunk.sink = this.apiHandlerService.apiHandler(apiEndpoint, 'post', {}, {}, req)
            .subscribe({
                next: (resp) => {
                    if (resp.statusCode === 201 || resp.statusCode === 200) {
                        const message = this.editingId ? "Updated successfully." : "Added successfully.";
                        this.swalService.alert.success(message);
                        this.onReset();
                        this.getMeditationRetreatList();
                    } else {
                        this.swalService.alert.error("Operation failed. Please try again.");
                    }
                },
                error: (error) => {
                    console.error("API Upload Error:", error);
                    this.swalService.alert.error(`Error: ${error.message || "An unexpected error occurred. Please try again."}`);
                }
            });

   
  }

  deleteMeditationRetreat(id) {
      this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMeditationRetreat', 'post', {}, {}, { "id": id })
          .subscribe(resp => {
              if (resp && resp.data) {
                  this.swalService.alert.success("Deleted successfully.");
                  this.getMeditationRetreatList();
              }
          }, (err) => {
              this.swalService.alert.oops(err.message);
          });
  }

  uploadImage(id) {
      let reqBody = new FormData();
      reqBody.append('image', this.fileToUpload);
      reqBody.append('id', id);
      this.apiHandlerService.apiHandler('uploadMeditationImage', 'post', {}, {}, reqBody)
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

  const isAsc = sort.direction === 'asc';

  this.respData = data.sort((a, b) => {
    switch (sort.active) {

      case 'retreat_name': {
        const nameA = a.retreat_name ? a.retreat_name.toLowerCase() : '';
        const nameB = b.retreat_name ? b.retreat_name.toLowerCase() : '';
        return this.utility.compare(nameA, nameB, isAsc);
      }

      case 'duration': {
        const durA = a.duration ? a.duration.toLowerCase() : '';
        const durB = b.duration ? b.duration.toLowerCase() : '';
        return this.utility.compare(durA, durB, isAsc);
      }

      case 'description': {
        const descA = a.description ? a.description.toLowerCase() : '';
        const descB = b.description ? b.description.toLowerCase() : '';
        return this.utility.compare(descA, descB, isAsc);
      }

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