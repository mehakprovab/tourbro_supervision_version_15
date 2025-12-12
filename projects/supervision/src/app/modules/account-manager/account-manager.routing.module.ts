import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { CreditBalanceComponent } from './credit-balance/credit-balance.component';
import { DebitBalanceComponent } from './debit-balance/debit-balance.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'creditBalance',
        canActivate: [AuthGuard],
        component: CreditBalanceComponent,
        data: {extraParameter: 'accountManagerMenus'}
      },
      {
        path: 'debitBalance',
        canActivate: [AuthGuard],
        component: DebitBalanceComponent,
        data: {extraParameter: 'accountManagerMenus'}
      }
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagerRoutingModule { }
