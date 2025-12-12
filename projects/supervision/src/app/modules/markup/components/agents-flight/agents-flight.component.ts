import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Logger } from '../../../../core/logger/logger.service';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AppService } from '../../../../app.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-agents-flight',
    templateUrl: './agents-flight.component.html',
    styleUrls: ['./agents-flight.component.scss']
})
export class AgentsFlightComponent implements OnInit {
    protected subSunk = new SubSink();
    markuplist: any;
    airlineForm: FormGroup;
    generalMarkupForm: FormGroup;
    specificAirlineMarkupForm: FormGroup;
    items: FormArray;

    airlines: Array<any> = [];
    specificAirlineValue: string = '';;
    respData: any;
    preferredAirlines: Array<any> = []

    ShowaddAirline: boolean;
    airlineMarkupData = []
    submitted: boolean;
    defaultCurrency: string = "USD";
    airlineLogoUrl = "https://Booking 247.com/airline_logo/";

    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor(
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private util: UtilityService,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
            "name": ""
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.preferredAirlines = resp.data;
            }
        });
        this.ShowAddAirline(1);
        this.getSpecificAirlineList();
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            "module_type": "b2b_flight",
            "type": "generic",
            "is_deleted": 0,
            "user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id
        }).subscribe(resp => {
            console.log(resp)
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                if (resp.data && resp.data.length > 0) {
                    this.airlineForm.patchValue({
                        airlines: resp.data[0].id,
                        markupType: resp.data[0].value_type,
                        markupValue: resp.data[0].value
                    });
                    this.generalMarkupForm.patchValue({
                        markupType: resp.data[0].value_type,
                        markupValue: resp.data[0].value
                    })
                }
            }
        });
        this.formValueChanges();

    }

    getSpecificAirlineList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            "module_type": "b2b_flight",
            "type": "specific",
            "is_deleted": 0,
            "user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id
        }).subscribe(resp => {
            console.log(resp)
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.airlines = resp.data;
                this.onChangeTickets(this.airlines.length);
                // this.airlineData = resp.data[0];

            }
        });
    }

    createForm() {
        this.airlineForm = this.fb.group({
            airlines: ['', Validators.required],
            markupType: ['', Validators.required],
            markupValue: ['', Validators.required]
        });
        this.generalMarkupForm = this.fb.group({
            markupType: ['', Validators.required],
            markupValue: ['', Validators.required]
        });
        this.specificAirlineMarkupForm = this.fb.group({
            numberOfItems: [],
            items: new FormArray([])
        });
    }

    onAddGeneralMarkup(data) {
        if (this.generalMarkupForm.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {},
            {
                "type": "supplier",
                "fare_type": "Public",
                "module_type": "b2b_flight",
                "flight_airline_id": 0,
                "value": this.generalMarkupForm.get('markupValue').value,
                "value_type": this.generalMarkupForm.get('markupType').value,
                "domain_list_fk": 0,
                "markup_currency": "GBP",
                "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id
            }).subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.airlineForm.reset();
                }
            });
    }

    onAddSpecificAirlineMarkup(formData) {
        (this.specificAirlineMarkupForm.get('items')['controls']).forEach((ele, index) => {
            this.onchageInSpecificForm(index);
        })
        this.submitted = true;
        if (this.specificAirlineMarkupForm.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateMarkupList', 'post', {}, {},
            formData.items).subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.getSpecificAirlineList();
                }
            });
    }

    // convenience getters for easy access to form fields
    get f() { return this.specificAirlineMarkupForm.controls; }
    get t() { return this.f.items as FormArray; }

    onChangeTickets(e) {
        console.log("change", this.airlines);

        const numberOfItems = e;
        if (this.t.length < numberOfItems) {
            for (let i = this.t.length; i < numberOfItems; i++) {
                this.t.push(this.fb.group({
                    id: [''],
                    value_type: ['', Validators.required],
                    value: ['', [Validators.required]],
                    markup_currency: ['']
                }));
                const controlArray = <FormArray>this.specificAirlineMarkupForm.get('items');
                controlArray.controls[i].get('id').setValue(this.airlines[i].id);
                controlArray.controls[i].get('value_type').setValue(this.airlines[i].value_type);
                controlArray.controls[i].get('value').setValue(this.airlines[i].value);
                controlArray.controls[i].get('markup_currency').setValue(this.airlines[i].markup_currency);
            }
        } else {
            for (let i = this.t.length; i >= numberOfItems; i--) {
                this.t.removeAt(i);
            }
        }
    }

    onFlightAdd(flightData) {
        this.submitted = true;
        if (this.airlineForm.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {},
            {
                "type": "supplier",
                "fare_type": "Public",
                "module_type": "b2b_flight",
                "flight_airline_id": parseInt(this.airlineForm.get('airlines').value),
                "value": this.airlineForm.get('markupValue').value,
                "value_type": this.airlineForm.get('markupType').value,
                "domain_list_fk": 0,
                "markup_currency": "GBP",
                "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            }).subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.getSpecificAirlineList();
                    // this.airlineForm.reset();
                }
            }, (error) => {
                console.log(error)
                if (error.status == 403) {
                    this.swalService.alert.oops("Markup is already exists for this airline!");
                }
            });
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

    formValueChanges() {
        const markupValueControl = this.airlineForm.get('markupValue');
        const generalMarkupValueControl = this.generalMarkupForm.get('markupValue');

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
    userData: any;
    triggerTab(data: any) {
        if (data.data) {
            this.userData = data.data;
            this.tabs.select(data.tabId);
        }
    }
} 