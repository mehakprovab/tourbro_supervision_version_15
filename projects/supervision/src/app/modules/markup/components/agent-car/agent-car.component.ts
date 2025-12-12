import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { AppService } from '../../../../app.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-agent-car',
  templateUrl: './agent-car.component.html',
  styleUrls: ['./agent-car.component.scss']
})
export class AgentCarComponent implements OnInit, OnDestroy{

    private subSunk = new SubSink();
    regConfig: FormGroup;
    respData: Array<any> = [];
    defaultCurrency: string = 'USD';
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private util: UtilityService,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            "module_type": "b2b_car",
            "type": "generic",
            "user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            "is_deleted": 0
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.respData = resp.data;
                this.regConfig.patchValue({
                    markupType: this.respData[0].value_type,
                    markupValue: this.respData[0].value
                })
            } else {
                this.swalService.alert.oops();
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

        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {},
            {
                "type": "generic",
                "fare_type": "Public",
                "module_type": "b2b_car",
                "flight_airline_id": 0,
                "value": this.regConfig.get('markupValue').value,
                "value_type": this.regConfig.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency,
                "user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            }).subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.regConfig.reset();
                }
            })

    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}