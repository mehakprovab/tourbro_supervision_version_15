import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { PaymentService } from '../../../../../payment.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const log = new Logger('payment/ChequeDdComponent');

@Component({
    selector: 'app-cash',
    templateUrl: './cash.component.html',
    styleUrls: ['./cash.component.scss']
})
export class CashComponent implements OnInit, OnDestroy {

    @Input('requestType') requestType;
    regConfig: FormGroup;
    bankAccountDetails: any;
    branchName: any;
    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        log.debug(this.requestType);
        this.createForm();
        this.getBankName();
    }

    getBankName() {
        const data = { topic: 'bankAccountDetails' };
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.bankAccountDetails = resp.data;
                } else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    onBankSelect(e) {
        log.debug(e.target.value);
        const data = [{
            bank_account_id: JSON.parse(e.target.value)['id']
        }];
        data['topic'] = 'bankDetails';
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.branchName = resp.data;
                    this.regConfig.patchValue({
                        branchname: resp.data['branchname'],
                        accountnumber: resp.data['accountnumber']
                    })
                } else {
                    this.swalService.alert.oops();
                }
            });
    }

    onSubmit() {
        if (this.regConfig.invalid)
            return;
        /*where from I shall get this agent_id ?*/
        let data = Object.assign({
            transactiontype: this.requestType,
            agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'],
        }, this.regConfig.value);
        data['bankname'] = JSON.parse(data['bankname'])['bankname'];
        data = [data];
        data['topic'] = 'balanceRequest'
        // console.log(data);
        this.paymentService.update(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200){
                    this.swalService.alert.success(resp.msg || '');
                    this.regConfig.reset();    
                }
                else
                    this.swalService.alert.oops(resp.msg || '');
            })
    }

    onReset() {
        this.regConfig.reset();
    }

    createForm() {
        this.regConfig = this.fb.group({
            bankname: new FormControl('', [Validators.required]),
            branchname: new FormControl(this.branchName || '', [Validators.required, Validators.maxLength(120)]),
            accountnumber: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            depositedbranch: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            transactionnumber: new FormControl('', [Validators.maxLength(18)]),
            amount: new FormControl('', [Validators.required, Validators.maxLength(12)]),
            dateoftransaction: new FormControl('', [Validators.required, Validators.maxLength(40)]),
            remarks: new FormControl('', [Validators.required, Validators.maxLength(120)]),
        })
    }

    ngOnDestroy() { }

}
