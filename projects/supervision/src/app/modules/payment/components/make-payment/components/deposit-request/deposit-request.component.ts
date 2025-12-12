import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../../../../core/services/swal.service';
import { PaymentService } from '../../../../payment.service';

@Component({
    selector: 'app-deposit-request',
    templateUrl: './deposit-request.component.html',
    styleUrls: ['./deposit-request.component.scss']
})
export class DepositRequestComponent implements OnInit, OnDestroy {

    regConfig: FormGroup;
    selectRqeType: string;
    noData: boolean = true;
    respData: any;
    requestTypes: any;
    paymentType: Array<any> = [
        {
            "key": "nagad",
            "value": "Nagad"
        },
        {
            "key": "bkash",
            "value": "Bkash"
        }
    ]

    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private swalService: SwalService,
    ) {
    }

    ngOnInit() {
        this.createForm();
        const data = { topic: 'banalanceTransferTypes' }
        this.paymentService.fetch(data)
            // .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.requestTypes = resp.data;
                } else {
                    this.swalService.alert.error(resp.msg || '');
                }
            })
    }

    onSubmit() {

    }

    onReset() {

    }
    
    createForm() {
        this.regConfig = this.fb.group({
            agentName: new FormControl('', [Validators.required]),
            agentId: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            requestType: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            paymentType: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        })
    }

    onSelect(e) {
        console.log(e);
    }

    ngOnDestroy() { }
}
