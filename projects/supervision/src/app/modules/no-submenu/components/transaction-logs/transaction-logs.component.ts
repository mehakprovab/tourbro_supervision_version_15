import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';

const log = new Logger('NoSubMenu/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.component.html',
    styleUrls: ['./transaction-logs.component.scss']
})
export class TransactionLogsComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    searchForm: FormGroup;
    agentDetails: any;
    searchText: string;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate=new Date();
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

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'date', value: 'Transaction Date' },
        { key: 'uuid', value: 'UserId' },
        { key: 'business_name', value: 'Agency Name' },
        { key: 'first_name', value: 'Agent Name' },
        { key: 'app_reference', value: 'TxnRef.' },
        { key: 'transaction_type', value: 'Type' },
        { key: 'fare', value: 'Amount' },
        { key: 'remarks', value: 'Remarks' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    respUserList: Array<any> = [];
    totalAmount:number=0;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private exportAsService: ExportAsService,
        private util: UtilityService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        let date = new Date();
        let fromDate = this.utility.setAcountFromDate();
        this.searchForm = this.fb.group({
            fromDate: new FormControl('', [Validators.maxLength(120)]),
            toDate: new FormControl('', [Validators.maxLength(120)]),
            transactionId: new FormControl('', [Validators.maxLength(25)]),
            bookingType: new FormControl('', [Validators.maxLength(120)]),
            bookedBy: new FormControl('', [Validators.maxLength(120)]),
        });
        this.setQueryParms(fromDate,date);
        this.searchForm.patchValue({
            fromDate: fromDate,
            toDate: date
        })
        this.getTransactionLogs();
        this.getUserList();
    }
    getUserList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userList', 'post', {}, {}, {
            auth_role_id: 2,
            status: 1
        }).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.respUserList = resp.data;
                if (this.agentDetails && this.agentDetails.id)
                    this.onChange(Number(this.agentDetails.id))
            } else if (resp.statusCode === 404) {
                this.swalService.alert.oops();
            }
        });
    }

    onClickLog(txnId) {
        this.router.navigate(['/transaction-logs/log'], { queryParams: { transaction_id: txnId } });
    }
    onClickVoucher(log, type) {
        switch (type) {
            case 'Flight':
                this.router.navigate(['/report/b2b/voucher/flight'], { queryParams: { appReference: log } });
                break;
            case 'Hotel':
                this.router.navigate(['/report/b2b/voucher/hotel'], { queryParams: { appReference: log } });
                break;
            case 'Car':
                this.router.navigate(['/transaction-logs/voucher/car'], { queryParams: { appReference: log } });
                break;
            default:
                break;
        }
    }
    onSearchSubmit() {
        this.getTransactionLogs();
    }

    onReset() {
        this.searchForm.reset();
        let date = new Date();
        let fromDate = this.utility.setAcountFromDate();
        this.searchForm.patchValue({
            bookingType: '',
            bookedBy: '',
            fromDate: fromDate,
            toDate: date
        });
        this.searchText="";
        this.getTransactionLogs();
    }

    getTransactionLogs() {
        this.noData = true;
        this.respData = [];
        let req = {};
        if (!this.utility.isEmpty(this.searchForm.value)) {
            req = {
                "from": this.searchForm.value.fromDate ? formatDate(this.searchForm.value.fromDate, 'YYYY-MM-DD') : "",
                "to": this.searchForm.value.toDate ? formatDate(this.searchForm.value.toDate, 'YYYY-MM-DD') : "",
                "agent_id": this.searchForm.value.bookedBy,
                "transaction_type": this.searchForm.value.bookingType,
                "app_reference": this.searchForm.value.transactionId,
            }
        } else {
            req = {}
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('masterLog', 'post', {}, {}, req)
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    if(respDataCopy && respDataCopy.length){
                        this.calculateTotalAmount(respDataCopy);
                    }
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
    
    onChange(agent_id) {
        this.agentDetails = this.respData.find(val => val.id == agent_id);
        if (!this.util.isEmpty(this.agentDetails)) {
        }
    }
    download(type: SupportedExtensions, orientation?: string) {
        let filename = this.collectionSize == 1 ? "" : "";
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
       this.exportAsService.save(this.config, filename);
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
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
    sortedData = this.respData.slice();
    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            // const isAsc = sort.direction === 'asc';
            // switch (sort.active) {
            //     case 'transaction_type': return this.utility.compare('' + a.transaction_type.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
            //     case 'created_datetime': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
            //     case 'transaction_owner_id': return this.utility.compare('' + a.transaction_owner_id, '' + b.transaction_owner_id, isAsc);
            //     case 'app_reference': return this.utility.compare('' + a.app_reference.toLocaleLowerCase(), '' + b.app_reference.toLocaleLowerCase(), isAsc);
            //     case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
            //     case 'company': return this.utility.compare('' + a.company.toLocaleLowerCase(), '' + b.company.toLocaleLowerCase(), isAsc);
            //     case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
            //     default: return 0;
            // }

            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
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
            this.getTransactionLogs();
        }
    }

    setQueryParms(fromDate,date){
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (queryParams) {
                let bookedBy = (queryParams['BookedBy']);
                let bookingType = (queryParams['Type']);
                if (bookedBy && bookingType) {
                    this.searchForm.patchValue({
                        bookedBy: bookedBy,
                        bookingType: bookingType
                    })
                }
                else{
                    this.searchForm.patchValue({
                        bookedBy: "",
                        bookingType: "",
                    })
                    this.getTransactionLogs();
                    this.getUserList();
                }
            }
        });
    }

    calculateTotalAmount(response){
        if(response){
            this.totalAmount=0;
            response.forEach(element => {
                if (element.fare.toString().indexOf("-") == 0) {
                    element.fare=element.fare.toString().replace('-', '')
                    this.totalAmount += (+element.fare);
                }
                else {
                    this.totalAmount += (+element.fare);
                }
            });
        }
    }

    exportExcel(): void { 
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Transaction Date":moment(response.created_at).format("MMM DD, YYYY, hh:mm:ss A"),
                "uuid": response.uuid,
                "Agency Name": response.business_name,
                "Agent Name": response.first_name+" "+response.middle_name+" "+response.last_name,
                "TxnRef": response.app_reference,
                "Type": response.transaction_type,
                "Amount": response.fare,
                "Remarks":response.remarks,
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 30 },
            { wch: 30 },
            { wch: 40 },
            { wch: 40 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 50 }
        ];

        this.utility.exportToExcel(
         fileToExport,
         'Transaction Log',
         columnWidths
       );
      }
   
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
