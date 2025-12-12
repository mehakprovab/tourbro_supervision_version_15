import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { MasterBalanceComponent } from '../master-balance/master-balance.component';
import { AgentRequestComponent } from './agent-request/agent-request.component';
import { CreditLimitRequestComponent } from './credit-limit-request/credit-limit-request.component';
import { AllAgentSpecificComponent } from './ledger/all-agent-specific/all-agent-specific.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'agentRequest',
        canActivate: [AuthGuard],
        component: AgentRequestComponent,
        data: {extraParameter: 'master-balance-Menus'}
      },
      {
        path: 'credtLimitRequest',
        canActivate: [AuthGuard],
        component: CreditLimitRequestComponent,
        data: {extraParameter: 'master-balance-Menus'}
      },
      {
        path: 'allAgentSpecific',
        canActivate: [AuthGuard],
        component: AllAgentSpecificComponent,
        data: {extraParameter: 'master-balance-Menus'}
      },
      {
        path: 'ledger',
        component: MasterBalanceComponent,
        data: {extraParameter: 'master-balance-Menus'}
      }
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterBalanceRoutingModule { }
