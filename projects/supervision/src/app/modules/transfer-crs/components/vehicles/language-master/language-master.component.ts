import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSlideToggleChange } from '@angular/material';

@Component({
    selector: 'app-language-master',
    templateUrl: './language-master.component.html',
    styleUrls: ['./language-master.component.scss']
})

export class LanguageMasterComponent implements OnInit {

    public languageForm: FormGroup;
    public enabledForm: boolean = true;
    public editForm: boolean = false;
    public searchText: string = '';
    public saveTextName: string = 'Add';
    public displayColumn:any[] = ['Sl. No.', 'Status', 'Language Name', 'Action']
    public searchSpin: boolean = true;
    public languageMasterDataList: any[] = [];
    public collectionSize: any;
    public page = 1;
    public pageSize = 10;
    public langId: number;
    public subSunk = new SubSink();
    public loading: boolean = false;
    public primaryColour: any;
    public secondaryColour: any;
    public loadingTemplate: any;
    public loggedInUser: any;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) {}

    ngOnInit(): void {
        const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
      this.loggedInUser = JSON.parse(currentDomainUser);
    //   if (this.loggedInUser.auth_role_id !== 7) {
    //   this.displayColumn.push('Action')
    // }
        this.createLanguageForm();
        this.getLanguageList();
    }

    getLanguageList() {
        this.apiHandlerService.apiHandler('activityLanguageList','POST',{},{}, {}).subscribe({
            next: (res) => {
                console.log(res);
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.languageMasterDataList = res.data;
                    this.collectionSize = res.data.length;
                    this.languageForm.reset();
                    this.saveTextName = 'Add';
                    this.searchSpin = false;
                } else {
                    this.languageMasterDataList = [];
                    this.searchSpin = false;
                }
            }, error: (err) => {
                this.languageMasterDataList = [];
                this.searchSpin = false;
            }
        })
    }
    
    onLanguageMasterSave() {
        if(!this.languageForm.valid) return;
        this.languageForm.patchValue({
            status: this.languageForm.get('status').value === true ? true : false
        })
        const req = this.saveTextName === 'Add' ? {...this.languageForm.value, created_by_id: this.loggedInUser['id']} : {id:this.langId,...this.languageForm.value, updated_by_id: this.loggedInUser['id']};
        const apiEndPoint = this.saveTextName === 'Add' ? 'addActivityLanguage' : 'updateActivityLanguage';
        this.apiHandlerService.apiHandler( apiEndPoint,'POST',{},{},req).subscribe({
            next: (res) => {
                console.log(res)
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    const alertMessage = this.saveTextName === 'Add' ? 'Language Added Successfully' : 'Language Updated Successfully';
                    this.swalService.alert.success( alertMessage );
                    this.enabledForm = true;
                    this.getLanguageList();
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    // updateLanguage() {
    //     
    // }

    onAddButtonClicked() {
        this.enabledForm = true;
        this.saveTextName = 'Add';
    }

    createLanguageForm() {
        this.languageForm = this.fb.group({
            activity_language_name: ['', Validators.required],
            status: [false]
        })
    }

    onEditLanguage(id,data) {
        this.langId = id;
        window.scroll({top: 0, behavior: 'smooth'});
        this.saveTextName = 'Update';
        this.enabledForm = true;
        this.languageForm.patchValue({
            activity_language_name: data.activity_language_name,
            status: data.status === 1 ? true : false
        })

    }

    onDeletedRecord(id) {
        const req = {id:id};
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteActivityLanguage', 'post', {}, {},req)
                .subscribe(response => {
                    if (response.Status === true && (response.statusCode == 200 || response.statusCode == 201)) {
                    this.loading = false;
                        this.swalService.alert.success('Language has been deleted successfully')
                        this.getLanguageList();
                    } else {
                    this.swalService.alert.oops(response.Message)
                    this.loading = false;
                    }
                },(err: HttpErrorResponse) => {
                this.loading = false;
                this.swalService.alert.error(err['error']['Message']);
                });
            }
        })
    }

    onUpdateStatus(event: MatSlideToggleChange, id) {
        const req = {
            id: id,
            status: event.checked, 
            updated_by_id: this.loggedInUser['id']
        };
        this.apiHandlerService.apiHandler('statusUpdateLanguage','POST',{},{},req).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.swalService.alert.success('Status Updated Successfully.');
                    this.getLanguageList();
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

    showActionButtons(authId, loggedInId) {
        if(this.loggedInUser.auth_role_id === 3 || this.loggedInUser.auth_role_id === 1) {
            return true;
        }

        else if(this.loggedInUser.auth_role_id === 7) {
            if (this.loggedInUser['id'] === loggedInId) {
                return true;
            } else {
                return false;
            }
        }
    }
}