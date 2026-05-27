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
  selector: 'app-add-or-modify-holiday-widget',
  templateUrl: './add-or-modify-holiday-widget.component.html',
  styleUrls: ['./add-or-modify-holiday-widget.component.scss']
})
export class AddOrModifyHolidayWidgetComponent implements OnInit, OnDestroy,AfterViewInit {

  @ViewChild('labelImport', { static: false })
  private destroy$ = new Subject<void>();
  labelImport: ElementRef;
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
            this.regConfig.patchValue({ image: this.imageSrc }); // Patch form with image
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
      { key: 'status', value: 'Status' },
      { key: 'custom_title', value: 'Group Name' },
      { key: 'tour_type', value: 'Tour Type' },
      { key: 'dest_count', value: 'Destination Count' },
      // { key: 'check_out', value: 'Check-Out' },
      // { key: 'source', value: 'Source' },
      { key: 'image', value: 'Image' }
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  countryList: Array<any> = [];
  segments: {} = {};
  locationsOrigin: Array<any> = [];
  locationsDestination: Array<any> = [];
  lastKeyupTstamp: number = 0;
  btnName: string = "Add";
  hotelImage: string = "";

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
      this.getTopHolidayList();
      this.getCountryList();
  }

  createForm() {
    this.regConfig = this.fb.group({
        destination_count: new FormControl('', [Validators.required]),
        group_id: new FormControl(''),
        group_name: new FormControl('', [Validators.required]),
        id: new FormControl(''),
        image: new FormControl('', [Validators.required]),
        status: new FormControl(''),
        tour_type_name: new FormControl('', [Validators.required])
    });
}


  getTopHolidayList() {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('tourType', 'post', {}, {}, {"Name":""})
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

  getCountryList() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'post', {}, {})
          .subscribe(resp => {
              if (resp.statusCode == 200 && resp.data) {
                  this.countryList = resp.data;
              }
          })
  }

  selectedOrigin(location) {
      this.segments['origin'] = location.AirportCode;
      this.regConfig.patchValue({
          from_airport_name: `${location.AirportName + ' ' + '(' + location.AirportCode + '), ' + location.CountryName}`
      })
      this.locationsOrigin = [];
      return;
  }

  selectedCity(location) {
    if (!location) return;

    this.regConfig.patchValue({
        destination_count: location.destination_count || '',
        group_id: location.group_id || '',
        group_name: location.group_name || '',
        id: location.id || '',
        status: location.status || '',
        tour_type_name: location.tour_type_name || '',
        image: location.image ? this.getImage(location.image) : '' // Ensure image is patched
    });

    this.locationsOrigin = [];
    this.cdr.detectChanges();
}



  getAutoCompleteLocations(event, type) {
      let inpValue = event.target.value;
      this.locationsDestination.length = 0;
      this.locationsOrigin.length = 0;
      if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
          this.subSunk.sink = this.apiHandlerService.apiHandler('tourType', 'post', {}, {}, {
              Name: `${inpValue}`,
              // userType: "B2C"
          }).subscribe(resp => {
              if (resp.statusCode == 201 || resp.statusCode == 200) {
                  this.locationsOrigin = resp.data || [];
              } else {
                  log.error('Something went wrong')
              }
              this.cdr.detectChanges();
          }, err => { log.error(err) });
          this.lastKeyupTstamp = event.timeStamp;
      }
  }

  ngAfterViewInit() {
       
    this.fetchSearchData();
   
 }

 
 getSearchHolidayList(data) {
  this.noData=true;
  this.respData=[];
  this.subSunk.sink = this.apiHandlerService.apiHandler('tourType', 'post', {}, {}, {"Name":""})
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

searchValueData(searchTerm: string): void {
    this.noData = true;
    this.respData = [];
    
    let reqBody = { "Name": searchTerm };

    this.subSunk.sink = this.apiHandlerService.apiHandler('tourType', 'post', {}, {}, reqBody)
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



fetchSearchData() {
  this.searchValue.valueChanges
      .pipe(
          debounceTime(800),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
      )
      .subscribe(value => {
          const searchTerm = value.trim();
          if (!searchTerm) {
              this.pageSize = 10;
              this.getTopHolidayList();
          } else {
              this.searchValueData(searchTerm);
          }
      });
}



  getCityDropDownName(location) {
      return `${location.cityName + ' ' + '(' + location.countryCode + ')'}`;
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
              case 'custom_title': return this.utility.compare('' + a.custom_title.toLocaleLowerCase(), '' + b.custom_title.toLocaleLowerCase(), isAsc);
              case 'country': return this.utility.compare('' + a.country.toLocaleLowerCase(), '' + b.country.toLocaleLowerCase(), isAsc);
              case 'city_name': return this.utility.compare('' + a.city_name.toLocaleLowerCase(), '' + b.city_name.toLocaleLowerCase(), isAsc);
              case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
              case 'check_in': return this.utility.compare('' + a.check_in, '' + b.check_in, isAsc);
              case 'check_out': return this.utility.compare('' + a.check_out, '' + b.check_out, isAsc);
              default: return 0;
          }
      });
  }

  getImage(img) {
      return `${baseUrl + '/tour/tours/getTourTypeImage/' + img}`;
  }

  updateStatus(id, status) {
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourTypeStatus', 'post', {}, {}, { "id": id, "status": status })
          .subscribe(resp => {
              if (resp && resp.data) {
                  this.swalService.alert.success("Status Updated successfully.");
                  this.getTopHolidayList();
              }
          })
  }
  editList(patchData) {
      // this.onReset();
      this.regConfig.patchValue({
          country: patchData['country'] || '',
          city_name: patchData['city_name'] || '',
          check_in: new Date(patchData['check_in']) || '',
          check_out: new Date(patchData['check_out']) || '',
          custom_title: patchData['custom_title'] || '',
          source: patchData['source'] || '',
          //image: patchData['image'] || '',
          id: patchData['id'] || '',
          status: patchData['status'] || '',
      });
      this.segments['city_id']=patchData.city_id;
      this.segments['country_code']=patchData.city_name;
      this.hotelImage = patchData['image'];
      this.labelImport.nativeElement.innerText = ((patchData['image']).split("/")[2]).toString();
      this.regConfig.controls['source'].disable();
      const imageControlControl = this.regConfig.get('image');
      if (patchData['image'] && patchData['image'] != "") {
          imageControlControl.setValidators(null);
          imageControlControl.updateValueAndValidity();
      }

      this.imageSrc = "";
      this.btnName = 'Update';
      window.scroll(0, 0);
  }

  deleteList(id) {
      this.swalService.alert.delete(willDelete => {
          if (willDelete) {
              this.deleteOldImage(id);
          } else {
              console.log("Not delete")
          }
      })
  }

  onReset() {
      this.btnName = 'Add';
      this.fileToUpload = null;
      this.imageSrc = "";
      this.hotelImage = "";
      this.regConfig.reset();
      this.regConfig.patchValue({
          source:''
      })
      const imageControlControl = this.regConfig.get('image');
      imageControlControl.setValidators([Validators.required]);
      imageControlControl.updateValueAndValidity();
      this.regConfig.controls['source'].enable();

  }

  onSearchSubmit() {
    if (!this.regConfig || this.regConfig.invalid) {
        this.swalService.alert.error("Please fill in all required fields.");
        return;
    }

    try {
        let req = new FormData();

        // Ensure form values exist before appending
        const id = this.regConfig.get('id').value || '';
        const destinationCount = this.regConfig.get('destination_count').value || '';
        const status = this.regConfig.get('status').value || '';

        req.append('Id', id);
        req.append('destination_count', destinationCount);
        req.append('status', status);

        // Append image if available
        if (this.fileToUpload) {
            req.append('image', this.fileToUpload);
        } else {
            this.swalService.alert.warning("No image selected. Please upload an image.");
            return;
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('uploadTourTypeImage', 'post', {}, {}, req)
            .subscribe({
                next: (resp) => {
                    if (resp.statusCode === 201 || resp.statusCode === 200) {
                        this.swalService.alert.success("Tour uploaded successfully.");
                        // this.onReset();
                        this.regConfig.reset();
                        this.getTopHolidayList();
                    } else {
                        this.swalService.alert.error("Upload failed. Please try again.");
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



  deleteOldImage(id) {
      this.subSunk.sink = this.apiHandlerService.apiHandler('deleteHotelTopDestination', 'post', {}, {}, { "id": id })
          .subscribe(resp => {
              if (resp && resp.data) {
                  this.swalService.alert.success("Deleted successfully.");
                  this.getTopHolidayList();
              }
          }, (err) => {
              this.swalService.alert.oops(err.message);
          });
  }

  uploadImage(id) {
      let reqBody = new FormData();
      reqBody.append('image', this.fileToUpload);
      reqBody.append('id', id);
      this.apiHandlerService.apiHandler('uploadHotelTopDestinationImage', 'post', {}, {}, reqBody)
          .subscribe(resp => {
              if (resp) {
                  // this.swalService.alert.success('Updated successfully! ..!');          
              }
          })
  }

  validateFileSize(fileSize) {
      if (fileSize >1048576) {
          this.swalService.alert.oops("Maximum upload file size: 1 MB");
          const imageControlControl = this.regConfig.get('image');
          imageControlControl.setValidators([Validators.required]);
          imageControlControl.updateValueAndValidity();
          return false;
      }
      else {
          return true;
      }
  }
  omitSpecialCharacters(event) {
      let k = event.charCode;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
  }


  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();
      this.subSunk.unsubscribe();
  }

}
