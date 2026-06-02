import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';

const baseUrl = environment.baseUrl;
const log = new Logger('report/B2cHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-add-or-modify-flight-widget',
    templateUrl: './add-or-modify-flight-widget.component.html',
    styleUrls: ['./add-or-modify-flight-widget.component.scss']
})
export class AddOrModifyFlightWidgetComponent implements OnInit, OnDestroy {

    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    from_airport_city_name: any;
    to_airport_city_name: any;
    onFileChange(files: FileList) {
        this.flightImage = "";
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        this.fileToUpload = files.item(0);
        const file = files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
                this.fileToUpload=null;
                this.flightImage = "";
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
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'image', value: 'Image' },
        // { key: 'widget_title', value: 'Widget Title' },
        { key: 'airlines', value: 'Airline Name(Code)' },
        { key: 'from_airport_name', value: 'From' },
        { key: 'to_airport_name', value: 'To' },
        // { key: 'class', value: 'Airline Class' },
        { key: 'fare', value: 'Fare' },
        { key: 'travel_date', value: 'Travel Date' },
        { key: 'return_date', value: 'Return Date' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    cabinClassLists: Array<any> = [];
    segments: {} = {};
    locationsOrigin: Array<any> = [];
    locationsDestination: Array<any> = [];
    lastKeyupTstamp: number = 0;
    btnName: string = "Add";
    flightImage: string = "";
    minDate;
    fromErrorMsg = "";
    toErrorMsg = "";
    searchedAirLineList: Array<any> = Array();
    airlineErrorMsg="";

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private cdr: ChangeDetectorRef,
        private router: Router) {
        this.minDate = new Date()
    }

    ngOnInit() {
        this.createForm();
        this.getAirportList();
        this.getCabinClassList();
    }

    createForm() {
        this.regConfig = this.fb.group({
            from_airport_name: new FormControl('', [Validators.required]),
            to_airport_name: new FormControl('', [Validators.required]),
            airlines: new FormControl('', [Validators.required]),
            class: new FormControl(''),
            travel_date: new FormControl('', [Validators.required]),
            return_date: new FormControl('', [Validators.required]),
            widget_title: new FormControl(''),
            trip_type: new FormControl('oneWay', [Validators.required]),
            source: new FormControl('B2C', [Validators.required]),
            image: new FormControl('', [Validators.required]),
            fare: new FormControl('', [Validators.required]),
            id: new FormControl(''),
        });
    }

    getAirportList() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('listFlightTopDestination', 'post', {}, {}, {})
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

