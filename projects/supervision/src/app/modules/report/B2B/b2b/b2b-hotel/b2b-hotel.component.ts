import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const log = new Logger('report/B2cHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-b2b-hotel',
    templateUrl: './b2b-hotel.component.html',
    styleUrls: ['./b2b-hotel.component.scss']
})
export class B2bHotelComponent implements OnInit {
    private subSunk = new SubSink();
    regConfig: FormGroup;
    hotelTypeForm: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'b2b-hotel-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    totalAPIPayablePrice: number = 0;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Status' },
        { key: 'BookingType', value: 'Booking Type'},
        { key: 'PaymentMode', value: 'Payment Mode' },
        { key: 'PaidMode', value: 'Paid On' },
        { key: 'PaymentStatus', value: 'Payment Status' },
        { key: 'agencyName', value: 'Agency Name' },
        { key: 'SupplierName', value: 'Supplier Name' },
        { key: 'SupplierType', value: 'Supplier Type' },
        { key: 'SupplierReference', value: 'Supplier Reference' },
        { key: 'hcn', value: 'HCN' },
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'HotelAddress', value: 'Hotel Location' },
        { key: 'PhoneNumber', value: 'Agent Phone' },
        { key: 'Email', value: 'Agent Email' },
        // { key: 'htb', value: 'HTB/GTA No' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'HotelCheckIn', value: 'Checkin Date' },
        { key: 'HotelCheckOut', value: 'Checkout Date' },
        { key: 'NoOfNights', value: 'No Of Nights' },
        { key: 'NoOfRooms', value: 'No Of Rooms' },
        // { key: 'RoomPrice', value: 'Room Rate' },
        { key: 'baseFare', value: 'Base Fare' },
        { key: 'AdminMarkup', value: 'Admin Markup' },
        { key: 'AgentMarkup', value: 'Agent Markup' },
        // { key: 'PromoCodeAmount', value: 'Promocode Amount' },
        { key: 'agent_net', value: 'Supplier Netfare' },
        // { key: 'supplier_pay', value: 'Supplier Payable' },
        // { key: 'supplier_currency', value: 'Difference' },
        { key: 'TotalFare', value: 'Total' },
        { key: 'Booked_Currency', value: 'Booked Currency' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        { key: 'cancelledDatetime', value: 'Cancelled On' }
    ];

    displaySupplierColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Booking Status' },
        { key: 'BookingType', value: 'Booking Type'},
        // { key: 'PaymentMode', value: 'Payment Mode' },
        // { key: 'PaidMode', value: 'Paid On' },
        // { key: 'PaymentStatus', value: 'Payment Status' },
        // { key: 'agencyName', value: 'Agency Name' },
        // { key: 'SupplierName', value: 'Supplier Name' },
        // { key: 'SupplierType', value: 'Supplier Type' },
        { key: 'SupplierReference', value: 'Supplier Reference' },
        { key: 'hcn', value: 'HCN' },
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'HotelAddress', value: 'Hotel Location' },
        { key: 'PhoneNumber', value: 'Lead Passenger Phone' },
        // { key: 'Email', value: 'Email' },
        // { key: 'htb', value: 'HTB/GTA No' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'HotelCheckIn', value: 'Checkin Date' },
        { key: 'HotelCheckOut', value: 'Checkout Date' },
        { key: 'NoOfNights', value: 'No Of Nights' },
        { key: 'NoOfRooms', value: 'No Of Rooms' },
        // { key: 'RoomPrice', value: 'Room Rate' },
        // { key: 'AdminMarkup', value: 'Admin Markup' },
        // { key: 'AgentMarkup', value: 'Agent Markup' },
        // { key: 'PromoCodeAmount', value: 'Promocode Amount' },
        { key: 'supplier_net', value: 'Supplier Netfare' },
        // { key: 'supplier_pay', value: 'Supplier Payable' },
        // { key: 'supplier_currency', value: 'Difference' },
        // { key: 'TotalFare', value: 'Total' },
        { key: 'Booked_Currency', value: 'Booked Currency' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        { key: 'cancelledDatetime', value: 'Cancelled On' },
        // { key: 'booking247_settlement', value: 'Booking247 Settlement' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal: boolean;
    showCancelModal: boolean;
    currentRecord: any = [];
    paxDetails: any = {
        "Title": "",
        "FirstName": "",
        "LastName": "",
    };
    searchText: string = "";
    maxDate = new Date();
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    showConfirmHCN: boolean = false;
    hcnData: any;
    loggedInUser: any;
    hotelApiList: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
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

        this.hotelTypeForm = this.fb.group({
            hcnNumber: new FormControl('', [Validators.maxLength(50)]),
        })

        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        })
        this.getB2bHotelReport();
        this.getHotelApiList();
    }
    onSearchSubmit() {
        this.getB2bHotelReport();
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: tommorow
        });
        this.searchText = "";
        this.getB2bHotelReport();
    }

    getB2bHotelReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        this.totalAPIPayablePrice = 0;
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
                "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "email": this.regConfig.value.email || "",
                "phone_number": this.regConfig.value.phone_number || "",
                "Api_id": this.regConfig.value.Api_id || "",
            }
        } else {
            reqBody = {}
        } this.subSunk.sink = this.apiHandlerService.apiHandler('b2bHotelReport', 'post', {}, {}, reqBody).subscribe(resp => {
            if ( resp.data && resp.data.length > 0 && Array.isArray(resp.data)) {
                this.noData = false;
                
                if (this.loggedInUser['auth_role_id'] !== 1) {
                    this.respData = (resp.data ||[]).filter(data => 
                    data.BookingDetails.Status !== "BOOKING_INPROGRESS"
                )
                } else {
                this.respData = resp.data || [];
                }

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
                const message = resp.message.replace('/0-9/g','')
                this.swalService.alert.oops(message)
                this.noData = false;
                this.respData = [];
            }
        }, (err) => {
            this.noData = false;
            this.respData = [];
        });
    }

    noOfNights(i, o) {
        return this.utility.calculateDiff(i, o);
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

    calculateTotalAPIPayablePrice() {
        this.totalAPIPayablePrice = this.respData.reduce((sum, item) => sum + (item.BookingDetails.API_Payable_Price || 0), 0);
    }

    download(type: any, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `b2b-HotelReport`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    downloadPdf() {
        const element = document.getElementById('b2b-hotel-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2B_Hotel_Report.pdf');
            this.swalService.alert.success();
        });
    }

    getHotelApiList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelManageApiList', 'post', {}, {}, {
            module: 'hotel',
            userType: "B2B",
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.hotelApiList = resp.data || [];
            }
            else {
                this.swalService.alert.error(resp.msg || '');
            }
        })
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
            this.getB2bHotelReport();
        }
    }

    showPaymentInfo(data) {

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


    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }
    cancelTicketPopup(data) {
        console.log("data", data)
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    showAddHCN(data,status) {
        this.hcnData = data
        this.showConfirmHCN = true;
        if(status)
        this.hotelTypeForm.patchValue({
            hcnNumber: data.BookingDetails.hcn_number,
        });
    }


    addHCN() {

        let hotelData = this.hcnData;
        console.log("hotelData", hotelData,)
        let reqBody = {
            "app_reference": hotelData.BookingDetails.AppReference,
            "hcnNumber": this.hotelTypeForm.value.hcnNumber
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('adHcnNumber', 'post', '', '', reqBody).subscribe(res => {
            if (res) {
                this.swalService.alert.success("HCN added sucessfully");
                this.showConfirmHCN = false;
                this.hotelTypeForm.reset();
                this.getB2bHotelReport();
            }
        }, err => {
            if (err.status == 400)
                this.swalService.alert.oops(err.error.Message);
            this.showConfirmHCN = false;
        });
    }

    cancelBooking() {
        this.loading = true;
        let hotelData = this.cancelData;
        console.log("hotelData", hotelData,)
        let reqBody = {
            "AppReference": hotelData.BookingDetails.AppReference,
            "booking_source": hotelData.BookingDetails.booking_source
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelHotelBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.showConfirm = false;
                this.loading = false;
                this.getB2bHotelReport()
            }
        }, err => {
            if (err.status == 400)
                this.swalService.alert.oops(err.error.Message);
            this.showConfirm = false;
            this.loading = false;
        });
    }
    hide() {
        this.showConfirmHCN = false;
        this.showConfirm = false;
        this.showModal = false;
        this.hotelTypeForm.reset();
    }
    formatDateString(dateString: string): string {
        const [day, month, year] = dateString.split(' ')[0].split('-');
        return `${day}/${month}/${year}`;
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    cancellationDeadLine(data) {
        if(data.DomainOrigin === 'CRS') {
            return `${data.CancelDeadline} 23:59:00`;
        } else {
            return data.CancelDeadline;
        }
    }

}
