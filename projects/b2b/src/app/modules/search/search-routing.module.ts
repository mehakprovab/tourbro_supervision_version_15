import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { BookingComponent } from './flight/booking/booking.component';
import { RoundTripComponent } from './flight/result/round-trip/round-trip.component';
import { 
    FlightComponent,
    ResultComponent,
    ConfirmPassengerComponent,
    BookingConfirmComponent,
    HotelComponent,
    HotelResultComponent,
    HotelBookingComponent,
    HotelGuestDetailsComponent,
    HotelConfirmationComponent,
    HotelPaymentDetailComponent,
    HotelVoucherComponent,
    HotelProceedPaymentComponent
 } from './index';
import { ActivitySearchFormComponent } from './activity/components/activity-search-form/activity-search-form.component';
import { ActivityResultComponent } from './activity/components/result/activity-result.component';
import { ActivityDetailsComponent } from './activity/components/result/activity-details/activity-details.component';
import { ActivityBookingComponent } from './activity/components/activity-booking/activity-booking.component';
import { ActivityVoucherComponent } from './activity/components/voucher/activity-voucher.component';
import { ActivityConfirmComponent } from './activity/components/activity-confirm/activity-confirm.component';
import { TourSearchFormComponent } from './tour/components/tour-search-form/tour-search-form.component';
import { TourResultComponent } from './tour/components/result/tour-result/tour-result.component';
import { B2bTourDetailsComponent } from './tour';
import { TourFinalBookingComponent } from './tour/components/tour-booking/tour-final-booking/tour-final-booking.component';
import { TourConfirmComponent } from './tour/components/tour-booking/tour-confirm/tour-confirm.component';
import { TourVoucherComponent } from './tour/components/tour-booking/tour-voucher/tour-voucher.component';
import { TransferResultComponent } from './transfer/transfer-result/transfer-result.component';
import { TransferDetailsComponent } from './transfer/transfer-details/transfer-details.component';
import { TransfersBookingComponent } from './transfer/transfers-booking/transfers-booking.component';
import { TransfersConfirmComponent } from './transfer/transfers-confirm/transfers-confirm.component';
import { VoucherComponent } from './transfer/voucher/voucher.component';
import { HotelPaymentStatusComponent } from './hotel/components/hotel-booking/components/hotel-payment-status/hotel-payment-status.component';
import { ActivityPaymentStatusComponent } from './activity/components/activity-payment-status/activity-payment-status.component';
import { TransfersPaymentStatusComponent } from './transfer/transfers-confirm/transfers-payment-status/transfers-payment-status.component';


const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'flight',
                component: FlightComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/result',
                component: ResultComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/round-trip',
                component: RoundTripComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/booking',
                component: BookingComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/confirm-passenger',
                component: ConfirmPassengerComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/booking-confirm',
                component: BookingConfirmComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel',
                component: HotelComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/result',
                component: HotelResultComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/booking',
                component: HotelBookingComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/guests',
                component: HotelGuestDetailsComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/payment',
                component: HotelPaymentDetailComponent,
            },
            {
                path: 'hotel/proceed-payment',
                component: HotelProceedPaymentComponent,
            },
            {
                path: 'hotel/confirmation',
                component: HotelConfirmationComponent,
            },
            {
                path: 'hotel/payment-status',
                component: HotelPaymentStatusComponent,
            },
            {
                path: 'hotel/voucher',
                component: HotelVoucherComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'activity',
                component: ActivitySearchFormComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'activity/activity-results',
                component: ActivityResultComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'activity/activity-details',
                component: ActivityDetailsComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'activity/activity-booking',
                component: ActivityBookingComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'activity/activity-voucher',
                component: ActivityVoucherComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'activity/activity-confirm',
                component: ActivityConfirmComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'activity/payment-status',
                component: ActivityPaymentStatusComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour',
                component: TourSearchFormComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour/tour-results',
                component: TourResultComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour/tour-details',
                component: B2bTourDetailsComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour/tour-final-booking',
                component: TourFinalBookingComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour/tour-confirm',
                component: TourConfirmComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'tour/tour-voucher',
                component: TourVoucherComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/transfers-result',
                component: TransferResultComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/transfers-details',
                component: TransferDetailsComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/transfers-bookings',
                component: TransfersBookingComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/transfers-confirm',
                component: TransfersConfirmComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/payment-status',
                component: TransfersPaymentStatusComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'transfer/transfers-voucher',
                component: VoucherComponent,
                data: { extraParameters: '' }
            },

           

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
