import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { ErrorStateMatcher } from '@angular/material/core';
import {  MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { SwalService } from '../../../core/services/swal.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
      const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
      return (invalidCtrl || invalidParent);
    }
  }

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit,OnDestroy {

    private subSunk = new SubSink();
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    domainInfo : any;
    errorMessage = '';
    isMatched: boolean = false;
    id;
    matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private swalService:SwalService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        if(params && params.token){
            console.log(params);
            this.id = atob(params.token.replace("'",""));
            console.log(this.id);
        }else{
            this.alertService.error("Something went wrong.. Pls try again later");
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 1000)
        }
    });
    this.createForm();
    this.getDomianInfo();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
        password: ['', [Validators.required,Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
    });

}
  isPasswordMatched() {
    if (this.loginForm.get('password').value === this.loginForm.get('confirmPassword').value)
      this.isMatched = false;
    else
      this.isMatched = true;
  }

  getDomianInfo(){
}

public hasError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }

submit(form:any){
    if (form.invalid) {
        return;
    }
    console.log(form.value);
    let req = {
        id:this.id,
        new_password:this.loginForm.value.password
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('updatePassword', 'POST', '', '', req)
            .subscribe(res => {
                if (res.Status) {
                    this.swalService.alert.success("Your password has been reset successfull!")
                    setTimeout(()=>{
                        this.router.navigate(['/auth/login']);
                    },1000)
                } else {
                    this.swalService.alert.oops("Failed to reset password, Please try again")
                }
            });
}

ngOnDestroy(): void {
    this.subSunk.unsubscribe
}

}
