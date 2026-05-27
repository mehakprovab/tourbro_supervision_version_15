import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UserManagementService } from '../../../../../user-management.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-b2b-active-list',
  templateUrl: './b2b-active-list.component.html',
  styleUrls: ['./b2b-active-list.component.scss']
})
export class B2bActiveListComponent implements OnInit {

    @Output() b2bUserUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string="";
    pageSize = 10;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'B2B-users-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    selectedAgent:any;
    respAgentData: Array<any> = [];
    userTypeList: Array<any> = [];
    loggedInUser:any=[];
    showConfirm:boolean=false;
    deleteUserData:any;
    registerStates: any;
    errorMessage: any;
    supplier_type:any;
    registerCountry: any;
    getSupplierType: any;
    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private userMangementService : UserManagementService
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'uuid', value: 'Company ID' },
        { key: 'groupId', value: 'Group ID' },
        { key: 'agency', value: 'Agency Name' },
        { key: 'name', value: 'Agent Name' },
        { key: 'currency', value: 'Currency' },
        { key: 'balance', value: 'Balance' },
        { key: 'due', value: 'Due Amount' },
        { key: 'credit', value: 'Credit Limit' },
        { key: 'phone', value: 'Phone' },
        { key: 'email', value: 'Email' },
        // { key: 'contractedServices', value: 'Contrated Services' },
        // { key: 'distributionChannel', value: 'Distribution Channel'},
        { key: 'city', value: 'City' },
        { key: 'state', value: 'State' },
        { key: 'country', value: 'Country' },
        { key: 'pin', value: 'Pin' },
        { key: 'address', value: 'Address' },
        { key: 'activated', value: 'Activated At' },
    ];


    DMCdisplayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'uuid', value: 'B2B DMC ID' },
        { key: 'agency', value: 'DMC Agency Name' },
        { key: 'name', value: 'Prime User' },
        { key: 'contractedServices', value: 'Contrated Services' },
        { key: 'distributionChannel', value: 'Distribution Channel'},
        { key: 'phone', value: 'Phone' },
        { key: 'email', value: 'Email' },
        { key: 'city', value: 'City' },
        { key: 'state', value: 'State' },
        { key: 'country', value: 'Country' },
        { key: 'pin', value: 'Pin' },
        { key: 'address', value: 'Address' },
        { key: 'activated', value: 'Activated At' },
    ];

    ngOnInit() {
        this.getTitleList();
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
    
        // Execute listStates and getAgentList concurrently using Promise.all
        Promise.all([this.listStates(), this.listCountries(), this.getAgentList()])
            .then(() => {
                // Now execute the query params logic after both promises resolve
                this.activatedRoute.queryParams.subscribe(params => {
                    this.searchText = "";
                    this.listType = params['type'] === "active" ? 1 : 0;
                    this.getSupplierType = params['supplier_type'];
                    this.supplier_type = params['supplier_type'] === "DMC" ? 7 : GlobalConstants.B2B_AUTH_ROLE_ID;
                    this.getUsersList(this.listType, this.supplier_type);
                });
            })
            .catch(error => {
                console.error("Error in fetching state or agent list:", error);
            });
    
        this.userMangementService.b2bUserUpdateData.next({});
    }    

    listStates() {
        this.apiHandlerService.apiHandler('registerState', 'POST', '', '', {})
          .subscribe(res => {
            if (res.data) {
              this.registerStates = res.data;
            } else {
              this.errorMessage = res.data.msg;
            }
          });
      }

      listCountries(): Promise<void> {
        return new Promise(resolve => {
          this.apiHandlerService.apiHandler('registerCountry', 'POST', '', '', {})
            .subscribe(res => {
              if (res.data) {
                this.registerCountry = res.data;
              }
              resolve();
            });
        });
      }

      getCountryName(countryId: number): string | null {
        const country = this.registerCountry.find(c => c.id == countryId);
        return country ? country.name : null;
      }
    
      getStateName(stateId: number): string | null {
        const state = this.registerStates ? this.registerStates.find(state => state.id == stateId) : '';
        return state ? state.name : null;
      }

    createSubAgent() {
        this.router.navigate(['/administrator/createSubAgent'])
    }
    userProfile() {
        this.router.navigate(['/administrator/agencyUserDetails'])
    }

    getUsersList(type,supplier_type){
        this.noData = true;
        this.respData=[];
        GlobalConstants.B2B_AUTH_ROLE_ID
    	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": type,"auth_role_id":supplier_type})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
            });
    }
    getAgentList() {
        // this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {},
            {})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    // this.noData = false;
                    this.respAgentData = resp.data || [];
                }
                else {
                    // this.noData = false;
                    this.respAgentData=[];
                }
            }, (err) => {
                // this.noData = false;
                this.respAgentData=[];
            });
    }
    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTypeList = resp.data;
                } else {
                    console.log(`An error has occured`);
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            });
    }

    getTitleById(id) {
        if(id !== 0){
        let title = this.userTypeList.find( val => val.id == id );
        return title['title'] ? title['title'] : '';
        }else{
            return ''
        }
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }
    download(type: SupportedExtensions, orientation?: string) {
        let filename = this.listType == 1 ? "Active DMC List" : "Inactive DMC List";
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, filename).subscribe((_) => {
            // save started
            this.swalService.alert.success();
        }, (err) => {
            this.swalService.alert.oops();

        });
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    onStatusChange(data) {
        let reqObj = {}
        if (this.supplier_type === 7) {
            reqObj = { "status": data.status==1 ? 0 : 1, "id": data.id, "auth_role_id" : 7 }
        } else {
           reqObj = { "status": data.status==1 ? 0 : 1, "id": data.id }
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
            reqObj)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("User status changed successfully.");
                    this.getUsersList(this.listType,this.supplier_type);
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            }
            );
    }


    findUserLogin(loginTime, logoutTime) {
        if(loginTime && logoutTime){
            /*let d1 = Date.parse(loginTime);
            let d2 = Date.parse(logoutTime);*/
            let d1 = new Date(loginTime * 1000);
            let d2 = new Date(logoutTime * 1000);
            if(d1.getTime() > d2.getTime())
                return true;
            else
                return false;
        }else{
            return false;
        }
    }

    hoverData;
    onHover(data) {
        console.log(data);
        this.hoverData = data.last_login;
    }

    updateUser(data){
        this.userMangementService.b2bUserUpdateData.next(data);
    	this.b2bUserUpdate.emit({ tabId: 'add_update_b2bUser', data });
    }

    deleteUser(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteUser', 'post', {}, {},
        {"id": this.deleteUserData.id })
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.showConfirm=false;
                this.swalService.alert.success("User deleted successfully.");
                this.getUsersList(this.listType,this.supplier_type);
            }
            else {
                this.swalService.alert.oops();
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops();
        }
        );
    }

    cancelDeletePopup(data) {
        this.showConfirm = true;
        this.deleteUserData = data;
    }

    hide(){
        this.showConfirm = false;
    }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Status": response.status == 0 ? 'Inactive' : 'Active',
                    "ID": response.uuid,
                    "Agency Name": response['business_name'],
                    "Agent Name":  this.getTitleById(response['title'])+'.'+response['first_name']+''+response['last_name'],
                    "Balance": response.agent_balance,
                    "Due Amount": response.due_amount,
                    "Credit Limit": response.credit_limit,
                    "Phone": response.phone,
                    "Email": response.email,
                    "City": response.city,
                    "State": response.state,
                    "Pin": response.zip_code,
                    "Address": response.address,
                }
            });
            const columnWidths = [
                { wch: 5 },
                { wch: 10 },
                { wch: 20 },
                { wch: 30 },
                { wch: 20 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15 },
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 10 },
                { wch: 50 }
            ];

            this.utility.exportToExcel(
                fileToExport,
                'DMC List',
                columnWidths
            );
        }
    }
    onSubmitMail(data){
        this.subSunk.sink = this.apiHandlerService.apiHandler('mailCredentials', 'post', {}, {},
            { "supplier_id": data.id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("User status changed successfully.");
                    this.getUsersList(this.listType,this.supplier_type);
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            }
            );
    }
    selectedAgentList(agent){
        if(agent.agent_group_id != null && agent.agent_group_id != 0){
        const agentData = agent;
        const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(agentData.agent_group_id));
        return this.selectedAgent = selectedAgent.name;
        }else{
            return  0; 
        }
        // return  this.selectedAgent;
 }
}
