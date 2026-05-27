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
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { Router } from '@angular/router';
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
  selector: 'app-b2c-flight',
  templateUrl: './b2c-flight.component.html',
  styleUrls: ['./b2c-flight.component.scss']
})
export class B2cFlightComponent implements OnInit,OnDestroy {

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
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Reservation Code' },
        // { key: 'Confirmation_Reference', value: 'Confirmation Reference' },	
        { key: 'BookingStatus', value: 'Status' },
        { key: 'Airline', value: 'Airline' },
        { key: 'TripType', value: 'Trip Type' }, 
        { key: 'CreatedDatetime', value: 'Booked On' },
        // { key: 'Issued On', value: 'Issued On' },
        { key: 'Pnr', value: 'Airline PNR' },
        { key: 'gds_pnr', value: 'GDS PNR' },
        { key: 'LeadPassengerName', value: 'Lead Passenger Name' },
        { key: 'email', value: 'Email' },
        { key: 'Phone', value: 'Phone' },
        { key: 'Supplier', value: 'Supplier' },
        { key: 'BaseFare', value: 'Base Fare' },
        { key: 'Tax', value: 'Tax' },
        { key: 'TotalFare', value: 'Grand Total' },
        { key: 'JourneyFrom', value: 'Departing City' },
        { key: 'JourneyTo', value: 'Returning City' },
        { key: 'JourneyStart', value: 'Departure Date' },
        { key: 'JourneyEnd', value: 'Return Date' },
        { key: 'AdminMarkup', value: 'Admin Markup' },
        // { key: "Advance_tax", value: 'AdvanceTax' },
        { key: 'ConvinenceValue', value: 'Convenience Fee' },
        { key: 'PromoCode', value: 'Promo Code' },
        { key: 'Discount', value: 'Discount Amount' },
        // { key: 'InsuranceOpted', value: 'Insurance Opted' },
        // { key: 'InsurancePrice', value: 'Insurance Price' },
        { key: 'Currency', value: 'Currency' },
        { key: 'PaymentMode', value: 'PaymentMode' },
        { key: 'InitialCancellationDate', value: 'Cancellation Date' },
        
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'b2c-flight-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
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
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    load:boolean=false;
    searchText:string;
    maxDate = new Date();
    currencyList:any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private exportAsService: ExportAsService,
        private router: Router,
        private reportService:ReportService
    ) { }

    ngOnInit() {
        let date = new Date(),
        fromDate = new Date(date.valueOf() - (30 * 24 * 60 * 60 * 1000));
        let tommorow = this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            pnr: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            currency:new FormControl(''),
            status: new FormControl('ALL'),
        });

        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        }, {emitEvent: false})
        this.getB2cHotelReport();
        this.getCurrencyList();
    }

    
    
    onSearchSubmit() {
        this.noData = true;
        this.respData = [];
        this.getB2cHotelReport();
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow,
            status: 'ALL'
        });
        this.searchText='';
        this.getB2cHotelReport();
    }

    getB2cHotelReport() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cFlightReport', 'post', {}, {},
            {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'), // ? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : formatDate(fromDate,'YYYY-MM-DD'),
                "booked_to_date":formatDate( this.regConfig.value.booked_to_date,'YYYY-MM-DD'), // ? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : formatDate(date,'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "email": this.regConfig.value.email || "",
                "currency":this.regConfig.value.currency || ""
            })
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
                this.noData = false;
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'AppReference': return this.utility.compare('' + a.AppReference.toLocaleLowerCase(), '' + b.AppReference.toLocaleLowerCase(), isAsc);
                case 'BookingStatus': return this.utility.compare('' + a.BookingStatus.toLocaleLowerCase(), '' + b.BookingStatus.toLocaleLowerCase(), isAsc);
                case 'Airline': return this.utility.compare('' + a.Airline.toLocaleLowerCase(), '' + b.Airline.toLocaleLowerCase(), isAsc);
                case 'Phone': return this.utility.compare('' + a.Phone.toLocaleLowerCase(), '' + b.Phone.toLocaleLowerCase(), isAsc);
                case 'Pnr': return this.utility.compare('' + a.Pnr.toLocaleLowerCase(), '' + b.Pnr.toLocaleLowerCase(), isAsc);
                case 'LeadPassengerName': return this.utility.compare('' + a.LeadPassengerName.toLocaleLowerCase(), '' + b.LeadPassengerName.toLocaleLowerCase(), isAsc);
                case 'JourneyFrom': return this.utility.compare('' + a.JourneyFrom.toLocaleLowerCase(), '' + b.JourneyFrom.toLocaleLowerCase(), isAsc);
                case 'JourneyTo': return this.utility.compare('' + a.JourneyTo.toLocaleLowerCase(), '' + b.JourneyTo.toLocaleLowerCase(), isAsc);
                case 'JourneyStart': return this.utility.compare('' + a.JourneyStart, '' + b.JourneyStart, isAsc);	
                case 'JourneyEnd': return this.utility.compare('' + a.JourneyEnd, '' + b.JourneyEnd, isAsc);	
                case 'BaseFare': return this.utility.compare(+a.BaseFare, +b.BaseFare, isAsc);
                case 'Tax': return this.utility.compare(+a.Tax, +b.Tax, isAsc);
                case 'ServiceTax': return this.utility.compare(+a.ServiceTax, +b.ServiceTax, isAsc);
                case 'AdminMarkup': return this.utility.compare(+a.AdminMarkup, +b.AdminMarkup, isAsc);
                case 'AgentMarkup': return this.utility.compare(+a.AgentMarkup, +b.AgentMarkup, isAsc);
                case 'ConvinenceValue': return this.utility.compare(+a.ConvinenceValue, +b.ConvinenceValue, isAsc);
                case 'PromoCode': return this.utility.compare(+a.PromoCode, +b.PromoCode, isAsc);
                case 'Discount': return this.utility.compare(+a.Discount, +b.Discount, isAsc);
                case 'InsuranceOpted': return this.utility.compare('' + a.InsuranceOpted.toLocaleLowerCase(), '' + b.InsuranceOpted.toLocaleLowerCase(), isAsc);
                case 'InsurancePrice': return this.utility.compare('' + a.InsurancePrice.toLocaleLowerCase(), '' + b.InsurancePrice.toLocaleLowerCase(), isAsc);
                case 'TotalFare': return this.utility.compare('' + a.TotalFare, '' + b.TotalFare, isAsc);
                case 'Currency': return this.utility.compare('' + a.Currency.toLocaleLowerCase(), '' + b.Currency.toLocaleLowerCase(), isAsc);
                case 'PaymentMode': return this.utility.compare('' + a.PaymentMode.toLocaleLowerCase(), '' + b.PaymentMode.toLocaleLowerCase(), isAsc);
                case 'CreatedDatetime': return this.utility.compare('' + a.CreatedDatetime, '' + b.CreatedDatetime, isAsc);
                case 'Issued On': return this.utility.compare('' + a.TicketIssueDate, '' + b.TicketIssueDate, isAsc);
                case 'InitialCancellationDate': return this.utility.compare('' + a.InitialCancellationDate, '' + b.InitialCancellationDate, isAsc);
                case 'FinalCancellationDate': return this.utility.compare('' + a.FinalCancellationDate, '' + b.FinalCancellationDate, isAsc);
                case 'TripType': return this.utility.compare('' + a.TripType.toLocaleLowerCase(), '' + b.TripType.toLocaleLowerCase(), isAsc);
                /*case 'created_datetime': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
                case 'transaction_owner_id': return this.utility.compare('' + a.transaction_owner_id, '' + b.transaction_owner_id, isAsc);
                case 'app_reference': return this.utility.compare('' + a.app_reference.toLocaleLowerCase(), '' + b.app_reference.toLocaleLowerCase(), isAsc);
                case 'fare': return this.utility.compare(+a.fare, +b.fare, isAsc);
                case 'company': return this.utility.compare('' + a.company.toLocaleLowerCase(), '' + b.company.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);*/
                default: return 0;
            }
        });
    }

    showPaymentInfo(data){
    	this.showPaymentModal = true;
    	this.currentRecord = data;
    }

    showPaxProfile(data){
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.Passengers
    }

    showCancelPolicy(data){
        this.showCancelModal = true;
       this.currentRecord = data;
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
      this.showPaymentModal = false;
      this.showConfirm = false;
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2c-Flight-Report`).subscribe((_) => {
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
        const element = document.getElementById('b2c-flight-report');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2C_Flight_Report.pdf');
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
            this.getB2cHotelReport();
        }
    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => x.is_lead == 1);
           return `${leadUser[0]['title'] || ''}. ${leadUser[0].first_name} ${leadUser[0]['middle_name'] || ''} ${leadUser[0].last_name}`;
        }
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
            merchantInvoiceNumber:invoiceNumber,
            source:'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    callPnrTicket(data){
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData).subscribe(res => {
            if (res) {
                this.router.navigate(['/report/b2b/voucher/flight'], { queryParams: { appReference: data.AppReference } });
            }
        });
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
                this.load=false;
                this.getB2cHotelReport();
            }
        }, err => {
            this.load=false;
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
                this.getB2cHotelReport();
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.load = false;  
        });
    }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Reservation Code": response.AppReference,
                    "Status": response.BookingStatus,
                    "Airline": response['FlightItineraries'][0]['airline_name'],
                    "Trip Type":response.TripType,
                    "Booked On": moment(response.CreatedDatetime).format("MMM DD, YYYY"),
                    "Issued On":  response.TicketIssueDate?moment(response.TicketIssueDate).format("MMM DD, YYYY"):'',
                    "Airline PNR": response['Pnr'],
                    "GDS PNR": response['GDS_PNR'],
                    "Lead Passenger Name": this.findLeaduserDetails(response.Passengers),
                    "Email": response.Email,
                    "Phone": response.Phone,
                    "Supplier": response.DomainOrigin,
                    "Base Fare": response['TotalFarePriceBreakUp']['PriceBreakup']['BasicFare'],
                    "Tax": response['TotalFarePriceBreakUp']['PriceBreakup']['Tax'],
                    "Grand Total": response['TotalFarePriceBreakUp']['TotalDisplayFare']+ response['TotalFarePriceBreakUp']['Currency'],
                    "Departing City":response.JourneyFrom,
                    "Returning City": response.JourneyTo,
                    "Departure Date": moment(response.JourneyStart).format("MMM DD, YYYY"),
                    "Return Date": moment(response.JourneyEnd).format("MMM DD, YYYY"),
                    "Admin Markup": response.AdminMarkup,
                    "Advance Tax": response.TotalFarePriceBreakUp.PriceBreakup.AdvanceTax,
                    "Convenience Fee": response['ConvinenceAmount'],
                    "Promo Code": response['PromoCode'],
                    "Discount Amount": response['Discount'],
                    "Insurance Opted": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['product_code']?response['BaggageInsurancesDetails'][0]['product_code']:'',
                    "Insurance Price": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['amount']?response['BaggageInsurancesDetails'][0]['amount']:'',
                    "Currency": response.Currency,
                    "Payment Mode": response.PaymentMode,
                    "Cancellation Date": response.FinalCancellationDate,
                }
            });
     
            const columnWidths = [
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 10 },
                { wch: 10 },
                { wch: 30 },
                { wch: 30 },
                { wch: 15 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10},
                { wch: 15},
                { wch: 15},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15}
            ];

            this.utility.exportToExcel(
                fileToExport,
                'B2C Flight Report',
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
