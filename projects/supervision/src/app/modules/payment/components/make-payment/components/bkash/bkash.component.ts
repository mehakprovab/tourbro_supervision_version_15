import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-bkash',
    templateUrl: './bkash.component.html',
    styleUrls: ['./bkash.component.scss']
})
export class BkashComponent implements OnInit {
    @Input('requestType') requestType;
    regConfig: FormGroup
    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.regConfig = this.fb.group({
            bankname: new FormControl('', [Validators.required]),
            branchname: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            onlinetransferid: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            accountnumber: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            amount: new FormControl('', [Validators.required, Validators.maxLength(12)]),
            dateoftransaction: new FormControl('', [Validators.required, Validators.maxLength(40)]),
            remarks: new FormControl('', [Validators.required, Validators.maxLength(120)]),
        })
    }

    onSubmit() {

    }

    onReset() {
        
    }

}
