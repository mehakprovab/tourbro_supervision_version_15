import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
@Component({
    selector: 'app-brandfare-modal',
    templateUrl: './brandfare-modal.component.html',
    styleUrls: ['./brandfare-modal.component.scss']
})

export class BrandFareModalComponent implements OnInit {
    brandListData: any;
    constructor( @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
 public dialogRef: MatDialogRef<BrandFareModalComponent>,){}

    ngOnInit() {
        console.log(this.data.data)
        this.brandListData = this.data.data
    }

    closeModal() {
        this.dialog.closeAll();
        this.dialogRef.close();
    }

    onBookNowPrice(id) {
        this.dialogRef.close(id);
    }

}