import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HotelCrsService } from '../../../../hotel-crs/hotel-crs.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
const log = new Logger('Wellness tax component');
@Component({
    selector: 'app-wellness-tax',
    templateUrl: './wellness-tax.component.html',
    styleUrls: ['./wellness-tax.component.scss']
})
export class WellnessTaxComponent implements OnInit {
    loading = false
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    @Input() wellnessOne: any;
    hotelTypeForm!: FormGroup;
    public submitted: boolean = false;
    public currencyList: any;
    public wellnessTaxList: any;
    public editTax: any;

    @ViewChild('tabs', { static: true }) public tabs: NgbNav;
    activeIdString = 'list_wellness_tax';

    constructor(
        private fb: FormBuilder,
        private wellnessCrsService: WellnessCrsService,
        private utilityService: UtilityService,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService
    ) { }

    ngOnInit() {
        this.createForm();
        this.getCurrencyList();
        this.getWellnessTaxList();
    }
    onTabSelected(event: any) {
        this.activeIdString = event.nextId;
    }

    get f() { return this.hotelTypeForm.controls; }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
    }
    createForm(): void {
        this.hotelTypeForm = this.fb.group({
            paidTax: [true],
            payUponArrival: [false],
            tax_name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(80)]),
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

    resetForm() {

        this.wellnessOne = {};
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
            if (!this.utilityService.isEmpty(this.editTax)) {
                data['id'] = this.editTax['id'];
                data['center_code'] = this.wellnessOne.center_code;
                data = [data];
                delete data[0].paidTax;
                delete data[0].payUponArrival;
                data['topic'] = 'updateTaxMaster';
            } else {
                data['center_code'] = this.wellnessOne.center_code;
                data = [data];
                delete data[0].paidTax;
                delete data[0].payUponArrival;
                data['topic'] = 'addWellnessTax';
            }
        } catch (error) {
            log.debug(error);
        }

        log.debug('data', data);

        this.wellnessCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success('Your data added successfully!');
                    // this.someEvent.next({ tabId: 'list_hotel_types', hotel_type: '' });
                    this.resetForm(); // Properly reset after submission
                } else {
                    this.swalService.alert.oops(resp.msg);
                }
            }, err => {
                this.swalService.alert.oops("Tax already exists");
            });
    }

    getWellnessTaxList() {
        const data = [{ center_code: this.wellnessOne.center_code }];
        data["topic"] = "taxMasterList";
        this.wellnessCrsService.fetch(data).subscribe((res) => {
            if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                this.wellnessTaxList = res.data || [];
            }
        }, (err) => {
            console.error(err);
        });
    }

    updatePackageTax(wellness) {
        this.editTax = wellness;
    }

    deletePackageTax(id) {
        this.swalService.alert.delete((action) => {
            if (action) {
                const data = [{ id: id }];
                data["topic"] = "deleteTaxMaster";
                this.wellnessCrsService.fetch(data).subscribe(
                    (response) => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                            this.swalService.alert.success(
                                `Tax has been deleted successfully`,
                            );
                            this.getWellnessTaxList();
                        }
                    },
                    (err: HttpErrorResponse) => {
                        this.swalService.alert.error(err["error"]["Message"]);
                    },
                );
            }
        });
    }
}
