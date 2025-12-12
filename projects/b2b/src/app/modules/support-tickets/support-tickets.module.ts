import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportTicketsRoutingModule } from './support-tickets-routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { HistoryComponent,NewTicketComponent } from './components';
import { AgentCallbackComponent } from './components/new-ticket/components/agent-callback/agent-callback.component';
import { SentCallbackComponent } from './components/new-ticket/components/sent-callback/sent-callback.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [ NewTicketComponent, HistoryComponent, AgentCallbackComponent, SentCallbackComponent],
  imports: [
    CommonModule,
    SupportTicketsRoutingModule,
    LayoutsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class SupportTicketsModule { }
