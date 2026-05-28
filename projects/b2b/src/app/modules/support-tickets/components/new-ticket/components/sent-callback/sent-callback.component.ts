import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';

const log = new Logger('support ticket/SentCallbackComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-sent-callback',
    templateUrl: './sent-callback.component.html',
    styleUrls: ['./sent-callback.component.scss']
})
export class SentCallbackComponent implements OnInit {
    regConfig: FormGroup;
    isOpen = false as boolean;
    protected subs = new SubSink();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'ticket_number', value: 'Ticket Number' },
        { key: 'email_id', value: 'Email Id' },
        // { key: 'agency_name', value: 'Agency Name' },
        { key: 'phone_number', value: 'Contact Info' },
        { key: 'reference_id', value: 'Reference Number' },
        { key: 'remarks', value: 'Message' },
        { key: 'requested_date', value: 'Request Date' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'agent-callback-list',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    constructor(
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private fb: FormBuilder,
        private exportAsService: ExportAsService,
    ) { }

    ngOnInit() {
        this.createForm();
        this.getSentCallback();
    }

    onValueChange(value: Date): void {
        this.regConfig.value.requested_date_to = '';
    }

    createForm() {
        this.regConfig = this.fb.group({
            email_id: new FormControl('', [Validators.maxLength(50), Validators.email]),
            phone_number: new FormControl('', [Validators.maxLength(10), Validators.minLength(10)]),
            requested_date_from: new FormControl('', [Validators.maxLength(15)]),
            requested_date_to: new FormControl('', [Validators.maxLength(15)]),
        })
    }

    timelineSearch = [
        { timeline: 0, name: "Today Search" },
        { timeline: 1, name: "Last Day Search" },
        { timeline: 7, name: "One Week Search" },
        { timeline: 30, name: "One Month Search" },
    ]

    timelineFilter(timeline) {
        console.log(timeline);
        if (timeline == 0) {
            this.regConfig.reset();
            this.getSentCallback();
        } else {
            let date = new Date();
            date.setDate(date.getDate() - timeline);
            console.log(date.toString());
            this.regConfig.patchValue({
                requested_date_from: date,
                requested_date_to: new Date()
            });
            this.getSentCallback();
        }

    }

    reset() {
        this.regConfig.reset();
        this.getSentCallback();
    }

    numberOnly(event): boolean {
        // this.openCustomdropdown=false;
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }


    getSentCallback() {
        this.noData = true;
        this.respData = [];
        let req = this.regConfig.value;
        req['booking_source'] = "B2B";
        this.subs.sink = this.apiHandlerService.apiHandler('coreHelpdeskList', 'POST', {}, {}, req).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length>0) {          
                this.noData = false;
                this.respData = res.data;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
                this.sortData(
                    {
                        active: "requested_date",
                        direction: "asc"
                    })
            } else {
                this.respData = [];
                this.noData = false;
            }
        }, (err: HttpErrorResponse) => {
            this.respData = [];
            this.noData = false;
        }
        );
    }

    sortData(sort: Sort) {
        console.log(sort)
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return this.utility.compare(+ a.id, + b.id, isAsc);
                case 'ticket_number': return this.utility.compare('' + a.ticket_number.toLocaleLowerCase(), '' + b.ticket_number.toLocaleLowerCase(), isAsc);
                // case 'agency_name': return this.utility.compare('' + a.agency_name.toLocaleLowerCase(), '' + b.agency_name.toLocaleLowerCase(), isAsc);
                case 'phone_number': return this.utility.compare(+ a.phone_number, + b.phone_number, isAsc);
                case 'reference_id': return this.utility.compare('' + a.reference_id.toLocaleLowerCase(), '' + b.reference_id.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                case 'requested_date': return this.utility.compare(+ a.requested_date, + b.requested_date, isAsc);

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
        this.exportAsService.save(this.config, `agent-callback-list`)
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Ticket Number": response.ticket_number,
                "Email Id":response.email_id,
                "Contact Info":response.phone_number,
                "Reference Number": response.reference_id,
                "Message":response.remarks,
                "Request Date":moment(response.requested_date).format("MMM DD, YYYY") 
            }
        });
    
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 }
        ];
    
        this.utility.exportToExcel(
            fileToExport,
            'Agent Callback',
            columnWidths
        );
    }


}
