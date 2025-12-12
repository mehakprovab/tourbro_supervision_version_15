import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from '../../../payment.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';

@Component({
    selector: 'app-new-balance-request',
    templateUrl: './new-balance-request.component.html',
    styleUrls: ['./new-balance-request.component.scss']
})
export class NewBalanceRequestComponent implements OnInit, OnDestroy {

    regConfig: FormGroup;
    selectRqeType: string;
    noData: boolean = true;
    respData: any;

    requestTypes: any;

    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        const data = { topic: 'banalanceTransferTypes' }
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.requestTypes = resp.data;
                } else {
                    this.swalService.alert.error(resp.msg || '');
                }
            })

        this.regConfig = this.fb.group({
            requestType: new FormControl('Cash', [Validators.required]),
        });
    }

    onSubmit() {

    }

    ngOnDestroy() { }
}
