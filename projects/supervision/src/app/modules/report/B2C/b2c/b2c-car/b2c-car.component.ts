import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

const log = new Logger('report/B2cCarComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2c-car',
  templateUrl: './b2c-car.component.html',
  styleUrls: ['./b2c-car.component.scss']
})
export class B2cCarComponent implements OnInit,OnDestroy {

  private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Reservation Code' },
        { key: 'Status', value: 'Status' },
        { key: 'CarName', value: 'Car Name' },
        { key: 'Supplier', value: 'Supplier Name' },
        { key: 'Phone', value: 'Confirmation No' },
        { key: 'HotelAddress', value: 'Driver Name(Last Name/First Name/Title)' },
        { key: 'Email', value: 'Phone' },
        { key: 'htb', value: 'Pick Up' },
        { key: 'FirstName', value: 'Pick Up Date/Time' },
        { key: 'FirstName', value: 'Drop off' },
        { key: 'PassengerList', value: 'Drop Off Date/Time' },
        { key: 'HotelCheckIn', value: 'Rental Rate' },
        { key: 'HotelCheckOut', value: 'Admin Markup' },
        { key: 'NoOfNights', value: 'Convenience Fee' },
        { key: 'NoOfRooms', value: 'Promo Code' },
        { key: 'AdminMarkup', value: 'Promocode Amount' },
        { key: 'ConvenienceFee', value: 'Reward Discount' },
        { key: 'PromoCode', value: 'Total' },
        { key: 'PromoCodeAmount', value: 'Currency' },
        { key: 'Discount', value: 'Payment Method' },
        { key: 'Discount', value: 'Booked On' },
        { key: 'TotalFare', value: 'Billing Type' },       
        
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'b2c-car-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showModal : boolean;
    showCancelModal : boolean;
    currentRecord : any;
    paxDetails : any = {
        "Title" : "",
        "FirstName" : "",
        "LastName" : "",
    };
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(15)]),
            phone_number: new FormControl('', [Validators.maxLength(10)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
        this.getB2cCarReport();
    }
    onSearchSubmit() {
        this.noData = true;
        this.respData = [];
        this.getB2cCarReport();
    }

    onReset() {
        this.regConfig.reset();
        if (!this.respData.length) {
            this.getB2cCarReport();
        }
    }
    getB2cCarReport() {
        let date = new Date(),
         fromDate = new Date(date.valueOf()-(30*24*60*60*1000));
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cCarReport', 'post', {}, {},
            {
                "booked_from_date": this.regConfig.value.booked_from_date ? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : formatDate(fromDate,'YYYY-MM-DD'),
                "booked_to_date": this.regConfig.value.booked_to_date ? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : formatDate(date,'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "phone_number": this.regConfig.value.phone_number || "",
                "email": this.regConfig.value.email || "",
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = true;
                    this.swalService.alert.error(resp.msg || '');
                }
            });
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
                case 'transaction_type': return this.utility.compare('' + a.transaction_type.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
                case 'created_datetime': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
                case 'transaction_owner_id': return this.utility.compare('' + a.transaction_owner_id, '' + b.transaction_owner_id, isAsc);
                case 'app_reference': return this.utility.compare('' + a.app_reference.toLocaleLowerCase(), '' + b.app_reference.toLocaleLowerCase(), isAsc);
                case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
                case 'company': return this.utility.compare('' + a.company.toLocaleLowerCase(), '' + b.company.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        console.log("in transaction logs", $event)
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
            this.getB2cCarReport();
        }
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2c-CarReport`)
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    showPaxProfile(data){
        this.showModal = true;
        this.currentRecord = data;
    }

    showCancelPolicy(data){
        this.showCancelModal = true;
       this.currentRecord = data;
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
