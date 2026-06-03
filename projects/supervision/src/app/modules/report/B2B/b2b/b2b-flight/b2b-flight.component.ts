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
        const element = document.getElementById('b2b-flight-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2B_Flight_Report.pdf');
            this.swalService.alert.success();
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
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Reservation Code": response.AppReference,
                    "Status": response.BookingStatus,
                    "Airline": response['FlightItineraries'][0]['airline_name'],
                    "Agent Name": response.AgentDetails.first_name + " " + response.AgentDetails.middle_name + " " + response.AgentDetails.last_name,
                    "Trip Type":response.TripType,
                    "Booked On":  moment(response['FlightItineraries'][0]['created_at']).format("MMM DD, YYYY"),
                    // "Issued On":  moment(response.TicketIssueDate).format("MMM DD, YYYY"),
                    "Airline PNR": response['FlightItineraries'][0]['airline_pnr'],
                    "GDS PNR": response['GDS_PNR'],
                    "Lead Passenger Name": this.findLeaduserDetails(response.Passengers),
                    "Supplier": response.DomainOrigin,
                    "Base Fare": response['TotalFarePriceBreakUp']['PriceBreakup']['BasicFare'],
                    "Tax": response['TotalFarePriceBreakUp']['PriceBreakup']['Tax'],
                    "Grand Total": response['TotalFarePriceBreakUp']['TotalDisplayFare']+ response['TotalFarePriceBreakUp']['Currency'],
                    "Agent Payable": response['TotalFarePriceBreakUp']['AgentNetFare'],
                    "Last Date To Ticket": response['LastDateToTicket'],
                    "Agency Name": response.AgentDetails.business_name,
                    "UUID": response.AgentDetails.uuid,
                    "Email": response.Email,
                    "Phone": response.Phone,
                    "Departing City": response.JourneyFrom,
                    "Arriving City": response.JourneyTo,
                    "Departure Date": moment(response.JourneyStart).format("MMM DD, YYYY"),
                    "Arrival Date": moment(response.JourneyEnd).format("MMM DD, YYYY"),
                    "Admin Markup": response.AdminMarkup,
                    "Agent Markup": response.AgentMarkup,
                    "Advance Tax": response.TotalFarePriceBreakUp.PriceBreakup.AdvanceTax,
                    "Admin Commission": response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AdminCommission,
                    "Agent Commission": response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission,
                    "Insurance Opted": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['product_code']?response['BaggageInsurancesDetails'][0]['product_code']:'',
                    "Insurance Price": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['amount']?response['BaggageInsurancesDetails'][0]['amount']:'',
                    "Currency": response.Currency,
                    "Payment Mode": response.PaymentMode,
                    "Cancellation Date": response.cancelation_date && response.cancelation_date.PriceBreakup && response.cancelation_date.PriceBreakup.AdvanceTax? response.cancelation_date.PriceBreakup.AdvanceTax:'',
                }
            });
     
            const columnWidths = [
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 40 },
                { wch: 15 },
                { wch: 30 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 },
                { wch: 30 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15},
                { wch: 15},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 15},
                { wch: 15},
                { wch: 15},
            ];

            this.utility.exportToExcel(
                fileToExport,
                'B2B Flight Report',
                columnWidths
            );
        }
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
