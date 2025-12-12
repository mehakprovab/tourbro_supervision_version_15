import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { B2bEmailVoucherComponent } from './b2b-email-voucher/b2b-email-voucher.component';
import {
  AdminBankccountComponent,
  CommissionTableComponent,
  CreditNoteComponent,
  InvoiceManagementComponent,
  MakePaymentComponent,
  PaymentHistoryComponent,
  SetBalanceAlertComponent,
  AccountLedgerComponent,
  TransactionLogsComponent,
  RechargeComponent,
  UpdateCreditLimitComponent
} from './components';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      // rajesh edited
      {
        path: 'make-payment',
        component: MakePaymentComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'set-balance-alert',
        component: SetBalanceAlertComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'update-credit-limit',
        component: UpdateCreditLimitComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'admin-bankccount',
        component: AdminBankccountComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'commission-table',
        component: CommissionTableComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'payment-history',
        component: PaymentHistoryComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'invoice-management',
        component: InvoiceManagementComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'invoice-management/invoice',
        component: B2bEmailVoucherComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'transaction-logs',
        component: TransactionLogsComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'recharge',
        component: RechargeComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'account-ledger',
        component: AccountLedgerComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'credit-note',
        component: CreditNoteComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'payment-failed',
        component: PaymentFailedComponent,
        data: { extraParameter: 'paymentMenus' }
      },
      {
        path: 'payment-success',
        component: PaymentSuccessComponent,
        data: { extraParameter: 'paymentMenus' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
