import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalService } from '../../../core/services/swal.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styles: []
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

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
    get user_name() { return this.forgotPasswordForm.get('user_name'); }
    protected subs = new SubSink();
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService:SwalService
    ) {
    }

    ngOnInit() {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
           // phone: ['', [Validators.required]],
            user_type: 1
        });
    }

    onSubmit() {
        this.subs.sink = this.apiHandlerService.apiHandler('forgotPassword', 'POST', '', '', this.forgotPasswordForm.value)
            .subscribe(res => {
                if (res.Status) {
                    this.successMessage = res.data.data;
                    this.swalService.alert.success("Change password link has been sent to your mail id.Pls check")
                    this.forgotPasswordForm.reset();
                } else {
                    this.swalService.alert.oops();
                    this.errorMessage = res.Message;
                }
            },(err)=>{
                if(err.error.statusCode == 400){
                    this.swalService.alert.oops("Please provide valid email")
                }else if(err.error.statusCode == 403){
                    this.swalService.alert.oops("User email not exist")
                }else{
                    this.swalService.alert.oops(err.error.Message)
                }               
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
