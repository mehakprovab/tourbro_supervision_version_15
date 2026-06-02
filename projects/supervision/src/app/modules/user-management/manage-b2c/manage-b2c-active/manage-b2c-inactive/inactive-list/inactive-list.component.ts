import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UserManagementService } from '../../../../user-management.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('inactive-list/InactiveListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = []

@Component({
  selector: 'app-inactive-list',
  templateUrl: './inactive-list.component.html',
  styleUrls: ['./inactive-list.component.scss']
})
export class InactiveListComponent implements OnInit,OnDestroy {

  @Output() b2cUserUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'In-active-users-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    userTypeList: Array<any> = [];
    searchText: string;
    registerCountry: any;

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
        { key: 'uuid', value: 'Tourbro ID' },
        { key: 'first_name', value: 'Name' },
        { key: 'phone', value: 'Contact' },
        { key: 'email', value: 'Email' },
        { key: 'city', value: 'City' },
        { key: 'state', value: 'State' },
        { key: 'country', value: 'Country' },
        { key: 'activatedOn', value: 'Activated On' },
        { key: 'created_at', value: 'Registered Date' },
    ];

    ngOnInit() {
        this.getTitleList();
        this.listCountries();
        this.activatedRoute.queryParams.subscribe(params => {
            this.listType = params['type'] == "active" ? 1 : 0;
            this.getUsersList(this.listType);
        });
        this.userMangementService.b2cUserUpdateData.next({});
    }

    createSubAgent() {
        this.router.navigate(['/administrator/createSubAgent'])
    }
    userProfile() {
        this.router.navigate(['/administrator/agencyUserDetails'])
    }

    getUsersList(type){
        this.noData = true;
        this.respData = [];
    	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": 0,"auth_role_id":GlobalConstants.B2C_AUTH_ROLE_ID})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
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
        // console.log(id, this.userTypeList)
        let title = this.userTypeList.find( val => val.id == id );
        return title && title['title'] ? title['title'] : '';
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
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `In-active-users-report`).subscribe();
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
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

    updateUser(data){
        this.userMangementService.b2cUserUpdateData.next(data);
    	this.b2cUserUpdate.emit({ tabId: 'add_update_b2cUser', data });
    }

    updateStatus(val,id ){
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
            {"status": val,"id":id})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.getUsersList(1);
                }
                else {

                }
            });
    }

    findUserLogin(loginTime, logoutTime){
        if(loginTime && logoutTime){
            let d1 = Date.parse(loginTime);
            let d2 = Date.parse(logoutTime);
            if(d2 > d1)
                return true;
            else
                return false;
        }else{
            return false;
        }
    }

    clearSearch(): void {
        this.searchText = '';
      }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Login Status": response.status == 0 ? 'Inactive' : 'Active',
                    "Booking 247 ID": response.uuid,
                    "Name": (response['first_name'] + ' ' + response['last_name']).toUpperCase(),
                    "Contact": response.phone,
                    "Email": response.email,
                    "Reffered From": '',
                }
            });
            const columnWidths = [
                { wch: 5 },
                { wch: 10 },
                { wch: 30 },
                { wch: 25 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
            ];
            this.utility.exportToExcel(
                fileToExport,
                'B2C InActive List',
                columnWidths
            );
        }
    }
    
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    

}
