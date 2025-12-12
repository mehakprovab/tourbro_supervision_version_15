import { Component, OnInit, Inject } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { AppService } from 'projects/supervision/src/app/app.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';


const log = new Logger('MasterBalanceManager/ProcessTransactionBalanceComponent')

@Component({
    selector: 'app-process-transaction-balance',
    templateUrl: './process-transaction-balance.component.html',
    styleUrls: ['./process-transaction-balance.component.scss']
})
export class ProcessTransactionBalanceComponent implements OnInit {
    regConf: FormGroup;
    defaultCurrency: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private matDialogRef: MatDialogRef<ProcessTransactionBalanceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private util: UtilityService,
        private appService: AppService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.regConf.patchValue({
            status: this.data['transaction_status']
        });
        let currentUser = this.util.readStorage('currentSupervisionUser', sessionStorage);
        this.data['processedby'] = currentUser['first_name'] + ' ' + currentUser['last_name'];
    }

    createForm(): void {
        this.regConf = this.formBuilder.group({
            status: new FormControl('', [Validators.required]),
            remarks: new FormControl('',[Validators.required]),
            amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')])
        })
    }

    save() {
        log.debug(this.regConf.value)
        if (!this.regConf.valid)
            return;
         console.log(this.data);
         console.log(this.regConf.value);
       this.matDialogRef.close(Object.assign(this.data, this.regConf.value));
    }

    close() {
        this.matDialogRef.close({});
    }

    validateAmount() {
  const amountControl = this.regConf.get('amount');
  const enteredAmount = amountControl.value;
  
  // Check if empty
  if (!enteredAmount || enteredAmount === '') {
    amountControl.setErrors(null);
    return;
  }
  
  // Convert to number
  const numAmount = Number(enteredAmount);
  
  // Validate: only numbers and not higher than data.amount
  if (isNaN(numAmount)) {
    amountControl.setErrors({ 'invalidNumber': true });
    return;
  }
  
  if (numAmount > this.data.amount) {
    this.swalService.alert.error(`Amount cannot exceed ${this.data.amount}`);
    this.regConf.patchValue({ amount: '' });
    return;
  }
  
}
}
