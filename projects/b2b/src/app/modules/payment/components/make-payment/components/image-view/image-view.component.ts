import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HistoryDepositRequestComponent } from '../history-deposit-request/history-deposit-request.component';

@Component({
    selector: 'app-image-view',
    templateUrl: './image-view.component.html',
    styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
    profile_logo = "assets/images/login-images/assets/profile_logo.png";
    imageUrl:any;
    isImageUrlEmpty:boolean=false
    constructor(public diloagRef: MatDialogRef<HistoryDepositRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.setImageURl();
    }
    
    setImageURl(){
        if (!this.data || this.data.includes('undefined')) {
            this.isImageUrlEmpty = true;
        }
        else {
            this.imageUrl = this.data;
        }
    }

    hide(){
        this.diloagRef.close()
    }

}
