import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { formatDate } from 'ngx-bootstrap/chronos';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';

const log = new Logger('support ticket/SentCallbackComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-agent-callback-support',
    templateUrl: './agent-callback-support.component.html',
    styleUrls: ['./agent-callback-support.component.scss']
})
export class AgentCallbackSupportComponent implements OnInit {
    private subSunk = new SubSink();
    isOpen = false as boolean;
    maxDate = new Date();
    regConfig: FormGroup;
    protected subs = new SubSink();
    agentsList: Array<any> = [];

    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'ticket_number', value: 'Ticket Number' },
        { key: 'agency_name', value: 'Agency Name' },
        { key: 'phone_number', value: 'Contact Info' },
        { key: 'email_id', value: 'Email' },
        { key: 'reference_id', value: 'Reference Number' },
        { key: 'remarks', value: 'Message' },
        { key: 'requested_date', value: 'Request Date' },
    ];
    noData: boolean = true;
    respData: any;

    constructor(
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.createForm();
        this.getSentCallback();
        this.getAgents();
    }

    createForm() {
        this.regConfig = this.fb.group({
            agency_name: new FormControl(''),
            email_id: new FormControl('', [Validators.maxLength(50),Validators.email]),
            phone_number: new FormControl('', [Validators.maxLength(10),Validators.minLength(10)]),
            ticket_number: new FormControl('', [Validators.maxLength(20)]),
            requested_date_from: new FormControl('', [Validators.maxLength(15)]),
            requested_date_to: new FormControl('', [Validators.maxLength(15)]),
        })
    }

    getAgents(){

        this.subs.sink = this.apiHandlerService.apiHandler('coreHelpdeskAgentName', 'POST', {}, {},{}).subscribe(res => {
            if (res.Status && res.data.length!=0) {
                this.agentsList=res.data;
            } 
        }, (err: HttpErrorResponse) => {
            log.debug(err);
        }
        );
    }

    getAgentsList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": 1,"auth_role_id":GlobalConstants.B2B_AUTH_ROLE_ID})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentsList = resp.data || [];
                }
                else {

                }
            });
    }

    getSentCallback() {
        this.respData=[];
        this.noData=true;
        this.collectionSize=0;
        respDataCopy=[];
        if(this.regConfig.invalid){
            return ;
        }
        let reqBody = {
            "email_id":this.regConfig.value.email_id || "",
            "phone_number":this.regConfig.value.phone_number || "",
            "ticket_number":this.regConfig.value.ticket_number || "",
            "agent_id":Number(this.regConfig.value.agency_name) || "",
            "requested_date_from": this.regConfig.value.requested_date_from ? formatDate(this.regConfig.value.requested_date_from, 'YYYY-MM-DD') : "",
            "requested_date_to":this.regConfig.value.requested_date_to ? formatDate(this.regConfig.value.requested_date_to, 'YYYY-MM-DD') : "",
            "booking_source":"B2B",
        }
        this.subs.sink = this.apiHandlerService.apiHandler('coreHelpdeskList', 'POST', {}, {}, reqBody).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length>0) {
                this.noData = false;
                this.respData = res.data;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            } else {
                this.noData = false;
                this.respData=[];
            }
        }, (err: HttpErrorResponse) => {
            this.noData=false;
            this.respData=[];
        }
        );
    }

    onReset() {
        this.regConfig.reset();
        this.regConfig.patchValue({
            agency_name: ''
        })
        this.getSentCallback();
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    applyFilter(e){

    }

    sortData(sort: Sort) {
        console.log(sort)
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'ticket_number': return this.utility.compare('' + a.ticket_number.toLocaleLowerCase(), '' + b.ticket_number.toLocaleLowerCase(), isAsc);
                case 'agency_name': return this.utility.compare('' + a.agency_name.toLocaleLowerCase(), '' + b.agency_name.toLocaleLowerCase(), isAsc);
                case 'email_id': return this.utility.compare('' + a.email_id.toLocaleLowerCase(), '' + b.email_id.toLocaleLowerCase(), isAsc);
                case 'phone_number': return this.utility.compare(+ a.phone_number, + b.phone_number, isAsc);
                case 'reference_id': return this.utility.compare('' + a.reference_id.toLocaleLowerCase(), '' + b.reference_id.toLocaleLowerCase(), isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'requested_date': return this.utility.compare(+ a.requested_date, + b.requested_date, isAsc);

                default: return 0;
            }
        });
    }

 

}
