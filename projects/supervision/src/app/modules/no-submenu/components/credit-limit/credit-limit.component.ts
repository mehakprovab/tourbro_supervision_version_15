import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.component.html',
  styleUrls: ['./credit-limit.component.scss']
})
export class CreditLimitComponent implements OnInit {
    creditConfig: FormGroup;
    fromDeduct: string = '';

    constructor(
        private fb: FormBuilder,
        private router:Router,
        private location: Location,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.createForm();
        const selectedAgent = JSON.parse(localStorage.getItem('selectedAgent'));
        if (selectedAgent) {
            this.creditConfig.patchValue({
                agent_name: selectedAgent.business_name,
                agent_uuid: selectedAgent.uuid,
                agent_id: selectedAgent.id,
                agent_balance: selectedAgent.agent_balance,
                credit_limit: selectedAgent.credit_limit,
                due_amount: selectedAgent.due_amount,
            });
        }
        this.getParams();
    }

    getParams() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (queryParams) {
                this.fromDeduct = (queryParams['Type']);
                 if (this.fromDeduct === 'deductCredit') {
                    console.log(this.fromDeduct)
                 }
                }
            })
    }
    createForm() {
        this.creditConfig = this.fb.group({
            agent_name: new FormControl(''),
            agent_id: new FormControl(''),
            agent_uuid: new FormControl(''),
            agent_balance: new FormControl(''),
            due_amount: new FormControl(''),
            credit_limit: new FormControl('', [Validators.required]),
        })
    }

    goBack(){
        this.location.back();
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    onSubmit() {
        if (!this.creditConfig.valid) {
            return;
        }
        let endPoint;
        if (this.fromDeduct === 'deductCredit') {
            endPoint = 'deductCreditLimitDirect';
        } else {
           endPoint = 'updateCreditLimitDirect';
        }
        const payload = this.generatePayload();
            this.apiHandlerService.apiHandler(endPoint, 'post', {}, {} , payload).subscribe(
                (resp) => {
                    if (resp.Status && (resp.statusCode == 200 || resp.statusCode == 204) && resp.data) {
                        this.swalService.alert.success("Credit limit updated successfully.");
                        this.router.navigate(['/agent-balance']);
                    }
                    else {
                        this.swalService.alert.oops("Could not update credit limit.");
                        this.clearCreditLimit();
                    }
                }, (err) => {
                    this.swalService.alert.oops(err.error.Message);
                    this.clearCreditLimit();
                }
            )
    }

    clearCreditLimit(){
        this.creditConfig.patchValue({
            credit_limit:''
        })
    }
    generatePayload() {
        let payLoad;
        if (this.fromDeduct === 'deductCredit') {
            payLoad = {
                agent_id: parseInt(this.creditConfig.value.agent_id),
                duration_in_days: 0,
                amount: -parseInt(this.creditConfig.value.credit_limit),
                comments: "Debit Credit limit."
            }
        }  else {
            payLoad = {
                agent_id: parseInt(this.creditConfig.value.agent_id),
                duration_in_days: 0,
                amount: parseInt(this.creditConfig.value.credit_limit),
                comments: "Updated Credit Limit."
            };
        }
        return payLoad;
    }
}