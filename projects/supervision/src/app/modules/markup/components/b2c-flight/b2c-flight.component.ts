import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-b2c-flight',
    templateUrl: './b2c-flight.component.html',
    styleUrls: ['./b2c-flight.component.scss']
})
export class B2cFlightComponent implements OnInit {
    private subSunk = new SubSink();
    airlineForm: FormGroup;
    generalMarkupForm: FormGroup;
    specificAirlineMarkupForm: FormGroup;
    preferredAirlines: Array<any> = [];
    airlineData: any;
    generalMarkupData: any;
    specificAirlineMarkupData: Array<any> = [];
    submitted = false;
    defaultCurrency: string = 'USD';
    airlineLogoUrl = "https://www.travelsoho.com/antrip_v1/extras/system/library/images/airline_logo/";
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    ShowaddAirline: boolean;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private appService: AppService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        // this.defaultCurrency = this.appService.defaultCurrency;
        // this.createForm();
        // this.ShowAddAirline(1);
        // this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
        //     "name": ""
        // }).subscribe(resp => {
        //     if (resp.statusCode == 201 || resp.statusCode == 200) {
        //         this.preferredAirlines = resp.data;
        //     }
        // });
        // this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
        //     "module_type": "b2c_flight",
        //     "type": "generic",
        //     "is_deleted": 0
        // }).subscribe(resp => {
        //     console.log(resp)
        //     if (resp.statusCode == 200 || resp.statusCode == 201) {
        //         this.airlineData = resp.data[0];
        //         this.generalMarkupForm.patchValue({
        //             markupType: resp.data[0].value_type,
        //             markupValue: resp.data[0].value
        //         })
        //     }
        // });
        // this.getSpecificAirlines();

        // this.formValueChanges();
    }

    getSpecificAirlines() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
            "module_type": "b2c_flight",
            "type": "specific"
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.specificAirlineMarkupData = resp.data;
                let items = this.specificAirlineMarkupForm.get('items') as FormArray;
                for (let val of resp.data) {
                    items.push(this.fb.group({
                        id: new FormControl(val.id),
                        value: new FormControl(val.value, [Validators.required]),
                        value_type: new FormControl(val.value_type, [Validators.required]),
                        markup_currency: new FormControl(this.defaultCurrency),
                        flightAirline: new FormControl(val.flightAirline),
                    }));
                }
            }
        });
    }

    createForm() {
        this.airlineForm = this.fb.group({
            airlines: new FormControl('', [Validators.required]),//1,
            //   markupType: 'plus',
            markupType: new FormControl('plus', [Validators.required]),
            markupValue: new FormControl('', [Validators.required]),//''
        });
        this.generalMarkupForm = this.fb.group({
            // markupType: 'plus',
            // markupValue: ''
            markupType: new FormControl('plus', [Validators.required]),
            markupValue: new FormControl('', [Validators.required]),
        });
        this.specificAirlineMarkupForm = this.fb.group({
            items: new FormArray([])
        });
    }

    onFlightAdd(t) {
        if (this.airlineForm.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {},
            {
                "type": "specific",
                "fare_type": "Public",
                "module_type": "b2c_flight",
                "flight_airline_id": Number(this.airlineForm.get('airlines').value),
                "value": Number(this.airlineForm.get('markupValue').value),
                "value_type": this.airlineForm.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency,
            }).subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.getSpecificAirlines();
                    // this.airlineForm.reset();
                }
            }, (error) => {
                this.swalService.alert.oops(error.error.Message || '');
            });
    }

    onAddGeneralMarkup(t) {
        if (this.generalMarkupForm.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {},
            {
                "type": "generic",
                "fare_type": "Public",
                "module_type": "b2c_flight",
                "flight_airline_id": 0,
                "value": Number(this.generalMarkupForm.get('markupValue').value),
                "value_type": this.generalMarkupForm.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency
            }).subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    // this.airlineForm.reset();
                }
            }, err => {
                this.swalService.alert.oops();
            });
    }

    onAddSpecificAirlineMarkup(t) {
        (this.specificAirlineMarkupForm.get('items')['controls']).forEach((ele, index) => {
            this.onchageInSpecificForm(index);
        })
        if (this.specificAirlineMarkupForm.invalid)
            return;
        let data = [...this.specificAirlineMarkupForm.value.items]
        console.log(this.specificAirlineMarkupForm.value);
        data.forEach(element => {
            delete element.flightAirline;
        });

        this.subSunk.sink = this.apiHandlerService.apiHandler('updateMarkupList', 'post', {}, {}, data)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update();
                } else {
                    this.swalService.alert.oops();
                }
            }, err => {
                this.swalService.alert.oops();
            });
    }

    formValueChanges() {
        const markupValueControl = this.airlineForm.get('markupValue');
        const generalMarkupValueControl = this.generalMarkupForm.get('markupValue');
        const specificMarkupValueControl = this.specificAirlineMarkupForm.get('markupValue');
        const specificMarkupTypeControl = this.specificAirlineMarkupForm.get('markupType');

        this.airlineForm.get('markupType').valueChanges
            .subscribe(markupType => {
                if (markupType == "plus") {
                    markupValueControl.setValidators([Validators.required, Validators.max(100000)]);
                }

                if (markupType == "percentage") {
                    markupValueControl.setValidators([Validators.required, Validators.max(100)]);
                }
                markupValueControl.updateValueAndValidity();
            })

        this.generalMarkupForm.get('markupType').valueChanges
            .subscribe(markupType => {
                if (markupType == "plus") {
                    generalMarkupValueControl.setValidators([Validators.required, Validators.min(0), Validators.max(100000)]);
                }

                if (markupType == "percentage") {
                    generalMarkupValueControl.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                }
                generalMarkupValueControl.updateValueAndValidity();
            })
    }

    onchageInSpecificForm(i) {
        console.log(this.specificAirlineMarkupForm.get('items')['controls']);
        if (this.specificAirlineMarkupForm.get('items')['controls'][i].value.value_type == "plus") {
            (this.specificAirlineMarkupForm.get('items')['controls'][i].controls.value).setValidators([Validators.required, Validators.min(0), Validators.max(100000)]);
        }

        if (this.specificAirlineMarkupForm.get('items')['controls'][i].value.value_type == "percentage") {
            (this.specificAirlineMarkupForm.get('items')['controls'][i].controls.value).setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        }

        (this.specificAirlineMarkupForm.get('items')['controls'][i].controls.value).updateValueAndValidity();
    }

    ShowAddAirline(condition) {
        switch (condition) {
            case 0:
                this.ShowaddAirline = false;
                break;
            case 1:
                this.ShowaddAirline = true;
                break;
        }
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    userData: any;
    triggerTab(data: any) {
        if (data.data) {
            this.userData = data.data;
            this.tabs.select(data.tabId);
        }
    }
}