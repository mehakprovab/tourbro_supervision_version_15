import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../core/services/swal.service';
import { Logger } from '../../../core/logger/logger.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { UtilityService } from '../../../core/services/utility.service';
import { AppService } from '../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const log = new Logger();

@Component({
    selector: 'app-credit-balance',
    templateUrl: './credit-balance.component.html',
    styleUrls: ['./credit-balance.component.scss']
})
export class CreditBalanceComponent implements OnInit, OnDestroy {

    @ViewChild('accountsDetails', { static: true }) sd: ElementRef<HTMLDivElement>;
    private subSunk = new SubSink();
    towards = [
        { id: 0, name: 'Flight Booking Refund' }, { id: 1, name: 'Flight Refund' },
        { id: 2, name: 'Hotel Booking Refund' }, { id: 3, name: 'Hotel Refund' }, 
        { id: 4, name: 'Activity Booking Refund' }, { id: 5, name: 'Activity Refund' },
        { id: 6, name: 'Transfer Booking Refund' }, { id: 7, name: 'Transfer Refund' }, 
        { id: 8, name: 'Tour Booking Refund' }, { id: 9, name: 'Tour Refund' },
        { id: 10, name: 'VOID Refund' }, { id: 11, name: 'F/H Refunds' }, 
        { id: 12, name: 'Incentive Refund' }, 
        { id: 13, name: 'Miscellaneouse Refund' },
        { id: 14, name: 'Cash Received to Office Refund' }
    ];
    agentForm: FormGroup;
    respData: Array<any> = [];
    agentDetails: any;
    noData: boolean = true;
    defaultCurrency: string = '';
    filteredOptions: Observable<string[]>;
    isButtonDisabled: boolean = false;

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private appService: AppService
    ) {
        this.createForm();
        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
       this.getUserList();
    }

    getUserList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('userList', 'post', {}, {}, {
            auth_role_id: 2,
            status: 1
        }).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.noData = false;
                this.respData = resp.data;
                this.setFilteredmarkup_id();
                if(this.agentDetails && this.agentDetails.id)
                this.onChange(Number(this.agentDetails.id))
            } else if (resp.statusCode === 404) {
                this.noData = true;
                this.swalService.alert.oops();
            }
        });
    }

    onChange(agent_id) {
        this.agentDetails = this.respData.find(val => val.id == agent_id.option.id);
        if (!this.util.isEmpty(this.agentDetails)) {
        }
    }
    
    onReset() {
        this.agentForm.reset();
    }

    onSubmit() {
        if (this.agentForm.invalid)
            return;
        this.isButtonDisabled = true;
        const data = {
            "agent_id": Number(this.agentDetails.id),
            "refrence_number": this.agentForm.value.referenceNumber,
            "credit_towards": this.agentForm.value.towards,
            "amount": this.agentForm.value.amount,
            "comments": this.agentForm.value.comments,
        };
        log.debug(data);
        this.subSunk.sink = this.apiHandlerService.apiHandler('creditBalanceDirect', 'post', {}, {}, data)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update();
                    this.isButtonDisabled = false;
                    this.getUserList();
                    this.agentForm.reset();
                }
                else {
                    this.isButtonDisabled = false;
                    this.swalService.alert.oops();
                }

            }, (err: HttpErrorResponse) => {
                this.isButtonDisabled = false;
                this.swalService.alert.error();
            })
    }

    createForm() {
        this.agentForm = this.fb.group({
            agents: new FormControl('', [Validators.required]),
            referenceNumber: new FormControl('', [Validators.required, Validators.pattern('^([-A-Za-z0-9_ =-]){1,50}$'), Validators.maxLength(50)]),
            towards: new FormControl('', [Validators.required]),
            amount: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.maxLength(12)]),
            comments: new FormControl('', [Validators.required, Validators.maxLength(180)]),
        });
    }

    setFilteredmarkup_id() {
        this.filteredOptions = this.agentForm.controls.agents.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
        console.log("filteredOptions",this.filteredOptions)
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.respData.filter(option => (option.first_name+' '+ option.last_name +' ('+ option.uuid+')').toLowerCase().includes(filterValue));
      }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
