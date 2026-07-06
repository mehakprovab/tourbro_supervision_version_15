import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Logger } from '../../core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { DashboardService } from './dashboard.service';
import { SwalService } from '../../core/services/swal.service';
import { ConfService } from '../../core/services/conf.service';
import { SubSink } from 'subsink';
import { AppService } from '../../app.service';
import * as moment from 'moment';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
HC_exporting(Highcharts);

declare var $: any;
const log = new Logger('DashboardComponent');

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    @ViewChild('calender', { static: false }) calendarComponent: FullCalendarComponent;
    private subSunk = new SubSink();
    moduleBookingCount = [
    ];
    moduleBookingCountFound: boolean = false;
    bookingCalenderFound: boolean = false;
    bookingDetailsFound: boolean = false;
    noData: boolean = false;
    highcharts = Highcharts;
    highcharts2 = Highcharts;
    vendorDashboardCards: any[] = [];
    data: any;
    chartOptions: any;
    chartOptions2: any;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
    calendarEvents: EventInput[];
    defaultCurrency: string = 'USD';
    bookingDetails:any;
    selectedDate:any;
    type: string = 'B2C';
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    totalGrossBookingValue: any = 0;
    totalCustomersData: any = {};
    totalCustomers: any = 0;
    totalBooking: any = 0;
    grossBookingValueData: any = {};
    totalBookingData: any = {};
    grossMarginData: any = {};
    grossBookingValueFilter: string = 'today';
    totalBookingFilter: string = 'today';
    bookingMetrics: any = {};
    totalGrossBookingValueModuleWiseData: any = {};
    totalPromoCodeDiscountCostData: any = {};
    totalAdminMarkupAmountData: any = {};
    totalMarkupConvenienceMinusDiscountData: any = {};
    refundAmountData: any = {};
    paymentSuccessRateData: any = {};
    paymentFailedRateData: any = {};
    paymentMetricsData: any = {};
    dashboardMetricsData: any = {};
    serviceDeliveredCancelledCountData: any = {};
    paymentPendingData: any = {};
    paymentCompletedData: any = {};
    documentsNotIssuedCountData: any = {};
    totalPromoCodeDiscountCost: any = 0;
    totalAdminMarkupAmount: any = 0;
    grossMargin: any = 0;
    markupEarned: any = 0;
    convenienceFee: any = 0;
    refundAmount: any = 0;
    paymentSuccessRate: any = 0;
    paymentFailedRate: any = 0;
    serviceDeliveredCount: any = 0;
    serviceCancelledCount: any = 0;
    paymentPendingCount: any = 0;
    paymentCompletedCount: any = 0;
    documentsNotIssuedCount: any = 0;
    averageBookingValue: any = 0;
    activeVendorsData: any = {};
pendingVendorsData: any = {};
vendorsCategoryWiseData: any = {};
vendorLocationWiseData: any = {};
repeatedCustomersData: any = {};
vendorWiseRevenueData: any = {};
pendingVendorConfirmationsData: any = {};
totalVendorsData: any = {};
packageInventoryData: any = {};
packageBookingData: any = {};
packageRevenueData: any = {};
confirmedBookingsData: any = {};

