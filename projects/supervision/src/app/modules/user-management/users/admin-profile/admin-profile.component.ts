import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment.prod';
import { AlertService } from '../../../../core/services/alert.service';
import { SwalService } from '../../../../core/services/swal.service';
import { DatePipe } from '@angular/common';

const baseUrl = environment.baseUrl;
@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit, OnDestroy {

    public profile_logo = "assets/images/login-images/assets/profile_logo.png";
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    maxDate: any;
    minDate: any;
    onFileChange(files: FileList) {
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        this.fileToUpload = files.item(0);
    }
    formImport: FormGroup;
    fileToUpload: File = null;
    profileForm: FormGroup;
    countries: any = [];
    currentUser: any = {};
    protected subs = new SubSink();

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private swalService: SwalService,
        private utilityService: UtilityService,
        private router: Router,
        private datePipe: DatePipe,
    ) {
    }

    ngOnInit() {

        this.maxDate = this.addYearsToDate(-12);
        this.minDate = this.addYearsToDate(-100);
        this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};

        this.createForm();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
            .subscribe(res => {
                if (res.Status) {
                    this.countries = res.data.popular_countries.concat(res.data.countries);
                }
            });
        this.subs.sink = this.apiHandlerService.apiHandler('getUserById', 'POST', {}, {}, { id: this.currentUser.id })
            .subscribe(res => {
                if (res.Status) {
                    this.currentUser = res.data;
                     let formattedDate = res.data.date_of_birth? this.datePipe.transform(res.data.date_of_birth , 'yyyy-MM-dd'):'';
                    this.profileForm.patchValue({
                        user_id: res.data.user_id,
                        email: res.data.email,
                        business_name: res.data.business_name,
                        business_number: res.data.business_number,
                        business_phone: res.data.business_phone,
                        status: res.data.status,
                        title: res.data.title,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        address: res.data.address,
                        date_of_birth: formattedDate,
                        country_code: res.data.country,
                        phone: res.data.phone,
                        image: res.data.image
                    });
                } else {
                    this.alertService.error(res.Message);
                }
            });
    }

    addYearsToDate(y: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month, day);
        return c;
    }

    createForm() {
        this.profileForm = this.fb.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            address: ['', [Validators.required, Validators.maxLength(120)]],
            date_of_birth: ['', [Validators.required]],
            country_code: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.maxLength(14), Validators.pattern(this.utilityService.regExp.phone)]],
            business_phone: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            business_number: ['', [Validators.required]],
            importFile: [''],
        });
    }

    setDataToForm(userInfo) {
        this.profileForm.patchValue({
            business_name: userInfo.business_name,
            business_number: userInfo.business_number,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            country_code: userInfo.country,
            phone: userInfo.phone,
        });
    }
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }
    
    numberOnly(event): boolean {
        return this.utilityService.numberOnly(event);
    }

    getImage() {
        return baseUrl + this.currentUser['image'];
    }

    onSubmit(data) {
        if (this.profileForm.invalid) {
            const invalid = [];
            const controls = this.profileForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            return;
        }
        const jsonData = {
            id: this.currentUser.id,
            business_name: data.business_name,
            business_number: data.business_number,
            title: data.title,
            address: data.address,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            country: data.country_code,
            date_of_birth: data.date_of_birth,
            business_phone: data.business_phone,
            image: data.image
        }
        this.subs.sink = this.apiHandlerService.apiHandler('updateProfile', 'POST', '', '', { ...jsonData })
            .subscribe(res => {
                if (res.statusCode == 201) {
                    if (this.fileToUpload) {
                        this.uploadImage();
                        this.swalService.alert.success('Updated successfully! ..!');
                        if(this.currentUser.auth_role_id == 6){
                            this.router.navigate(['/hotels/hotel-crs-lists']);
                        }
                        else{
                            this.router.navigate(['/dashboard']);
                        }
                    } else {
                        this.swalService.alert.success('Updated successfully! ..!');
                        if(this.currentUser.auth_role_id == 6){
                            this.router.navigate(['/hotels/hotel-crs-lists']);
                        }
                        else{
                            this.router.navigate(['/dashboard']);
                        }
                    }

                } else {
                    this.swalService.alert.oops(res.Message);
                }
            });
    }

    uploadImage() {
        let reqBody = new FormData();
        reqBody.append('image', this.fileToUpload);
        this.apiHandlerService.apiHandler('uploadUserProfilePhoto', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if (resp) {
                    this.swalService.alert.success('Updated successfully! ..!');
                }
            })
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
