import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  accountForm = this.fb.group({
    AccountName: [null, Validators.required],
    AccountNumber: [null, Validators.required],
    IFSCCode: [null, Validators.required],
    PAN: [null, Validators.required],
    BankName: [null, Validators.required],
    BranchName: [null, Validators.required],
    BankLogo: null,
    Status: ['Inactive', Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    alert('Thanks!');
  }
}
