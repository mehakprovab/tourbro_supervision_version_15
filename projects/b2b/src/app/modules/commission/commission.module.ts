import { NgModule } from '@angular/core';
import { CommissionRoutingModule } from './commission-routing.module';
import {
    AgentsComponent,
    DefaultComponent,
    FlightComponent,
    TransfersComponent,
    BusComponent,
    ActivitesComponent,
    HotelComponent,
} from './components';
import { CommissionComponent } from './commission.component';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
    declarations: [
        CommissionComponent,
        AgentsComponent,
        DefaultComponent,
        FlightComponent,
        TransfersComponent,
        BusComponent,
        ActivitesComponent,
        HotelComponent
    ],
    imports: [
        CommissionRoutingModule,
        LayoutsModule
    ]
})
export class CommissionModule { }
