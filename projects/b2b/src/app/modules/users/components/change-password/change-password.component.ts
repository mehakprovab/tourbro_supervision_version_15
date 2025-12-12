import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/b2b/src/app/auth/auth.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';

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
    respData: any = {};

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
        this.createForm();
    }

    get old_password() {
        return this.changePasswordForm.get('old_password');
    }

    createForm() {
        this.changePasswordForm = this.fb.group({
            // user_id: [this.currentUser.user_id],
            email: ['', [Validators.required, Validators.email]],
            old_password: ['', [Validators.required]],
            new_password: ['', [Validators.required, Validators.minLength(8)]],
        });
        this.changePasswordForm.patchValue({email: this.currentUser.email})
    }

    onSubmit() {
        console.log(this.changePasswordForm.value)
        this.subs.sink = this.apiHandlerService.apiHandler('resetPassword', 'POST', '', '', this.changePasswordForm.value)
            .subscribe(res => {
                this.respData = res;
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.errorMessage = '';
                    this.swalService.alert.success("Your password changed successfully!!, Please login again");
                    setTimeout(() => {
                        this.authService.logout();
                    }, 1000)

                } else if (res.statusCode == 502) {
                    this.errorMessage = "Your password doesn't match";
                    this.changePasswordForm.get('old_password').setErrors(this.errorMessage);
                    this.swalService.alert.oops(this.errorMessage);

                }
            },
                () => {

                },
                () => {
                    if (!this.respData.hasOwnProperty('statusCode')) {
                        this.errorMessage = "Your password doesn't match";
                        this.swalService.alert.oops(this.errorMessage);
                    }

                })
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
