import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportService } from '../../../report.service';

const log = new Logger('report/B2cActivityComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-b2b-transfer',
    templateUrl: './b2b-transfer.component.html',
    styleUrls: ['./b2b-transfer.component.scss']
})
export class B2bTransferComponent implements OnInit {
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
        { key: 'Action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'app_reference', value: 'Application Reference' },
        { key: 'booking_reference', value: 'Confirmation Reference' },
        { key: 'agency_name', value: 'Travel Agent(Buyer)' },//remove for DMC
        { key: 'domain_origin', value: 'Supplier Name' },
        { key: 'departure_point', value:'Start Point'},
        { key: 'destination_point', value:'End Point'},
        { key: 'FirstName', value: 'Lead Passenger Name' },
        { key: 'Email', value: 'Lead Passenger Email' },
        { key: 'total_pax', value: 'Total Pax' },
        { key: 'Phone', value: 'Phone' },
        { key: 'ProductName', value: 'Vehicle' },
        { key: 'TravelDatetime', value: 'Travel Date/Time' },
        { key: 'TravelDatetime', value: 'Return Date/Time' },
        { key: 'supplier_net_fare', value: 'Supplier Net Fare' },
        { key: 'admin_markup', value: 'Admin Markup' },//remove for DMC
        { key: 'AgentMarkup', value: 'Agent markup' },//remove for DMC
        { key: 'driver_details', value: 'Driver Details' },
        { key: 'Currency', value: 'Currency' },
        { key: 'CustomerPaidAmount', value: 'Customer Price' },//remove for DMC
        { key: 'BookedOn', value: 'BookedOn' },
        { key: 'paymentStatus', value: 'Payment Status' },
        { key: 'PaymentMode', value: 'Payment Mode' },//remove for DMC
        { key: 'PaidMode', value: 'Paid On' },//remove for DMC
        { key: 'cancellationDeadline', value: 'Cancellation Deadline' },
        { key: 'cancelledOn', value: 'Cancelled On' },
         { key: 'cancellationFee', value: 'Cancellation Fee' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'b2b-transfer-report',
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
    loading: boolean;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loggedInAuthId: any;
    driverInfoModal: boolean = false;
    driverName: string = '';
    driverMobile: string = '';
    maxRoutesCount: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private reportService: ReportService
    ) { }

    ngOnInit() {
        const currentDomainUser = localStorage.getItem('currentDomainUser');
        this.loggedInAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
        if(this.loggedInAuthId === 7) {
            this.displayColumn.splice(5,1);
            this.displayColumn.splice(16,2);
            this.displayColumn.splice(18,1);
            this.displayColumn.splice(20,2);
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

        this.getB2bTransferReport();
    }

    onSearchSubmit() {
        this.getB2bTransferReport();
    }

    onReset() {
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
        });
        this.searchText = "";
        this.getB2bTransferReport();
    }

