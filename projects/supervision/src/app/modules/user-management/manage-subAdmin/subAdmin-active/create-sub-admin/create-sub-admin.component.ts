import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../user-management.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { AppService } from 'projects/supervision/src/app/app.service';

@Component({
    selector: 'app-create-sub-admin',
    templateUrl: './create-sub-admin.component.html',
    styleUrls: ['./create-sub-admin.component.scss']
})
export class CreateSubAdminComponent implements OnInit, OnDestroy {

    @Output() staffUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    subagentId;
    userTitleList: Array<any> = [];
    userTypeList: Array<any> = [];
    phoneCodeList: Array<any> = [];
    regConfig: FormGroup;
    isOpen = false as boolean;
    setMinDate: any;
    addOrUpdate: string = '';
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();
    countriesList = [];
    countryId:string;

    constructor(
        private router: Router,
        private userManagementService: UserManagementService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private appService: AppService
    ) {
        this.countryId = this.appService.countryId;
     }

    ngOnInit() {
        this.getTitleList();
        this.getTypeList();
        this.getCountriesList();
        this.createForm();
        this.getToUpdate();
        this.getPhoneCodeList(); 
    }

    getCountriesList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            this.countriesList = res.data.popular_countries.concat(res.data.countries);
        });
    }

    getTitleList() {
        this.subSunk.sink = this.userManagementService.fetchTitleList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    const data = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
                    this.userTitleList = data.filter((item: any) => item.pax_type === 'ADULT');
                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    getTypeList() {
        this.subSunk.sink = this.userManagementService.getUserTypeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTypeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            uuid:new FormControl(''),
            title: new FormControl('', [Validators.required]),
            first_name: new FormControl('', [Validators.required]),
            middle_name: new FormControl(''),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            password: new FormControl('', [Validators.required]),
            confirm_password: new FormControl('', [Validators.required]),
            phone_code:new FormControl(this.countryId, [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            //date_of_birth: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            state: new FormControl('', [Validators.required]),
            country: new FormControl(this.countryId, [Validators.required]),
            status: new FormControl('1', [Validators.required]),
            auth_role_id: new FormControl(GlobalConstants.STAFF_AUTH_ROLE_ID),
        },
            {
                validator: this.matchPassword
            });
    }

    private matchPassword(AC: AbstractControl) {
        const password = AC.get('password').value
        const confirm_password = AC.get('confirm_password').value
        if (password != confirm_password) {
            AC.get('confirm_password').setErrors({ matchPassword: true })
        } else {
            AC.get('confirm_password').setErrors(null);
        }
    }

    getToUpdate() {

        this.subSunk.sink = this.userManagementService.staffUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {

                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    uuid:data.uuid ? data.uuid : '',
                    title: data.title ? data.title : '',
                    first_name: data.first_name ? data.first_name : '',
                    middle_name: data.middle_name ? data.middle_name : '',
                    last_name: data.last_name ? data.last_name : '',
                    email: data.email ? data.email : '',
                    city: data.city ? data.city : '',
                    state: data.state ? data.state : '',
                    country: data.country ? data.country : '',
                    password: '12345',
                    confirm_password: '12345',
                    phone_code:data.phone_code ? data.phone_code : '',
                    phone: data.phone ? data.phone : '',
                    //date_of_birth: data.date_of_birth ? data.date_of_birth : '',
                    status: data.status == 1 ? '1' : '0',

                }, { emitEvent: false })

            } else {
                this.addOrUpdate = 'add';
            }
            this.makePasswordRequired();
        })
    }
    makePasswordRequired() {
        const password = this.regConfig.get('password');
        const confirmPassword = this.regConfig.get('confirm_password');
        if (this.addOrUpdate == 'add') {
            password.setValidators([Validators.required]);
            confirmPassword.setValidators([Validators.required]);
            confirmPassword.setErrors({ matchPassword: true });
        } else {
            password.clearValidators();
            confirmPassword.clearValidators();
            confirmPassword.setErrors(null)
        }
        password.updateValueAndValidity();
        confirmPassword.updateValueAndValidity();
    }

    getPhoneCodeList() {
        this.subSunk.sink = this.userManagementService.fetchPhoneCodeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.phoneCodeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    onSubmit() {

        if (this.regConfig.invalid) {
            return;
        }
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        req['auth_role_id'] =GlobalConstants.STAFF_AUTH_ROLE_ID;
        req['address'] = "Bangalore";
        req['title'] = parseInt(req['title']);
        req['business_name'] = "";
        req['business_number'] = "";
        req['business_phone'] = "";
        // req['city'] = "";
        // req['state'] = "";
        req['zip_code'] = null;
        req['address2'] = "";
      
        switch (this.addOrUpdate) {
            case 'add':

                delete req.id;
                delete req.uuid;
                delete req.confirm_password;
                this.subSunk.sink = this.userManagementService.addUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub Admin added successfully.");
                            this.regConfig.reset();
                            this.staffUpdate.emit({ tabId: 'staff_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            case 'update':
                if(req.password=='12345' &&  req.confirm_password=='12345'){
                    delete req.password;
                    delete req.confirm_password;
                }
                this.subSunk.sink = this.userManagementService.updateUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub Admin updated successfully.");
                            this.regConfig.reset();
                            this.staffUpdate.emit({ tabId: 'staff_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            default:
                break;
        }

    }

    omitSpecialCharacters(event) {
        return this.utility.omitSpecialCharacters(event);
    }
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    onReset() {
        this.userManagementService.staffUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
