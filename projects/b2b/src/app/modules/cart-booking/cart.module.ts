import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { LayoutsModule } from '../../layout/layout.module';
import { CartBookingGuestDetailsComponent } from './cart-booking-guest-details/cart-booking-guest-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartBookingGuestDetailComponent } from './cart-booking-guest-detail/cart-booking-guest-detail.component';
import { CartBookingConfirmationComponent } from './cart-booking-confirmation/cart-booking-confirmation.component';
import { CartBookingVoucherComponent } from './cart-booking-voucher/cart-booking-voucher.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CartPaymentStatusComponent } from './cart-payment-status/cart-payment-status.component';
import { CartTransferFlightListComponent } from './cart-transfer-flight-list/cart-transfer-flight-list.component';
import { CartTransferPrefferedAirlineComponent } from './cart-transfer-preffered-airline/cart-transfer-preffered-airline.component';
import { CartBookingComponent } from './cart-booking.component';
import { CartRoutingModule } from './cart-routing.module';
// import { FlightComponent } from '../search';
// import { HotelComponent } from '../search';
// import { TransferSearchComponent } from '../../modules/search/transfer/transfer-search/transfer-search.component';
// import { ActivitySearchFormComponent } from '../../modules/search/activity/components/activity-search-form/activity-search-form.component';
// import { PopoverModule } from 'ngx-bootstrap/popover';
@NgModule({
  declarations: [
    // HotelComponent, 
    // ActivitySearchFormComponent,
    // FlightComponent,
    CartBookingGuestDetailsComponent, CartBookingComponent, CartBookingGuestDetailComponent, CartBookingConfirmationComponent, CartBookingVoucherComponent, CartPaymentStatusComponent, CartTransferFlightListComponent, CartTransferPrefferedAirlineComponent],
  imports: [
    LayoutsModule,
    CommonModule,
    SharedModule,
    CartRoutingModule,
    NgbModule,
    // HotelComponent,
    // FlightComponent,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    // PopoverModule.forRoot()
  ],
  providers: [DatePipe],
  entryComponents: [
    // HotelComponent,
    // FlightComponent,
    // ActivitySearchFormComponent,
    // TransferSearchComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  
})
export class CartModule { }
