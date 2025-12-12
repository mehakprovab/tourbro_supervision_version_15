import { NgModule } from '@angular/core';

import { MasterBalanceManagerRoutingModule } from './master-balance-manager-routing.module';
import { AgentsComponent } from './components/agents/agents.component';
import { SharedModule } from '../../shared/shared.module';
import { BalanceRequestComponent } from './components/agents/balance-request/balance-request.component';
import { CreditLimitRequestComponent } from './components/agents/credit-limit-request/credit-limit-request.component';
import { ProcessTransactionComponent } from './components/modals/process-transaction/process-transaction.component';
import { ProcessTransactionBalanceComponent } from './components/modals/process-transaction-balance/process-transaction-balance.component';


@NgModule({
  declarations: [
      AgentsComponent,
      BalanceRequestComponent,
      CreditLimitRequestComponent,
      ProcessTransactionComponent,
      ProcessTransactionBalanceComponent
    ],
  imports: [
    SharedModule,
    MasterBalanceManagerRoutingModule
  ],
  entryComponents: [ProcessTransactionComponent, ProcessTransactionBalanceComponent]
})
export class MasterBalanceManagerModule { }
