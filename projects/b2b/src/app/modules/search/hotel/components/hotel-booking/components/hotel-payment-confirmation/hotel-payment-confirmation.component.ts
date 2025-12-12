import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../../../environments/environment';
import { HotelService } from '../../../../hotel.service';
import { DialogData } from '../hotel-payment-detail/hotel-payment-detail.component';

const b2b_url = `${environment.B2B_URL}/b2b`
@Component({
    selector: 'app-hotel-payment-confirmation',
    templateUrl: './hotel-payment-confirmation.component.html',
    styleUrls: ['./hotel-payment-confirmation.component.scss']
})

export class HotelPaymentConfirmationComponent implements OnInit, OnDestroy {
    private subSink = new SubSink();
    srcUrl: string = ""

    constructor(private dialogRef: MatDialogRef<HotelPaymentConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private hotelService: HotelService,
        private apiHandlerService: ApiHandlerService) {
        dialogRef.disableClose = false;
    }

    ngOnInit() {
        this.srcUrl = `${b2b_url}/paymentGateway/${this.data.appReference}`
    }

    confirmPayment() {
        if (this.data.paymentType === 'nagad')
            this.nagadPayment();
        if (this.data.paymentType == 'bKash')
            this.srcUrl = `${b2b_url}/paymentGateway/${this.data.appReference}`
        this.dialogRef.updateSize("100vw", "100vw");
    }

    nagadPayment() {
        let invoiceNumber= this.hotelService.setHotelInvoiceNumber(this.data.appReference);
        this.hotelService.loading.next(true);
        let date = (new Date().getTime()).toString();
        this.subSink.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: this.data.appReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: this.data.paymentType,
            merchantInvoiceNumber:invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.hotelService.loading.next(false);
                window.location = resp.data.callBackUrl
            }
        })
    }

    ngOnDestroy() {
        this.subSink.unsubscribe()
    }

}
