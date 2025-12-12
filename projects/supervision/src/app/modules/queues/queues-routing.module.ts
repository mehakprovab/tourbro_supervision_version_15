import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { FlightCancellationComponent } from './components/flight-cancellation/flight-cancellation.component';


const routes: Routes = [
  {
    path: 'queues',
    component: BaseLayoutComponent,
    data: {extraParameter: 'queuesMenus'},
    children: [
      {
        path: 'flight-cancellation',
        component: FlightCancellationComponent,
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
