import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { AppService } from '../../../app.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SwalService } from '../../../core/services/swal.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
    selector: 'app-default-commissions',
    templateUrl: './default-commissions.component.html',
    styleUrls: ['./default-commissions.component.scss']
})
export class DefaultCommissionsComponent implements OnInit {

    subSunk = new SubSink();
    regConfig: FormGroup;
    regConfigCom: FormGroup;
    agentList: any;
    tabLinks = [
        {
            label: 'Update Default Commission',
            icon: 'fa fa-plane',
            customClass: '',
        }
    ];
    commissions: Array<number> = [
        0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
    ]
    flightData;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private appService: AppService,
        private swalService: SwalService,
        private utilityService:UtilityService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            flightCom: new FormControl('', [Validators.required])
        });
        this.regConfigCom = this.fb.group({
            activityCom: new FormControl('', [Validators.required])
        });
        this.getAgentsList();
        this.getDefaultCommission();
    }

    onSelect() {

    }

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.B2B_AUTH_ROLE_ID })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                }
                else {

                }
            });
    }

    onSubmit() {
        console.log(this.regConfig.value);
        if (this.regConfig.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bCommission', 'post', {}, {}, {
            "module_type": "b2b_flight",
            "value": parseFloat(this.regConfig.value.flightCom),
            "value_type": "percentage",
            "domain_list_fk": 1,
            "commission_currency": this.appService.defaultCurrency,
            "auth_user_id": 0,
            "segment_list": "",
            "flight_airline_id": 0,
            "id": this.flightData[0] ? this.flightData[0].id : 0
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success();
                //  this.regConfig.reset();
            }
        }, err => {
            this.swalService.alert.error(err.error.Message);
        });
    }

    onReset() {
        this.regConfig.reset();
    }

    onSubmitCom() {
        if (this.regConfigCom.invalid)
            return;
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bCommission', 'post', {}, {}, {
            "module_type": "b2b_hotel",
            "value": parseFloat(this.regConfigCom.value.activityCom),
            "value_type": "percentage",
            "domain_list_fk": 1,
            "commission_currency": this.appService.defaultCurrency,
            "auth_user_id": 0,
            "id": this.regConfigCom.value.id
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success();
                //  this.regConfigCom.reset();
            }
        }, err => {
            console.log(err);
            this.swalService.alert.error(err.error.Message);
        });
    }

    getDefaultCommission() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bCommissionList', 'post', {}, {}, {
            module_type: "b2b_flight",
            auth_user_id: 0,
            flight_airline_id: 0
        })
            .subscribe(resp => {
                console.log(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data) {
                    console.log(resp.data);
                    this.flightData = resp.data.filter(x => {
                        return x.module_type == "b2b_flight"
                    });
                    let hotelData = resp.data.filter(x => {
                        return x.module_type == "b2b_hotel"
                    });
                    this.regConfig.patchValue({
                        flightCom: this.flightData[0] && this.flightData[0].value ? this.flightData[0].value : '',
                    }, { emitEvent: false });
                    this.regConfigCom.patchValue({
                        activityCom: hotelData[0] && hotelData[0].value ? hotelData[0].value : '',
                    }, { emitEvent: false })
                }
                else {

                }
            });
    }

    onResetCom() {
        this.regConfigCom.reset();
    }

    numberOnly(event): boolean {
        return this.utilityService.numberOnly(event);
    }

}
