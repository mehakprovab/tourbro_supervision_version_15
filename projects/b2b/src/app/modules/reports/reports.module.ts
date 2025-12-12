import { NgModule } from "@angular/core";
import {
    AgentsComponent,
    TransactionLogsComponent,
    SearchHistoryComponent,
    TopDestinationsComponent,
    AccountLedgerComponent,
    DynamicTableComponent,
    AdvSearchComponent,
    BookingDetailsComponent,
    DailySalesReportComponent,
    PendingTicketComponent,
    PNRSearchComponent,
} from './components';
import { ReportsRouterModule } from './reports-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';
import { LayoutsModule } from '../../layout/layout.module';
import { VoucherComponent } from './components/booking-details/voucher/voucher.component';
import { SearchComponent } from './components/search/search.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SearchFormComponent } from './components/search/components/search-form/search-form.component';
import { FlightBookingReportComponent } from './components/flight-booking-report/flight-booking-report.component';
import { HotelBookingReportComponent } from './components/hotel-booking-report/hotel-booking-report.component';
import { CarBookingReportComponent } from './components/car-booking-report/car-booking-report.component';
import { HotelVoucherComponent } from './components/booking-details/hotel-voucher/hotel-voucher.component';
import { UpdatePnrTicketComponent } from './components/flight-booking-report/components/update-pnr-ticket/update-pnr-ticket.component';
import { FlightTrackerComponent } from './components/account-ledger/components/flight-tracker/flight-tracker.component';
import { MapCheckComponent } from './components/map-check/map-check.component';
import { TourBookingReportComponent } from "./components/tour-booking-report/tour-booking-report.component";
import { TourEnquiryReportComponent } from "./components/tour-enquiry-report/tour-enquiry-report.component";
import { TourVoucherComponent } from "./components/tour-booking-report/tour-voucher/tour-voucher.component";
import { TourInvoiceComponent } from "./components/tour-booking-report/tour-invoice/tour-invoice.component";
import { ActivityBookingReportComponent } from './components/activity-booking-report/activity-booking-report.component';
import { TransferBookingReportComponent } from './components/transfer-booking-report/transfer-booking-report.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TransferVoucherComponent } from './components/booking-details/transfer-voucher/transfer-voucher.component';
import { ActivityVoucherComponent } from "./components/booking-details/activity-voucher/activity-voucher.component";
import { HotelBookingPaymentStatusComponent } from './components/hotel-booking-report/hotel-booking-payment-status/hotel-booking-payment-status.component';
import { TransferBookingPaymentStatusComponent } from './components/transfer-booking-report/transfer-booking-payment-status/transfer-booking-payment-status.component';
import { ActivityBookingPaymentStatusComponent } from './components/activity-booking-report/activity-booking-payment-status/activity-booking-payment-status.component';
import { BundleBookingReportComponent } from './components/bundle-booking-report/bundle-booking-report.component';


@NgModule({
    imports: [
        LayoutsModule,
        ReportsRouterModule,
        HighchartsChartModule,
        Ng2SearchPipeModule,
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
    ],
    declarations: [
        AgentsComponent,
        TransactionLogsComponent,
        SearchHistoryComponent,
        TopDestinationsComponent,
        AccountLedgerComponent,
        DynamicTableComponent,
        AdvSearchComponent,
        BookingDetailsComponent,
        DailySalesReportComponent,
        PendingTicketComponent,
        PNRSearchComponent,
        VoucherComponent,
        SearchComponent,
        SearchFormComponent,
        FlightBookingReportComponent,
        HotelBookingReportComponent,
        CarBookingReportComponent,
        HotelVoucherComponent,
        UpdatePnrTicketComponent,
        FlightTrackerComponent,
        MapCheckComponent,
        TourBookingReportComponent,
        TourEnquiryReportComponent,
        TourVoucherComponent,
        TourInvoiceComponent,
        ActivityBookingReportComponent,
        TransferBookingReportComponent,
        TransferVoucherComponent,
        ActivityVoucherComponent,
        HotelBookingPaymentStatusComponent,
        TransferBookingPaymentStatusComponent,
        ActivityBookingPaymentStatusComponent,
        BundleBookingReportComponent
        
    ],
    exports: [
        AgentsComponent,
        TransactionLogsComponent,
        SearchHistoryComponent,
        TopDestinationsComponent,
        AccountLedgerComponent,
        DynamicTableComponent,
        AdvSearchComponent,
        BookingDetailsComponent,
        DailySalesReportComponent,
        PendingTicketComponent,
        PNRSearchComponent,
    ]
})
export class ReportsModule { }