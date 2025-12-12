import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { AlertService } from 'projects/supervision/src/app/core/services/alert.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UserManagementService } from '../../../user-management.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-manage-list',
    templateUrl: './manage-list.component.html',
    styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit, OnDestroy {

    @Output() b2cUserUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'active-users-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    userTypeList: Array<any> = [];
    registerCountry: any;

    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private alertService: AlertService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private userMangementService: UserManagementService
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'uuid', value: 'Tourbro ID' },
        { key: 'first_name', value: 'Name' },
        { key: 'phone', value: 'Contact' },
        { key: 'email', value: 'Email' },
        { key: 'created_at', value: 'Registered Date' },
        { key: 'city', value: 'City' },
        { key: 'state', value: 'State' },
        { key: 'country', value: 'Country' },
        { key: 'activatedOn', value: 'Activated On' },
        { key: 'last_login', value: 'Last login' },
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

    getUsersList(type) {
        this.noData = true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.B2C_AUTH_ROLE_ID })
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
        this.exportAsService.save(this.config, `active-users-report`).subscribe((_) => {
            // save started
            this.swalService.alert.success();
        }, (err) => {
            this.swalService.alert.oops();

        });
    }

     downloadPdf() {
        const element = document.getElementById('b2c-active-list-table');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2C Active List.pdf');
            this.swalService.alert.success();
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

    updateStatus(val, id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
            { "status": val, "id": id })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.getUsersList(1);
                }
                else {

                }
            });
    }

    findUserLogin(loginTime, logoutTime) {
        if (loginTime && logoutTime) {
            /*let d1 = Date.parse(loginTime);
            let d2 = Date.parse(logoutTime);*/
            let d1 = new Date(loginTime * 1000);
            let d2 = new Date(logoutTime * 1000);
            if (d1.getTime() > d2.getTime())
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    getLastLogin(date) {
        return new Date(date * 1000);
    }

    updateUser(data) {
        this.userMangementService.b2cUserUpdateData.next(data);
        this.b2cUserUpdate.emit({ tabId: 'add_update_b2cUser', data });
    }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Status": response.status == 0 ? 'Inactive' : 'Active',
                    "Booking 247 ID": response.uuid,
                    "Agent Name": (response['first_name'] + ' ' + response['last_name']).toUpperCase(),
                    "Contact": response.phone,
                    "Email": response.email,
                    "Registered Date":  moment(response.created_at).format("MMM DD, YYYY"),
                    "City" : response.city,
                    "State" : response.state,
                    "Country" : this.getCountryName(response.country),
                    "Activated On" : response.activated_at,
                    "Last login": new Date(response.last_login),
                }
            });
            const columnWidths = [
                { wch: 5 },
                { wch: 10 },
                { wch: 30 },
                { wch: 30 },
                { wch: 20 },
                { wch: 30 },
                { wch: 20 },
                { wch: 15 },
            ];

            this.utility.exportToExcel(
                fileToExport,
                'B2C Active List',
                columnWidths
            );
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
        const country = this.registerCountry ? this.registerCountry.find(c => c.id == countryId) : '';
        return country ? country.name : null;
      }

    onSubmitMail(data){
        this.subSunk.sink = this.apiHandlerService.apiHandler('mailCredentials', 'post', {}, {},
            { "supplier_id": data.id })
            .subscribe(resp => {
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
}
