import { NgModule } from '@angular/core';
import { CreditBalanceComponent } from './credit-balance/credit-balance.component';
import { DebitBalanceComponent } from './debit-balance/debit-balance.component';
import { AccountManagerComponent } from './account-manager.component';
import { AccountManagerRoutingModule } from './account-manager.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AccountManagerComponent, CreditBalanceComponent, DebitBalanceComponent],
  imports: [
    SharedModule,
    LayoutsModule,
    AccountManagerRoutingModule,
  ]
})
export class AccountManagerModule { }
