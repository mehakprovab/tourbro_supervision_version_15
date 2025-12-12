import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  BankAccountDetailsComponent
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'bank-account-details',
        component: BankAccountDetailsComponent,
        data: {extraParameter: ''}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoSubmenuRoutingModule { }
