import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-b2c-heli-report',
    templateUrl: './b2c-heli.component.html',
    styleUrls: ['./b2c-heli.component.scss']
})
export class B2cHeliReportComponent implements OnInit, OnDestroy {
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

    pageSize = 100;
    page = 1;
    collectionSize = 0;
    searchText = '';
    noData = true;
    respData: Array<any> = [];
    showModal = false;
    currentRecord: any;

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'app_reference', value: 'Application Reference' },
        { key: 'status', value: 'Booking Status' },
        { key: 'payment_status', value: 'Payment Status' },
        { key: 'booking_reference', value: 'Booking Reference' },
        { key: 'operator_name', value: 'Operator Name' },
        { key: 'route_name', value: 'Route Name' },
        { key: 'type', value: 'Type' },
        { key: 'from_helipad', value: 'From Helipad' },
        { key: 'to_helipad', value: 'To Helipad' },
        { key: 'travel_date', value: 'Travel Date' },
        { key: 'departure_time', value: 'Departure Time' },
        { key: 'arrival_time', value: 'Arrival Time' },
        { key: 'duration', value: 'Duration' },
        { key: 'helicopter_type', value: 'Helicopter Type' },
        { key: 'helicopter_model', value: 'Helicopter Model' },
        { key: 'available_seats', value: 'Available Seats' },
        { key: 'passenger_count', value: 'Passenger Count' },
        { key: 'lead_pax', value: 'Lead Passenger Name' },
        { key: 'phone', value: 'Phone' },
        { key: 'email', value: 'Email' },
        { key: 'base_fare', value: 'Base Fare' },
        { key: 'AdminMarkup', value: 'Admin Markup' },
        { key: 'taxes', value: 'Taxes' },
        { key: 'convinenceFee', value: 'Convenience Fee' },
        { key: 'discount', value: 'Discount' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'promo_code', value: 'Promo Code' },
        { key: 'outpay_status', value: 'Outpay Status' },
        { key: 'booking_source', value: 'Booking Source' },
        { key: 'created_at', value: 'Booked On' },
        { key: 'updated_at', value: 'Updated On' }
    ];

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        const date = new Date();
        const fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));

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
            booked_to_date: this.utility.setToDate()
        });

        this.getB2cHeliReport();
    }

    onSearchSubmit() {
        this.getB2cHeliReport();
    }

    onReset() {
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: this.utility.setFromDate(),
            booked_to_date: this.utility.setToDate()
        });
        this.searchText = '';
        this.getB2cHeliReport();
    }

    getB2cHeliReport() {
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

        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHeliReport', 'post', {}, {}, payload)
            .subscribe(resp => {
                this.noData = false;
                this.respData = Array.isArray(resp.data) ? resp.data : [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }, () => {
                this.noData = false;
                this.respData = [];
                respDataCopy = [];
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
            const first = this.getExportValue(a, sort.active, 0);
            const second = this.getExportValue(b, sort.active, 0);
            return this.utility.compare(String(first).toLowerCase(), String(second).toLowerCase(), isAsc);
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

        this.utility.exportToExcel(fileToExport, 'B2C_Heli_Report', columnWidths);
    }

    getExportValue(data: any, key: string, index: number): any {
        switch (key) {
            case 'id': return index + 1;
            case 'status': return this.getBookingStatusLabel(data.status);
            case 'from_helipad': return this.getHelipadName(data.from_helipad);
            case 'to_helipad': return this.getHelipadName(data.to_helipad);
            case 'travel_date': return this.getAttributes(data).travel_date || 'N/A';
            case 'passenger_count': return this.getPaxList(data).length || this.getAttributes(data).passengers || 0;
            case 'lead_pax': return this.getLeadPaxName(data);
            case 'phone': return this.getLeadPax(data).mobile || 'N/A';
            case 'email': return this.getLeadPax(data).email || 'N/A';
            case 'booking_source':
                return data.booking_source || this.getAttributes(data).booking_source || this.getAttributes(data).BookingSource || 'N/A';
            case 'duration': return data.duration ? `${data.duration} mins` : 'N/A';
            default:
                return data[key] !== undefined && data[key] !== null && data[key] !== '' ? data[key] : 'N/A';
        }
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

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'BOOKING_CONFIRMED': return 'badge-success';
            case 'BOOKING_INPROGRESS': return 'badge-info';
            case 'BOOKING_HOLD': return 'badge-warning';
            default: return 'badge-danger';
        }
    }

    getAttributes(data: any): any {
        return this.parseJson(data && data.Attributes);
    }

    getHelipadName(value: any): string {
        const helipad = this.parseJson(value);
        return helipad && helipad.name ? helipad.name : 'N/A';
    }

    getPaxList(data: any): any[] {
        return data && Array.isArray(data.pax) ? data.pax : [];
    }

    getLeadPax(data: any): any {
        const paxList = this.getPaxList(data);
        return paxList.find(pax => pax.is_lead_pax === 1) || paxList[0] || {};
    }

    getLeadPaxName(data: any): string {
        const pax = this.getLeadPax(data);
        return pax.name ? `${pax.title || ''} ${pax.name}`.trim() : 'N/A';
    }

    showPaxProfile(data: any) {
        this.currentRecord = data;
        this.showModal = true;
    }

    hide() {
        this.showModal = false;
        this.currentRecord = null;
    }

    downloadPdf() {
        const element = document.getElementById('b2c-heli-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2C_Heli_Report.pdf');
            this.swalService.alert.success();
        });
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    private parseJson(value: any): any {
        if (!value) {
            return {};
        }
        if (typeof value === 'object') {
            return value;
        }
        try {
            const parsed = JSON.parse(value);
            return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
        } catch (error) {
            return {};
        }
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
