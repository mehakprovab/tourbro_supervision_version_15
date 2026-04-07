import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { B2bComponent } from './B2B/b2b/b2b.component';
import { B2bFlightComponent } from './B2B/b2b/b2b-flight/b2b-flight.component';
import { B2bHotelComponent } from './B2B/b2b/b2b-hotel/b2b-hotel.component';
import { B2cComponent } from './B2C/b2c/b2c.component';
import { B2cCarComponent } from './B2C/b2c/b2c-car/b2c-car.component';
import { B2cFlightComponent } from './B2C/b2c/b2c-flight/b2c-flight.component';
import { B2cHotelComponent } from './B2C/b2c/b2c-hotel/b2c-hotel.component';
import { AuthGuard } from '../../auth/auth.guard';
import { HotelVoucherComponent } from './B2C/b2c/b2c-hotel/components/hotel-voucher/hotel-voucher.component';
import { HotelInvoiceComponent } from './B2C/b2c/b2c-hotel/components/hotel-invoice/hotel-invoice.component';
import { B2cFlightVocherComponent } from './B2C/b2c/b2c-flight/components/b2c-flight-vocher/b2c-flight-vocher.component';
import { B2cCarVoucherComponent } from './B2C/b2c/b2c-car/components/b2c-car-voucher/b2c-car-voucher.component';
import { B2cCarInvoiceComponent } from './B2C/b2c/b2c-car/components/b2c-car-invoice/b2c-car-invoice.component';
import { B2cFlightInvoiceComponent } from './B2C/b2c/b2c-flight/components/b2c-flight-invoice/b2c-flight-invoice.component';
import { B2cCarCancelComponent } from './B2C/b2c/b2c-car/components/b2c-car-cancel/b2c-car-cancel.component';
import { FlightComponent, CarComponent, HotelComponent, B2bCarComponent } from './B2B/index'
import { B2bFlightInvoiceComponent } from './B2B/b2b/voucher/b2b-flight-invoice/b2b-flight-invoice.component';
import { B2bHotelInvoiceComponent } from './B2B/b2b/voucher/b2b-hotel-invoice/b2b-hotel-invoice.component';
import { UpdatePnrTicketComponent } from './components/update-pnr-ticket/update-pnr-ticket.component';
import { B2cTourVoucherComponent } from './B2C/b2c/b2c-tour-report/tour-voucher/b2c-tour-voucher.component';
import { TourInvoiceComponent } from './B2C/b2c/b2c-tour-report/tour-invoice/tour-invoice.component';
import { B2cTourEnquiryComponent } from './B2C/b2c/b2c-tour-enquiry/b2c-tour-enquiry.component';
import { B2cTourReportComponent } from './B2C/b2c/b2c-tour-report/b2c-tour-report.component';
import { TourDetailsComponent } from './B2C/b2c/b2c-tour-enquiry/tour-details/tour-details.component';
import { B2bTourInvoiceComponent } from './B2B/b2b/b2b-tour/b2b-tour-invoice/b2b-tour-invoice.component';
import { B2bTourVoucherComponent } from './B2B/b2b/b2b-tour/b2b-tour-voucher/b2b-tour-voucher.component';
import { B2bTourEnquiryComponent } from './B2B/b2b/b2b-tour-enquiry/b2b-tour-enquiry.component';
import { B2bTourComponent } from './B2B/b2b/b2b-tour/b2b-tour.component';
import { B2cActivityComponent } from './B2C/b2c/b2c-activity/b2c-activity.component';
import { ActivityVoucherComponent } from './B2C/b2c/b2c-activity/components/activity-voucher/activity-voucher.component';
import { ActivityInvoiceComponent } from './B2C/b2c/b2c-activity/components/activity-invoice/activity-invoice.component';
import { B2cTransferComponent } from './B2C/b2c/b2c-transfer/b2c-transfer.component';
import { B2bActivityComponent } from './B2B/b2b/b2b-activity/b2b-activity.component';
import { B2bTransferComponent } from './B2B/b2b/b2b-transfer/b2b-transfer.component';
import { B2cTransferVoucherComponent } from './B2C/b2c/b2c-transfer/components/b2c-transfer-voucher/b2c-transfer-voucher.component';
import { ActivityComponent } from './B2B/b2b/voucher/activity/activity.component';
import { B2bActivityInvoiceComponent } from './B2B/b2b/voucher/b2b-activity-invoice/b2b-activity-invoice.component';
import { B2CTransferInvoiceComponent } from './B2C/b2c/b2c-transfer/b2-ctransfer-invoice/b2-ctransfer-invoice.component';
import { B2bTransferInvoiceComponent } from './B2B/b2b/voucher/b2b-transfer-invoice/b2b-transfer-invoice.component';
import { B2cBundleBookingReportComponent } from './B2C/b2c/b2c-bundle-booking-report/b2c-bundle-booking-report.component';
import { B2bBundleBookingReportComponent } from './B2B/b2b/b2b-bundle-booking-report/b2b-bundle-booking-report.component';
import { B2cHotelEnquiryComponent } from './B2C/b2c/b2c-hotel-enquiry/b2c-hotel-enquiry.component';
import { B2bHotelEnquiryComponent } from './B2B/b2b/b2b-hotel-enquiry/b2b-hotel-enquiry.component';
import { B2cBusComponent } from './B2C/b2c/b2c-bus/b2c-bus.component';
import { GuideListComponent } from './B2C/guide-list/guide-list.component';
import { ReviewListComponent } from './B2C/review-list/review-list.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'b2b',
        canActivate: [AuthGuard],
        component: B2bComponent,
        data: {extraParameter: 'reportsMenus'}
      },
      {
        path: 'b2b-flight',
        canActivate: [AuthGuard],
        component: B2bFlightComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-hotel',
        canActivate: [AuthGuard],
        component: B2bHotelComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-activity',
        canActivate: [AuthGuard],
        component: B2bActivityComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-transfer',
        canActivate: [AuthGuard],
        component: B2bTransferComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-car',
        component: B2bCarComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2c',
        canActivate: [AuthGuard],
        component: B2cComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
         {
        path: 'guide-list',
        canActivate: [AuthGuard],
        component: GuideListComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
        {
        path: 'review-list',
        canActivate: [AuthGuard],
        component: ReviewListComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-car',
        component: B2cCarComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-flight',
        canActivate: [AuthGuard],
        component: B2cFlightComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-hotel',
        canActivate: [AuthGuard],
        component: B2cHotelComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
            {
        path: 'b2c-bus',
        canActivate: [AuthGuard],
        component: B2cBusComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-activity',
        canActivate: [AuthGuard],
        component: B2cActivityComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-transfer',
        canActivate: [AuthGuard],
        component: B2cTransferComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'transfer/voucher',
        // canActivate: [AuthGuard],
        component: B2cTransferVoucherComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-transfer/invoice',
        canActivate: [AuthGuard],
        component: B2CTransferInvoiceComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2b-transfer/invoice',
        canActivate: [AuthGuard],
        component: B2bTransferInvoiceComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-activity/voucher',
        canActivate: [AuthGuard],
        component: ActivityVoucherComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-activity/invoice',
        canActivate: [AuthGuard],
        component: ActivityInvoiceComponent,
        data: {extraParameter: 'b2c-reports-Menus'}
      },
      {
        path: 'b2c-hotel/voucher',
        component: HotelVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-hotel/invoice',
        component: HotelInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-flight/voucher',
        component: B2cFlightVocherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-car/voucher',
        component: B2cCarVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-car/invoice',
        component: B2cCarInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-car/cancel',
        component: B2cCarCancelComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-flight/invoice',
        component: B2cFlightInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b/voucher/flight',
        component: FlightComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b/voucher/hotel',
        component: HotelComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b/voucher/activity',
        component: ActivityComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b/voucher/invoice',
        component: B2bActivityInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b/voucher/car',
        component: CarComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b-flight/invoice',
        component: B2bFlightInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b-hotel/invoice',
        component: B2bHotelInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'flight/update-pnr',
        component: UpdatePnrTicketComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-tour/voucher',
        component: B2cTourVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-tour/invoice',
        component: TourInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2c-tour-enquiry',
        canActivate: [AuthGuard],
        component: B2cTourEnquiryComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2c-hotel-enquiry',
        canActivate: [AuthGuard],
        component: B2cHotelEnquiryComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-hotel-enquiry',
        canActivate: [AuthGuard],
        component: B2bHotelEnquiryComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2c-tour',
        canActivate: [AuthGuard],
        component: B2cTourReportComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2c-bundle-booking-report',
        canActivate: [AuthGuard],
        component: B2cBundleBookingReportComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-bundle-booking-report',
        canActivate: [AuthGuard],
        component: B2bBundleBookingReportComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2c-tour-enquiry/details',
        component: TourDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b-tour',
        canActivate: [AuthGuard],
        component: B2bTourComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-tour-enquiry',
        canActivate: [AuthGuard],
        component: B2bTourEnquiryComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'b2b-tour/voucher',
        component: B2bTourVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'b2b-tour/invoice',
        component: B2bTourInvoiceComponent,
        data: {extraParameter: ''}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
