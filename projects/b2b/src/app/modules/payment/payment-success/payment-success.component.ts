import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SwalService } from '../../../core/services/swal.service';

@Component({
    selector: 'app-payment-success',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
    app_reference: "";
    order_id: "";
    updateWalletResponse:any[];
    message:string="";
    constructor(
        private activatedRoute: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (queryParams) {
                this.app_reference = (queryParams['AppReference']).replace("/", "");
                this.order_id = queryParams['orderId'] ? (queryParams['orderId']).replace("/", "") : "";
                if(this.app_reference && this.order_id) {
                    this.updateWallet();
                }
            }
        });
    }

    updateWallet() {
        let request={
            "app_reference": this.app_reference,
            "order_id": this.order_id
        }
        this.apiHandlerService.apiHandler('updateWallet', 'POST', '', '', request).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.updateWalletResponse=res.data;
                    this.message="Your transaction has been successfully done."
                    this.cdr.checkNoChanges();
                }
            }
            else {
                this.updateWalletResponse=[];
                this.message=res.Message;
                this.cdr.checkNoChanges();
            }
        }, (err) => {
            if (err && err.error && err.error.Message) {
                this.updateWalletResponse=[];
                this.message=err.error.Message;
                this.cdr.checkNoChanges();
            }
        });
    }
}
