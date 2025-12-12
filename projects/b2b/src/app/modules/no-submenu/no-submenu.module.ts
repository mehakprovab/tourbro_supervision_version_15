import { NgModule } from '@angular/core';
import { NoSubmenuRoutingModule } from './no-submenu-routing.module';
import {
    BankAccountDetailsComponent,
    ListComponent,
    AddComponent
} from './components';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
  declarations: [
    BankAccountDetailsComponent,
    ListComponent,
    AddComponent
  ],
  imports: [
    LayoutsModule,
    NoSubmenuRoutingModule
  ]
})
export class NoSubmenuModule { }
