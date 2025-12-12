import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { AgencyProfileComponent } from './components/agency-profile/agency-profile.component';
import { TravellerAgencyComponent } from './components/traveller-agency/traveller-agency.component';
import { LayoutsModule } from '../../layout/layout.module';
import { AddTravellerComponent } from './components/add-traveller/add-traveller.component';
import { TravellerInfoComponent } from './components/traveller-info/traveller-info.component';
import { CreateSubAgentComponent } from './components/create-sub-agent/create-sub-agent.component';
import { SubAgentListComponent } from './sub-agent-list/sub-agent-list.component';
import { AgencyUserDetailsComponent } from './components/agency-user-details/agency-user-details.component';
import { AgentsStaffComponent } from './agents-staff/agents-staff.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExportAsModule } from 'ngx-export-as';
import { SubAgentPrivilegesComponent } from './components/sub-agent-privileges/sub-agent-privileges.component';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  declarations: [AgencyProfileComponent, TravellerAgencyComponent, AddTravellerComponent, TravellerInfoComponent, CreateSubAgentComponent, SubAgentListComponent, AgencyUserDetailsComponent, AgentsStaffComponent, SubAgentPrivilegesComponent],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    LayoutsModule,
    BsDatepickerModule.forRoot(),
    ScrollingModule,
    ExportAsModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule
  ],
  exports: [
    AgencyProfileComponent, TravellerAgencyComponent, TravellerInfoComponent, CreateSubAgentComponent
  ],
  providers: [
    DatePipe
  ]
})
export class AdministratorModule { }
