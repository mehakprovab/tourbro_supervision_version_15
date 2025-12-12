import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../core/api-handlers';
import { SwalService } from '../../core/services/swal.service';
import { untilDestroyed } from '../../core/services/until-destroyed';
import { UtilityService } from '../../core/services/utility.service';
import { AdministratorService } from '../administrator/administrator.service';
import { FlightService } from '../search/flight/flight.service';
import { DashboardService } from './dashboard.service';
import { formatDate } from 'ngx-bootstrap/chronos';

HC_exporting(Highcharts);

const imgUrl = environment.SA_URL + '/sa/';
const log = new Logger('dashBoard/DashboardComponent')
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    @Output() Navigate = new EventEmitter();
    protected subs = new SubSink();
    bookingFlightsCount: number;
    cancellationFlightsCount: number;
    bookingHotelCount: number;
    bookingCarCount: number;
    cancellationHotelCount: number;
    popupalert: any;
    displayedColumns = ['uuid', "first_name", 'email', 'phone', 'last_login'];
    displayedFlightColumns = ['recent bookings'];
    dataSource = ELEMENT_DATA;
    flightBookingSource = ELEMENT_BOOKING_DATA;
    latestTransactionsFound: boolean = false;
    latestTransactionsData: any;
    bookingDetailsFound: boolean = false;
    bookingDetailsData: any;
    bookingCalenderFound: boolean = false;
    bookingCalenderData: any;
    monthlyRecapReportFound: boolean = false;
    monthlyRecapReportData: any;
    moduleBookingCountFound: boolean = false;
    moduleBookingCountData: any;
    noTransactions:boolean=false;
    showNoRecordsFound: boolean = false;
    calendarPlugins = [dayGridPlugin]; // important!
    //flight booking chat
    highcharts = Highcharts;
    chartOptions = {
        chart: {
            type: "spline"
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yAxis: {
            title: {
                text: ""
            }
        },
        tooltip: {
            valueSuffix: " °C"
        },

        series: [
            {
                name: 'Flight',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                style: { stroke: 'red' }
            },
            {
                name: 'Hotel',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            },
        ]
    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'ids', value: 'Sl No.' },
        { key: 'first_name', value: 'Name' },
        { key: 'uuid', value: 'Agent ID' },
        { key: 'phone', value: 'Contact No' },
        { key: 'email', value: 'Email' },
        { key: 'created_at', value: 'Registered Date' },
      
    ];
    destinationSlides : any;
    currentUser : any;
    topTransactions:  Array<any> = [];
    constructor(
        private flightService: FlightService,
        private dashboardService: DashboardService,
        private utility: UtilityService,
        private router: Router,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private administratorService: AdministratorService,
    ) {

        this.popupalert = this.router.getCurrentNavigation();

    }

    ngOnInit() {
        this.flightService.formFilled = false;
        this.currentUser = this.utility.readStorage('currentUser', sessionStorage)
        this.setAlert();
        this.getTransactionLogs();
        this.getFlightbookingCount();
        this.getHotelbookingCount();
        this.getSubAgentList();
        this.getcancellationCount();
        this.getTopFlightDestinations();
        this.clearFlightCache();
    }

    clearFlightCache(){
        sessionStorage.removeItem('ticketCache');
        sessionStorage.removeItem('flightSearchPostdata');
    }

    setAlert() {
        if (this.popupalert.extras.state) {
            if (this.popupalert.extras.state.status) {
                const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
                if (data[0].agent_id) {
                    this.swalService.alert.welcome("User");
                }
            }
        }
    }

    getModuleBookingCount() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'moduleBookingCount';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {

                if (resp.statusCode == 200) {
                    this.moduleBookingCountFound = true;
                    this.moduleBookingCountData = resp.data;
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getMonthlyRecapReport() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'monthlyRecapReport';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.monthlyRecapReportFound = true;
                    this.monthlyRecapReportData = getCartOptions2(resp.data);
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }
    getBookingCalender() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'bookingCalender';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.bookingCalenderFound = true;
                    this.bookingCalenderData = getcalendarEvents(resp.data);
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }
    getBookingDetails() {
        const data = [{ agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'] }];
        data['topic'] = 'bookingDetails';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.bookingDetailsFound = true;
                    this.bookingDetailsData = getChartOptions(resp.data);
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }
    getLatestTransactions() {
        const data = [{
            agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'],
            user_type: 3
        }];
        data['topic'] = 'latestTransactions';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.latestTransactionsFound = true;
                    this.latestTransactionsData = resp.data;
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getFlightbookingCount() {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id'] };

        this.subs.sink = this.apiHandlerService.apiHandler('agentSubAgentFlightCounts', 'POST', {}, {}, data).subscribe(res => {
            this.bookingFlightsCount = res.data[0].count;
            if (res.Status && res.data.length != 0) {

            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
            console.error(err);
        }
        );
    }
    getHotelbookingCount() {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id'] };

        this.subs.sink = this.apiHandlerService.apiHandler('agentSubAgentHotelCounts', 'POST', {}, {}, data).subscribe(res => {
            this.bookingHotelCount = res.data[0].count;
            if (res.Status && res.data.length != 0) {

            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
        }
        );
    }
    getCarbookingCount() {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id'] };

        this.subs.sink = this.apiHandlerService.apiHandler('agentSubAgentCarCounts', 'POST', {}, {}, data).subscribe(res => {
            this.bookingCarCount = res.data[0].count;
            if (res.Status && res.data.length != 0) {

            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
            console.error(err);
        }
        );
    }
    private subSunk = new SubSink();
    noData: boolean = true;
    respData: Array<any> = [];
    getSubAgentList() {
        this.subSunk.sink = this.administratorService.fetchSubAgentList()
            .subscribe(resp => {
                if (resp.statusCode == 200 && resp.data.length != 0 || resp.statusCode == 201 && resp.data.length != 0) {
                    this.respData = resp.data;
                    this.respData = this.respData.filter((data) => {
                        return data.status === 1 
                    })
                    this.noData = false;
                    respDataCopy = [...this.respData];
                    this.sortData(
                        {
                            active: "created_at",
                            direction: "desc"
                        })
                        var ELEMENT_DATA: PeriodicElement[] =resp.data;
                } else {
                    // this.swalService.alert.oops("No Data Found");
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    getcancellationCount() {
        this.subs.sink = this.apiHandlerService.apiHandler('completedCancelledBookings', 'POST', {}, {}, {}).subscribe(res => {
            this.cancellationFlightsCount = res.data.flightCancelled.length;
            this.cancellationHotelCount = res.data.hotelCancelled.length;
            if (res.Status && res.data.length != 0) {

            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
        }
        );
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
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'uuid': return this.utility.compare('' + a.uuid.toLocaleLowerCase(), '' + b.uuid.toLocaleLowerCase(), isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);

                default: return 0;
            }
        });
    }

    getTopFlightDestinations(){
        this.subs.sink = this.apiHandlerService.apiHandler('listFlightTopDestination', 'POST', {}, {}, {}).subscribe(res => {
            if(res.statusCode == 200 || res.statusCode==201){
                this.destinationSlides  = res.data;
            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
        }
        );
    }

    getImage(img){
        return imgUrl + img;
    }

    navigateToTop(data){
        window.scroll(0,0);
        this.flightService.flightSearchData.next(data);
    }

    getTransactionLogs() {
        let to_date = new Date();
        const today = new Date(); // Get the current date
        const pastDate = new Date(today); // Create a new Date object based on today
        pastDate.setDate(today.getDate() - 14); // Subtract 14 days from the current day
        let from_date = pastDate;
        this.subSunk.sink = this.apiHandlerService.apiHandler('transactionLogsAccountSys', 'post', {}, {},
            {
                "from_date": formatDate(from_date, 'YYYY-MM-DD'),
                "to_date": formatDate(to_date, 'YYYY-MM-DD'),
                "transaction_id": '',
                "module_type": ''
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    if (resp.data.transations && resp.data.transations.length > 0) {
                        this.noTransactions = false;
                        this.showNoRecordsFound = false;
                        this.topTransactions = resp.data.transations || [];
                        this.topTransactions = this.topTransactions.slice(0, 6)
                    }
                    else {
                        this.showNoRecordsFound = true;
                        this.noTransactions = true;
                    }
                }
                else {
                    this.showNoRecordsFound = true;
                    this.noTransactions = true;
                    this.swalService.alert.error(resp.msg || '');
                }
            }, (err) => {
                this.showNoRecordsFound = true;
                this.noTransactions = true;
                this.swalService.alert.error(err.error.msg || '');
            });
    }

    ngOnDestroy() { }
    destinationSliderConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };

}
// B2B users list
export interface PeriodicElement {
    uuid: string;
    first_name: string;
    email: string;
    phone: number;
    last_login: string;
}

var ELEMENT_DATA: PeriodicElement[] = [
    
];
export interface recentBookingFlight {
    bookingCode: string;
    logo: string;
    transaction: string;
}

const ELEMENT_BOOKING_DATA: recentBookingFlight[] = [
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" }
];
function getcalendarEvents(respData) {
    return respData.calender_data.map(val => {
        let data = {
            reference_number: val['app_reference'],
            status: val['status'],
            booking_source: val['booking_source'],
        }
        return {
            title: val.title,
            start: val.start,
            url: `./reports/flight-voucher?data=${JSON.stringify(data)}`,
        }
    });
}

function getChartOptions(respData) {
    log.debug(respData);
    return {
        chart: {
            type: "spline" // line
        },
        title: {
            text: respData.title || "Banking Details"
        },
        subtitle: {
            text: respData.subtitle ? `Source: ${respData.subtitle}` : 'Source: provab.com'
        },
        xAxis: {
            categories: [...respData['time_line_interval']]
        },
        yAxis: {
            title: {
                text: `No.of Bookings (Total: ${respData['max_count']})`
            }
        },
        "tooltip": {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: respData['time_line_report'],
        navigation: {
            buttonOptions: {
                enabled: true
            }
        },
    }
}


function getCartOptions2(respData) {
    return {
        "chart": {
            "type": "column"
        },
        "title": {
            "text": "Monthly Recap Report"
        },
        "subtitle": {
            "text": respData['source'] ? `Source: ${respData['source']}` : "Source: Provab.com "
        },
        "xAxis": {
            "categories": respData['time_line_interval'],
            "crosshair": true
        },
        "yAxis": {
            "min": 0,
            "title": {
                "text": `Profit (${respData['currency']})`
            }
        },
        "tooltip": {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        "plotOptions": {
            "column": {
                "pointPadding": 0.2,
                "borderWidth": 0
            }
        },
        "series": [...respData['group_time_line_report']],
    }

    

}
