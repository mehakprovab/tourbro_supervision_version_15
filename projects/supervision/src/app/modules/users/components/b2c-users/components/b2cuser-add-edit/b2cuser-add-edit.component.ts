import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UsersService } from '../../../../users.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Logger } from '../../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../../core/services/format-date';

const log = new Logger('users/UsersAddComponent');

@Component({
  selector: 'app-b2cuser-add-edit',
  templateUrl: './b2cuser-add-edit.component.html',
  styleUrls: ['./b2cuser-add-edit.component.scss']
})
export class B2cuserAddEditComponent implements OnInit {

  usersForm: FormGroup;
    userTitles: any;
    countries: any;
    user: any;
    cityListData: any;
    userTypes: any;
    noData: boolean = true;
    minDate;
    maxDate;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
    submitted: boolean = false;
    @Output() someEvent = new EventEmitter<any>();
    @Input() userOne: object = {};

    constructor(
        private fb: FormBuilder,
        private api: ApiHandlerService,
        private swalService: SwalService,
        private usersService: UsersService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit() {
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.userOne)) {
                const data = [
                    { user_id: this.userOne['user_id'] }
                ];
                data['topic'] = 'editUser';
                this.usersService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200) {
                            this.noData = false;
                            this.user = resp.data;
                            this.patchUser();
                        } else {
                            this.noData = true;
                            this.swalService.alert.oops();
                        }
                    });
            }
        } catch (e) { console.log(e); }

        this.api.apiHandler('userTitleList', 'POST')
            .subscribe(res => {
                this.userTitles = res.Data;
            });
        // this.api.apiHandler('countryList', 'POST')
        //     .subscribe(res => {
        //         this.countries = res.Data;
        //         try {
        //             if (!this.utilityService.isEmpty(this.userOne)) {
        //                 const countryObj = this.countries.find((val, i) => {
        //                     return (val['country_name'] == this.userOne['country_name'])
        //                 })
        //                 this.getCities(countryObj);
        //             }
        //         } catch (error) { log.debug(error); }
        //     });
        this.api.apiHandler('userTypeList', 'POST')
            .subscribe(res => {
                this.userTypes = res.Data;
            });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.usersForm.controls[controlName].touched) && this.usersForm.controls[controlName].hasError(errorName));
    }
    // onCountryOptnSelected(event) {
    //     const countryObj = this.countries.find((val, i) => {
    //         return (val['country_origin'] == event.target.value)
    //     })
    //     console.log('countryObj,event.target.value', countryObj, event.target.value);
    //     this.getCities(countryObj);
    // }

    // getCities(country) {
    //     const data = { iso_country_code: country['iso_country_code'] };
    //     this.api.apiHandler('cityList', 'post', {}, {}, data)
    //         .subscribe(resp => {
    //             log.debug(resp);
    //             if (resp.Status)
    //                 this.cityListData = resp.Data;
    //             this.usersForm.patchValue({
    //                 city_code: country['city_origin']
    //             });
    //         });
    // }

    createForm(): void {
        this.usersForm = this.fb.group({
            business_name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            business_number: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            business_phone: new FormControl('', [Validators.maxLength(80)]),
            title: new FormControl('', [Validators.required, , Validators.maxLength(80)]),
            first_name: new FormControl('', [Validators.required, , Validators.maxLength(80)]),
            last_name: new FormControl('', [Validators.required, , Validators.maxLength(80)]),
            date_of_birth: new FormControl('', [Validators.required]),
            country_code: new FormControl(''),
            city_code: new FormControl(''),
            phone: new FormControl('', [Validators.required, , Validators.maxLength(14), Validators.pattern(this.utilityService.regExp.phone)]),
            address: new FormControl('', [Validators.required, Validators.maxLength(120)]),
            user_type: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(40), Validators.pattern(this.utilityService.regExp.password)]),
            confirm_password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(40), Validators.pattern(this.utilityService.regExp.password)]),
            status: new FormControl('', [Validators.required]),
        });
    }

    patchUser(): void {
        this.usersForm.patchValue({
            business_name: this.user['business_name'] || '',
            business_number: this.user['business_number'] || '',
            business_phone: this.user['business_phone'] || '',
            title: this.user['title'] || '',
            first_name: this.user['first_name'] || '',
            last_name: this.user['last_name'] || '',
            date_of_birth: this.user['date_of_birth'] || '',
            phone: this.user['phone'] || '',
            address: this.user['address'] || '',
            user_type: this.user['user_type'] || '',
            email: this.user['email'] || '',
            country_code: this.user['country_code'] || '',
            city_code: this.user['city_code'] || '',
            status: Number(this.user['status']) ? true : false,
        })
    }

    resetFrom() {
        this.userOne = {};
        this.usersForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (!this.usersForm.valid) {
            this.swalService.alert.error('Please fill all the required field');
            return;
        }
        if (this.usersForm.value.password != this.usersForm.value.confirm_password) {
            this.swalService.alert.oops('Password Not Matched');
            return;
        }
        const dt = new Date(this.usersForm.value.date_of_birth);
        this.usersForm.value.date_of_birth = formatDate(dt, '');
        let data = Object.assign({}, this.usersForm.value);
        if (data['status']) {
            data['status'] = 1;
        } else {
            data['status'] = 0;
        }
        delete data['confirm_password'];
        try {
            if (!this.utilityService.isEmpty(this.userOne)) {
                data['user_id'] = this.userOne['user_id'];
                data = [data];
                data['topic'] = 'updateUser';
            }
            else {
                data['created_by_id'] = 80; // will change later after loggedin user id
                data = [data];
                data['topic'] = 'addUser';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.usersService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_users', user: '' })
                    this.usersForm.reset();
                } else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
    }

}
