import { NgModule } from '@angular/core';
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AgentsComponent } from './components/agents/agents.component';

@NgModule({
  declarations: [
    AgentsComponent
  ],
  imports: [
    SharedModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
