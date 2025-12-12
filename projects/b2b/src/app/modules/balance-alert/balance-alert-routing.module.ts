import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceAlertComponent } from './balance-alert/balance-alert.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: BalanceAlertComponent,
        data: { extraParameter: 'bankAccountDetailsMenus' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceAlertRoutingModule { }
