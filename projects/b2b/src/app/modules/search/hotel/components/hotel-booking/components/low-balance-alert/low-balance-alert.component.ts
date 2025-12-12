import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HotelGuestDetailsComponent } from '../hotel-guest-details/hotel-guest-details.component';

@Component({
    selector: 'low-app-balance-alert',
    templateUrl: './low-balance-alert.component.html',
    styleUrls: ['./low-balance-alert.component.scss']
})
export class LowBalanceAlertComponent implements OnInit {

    constructor(
        public diloagRef: MatDialogRef<HotelGuestDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {
    }

    onClose() {
        this.diloagRef.close();
    }
}
