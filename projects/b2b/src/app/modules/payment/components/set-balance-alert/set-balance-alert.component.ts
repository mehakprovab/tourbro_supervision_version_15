import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { SubSink } from 'subsink';
import { PaymentService } from '../../payment.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Logger } from '../../../../core/logger/logger.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('AcountSystem/SetBalanceAlertComponent');

@Component({
    selector: 'app-set-balance-alert',
    templateUrl: './set-balance-alert.component.html',
    styleUrls: ['./set-balance-alert.component.scss']
})
export class SetBalanceAlertComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    regConfig: FormGroup;
    respData: any;
    noData: boolean = true;
    submited: boolean = false;
    staticPhoneCode = [
        {
            name: 'India',
            code: '+91'
        }
    ]
    currency:any;
    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utilityService: UtilityService
    ) { }

    ngOnInit() {
        this.currency = this.utilityService.readStorage('currentUser', sessionStorage)['currency'] || 'GBP',
        this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'post', {}, {}, {}).subscribe(res => {
            this.staticPhoneCode = res.data;
            console.log(this.staticPhoneCode);
        });
        this.createForm();
        this.getSetBalanceAlertAccountSys();
    }

    getSetBalanceAlertAccountSys() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('setBalanceAlertAccountSys', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data;
                this.regConfig.patchValue({
                    threshold_amount: this.respData.threshold_amount,
                    phone_code: this.respData.phone_code,
                    mobile_number: this.respData.mobile_number,
                   // email_id: this.respData.email_id,
                    enable_sms_notification: this.respData.enable_sms_notification ? true : false,
                    enable_email_notification: this.respData.enable_email_notification ? true : false
                }, { emitEvent: false });
            } else {
                this.noData = true;
                this.swalService.alert.error(resp.msg || '');
            }
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submited || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
      }

    updateSetAlert() {
        this.submited = true;
        console.log(this.regConfig)
        if (!this.regConfig.invalid) {
            this.regConfig.patchValue({
                enable_sms_notification: this.regConfig.value.enable_sms_notification ? true : false,
                enable_email_notification: this.regConfig.value.enable_email_notification ? true : false,
            }, { emitEvent: false })
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateBalanceAlertAccountSys', 'post', {}, {}, this.regConfig.value).subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success('Balance Updated Successfully');
                } else {
                    log.debug('Somethings Went Wrong');
                    this.swalService.alert.oops('Opps! Somethings Went Wrong. Pease retry later.');
                }
            }, (err: HttpErrorResponse) => {
                log.debug(err);
                this.swalService.alert.oops('Opps! Somethings Went Wrong. Pease retry later.');
            })
        } else {
            return;
        }
    }

    createForm() {
        this.regConfig = this.fb.group({
            email_id: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
            threshold_amount: new FormControl('select', [Validators.required, Validators.maxLength(20)]),
            mobile_number: new FormControl('',),
            enable_sms_notification: new FormControl(0, ),
            enable_email_notification: new FormControl(0, [Validators.required]),
            phone_code: new FormControl("", )
        })
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    onSelect(e) {

    }

}


function getSetAlertData() {
    return {
        "data": {
            "threshold_amount": 1000,
            "mobile_number": "",
            "email_id": "",
            "enable_sms_notification": 1,
            "enable_email_notification": 0
        },
        "statusCode": 201,
        "Message": "",
        "Status": true
    }
}