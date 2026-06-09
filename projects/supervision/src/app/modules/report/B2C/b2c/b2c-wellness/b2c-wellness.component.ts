import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-b2c-wellness-report',
    templateUrl: './b2c-wellness.component.html',
    styleUrls: ['./b2c-wellness.component.scss']
})
export class B2cWellnessReportComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    loading = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    pageSize = 100;
    page = 1;
    collectionSize = 0;
    searchText = '';
    loggedInUser: any;
    noData = true;
    respData: Array<any> = [];
    showModal = false;
    currentRecord: any = [];
    paxDetails: any = {};

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Status' },
        { key: 'PaymentStatus', value: 'Payment Status' },
        { key: 'SupplierName', value: 'Supplier Name' },
        { key: 'SupplierType', value: 'Supplier Type' },
        { key: 'SupplierReference', value: 'Supplier Reference' },
        { key: 'CenterCode', value: 'Center Code' },
        { key: 'WellnessCenterName', value: 'Wellness Center' },
        { key: 'CenterAddress', value: 'Center Location' },
        { key: 'PackageName', value: 'Package Name' },
        { key: 'PackageType', value: 'Package Type' },
        { key: 'DurationDays', value: 'Duration' },
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'PhoneNumber', value: 'Phone' },
        { key: 'Email', value: 'Email' },
        { key: 'CenterCheckIn', value: 'Checkin Date' },
        { key: 'CenterCheckOut', value: 'Checkout Date' },
        { key: 'NoOfDays', value: 'No Of Days' },
        { key: 'AdminMarkup', value: 'Admin Markup' },
        { key: 'ConvinenceAmount', value: 'Convenience Fee' },
        { key: 'PromoCode', value: 'Promocode' },
        { key: 'Discount', value: 'Discount' },
        { key: 'API_Payable_Price', value: 'Supplier Netfare' },
        { key: 'API_Commission', value: 'Commission' },
        { key: 'TotalAmount', value: 'Total' },
        { key: 'Currency', value: 'Currency' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        { key: 'CancelDeadline', value: 'Cancellation Deadline' },
        { key: 'CancelAmount', value: 'Cancellation Amount' },
        { key: 'CancelledDatetime', value: 'Cancelled On' },
        { key: 'wcn_number', value: 'WCN' }
    ];

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
        const date = new Date();
        const fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
        const tommorow = this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            phone_number: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });

        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        });
        this.getB2cWellnessReport();
    }

    onSearchSubmit() {
        this.getB2cWellnessReport();
    }

    onReset() {
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: this.utility.setFromDate(),
            booked_to_date: this.utility.setToDate()
        });
        this.searchText = '';
        this.getB2cWellnessReport();
    }

    getB2cWellnessReport() {
        this.noData = true;
        this.respData = [];
        const payload = {
            booked_from_date: formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
            booked_to_date: formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
            status: this.regConfig.value.status || 'ALL',
            app_reference: this.regConfig.value.app_reference || '',
            phone_number: this.regConfig.value.phone_number || '',
            email: this.regConfig.value.email || '',
        };

        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cWellnessReport', 'post', {}, {}, payload)
            .subscribe(resp => {
                this.noData = false;
                this.respData = Array.isArray(resp.data) ? resp.data : [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }, () => {
                this.noData = false;
                this.respData = [];
                this.collectionSize = 0;
            });
    }

    sortData(sort: Sort) {
        const data = [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }

        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            return this.utility.compare(
                String(this.getExportValue(a, sort.active, 0)).toLowerCase(),
                String(this.getExportValue(b, sort.active, 0)).toLowerCase(),
                isAsc
            );
        });
    }

    download(type: any, orientation?: string) {
        if (type === 'xlsx' || type === 'xls') {
            this.exportExcel();
            return;
        }
        this.downloadPdf();
    }

    exportExcel(): void {
        const columns = this.displayColumn.filter(column => column.key !== 'action');
        const fileToExport = this.respData.map((response: any, index: number) => {
            return columns.reduce((row, column) => {
                row[column.value] = this.getExportValue(response, column.key, index);
                return row;
            }, {});
        });
        const columnWidths = columns.map(column => {
            return { wch: column.key === 'id' ? 8 : Math.max(column.value.length + 5, 20) };
        });

        this.utility.exportToExcel(fileToExport, 'B2C_Wellness_Report', columnWidths);
    }

    getExportValue(data: any, key: string, index: number): any {
        const booking = this.getBooking(data);
        const center = this.getCenterBody(data);
        const packageDetails = this.getPackageDetails(data);

        switch (key) {
            case 'id': return index + 1;
            case 'Status': return this.getBookingStatusLabel(booking.Status);
            case 'SupplierName': return center.SupplierName || booking.business_name || 'N/A';
            case 'SupplierType': return booking.DomainOrigin || 'N/A';
            case 'SupplierReference': return this.cleanValue(booking.ConfirmationReference);
            case 'PackageName': return this.cleanValue(packageDetails.PackageName);
            case 'PackageType': return this.cleanValue(packageDetails.PackageType);
            case 'DurationDays': return this.cleanValue(packageDetails.DurationDays);
            case 'FirstName': return this.findLeaduserDetails(data);
            case 'NoOfDays': return center.NoOfDays || this.calculateDiff(booking.CenterCheckIn, booking.CenterCheckOut);
            case 'Discount': return booking.Discount || center.Price && center.Price.EligibleDiscount || 0;
            case 'API_Commission': return booking.API_Commission || center.Price && center.Price.Commission || 0;
            case 'CancelAmount': return booking.CancelAmount || '-';
            case 'CancelledDatetime': return booking.Status === 'BOOKING_CANCELLED' ? booking.CancelledDatetime : 'NA';
            default: return this.cleanValue(booking[key]);
        }
    }

    getBooking(data: any): any {
        return data && data.BookingDetails ? data.BookingDetails : {};
    }

    getCenterBody(data: any): any {
        const booking = this.getBooking(data);
        return booking.CancellationReason && booking.CancellationReason.centerBody ? booking.CancellationReason.centerBody : {};
    }

    getPackageDetails(data: any): any {
        const packageDetails = this.getCenterBody(data).PackageDetails;
        return Array.isArray(packageDetails) && packageDetails.length ? packageDetails[0] : {};
    }

    getBookingStatusLabel(status: string): string {
        switch (status) {
            case 'BOOKING_FAILED': return 'Booking Failed';
            case 'BOOKING_CONFIRMED': return 'Booking Confirmed';
            case 'BOOKING_CANCELLED': return 'Booking Cancelled';
            case 'BOOKING_INPROGRESS': return 'Booking Inprogress';
            case 'BOOKING_HOLD': return 'Booking Hold';
            default: return status || 'N/A';
        }
    }

    showPaxProfile(data: any) {
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = this.getLeadPassenger(data);
    }

    onWellnessRedirect(appRef: string, type: string) {
        if (type === 'voucher') {
            this.router.navigate(['/report/b2c-wellness/voucher'], { queryParams: { appReference: appRef } });
        } else if (type === 'invoice') {
            this.router.navigate(['/report/b2c-wellness/invoice'], { queryParams: { appReference: appRef } });
        }
    }

    findLeaduserDetails(data: any) {
        const passenger = this.getLeadPassenger(data);
        const name = `${passenger.Title || ''} ${passenger.FirstName || ''} ${passenger.LastName || ''}`.trim();
        return name || 'N/A';
    }

    getLeadPassenger(data: any): any {
        const booking = this.getBooking(data);
        const requestPackages = booking.CancellationReason &&
            booking.CancellationReason.body &&
            Array.isArray(booking.CancellationReason.body.PackageDetails)
            ? booking.CancellationReason.body.PackageDetails
            : [];
        const passengers = requestPackages.reduce((list, packageDetail) => {
            return list.concat(Array.isArray(packageDetail.PassengerDetails) ? packageDetail.PassengerDetails : []);
        }, []);

        return passengers.find(passenger => passenger.LeadPassenger === true || passenger.LeadPax === true) || passengers[0] || {};
    }

    getPackageGuests(data: any): string {
        const guests = this.getCenterBody(data).searchRequest && this.getCenterBody(data).searchRequest.PackageGuests;
        if (!Array.isArray(guests) || !guests.length) {
            return 'N/A';
        }

        return guests.map(guest => `${guest.NoOfAdults || 0} Adult, ${guest.NoOfChild || 0} Child`).join(', ');
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'BOOKING_CONFIRMED': return 'badge badge-success';
            case 'BOOKING_CANCELLED':
            case 'BOOKING_FAILED': return 'badge badge-danger';
            case 'BOOKING_INPROGRESS': return 'badge badge-info';
            case 'BOOKING_HOLD': return 'badge badge-warning';
            default: return 'badge badge-secondary';
        }
    }

    cleanValue(value: any): any {
        return value !== undefined && value !== null && value !== 'undefined' && value !== '' ? value : 'N/A';
    }

    downloadPdf() {
        const element = document.getElementById('b2c-wellness-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2C_Wellness_Report.pdf');
            this.swalService.alert.success();
        });
    }

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    hide() {
        this.showModal = false;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
