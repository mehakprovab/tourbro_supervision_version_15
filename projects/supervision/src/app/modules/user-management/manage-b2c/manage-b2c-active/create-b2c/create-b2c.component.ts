import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../user-management.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
    selector: 'app-create-b2c',
    templateUrl: './create-b2c.component.html',
    styleUrls: ['./create-b2c.component.scss']
})
export class CreateB2cComponent implements OnInit, OnDestroy {

    @Output() b2cUserUpdate = new EventEmitter<any>();
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
    countryCode: string = '';
    registerCountry: any;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    constructor(
        private router: Router,
        private userManagementService: UserManagementService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService,
        private appService: AppService,
        private apiHandlerService: ApiHandlerService
    ) {
        this.countryCode = this.appService.countryCode;
    }

    ngOnInit() {
        this.maxDate.setDate(this.maxDate.getDate() - (18 * 356)); // approx 18 years
      
        this.getTitleList();
        this.getTypeList();
        this.getPhoneCodeList();
        this.createForm();
      
        // Ensure listCountries runs only once and is awaited
        Promise.all([
          this.listCountries(),
          // this.listStates(), // if needed later
        ]).then(() => {
          // Delay to ensure data is bound
          setTimeout(() => {
            this.getToUpdate();
          }, 1500);
        }).catch(error => {
          console.error("Error loading API lists:", error);
        });
      }
      
    getTitleList() {
        this.subSunk.sink = this.userManagementService.fetchTitleList().subscribe(
          (resp) => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
              const data = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
              this.userTitleList = data.filter((item: any) => item.pax_type === 'ADULT');
            } else {
              this.swalService.alert.oops();
            }
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops();
          }
        );
      }      

    getTypeList() {
        this.subSunk.sink = this.userManagementService.getUserTypeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTypeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    // this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops();
            });
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            title: new FormControl('', [Validators.required]),
            first_name: new FormControl('', [Validators.required]),
            middle_name: new FormControl(''),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            confirm_password: new FormControl('', [Validators.required]),
            phone_code: new FormControl(this.countryCode, [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            // date_of_birth: new FormControl('', [Validators.required]),
            status: new FormControl('1', [Validators.required]),
            uuid: new FormControl(),
            country: new FormControl('101', [Validators.required]),
            state: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            address2: new FormControl(''),
            zip_code: new FormControl('', [Validators.required, Validators.maxLength(15) , Validators.pattern(this.utility.regExp.numbOnly)]),
            bio: new FormControl('', [Validators.required]),
            // auth_role_id: new FormControl(GlobalConstants.B2C_AUTH_ROLE_ID, [Validators.required]),
        },
            {
                validator: [this.matchPassword]
            });
    }

    listCountries(): Promise<void> {
        this.loading = true;
        return new Promise(resolve => {
          this.apiHandlerService.apiHandler('registerCountry', 'POST', '', '', {})
            .subscribe(res => {
              if (res.data) {
                this.loading = false;
                this.registerCountry = res.data;
              } else {
                this.loading = false;
              }
              resolve();
            }, (err) => {
                this.loading = false;
            });
        });
      }

    public matchPassword(AC: AbstractControl) {
        const password = AC.get('password').value
        const confirm_password = AC.get('confirm_password').value
        if (password != confirm_password) {
            AC.get('confirm_password').setErrors({ matchPassword: true })
        } else {
            AC.get('confirm_password').setErrors(null);
        }
    }

    getToUpdate() {
        this.subSunk.sink = this.userManagementService.b2cUserUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    title: data.title ? data.title : '',
                    first_name: data.first_name ? data.first_name : '',
                    middle_name: data.middle_name ? data.middle_name : '',
                    last_name: data.last_name ? data.last_name : '',
                    email: data.email ? data.email : '',
                    password: data.password ? data.password : '',
                    phone_code: data.phone_code ? data.phone_code : '',
                    phone: data.phone ? data.phone : '',
                   // date_of_birth: data.date_of_birth ? data.date_of_birth : '',
                    status: data.status == 1 ? '1' : '0',
                    uuid: data.uuid ? data.uuid : '',
                    country: data.country ?(data.country) : '',
                    state: data.state ? data.state : '',
                    city: data.city ? data.city : '',
                    address: data.address ? data.address : '',
                    address2: data.address2 ? data.address2 : '',
                    zip_code: data.zip_code ? data.zip_code : '',
                    bio: data.bio ? data.bio : '',

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
        if (this.addOrUpdate == 'addd') {
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
                    // console.log(this.phoneCodeList);

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
        req['auth_role_id'] = 4;
        req['title'] = parseInt(req['title']);
        req['zip_code'] = (req['zip_code']);
        switch (this.addOrUpdate) {
            case 'add':
                delete req.id;
                delete req.confirm_password;
                this.subSunk.sink = this.userManagementService.addUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("User added successfully.");
                            this.regConfig.reset();
                            this.b2cUserUpdate.emit({ tabId: 'b2cUsers_list' });
                        } else {
                            this.swalService.alert.oops("Unable to add user.");
                        }
                    }, (err: HttpErrorResponse) => {
                        this.swalService.alert.oops(err.error.Message);
                    })
                break;
            case 'update':
                this.subSunk.sink = this.userManagementService.updateUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("User updated successfully.");
                            this.regConfig.reset();
                            this.b2cUserUpdate.emit({ tabId: 'b2cUsers_list' });
                        } else {
                            this.swalService.alert.oops("Unable to update user.");
                        }
                    }, (err: HttpErrorResponse) => {
                        this.swalService.alert.oops(err.error.Message);
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
        this.userManagementService.b2cUserUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
