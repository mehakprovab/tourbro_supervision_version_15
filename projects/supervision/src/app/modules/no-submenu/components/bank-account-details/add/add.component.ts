import { Component, Input, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

const log = new Logger('AddComponent');

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input() getDataToUpdate;
    @Output() passedTab = new EventEmitter<any>();
    noData: boolean;
    respData: object[] = [];
    accountForm = this.fb.group({
        accountname: [null, Validators.required],
        accountnumber: [null, Validators.required],
        ifsccode: [null, Validators.required],
        pannumber: [null, Validators.required],
        bankname: [null, Validators.required],
        branchname: [null, Validators.required],
        banklogo: null,
        status: [false, Validators.required]
    });

    hasUnitNumber = false;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        log.debug(this.getDataToUpdate);
        if (this.getDataToUpdate)
            this.accountForm.patchValue({
                accountname: this.getDataToUpdate.accountname,
                accountnumber: this.getDataToUpdate.accountnumber,
                ifsccode: this.getDataToUpdate.ifsccode,
                pannumber: this.getDataToUpdate.pannumber,
                bankname: this.getDataToUpdate.bankname,
                branchname: this.getDataToUpdate.branchname,
                // BankLogo: this.getDataToUpdate.banklogo,
                status: this.getDataToUpdate.status,
            })
    }

    ngAfterViewInit() {
    }

    onReset(){
        this.getDataToUpdate = '';
        this.accountForm.reset();
    }
    onSubmit() {
        log.debug('onSubmit',this.accountForm.value);
        if (!this.accountForm.valid) {
            return;
        }
        let data, topic;
        if (this.getDataToUpdate) {
            topic = 'updateBankAccountDetails';
            data = Object.assign(
                { "updated_by_id": 80, "bank_account_id": parseInt(this.getDataToUpdate.id) },
                this.accountForm.value);
            data.banklogo = "";
        } else {
            topic = 'addBankAccountDetails'
            data = Object.assign(
                { "created_by_id": 80, "domain_origin": 5 },
                this.accountForm.value);
            data.banklogo = "";
        }
        log.debug(data);
        this.apiHandlerService.apiHandler(
            topic, 'post', {}, {}, data)
            .pipe(
                finalize(() => {
                    // this.noData = false;
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug('resp', resp);
                if (resp.Status && (resp.Data.msg || resp.Data.data) ) {
                    this.swalService.alert.success(resp.Data.msg);
                    this.getDataToUpdate = '';
                    this.accountForm.reset();
                    this.passedTab.emit({tabId: 'bankAccountDetails', data: {}})
                } else {
                    this.swalService.alert.oops();
                }
            })
    }
    ngOnDestroy() {
    }
}
