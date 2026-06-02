import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UserManagementService } from '../../../../modules/user-management/user-management.service';
import { HttpErrorResponse } from '@angular/common/http';


const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-agent-balance',
  templateUrl: './agent-balance.component.html',
  styleUrls: ['./agent-balance.component.scss']
})
export class AgentBalanceComponent implements OnInit {

    @Output() b2bUserUpdate = new EventEmitter<any>();
    
    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'B2B-users-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    userTypeList: Array<any> = [];
    searchText: string;
    navigationData:any;

    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private userMangementService : UserManagementService
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'uuid', value: 'User ID' },
        { key: 'agency', value: 'Agency Name' },
        { key: 'name', value: 'Agent Name' },
        { key: 'balance', value: 'Balance' },
        { key: 'due', value: 'Due Amount' },
        { key: 'credit', value: 'Credit Limit' },
        { key: 'remaining credit', value: 'Remaining Credit' }
    ];

    ngOnInit(): void {
        this.getTitleList();
        this.getPrevilegeForThisUser();
        this.activatedRoute.queryParams.subscribe(params => {
            this.listType = params['type'] == "active" ? 1 : 0;
            this.getUsersList(this.listType);
        });
        this.userMangementService.b2bUserUpdateData.next({});
    }

    createSubAgent() {
        this.router.navigate(['/administrator/createSubAgent'])
    }
    userProfile() {
        this.router.navigate(['/administrator/agencyUserDetails'])
    }


    getUsersList(type){
    	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": 1,"auth_role_id":GlobalConstants.B2B_AUTH_ROLE_ID})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
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
        let title = this.userTypeList.find( val => val.id == id );
        return title['title'] ? title['title'] : '';
    }

    sortedData = this.respData.slice();

    sortData(sort: Sort) {
        console.log(sort)
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }
    

    download(type: any, orientation?: string) {
        let filename = this.listType == 1 ? "Active B2B List" : "Inactive B2B List";
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
       this.utility.downloadElementAsPdf(this.config.elementIdOrContent, filename, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
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
        console.log(data);
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
            { "status": data.status==1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("User status changed successfully.");
                    this.getUsersList(this.listType);
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

    updateCreditLimit(data,type){
        const selectedAgent=JSON.stringify(data);
        localStorage.setItem('selectedAgent',selectedAgent);
        if (type === 'deduct') {
            this.router.navigate(['/update-credit'],{
                queryParams: {
                  Type: 'deductCredit'
                }});
        }
        else {
            this.router.navigate(['/update-credit'])
        }
    }

    isMenuExists(menu) {
        if (this.navigationData && this.navigationData.length > 0) {
            if (this.navigationData.some((el) => el.description == menu))
                return true;
            else
                return false;
        }
        else {
            return true;
        }
    }

    getPrevilegeForThisUser() {
        this.navigationData = JSON.parse(sessionStorage.getItem('userPrevilige'))
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "User ID": response.uuid,
                "Agency Name": response.business_name.toUpperCase(),
                "Agent Name": this.getTitleById(response['title'])+' '+response.first_name+' '+response.middle_name+' '+response.last_name,
                "Balance": response.agent_balance,
                "Due Amount": response.due_amount,
                "Credit Limit": response.credit_limit,
                "Remaining Credit": (response.credit_limit+ response.due_amount)
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Agent Balance',
            columnWidths
        );
    }

}
