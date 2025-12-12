import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog, MatDialogRef } from "@angular/material";

@Component({
    selector: 'app-register-info',
    templateUrl:'./register-info.component.html',
    styleUrls:['./register-info.component.scss']
})

export class RegisterInfoComponent {

    constructor( 
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<RegisterInfoComponent>
    ) {}
    
     closeModal() {
        this.dialog.closeAll();
        this.dialogRef.close();
        this.dialogRef.close();
    }

    onBookNowPrice(id) {
        this.dialogRef.close(id);
    }
}