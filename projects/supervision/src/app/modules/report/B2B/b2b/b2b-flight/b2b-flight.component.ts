import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { ReportService } from '../../../report.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const b2b_url = `${environment.B2B_URL}/b2b`

const log = new Logger('report/B2cFlightComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-b2b-flight',
    templateUrl: './b2b-flight.component.html',
    styleUrls: ['./b2b-flight.component.scss']
})
export class B2bFlightComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    searchText:string;
    regConfig: FormGroup;
    isOpen = false as boolean;
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    load:boolean=false;
    maxDate=new Date();
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'b2b-flight-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };

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
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Reservation Code' },
        { key: 'Status', value: 'Status' },
        { key: 'BookingType', value: 'Booking Type'},
        { key: 'Airline', value: 'Airline' },
        { key: "agentname", value: 'Agent Name' },
        { key: 'Currency', value: 'Trip Type' },
        { key: 'CreatedDatetime', value: 'Booked On' },
        // { key: 'Issued On', value: 'Issued On' },
        { key: 'Airline_pnr', value: 'Airline PNR' },
        { key: 'gds_pnr', value: 'GDS PNR' },
        { key: 'htb', value: 'Lead Passenger Name' },
        { key: 'Supplier', value: 'Supplier' },
        { key: 'baseFare', value: 'Base Fare' },
        { key: 'tax', value: 'Tax' },
        { key: 'total_fare', value: 'Grand Total' },
        { key: 'agent_payable', value: 'Agent Payable' },
        { key: 'lastdateticket', value: 'Last Date To Ticket' },
        { key: "agencyname", value: 'AgencyName' },
        { key: "uuid", value: 'UUID' },
        { key: 'email', value: 'Email' },
        { key: 'Phone', value: 'Phone' },
        { key: 'departure', value: 'Departing City' },
        { key: 'arriving', value: 'Arriving City' },
        { key: 'departureDateTime', value: 'Departure Date' },
        { key: 'arrivalDateTime', value: 'Arrival Date' },
        { key: 'admin_markup', value: 'Admin Markup' },
        { key: 'agent_markup', value: 'Agent Markup' },
        // { key: "Advance_tax", value: 'AdvanceTax' },
        { key: "admin_comm", value: 'Admin Commission' },
        { key: "Agent_comm", value: 'Agent Commission' },
        // { key: 'insurance_opted', value: 'Insurance Opted' },
        // { key: 'insurance_price', value: 'Insurance Price' },
        { key: 'currency', value: 'Currency' },
        { key: 'payment_mode', value: 'Payment Mode' },
        { key: 'cancelation_date', value: 'Cancellation Date' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal : boolean;
    showCancelModal : boolean;
    showPaymentModal : boolean;
    currentRecord : any = [];
    paxDetails : any = {
        "Title" : "",
        "FirstName" : "",
        "LastName" : "",
    };
    srcUrl: string = "";
    confirmedData: any;
    currencyList :any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private reportService:ReportService
    ) { }

    ngOnInit() {
        let date = new Date(),
        fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
        let tommorow=this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            pnr: new FormControl('', [Validators.maxLength(50)]),
            currency:new FormControl(''),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        }, { emitEvent: false });
       
        this.getB2bFlightReport();
        this.getCurrencyList();
    }

    onSearchSubmit() {
        this.getB2bFlightReport();
    }

    onReset() {
        let fromDate=this.utility.setFromDate();
        let tommorow=this.utility.setToDate();
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        });
        this.searchText='';
        this.getB2bFlightReport();
    }
    
    getB2bFlightReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'), //? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : formatDate(fromDate, 'YYYY-MM-DD'),
                "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'), //? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : formatDate(date, 'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "currency":this.regConfig.value.currency || "",
                "email": this.regConfig.value.email || "",
            }
        } else {
            reqBody = {}
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightReport', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData=false;
                this.respData=[];
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


    download(type: any, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (type === 'xlsx' || type === 'xls') {
            this.utility.downloadElementAsExcel(this.config.elementIdOrContent, 'b2b-flight');
            return;
        }
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `b2b-Flight-Report`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
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
        this.utility.downloadElementAsPdf('b2b-flight-report', 'B2B_Flight_Report', 'landscape');
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
            this.getB2bFlightReport();
        }
    }

    showPaxProfile(data){
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.Passengers
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
      this.showPaymentModal = false;
      this.showConfirm = false;
    }

    showPaymentInfo(data){
    	this.showPaymentModal = true;
    	this.currentRecord = data;
    }

    submitTicket(data) {
        this.swalService.alert.confirm(paymentType => {
            switch (paymentType) {
                case 'nagad':
                    data['paymentType'] = 'nagad';
                    this.nagadPayment(data);
                    break;
                case 'bKash':
                    this.srcUrl = `${b2b_url}/paymentGateway/${data.AppReference}?source=reports`
                    window.location.replace(this.srcUrl);
                    break;
                case 'wallet':
                    this.walletPayment(data);
                    break;

                default:
                    break;
            }
        });
    }

    nagadPayment(data) {
        let date = (new Date().getTime()).toString();
        let invoiceNumber= this.reportService.setInvoiceNumber(data.AppReference);
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source:'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    walletPayment(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.swalService.alert.oops("Your wallet balance is low to perform booking.")
                } else {
                    this.callPnrTicket(data);
                }
            }
        }, (err => {
            this.swalService.alert.oops("Something went wrong. please trye again.")
        }));
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode,
            payment_type:'wallet'
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData).subscribe(res => {
            if (res) {
                this.confirmedData = res.data.FinalBooking.BookingDetails;
                if (this.confirmedData.BookingStatus.toUpperCase() === "BOOKING_CONFIRMED") {
                    this.deductFromWallet(data);
                }
                else {
                    this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                    this.router.navigate(['/']);
                }
            }
        }, (err => {
            this.swalService.alert.oops("Something went wrong. please trye again.")
        }));
    }

    deductFromWallet(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Thank you for Booking with Booking 247.");
                this.router.navigate(['/report/b2b/voucher/flight'], { queryParams: { appReference: data.AppReference } });
            }
        }, (err => {
            this.swalService.alert.oops("Something went wrong. please trye again.")
        }));
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    cancelTicket() {
        let data = this.cancelData;
        this.showConfirm = false;
        this.load = true;  

        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.load = false;  
                this.getB2bFlightReport();
            }
        }, err => {
            this.load = false;  
            this.swalService.alert.oops(err.error.Message);
        });
    }
    checkDate(data) {
        var d1 = new Date();
        var d2 = new Date(data.FlightItineraries[0].created_at);
        if (d1.getDate() === d2.getDate()) {
            return d1.getHours() <= 23;
        }
    }

    checkDateExtend(data) {
        var d1 = new Date();
        var d2 = new Date(data.JourneyStart);
        return d1.getTime() < d2.getTime();
    }
    
    voidTicketPopup(data) {
        this.subjectName = 'Void';
        this.showConfirm = true;
        this.cancelData = data;
    }

    voidTicket() {
        this.showConfirm = false;
        this.load = true;  
        let data = this.cancelData;
        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('voidFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket voided sucessfully");
                this.load = false;  
                this.getB2bFlightReport();
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.load = false;  
        });
    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => x.is_lead == 1);
           return `${leadUser[0]['title'] || ''}. ${leadUser[0].first_name} ${leadUser[0]['middle_name'] || ''} ${leadUser[0].last_name}`;
        }
    }
    
    exportExcel(): void {
        {
            const columns = this.displayColumn.filter(column => column.key !== 'action');
            const fileToExport = this.respData.map((response: any,index:number) => {
                return columns.reduce((row, column) => {
                    row[column.value] = this.getExportValue(response, column.key, index);
                    return row;
                }, {});
            });
     
            const columnWidths = columns.map(column => ({
                wch: column.key === 'id' ? 8 : Math.max(column.value.length + 5, 20)
            }));

            this.utility.exportToExcel(
                fileToExport,
                'B2B Flight Report',
                columnWidths
            );
        }
    }

    getExportValue(response: any, key: string, index: number): any {
        const itinerary = response && response.FlightItineraries && response.FlightItineraries.length ? response.FlightItineraries[0] : {};
        const agent = response && response.AgentDetails ? response.AgentDetails : {};
        const fareBreakup = response && response.TotalFarePriceBreakUp ? response.TotalFarePriceBreakUp : {};
        const priceBreakup = fareBreakup.PriceBreakup || {};
        const commission = priceBreakup.CommissionDetails || {};

        switch (key) {
            case 'id': return index + 1;
            case 'Status': return response.BookingStatus || 'N/A';
            case 'BookingType': return response.BookingType || response.booking_type || 'N/A';
            case 'Airline': return itinerary.airline_name || 'N/A';
            case 'agentname': return `${agent.first_name || ''} ${agent.middle_name || ''} ${agent.last_name || ''}`.trim() || 'N/A';
            case 'Currency': return response.TripType || 'N/A';
            case 'CreatedDatetime': return this.formatExportDate(itinerary.created_at || response.CreatedDatetime);
            case 'Airline_pnr': return itinerary.airline_pnr || response.Pnr || 'N/A';
            case 'gds_pnr': return response.GDS_PNR || 'N/A';
            case 'htb': return this.findLeaduserDetails(response.Passengers) || 'N/A';
            case 'Supplier': return response.DomainOrigin || 'N/A';
            case 'baseFare': return priceBreakup.BasicFare || 0;
            case 'tax': return priceBreakup.Tax || 0;
            case 'total_fare': return `${fareBreakup.TotalDisplayFare || 0} ${fareBreakup.Currency || response.Currency || ''}`.trim();
            case 'agent_payable': return fareBreakup.AgentNetFare || 0;
            case 'lastdateticket': return response.LastDateToTicket || 'N/A';
            case 'agencyname': return agent.business_name || 'N/A';
            case 'uuid': return agent.uuid || 'N/A';
            case 'departure': return response.JourneyFrom || 'N/A';
            case 'arriving': return response.JourneyTo || 'N/A';
            case 'departureDateTime': return this.formatExportDate(response.JourneyStart);
            case 'arrivalDateTime': return this.formatExportDate(response.JourneyEnd);
            case 'admin_markup': return response.AdminMarkup || 0;
            case 'agent_markup': return response.AgentMarkup || 0;
            case 'admin_comm': return commission.AdminCommission || 0;
            case 'Agent_comm': return commission.AgentCommission || 0;
            case 'currency': return response.Currency || 'N/A';
            case 'payment_mode': return response.PaymentMode || 'N/A';
            case 'cancelation_date': return response.cancelation_date || 'N/A';
            default: return response[key] !== undefined && response[key] !== null && response[key] !== '' ? response[key] : 'N/A';
        }
    }

    private formatExportDate(value: any): string {
        if (!value) {
            return '';
        }
        const parsed = moment(value);
        return parsed.isValid() ? parsed.format('MMM DD, YYYY') : value;
    }
    getCurrencyList() {
        const data = [{  }]
        data['topic'] = 'hotelCurrencyConverison';
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelCurrencyConverison', 'post', '', '', data).subscribe(resp => {
                if (resp.Status && resp.data) {
                    this.currencyList = resp.data.filter(t => t.status == 1);
                }
            }, (err: HttpErrorResponse) => {
                console.log(err.error);
            })
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
