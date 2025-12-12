import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { TravellerAgencyComponent } from './components/traveller-agency/traveller-agency.component';
import { AddTravellerComponent } from './components/add-traveller/add-traveller.component';
import { TravellerInfoComponent } from './components/traveller-info/traveller-info.component';
import { CreateSubAgentComponent } from './components/create-sub-agent/create-sub-agent.component';
import { SubAgentListComponent } from './sub-agent-list/sub-agent-list.component';
import { AgencyUserDetailsComponent } from './components/agency-user-details/agency-user-details.component';
import { AgentsStaffComponent } from './agents-staff/agents-staff.component';
import { SubAgentPrivilegesComponent } from './components/sub-agent-privileges/sub-agent-privileges.component';
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
        {
            path: 'subAgentList',
            component: SubAgentListComponent,
            data: {extraParameter: 'administratorMenus'}
        },
        {
            path: 'agents-staff',
            component: AgentsStaffComponent,
            data: {extraParameter: 'administratorMenus'}
        },
        {
            path: 'travelleragency',
            component:TravellerAgencyComponent ,
            data: {extraParameter: 'administratorMenus'}
        },
        {
          path: 'addtraveller',
          component:AddTravellerComponent ,
      },
      {
        path: 'travellerinfo',
        component:TravellerInfoComponent ,
    },
    {
      path: 'createSubAgent',
      component: CreateSubAgentComponent
    },
    {
      path: 'agencyUserDetails',
      component:AgencyUserDetailsComponent
    },
    {
        path: 'subAgentPrivileges',
        component:SubAgentPrivilegesComponent
      }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
