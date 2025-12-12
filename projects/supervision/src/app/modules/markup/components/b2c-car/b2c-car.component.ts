import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../../../core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from 'projects/supervision/src/app/app.service';

@Component({
    selector: 'app-b2c-car',
    templateUrl: './b2c-car.component.html',
    styleUrls: ['./b2c-car.component.scss']
})
export class B2cCarComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    respData: Array<any> = [];
    defaultCurrency: string = "USD"
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
            "module_type": "b2c_car",
            "type": "generic",
            "is_deleted": 0
        }).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data.length) {
                this.respData = resp.data;
                this.regConfig.patchValue({
                    markupType: this.respData[0].value_type,
                    markupValue: this.respData[0].value
                })
            } else {
                console.error('An Error has occured')
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops();
        });
    }

    createForm() {
        this.regConfig = this.fb.group({
            markupType: ['', Validators.required],
            markupValue: ['', Validators.required]
        });
    }

    onSubmit(val) {
        if (this.regConfig.invalid)
            return;

        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {},
            {
                "type": "generic",
                "fare_type": "Public",
                "module_type": "b2c_car",
                "flight_airline_id": 0,
                "value": this.regConfig.get('markupValue').value,
                "value_type": this.regConfig.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency,
            }).subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.regConfig.reset();
                }
            }, err => {
                this.swalService.alert.oops();
            })

    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
