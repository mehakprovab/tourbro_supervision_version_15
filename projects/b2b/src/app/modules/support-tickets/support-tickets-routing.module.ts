import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AgentCallbackComponent } from './components/new-ticket/components/agent-callback/agent-callback.component';
import { SentCallbackComponent } from './components/new-ticket/components/sent-callback/sent-callback.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
          {
            path: 'new-ticket',
            component: AgentCallbackComponent,
            data: {extraParameter: 'supportTickets'}
          },
          {
            path: 'history',
            component: SentCallbackComponent,
            data: {extraParameter: 'supportTickets'}
          },
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportTicketsRoutingModule { }
