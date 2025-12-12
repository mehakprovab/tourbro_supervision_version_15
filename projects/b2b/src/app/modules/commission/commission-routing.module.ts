import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ActivitesComponent, FlightComponent, BusComponent, TransfersComponent,
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { CommissionComponent } from './commission.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: CommissionComponent,
        data: { extraParameter: 'commissionMenus' }
      },
      {
        path: 'flight',
        component: FlightComponent,
        data: { extraParameter: 'commissionMenus' }
      },
      {
        path: 'bus',
        component: BusComponent,
        data: { extraParameter: 'commissionMenus' }
      },
      {
        path: 'transfers',
        component: TransfersComponent,
        data: { extraParameter: 'commissionMenus' }
      },
      {
        path: 'activities',
        component: ActivitesComponent,
        data: { extraParameter: 'commissionMenus' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class CommissionRoutingModule { }
