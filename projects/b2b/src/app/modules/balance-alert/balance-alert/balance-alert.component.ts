import { BalanceAlertService } from '../balance-alert.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../core/services/swal.service';
import { untilDestroyed } from '../../../core/services';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { UtilityService } from '../../../core/services/utility.service';

const log = new Logger('balance-alert/BalanceAlertComponent');


@Component({
    selector: 'app-balance-alert',
    templateUrl: './balance-alert.component.html',
    styleUrls: ['./balance-alert.component.scss']
})
export class BalanceAlertComponent implements OnInit {
    regConfig: FormGroup;
    noData: boolean = true;
    respData: any;

    constructor(
        private balanceAlertService: BalanceAlertService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.getSetBalanceAlert();
        this.createForm();
    }

    getSetBalanceAlert() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'setBalanceAlert';
        this.balanceAlertService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data;
                    this.regConfig.patchValue({
                        threshold_amount: resp.data['threshold_amount'],
                        mobile_number: resp.data['mobile_number'],
                        email_id: resp.data['email_id'],
                        enable_sms_notification: resp.data['enable_sms_notification'] ? true : false,
                        enable_email_notification: resp.data['enable_email_notification'] ? true : false,
                    })
                } else {
                    log.debug('resp', resp);
                }
            })
    }

    onSubmit() {
        if (this.regConfig.invalid)
            return;
        const data = [Object.assign({ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }, this.regConfig.value)];
        data['topic'] = 'updateBalanceAlert';
        log.debug(data);
        this.balanceAlertService.update(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.regConfig.reset();
                    this.swalService.alert.success(resp.msg);
                }
                else
                    this.swalService.alert.oops(resp.msg);
            })
    }

    onReset() {
        this.regConfig.reset();
    }

    createForm() {
        this.regConfig = this.fb.group({
            threshold_amount: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            mobile_number: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            email_id: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.email]),
            enable_sms_notification: new FormControl(false),
            enable_email_notification: new FormControl(false),
        })
    }

    ngOnDestroy() { }
}