    getCabinClassList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('cabinClass', 'post', {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.cabinClassLists = resp.data;
                }
            })
    }

    selectedOrigin(location) {
        this.segments['origin'] = location.AirportCode;
        this.from_airport_city_name = location.AirportCity;
        this.fromErrorMsg = "";
        this.regConfig.patchValue({
            from_airport_name: `${location.AirportCity + ', ' + location.AirportName + ' ' + '(' + location.AirportCode + '), ' + location.CountryName}`
        })
        this.locationsOrigin = [];
        return;
    }

    selectedDest(location) {
        this.segments['destination'] = location.AirportCode;
        this.to_airport_city_name = location.AirportCity;
        this.toErrorMsg = "";
        this.regConfig.patchValue({
            to_airport_name: `${location.AirportCity + ', ' + location.AirportName + ' ' + '(' + location.AirportCode + '), ' + location.CountryName}`
        })
        this.locationsDestination = [];
        return;
    }

    getAutoCompleteLocations(event, type) {
        let inpValue = event.target.value;
        this.locationsDestination.length = 0;
        this.locationsOrigin.length = 0;
        if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('flightAutocomplete', 'post', {}, {}, {
                text: `${inpValue}`
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    if (type == 'from') {
                        this.locationsOrigin = resp.data || [];
                    } else if (type == 'to') {
                        this.locationsDestination = resp.data || [];
                    }
                } else {
                    log.error('Something went wrong')
                }
                this.cdr.detectChanges();
            }, err => { log.error(err) });
            this.lastKeyupTstamp = event.timeStamp;
        }
    }


    getAirportLocation(location) {
        return location.AirportName + ' ' + location.AirportCity + '(' + location.AirportCode + '), ' + location.CountryName;
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
                case 'widget_title': return this.utility.compare('' + a.widget_title.toLocaleLowerCase(), '' + b.widget_title.toLocaleLowerCase(), isAsc);
                case 'airlines': return this.utility.compare('' + a.airlines.toLocaleLowerCase(), '' + b.airlines.toLocaleLowerCase(), isAsc);
                case 'from_airport_name': return this.utility.compare('' + a.from_airport_name.toLocaleLowerCase(), '' + b.from_airport_name.toLocaleLowerCase(), isAsc);
                case 'to_airport_name': return this.utility.compare('' + a.to_airport_name.toLocaleLowerCase(), '' + b.to_airport_name.toLocaleLowerCase(), isAsc);
                case 'class': return this.utility.compare('' + a.class.toLocaleLowerCase(), '' + b.class.toLocaleLowerCase(), isAsc);
                case 'travel_date': return this.utility.compare('' + a.travel_date, '' + b.travel_date, isAsc);
                case 'return_date': return this.utility.compare('' + a.return_date, '' + b.return_date, isAsc);
                default: return 0;
            }
        });
    }

    getImage(img) {
        return `${baseUrl + '/' + img}`;
    }

    updateStatus(id, status) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateFlightTopDestinationStatus', 'post', {}, {}, { "id": id, "status": status })
            .subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    this.swalService.alert.success("Updated successfully.");
                    this.getAirportList();
                }
            }, (err) => {
                this.swalService.alert.oops(err.message);
            });
    }

    editList(patchData) {
        this.onReset();
        let airline= patchData['airlines'].split('-');
        let airlineName=airline[0];
        this.regConfig.patchValue({
            from_airport_name: patchData['from_airport_name'] || '',
            to_airport_name: patchData['to_airport_name'] || '',
            airlines: airlineName || '',
            class: patchData['class'] || '',
            travel_date: new Date(patchData['travel_date']) || '',
            return_date: new Date(patchData['return_date']) || '',
            widget_title: patchData['widget_title'] || '',
            trip_type: patchData['trip_type'] || '',
            source: patchData['source'] || '',
            // image: patchData['image'] || '',
            id: patchData['id'] || '',
            fare: Number(patchData['fare']) || '',
        });
        this.regConfig.controls['source'].disable();
        this.flightImage = patchData['image'];
        this.segments['origin']=patchData['from_airport_code'];
        this.segments['destination']=patchData['to_airport_code'];
        this.segments['airline_code']=airline[1];
        this.imageSrc = "";
        this.from_airport_city_name = patchData['from_airport_city_name'];
        this.to_airport_city_name = patchData['to_airport_city_name'];
        const imageControlControl = this.regConfig.get('image');
        if (patchData['image'] && patchData['image'] != "") {
            imageControlControl.setValidators(null);
            imageControlControl.updateValueAndValidity();
        }

        this.btnName = 'Update';
        window.scroll(0, 0);
    }

    deleteList(id) {
        //if(confirm("Are you sue you want to delete?"))
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
        this.flightImage = "";
        this.segments['origin'] = "";
        this.segments['destination'] = "";
        this.segments['airline_code'] = "";
        this.regConfig.reset();
        this.airlineErrorMsg="";
        this.regConfig.patchValue({
            class:'',
            source:''
        })
        this.labelImport.nativeElement.innerText="Upload Image";
        const imageControlControl = this.regConfig.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();
        this.regConfig.controls['source'].enable();
    }

    onSearchSubmit() {

        if (this.btnName == "Add" && (!this.segments['origin']) && this.regConfig.value.from_airport_name) {
            this.fromErrorMsg = "Please select valid airport from list";
            return;
        }

        if (this.btnName == "Add" && (!this.segments['destination']) && this.regConfig.value.to_airport_name) {
            this.toErrorMsg = "Please select valid airport from list";
            return;
        }
        if ( (!this.segments['airline_code']) || this.segments['airline_code']=="") {
            this.airlineErrorMsg = "Please select valid airline from list";
            return;
        }
        if (this.regConfig.invalid) {
            return;
        }
        if (this.fromErrorMsg && this.toErrorMsg) {
            return;
        }

        let req = this.regConfig.value;
        this.selectedAirlineName(req);
        req['from_airport_code'] = this.segments['origin'];
        req['to_airport_code'] = this.segments['destination'];
        req['from_airport_city_name'] = this.from_airport_city_name;
        req['to_airport_city_name'] = this.to_airport_city_name;
        req['image'] = this.flightImage;
        req['status'] = 0;
        if (req['id'] && req['id'] > 0) {
            this.updateFlightTopDestination(req);
        } else {
            this.addFlightTopDestination(req);
        }
    }

    selectedAirlineName(req) {
        if (req.airlines && this.segments['airline_code']) {
            req.airlines = req.airlines + '-' + this.segments['airline_code'];
        }
    }

    updateFlightTopDestination(req){
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateFlightTopDestination', 'post', {}, {}, req)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        if (this.fileToUpload) {
                            this.uploadImage(req['id']);
                        }
                        this.swalService.alert.success("Updated successfully.");
                        this.onReset();
                            this.getAirportList();
                    }
                }, (err) => {
                    this.swalService.alert.oops(err.message);
                });

    }

    addFlightTopDestination(req){
        this.subSunk.sink = this.apiHandlerService.apiHandler('addFlightTopDestination', 'post', {}, {}, req)
        .subscribe(resp => {
            if (resp && resp.data) {
                if (this.fileToUpload) {
                    this.uploadImage(resp.data['id']);
                }
                this.swalService.alert.success("Added successfully.");
                this.onReset();
                setTimeout(() => {
                    this.getAirportList();
                }, 3000);
            }
        }, (err) => {
            this.swalService.alert.oops(err.message);
        });
    }
    deleteOldImage(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteFlightTopDestinationImage', 'post', {}, {}, { "id": id })
            .subscribe(resp => {
                if (resp && resp.data) {
                    this.swalService.alert.success("Deleted successfully.");
                    this.getAirportList();
                }
            }, (err) => {
                this.swalService.alert.oops(err.message);
            });
    }

    uploadImage(id) {
        let reqBody = new FormData();
        reqBody.append('image', this.fileToUpload);
        reqBody.append('id', id);
        this.apiHandlerService.apiHandler('uploadFlightTopDestinationImage', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if (resp) {
                    // this.swalService.alert.success('Updated successfully! ..!');          
                }
            })
    }

    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }

    reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
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
            return true
        }
    }

    getPrefferedAirlineList(event: any): void {
        if (event && event.target.value) {
            const name = `${event.target.value}`;
            this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', { name })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.data && resp.data.length>0) {
                        this.searchedAirLineList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.segments['airline_code']="";
                        this.searchedAirLineList.length = 0;
                    }
                });
        }
        else{
            this.searchedAirLineList.length = 0;
            this.segments['airline_code']="";
        }
    }
    
    selectedAirline(airlines) {
        this.segments['airline_code'] = airlines.code;
        this.airlineErrorMsg="";
        this.regConfig.patchValue({
            airlines: `${airlines.name}`
        })
        this.searchedAirLineList=[];
        this.searchedAirLineList.length = 0;
        return;
    }

    getAirline(getAirline) {
        return getAirline.name;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
