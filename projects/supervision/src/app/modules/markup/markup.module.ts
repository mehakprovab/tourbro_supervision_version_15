import { NgModule } from '@angular/core';
import { MarkupRoutingModule } from './markup-routing.module';
import { SharedModule } from '../../shared/shared.module';
import {
    B2cComponent,
    B2cFlightComponent,
    B2cHotelComponent,
    AgentsComponent,
    AgentsFlightComponent,
    AgentsHotelComponent,
    B2cCarComponent,
    AgentCarComponent,
    AgentActivityComponent,
    B2cHeliComponent,
} from './components';
import { AgentMarkUpListComponent } from './components/agents-flight/agent-mark-up-list/agent-mark-up-list.component';
import { AgentMarkupDetailComponent } from './components/agents-flight/agent-markup-detail/agent-markup-detail.component';
import { AgentMarkupAddUpdateComponent } from './components/agents-flight/agent-markup-add-update/agent-markup-add-update.component';
import { AgentB2cMarkupDetailComponent } from './components/b2c-flight/agent-b2c-markup-detail/agent-b2c-markup-detail.component';
import { AgentB2cMarkupAddUpdateComponent } from './components/b2c-flight/agent-b2c-markup-add-update/agent-b2c-markup-add-update.component';
import { B2cActivityComponent } from './components/b2c-activity/b2c-activity.component';
import { B2cTransferComponent } from './components/b2c-transfer/b2c-transfer.component';
import { AgentTransferComponent } from './components/agent-transfer/agent-transfer.component';
import { SupplierMarkupUpdateComponent } from './components/b2c-flight/supplier-markup-update/supplier-markup-update.component';
import { SupplirMarkupListComponent } from './components/b2c-flight/supplir-markup-list/supplir-markup-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { B2cTourComponent } from './components/b2c-tour/b2c-tour.component';
import { AgentTourComponent } from './components/agent-tour/agent-tour.component';
import { B2cWellnessComponent } from './components/b2c-wellness/b2c-wellness.component';



@NgModule({
    imports: [
        SharedModule,
        MarkupRoutingModule,
        NgMultiSelectDropDownModule
    ],
    declarations: [
        B2cComponent,
        B2cFlightComponent,
        B2cHotelComponent,
        AgentsComponent,
        AgentsFlightComponent,
        AgentsHotelComponent,
        B2cCarComponent,
        AgentCarComponent,
        AgentActivityComponent,
        AgentMarkUpListComponent,
        AgentMarkupDetailComponent,
        AgentMarkupAddUpdateComponent,
        AgentB2cMarkupDetailComponent,
        AgentB2cMarkupAddUpdateComponent,
        B2cActivityComponent,
        B2cTransferComponent,
        AgentTransferComponent,
        SupplierMarkupUpdateComponent,
        SupplirMarkupListComponent,
        B2cTourComponent,
        AgentTourComponent,
        B2cWellnessComponent,
        B2cHeliComponent,
    ]
})
export class MarkupModule { }
