import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { FlightComponent } from './components/flight/flight.component';
import { HotelComponent } from './components/hotel/hotel.component';


const routes: Routes = [
  {
    path: 'offline',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'flight',
        component: FlightComponent,
        data: { extraParameter: 'offlineMenus'}
      },
      {
        path: 'hotel',
        component: HotelComponent,
        data: { extraParameter: 'offlineMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineRoutingModule { }
