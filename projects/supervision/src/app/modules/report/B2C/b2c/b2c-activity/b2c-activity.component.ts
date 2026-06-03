import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const log = new Logger('report/B2cActivityComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-b2c-activity',
    templateUrl: './b2c-activity.component.html',
    styleUrls: ['./b2c-activity.component.scss']
})
export class B2cActivityComponent implements OnInit, OnDestroy {

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
        { key: 'id', value: 'S No.' },
        { key: 'Action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'app_reference', value: 'Application Reference' },
        { key: 'booking_reference', value: 'Confirmation Reference' },
        { key: 'paymentmode', value: 'Payment Mode' },
        { key: 'supplier_name', value: 'Supplier name' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'Email', value: 'Lead Passenger Email' },
        { key: 'PhoneNumber', value: ' Phone' },
        { key: 'noofpax', value: 'No Of Pax' },
        { key: 'modality', value: 'Modality Name' },
        { key: 'ProductName', value: 'Activity Name' },
        { key: 'duration', value: 'Duration' },
        { key: 'City', value: 'City' },
        { key: 'country', value: 'Country' },
        { key: 'TravelDatetimeFrom', value: 'Activity Date From ' },
        { key: 'TravelDatetimeTo', value: 'Activity Date To' },
        { key: 'supplier_net_fare', value: 'Supplier Net Fare' },
        { key: 'admin_markup', value: 'Admin Markup' },
        { key: 'ConvenienceFee', value: 'Convenience Fee' },
        { key: 'discount', value: 'Discount' },
        { key: 'CustomerPaidAmount', value: 'Total Net ' },
        { key: 'Currency', value: 'Currency' },
        { key: 'BookedOn', value: 'BookedOn' },
        { key: 'guide_info', value: 'Guide Info' },
        { key: 'PaidOn', value: 'Paid On' },
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        { key: 'cancelledOn', value: 'Cancelled On' },
        { key: 'cancelledamt', value: 'Cancelled Amount' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'b2c-activity-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showModal: boolean;
    showCancelModal: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    paxData: any = [];
    maxDate = new Date();
    searchText: string;
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    load: boolean = false;
 driverName: string;
    driverMobile: string;
    app_reference: string;
    booking_source: string;
    showUpdateGuideInfo: boolean;
    loggerUserAuthId: any;
isExporting = false;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router
    ) { }

    ngOnInit() {
        const currentDomainUser = localStorage.getItem('currentDomainUser');
    this.loggerUserAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
    if(this.loggerUserAuthId === 7) {
        this.displayColumn.splice(11, 1);
        this.displayColumn.splice(18 , 5);
    }
        let date = new Date(),
            fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
        let tommorow = date;
        tommorow.setDate(tommorow.getDate() + 1);

        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(15)]),
            phone_number: new FormControl('', [Validators.maxLength(10)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });

        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        })

        this.getB2cActivityReport();
    }

    onSearchSubmit() {
        this.getB2cActivityReport();
    }

    onReset() {
        this.regConfig.get('app_reference').reset();
        this.regConfig.get('phone_number').reset();
        this.regConfig.get('email').reset();
        this.regConfig.patchValue({
            status: 'ALL',
        });
        this.searchText = "";
        this.getB2cActivityReport();
    }

    getB2cActivityReport() {
        this.noData = true;
        this.respData = [];
        const currentDomainUser = localStorage.getItem('currentDomainUser');
        const getLoggedAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
        const getLoggedUserId = JSON.parse(currentDomainUser)['id'];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cActivityReport', 'post', {}, {},
            {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
                "booked_to_date": formatDate( this.regConfig.value.booked_to_date,'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "BOOKING_CONFIRMED",
                "app_reference": this.regConfig.value.app_reference || "",
                "phone_number": this.regConfig.value.phone_number || "",
                "email": this.regConfig.value.email || "",
                "supplier_id": getLoggedUserId,
                "userType": getLoggedAuthId
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    console.log("this.respData",this.respData)
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
            this.getB2cActivityReport();
        }
    }

   download(type: any, orientation?: string) {
    this.isExporting = true;

    setTimeout(() => {
        this.config.type = type;
        if (type === 'xlsx' || type === 'xls') {
            this.utility.downloadElementAsExcel(this.config.elementIdOrContent, 'b2c-activity');
            this.isExporting = false;
            return;
        }
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }

        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `b2c-ActivityReport`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
         

    }, 300);
}

  downloadPdf() {
    this.isExporting = true;

    setTimeout(() => {
        const element = document.getElementById('b2c-activity-report');

        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');

            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('b2c-ActivityReport.pdf');

            this.isExporting = false;
            this.swalService.alert.success();
        });

    }, 300);
}

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    showPaxProfile(data) {
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.BookingPaxDetails[0];
    }

    showCancelPolicy(data) {
        this.showCancelModal = true;
        this.currentRecord = data;
    }

    onActivityRedirect(appRef, type) {
        if (type == 'voucher')
            this.router.navigate(['/report/b2c-activity/voucher'], { queryParams: { appReference: appRef } });
        else if (type == 'invoice')
            this.router.navigate(['/report/b2c-activity/invoice'], { queryParams: { appReference: appRef } });
        else
            return false;
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
        this.booking_source = data.BookingDetails.searchData.booking_source;
    }

    cancelTicket() {
        let data = this.cancelData;
        this.showConfirm = false;
        this.load = true;
        let reqBody = {
            "AppReference": data.BookingDetails.AppReference,
            "UserType": "B2C",
            "booking_source": this.booking_source
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelActivityBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.load = false;
                this.getB2cActivityReport();
            }
        }, err => {
            this.load = false;
            this.swalService.alert.oops(err.error.Message);
        });
    }

    hide() {
        this.showModal = false;
        this.showCancelModal = false;
        this.showConfirm = false;
        this.showUpdateGuideInfo = false;
    }

    getPaxTypeCounts(data): { [key: number]: number } {
        const counts: { [key: number]: number } = {};
        data.pax.forEach(item => {
            const paxType = item.pax_type;
            if (paxType) {
                counts[paxType] = (counts[paxType] || 0) + 1;
            }
        });
        return counts;
    }


    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    getPaxData(data) {
        if(data) {
            const adultCount = data.adultCount;
            const childCount = data.childCount;
            const childAges = data.ChildAge.length ? `(${data.ChildAge.join(' Yrs, ') + ' Yrs, '})` : '';
            return `${adultCount? (adultCount + 'Adult ') : ''} ${childCount ? (','+childCount + 'Child, ' ): ''} ${childAges}`
        }
    }

    
  showUpdateGuideInfoModal(data) {
    this.showUpdateGuideInfo = true;
    this.app_reference = data.BookingDetails.AppReference;
    this.booking_source = data.BookingDetails.searchData.booking_source;
  }

  
  subminGuideInfo() {
    if (this.driverName === '' || this.driverMobile === '') {
        this.swalService.alert.oops('Please fill Guide infoemation');
        return;
    } 
    const payLoad = {
        "AppReference": this.app_reference,
        "booking_source": this.booking_source,
        "guide_name": this.driverName,
        "guide_contact": this.driverMobile
    }
    this.apiHandlerService.apiHandler('updateGuideInd', 'POST', {}, {}, payLoad).subscribe({
        next:(res) => {
            if(res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                this.swalService.alert.success('Guide Information is Updated successfully');
                this.showUpdateGuideInfo = false;
            } else {
                this.swalService.alert.oops(res.Message)
            }
        }, error: (err) => {
            this.swalService.alert.error(err.error.Message);
        }
    })
  }

}