    getB2bTransferReport() {
        this.noData = true;
        this.respData = [];
        const currentDomainUser = localStorage.getItem('currentDomainUser');
        const loggedAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
        const createdBy = JSON.parse(currentDomainUser)['id'];
        this.subSunk.sink = this.apiHandlerService.apiHandler('transferB2B', 'post', {}, {},
            {
                "booked_from_date": this.regConfig.value.booked_from_date ? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : '',
                "booked_to_date": this.regConfig.value.booked_to_date ? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : '',
                "status": this.regConfig.value.status || "BOOKING_CONFIRMED",
                "app_reference": this.regConfig.value.app_reference || "",
                "phone_number": this.regConfig.value.phone_number || "",
                "email": this.regConfig.value.email || "",
                "userType": loggedAuthId,
                "supplier_id" : createdBy
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                     resp.data.forEach(item => {
                        const routeName = item.attributes.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"')
                    try {
                        const parsed = JSON.parse(routeName);
                        item.route_name_list = parsed.data.route_name || [];
                    } catch(err) {
                        item.route_name_list = [];
                    }
                    });
                     
                    this.respData = resp.data || [];
                    this.maxRoutesCount = Math.max(
                        ...this.respData.map(item => item.route_name_list.length || 0)
                        );
                        console.log(this.displayColumn)
                    for (let i = 1; i <= this.maxRoutesCount; i++) {
                        this.displayColumn.splice(7 + (i - 1), 0, {
                            key: "location_" + i,
                            value: "Location " + i
                        });
                    }
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
            this.getB2bTransferReport();
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
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'app_reference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'booking_reference': return this.utility.compare('' + a.booking_reference, '' + b.booking_reference, isAsc);
                case 'FirstName': return this.utility.compare('' + a.pax[0].title, '' + b.pax[0].title, isAsc);
                case 'Email': return this.utility.compare('' + a.pax[0].email, '' + b.pax[0].email, isAsc);
                case 'Phone': return this.utility.compare('' + a.pax[0].phone, '' + b.pax[0].phone, isAsc);
                case 'ProductName': return this.utility.compare('' + a.product_name, '' + b.product_name, isAsc);
                case 'TravelDatetime': return this.utility.compare('' + a.itinerary[0].travel_date, '' + b.itinerary[0].travel_date, isAsc);
                case 'PromoCode': return this.utility.compare('' + a.promo_code, '' + b.promo_code, isAsc);
                case 'BaseFare': return this.utility.compare('' + a.itinerary[0].base_fare, '' + b.itinerary[0].base_fare, isAsc);
                case 'Extas': return this.utility.compare('' + a.itinerary[0].extras_amount, '' + b.itinerary[0].extras_amount, isAsc);
                case 'admin_markup': return this.utility.compare('' + a.itinerary[0].admin_markup, '' + b.itinerary[0].admin_markup, isAsc);
                case 'AgentMarkup': return this.utility.compare('' + a.itinerary[0].agent_markup, '' + b.itinerary[0].agent_markup, isAsc);
                case 'Discount': return this.utility.compare('' + a.itinerary[0].Discount, '' + b.itinerary[0].Discount, isAsc);
                case 'Currency': return this.utility.compare('' + a.currency, '' + b.currency, isAsc);
                case 'BookedOn': return this.utility.compare('' + a.created_at, '' + b.created_at, isAsc);
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            // Safely access the first passenger's details if pax exists and is not empty
            const leadPassenger = response.pax && response.pax.length > 0 ? response.pax[0] : {};

            return {
                "Sl No.": index + 1,
                "Status": response.status,
                "Application Reference": response['app_reference'],
                "Confirmation Reference": response['booking_reference'],
                "Departure Point":this.getDeparture(response.attributes)|| 'N/A',
                "Destination Point":this.getDestination(response.attributes)|| 'N/A',
                "Lead Passenger Name": leadPassenger.first_name || '',
                "Lead Passenger Email": leadPassenger.email || '',
                "Phone": leadPassenger.phone || '',
                "Transfer Name": response.product_name,
                "Travel Date": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].travel_date : '',
                // "Promocode": response.promo_code,
                "Base Fare": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].base_fare : '',
                "Extras": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].extras_amount : '',
                "Admin Markup": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].admin_markup : '',
                "Agent markup": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].agent_markup : '',
                // "Discount": response.discount,
                "Currency": response.currency,
                "Customer P": response.itinerary && response.itinerary.length > 0 ? response.itinerary[0].total_fare : '',
                "BookedOn": response.created_at
            };
        });

        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 10 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'B2B Transfer List',
            columnWidths
        );
    }

    getDeparture(value) {
        
        let values = value.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"'); 
        try {
            let attributes = JSON.parse(values);
            return attributes.body.From.name;
        } catch (error) {
            console.error('Error parsing JSON:', error, 'Input:', values);
            return null;
        }
    }

    getSupplierName(value) {
        if (value) {
            let values = value.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"'); 
            try {
                let attributes = JSON.parse(values);
                return attributes.SupplierName;
            } catch (error) {
                console.error('Error parsing JSON:', error, 'Input:', values);
                return null;
            }
        }
        
    }
    
        getDestination(value) {
            if (value) {
                let values = value.replace(/[\n\r\t]/g, ' ').replace(/'/g, '"'); 
                try {
                    let attributes = JSON.parse(values);
                
                    return attributes.body.To.name;
                } catch (error) {
                    console.error('Error parsing JSON:', error, 'Input:', values);
                    return null;
                }
            }
        }


        download(type: SupportedExtensions, orientation?: string) {
            // if (type)
            this.config.type = type;
            if (orientation) {
                this.config.options.jsPDF.orientation = orientation;
            }
            const date = new Date().toDateString();
            this.exportAsService.save(this.config, `b2b-transfer-report`).subscribe((_) => {
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
    
        downloadPdf() {
            const element = document.getElementById('b2b-transfer-report');
            html2canvas(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const imgWidth = 297; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('B2B_Transfer_Report.pdf');
                this.swalService.alert.success();
            });
        }

    showPaxProfile(data) {
        this.showModal = true;
        this.currentRecord = data;
        let paxDetails = data.pax[0];
        this.paxDetails = (paxDetails);
    }

    showCancelPolicy(data) {
        this.showCancelModal = true;
        this.currentRecord = data;
    }

    onVoucherRedirect(appRef, type) {
        this.reportService.actionFromReports.next('b2b');
        if (type == 'voucher')
            this.router.navigate(['/report/transfer/voucher'], { queryParams: { appReference: appRef } });
        else if (type == 'invoice')
            this.router.navigate(['/report/b2b-transfer/invoice'], { queryParams: { appReference: appRef } });
        else
            return false;
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    cancelTicket() {
        let userId = JSON.parse(sessionStorage.getItem('currentSupervisionUser')).id;
        let data = this.cancelData;
        this.showConfirm = false;
        this.loading = true;
        let reqBody = {
            "AppReference": data.app_reference,
            "UserId": userId,
            "BookingSource": data.Api_id
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('transferCancel', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.loading = false;
                this.getB2bTransferReport();
            }
        }, err => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
        });
    }

    hide() {
        this.showModal = false;
        this.showCancelModal = false;
        this.showConfirm = false;
        this.driverInfoModal = false;
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

    app_reference: any;
    api_id: any;
    openDriverInfoModal(data) {
        this.driverInfoModal = true;
        this.api_id = data.Api_id,
        this.app_reference = data.app_reference
    }

    sendDriverInfo() {

        if (this.driverMobile === '' && this.driverName === '') {
            this.swalService.alert.oops('Please enter driver details');
            return;
        }
        const req = {
            AppReference: this.app_reference,
            BookingSource: this.api_id,
            driver_name: this.driverName,
            driver_contact: this.driverMobile
        }
        this.loading = true;
        this.apiHandlerService.apiHandler('updateDriverInfo', 'POST', {}, {}, req).subscribe({
            next: (res) => {
                
                if(res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.loading = false;
                    this.driverInfoModal = false;
                    this.swalService.alert.success('Driver Info is send Successfully');
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                this.loading = false;
                this.swalService.alert.error(err.error.Message);
            }
        })
    }

}
      