activeVendors: any = 0;
pendingVendors: any = 0;
totalVendors: any = 0;
confirmedBookings: any = 0;
    pendingVendorConfirmations: any = 0;
    refundsPending: any = 0;
    openCustomerIssues: any = 0;
    dashboardApiFields = [
        { responseKey: 'totalPeriodBooking', apiKey: 'totalPeriodBooking', dataFields: ['totalBookingData'] },
        { responseKey: 'dashboardMetrics', apiKey: 'dashboardMetrics', dataFields: ['dashboardMetricsData'] },
        { responseKey: 'paymentMetrics', apiKey: 'paymentMetrics', dataFields: ['paymentMetricsData'] },
        { responseKey: 'getBookingMetrics', apiKey: 'getBookingMetrics', dataFields: ['bookingMetrics'] },
        { responseKey: 'totalGrossBookingValueModuleWise', apiKey: 'totalGrossBookingValueModuleWise', dataFields: ['grossBookingValueData', 'totalGrossBookingValueModuleWiseData'] },
        { responseKey: 'GrossMargin', apiKey: 'GrossMargin', dataFields: ['grossMarginData'] },
        { responseKey: 'totalPromoCodeDiscountCost', apiKey: 'totalPromoCodeDiscountCost', dataFields: ['totalPromoCodeDiscountCostData'] },
        { responseKey: 'totalAdminMarkupAmount', apiKey: 'totalAdminMarkupAmount', dataFields: ['totalAdminMarkupAmountData'] },
        { responseKey: 'totalMarkupConvenienceMinusDiscount', apiKey: 'totalMarkupConvenienceMinusDiscount', dataFields: ['totalMarkupConvenienceMinusDiscountData'] },
        { responseKey: 'RefundAmount', apiKey: 'RefundAmount', dataFields: ['refundAmountData'] },
        { responseKey: 'paymentSuccessRate', apiKey: 'paymentSuccessRate', dataFields: ['paymentSuccessRateData'] },
        { responseKey: 'paymentFailedRate', apiKey: 'paymentFailedRate', dataFields: ['paymentFailedRateData'] },
        { responseKey: 'serviceDeliveredCancelledCount', apiKey: 'serviceDeliveredCancelledCount', dataFields: ['serviceDeliveredCancelledCountData'] },
        { responseKey: 'paymentPending', apiKey: 'paymentPending', dataFields: ['paymentPendingData'] },
        { responseKey: 'paymentCompleted', apiKey: 'paymentCompleted', dataFields: ['paymentCompletedData'] },
        { responseKey: 'documentsNotIssuedCount', apiKey: 'documentsNotIssuedCount', dataFields: ['documentsNotIssuedCountData'] },
        { responseKey: 'activeVendors', apiKey: 'ActiveVendors', dataFields: ['activeVendorsData'] },
        { responseKey: 'pendingVendors', apiKey: 'pendingVendors', dataFields: ['pendingVendorsData'] },
        { responseKey: 'vendorsCategoryWise', apiKey: 'VendorsCategoryWise', dataFields: ['vendorsCategoryWiseData'] },
        { responseKey: 'vendorLocationWise', apiKey: 'VendorLocationWise', dataFields: ['vendorLocationWiseData'] },
        { responseKey: 'repeatedCustomers', apiKey: 'RepeatedCustomers', dataFields: ['repeatedCustomersData'] },
        { responseKey: 'vendorWiseRevenue', apiKey: 'VendorWiseRevenue', dataFields: ['vendorWiseRevenueData'] },
        { responseKey: 'pendingVendorConfirmations', apiKey: 'PendingVendorConfirmations', dataFields: ['pendingVendorConfirmationsData'] },
        { responseKey: 'totalVendors', apiKey: 'totalVendors', dataFields: ['totalVendorsData'] },
        { responseKey: 'packageInventory', apiKey: 'totalActiveInactivePackages', dataFields: ['packageInventoryData'] },
        { responseKey: 'packageBooking', apiKey: 'AverageBookingValue', dataFields: ['packageBookingData'] },
        { responseKey: 'packageRevenue', apiKey: 'totalGrossBookingValuePackageWise', dataFields: ['packageRevenueData'] },
        { responseKey: 'confirmedBookings', apiKey: 'totalConfirmedBookings', dataFields: ['confirmedBookingsData'] }
    ];
    dashboardFilterOptions = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'This Week', value: 'thisWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'All', value: 'all' }
    ];
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private dashboardService: DashboardService,
        private swalService: SwalService,
        private confService: ConfService,
        private appService: AppService,
        private cdr:ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
         this.selectedDate = new Date();
        this.route.queryParams.subscribe(params => {
            this.type = params['type'] || 'B2C'; // Default to 'B2C' if not present
            console.log('Query Param - type:', this.type);
      
            // Fetch data again when query param changes
            this.getModuleBookingCount();
            this.getDashboardKpis();
            this.getTotalCustomers();
            this.getBookingCalender();
            this.getMonthlyRecapReport(); // Keep this here to ensure it updates
    
            this.cdr.detectChanges(); // Ensure view updates
    
            this.eventClicked();
        });
    }
    


    getModuleBookingCount(): void {
        this.loading = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('bookingCount', 'post', {}, {}, {UserType: this.type})
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.moduleBookingCountFound = true;
                    this.loading = false;
                    //const flightModuleBookingCount =resp['data']['BookingCount'];
                    resp.data.BookingCount.map((data) => {
                        if(data.module === 'Hotel Booking') {
                            data.class = 'text-warning'
                        }

                        if (data.module === 'Activity Booking') {
                            data.class = 'bg-primary'
                        }
                        if (data.module === 'Transfer Booking') {
                            data.class = 'text-warning'
                        }
                        if (data.module === 'Tour Booking') {
                            data.class = 'bg-primary'
                        }

                    })
                    this.moduleBookingCount = resp['data']['BookingCount'].filter( i => i.module !== "Flight Booking");
                } else {
                    this.moduleBookingCount = [];
                    this.loading = false;
                }
            }, (err) => {
                this.loading = false;
                this.moduleBookingCount = [];
            });
    }

    getDashboardKpis(): void {
        this.loading = true;
        const dashboardRequests = this.dashboardApiFields.reduce((requests, field) => {
            requests[field.responseKey] = this.safeDashboardRequest(field.apiKey);
            return requests;
        }, {});

        this.subSunk.sink = forkJoin(dashboardRequests).subscribe((resp: any) => {
            this.dashboardApiFields.forEach(field => {
                const data = this.getDashboardData(resp[field.responseKey]);
                field.dataFields.forEach(dataField => {
                    this[dataField] = data;
                });
            });

            this.updateDashboardKpis();
            this.loading = false;
            this.cdr.detectChanges();
        }, () => {
            this.resetDashboardKpis();
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    prepareVendorDashboardCards(): void {
    this.vendorDashboardCards = [
        {
            title: 'Total Vendors',
            value: this.totalVendors,
            class: 'total-bookings'
        },
        {
            title: 'Active Vendors',
            value: this.activeVendors,
            class: 'bookings'
        },
        {
            title: 'Pending Vendors',
            value: this.pendingVendors,
            class: 'pending-payments'
        },
        {
            title: 'Pending Vendor Confirmations',
            value: this.pendingVendorConfirmations,
            class: 'pending-vendor-confirm'
        },
        {
            title: 'Repeated Customers',
            value: this.extractDashboardValue(
                this.repeatedCustomersData,
                'all',
                ['repeatedCustomers', 'customers', 'count', 'total']
            ),
            class: 'avg-booking-value'
        },
        {
            title: 'Vendor Wise Revenue',
            value: this.extractDashboardValue(
                this.vendorWiseRevenueData,
                'all',
                ['vendorWiseRevenue', 'revenue', 'amount', 'total']
            ),
            class: 'net-revenue'
        },
        {
            title: 'Vendor Category Wise',
            value: this.extractDashboardValue(
                this.vendorsCategoryWiseData,
                'all',
                ['vendorsCategoryWise', 'categoryWise', 'count', 'total']
            ),
            class: 'refund-pendings'
        },
        {
            title: 'Vendor Location Wise',
            value: this.extractDashboardValue(
                this.vendorLocationWiseData,
                'all',
                ['vendorLocationWise', 'locationWise', 'count', 'total']
            ),
            class: 'open-cust-issues'
        }
    ];
}

    safeDashboardRequest(topic: string) {
        return this.apiHandlerService.apiHandler(topic, 'post', {}, {}, {})
            .pipe(catchError(() => of({ statusCode: 500, data: {} })));
    }

        getTotalCustomers(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('totalCustomers', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.totalCustomersData = this.getDashboardData(resp);
                    // this.updateTotalCustomers();
                    this.cdr.detectChanges();
                }
            }, () => {
                this.totalCustomersData = {};
                this.totalCustomers = 0;
            });
    }


    getTotalBooking(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('totalBooking', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.totalBookingData = this.getDashboardData(resp);
                    this.updateDashboardKpis();
                    this.cdr.detectChanges();
                }
            }, () => {
                this.totalBookingData = {};
                this.totalBooking = 0;
            });
    }

    getDashboardData(resp: any): any {
        return resp && (resp.data !== undefined ? resp.data : resp.Data !== undefined ? resp.Data : resp);
    }

    onGrossBookingValueFilterChange(): void {
        this.updateDashboardKpis();
    }

    onTotalBookingFilterChange(): void {
        this.updateDashboardKpis();
    }

    updateDashboardKpis(): void {
        this.totalGrossBookingValue = this.extractDashboardValue(this.grossBookingValueData, this.grossBookingValueFilter, [
            'totalGrossBookingValue',
            'totalGrossBookingValueModuleWise',
            'grossBookingValue',
            'total_gross_booking_value',
            'GBV',
            'gbv',
            'totalGBV',
            'total'
        ]);
        this.totalGrossBookingValue = this.extractDashboardValue(this.dashboardMetricsData, this.grossBookingValueFilter, [
            'gmv',
            'totalGrossBookingValue',
            'totalGrossBookingValueModuleWise',
            'grossBookingValue',
            'total_gross_booking_value',
            'GBV',
            'gbv',
            'totalGBV',
            'total'
        ]) || this.totalGrossBookingValue;
        this.totalGrossBookingValue = this.getExactDashboardNumber(this.dashboardMetricsData, 'gmv', this.totalGrossBookingValue);
        this.totalBooking = this.extractDashboardValue(this.totalBookingData, this.totalBookingFilter, [
            'totalBooking',
            'totalBookings',
            'total_booking',
            'bookingCount',
            'count',
            'total'
        ]);
        this.totalBooking = this.extractDashboardValue(this.dashboardMetricsData, this.totalBookingFilter, [
            'totalBooking',
            'totalBookings',
            'total_booking',
            'bookingCount',
            'count',
            'total'
        ]) || this.totalBooking;
        this.totalBooking = this.getExactDashboardNumber(this.dashboardMetricsData, 'totalBookings', this.totalBooking);
        this.grossMargin = this.extractDashboardValue(this.grossMarginData, 'all', [
            'GrossMargin',
            'grossMargin',
            'grossMarginValue',
            'gross_margin',
            'margin',
            'amount',
            'total'
        ]);
        this.grossMargin = this.extractDashboardValue(this.dashboardMetricsData, 'all', [
            'GrossMargin',
            'grossMargin',
            'grossMarginValue',
            'gross_margin',
            'margin',
            'amount',
            'total'
        ]) || this.grossMargin;
        this.markupEarned = this.extractDashboardValue(this.totalMarkupConvenienceMinusDiscountData, 'all', [
            'totalMarkupAmount',
            'totalMarkupConvenienceMinusDiscount',
            'markupConvenienceMinusDiscount',
            'markupEarned',
            'markup_earned',
            'netRevenue',
            'net_revenue',
            'amount',
            'total'
        ]);
        this.markupEarned = this.extractDashboardValue(this.dashboardMetricsData, 'all', [
            'totalMarkupAmount',
            'totalMarkupConvenienceMinusDiscount',
            'markupConvenienceMinusDiscount',
            'markupEarned',
            'markup_earned',
            'netRevenue',
            'net_revenue',
            'amount',
            'total'
        ]) || this.markupEarned;
        this.convenienceFee = this.extractDashboardValue(this.totalMarkupConvenienceMinusDiscountData, 'all', [
            'totalConvenienceFee',
            'convenienceFee',
            'convenience_fee',
            'fee',
            'amount',
            'total'
        ]);
        this.convenienceFee = this.extractDashboardValue(this.dashboardMetricsData, 'all', [
            'totalConvenienceFee',
            'convenienceFee',
            'convenience_fee',
            'fee',
            'amount',
            'total'
        ]) || this.convenienceFee;
        this.grossMargin = this.getExactDashboardNumber(this.grossMarginData, 'grossMarginValue', this.grossMargin);
        this.markupEarned = this.getExactDashboardNumber(this.totalMarkupConvenienceMinusDiscountData, 'totalMarkupAmount', this.markupEarned);
        this.convenienceFee = this.getExactDashboardNumber(this.totalMarkupConvenienceMinusDiscountData, 'totalConvenienceFee', this.convenienceFee);
        this.refundAmount = this.extractDashboardValue(this.refundAmountData, 'all', [
            'refundAmount',
            'RefundAmount',
            'totalRefundAmount',
            'totalRefundValue',
            'total_refund_amount',
            'refund',
            'amount',
            'total'
        ]);
        this.refundAmount = this.getExactDashboardNumber(this.refundAmountData, 'refundAmount', this.refundAmount);
        this.refundAmount = this.getExactDashboardNumber(this.refundAmountData, 'totalRefundAmount', this.refundAmount);
        this.refundAmount = this.getExactDashboardNumber(this.refundAmountData, 'totalRefundValue', this.refundAmount);
        this.paymentSuccessRate = this.extractDashboardValue(this.paymentSuccessRateData, 'all', [
            'paymentSuccessRate',
            'successRate',
            'payment_success_rate',
            'rate',
            'percentage',
            'amount',
            'total'
        ]);
        this.paymentSuccessRate = this.extractDashboardValue(this.paymentMetricsData, 'all', [
            'paymentSuccessRate',
            'successRate',
            'payment_success_rate',
            'rate',
            'percentage',
            'amount',
            'total'
        ]) || this.paymentSuccessRate;
        this.paymentSuccessRate = this.getExactDashboardNumber(this.paymentMetricsData, 'paymentSuccessRate', this.paymentSuccessRate);
        this.paymentSuccessRate = this.getExactDashboardNumber(this.paymentSuccessRateData, 'paymentSuccessRate', this.paymentSuccessRate);
        this.paymentFailedRate = this.extractDashboardValue(this.paymentFailedRateData, 'all', [
            'paymentFailedRate',
            'failedPaymentRate',
            'failureRate',
            'payment_failed_rate',
            'rate',
            'percentage',
            'amount',
            'total'
        ]);
        this.paymentFailedRate = this.extractDashboardValue(this.paymentMetricsData, 'all', [
            'paymentFailedRate',
            'failedPaymentRate',
            'failureRate',
            'payment_failed_rate',
            'rate',
            'percentage',
            'amount',
            'total'
        ]) || this.paymentFailedRate;
        this.paymentFailedRate = this.getExactDashboardNumber(this.paymentMetricsData, 'paymentFailedRate', this.paymentFailedRate);
        this.paymentFailedRate = this.getExactDashboardNumber(this.paymentFailedRateData, 'paymentFailedRate', this.paymentFailedRate);
        this.totalPromoCodeDiscountCost = this.extractDashboardValue(this.totalPromoCodeDiscountCostData, 'all', [
            'totalPromoCodeDiscountCost',
            'promoCodeDiscountCost',
            'discount',
            'amount',
            'total'
        ]);
        this.totalAdminMarkupAmount = this.extractDashboardValue(this.totalAdminMarkupAmountData, 'all', [
            'totalAdminMarkupAmount',
            'adminMarkupAmount',
            'markup',
            'amount',
            'total'
        ]);
        this.serviceDeliveredCount = this.extractDashboardValue(this.serviceDeliveredCancelledCountData, 'all', [
            'serviceDeliveredCount',
            'deliveredCount',
            'delivered',
            'completed',
            'success',
            'totalDelivered'
        ]);
        this.serviceCancelledCount = this.extractDashboardValue(this.serviceDeliveredCancelledCountData, 'all', [
            'serviceCancelledCount',
            'cancelledCount',
            'cancelled',
            'canceled',
            'totalCancelled'
        ]);
        this.paymentPendingCount = this.extractDashboardValue(this.paymentPendingData, 'all', [
            'paymentPending',
            'pendingPayment',
            'pendingPayments',
            'paymentPendingCount',
            'count',
            'total'
        ]);
        this.paymentPendingCount = this.extractDashboardValue(this.paymentMetricsData, 'all', [
            'paymentPending',
            'pendingPayment',
            'pendingPayments',
            'paymentPendingCount',
            'pendingCount',
            'count',
            'total'
        ]) || this.paymentPendingCount;
        this.paymentCompletedCount = this.extractDashboardValue(this.paymentCompletedData, 'all', [
            'paymentCompleted',
            'completedPayment',
            'completedPayments',
            'paymentCompletedCount',
            'count',
            'total'
        ]);
        this.paymentCompletedCount = this.extractDashboardValue(this.paymentMetricsData, 'all', [
            'paymentCompleted',
            'completedPayment',
            'completedPayments',
            'paymentCompletedCount',
            'successPayment',
            'successPayments',
            'count',
            'total'
        ]) || this.paymentCompletedCount;
        this.documentsNotIssuedCount = this.extractDashboardValue(this.documentsNotIssuedCountData, 'all', [
            'documentsNotIssuedCount',
            'documentNotIssuedCount',
            'notIssuedCount',
            'count',
            'total'
        ]);
        this.averageBookingValue = this.extractDashboardValue(this.bookingMetrics, 'all', [
            'averageBookingValue',
            'avgBookingValue',
            'average_booking_value',
            'ABV',
            'abv'
        ]);
        this.averageBookingValue = this.extractDashboardValue(this.dashboardMetricsData, 'all', [
            'averageBookingValue',
            'avgBookingValue',
            'average_booking_value',
            'ABV',
            'abv'
        ]) || this.averageBookingValue;
        this.averageBookingValue = this.getExactDashboardNumber(this.dashboardMetricsData, 'avgBookingValue', this.averageBookingValue);
        this.pendingVendorConfirmations = this.extractDashboardValue(this.bookingMetrics, 'all', [
            'pendingVendorConfirmations',
            'pendingVendorConfirmation',
            'vendorPending',
            'pendingSupplierConfirmations',
            'pendingConfirmation'
        ]);
        this.pendingVendorConfirmations = this.extractDashboardValue(this.pendingVendorConfirmationsData, 'all', [
            'totalPendingAcrossAllVendors',
            'pendingVendorConfirmations',
            'pendingVendorConfirmation',
            'pendingSupplierConfirmations',
            'vendorConfirmationPending',
            'vendorPending',
            'count',
            'total'
        ]) || this.pendingVendorConfirmations;
        this.pendingVendorConfirmations = this.getExactDashboardNumber(
            this.pendingVendorConfirmationsData,
            'totalPendingAcrossAllVendors',
            this.pendingVendorConfirmations
        );
        this.refundsPending = this.extractDashboardValue(this.bookingMetrics, 'all', [
            'refundsPending',
            'refundPending',
            'pendingRefunds',
            'refundCount'
        ]);
        this.refundsPending = this.extractDashboardValue(this.paymentMetricsData, 'all', [
            'refundsPending',
            'refundPending',
            'pendingRefunds',
            'refundCount'
        ]) || this.refundsPending;
        this.openCustomerIssues = this.extractDashboardValue(this.bookingMetrics, 'all', [
            'openCustomerIssues',
            'customerIssues',
            'openIssues',
            'issues'
        ]);
        this.openCustomerIssues = this.extractDashboardValue(this.dashboardMetricsData, 'all', [
            'openCustomerIssues',
            'customerIssues',
            'openIssues',
            'issues'
        ]) || this.openCustomerIssues;
        this.activeVendors = this.extractDashboardValue(
    this.activeVendorsData,
    'all',
    ['activeVendors', 'count', 'total'],
    
);

this.pendingVendors = this.extractDashboardValue(
    this.pendingVendorsData,
    'all',
    ['pendingVendors', 'count', 'total']
);

this.totalVendors = this.extractDashboardValue(
    this.totalVendorsData,
    'all',
    ['totalVendors', 'count', 'total']
);
this.confirmedBookings = this.extractDashboardValue(
    this.confirmedBookingsData,
    'all',
    [
        'totalConfirmedBookings',
        'confirmedBookings',
        'confirmedBooking',
        'totalConfirmed',
        'confirmed',
        'bookingCount',
        'count',
        'total'
    ]
) || this.totalBooking;
this.updateTotalVendorData();
this.prepareVendorDashboardCards();
    }

    resetDashboardKpis(): void {
        this.grossBookingValueData = {};
        this.grossMarginData = {};
        this.totalBookingData = {};
        this.bookingMetrics = {};
        this.paymentMetricsData = {};
        this.dashboardMetricsData = {};
        this.vendorDashboardCards = [];
        this.totalGrossBookingValueModuleWiseData = {};
        this.totalPromoCodeDiscountCostData = {};
        this.totalAdminMarkupAmountData = {};
        this.totalMarkupConvenienceMinusDiscountData = {};
        this.refundAmountData = {};
        this.paymentSuccessRateData = {};
        this.paymentFailedRateData = {};
        this.serviceDeliveredCancelledCountData = {};
        this.paymentPendingData = {};
        this.paymentCompletedData = {};
        this.documentsNotIssuedCountData = {};
        this.totalGrossBookingValue = 0;
        this.totalBooking = 0;
        this.grossMargin = 0;
        this.markupEarned = 0;
        this.convenienceFee = 0;
        this.refundAmount = 0;
        this.paymentSuccessRate = 0;
        this.paymentFailedRate = 0;
        this.totalPromoCodeDiscountCost = 0;
        this.totalAdminMarkupAmount = 0;
        this.serviceDeliveredCount = 0;
        this.serviceCancelledCount = 0;
        this.paymentPendingCount = 0;
        this.paymentCompletedCount = 0;
        this.documentsNotIssuedCount = 0;
        this.averageBookingValue = 0;
        this.pendingVendorConfirmations = 0;
        this.refundsPending = 0;
        this.openCustomerIssues = 0;
        this.activeVendorsData = {};
        
this.pendingVendorsData = {};
this.vendorsCategoryWiseData = {};
this.vendorLocationWiseData = {};
this.repeatedCustomersData = {};
this.vendorWiseRevenueData = {};
this.pendingVendorConfirmationsData = {};
this.totalVendorsData = {};
this.packageInventoryData = {};
this.packageBookingData = {};
this.packageRevenueData = {};
this.confirmedBookingsData = {};

this.activeVendors = 0;
this.pendingVendors = 0;
this.totalVendors = 0;
this.confirmedBookings = 0;
    }

    extractDashboardValue(source: any, selectedFilter: string, totalKeys: string[]): any {
        const value = selectedFilter === 'all'
            ? this.findDashboardValue(source, totalKeys)
            : this.findFilteredDashboardValue(source, selectedFilter, totalKeys);
        return value !== undefined && value !== null && value !== '' ? value : 0;
    }

    getExactDashboardNumber(source: any, key: string, fallback: any = 0): any {
        const value = this.findExactDashboardValue(source, key);
        return value !== undefined && value !== null && value !== '' ? value : fallback;
    }

    findExactDashboardValue(source: any, key: string): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return undefined;
        }

        if (Array.isArray(source)) {
            for (const item of source) {
                const value = this.findExactDashboardValue(item, key);
                if (value !== undefined && value !== null && value !== '') {
                    return value;
                }
            }
            return undefined;
        }

        if (source[key] !== undefined && source[key] !== null) {
            return source[key];
        }

        for (const value of Object.values(source)) {
            const nestedValue = this.findExactDashboardValue(value, key);
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                return nestedValue;
            }
        }

        return undefined;
    }

    findFilteredDashboardValue(source: any, selectedFilter: string, valueKeys: string[]): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return undefined;
        }

        if (Array.isArray(source)) {
            const values = source
                .map(item => this.findFilteredDashboardValue(item, selectedFilter, valueKeys))
                .filter(value => value !== undefined && value !== null && value !== '');
            const numericValues = values
                .map(value => this.toNumber(value))
                .filter(value => !isNaN(value));

            if (numericValues.length) {
                return numericValues.reduce((total, value) => total + value, 0);
            }

            return values.length ? values[0] : undefined;
        }

        if (this.isDashboardFilterRecord(source, selectedFilter)) {
            const value = this.findDashboardValue(source, valueKeys);
            return value !== undefined && value !== null && value !== ''
                ? value
                : this.findFirstPrimitiveValue(source, ['period', 'type', 'filter', 'label', 'name', 'range', 'date']);
        }

        for (const key of Object.keys(source)) {
            if (this.matchesDashboardFilterKey(key, selectedFilter)) {
                const value = source[key];
                if (value !== null && typeof value === 'object') {
                    const nestedValue = this.findDashboardValue(value, valueKeys);
                    return nestedValue !== undefined && nestedValue !== null && nestedValue !== ''
                        ? nestedValue
                        : this.findFirstPrimitiveValue(value);
                }
                return value;
            }
        }

        for (const key of Object.keys(source)) {
            if (this.matchesDashboardCompositeKey(key, selectedFilter, valueKeys)) {
                const value = source[key];
                if (value !== null && typeof value === 'object') {
                    return this.findDashboardValue(value, valueKeys);
                }
                return value;
            }
        }

        for (const value of Object.values(source)) {
            const nestedValue = this.findFilteredDashboardValue(value, selectedFilter, valueKeys);
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                return nestedValue;
            }
        }

        return undefined;
    }

    findDashboardValue(source: any, keys: string[]): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return source;
        }

        if (Array.isArray(source)) {
            if (!source.length) {
                return undefined;
            }

            const values = source
                .map(item => this.findDashboardValue(item, keys))
                .filter(value => value !== undefined && value !== null && value !== '');
            const numericValues = values
                .map(value => this.toNumber(value))
                .filter(value => !isNaN(value));

            if (numericValues.length) {
                return numericValues.reduce((total, value) => total + value, 0);
            }

            return values.length ? values[0] : undefined;
        }

        for (const key of keys) {
            if (source[key] !== undefined && source[key] !== null) {
                return typeof source[key] === 'object' ? this.findDashboardValue(source[key], keys) : source[key];
            }
        }

        for (const value of Object.values(source)) {
            if (value !== null && value !== undefined && typeof value !== 'object') {
                return value;
            }
        }

        for (const value of Object.values(source)) {
            const nestedValue = this.findDashboardValue(value, keys);
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                return nestedValue;
            }
        }

        return undefined;
    }

    findFirstPrimitiveValue(source: any, skipKeys: string[] = []): any {
        if (source === null || source === undefined) {
            return undefined;
        }

        if (typeof source !== 'object') {
            return source;
        }

        if (Array.isArray(source)) {
            for (const value of source) {
                const nestedValue = this.findFirstPrimitiveValue(value);
                if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                    return nestedValue;
                }
            }
            return undefined;
        }

        for (const key of Object.keys(source)) {
            if (skipKeys.indexOf(key) !== -1) {
                continue;
            }
            const value = source[key];
            if (value !== null && value !== undefined && typeof value !== 'object') {
                return value;
            }
        }

        for (const key of Object.keys(source)) {
            if (skipKeys.indexOf(key) !== -1) {
                continue;
            }
            const nestedValue = this.findFirstPrimitiveValue(source[key], skipKeys);
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                return nestedValue;
            }
        }

        return undefined;
    }

    isDashboardFilterRecord(source: any, selectedFilter: string): boolean {
        const periodKeys = ['period', 'type', 'filter', 'label', 'name', 'range', 'date'];
        return periodKeys.some(key => source[key] !== undefined
            && this.matchesDashboardFilterKey(String(source[key]), selectedFilter));
    }

    matchesDashboardFilterKey(key: string, selectedFilter: string): boolean {
        return this.getDashboardFilterAliases(selectedFilter).indexOf(this.normalizeDashboardKey(key)) !== -1;
    }

    matchesDashboardCompositeKey(key: string, selectedFilter: string, valueKeys: string[]): boolean {
        const normalizedKey = this.normalizeDashboardKey(key);
        const filterAliases = this.getDashboardFilterAliases(selectedFilter);
        const valueAliases = valueKeys.map(valueKey => this.normalizeDashboardKey(valueKey));
        return filterAliases.some(alias => normalizedKey.indexOf(alias) !== -1)
            && valueAliases.some(alias => normalizedKey.indexOf(alias) !== -1);
    }

    getDashboardFilterAliases(selectedFilter: string): string[] {
        const aliases = {
            today: ['today', 'todate', 'currentday'],
            yesterday: ['yesterday', 'previousday'],
            thisWeek: ['thisweek', 'currentweek', 'week', 'weekly'],
            thisMonth: ['thismonth', 'currentmonth', 'month', 'monthly'],
            lastMonth: ['lastmonth', 'previousmonth'],
            all: ['all', 'total', 'overall']
        };

        return aliases[selectedFilter] || [this.normalizeDashboardKey(selectedFilter)];
    }

    normalizeDashboardKey(value: string): string {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    toNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            return Number(value.replace(/,/g, ''));
        }

        return NaN;
    }
    totalVendorResponse: any = {};
vendorCategories: any[] = [];

updateTotalVendorData(): void {
  const data = this.totalVendorsData?.data || this.totalVendorsData || {};

  this.totalVendors = data.totalvendorsOnboarded ?? data.totalVendors ?? data.count ?? this.totalVendors ?? 0;
  this.activeVendors = data.totalActiveVendors ?? data.activeVendors ?? this.activeVendors ?? 0;

  this.vendorCategories = Object.entries(data.categoryBreakdown || {}).map(
    ([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: count || 0
    })
  );
}

    getBookingCalender() {
        let year = this.selectedDate.getFullYear();
        var month = this.selectedDate.toLocaleString('default', { month: 'short' });
        month=month.substring(0,3)
        let classNames: string[] =['myclass1'];
        this.apiHandlerService.apiHandler('bookingCalender', 'post', {}, {},  { year: year, "month" : month.toUpperCase(), userType: this.type })
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.bookingCalenderFound = true;
                    const dayWiseResponse = resp?.data?.DayWise || [];
                    const dayWise = Array.isArray(dayWiseResponse)
                        ? dayWiseResponse
                        : Array.isArray(dayWiseResponse?.data)
                            ? dayWiseResponse.data
                            : Object.values(dayWiseResponse || {});
                    const arr2 = dayWise.map((x: any) => ({...x,backgroundColor:'green',textColor:'white',classNames:classNames}));
                    this.calendarEvents = arr2;
                }
                else if (resp.statusCode == 404) {
                    this.bookingCalenderFound = false;
                    this.swalService.alert.error();
                }
            });
    }

    handleDateClick(calDate) {
        this.selectedDate=calDate.date;
        let reqBody = {}
        reqBody = {
            "booked_from_date": moment(calDate.date).format('YYYY-MM-DD'),
            "booked_to_date": moment(calDate.date).format('YYYY-MM-DD'),
        }
        this.getb2bFlightReport(reqBody)
    }

    eventClicked(eventData?) {
        let reqBody={}
        if (eventData) {
            this.selectedDate=eventData.event.start;
            reqBody = {
                "booked_from_date": moment(new Date(eventData.event.start)).format('YYYY-MM-DD'),
                "booked_to_date": moment(new Date(eventData.event.start)).format('YYYY-MM-DD'),
            }
        }
        else {
            this.selectedDate=new Date();
            reqBody = {
                "booked_from_date": moment(new Date()).format('YYYY-MM-DD'),
                "booked_to_date": moment(new Date()).format('YYYY-MM-DD'),
            }
        }
        this.getb2bFlightReport(reqBody);
    }

    calenderNext() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.next(); 
        this.setMonthYear(calendarApi);
    }

    setToday() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.today(); 
        this.setMonthYear(calendarApi);
    }

    calenderPrev() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.prev();
        this.setMonthYear(calendarApi);
    }

    setMonthYear(calendarApi) {
        this.selectedDate = calendarApi.getDate();
        this.getBookingCalender();
        let reqBody = {}
        reqBody = {
            "booked_from_date": moment(new Date(this.selectedDate)).format('YYYY-MM-DD'),
            "booked_to_date": moment(new Date(this.selectedDate)).format('YYYY-MM-DD'),
        }
        this.getb2bFlightReport(reqBody)
    }

    getb2bFlightReport(reqBody){
        reqBody['app_reference']="";
        reqBody['pnr']="";
        reqBody['email']="";
        reqBody['status']= "BOOKING_CONFIRMED";
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightReport', 'post', {}, {}, reqBody)
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.bookingDetails=resp.data;
                this.bookingDetailsFound=true;
                this.cdr.detectChanges();
            }
            else {
                this.bookingDetailsFound = false;
                this.cdr.detectChanges();
            }
        });
    }

    getMonthlyRecapReport() {
        this.chartOptions2 = getCartOptions2({});
        // this.dashboardService.fetch({ topic: 'monthlyRecapReport' })
        //     .subscribe(resp => {
        //         log.debug(resp);
        //         if (resp.statusCode == 200) {
        //             this.noData = false;
        //             this.chartOptions2 = getCartOptions2(resp.data);
        //         }
        //         else if (resp.statusCode == 404) {
        //             this.noData = true;
        //             this.swalService.alert.error();
        //         }
        //     });
    }

    copyMessage(val: string){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}

function getcalendarEvents(respData) {
    return respData.calender_data.map(val => {
        let data = {
            reference_number: val['app_reference'],
            status: val['status'],
            booking_source: val['booking_source'],
        }
        let qP = JSON.stringify(data);
        return {
            title: val.title,
            start: val.start,
            url: `./reports/flight-voucher?data=${qP}`,
        }
    });
}
function getChartOptions(respData) {
    return {
        chart: {
            type: "spline" // line
        },
        title: {
            text: respData.title || "Booking Details"
        },
        subtitle: {
            text: respData['subtitle'] ? `Source: ${respData.subtitle}` : 'Source: provab.com'
        },
        xAxis: {
            categories:
                // [...respData['time_line_interval']]
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yAxis: {
            title: {
                text: `No.of Bookings (Total: ${respData['max_count'] || 0})`
            }
        },
        "tooltip": {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: [...respData['BookingDetails']],
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
            "text": respData['source'] ? `Source: ${respData['source']}` : "Source: TourBro.com"
        },
        "xAxis": {
            "categories":
                // respData['time_line_interval'],
                [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
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
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
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
        "series":
            // [...respData['group_time_line_report']],
            [{
                "name": "Flight",
                "data": [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                "name": "Hotel",
                "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            },
            {
                "name": "Activity",
                "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            },
            {
                "name": "Transfer",
                "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            },
            {
                "name": "Tour",
                "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            },
            ]
    }
    
}


function getStats() {
    return [
        {
            module: 'Flight Booking',
            class: 'bg-primary',
            icon: 'bg-primary fa fa-plane',
            noOfBookings: 2,
            reportsType: ['Agent Report']
        },
        {
            module: 'Hotel Bookins',
            class: 'bg-success',
            icon: 'fa fa-bed',
            noOfBookings: 2,
            reportsType: ['Agent Report']
        },
        // {
        //   module: 'Bus Booking',
        //   class: 'bg-danger',
        //   icon: 'fa fa-bus',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Transfer Booking',
        //   class: 'bg-success',
        //   icon: 'fa fa-taxi',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Activities Booking',
        //   class: 'bg-warning',
        //   icon: 'fa fa-binoculars',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Holiday Enquiry',
        //   subTitle: "Enquiries",
        //   class: 'bg-warning',
        //   icon: 'fa fa-suitcase',
        //   // noOfBookings: 0,
        //   // reportsType: ['B2C Report', 'Agent Report']
        // }
    ]

    
}
