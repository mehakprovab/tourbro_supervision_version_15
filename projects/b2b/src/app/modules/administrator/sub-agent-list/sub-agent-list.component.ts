import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministratorService } from '../administrator.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Location } from '@angular/common';
import * as moment from 'moment';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-sub-agent-list',
    templateUrl: './sub-agent-list.component.html',
    styleUrls: ['./sub-agent-list.component.scss']
})
export class SubAgentListComponent implements OnInit, OnDestroy {
    @Output() subagentUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    pageSize = 10;
    page = 1;
    collectionSize: number = 0;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'sub-agent-list',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };

    constructor(
        private router: Router,
        private administratorService: AdministratorService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private location: Location,
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'ids', value: 'Sl No.' },
        { key: 'first_name', value: 'Name' },
        { key: 'uuid', value: 'Agent ID' },
        { key: 'phone', value: 'Contact No' },
        { key: 'email', value: 'Email' },
        { key: 'created_at', value: 'Registered Date' },
        { key: 'status', value: 'Status' },
        { key: 'privilage', value: 'Privileges' },
        { key: 'action', value: 'Action' },
    ];

    ngOnInit() {
        this.administratorService.subagentUpdateData.next({});
        this.activatedRoute.queryParams.subscribe(params => {
            this.listType = params['type'] == "active" ? 1 : 0;
            this.getSubAgentList(this.listType);
        });

    }
    bookingView() {

    }
    createSubAgent() {
        this.router.navigate(['/administrator/createSubAgent'])
    }
    userProfile() {
        this.router.navigate(['/administrator/agencyUserDetails'])
    }

    getSubAgentList(type) {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.administratorService.fetchSubAgentList()
            .subscribe(resp => {
                if (resp.statusCode == 200 && resp.data.length!=0 || resp.statusCode == 201 && resp.data.length!=0) {
                    this.respData = resp.data.length ? resp.data : this.administratorService.isDevelopement;
                    const filterArray = (array, fields, value) => {
                        fields = Array.isArray(fields) ? fields : [fields];

                        return array.filter((item) => fields.some((field) => item[field] === value));
                    };
                    this.respData = filterArray(this.respData, 'status', type);
                    this.noData = false;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    this.sortData(
                        {
                            active: "created_at",
                            direction: "desc"
                        })
                } else {
                    this.noData = false;
                    this.respData=[];
              }
            }, (err: HttpErrorResponse) => {
                this.noData = false;
                this.respData=[];
            })
    }

    onStatusChange(data) {
        this.subSunk.sink = this.administratorService.updateSubAgent(
            { "status": data.status == 1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Sub Agent status changed successfully.");
                    this.getSubAgentList(this.listType);
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
                case 'uuid': return this.utility.compare('' + a.uuid.toLocaleLowerCase(), '' + b.uuid.toLocaleLowerCase(), isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);

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
        const ts = new Date().toDateString();
        this.exportAsService.save(this.config, `${ts}`)
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    updateSubagent(data) {
        this.administratorService.subagentUpdateData.next(data);
        this.subagentUpdate.emit({ tabId: 'add_update_subagent', data });
    }

    updatePrivillage(data) {
         this.router.navigate(['/administrator/subAgentPrivileges'],{ queryParams: data})
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Name": response.first_name,
                "Agent ID": response.uuid,
                "Contact No": response.phone,
                "Email": response.email,
                "Registered Date": moment(response.created_at).format("MMM DD, YYYY") ,
                "Status": response.status==0?'Inactive':'Active',
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 10 },
            { wch: 10 },
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Sub Agent List',
            columnWidths
        );
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
