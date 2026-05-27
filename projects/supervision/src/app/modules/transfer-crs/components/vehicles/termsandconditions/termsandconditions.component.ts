import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-vehicle-master',
    templateUrl: './termsandconditions.component.html',
    styleUrls: ['./termsandconditions.component.scss']
})

export class TermsAndConditionsComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService
    ) {}
    public termsandConditionForm: FormGroup;
    public enabledForm: boolean = false;
    public editForm: boolean = false;
    public searchText: any;
    public saveTextName: string = 'Save';
    public displayColumn = ['Sl.No', 'Terms & Conditions', 'Action'];
    public termsAndConditionsList: any[] = [];
    public collectionSize: any;
    public page = 1;
    public pageSize = 10;
    public loading: boolean = false;
    public secondaryColour: any;
    public primaryColour: any;
    public loadingTemplate: any;
    public searchSpin:boolean = false;
    public loggedInUserId: number;

    ngOnInit(): void {
        const loggedInUser = sessionStorage.getItem('currentSupervisionUser');
         
        const loggedInAuthUser = JSON.parse(loggedInUser)['auth_role_id'];
            let created_by_id;
            if(loggedInAuthUser !== 7) {
                this.loggedInUserId = 1
            } else {
                this.loggedInUserId = JSON.parse(loggedInUser)['id'];
            }
        this.createForm();
        this.getTermsAndConditions();
    }

    createForm() {
        this.termsandConditionForm = this.fb.group({
            terms_and_conditions: ['', Validators.required]
        })
    }
    
    getTermsAndConditions() {
        const payLoad = { userId: this.loggedInUserId  }
        this.apiHandlerService.apiHandler('getTermsConditions','POST',{},{},payLoad).subscribe({
            next: (res) => {
                console.log(res.data.data[0].terms_and_conditions);
                if(res.Status === true && (res.statusCode === 200 || res.statusCode ===201)) {
                    this.termsandConditionForm.patchValue({
                        terms_and_conditions: res.data.data[0].terms_and_conditions
                    })
                }
                
            }, error: (err) => {
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    onSubmitTermsAndConditions() {
        const payLoad = {
            ...this.termsandConditionForm.value,
            userId: this.loggedInUserId
        }
        this.apiHandlerService.apiHandler('addTermsAndConditions','POST',{},{},payLoad).subscribe({
            next: (res) => {
                console.log(res);
                this.swalService.alert.success("Terms and Conditions has been saved successfully");
            }, error: (err) => {
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    onAddButtonClicked() {
        this.enabledForm = true;
    }

    onUpdateTermsAndConditions(id, data) {

    }
    onDeletedRecord(id) {

    }

    clearForm() {
        this.termsandConditionForm.reset();
        this.enabledForm = false;
    }
}