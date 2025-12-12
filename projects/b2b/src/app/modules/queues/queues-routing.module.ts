import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { FlightCancellationComponent,FlightScheduleChangesComponent,FlightBookingQueueComponent } from './components';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    data: {extraParameter: 'queuesMenus'},
    children: [
      {
        path: 'flight-cancellation',
        component: FlightCancellationComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'flight-schedule-changes',
        component: FlightScheduleChangesComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'flight-booking-queue',
        component: FlightBookingQueueComponent,
        data: {extraParameter: 'queuesMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueuesRoutingModule { }
