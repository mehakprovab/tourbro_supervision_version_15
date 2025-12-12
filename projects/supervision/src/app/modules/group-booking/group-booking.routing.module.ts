import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { GroupFlightComponent } from './components/group-flight/group-flight.component';
import { GroupHotelComponent } from './components/group-hotel/group-hotel.component';
import { GroupCarComponent } from './components/group-car/group-car.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'flight',
        canActivate: [AuthGuard],
        component: GroupFlightComponent,
        data: {extraParameter: 'groupMenus'}
      },
      {
        path: 'hotel',
        canActivate: [AuthGuard],
        component: GroupHotelComponent,
        data: {extraParameter: 'groupMenus'}
      },
      {
        path: 'car',
        component: GroupCarComponent,
        data: {extraParameter: 'groupMenus'}
      }

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupBookingRoutingModule { }
