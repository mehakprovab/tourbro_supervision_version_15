import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { CurrencyConversionService } from './currency-conversion.service';
import { Sort } from '@angular/material';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


const baseUrl = environment.baseUrl;
const log = new Logger('CurrencyConversionComponent');
let filterArray: Array<any> = [];
let currencyConverisonDataCopy: Array<any> = []

@Component({
    selector: 'app-currency-conversion',
    templateUrl: './currency-conversion.component.html',
    styleUrls: ['./currency-conversion.component.scss']
})
export class CurrencyConversionComponent implements OnInit, OnDestroy {

    @ViewChild('theFile', { static: false }) fileUploader: ElementRef;
    logoConfig: FormGroup;
    fileToUpload: File = null;
    imageSrc;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    pageSize = 10;
    page = 1;
    collectionSize;
    noData: boolean = true;
    currencyConverisonData: object[];
    displayColumn: { key: string, value: string }[] = [{ key: 'id', value: 'Sl No.' }, { key: 'currency', value: 'Currency' }, { key: 'currencyLogo', value: 'Logo' }, { key: 'status', value: 'Status' }, { key: 'Conversion Rate', value: 'Conversion Rate' }, { key: 'action', value: 'Action' }];
    status;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private currencyConversionService: CurrencyConversionService,
        private swalService: SwalService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.currencyConverisonResponse();
        this.logoConfig = this.fb.group({
            Banner_img: new FormControl("", [Validators.required]),
        })
    }

    currencyConverisonResponse() {
        this.noData = true;
        this.currencyConverisonData = [];
        this.apiHandlerService.apiHandler('currencyConverison', 'post').subscribe(resp => {
            if (resp['Status'] && resp['data']) {
                this.noData = false;
                this.currencyConverisonData = resp['data'];
                this.collectionSize = this.currencyConverisonData.length;
                currencyConverisonDataCopy = [...this.currencyConverisonData];
            }
            else {
                this.noData = false;
                this.currencyConverisonData = [];
            }
        }, (err) => {
            this.noData = false;
            this.currencyConverisonData = [];
        });
    }

    updateAllCurrency() {
        this.loading = true;
        this.apiHandlerService.apiHandler('UpdateAllCurrencyConversion', 'get').subscribe(resp => {
            if (resp['Status'] && resp['data']) {
                this.loading = false;
                this.currencyConverisonResponse();
                this.swalService.alert.success("Currency updated successfully.");
            }
            else {
                this.loading = false;
                this.currencyConverisonResponse();
                this.swalService.alert.opps("Unable to update");
            }
        }, (err) => {
            this.loading = false;
            this.currencyConverisonResponse();
            this.swalService.alert.opps("Unable to update");
        });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = currencyConverisonDataCopy.slice().filter((objData, index) => {
            // keys that are required to filter.
            let filterKeys = {
                id: objData.id,
                currency: objData.currency
            };
            if (Object.values(filterKeys).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.currencyConverisonData = filterArray;
        else
            this.currencyConverisonData = !filterArray.length && text.length ? filterArray : [...currencyConverisonDataCopy];

    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...currencyConverisonDataCopy];
        if (!sort.active || sort.direction === '') {
            this.currencyConverisonData = data;
            return;
        }
        this.currencyConverisonData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return compare(+a.id, +b.id, isAsc);
                case 'currency': return compare(a.currency, b.currency, isAsc);
                case 'status': return compare(a.status, b.status, isAsc);
                case 'action': return compare(a.action, b.action, isAsc);
                default: return 0;
            }
        });
    }

    onUpdate(doc) {
        doc = {
            "currency_id": doc.id.toString(),
            "value": doc.value.toString(),
            "status": doc.status,
            "currency": doc.currency,
            // "flag" : this.logoConfig.value.Banner_img ? this.logoConfig.value.Banner_img : doc.flag,
        }
        // this.logoConfig.reset();
        this.currencyConversionService.update(doc).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.swalService.alert.success("Data updated successfully.");
                this.currencyConverisonResponse();
            }
            else if (resp.statusCode != 200)
                this.swalService.alert.oops();
        }, (err) => {
            if (err && err.error && err.error && err.error.Message) {
                this.swalService.alert.oops(err.error.Message);
            }
        });
    }

    onUpdateStatus(event, data) {
        if (event && event.checked) {
            data.status = 1;
        }
        else {
            data.status = 0;
        }
    }
    getImage(img) {
        if (img != null) {
            console.log("img", baseUrl + '/sa/common/getImage/' + img)
            return `${baseUrl + '/common/getImage/' + img}`;
        } else {
            return ""
        }
    }

    ngOnDestroy() {
    }

    onFileSelected($event) {
        const file = $event.target.files[0];
        console.log("file", file);
        
        if (file && file.size) {
            let result = this.validateFileSize(file.size);
            if (!result) {
                // Clear file input and reset the logo config if file is invalid
                this.imageSrc = '';
                this.fileUploader.nativeElement.value = null;
                this.logoConfig.reset();
                return;
            }
        }
        
        if (file && file.name) {
            // Set flag for logo update and upload the logo
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ Banner_img: file });
            this.uploadLogo(file, 'banner');
    
            // Use FileReader to preview the image
            const reader = new FileReader();
            reader.onload = (e) => this.imageSrc = reader.result as string;
            reader.readAsDataURL(file);
        } else {
            // No file selected, reset logo config to default (data.flag)
            this.imgObj.isLogoToUpdate = false;
            // this.logoConfig.patchValue({
            //     Banner_img: this.getImage(this.data.flag) // Fix: Correct object syntax
            // });
        }
    }

    
    confirmDelete(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.deleteCurrency(id);
            } 
        })
    }
    
    deleteCurrency(id) {
        this.apiHandlerService.apiHandler('deleteCurrencyConversion', 'POST', {}, {}, { "id": id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Record deleted successfully.");
                    this.currencyConverisonResponse();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops(err.message);
            }
            );
    }
    
    validateFileSize(fileSize) {
        if (fileSize > 1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            const imageControlControl = this.logoConfig.get('Banner_img');
            imageControlControl.setValidators([Validators.required]);
            imageControlControl.updateValueAndValidity();
            return false;
        }
        else {
            return true
        }
    }

    uploadLogo(logo, control) {
        let req = new FormData();
        if (control == 'banner') {
            req.append('imageFile', logo);
        }
    
        this.apiHandlerService.apiHandler('uploadIncludeMasterLogo', 'post', '', '', req).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                if (control == 'banner') {
                    this.logoConfig.setValue({ Banner_img: response.data[0].image_url });
                }
    
            }
            else {
                this.swalService.alert.oops();
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message);
        });
    }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function getData() {
    return [
        {
            Sno: 1,
            Currency: 'AUD',
            Status: true,
            Action: 'Update'
        },
        {
            Sno: 2,
            Currency: 'USD',
            Status: true,
            Action: 'Update'
        },
        {
            Sno: 3,
            Currency: 'BBD',
            Status: true,
            Action: 'Update'
        }
    ]
}
