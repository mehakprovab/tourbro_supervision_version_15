import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-baggage-alert',
  templateUrl: './baggage-alert.component.html',
  styleUrls: ['./baggage-alert.component.scss']
})
export class BaggageAlertComponent implements OnInit {

    regConf: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private matDialogRef: MatDialogRef<BaggageAlertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
    }

    save() {
        this.matDialogRef.close(Object.assign(this.data, {isProtected: true}));
    }
    
    close() {
        this.matDialogRef.close({});
    }
}
