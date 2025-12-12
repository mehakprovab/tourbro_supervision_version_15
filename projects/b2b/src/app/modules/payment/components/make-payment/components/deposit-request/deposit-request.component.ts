import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { PaymentService } from '../../../../payment.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

@Component({
    selector: 'app-deposit-request',
    templateUrl: './deposit-request.component.html',
    styleUrls: ['./deposit-request.component.scss']
})
export class DepositRequestComponent implements OnInit, OnDestroy {
    @Output()activateChildTab = new EventEmitter<any>();
    private subSunk = new SubSink();
    regConfig: FormGroup;
    selectRqeType: string;
    noData: boolean = true;
    respData: any;
    requestTypes: Array<any> = [];
    paymentTypes: Array<any> = [];
    currentUser: any = {}

    constructor(
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService
    ) { }

    ngOnInit() {
        console.log(this.util.readStorage('currentUser', sessionStorage));
        this.currentUser = this.util.readStorage('currentUser', sessionStorage);
        this.createForm();
        this.getRequestTypes();
        this.getPaymentModes();
    }

    getRequestTypes() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getRequestTypes', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.requestTypes = resp.data;
            }
        })
    }

    getPaymentModes() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPaymentModes', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.paymentTypes = resp.data;
            }
        })
    }

    activateSubChildTab(tab) {
        console.log("sub",tab);
        this.activateChildTab.emit(tab);        
      }

    onSubmit() {

    }

    onReset() {

    }


    createForm() {
        this.regConfig = this.fb.group({
            agentName: new FormControl(this.currentUser.first_name + ' '+this.currentUser.last_name, [Validators.required]),
            agentId: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            requestType: new FormControl('Choose one', [Validators.required]),
            paymentType: new FormControl('Choose one'),
        })
    }

    onSelect(e) {
        console.log(e);
        this.paymentService.depositRequestData.next(this.regConfig.value);
    }

    ngOnDestroy() { }
}
