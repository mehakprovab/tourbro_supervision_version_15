import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

const b2b_url = `${environment.B2B_URL}/b2b`
@Component({
    selector: 'app-recharge',
    templateUrl: './recharge.component.html',
    styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit, OnDestroy {
    rechargeForm: FormGroup;
    paymentGateways: any;
    enablePaymentGateway: boolean = false;
    paymentForm: FormGroup;
    submitted: boolean;
    loading:boolean;
    paymentData: any = {};
    loggedInUser: any;

    constructor(
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private utility:UtilityService
    ) {
    }

    ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'))
        this.rechargeForm = this.fb.group({
            amount: new FormControl('', [Validators.required,Validators.maxLength(30)])
        });
        this.createPaymentForm();
        this.getPaymentGateWays();
    }
    
    proceedToConfirm() {
        if(!this.rechargeForm.valid){
            return;
        }
        this.paymentData['amount'] = this.rechargeForm.value.amount; 
        this.enablePaymentGateway = true;
    }

    closePaymentModel() {
        this.enablePaymentGateway = false;
    }

    getPaymentGateWays() {
         let obj = {
            user_id: this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways = res.data;
                }
                else {
                    this.swalService.alert.oops('No payment gateway enabled.');
                }
            }
            else {
                this.swalService.alert.oops('Some thing went wrong');
            }
        }, (err) => {
            if (err && err.err && err.error.msg) {
                this.swalService.alert.oops(err.error.msg);
            }
        });
    }

    paymentConfirm() {
        this.submitted = true;
        this.loading = true;
        let data = this.paymentData;
        if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
            switch (this.paymentForm.value.paymentMethod) {
                case 'nagad':
                    data['paymentType'] = 'nagad';
                    this.nagadPayment(data);
                    break;
                case 'bKash':
                    let srcUrl = `${b2b_url}/paymentGateway/${data.AppReference}?source=reports`
                    window.location.replace(srcUrl);
                    break;
                case 'sslCommerz':
                    data['paymentType'] = 'sslCommerz';
                    this.sslCommerzPayment(data);
                    break;
                default:
                    break;
            }
        }
    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    nagadPayment(data) {
        let date = (new Date().getTime()).toString();
        this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: "Inv002",
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment(data) {
        let date = (new Date().getTime()).toString();
        this.apiHandlerService.apiHandler('instantRecharge', 'post', {}, {}, {
            app_reference: `IR${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            order_id: `IR${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: "Inv002",
            amount: data.amount,
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnDestroy() {
    }

}

