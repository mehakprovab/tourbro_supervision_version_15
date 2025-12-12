import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupBookingComponent } from '../group-booking/group-booking.component';
import { GroupFlightComponent } from './components/group-flight/group-flight.component';
import { GroupHotelComponent } from './components/group-hotel/group-hotel.component';
import { GroupBookingRoutingModule } from './group-booking.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { GroupCarComponent } from './components/group-car/group-car.component';

@NgModule({
  declarations: [GroupBookingComponent, GroupFlightComponent, GroupHotelComponent,GroupCarComponent],
  imports: [
    CommonModule,
    GroupBookingRoutingModule,LayoutsModule,SharedModule
  ]
})
export class GroupBookingModule { }
