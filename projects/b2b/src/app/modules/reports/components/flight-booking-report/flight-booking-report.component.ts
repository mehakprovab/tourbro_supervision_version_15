import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { AuthService } from 'projects/b2b/src/app/auth/auth.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { HeaderService } from 'projects/b2b/src/app/shared/components/header/header.service';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { SubSink } from 'subsink';
import { Logger } from '../../../../core/logger/logger.service';
import { untilDestroyed } from '../../../../core/services';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { FlightService } from '../../../search/flight/flight.service';
import { ReportService } from '../../reports.service';
import { HttpErrorResponse } from '@angular/common/http';

const b2b_url = `${environment.B2B_URL}/b2b`
const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-flight-booking-report',
    templateUrl: './flight-booking-report.component.html',
    styleUrls: ['./flight-booking-report.component.scss']
})

export class FlightBookingReportComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    srcUrl: string = "";
    searchType = "flight";
    navLinks = [];
    airLineName : any;
    public loading = false;
    navigationData: any;
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Reference Number' },
        { key: 'gds_pnr', value: 'GDS PNR' },
        { key: 'airline_pnr', value: 'Airline PNR' },
        { key: 'BookingStatus', value: 'Status' },
        { key : 'DomainOrigin', value : 'Airline Name'},
        { key: 'leadpax_name', value: 'Customer Name' },
        { key: 'JourneyFrom', value: 'From' },
        { key: 'JourneyTo', value: 'To' },
        { key: 'TripType', value: 'Trip Type' },
        { key: 'agent_netfare', value: 'Agent Net Fare' },
        { key: 'agent_commission', value: 'Agent Commission' },
        { key: 'agent_markup', value: 'Agent Markup' },
        { key: 'advanced_tax', value: 'Advanced  Tax' },
        { key: 'insurance_opted', value: 'Insurance Opted' },
        { key: 'insurance_price', value: 'Insurance Price' },
        { key: 'LastDateToTicket', value: 'Last Date To Ticket' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'JourneyStart', value: 'Travel Date' },
        { key: 'booked_on', value: 'Booked On' },
        // { key: 'issued_On', value: 'Issued On' }
    ];
    noData: boolean = true;
    respData: any;
    config: ExportAsConfig = {
        type: 'pdf',
        download: false,
        elementIdOrContent: 'b2b-flight-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };
    showPaxDetails: boolean;
    showCancelModal: boolean;
    showPaymentModal: boolean;
    currentRecord: any = [];
    paxDetails: any = {
        "Title": "",
        "FirstName": "",
        "LastName": "",
    };
    paymentForm: FormGroup;
    submitted: boolean;
    showPaymentDetails: boolean;
    paymentData: any;
    cancelData: any;
    showConfirm: boolean;
    subjectName: string;
    paymentGateways: any;
    confirmedData: any;
    showMailTrigger: boolean = false;
    mailTriggerData: any;
    customerEmailTrigger: string;
    loggedinUser: any;

    constructor(
        private reportsService: ReportService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private apiHandlerService: ApiHandlerService,
        private headerService: HeaderService,
        private fb: FormBuilder,
        private as:AuthService,
        private flightService:FlightService
    ) {
        this.searchType = 'flight';
    }
    searchParams: any;
    loggedInUser: any;

    ngOnInit() {
        this.respData = [];
        this.navLinks = getLinks();
        this.getLoggedInUser();
        this.activatedRoute.queryParams.subscribe(q => {
            if (!this.utility.isEmpty(q)) {
                this.getBookingReportsExt({ app_reference: q.appRef })
            }
        });
        this.createPaymentForm();
    }

    copy(appReference){
       this.reportsService.copy(appReference);
    }

    getLoggedInUser(){
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.loggedInUser['auth_role_id'] == 5)
        this.getPrevilegeForThisUser();
    }
   
    receiveSearchValues($event) {
        this.noData=true;
        this.respData=[];
        this.getBookingReports($event);
    }

    getBookingReports(searchForm) {
        this.searchParams = searchForm;
        let t = new Date(searchForm.booked_to_date)
        let toDate = new Date(t.setDate(t.getDate() + 1))
        let reqBody = {
            "booked_from_date": searchForm.booked_from_date ? formatDate(searchForm.booked_from_date, 'YYYY-MM-DD') : "",
            "booked_to_date": searchForm.booked_to_date ? formatDate(toDate, 'YYYY-MM-DD') : "",
            "status": searchForm.status || "",
            "app_reference": searchForm.app_reference || "",
            "pnr": searchForm.pnr || "",
            "email": searchForm.email || "",
        }
        this.getBookingReportsExt(reqBody);
    }

    openMailTrigger(data) {
        this.showMailTrigger = true;
        this.mailTriggerData = data;
        this.customerEmailTrigger = data.BookingDetails.CustomerEmail;
      }

    mailTrigger(type){
       
        this.subSunk.sink = this.apiHandlerService.apiHandler('flightEmail', 'post', {}, {},
        {   AppReference: this.mailTriggerData.AppReference,
            email: this.mailTriggerData.CustomerEmail, 
            withPrice: type
        })
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("Mail sent successfully.");
                this.showMailTrigger = false;
            }
            else {
                this.swalService.alert.oops();
                this.showMailTrigger = false;
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops("Something went wrong");
            this.showMailTrigger = false;
        }
        );
    }

    getBookingReportsExt(reqBody) {
        this.reportsService.fetchBookingReports(reqBody)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                        this.airLineName = resp.data[0].DomainOrigin;
                        this.respData = resp.data;
                        respDataCopy = [...this.respData];
                        this.collectionSize = this.respData.length;
                        this.noData = false;
                  
                } else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
              })
    }

    getVoucher(data) {
        const redirect_url = ''
        const voltureRoute =this.router.createUrlTree(['/b2b/reports/flight-voucher'],{queryParams: { AppReference: data.AppReference }})
        this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
    }
    onSelect(tab, i) {
    }

    beforeChange(e) {
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                // airline_name : objData.FlightItineraries[0].airline_name,
                reference_number: objData.AppReference,
                pnr: objData.pnr,
                leadpax_name: objData.leadpax_name,
                from: objData.JourneyFrom,
                to: objData.JourneyTo,
                type: objData.TripType,
                agent_netfare: objData.agent_netfare,
                agent_commission: objData.agent_commission,
                agent_markup: objData.agent_markup,
                tds: objData.tds,
                total_fare: objData.total_fare,
                tarvel_date: objData.JourneyStart,
                booked_on: objData.booked_on,
                issued_On:objData.TicketIssueDate,
                status: objData.status,
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
                case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
                case 'leadpax_name': return this.utility.compare('' + a.leadpax_name.toLocaleLowerCase(), '' + b.leadpax_name.toLocaleLowerCase(), isAsc);
                case 'JourneyFrom': return this.utility.compare('' + a.JourneyFrom.toLocaleLowerCase(), '' + b.JourneyFrom.toLocaleLowerCase(), isAsc);
                case 'JourneyTo': return this.utility.compare('' + a.JourneyTo, '' + b.JourneyTo, isAsc);
                case 'type': return this.utility.compare('' + a.type.toLocaleLowerCase(), '' + b.type.toLocaleLowerCase(), isAsc);
                case 'agent_netfare': return this.utility.compare(+ a.agent_netfare, + b.agent_netfare, isAsc);
                case 'agent_commission': return this.utility.compare(+ a.agent_commission, + b.agent_commission, isAsc);
                case 'agent_markup': return this.utility.compare(+ a.agent_markup, + b.agent_markup, isAsc);
                case 'tds': return this.utility.compare(+ a.tds.toLocaleLowerCase(), + b.tds.toLocaleLowerCase(), isAsc);
                case 'total_fare': return this.utility.compare(+ a.total_fare, + b.total_fare, isAsc);
                case 'JourneyStart': return this.utility.compare('' + a.JourneyStart, '' + b.JourneyStart, isAsc);
                case 'booked_on': return this.utility.compare(+ a.booked_on, + b.booked_on, isAsc);
                case 'issued_On': return this.utility.compare(+ a.TicketIssueDate, + b.TicketIssueDate, isAsc);
                case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    download(type: SupportedExtensions, orientation?: string) {
        document.getElementById('action').remove();
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2b-FlightReport`).subscribe((_) => {
            this.swalService.alert.success();
        }, (err) => {
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

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    showPaxProfile(data) {
        this.showPaxDetails = true;
        this.currentRecord = data;
        this.paxDetails = data.FlightBookingTransactions[0]['flightBookingTransactionPassengers'];
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    hide() {
        this.showPaxDetails = false;
        this.showPaymentDetails = false;
        this.showConfirm = false;
        //   this.showPaymentModal = false;
    }

    paymentConfirm() {
        this.loading = true;  
        this.submitted = true;
        if (!this.paymentForm.valid)
            return;
        let data = this.paymentData;
        if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
            switch (this.paymentForm.value.paymentMethod) {
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
                case 'sslCommerz':
                    data['paymentType'] = 'sslCommerz';
                    this.sslCommerzPayment(data);
                    break;
                default:
                    break;
            }
        }
    }

    submitTicket(data) {
        this.getPaymentGateWays();
        this.paymentData = data;
    }

    getPaymentGateWays() {
         let obj = {
            user_id: this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', obj).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways = res.data;
                    this.showPaymentDetails = true;
                }
                else {
                    this.swalService.alert.oops('No payment gateway enabled.');
                    this.showPaymentDetails = false;
                }
            }
            else {
                this.swalService.alert.oops('Some thing went wrong');
                this.showPaymentDetails = false;
            }
        }, (err) => {
            if (err && err.err && err.error.msg) {
                this.swalService.alert.oops(err.error.msg);
                this.showPaymentDetails = false;
            }
        });
    }

    nagadPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.AppReference);
        let date = (new Date().getTime()).toString();
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.AppReference);
        let date = (new Date().getTime()).toString();
        this.subSunk.sink = this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source: 'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    walletPayment(data) {
        this.subSunk.sink = this.reportsService.checkWalletBalance(data.AppReference)
            .subscribe(res => {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.swalService.alert.oops("Your wallet balance is low.")
                } else {
                    let TicketData = {
                        AppReference: data.AppReference,
                        booking_source: data.ApiCode,
                        payment_type:'wallet'
                    }
                    this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
                        .subscribe(res => {
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
                        }, err => {
                            this.loading = false;
                            this.showPaymentDetails = false;
                            this.swalService.alert.oops(err.error.Message)
                        }
                        );
                }
            }, (err) => {
                this.showPaymentDetails = false;
                this.swalService.alert.oops("Your wallet balance is not sufficient. Please add balance to your wallet");
            });
    }

    deductFromWallet(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res) {
                this.loading = false;
                this.swalService.alert.success("Thank you for Booking with Booking 247.");
                this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    walletPayment1(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.AppReference })
            .subscribe(res => {
                if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.swalService.alert.oops("Your wallet balance is low.")
                    } else {
                        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
                            if (res) {
                                this.swalService.alert.success("Your transaction successful.");
                                this.headerService.agentData.next(true);
                                this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
                            }
                        });
                    }

                }
            }, (err) => {
                this.swalService.alert.oops("Your wallet balance is low.")
            });
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData).subscribe(res => {
            if (res) {
                this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
            }
        });
    }

    checkDateExtend(data) {
        var d1 = new Date();
        var d2 = new Date(data.JourneyStart);
        return d1.getTime() < d2.getTime();
    }

    checkDate(data) {
        var d1 = new Date();
        var d2 = new Date(data.CreatedDatetime);
        if (d1.getDate() === d2.getDate()) {
            return d1.getHours() <= 23;
        }
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    cancelTicket() {
        let data = this.cancelData;
        this.showConfirm = false;
        this.loading = true;  

        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                // hideloader();
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.receiveSearchValues(this.searchParams);
                this.loading = false;  
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.loading = false;  
        });

        function hideloader() {
            document.getElementById('loading')
                .style.display = 'none';
        }
    }

    voidTicketPopup(data) {
        this.subjectName = 'Void';
        this.showConfirm = true;
        this.cancelData = data;
    }

    voidTicket() {
        this.showConfirm = false;
        this.loading = true;  
        let data = this.cancelData;
        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('voidFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket voided sucessfully");
                this.receiveSearchValues(this.searchParams);
                this.loading = false;  
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.loading = false;  
        });
    }

    ngOnDestroy() { }

    getPrevilegeForThisUser() {
        this.navigationData = JSON.parse(sessionStorage.getItem('userPrevilige'))
      }

      isMenuExists(menu) {
        if (this.navigationData && this.navigationData.length > 0) {
          if (this.navigationData.some((el) => el.description == menu)) return true;
          else return false;
        } else {
          return true;
        }
      }

      exportExcel(): void {
            const fileToExport = this.respData.map((response: any,index:number) => {
                const userName=response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].first_name+' '+response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].middle_name+' '+response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].last_name;
                return {
                    "Sl No.":index+1,
                    "Reference Number": response.AppReference,
                    "GDS PNR": response.FlightBookingTransactions[0].gds_pnr,
                    "Airline PNR": response.FlightItineraries[0].airline_pnr,
                    "Status":response.BookingStatus,
                    "Airline Name": response.FlightItineraries[0].airline_name,
                    "Customer Name":userName,
                    "From":response.JourneyFrom,
                    "To":response.JourneyTo,
                    "Trip Type":response.TripType,
                    "Agent Net Fare":response['TotalFarePriceBreakUp']['AgentNetFare'],
                    "Agent Commission":response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission,
                    "Agent Markup":response.TotalFarePriceBreakUp.PriceBreakup.MarkUpDetails.AgentMarkup,
                    "Advanced  Tax":response.TotalFarePriceBreakUp.PriceBreakup.AdvanceTax,
                    "Insurance Opted": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['product_code']?response['BaggageInsurancesDetails'][0]['product_code']:'',
                    "Insurance Price": response['BaggageInsurancesDetails'] && response['BaggageInsurancesDetails'][0] && response['BaggageInsurancesDetails'][0]['amount']?response['BaggageInsurancesDetails'][0]['amount']:'',
                    "Last Date To Ticket":response.LastDateToTicket,
                    "Total Fare":response.FlightBookingTransactions[0].total_fare,
                    "Travel Date": moment(response.JourneyStart).format("MMM DD, YYYY"),
                    "Booked On": moment(response.CreatedDatetime).format("MMM DD, YYYY"),
                    "Issued On":  moment(response.TicketIssueDate).format("MMM DD, YYYY")
                }
            });
     
            const columnWidths = [
                { wch: 5 },
                { wch: 25 },
                { wch: 10 },
                { wch: 10 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 10 },
                { wch: 10 },
                { wch: 20 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 15},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25}
            ];

            this.utility.exportToExcel(
                fileToExport,
                'Flight Report',
                columnWidths
            );
        }

        issueTicket(data) {
            const payLoad = {
                app_reference: data.AppReference
            }
            this.apiHandlerService.apiHandler('ticketingRequest', 'POST', '', '', payLoad).subscribe(res => {
                if (res && ([200, 201].includes(res.statusCode))) {
                    this.swalService.alert.success('Ticket Rquest sent.');
                }
                else {
                    this.swalService.alert.oops('Some thing went wrong');
                }
            }, (err) => {
                if (err && err.err && err.error.msg) {
                    this.swalService.alert.oops(err.error.msg);
                }
            });
        }
    }


function getLinks() {
    return [
        {
            icon: 'fa fa-plane',
            label: 'Flight Report',
            class: '',
            report: 'Flight',
        },
        
    ]
}