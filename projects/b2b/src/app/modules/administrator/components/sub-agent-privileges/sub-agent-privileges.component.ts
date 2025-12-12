import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../.../../../core/api-handlers';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from '../../../.../../../core/services/swal.service';

@Component({
  selector: 'app-sub-agent-privileges',
  templateUrl: './sub-agent-privileges.component.html',
  styleUrls: ['./sub-agent-privileges.component.scss']
})
export class SubAgentPrivilegesComponent implements OnInit {

    selectedUser: any;
    form: FormGroup;
    regConfig: FormGroup;
    searchForm: FormGroup;
    private subSunk = new SubSink();
    orders = [];
    controls;
    respData: any;
    noData: boolean = true;
    filterData: any;
    isSelect : boolean = true
    previligeUserData : any;
    respDataCopy: any;
    constructor(
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private swalService: SwalService
    ) {
    }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'description', value: 'Privilege Description	' },
        { key: 'p_no', value: 'Select' },
    ];

    ngOnInit() {
        this.selectedUser = this.route.snapshot.queryParams;
        const controlArray = this.orders.map(c => new FormControl(false));
        this.form = this.formBuilder.group({
            orders: new FormArray(controlArray),
        });
        this.createform();
        this.getPrivilegesList();
    }

    createform(){
            this.regConfig =  this.formBuilder.group({   
              paymentDetails: new FormArray([])
            }) 
            this.searchForm = this.formBuilder.group({
                searchText : new FormControl("")
            })
    }

    get f() { return this.regConfig.controls; }   
    get t() { return this.f.paymentDetails as FormArray; }

    getPrivilegesList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegePageList', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data;
                this.respDataCopy = resp.data;
                this.getPrevilegeForThisUser();
                this.cdr.detectChanges();
                }else{
                    this.noData = false;
                   this.respData=[];
                }
            }, err => {
                this.noData=false;
                this.respData=[];
            });
    }
    getPrevilegeForThisUser(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegedUser', 'post', {}, {}, {'user_id':parseInt(this.selectedUser.id)})
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
           this.previligeUserData = resp.data;
           if(this.respData && this.previligeUserData)
           this.updateForm(resp.data.length)
           this.cdr.detectChanges();
            }
        });
    }
    check(){
        let temp = [];
          let parents = this.respData.filter(el => el.parent_key==null || '')
          parents.forEach((data)=>{
                data['childs'] = this.respData.filter(el => el.parent_key == data.privilege_key);
                temp.push(data)
          })
          this.filterData = temp;
    }
    onSubmit(): void {
        const selectedOrderIds = this.form.value.orders
            .map((v, i) => v ? this.orders[i].id : null)
            .filter(v => v !== null);

    }

    updateForm(e){
        const numberOfItems = e;
            for(let i=0;i< this.respData.length;i++) {
                if(this.respData[i].id){
                    let checked = false;
                    if(this.previligeUserData.some(e => e.p_no == this.respData[i].p_no)){
                        checked = true;
                    }
                    this.t.push(this.formBuilder.group({
                        id: [''],
                        description: [''],
                        p_no: [''],
                        parent_key: [''],
                        privilege_category: [''],
                        privilege_key: [''],
                        isChecked:['']
                    }));
                    const controlArray = <FormArray>this.regConfig.get('paymentDetails');
                    controlArray.controls[i].get('id').setValue(this.respData[i].id);
                    controlArray.controls[i].get('description').setValue(this.respData[i].description);
                    controlArray.controls[i].get('p_no').setValue(this.respData[i].p_no);
                    controlArray.controls[i].get('parent_key').setValue(this.respData[i].parent_key);
                    controlArray.controls[i].get('privilege_category').setValue(this.respData[i].privilege_category);
                    controlArray.controls[i].get('privilege_key').setValue(this.respData[i].privilege_key);
                    controlArray.controls[i].get('isChecked').setValue(checked);
                }
            } 
        } 

        ngAfterContentInit(){
            this.cdr.detectChanges()
        }

    get getFormControls() {
        const control = this.regConfig.get('paymentDetails') as FormArray;

        return control;
    }

    selectAll(){
        const controlArray = <FormArray>this.regConfig.get('paymentDetails');
        if(this.isSelect){
            for(let i=0;i< this.respData.length;i++) {
            controlArray.controls[i].get('isChecked').setValue(true);
            }
        }else{
            for(let i=0;i< this.respData.length;i++) {
            controlArray.controls[i].get('isChecked').setValue(false);
            }
        }
        this.isSelect = !this.isSelect;
    }

    changedPrivilage(data){
        if(data.value && (data.value.parent_key == null || data.value.parent_key == '')){
            let getChilds = this.respData.filter(el => el.parent_key == data.value.privilege_key).map(item => item['id'])
            if(getChilds && getChilds.length >0){
                getChilds.forEach(i => {
                    // this.regConfig.controls.paymentDetails['controls'][i].controls.isChecked = true;
                    this.regConfig.controls.paymentDetails['at'](i-1).patchValue({isChecked:data.value.isChecked})
                })
            }
        }else if(data.value && (data.value.parent_key) && data.value.isChecked){
            let parent = this.respData.filter(el => el.privilege_key == data.value.parent_key).map(item => item['id'])
            this.regConfig.controls.paymentDetails['at'](parent[0]-1).patchValue({isChecked:data.value.isChecked})
        }
        
    }

    onSearchSubmit() {
        this.noData = true;
        this.respData = [];
        let copy = this.respDataCopy;
        if (this.searchForm.value.searchText == "") {
            this.respData = this.respDataCopy;
        }
        else {
            this.respData = copy.filter(el => el.description == (this.searchForm.value.searchText).trim());
        }
        this.noData = false;
        this.getFormControls.clear()
        this.updateForm(this.respData.length)
    }

    onReset() {
        this.searchForm.patchValue({
            searchText: ''
        });
        this.respData = this.respDataCopy;
        this.noData = false;
        this.updateForm(this.respData.length)
    }

    updatePaymentCharges(){ 
        let form = (this.regConfig.value.paymentDetails)
        let selectedReq = (this.regConfig.value.paymentDetails.filter(el => el.isChecked))
                        .map(item => item['p_no'])
        let revokedReq = (this.regConfig.value.paymentDetails.filter(el => !el.isChecked))
                        .map(item => item['p_no'])
        const req = {
            "user_id": parseInt(this.selectedUser.id),
            "p_no": selectedReq
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('setUserPrivilege', 'post', {}, {},req)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                   this.swalService.alert.success("Updated successfully.");
                   this.getPrevilegeForThisUser();
                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
               // this.swalService.alert.oops();
        })

        const reqBody = {
            "user_id": parseInt(this.selectedUser.id),
            "p_no": revokedReq
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('revokeParticularPrivilege', 'post', {}, {},reqBody)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                } 
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
        })
    }

}
