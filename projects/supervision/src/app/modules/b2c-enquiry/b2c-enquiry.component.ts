import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsService } from 'ngx-export-as';

const log = new Logger('b2c-enquiry/B2cEnquiryComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2c-enquiry',
  templateUrl: './b2c-enquiry.component.html',
  styleUrls: ['./b2c-enquiry.component.scss']
})
export class B2cEnquiryComponent implements OnInit {

 private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'agency_name', value: 'Name' },
        { key: 'email_id', value: 'Email' },
        { key: 'phone_number', value: 'Contact Info' },
        { key: 'reference_id', value: 'Reference Id' },
        { key: 'ticket_number', value: 'Ticket No' },
        { key: 'remarks', value: 'Message' },
        { key: 'requested_date', value: 'Requested Date' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    maxDate=new Date();
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            requested_date_from: new FormControl('', [Validators.maxLength(120)]),
            requested_date_to: new FormControl('', [Validators.maxLength(120)]),
            contact_info: new FormControl('', [Validators.maxLength(10)]),
            ticket_number: new FormControl('', [Validators.maxLength(20)]),
            email_id: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        });
        this.getHelpdeskEnquiry();
    }

    onSearchSubmit() {
        this.getHelpdeskEnquiry();
    }

    onReset() {
        this.regConfig.reset();
        this.getHelpdeskEnquiry();
    }

    getHelpdeskEnquiry() {
        this.respData=[];
        this.noData=true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('coreHelpdeskList', 'post', {}, {},
            {
                "requested_date_from": this.regConfig.value.requested_date_from ? formatDate(this.regConfig.value.requested_date_from, 'YYYY-MM-DD') : "",
                "requested_date_to": this.regConfig.value.requested_date_to ? formatDate(this.regConfig.value.requested_date_to, 'YYYY-MM-DD') : "",
                "phone_number": this.regConfig.value.contact_info || "",
                "email_id": this.regConfig.value.email_id || "",
                "ticket_number":this.regConfig.value.ticket_number || "",
                "booking_source":"B2B",
            })
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
            })
    }


    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.agent,
                transactiondate: objData.transaction,
                app_refernce: objData.app_refernce,
                transactiontype: objData.transactiontype,
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
                case 'agency_name': return this.utility.compare('' + a.agency_name.toLocaleLowerCase(), '' + b.agency_name.toLocaleLowerCase(), isAsc);
                case 'requested_date': return this.utility.compare('' + a.requested_date, '' + b.requested_date, isAsc);
                case 'phone_number': return this.utility.compare('' + a.phone_number, '' + b.phone_number, isAsc);
                case 'ticket_number': return this.utility.compare('' + a.ticket_number.toLocaleLowerCase(), '' + b.ticket_number.toLocaleLowerCase(), isAsc);
                case 'reference_id': return this.utility.compare(+a.reference_id, +b.reference_id, isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        let resultData = [];
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                resultData = this.respData.filter(function (a) {
                    return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.toDate).getTime())
                });
            } else if ($event.transactionId) {
                resultData = this.respData.filter(b => {
                    return b.app_refernce == $event.transactionId;
                })
            }
            this.respData = resultData;
            respDataCopy = [...this.respData];
            this.collectionSize = respDataCopy.length;
        } else {
            this.getHelpdeskEnquiry();
        }
    }

}
