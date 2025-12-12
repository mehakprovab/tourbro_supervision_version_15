import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('hotel Type/AddUpdateHotelTypeComponent');
@Component({
    selector: 'app-add-update-tax',
    templateUrl: './add-update-tax.component.html',
    styleUrls: ['./add-update-tax.component.scss']
})
export class AddUpdateTaxComponent implements OnInit {

    checked: boolean;
    hotelTypeForm: FormGroup;
    submitted: boolean = false;
    noData: boolean;
    hotelType: any;
    @Input() hotelOneData;
    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelTypeOne: object = {};
    currencyList: any;
    selectedTaxType: string = 'plus';

    constructor(
        private fb: FormBuilder,
        private api: ApiHandlerService,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        this.getCurrencyList();
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                this.patchHotelType();
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.hotelTypeForm = this.fb.group({
            paidTax: [true],
            payUponArrival: [false],
            tax: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(80)]),
            tax_value: new FormControl({ value: '0', disabled: false }, [Validators.maxLength(80)]), // Initially disabled
            tax_type: new FormControl('percent', [Validators.required]),
            arrival_tax_type: new FormControl('plus', [Validators.required]),
            arrival_tax_value: new FormControl({ value: '0', disabled: true }, [Validators.maxLength(80)]), // Initially disabled
            description: new FormControl({ value: '', disabled: true }),
            currency: new FormControl({ value: '', disabled: true }),
            status: new FormControl(true),
        });

        this.toggleFieldValidation();
    }

    toggleFieldValidation() {
        // Handle Pay Upon Arrival logic
        this.hotelTypeForm.get('payUponArrival').valueChanges.subscribe(value => {
            const description = this.hotelTypeForm.get('description');
            const currency = this.hotelTypeForm.get('currency');
            const arrival_tax_value = this.hotelTypeForm.get('arrival_tax_value');
    
            if (value) {
                description.setValidators([Validators.required]);
                currency.setValidators([Validators.required]);
                arrival_tax_value.setValidators([Validators.required]);
    
                description.enable();
                currency.enable();
                arrival_tax_value.enable();
            } else {
                description.clearValidators();
                currency.clearValidators();
                arrival_tax_value.clearValidators();
    
                description.setValue('');
                arrival_tax_value.setValue('0');
    
                description.disable();
                currency.disable();
                arrival_tax_value.disable();
            }
    
            description.updateValueAndValidity();
            currency.updateValueAndValidity();
            arrival_tax_value.updateValueAndValidity();
        });
    
        // Handle Paid Tax logic
        this.hotelTypeForm.get('paidTax').valueChanges.subscribe(value => {
            const tax = this.hotelTypeForm.get('tax');
            const tax_value = this.hotelTypeForm.get('tax_value');
    
            if (value) {
                tax.enable();
                tax.setValidators([Validators.required]);
                tax_value.enable();
                tax_value.setValidators([Validators.required, Validators.maxLength(80)]);
            } else {
                tax.clearValidators();
                tax.setValue('');
                tax.disable();
    
                tax_value.clearValidators();
                tax_value.setValue('0'); // Set to '0' when disabled
                tax_value.disable();
            }
    
            tax.updateValueAndValidity();
            tax_value.updateValueAndValidity();
        });
    }
    

    get f() { return this.hotelTypeForm.controls; }

    getCurrencyList() {
        const data = [{}]
        data['topic'] = 'hotelCurrencyConverison';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.Status && resp.data) {
                this.currencyList = resp.data.filter(t => t.status == 1);
            }
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
        })
    }


    patchHotelType(): void {
        this.hotelTypeForm.patchValue({
            tax: this.hotelTypeOne['tax'] || '',
            tax_value: this.hotelTypeOne['tax_value'] || 0,
            tax_type: this.hotelTypeOne['tax_type'] || 'percent',
            description: this.hotelTypeOne['description'] || 0,
            arrival_tax_value: this.hotelTypeOne['arrival_tax_value'] || 0,
            arrival_tax_type: this.hotelTypeOne['arrival_tax_type'] || 'plus',
            currency: this.hotelTypeOne['currency'] || '',
            status: this.hotelTypeOne['status'] == "1" ? true : false,
        });
    }


    resetForm() {
        this.hotelTypeOne = {};
        this.hotelTypeForm.reset({
            paidTax: true,  // Set to false to match default behavior
            payUponArrival: false, // Ensure fields are disabled on reset
            tax: '',
            tax_value: '', // Reset properly (avoid 0 if it was a string field)
            tax_type: 'percent',
            arrival_tax_type: 'plus',
            arrival_tax_value: '',
            description: '',
            currency: '',
            status: true,
        });

        // Ensure disabled fields are properly cleared
        this.hotelTypeForm.get('tax_value').disable();
        this.hotelTypeForm.get('arrival_tax_value').disable();
        this.hotelTypeForm.get('description').disable();
        this.hotelTypeForm.get('currency').disable();

        // Reset validations
        this.hotelTypeForm.markAsPristine();
        this.hotelTypeForm.markAsUntouched();
    }

    handleValidSubmit() {
        this.submitted = true;
        // Check if both paidTax and payUponArrival are false
        if (!this.hotelTypeForm.get('paidTax').value && !this.hotelTypeForm.get('payUponArrival').value) {
            this.swalService.alert.oops('Please enable tax before submitting.');
            return;
        }
        if (this.hotelTypeForm.invalid) {
            return;
        }

        let data = { ...this.hotelTypeForm.getRawValue() }; // Get all values, including disabled ones

        // Convert status to "1" or "0"
        data.status = data.status ? "1" : "0";

        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                data['id'] = this.hotelTypeOne['id'];
                data['hotel_code'] = this.hotelOneData.hotel_code;
                data = [data];
                delete data[0].paidTax;
                delete data[0].payUponArrival;
                data['topic'] = 'updateTax';
            } else {
                data['hotel_code'] = this.hotelOneData.hotel_code;
                data = [data];
                delete data[0].paidTax;
                delete data[0].payUponArrival;
                data['topic'] = 'addTax';
            }
        } catch (error) {
            log.debug(error);
        }

        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.swalService.alert.success('Your data added successfully!');
                    this.someEvent.next({ tabId: 'list_hotel_types', hotel_type: '' });
                    this.resetForm(); // Properly reset after submission
                } else {
                    this.swalService.alert.oops(resp.msg);
                }
            }, err => {
                this.swalService.alert.oops("Tax already exists");
            });
    }

}


