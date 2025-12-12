import { NgModule } from '@angular/core';
import { QueuesRoutingModule } from './queues-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FlightCancellationComponent } from './components/flight-cancellation/flight-cancellation.component';

@NgModule({
  imports: [
    SharedModule,
    QueuesRoutingModule
  ],
  declarations: [FlightCancellationComponent]
})
export class QueuesModule { }
