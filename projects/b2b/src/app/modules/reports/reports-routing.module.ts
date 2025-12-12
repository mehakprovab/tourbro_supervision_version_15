import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import {
    TransactionLogsComponent,
    AccountLedgerComponent,
    PNRSearchComponent,
    DailySalesReportComponent,
    PendingTicketComponent,
    FlightBookingReportComponent,
    HotelBookingReportComponent,
    CarBookingReportComponent
} from './components';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';
import { VoucherComponent } from './components/booking-details/voucher/voucher.component';
import { HotelVoucherComponent } from './components/booking-details/hotel-voucher/hotel-voucher.component';
import { UpdatePnrTicketComponent } from './components/flight-booking-report/components/update-pnr-ticket/update-pnr-ticket.component';
import { FlightTrackerComponent } from './components/account-ledger/components/flight-tracker/flight-tracker.component';
import { MapCheckComponent } from "./components/map-check/map-check.component";
import { TourEnquiryReportComponent } from "./components/tour-enquiry-report/tour-enquiry-report.component";
import { TourBookingReportComponent } from "./components/tour-booking-report/tour-booking-report.component";
import { TourVoucherComponent } from "./components/tour-booking-report/tour-voucher/tour-voucher.component";
import { TourInvoiceComponent } from "./components/tour-booking-report/tour-invoice/tour-invoice.component";
import { ActivityBookingReportComponent } from "./components/activity-booking-report/activity-booking-report.component";
import { TransferBookingReportComponent } from "./components/transfer-booking-report/transfer-booking-report.component";
import { TransferVoucherComponent } from "./components/booking-details/transfer-voucher/transfer-voucher.component";
import { ActivityVoucherComponent } from "./components/booking-details/activity-voucher/activity-voucher.component";
import { HotelBookingPaymentStatusComponent } from "./components/hotel-booking-report/hotel-booking-payment-status/hotel-booking-payment-status.component";
import { TransferBookingPaymentStatusComponent } from "./components/transfer-booking-report/transfer-booking-payment-status/transfer-booking-payment-status.component";
import { ActivityBookingPaymentStatusComponent } from "./components/activity-booking-report/activity-booking-payment-status/activity-booking-payment-status.component";
import { BundleBookingReportComponent } from "./components/bundle-booking-report/bundle-booking-report.component";


const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'flight-booking-details',
                component: FlightBookingReportComponent,
                data: {extraParameter: 'reportsMenus'}
            },
            {
                path: 'hotel-booking-details',
                component: HotelBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'hotel-booking-payment-status',
                component: HotelBookingPaymentStatusComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'activity-booking-payment-status',
                component: ActivityBookingPaymentStatusComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'activity-booking-details',
                component: ActivityBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'transfer-booking-details',
                component: TransferBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'transfer-booking-payment-status',
                component: TransferBookingPaymentStatusComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'car-booking-details',
                component: CarBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'transaction-logs',
                component: TransactionLogsComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'pnr-search',
                component: PNRSearchComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'daily-sales',
                component: DailySalesReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'account-ledger',
                component: AccountLedgerComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'pending-ticket',
                component: PendingTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-voucher',
                component: VoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'hotel-voucher',
                component: HotelVoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'transfer-voucher',
                component: TransferVoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'activity-voucher',
                component: ActivityVoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-update-pnr',
                component: UpdatePnrTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-tracker',
                component: FlightTrackerComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'map',
                component: MapCheckComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'tour-enquiry-details',
                component: TourEnquiryReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'tour-booking-details',
                component: TourBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'bundle-booking-details',
                component: BundleBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'tour-voucher',
                component: TourVoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'tour-invoice',
                component: TourInvoiceComponent,
                data: { extraParameter: 'reportsMenus' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRouterModule { }