import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styles: [

    ]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    public profile_logo = "assets/images/login-images/assets/profile_logo.png";
    slideConfig2 = {
        className: 'center',
        centerMode: true,
        infinite: true,
        centerPadding: '0',
        slidesToShow: 1,
        speed: 500,
        dots: true,
    };

    forgotPasswordForm: FormGroup;
    errorMessage = '';
    successMessage = '';

    get forgot_password() { return this.forgotPasswordForm.get('forgot_password'); }

    protected subs = new SubSink();
    constructor(
        public diloagRef: MatDialogRef<LoginComponent>,
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.forgotPasswordForm = this.fb.group({
            forgot_password: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
        });
    }

    onSubmit() {
        this.errorMessage = "";
        let req = { email: this.forgotPasswordForm.value.forgot_password }
        this.subs.sink = this.apiHandlerService.apiHandler('forgotPassword', 'POST', '', '', req)
            .subscribe(res => {
                if (res.Status) {
                    this.successMessage = "Change Password link has been sent to your email. Please check it";
                    setTimeout(() => {
                        this.diloagRef.close();
                    }, 5000);
                } else {
                    this.forgotPasswordForm.get('password').setErrors(res.Message);
                    this.errorMessage = res.Message;
                }
            }, (err) => {
                this.errorMessage = err.error.statusCode == 403 ? "Entered Email doesn't exist!" : err.error.Message;
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
