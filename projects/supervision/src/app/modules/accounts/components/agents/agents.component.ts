import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AgentsService } from './agents.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

const log = new Logger('AgentsComponent')

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
    @ViewChild('accountsDetails', {static: true}) sd: ElementRef<HTMLDivElement>
    accounts = [{ id: 0, name: 'Credit' }, { id: 1, name: 'Debit' }];
    towards = [{ id: 0, name: 'Flight Booking' }, { id: 1, name: 'Flight Cancelation' }, { id: 2, name: 'Miscellaneouse' }];
    accountType = 'Credit';
    showDetails: boolean = false;
    agentForm: FormGroup;
    respData: any;
    agentDetails: any;
    noData: boolean = true;


    constructor(
        private fb: FormBuilder,
        private agentsService: AgentsService,
        private swalService: SwalService,
    ) { this.createForm() }

    ngOnInit() {
        this.agentsService.fetch().subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode === 200) {
                this.noData = false;
                this.respData = resp.data;
            } else if (resp.statusCode === 404) {
                this.noData = true;
                this.swalService.alert.oops();
            }
        });
    }
    
    onChange(agent_id) {
        if (Boolean(agent_id)) {
            this.agentsService.fetch({ agent_id }).subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode === 200) {
                    this.showDetails = Boolean(resp.data);
                    if (!this.showDetails) {
                        this.swalService.alert.oops('No data found, please try other user!!!');
                    }
                    this.agentDetails = resp.data;
                } else if (resp.statusCode === 404) {
                    this.showDetails = Boolean(0);
                    this.swalService.alert.oops('No data found, please try other user!!!');
                }
            })
        }

    }
    onChangeType(accountType) {
        this.accountType = accountType;
    }

    onReset() {
        this.agentForm.reset();
    }

    onSubmit() {

        if (this.agentForm.invalid)
            return;
        const data = [{
            agent_id: this.agentForm.value.agents,
            issued_for: this.agentForm.value.towards,
            reference_num: this.agentForm.value.referenceNumber,
            amount: this.agentForm.value.amount,
            remarks: this.agentForm.value.comments,
            created_by_id: 80,
        }]
        if (this.agentForm.value.accountType == 'Credit') {
            data['accountType'] = 'Credit';
        } else {
            data['accountType'] = 'Debit';
        }
        log.debug(data);
        this.agentsService.update(data).subscribe(resp => {
            log.debug(resp)
            if (resp.statusCode == 200) {
                this.swalService.alert.update();
                this.onChange(data[0]['agent_id']);
                this.agentForm.reset();
                this.agentForm.patchValue({ agents: data[0]['agent_id'] });
                setTimeout( () => {
                    this.sd.nativeElement.scrollIntoView({behavior: 'smooth'})
                }, 3100)
            }
            else if (resp.statusCode == 400)
                this.swalService.alert.oops();
            else {
                this.swalService.alert.error();
            }

        })
    }

    createForm() {
        this.agentForm = this.fb.group({
            agents: new FormControl('', [Validators.required]),
            // accounts: new FormControl('Please Select', [Validators.required]),
            accountType: new FormControl('', [Validators.required]),
            referenceNumber: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), , Validators.maxLength(180), Validators.maxLength(18)]),
            towards: new FormControl('', [Validators.required]),
            amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(12)]),
            comments: new FormControl('', [Validators.required, Validators.maxLength(180)]),
        });
    }

}

