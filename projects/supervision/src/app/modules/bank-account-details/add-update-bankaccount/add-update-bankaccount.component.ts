import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { BankAccountDetailsService } from '../bank-account-details.servise';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

const baseUrl = environment.baseUrl;

@Component({
    selector: 'app-add-update-bankaccount',
    templateUrl: './add-update-bankaccount.component.html',
    styleUrls: ['./add-update-bankaccount.component.scss']
})
export class AddUpdateBankaccountComponent implements OnInit, OnDestroy {
    @ViewChild('theFile', { static: true }) theFile: ElementRef;
    @Output() activateTab = new EventEmitter<string>();
    private subSunk = new SubSink();
    regConfig: FormGroup;
    logoConfig: FormGroup;
    noData: boolean = true;
    respData: any;
    addOrUpdate: string = '';
    bankLogo: string;
    logoBankUri = `${baseUrl}/cms/cms-bankaccounts/`;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    submitted: boolean = false;

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private bankAccountDetailsService: BankAccountDetailsService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.createForm();
        this.regConfig.reset();
        this.getToUpdate();
    }
    imageSrc;
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
                this.bankLogo = "";
                this.imageSrc=""
                this.theFile.nativeElement.value = null;
                this.logoConfig.reset();
                this.regConfig.controls['bank_logo'].reset()
                return;
            }
        }
        if (file.name) {
            this.bankLogo = '';
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'bank_logo': file });
            this.regConfig.patchValue({ bank_logo: file });
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    getToUpdate() {
        this.subSunk.sink = this.bankAccountDetailsService.toUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    // id: '1',
                    id: data.id ? data.id : '',
                    account_name: data.account_name ? data.account_name : '',
                    account_number: data.account_number ? data.account_number : '',
                    bank_routing_number:data.ifsc_code ? data.ifsc_code : '',
                    // ifsc_code:'123',
                    ifsc_code: data.ifsc_code ? data.ifsc_code : '',
                    swift_code: data.swift_code ? data.swift_code : '',
                    bank_name: data.bank_name ? data.bank_name : '',
                    branch_name: data.branch_name ? data.branch_name : '',
                    bank_logo: data.bank_logo ? data.bank_logo : '',
                    status: data.status==1 ? '1' : '0',
                    pan_number: data.pan_number ? data.pan_number : '',
                    // ssn:'123'
                    iban: data.iban ? data.iban : '',
                    ssn: data.ssn ? data.ssn : '',
                }, { emitEvent: false })
                this.bankLogo = data.bank_logo ? data.bank_logo : '';
                const imageControl = this.regConfig.get('bank_logo');
            } else {
                this.addOrUpdate = 'add';
                this.regConfig.reset();
            }
        })
    }

    uploadImg(id) {
        const formData = new FormData();
        formData.append('image', this.logoConfig.get('bank_logo').value);
        formData.append('id', id);
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateBankImage', 'post', {}, {}, formData).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.imgObj.isUploaded = true;
                    this.activateTab.emit("bankaccount_list");
                    this.swalService.alert.success(resp.msg);
            } else {
                this.imgObj.isUploaded = false;
            }
        })
    }

    onSubmit() {
        this.regConfig.patchValue({
            ifsc_code: this.regConfig.get('bank_routing_number').value,
            ssn:"1234"
        })
        if (this.addOrUpdate == "add") {
            this.submitted = true;
        }
        if (this.regConfig.invalid)
        {
            this.swalService.alert.oops("Kindly fill mandatory fields.");
            return;
        }
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        switch (this.addOrUpdate) {
            case 'add':
                const response = {
                    account_name: req.account_name,
                    account_number : req.account_number,
                    swift_code : req.swift_code,
                    bank_name : req.bank_name,
                    branch_name : req.branch_name,
                    ifsc_code : req.bank_routing_number,
                    ssn : req.ssn,
                    iban: req.iban
                }
                delete req.status;
                delete req.bank_logo;
                this.subSunk.sink = this.apiHandlerService.apiHandler('addBankAccountDetail', 'post', {}, {}, response)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            if (this.imgObj.isLogoToUpdate) {
                                this.submitted = false;
                                this.uploadImg(resp.data.id);
                            }else{
                                this.activateTab.emit("bankaccount_list");
                                this.swalService.alert.success(resp.msg);
                            }
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    }, err => {
                        this.swalService.alert.oops(err.message);
                    });
                break;
            case 'update':
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateBankAccountContent', 'post', {}, {}, req)
                    .subscribe(resp => {
                        console.log('res', resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            if (this.imgObj.isLogoToUpdate) {
                                this.submitted = false;
                                this.uploadImg(req.id);
                            }else{
                                this.activateTab.emit("bankaccount_list");
                                this.swalService.alert.success(resp.msg);
                            }
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    }, err => {
                        this.swalService.alert.oops();
                    });
                break;
            default:
                break;
        }

    }

    onReset() {
        this.bankAccountDetailsService.toUpdateData.next({});
        this.imgObj.isLogoToUpdate = false;
        this.bankLogo = '';
        this.imageSrc = '';
        this.submitted = false;
        this.regConfig.reset();
        const imageControl = this.regConfig.get('bank_logo');
            imageControl.setValidators(null);
            imageControl.updateValueAndValidity();
    }

    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }

    alpha(e) {

        let k = e.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }

    createForm() {
        this.regConfig = this.fb.group({
            account_name: new FormControl('', [Validators.required]),
            account_number: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$'),Validators.maxLength(150)]),
            ifsc_code: new FormControl('', [Validators.required]),
            swift_code: new FormControl('', [Validators.required]),
            bank_name: new FormControl('', [Validators.required,Validators.maxLength(150)]),
            branch_name: new FormControl('', [Validators.required]),
            bank_routing_number : new FormControl('', [Validators.required]),
            bank_logo: new FormControl('', [Validators.required]),
            iban: new FormControl(''),
            status: new FormControl('1', [Validators.required]),
         //   pan_number: new FormControl("ABCDE1234F", [Validators.required]),
            ssn: new FormControl('', [Validators.required]),
            id: '',
        });
        this.logoConfig = this.fb.group({
            bank_logo: new FormControl('')
        })
    }

    validateFileSize(fileSize) {
        if (fileSize >1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            return false;
        }
        else {
            return true
        }
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
