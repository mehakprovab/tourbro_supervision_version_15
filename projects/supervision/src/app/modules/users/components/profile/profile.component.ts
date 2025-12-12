import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    profileForm: FormGroup;
    countries: any = [];
    currentUser: any = {};
    protected subs = new SubSink();
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
        this.createForm();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
            .subscribe(res => {
                if (res.Status) {
                    this.countries = res.Data.popular_countries.concat(res.Data.countries);
                }
            });
        this.subs.sink = this.apiHandlerService.apiHandler('editProfile', 'POST', '', '', { user_id: this.currentUser.user_id })
            .subscribe(res => {
                if (res.Status) {
                    this.profileForm.patchValue({
                        user_id: res.Data.user_id,
                        email: res.Data.email,
                        business_name: res.Data.business_name,
                        business_number: res.Data.business_number,
                        status: res.Data.status,
                        title: res.Data.title,
                        first_name: res.Data.first_name,
                        last_name: res.Data.last_name,
                        address: res.Data.address,
                        date_of_birth: res.Data.date_of_birth,
                        country_code: res.Data.country_code,
                        phone: res.Data.phone,
                        image: ''
                    });
                } else {
                    this.alertService.error(res.Message);
                }
            });
    }

    createForm() {
        this.profileForm = this.fb.group({
            title: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            date_of_birth: ['', [Validators.required]],
            country_code: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            business_phone: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            business_number: ['', [Validators.required]],
            image: ['', [Validators.required]],
            status: ['', [Validators.required]],
            user_id: [this.currentUser.user_id, [Validators.required]]
        });
    }

    onSubmit() {
        this.subs.sink = this.apiHandlerService.apiHandler('updateProfile', 'POST', '', '', this.profileForm.value)
            .subscribe(res => {
                if (res.Status) {
                    this.alertService.success('Profile updated successfully!');
                } else {
                    this.alertService.error(res.Message);
                }
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
