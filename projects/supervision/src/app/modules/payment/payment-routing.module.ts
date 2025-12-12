import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
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
    UpdateCreditLimitComponent
} from './components';

const routes: Routes = [
    {
        path: 'payment',
        component: BaseLayoutComponent,
        children: [
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
                path: 'transaction-logs',
                component: TransactionLogsComponent,
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
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentRoutingModule { }
