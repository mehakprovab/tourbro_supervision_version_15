import {
    Component, OnDestroy, OnInit, ViewChild,
    ElementRef, ChangeDetectorRef, Renderer2
} from '@angular/core';
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
    selector: 'app-add-or-modify-hotel-widget',
    templateUrl: './add-or-modify-hotel-widget.component.html',
    styleUrls: ['./add-or-modify-hotel-widget.component.scss']
})
export class AddOrModifyHotelWidgetComponent implements OnInit, OnDestroy {

    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    onFileChange(files: FileList) {
        this.hotelImage = "";
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        this.fileToUpload = files.item(0);

        const file = files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
                this.fileToUpload=null;
                this.hotelImage = "";
                this.imageSrc=""
                this.labelImport.nativeElement.value = null;
                this.labelImport.nativeElement.innerText="Upload Image";
                this.regConfig.controls['image'].reset()
                return;
            }
        }
        if (file.name) {
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
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
        { key: 'custom_title', value: 'Custom Title' },
        { key: 'city_name', value: 'City' },
        // { key: 'check_in', value: 'Check-In' },
        // { key: 'check_out', value: 'Check-Out' },
        { key: 'source', value: 'Source' },
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
        this.getTopHotelList();
        this.getCountryList();
    }

    createForm() {
        this.regConfig = this.fb.group({
            country: new FormControl(''),
            city_name: new FormControl('', [Validators.required]),
            check_in: new FormControl(''),
            check_out: new FormControl(''),
            custom_title: new FormControl('', [Validators.required]),
            source: new FormControl('B2C', [Validators.required]),
            image: new FormControl('', [Validators.required]),
            id: new FormControl(''),
            status: new FormControl(''),
        });
    }

    getTopHotelList() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('listHotelTopDestination', 'post', {}, {}, {})
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
        this.segments['city_id'] = location.cityId;
      console.log("segments",location.cityId)
        this.segments['country_code'] = location.countryCode;
        this.regConfig.patchValue({
            city_name: `${location.cityName + ' ' + '(' + location.countryCode + ')'}`
        })
        this.locationsOrigin = [];
        return;
    }

    getAutoCompleteLocations(event, type) {
        let inpValue = event.target.value;
        this.locationsDestination.length = 0;
        this.locationsOrigin.length = 0;
        if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('hotelAutoCity', 'post', {}, {}, {
                city_name: `${inpValue}`,
                userType: "B2C"
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
        return `${baseUrl + '/' + img}`;
    }

    updateStatus(id, status) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelTopDestinationStatus', 'post', {}, {}, { "id": id, "status": status })
            .subscribe(resp => {
                if (resp && resp.Status) {
                    this.swalService.alert.success("Status Updated successfully.");
                    this.getTopHotelList();
                }
            })
    }
    editList(patchData) {
        // this.onReset();
        this.regConfig.patchValue({
            country: patchData['country'] || '',
            city_name: patchData['city_name'] || '',
            check_in: new Date(patchData['check_in']) || null,
            check_out: new Date(patchData['check_out']) || null,
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
        if (this.regConfig.invalid) {
            return;
        }

        let req = this.regConfig.value;
        req['city_id'] = (this.segments['city_id']);
        req['country'] = this.segments['country_code'];
        if (req['id'] && req['id'] > 0) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelTopDestination', 'post', {}, {}, req)
                .subscribe(resp => {
                    if (resp.statusCode == 201 || resp.statusCode == 200) {
                        if (this.fileToUpload) {
                            this.uploadImage(req['id']);
                        }
                        this.swalService.alert.success("Updated successfully.");
                        this.onReset();
                            this.getTopHotelList();
                    }
                })

        } else {
            req['status'] = 1;
            req["image"] = "image";
            req['check_in'] =  null;//formatDate(this.regConfig.value.check_in, 'YYYY-MM-DD');
            req['check_out'] = null;//formatDate(this.regConfig.value.check_out, 'YYYY-MM-DD');
            this.subSunk.sink = this.apiHandlerService.apiHandler('addHotelTopDestination', 'post', {}, {}, req)
                .subscribe(resp => {
                    if (resp && resp.data) {
                        if (this.fileToUpload) {
                            this.uploadImage(resp.data['id']);
                        }
                        this.swalService.alert.success("Added successfully.");
                        this.onReset();
                        setTimeout(() => {
                            this.getTopHotelList();
                        }, 3000);
                    }
                })
        }
    }

    deleteOldImage(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteHotelTopDestination', 'post', {}, {}, { "id": id })
            .subscribe(resp => {
                if (resp && resp.data) {
                    this.swalService.alert.success("Deleted successfully.");
                    this.getTopHotelList();
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
        this.subSunk.unsubscribe();
    }

}
