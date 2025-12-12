import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';

const log = new Logger('master-balance-manager/ProcessTransactionComponent');

@Component({
    selector: 'app-process-transaction',
    templateUrl: './process-transaction.component.html',
    styleUrls: ['./process-transaction.component.scss']
})
export class ProcessTransactionComponent implements OnInit {

    regConf: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private matDialogRef: MatDialogRef<ProcessTransactionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.createForm();
        log.debug(this.data)
    }

    createForm(): void {
        this.regConf = this.formBuilder.group({
            status: new FormControl('', [Validators.required]),
            remarks: new FormControl('')
        })
    }

    save() {
        log.debug(this.regConf.value)
        if(!this.regConf.valid)
            return;
        this.matDialogRef.close(Object.assign(this.data, this.regConf.value));
    }
    
    close() {
        this.matDialogRef.close({});
    }

}
