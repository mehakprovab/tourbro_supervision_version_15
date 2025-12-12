import { NgModule } from '@angular/core';
import { BalanceAlertRoutingModule } from './balance-alert-routing.module';
import { BalanceAlertComponent } from './balance-alert/balance-alert.component';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
  declarations: [BalanceAlertComponent],
  imports: [
    LayoutsModule,
    BalanceAlertRoutingModule
  ],
  exports: [BalanceAlertComponent]
})
export class BalanceAlertModule { }
