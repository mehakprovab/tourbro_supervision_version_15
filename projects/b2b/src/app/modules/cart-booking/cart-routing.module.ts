import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { CartBookingComponent } from './cart-booking.component';
import { CartBookingGuestDetailsComponent } from './cart-booking-guest-details/cart-booking-guest-details.component';
import { CartBookingGuestDetailComponent } from './cart-booking-guest-detail/cart-booking-guest-detail.component';
import { CartBookingConfirmationComponent } from './cart-booking-confirmation/cart-booking-confirmation.component';
import { CartPaymentStatusComponent } from './cart-payment-status/cart-payment-status.component';
import { CartBookingVoucherComponent } from './cart-booking-voucher/cart-booking-voucher.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path:'bookings',
        component: CartBookingComponent, 
        data: { extraParameter: '' }
      },
      {
        path:'guest-detail',
        component: CartBookingGuestDetailsComponent, 
        data: { extraParameter: '' }
      },
      {
        path:'guest-details',
        component: CartBookingGuestDetailComponent, 
        data: { extraParameter: '' }
      },
      {
        path:'cart/booking-confirmation',
        component: CartBookingConfirmationComponent, 
        data: { extraParameter: '' }
      },
      {
        path:'payment-status',
        component: CartPaymentStatusComponent, 
        data: { extraParameter: '' }
      },
      {
        path:'voucher',
        component: CartBookingVoucherComponent, 
        data: { extraParameter: '' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
