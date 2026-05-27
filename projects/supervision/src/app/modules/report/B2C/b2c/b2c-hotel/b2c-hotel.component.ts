import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

const log = new Logger('report/B2cHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-b2c-hotel',
    templateUrl: './b2c-hotel.component.html',
    styleUrls: ['./b2c-hotel.component.scss']
})
export class B2cHotelComponent implements OnInit, OnDestroy {

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

    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    pageSize = 100;
    page = 1;
    collectionSize: number;
    searchText: string = '';
    loggedInUser: any;
    totalAPIPayablePrice: number = 0;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Status' },
        { key: 'SupplierName', value: 'Supplier Name' },
        { key: 'SupplierType', value: 'Supplier Type' },
        { key: 'SupplierReference', value: 'Supplier Reference' },
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'HotelAddress', value: 'Hotel Location' },
        { key: 'PhoneNumber', value: 'Phone' },
        { key: 'Email', value: 'Email' },
        // { key: 'htb', value: 'HTB/GTA No' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'HotelCheckIn', value: 'Checkin Date' },
        { key: 'HotelCheckOut', value: 'Checkout Date' },
        { key: 'NoOfNights', value: 'No Of Nights' },
        { key: 'NoOfRooms', value: 'No Of Rooms' },
        // { key: 'RoomPrice', value: 'Room Rate' },
        { key: 'AdminMarkup', value: 'Admin Markup' },
        { key: 'ConvenienceFee', value: 'Convenience Fee' },
        { key: 'PromoCode', value: 'Promocode' },
        { key: 'PromoCodeAmount', value: 'Promocode Amount' },
        { key: 'Early', value: 'Early Bird Discount' },
        { key: 'Duration', value: 'Duration Of Stay' },
        // { key: 'Discount', value: 'Reward Discount' },
        { key: 'supplier_net', value: 'Supplier Netfare' },
        // { key: 'supplier_pay', value: 'Supplier Payable' },
        // { key: 'supplier_currency', value: 'Difference' },
        { key: 'TotalFare', value: 'Total' },
        { key: 'Currency', value: 'Currency' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        { key: 'cancellation_amount', value: 'Cancellation Amount' },
        { key: 'cancelledDatetime', value: 'Cancelled On' }

    ];
    displaySupplierColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Booking Status' },
        // { key: 'SupplierName', value: 'Supplier Name' },
        // { key: 'SupplierType', value: 'Supplier Type' },
        { key: 'SupplierReference', value: 'Supplier Reference' },
               { key: 'payment', value: 'Payment Status' },
           { key: 'HCN', value: 'HCN' },
 
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'HotelAddress', value: 'Hotel Location' },
        { key: 'PhoneNumber', value: 'Phone' },
        // { key: 'Email', value: 'Email' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'HotelCheckIn', value: 'Checkin Date' },
        { key: 'HotelCheckOut', value: 'Checkout Date' },
        { key: 'NoOfNights', value: 'No Of Nights' },
        { key: 'NoOfRooms', value: 'No Of Rooms' },
        // { key: 'RoomPrice', value: 'Room Rate' },

        // { key: 'Early', value: 'Early Bird Discount' },
        // { key: 'Duration', value: 'Duration Of Stay' },
        // { key: 'Discount', value: 'Reward Discount' },
        { key: 'supplier_net', value: 'Supplier Netfare' },
        // { key: 'supplier_pay', value: 'Supplier Payable' },
        // { key: 'supplier_currency', value: 'Difference' },
        // { key: 'TotalFare', value: 'Total' },
        { key: 'Currency', value: 'Currency' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        // { key: 'cancellation_amount', value: 'Cancellation Amount' },
        { key: 'cancelledDatetime', value: 'Cancelled On' },
        // { key: 'booking247_settlement', value: 'Booking247 Settlement' },

    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'b2c-hotel-report',
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
    paxDetails: any = {
        "Title": "",
        "FirstName": "",
        "LastName": "",
    };
    maxDate = new Date();
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    load: boolean = false;
    hotelApiList: any;
        public showBookSource: any;
    public isUpdate: any;
    showConfirmHCN: boolean = false;
    hcnData: any;
        hotelTypeForm: FormGroup;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
        let date = new Date(),
        fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
        let tommorow = this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            phone_number: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
            Api_id: new FormControl(''),
        });

        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        });
        this.getB2cHotelReport();
        this.getHotelApiList();
              this.hotelTypeForm = this.fb.group({
            hcnNumber: new FormControl('', [Validators.maxLength(50)]),
        })
    }

    onSearchSubmit() {
        this.getB2cHotelReport();
    }

    getHotelApiList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelManageApiList', 'post', {}, {}, {
            module: 'hotel',
            userType: "B2C",
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.hotelApiList = resp.data || [];
            }
            else {
                this.swalService.alert.error(resp.msg || '');
            }
        })
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: toDate
        });
        this.searchText = "";
        this.getB2cHotelReport();
    }

    getB2cHotelReport() {
        this.noData = true;
        this.respData = [];
        this.totalAPIPayablePrice = 0;
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHotelReport', 'post', {}, {},
            {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'), // ? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : formatDate(fromDate,'YYYY-MM-DD'),
                "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "BOOKING_CONFIRMED",
                "app_reference": this.regConfig.value.app_reference || "",
                "phone_number": this.regConfig.value.phone_number || "",
                "email": this.regConfig.value.email || "",
                "Api_id": this.regConfig.value.Api_id || "",
            })
            .subscribe(resp => {
                if (resp.data && resp.data.length > 0 && Array.isArray(resp.data)) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    if ((this.regConfig.value.Api_id && this.regConfig.value.Api_id !== '') ||
                        this.regConfig.value.Api_id === "TLAPNO00003") {
                        if (this.regConfig.value.status === "BOOKING_CONFIRMED") {
                            this.calculateTotalAPIPayablePrice();
                        }
                    }

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

    calculateTotalAPIPayablePrice() {
        this.totalAPIPayablePrice = this.respData.reduce((sum, item) => sum + (item.BookingDetails.API_Payable_Price || 0), 0);
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
                remarks: objData.remarks,
                Api_id: objData.Api_id
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
            this.getB2cHotelReport();
        }
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2c-HotelReport`)
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
        console.log(this.currentRecord);
        this.paxDetails = data.BookingPaxDetails.filter(x => {
            return x.LeadPax == true
        });
        this.paxDetails = this.paxDetails[0];
    }

    filterByPassengers(list) {
        return list.filter(x => x.LeadPax == false);
    }

    findLeaduserDetails(data) {
        if (data.length) {
            let leadUser = data.filter(x => {
                return x.LeadPax == true
            });
            return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

    onActivityRedirect(appRef, type) {
        if (type == 'voucher')
            this.router.navigate(['/report/b2c-hotel/voucher'], { queryParams: { appReference: appRef } });
        else if (type == 'invoice')
            this.router.navigate(['/report/b2c-hotel/invoice'], { queryParams: { appReference: appRef } });
        else
            return false;
    }

    downloadPdf() {
        const element = document.getElementById('b2c-hotel-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2C_Hotel_Report.pdf');
            this.swalService.alert.success();
        });
    }

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }
    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }
    cancelBooking() {
        this.loading = true;
        let hotelData = this.cancelData;
        console.log("this.cancelData", this.cancelData)
        let reqBody = {
            "AppReference": hotelData.BookingDetails.AppReference,
            "booking_source": hotelData.BookingDetails.booking_source
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelHotelBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.showConfirm = false;
                this.loading = false;
                this.getB2cHotelReport();
            }
        }, err => {
            if (err.status == 400)
                this.swalService.alert.oops(err.error.Message);
            this.showConfirm = false;
             this.loading = false;
        });
    }
    hide() {
        this.showConfirm = false;
        this.showModal = false;
        //    this.supplierSettlementModal = false;
        this.showConfirmHCN = false;
        this.hotelTypeForm.reset();
    }
    formatDateString(dateString: string): string {
        const [day, month, year] = dateString.split(' ')[0].split('-');
        return `${day}/${month}/${year}`;
    }
    getEarliestCancellationDate(data): Date | null {
        if (!data.BookingDetails.CancellationReason.hotelBody.RoomDetails) {
            return null;
        }

        let allDates: Date[] = [];

        data.BookingDetails.CancellationReason.hotelBody.RoomDetails.forEach(room => {
            if (room.CancellationPolicies && room.CancellationPolicies.$t.length > 0) {
                room.CancellationPolicies.$t.forEach(policy => {
                    if (policy.date_from) {
                        allDates.push(new Date(policy.date_from));
                    }
                });
            }
        });

        if (allDates.length === 0) {
            return null; // No cancellation policies exist
        }

        // Find the earliest date
        let earliestDate = new Date(Math.min(...allDates.map(date => date.getTime())));

        // Subtract one day from the earliest date
        earliestDate.setDate(earliestDate.getDate() - 1);

        return earliestDate;
    }

    getTotalAmountAndCharge(data): { amount: number, currency: string } {
        if (!data.BookingDetails.CancellationReason.hotelBody.RoomDetails) {
            return { amount: 0, currency: '' };
        }

        let totalAmount = 0;
        let currency = '';

        data.BookingDetails.CancellationReason.hotelBody.RoomDetails.forEach(room => {
            // Add room price
            if (!room.CancellationPolicies.$t.length) {
                totalAmount = (data.BookingDetails.TotalAmount);
                currency = room.Price.Currency || currency; // Use currency from first entry
            }

            // Add cancellation charges
            if (room.CancellationPolicies.$t.length) {
                totalAmount = 0
                currency = room.CancellationPolicies.$t[0].currency || currency;
                // room.CancellationPolicies.$t[0].forEach(policy => {
                //     if (policy.charge) {
                //         totalAmount += parseFloat(policy.charge);
                //         currency = policy.currency || currency; // Use currency from first available policy
                //     }
                // });
            }
        });

        return { amount: totalAmount, currency };
    }

        showAddHCN(data,status) {
        this.hcnData = data
        this.showConfirmHCN = true;
        this.showBookSource = data.BookingDetails.booking_source;
        this.isUpdate = status;
        if(status)
        this.hotelTypeForm.patchValue({
            hcnNumber: data.BookingDetails.hcn_number,
        });
    }
    
addHCN() {
    let hotelData = this.hcnData;
    console.log("hotelData", hotelData)
    let reqBody = {
        "app_reference": hotelData.BookingDetails.AppReference,
        "hcnNumber": this.hotelTypeForm.value.hcnNumber
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('adHcnNumber', 'post', '', '', reqBody).subscribe(res => {
        if (res) {
            this.swalService.alert.success("HCN added successfully");
            // Fire and forget - don't wait for email response
            this.hotelHCNEmail(hotelData.BookingDetails.AppReference).subscribe({
                next: (emailRes) => {
                    console.log("Email sent successfully:", emailRes);
                },
                error: (err) => {
                    console.error("Email notification failed:", err);
                    // Optional: Show user that email failed but HCN was added
                    this.swalService.alert.warning("HCN added but email notification failed");
                }
            });
            this.showConfirmHCN = false;
            this.hotelTypeForm.reset();
            this.getB2cHotelReport();
        }
    }, err => {
        if (err.status == 400)
            this.swalService.alert.oops(err.error.Message);
        this.showConfirmHCN = false;
    });
}
     hotelHCNEmail(appReference) {
    let payLoad;
    if(this.isUpdate) {
        payLoad = {
            booking_source: this.showBookSource,
            AppReference: appReference,
            amend: 1   
        }
    } else {
        payLoad = {
            booking_source: this.showBookSource,
            AppReference: appReference
        }
    }
    
    console.log("Sending email API with payload:", payLoad);
    
    return this.apiHandlerService.apiHandler('hotelHCNEmail','POST','','',payLoad).pipe(
        tap(response => {
            console.log("Email API response:", response);
        }),
        catchError(error => {
            console.error("Email API error:", error);
            return of(error);
        })
    );
}
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
