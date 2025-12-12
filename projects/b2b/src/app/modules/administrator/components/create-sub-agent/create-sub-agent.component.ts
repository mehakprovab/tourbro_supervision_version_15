import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdministratorService } from '../../administrator.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-create-sub-agent',
    templateUrl: './create-sub-agent.component.html',
    styleUrls: ['./create-sub-agent.component.scss']
})
export class CreateSubAgentComponent implements OnInit, OnDestroy {
    @Output() subagentUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    subagentId;
    userTitleList: Array<any> = [];
    phoneCodeList: Array<any> = [];
    regConfig: FormGroup;
    isOpen = false as boolean;
    setMinDate: any;
    addOrUpdate: string = '';
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();

    constructor(
        private router: Router,
        private administratorService: AdministratorService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService,
        private datePipe: DatePipe,
    ) { }

    ngOnInit() {
        this.maxDate.setDate(this.maxDate.getDate() - (18 * 356));
        this.getTitleList();
        this.createForm();
        this.getToUpdate();
        this.getPhoneCodeList();
    }
    public subAgentList() {
        this.router.navigate(['/administrator/subAgentList']);
    }
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    getTitleList() {
        this.subSunk.sink = this.administratorService.fetchTitleList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTitleList = resp.data.length ? resp.data : this.administratorService.isDevelopement;

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
            title: new FormControl('', [Validators.required]),
            first_name: new FormControl('', [Validators.required]),
            middle_name: new FormControl(''),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            password: new FormControl('', [Validators.required]),
            confirm_password: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
             phone_code: new FormControl('', [Validators.required]),
           // date_of_birth: new FormControl('', [Validators.required]),
            status: new FormControl('1', [Validators.required]),
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
        this.subSunk.sink = this.administratorService.subagentUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                //let formattedDate = data.date_of_birth? this.datePipe.transform(data.date_of_birth , 'yyyy-MM-dd'):'';
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    title: data.title ? data.title : '',
                    first_name: data.first_name ? data.first_name : '',
                    middle_name: data.middle_name ? data.middle_name : '',
                    last_name: data.last_name ? data.last_name : '',
                    email: data.email ? data.email : '',
                    password: data.password ? data.password : '12345',
                    confirm_password: data.confirm_password ? data.confirm_password : '12345',
                    phone: data.phone ? data.phone : '',
                    phone_code: data.phone_code ? data.phone_code : '',
                    //date_of_birth: data.date_of_birth ? formattedDate : '',
                    status: data.status == 1 ? '1' : '0',

                }, { emitEvent: false })

            } else {
                this.addOrUpdate = 'add';
            }
        })
    }

    getPhoneCodeList() {
        this.subSunk.sink = this.administratorService.fetchPhoneCodeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.phoneCodeList = resp.data.length ? resp.data : this.administratorService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    onSubmit() {
        if (!this.regConfig.valid) {
            return;
        }
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        //req['date_of_birth'] = req['date_of_birth'].split("T")[0];
        switch (this.addOrUpdate) {
            case 'add':

                delete req.id;
                delete req.confirm_password;

                this.subSunk.sink = this.administratorService.addSubAgent(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub agent added successfully.");
                            this.regConfig.reset();
                            this.subagentUpdate.emit({ tabId: 'subagent_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (errorResponse) => {
                        if (errorResponse.error.Message == "403 Already exists") {
                            this.swalService.alert.oops("Email Already Exists.");
                        }else{
                            this.swalService.alert.oops(errorResponse.error.msg);
                        }
                    })
                break;
            case 'update':
                if(req.password=='12345' &&  req.confirm_password=='12345'){
                    delete req.password;
                    delete req.confirm_password;
                }
                this.subSunk.sink = this.administratorService.updateSubAgent(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub agent updated successfully.");
                            this.regConfig.reset();
                            this.subagentUpdate.emit({ tabId: 'subagent_list' });
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

    onReset() {
        this.administratorService.subagentUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
