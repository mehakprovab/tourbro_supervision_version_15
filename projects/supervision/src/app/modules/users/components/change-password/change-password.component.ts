import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

    changePasswordForm: FormGroup;
    currentUser: any = {};
    errorMessage: any = '';
    protected subs = new SubSink();
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
        this.createForm();
    }

    get old_password() {
        return this.changePasswordForm.get('old_password');
    }

    createForm() {
        this.changePasswordForm = this.fb.group({
            user_id: [this.currentUser.user_id, [Validators.required]],
            old_password: ['', [Validators.required]],
            new_password: ['', [Validators.required]]
        });
    }

    onSubmit() {        
        this.subs.sink = this.apiHandlerService.apiHandler('changePassword', 'POST', '', '', this.changePasswordForm.value)
            .subscribe(res => {
                if (res.Status) {
                    this.errorMessage = '';
                    this.alertService.success('Password changed successfully!');
                } else {
                    this.errorMessage = res.Message;
                    this.changePasswordForm.get('old_password').setErrors(res.Message);
                    this.alertService.error(res.Message);
                }
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
