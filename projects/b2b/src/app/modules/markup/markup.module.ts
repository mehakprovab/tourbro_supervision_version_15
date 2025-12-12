import { NgModule } from '@angular/core';
import { MarkupRoutingModule } from './markup-routing.module';
import {
    B2cComponent,
    B2cFlightComponent,
    B2cHotelComponent,
    AgentsComponent,
    AgentsFlightComponent,
    AgentsHotelComponent,
    ActivitesComponent,
    BusComponent,
    FlightComponent,
    HotelComponent,
    TransfersComponent,
} from './components';
import { ReportsModule } from '../reports/reports.module';
import { MarkupComponent } from './markup.component';
import { LayoutsModule } from '../../layout/layout.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { FlightMarkupListComponent } from './components/flight/components/flight-markup-list/flight-markup-list.component';
import { AgentMarkupB2bDetailsComponent } from './components/flight/components/agent-markup-b2b-details/agent-markup-b2b-details.component';
import { AgentMarkupB2bAddUpdateComponent } from './components/flight/components/agent-markup-b2b-add-update/agent-markup-b2b-add-update.component';
import { ActivityComponent } from './components/activity/activity.component';
import { TourComponent } from './components/tour/tour.component'; // <-- import the module


@NgModule({
    imports: [
        LayoutsModule,
        ReportsModule,
        MarkupRoutingModule,
        NgxPaginationModule
    ],
    declarations: [
        MarkupComponent,
        B2cComponent,
        B2cFlightComponent,
        B2cHotelComponent,
        AgentsComponent,
        AgentsFlightComponent,
        AgentsHotelComponent,
        ActivitesComponent,
        BusComponent,
        FlightComponent,
        HotelComponent,
        TransfersComponent,
        FlightMarkupListComponent,
        AgentMarkupB2bDetailsComponent,
        AgentMarkupB2bAddUpdateComponent,
        ActivityComponent,
        TourComponent,
    ]
})
export class MarkupModule { }
