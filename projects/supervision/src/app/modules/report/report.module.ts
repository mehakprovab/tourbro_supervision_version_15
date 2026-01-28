import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ExportAsModule } from 'ngx-export-as';
import { B2bComponent } from './B2B/b2b/b2b.component';
import { B2bFlightComponent } from './B2B/b2b/b2b-flight/b2b-flight.component';
import { B2bHotelComponent } from './B2B/b2b/b2b-hotel/b2b-hotel.component';
import { B2cComponent } from './B2C/b2c/b2c.component';
import { B2cCarComponent } from './B2C/b2c/b2c-car/b2c-car.component';
import { B2cFlightComponent } from './B2C/b2c/b2c-flight/b2c-flight.component';
import { B2cHotelComponent } from './B2C/b2c/b2c-hotel/b2c-hotel.component';
import { LayoutsModule } from '../../layout/layout.module';
import { ReportRoutingModule } from './report.routing.module';
import { HotelVoucherComponent } from './B2C/b2c/b2c-hotel/components/hotel-voucher/hotel-voucher.component';
import { HotelInvoiceComponent } from './B2C/b2c/b2c-hotel/components/hotel-invoice/hotel-invoice.component';
import { B2cFlightVocherComponent } from './B2C/b2c/b2c-flight/components/b2c-flight-vocher/b2c-flight-vocher.component';
import { B2cCarVoucherComponent } from './B2C/b2c/b2c-car/components/b2c-car-voucher/b2c-car-voucher.component';
import { B2cCarInvoiceComponent } from './B2C/b2c/b2c-car/components/b2c-car-invoice/b2c-car-invoice.component';
import { B2cFlightInvoiceComponent } from './B2C/b2c/b2c-flight/components/b2c-flight-invoice/b2c-flight-invoice.component';
import { B2cCarCancelComponent } from './B2C/b2c/b2c-car/components/b2c-car-cancel/b2c-car-cancel.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FlightComponent, CarComponent, HotelComponent } from './B2B/index';
import { B2bCarComponent } from './B2B/b2b/b2b-car/b2b-car.component';
import { B2bFlightInvoiceComponent } from './B2B/b2b/voucher/b2b-flight-invoice/b2b-flight-invoice.component';
import { B2bHotelInvoiceComponent } from './B2B/b2b/voucher/b2b-hotel-invoice/b2b-hotel-invoice.component'
import { UpdatePnrTicketComponent } from './components/update-pnr-ticket/update-pnr-ticket.component';
import { B2cTourReportComponent } from './B2C/b2c/b2c-tour-report/b2c-tour-report.component';
import { B2cTourVoucherComponent } from './B2C/b2c/b2c-tour-report/tour-voucher/b2c-tour-voucher.component';
import { TourInvoiceComponent } from './B2C/b2c/b2c-tour-report/tour-invoice/tour-invoice.component';
import { B2cTourEnquiryComponent } from './B2C/b2c/b2c-tour-enquiry/b2c-tour-enquiry.component';
import { TourDescriptionsComponent } from '../tour-crs/components/tour-list/add-tour-list/tour-descriptions/tour-descriptions.component';
import { TourDetailsComponent } from './B2C/b2c/b2c-tour-enquiry/tour-details/tour-details.component';
import { B2bTourComponent } from './B2B/b2b/b2b-tour/b2b-tour.component';
import { B2bTourEnquiryComponent } from './B2B/b2b/b2b-tour-enquiry/b2b-tour-enquiry.component';
import { B2bTourInvoiceComponent } from './B2B/b2b/b2b-tour/b2b-tour-invoice/b2b-tour-invoice.component';
import { B2bTourVoucherComponent } from './B2B/b2b/b2b-tour/b2b-tour-voucher/b2b-tour-voucher.component';
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
import { NumberToWordsPipe } from '../../shared/pipes/number-to-words.pipe';
import { B2cBundleBookingReportComponent } from './B2C/b2c/b2c-bundle-booking-report/b2c-bundle-booking-report.component';
import { B2bBundleBookingReportComponent } from './B2B/b2b/b2b-bundle-booking-report/b2b-bundle-booking-report.component';
import { B2cHotelEnquiryComponent } from './B2C/b2c/b2c-hotel-enquiry/b2c-hotel-enquiry.component';
import { B2bHotelEnquiryComponent } from './B2B/b2b/b2b-hotel-enquiry/b2b-hotel-enquiry.component';
import { B2cBusComponent } from './B2C/b2c/b2c-bus/b2c-bus.component';
import { BusVoucherComponent } from './B2C/b2c/b2c-bus/component/bus-voucher/bus-voucher.component';
import { BusInvoiceComponent } from './B2C/b2c/b2c-bus/component/bus-invoice/bus-invoice.component';


@NgModule({
    declarations: [
        B2bComponent,
        B2bFlightComponent,
        B2bHotelComponent,
        B2cComponent,
        B2cCarComponent,
        B2cFlightComponent,
        B2cHotelComponent,
        HotelVoucherComponent,
        HotelInvoiceComponent,
        B2cFlightVocherComponent,
        B2cCarVoucherComponent,
        B2cCarInvoiceComponent,
        B2cFlightInvoiceComponent,
        B2cCarCancelComponent,
        FlightComponent,
        CarComponent,
        HotelComponent,
        B2bCarComponent,
        B2bFlightInvoiceComponent,
        B2bHotelInvoiceComponent,
        UpdatePnrTicketComponent,
        B2cTourReportComponent,
        B2cTourVoucherComponent,
        TourInvoiceComponent,
        B2cTourEnquiryComponent,
        TourDetailsComponent,
        B2bTourComponent,
        B2bTourEnquiryComponent,
        B2bTourInvoiceComponent,
        B2bTourVoucherComponent,
        B2cActivityComponent,
        ActivityVoucherComponent,
        ActivityInvoiceComponent,
        B2cTransferComponent,
        B2bActivityComponent,
        B2bTransferComponent,
        B2cTransferVoucherComponent,
        B2CTransferInvoiceComponent,
        B2bTransferInvoiceComponent,
        ActivityComponent,
        B2bActivityInvoiceComponent,
        NumberToWordsPipe,
        B2cBundleBookingReportComponent,
        B2bBundleBookingReportComponent,
        B2cHotelEnquiryComponent,
        B2bHotelEnquiryComponent,
        B2cBusComponent,
        BusVoucherComponent,
        BusInvoiceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgbModule,
        ExportAsModule,
        LayoutsModule,
        ReportRoutingModule,
        Ng2SearchPipeModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    exports: [NumberToWordsPipe],
})
export class ReportModule { }
