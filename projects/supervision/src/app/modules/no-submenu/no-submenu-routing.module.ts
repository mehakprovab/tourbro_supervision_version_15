import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountDetailsComponent } from './components/bank-account-details/bank-account-details.component';
import { SeoComponent } from './components/seo/seo.component';
import { EditComponent } from './components/seo/edit/edit.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AgentCallbackSupportComponent, TransactionLogsComponent, LogComponent, AgentBalanceComponent  } from './components';
import { FlightComponent, HotelComponent, CarComponent} from  './components';
import { AuthGuard } from '../../auth/auth.guard';
import { ImportPnrComponent } from './components/import-pnr/import-pnr.component';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { ImportPnrDetailsComponent } from './components/import-pnr/import-pnr-details/import-pnr-details.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'bank-account-details',
        component: BankAccountDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'seo',
        component: SeoComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'seo-edit',
        component: EditComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'agentCallBackSupport',
        canActivate: [AuthGuard],
        component: AgentCallbackSupportComponent,
        data: {extraParameter: 'agent-CallBack-Support'}
      },
      {
        path: 'agent-balance',
        canActivate: [AuthGuard],
        component: AgentBalanceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'import-pnr',
        canActivate: [AuthGuard],
        component: ImportPnrComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'import-pnr-details',
        canActivate: [AuthGuard],
        component: ImportPnrDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs',
        canActivate: [AuthGuard],
        component: TransactionLogsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/log',
        component: LogComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/flight',
        component: FlightComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/hotel',
        component: HotelComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/car',
        component: CarComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'update-credit',
        component: CreditLimitComponent,
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
