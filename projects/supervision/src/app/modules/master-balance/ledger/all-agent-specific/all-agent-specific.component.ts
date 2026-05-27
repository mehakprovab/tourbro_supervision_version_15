import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import * as moment from 'moment';

const log = new Logger('NoSubMenu/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-all-agent-specific',
    templateUrl: './all-agent-specific.component.html',
    styleUrls: ['./all-agent-specific.component.scss']
})
export class AllAgentSpecificComponent implements OnInit {
    private subSunk = new SubSink();
    regConfig: FormGroup;
    searchText: string;
    isOpen = false as boolean;
    loading: boolean = false;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    pageSize = 50;
    page = 1;
    collectionSize: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'ledger-request',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showFullContent: boolean[] = [];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'created_date', value: 'Date' },
        { key: 'created_time', value: 'Time' },
        { key: 'system_transaction_id', value: 'Inv No' },
        { key: 'app_reference', value: ' Booking Id' },
        { key: 'pnr', value: 'PNR' },
        { key: 'gds_pnr', value: 'GDS PNR' },
        { key: 'ticket_no', value: 'Ticket No' },
        { key: 'uuid', value: 'UserId' },
        { key: 'business_name', value: 'Agency Name' },
        { key: 'agency name', value: 'Agent Name' },
        { key: 'transaction_type', value: 'Transaction Type' },
        { key: 'debit_amount', value: 'Debit Amount' },
        { key: 'credit_amount', value: 'Credit Amount' },
        { key: 'opening_balance', value: 'Opening Balance' },
        { key: 'closing_balance', value: 'Closing Balance' },
        { key: 'remarks', value: 'Remarks' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    agentList: any;
    maxDate = new Date();

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private cdrRef: ChangeDetectorRef
    ) {
        let date = new Date();
        let fromDate = this.utility.setAcountFromDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(20)]),
            type: new FormControl(''),
            bookedBy: new FormControl('', [Validators.maxLength(120)]),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: date
        })
    }

    ngOnInit() {
        this.getAgentsList();
        this.getTransactionLogs();
    }

    getTransactionLogs() {
        this.respData = [];
        this.noData = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('masterLog', 'post', {}, {},
            {
                "transaction_type": this.regConfig.value.type || "",
                "agent_id": this.regConfig.value.bookedBy,
                "app_reference": this.regConfig.value.app_reference || "",
                "from": this.regConfig.value.booked_from_date ? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : "",
                "to": this.regConfig.value.booked_to_date ? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : ""
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data.filter(data => data.transaction_type != 'Credit Limit');
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

    onReset() {
        this.regConfig.reset();
        let date = new Date();
        let fromDate = this.utility.setAcountFromDate();
        this.regConfig.patchValue({
            type: '',
            bookedBy: '',
            booked_from_date: fromDate,
            booked_to_date: date
        });
        this.searchText = "";
        this.getTransactionLogs();
    }


    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.first_name + objData.last_name,
                transactiondate: objData.created_datetime,
                app_refernce: objData.app_reference,
                transactiontype: objData.transaction_type,
                fare: objData.fare,
                remarks: objData.remarks
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

            this.page = 1;
            this.collectionSize = this.respData.length;
    }

    download(type: SupportedExtensions, orientation?: string) {
        let filename = this.collectionSize == 1 ? "" : "";
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, filename).subscribe((_) => {
            // save started
            console.log(`success`);
            this.swalService.alert.success();
        }, (err) => {
            console.log(err);
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'created_date': return this.utility.compare('' + a.created_at.toLocaleLowerCase(), '' + b.created_at.toLocaleLowerCase(), isAsc);
                case 'created_time': return this.utility.compare('' + a.created_at.toLocaleLowerCase(), '' + b.created_at.toLocaleLowerCase(), isAsc);
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id.toLocaleLowerCase(), '' + b.system_transaction_id.toLocaleLowerCase(), isAsc);
                case 'app_reference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'uuid': return this.utility.compare('' + a.uuid, '' + b.uuid, isAsc);
                case 'business_name': return this.utility.compare('' + a.business_name, '' + b.business_name, isAsc);
                case 'transaction_type': return this.utility.compare('' + a.transaction_type, '' + b.transaction_type, isAsc);
                case 'credit_amount': return this.utility.compare(+a.credit_amount, +b.credit_amount, isAsc);
                case 'opening_balance': return this.utility.compare(+a.opening_balance, +b.opening_balance, isAsc);
                case 'debit_amount': return this.utility.compare(+a.debit_amount, +b.debit_amount, isAsc);
                case 'closing_balance': return this.utility.compare('' + a.closing_balance, '' + b.closing_balance, isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.B2B_AUTH_ROLE_ID })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                }
            });
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            let pnr = "";
            let GDS = "";
            let Ticket = "";
            if (response.REF) {
                [, pnr, GDS, Ticket] = response.REF.split("***");
            }
            return {
                "Sl No.":index+1,
                "Date": moment(response.created_at).format("MMM DD, YYYY"),
                "Time": moment(response.created_at).format("hh:mm:ss A"),
                "Inv No": response.system_transaction_id,
                "Booking Id": response.app_reference,
                "PNR": pnr,
                "GDS PNR": GDS,
                "Ticket No": Ticket,
                "User Id": response.uuid,
                "Agency Name": response.business_name,
                "Agent Name": response.first_name + '' + response.middle_name + '' + response.last_name,
                "Transaction Type": response.transaction_type,
                "Debit Amount": response.debit_amount,
                "Credit Amount": response.credit_amount,
                "Opening Balance": response.opening_balance,
                "Closing Balance": response.closing_balance,
                "Remarks": response.remarks
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 },
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 20 },
            { wch: 12 },
            { wch: 12 },
            { wch: 20 },
            { wch: 20 },
            { wch: 50 }
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Ledger',
            columnWidths
        );
    }

    toggleFullContent(index: number): void {
        this.showFullContent[index] = !this.showFullContent[index];
    }
}
