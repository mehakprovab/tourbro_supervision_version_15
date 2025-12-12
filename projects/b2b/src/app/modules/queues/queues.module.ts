import { NgModule } from '@angular/core';
import { QueuesRoutingModule } from './queues-routing.module';
import {
    FlightCancellationComponent
} from './components';
import { LayoutsModule } from '../../layout/layout.module';
import { FlightScheduleChangesComponent } from './components/flight-schedule-changes/flight-schedule-changes.component';
import { FlightBookingQueueComponent } from './components/flight-booking-queue/flight-booking-queue.component';
import { SearchQueueComponent } from './components/search-queue/search-queue.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        LayoutsModule,
        QueuesRoutingModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        FlightCancellationComponent,
        FlightScheduleChangesComponent,
        FlightBookingQueueComponent,
        SearchQueueComponent
    ]
})
export class QueuesModule { }
