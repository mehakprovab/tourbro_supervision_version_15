import { NgModule } from '@angular/core';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AgentsComponent } from './components';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
  declarations: [AgentsComponent],
  imports: [
    LayoutsModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
