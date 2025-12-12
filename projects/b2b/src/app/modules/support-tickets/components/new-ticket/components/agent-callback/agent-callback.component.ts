import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('support ticket/AgentCallbackComponent');

@Component({
    selector: 'app-agent-callback',
    templateUrl: './agent-callback.component.html',
    styleUrls: ['./agent-callback.component.scss']
})
export class AgentCallbackComponent implements OnInit {
    regConfig: FormGroup;
    selectRqeType: string;
    noData: boolean = true;
    respData: any;
    requestTypes: any;
    protected subs = new SubSink();
    currentUser: any = {};

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService
    ) { }

    ngOnInit() {
        this.createForm();
        this.currentUser = this.util.readStorage('currentUser', sessionStorage);
        if(this.currentUser){
            this.regConfig.patchValue({company_name: this.currentUser.business_name,
                phone_number: this.currentUser.phone,
                email_id: this.currentUser.email,

            });
        }
    }

    onSubmit() {
        if (this.regConfig.invalid) {
            return;
        }
        let req = this.regConfig.value;
        req['booking_source'] = "B2B";
        this.subs.sink = this.apiHandlerService.apiHandler('addCoreHelpdesk', 'POST', {}, {}, req).subscribe(res => {
            if (res.result || res.Status) {
                this.swalService.alert.success("Ticket submitted successfully.");
                this.regConfig.reset();
            } else {
                this.swalService.alert.oops(res.Message);
            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
            console.error(err);
            this.swalService.alert.oops();
        }
        );
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    onReset() {

    }

    createForm() {
        this.regConfig = this.fb.group({
            email_id: new FormControl('', [Validators.required, Validators.maxLength(150),
                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            company_name:new FormControl('', [Validators.required, Validators.maxLength(50)]),
            phone_number: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            ticket_number: new FormControl(''),
            reference_id: new FormControl('', [Validators.required, Validators.maxLength(150)]),
            remarks: new FormControl('', [Validators.required]),
        })
    }

    onSelect(e) {
        console.log(e);
    }

    ngOnDestroy() { }

}
