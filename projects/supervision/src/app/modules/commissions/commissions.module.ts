import { NgModule } from '@angular/core';
import { CommissionsComponent } from '../commissions/commissions.component';
import { DefaultCommissionsComponent } from './default-commissions/default-commissions.component';
import { AgentCommissionsComponent } from './agent-commissions/agent-commissions.component';
import { LayoutsModule } from '../../layout/layout.module';
import { CommissionsSupervisionRoutingModule } from './commissions.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AgentCommissionListComponent } from './agent-commissions/agent-commission-list/agent-commission-list.component';
import { UpdateDefaultCommissionComponent } from './agent-commissions/update-default-commission/update-default-commission.component';
import { AgentCommissionDetailComponent } from './agent-commissions/agent-commission-detail/agent-commission-detail.component';
import { GdsCommissionsComponent } from './gds-commissions/gds-commissions.component';
import { GdsCommissionListComponent } from './gds-commissions/gds-commission-list/gds-commission-list.component';
import { AddUpdateCommissionComponent } from './gds-commissions/add-update-commission/add-update-commission.component';

@NgModule({
    declarations: [
        CommissionsComponent,
        DefaultCommissionsComponent,
        AgentCommissionsComponent,
        AgentCommissionDetailComponent,
        AgentCommissionListComponent,
        UpdateDefaultCommissionComponent,
        GdsCommissionsComponent,
        GdsCommissionListComponent,
        AddUpdateCommissionComponent
    ],
    imports: [
        SharedModule,
        LayoutsModule,
        CommissionsSupervisionRoutingModule,
    ]
})
export class CommissionsModule { }
