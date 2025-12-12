import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import {
  FlightComponent,
  HotelComponent
} from './components';


const routes: Routes = [
  {
    path: '',
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
