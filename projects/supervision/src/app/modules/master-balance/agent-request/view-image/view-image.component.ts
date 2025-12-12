import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BalanceUpdateRequestComponent } from '../balance-update-request/balance-update-request.component';

@Component({
    selector: 'app-view-image',
    templateUrl: './view-image.component.html',
    styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit {
    profile_logo = "assets/images/profile_logo.png";
    imageUrl: any;
    isImageUrlEmpty: boolean = false;
    constructor(public diloagRef: MatDialogRef<BalanceUpdateRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) { }

    ngOnInit() {
        this.setImageURl();
    }

    setImageURl() {
        if (!this.data || this.data.includes('undefined')) {
            this.isImageUrlEmpty = true;
        }
        else {
            this.imageUrl = this.data;
        }
    }

    hide() {
        this.diloagRef.close()
    }
}
