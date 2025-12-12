import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PaymentService } from '../../../payment.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const log = new Logger('payment/NewCreditLimitComponent');

@Component({
    selector: 'app-new-credit-limit',
    templateUrl: './new-credit-limit.component.html',
    styleUrls: ['./new-credit-limit.component.scss']
})
export class NewCreditLimitComponent implements OnInit, OnDestroy {

    regConfig: FormGroup;

    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.regConfig = this.fb.group({
            agentName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
            agentId: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            amount: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            creditdue: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            remarks: new FormControl('', [Validators.maxLength(120)]),
        })
    }

    onSubmit() {
        if (this.regConfig.invalid)
            return;
        const data = [Object.assign({
            agent_id: this.utility.readStorage('currentSupervisionUser', sessionStorage)['user_id']
        }, this.regConfig.value)];
        data['topic'] = 'creditLimitRequest';
        log.debug(data);
        this.paymentService.update(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.swalService.alert.success(resp.msg);
                    this.regConfig.reset();
                }
                else
                    this.swalService.alert.oops(resp.msg);
            })
    }
    onReset() {
        this.regConfig.reset();
    }

    ngOnDestroy() { }
}
