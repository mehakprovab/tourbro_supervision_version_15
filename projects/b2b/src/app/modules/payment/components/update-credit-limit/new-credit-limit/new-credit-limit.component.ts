import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PaymentService } from '../../../payment.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { Logger } from '../../../../../core/logger/logger.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('payment/NewCreditLimitComponent');

@Component({
    selector: 'app-new-credit-limit',
    templateUrl: './new-credit-limit.component.html',
    styleUrls: ['./new-credit-limit.component.scss']
})
export class NewCreditLimitComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    currentUser: any = {};

    currency:any;
    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apihandlerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.createForm();
        this.currency = this.utility.readStorage('currentUser', sessionStorage)['currency'] || 'GBP',
        this.currentUser = this.utility.readStorage('currentUser', sessionStorage);
        this.updateForm();
    }

    updateForm(){
        if (!this.utility.isEmpty(this.currentUser)) {
            this.regConfig.patchValue({
                agentName: this.currentUser.first_name + ' ' + this.currentUser.last_name,
                agentId: this.currentUser['uuid'] + '/' + this.currentUser['email'],
                creditdue: this.currentUser['due_amount']
            })
        }
    }

    createForm() {
        this.regConfig = this.fb.group({
            agentName: new FormControl(''),
            agentId: new FormControl(''),
            amount: new FormControl('', [Validators.required, Validators.maxLength(15),Validators.pattern(this.utility.regExp.numbOnly)]),
            creditdue: new FormControl('0',Validators.pattern(this.utility.regExp.numbOnly)),
            remarks: new FormControl('', [Validators.maxLength(300)]),
        })
    }

    onSubmit() {
        if (this.regConfig.invalid)
            return;
        const req = {
            "amount": this.regConfig.value['amount'],
            "remarks": this.regConfig.value['remarks']
        }
        this.subSunk.sink = this.apihandlerService.apiHandler('creditLimitRequestAccountSys', 'post', {}, {}, req)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.regConfig.reset();
                    this.updateForm();
                }
                else
                    this.swalService.alert.oops();
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops();
            });
    }
    onReset() {
        this.regConfig.reset();
        this.updateForm();
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnDestroy() { }
}
