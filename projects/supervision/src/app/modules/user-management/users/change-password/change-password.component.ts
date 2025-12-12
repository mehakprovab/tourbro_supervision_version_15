import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'projects/supervision/src/app/auth/auth.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public profile_logo = "assets/images/login-images/assets/profile_logo.png";
    changePasswordForm: FormGroup;
    currentUser: any = {};
    errorMessage: any = '';
    protected subs = new SubSink();
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private router: Router,
        private authService: AuthService,
        private swalService:SwalService
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
        this.createForm();
    }

    get old_password() {
        return this.changePasswordForm.get('old_password');
    }

    createForm() {
        this.changePasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            old_password: ['', [Validators.required]],
            new_password: ['', [Validators.required,Validators.minLength(8)]],
        });
    }

    onSubmit() {
        this.subs.sink = this.apiHandlerService.apiHandler('resetPassword', 'POST', '', '', this.changePasswordForm.value)
            .subscribe(res => {
             if (res.statusCode == 200 || res.statusCode == 201) {
                    this.errorMessage = '';
                    this.swalService.alert.success("Password changed successfully!");
                    setTimeout(() =>{
                        this.authService.logout();
                    },1000)
                  
                } else {
                }
            }, (err) => {
                
                this.errorMessage = err.error.msg;
                this.changePasswordForm.get('old_password').setErrors(err.error.msg);
                this.swalService.alert.oops(err.error.msg)
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
