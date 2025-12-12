import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import {
    BankAccountDetailsComponent,
    UpdateBalanceComponent,
    UpdateCreditLimitComponent,
    NewBalanceRequestComponent,
    SentBalanceRequestComponent,
    CashComponent,
    ChequeDdComponent,
    ETransferComponent,
    NewCreditLimitComponent,
    SentCreditLimitComponent,
    CreditNoteComponent,
} from './components';
import { LayoutsModule } from '../../layout/layout.module';
import {
    MakePaymentComponent,
    SetBalanceAlertComponent,
    AdminBankccountComponent,
    CommissionTableComponent,
    PaymentHistoryComponent,
    InvoiceManagementComponent,
    TransactionLogsComponent,
    AccountLedgerComponent,
    AccountDetailsComponent,
    PercentageCommissionComponent,
    BkashComponent,
    NagadComponent,
    CancelRefundViewNoteComponent,
} from './components';
import { DepositRequestComponent, HistoryDepositRequestComponent } from './components/make-payment';

import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { SearchAccountSystemComponent } from './components/search-account-system/search-account-system.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
    declarations: [
        BankAccountDetailsComponent,
        UpdateBalanceComponent,
        UpdateCreditLimitComponent,
        NewBalanceRequestComponent,
        SentBalanceRequestComponent,
        CashComponent,
        ChequeDdComponent,
        ETransferComponent,
        NewCreditLimitComponent,
        SentCreditLimitComponent,
        AdminBankccountComponent,
        CommissionTableComponent,
        CreditNoteComponent,
        InvoiceManagementComponent,
        MakePaymentComponent,
        PaymentHistoryComponent,
        SetBalanceAlertComponent,
        AccountLedgerComponent,
        TransactionLogsComponent,
        DepositRequestComponent,
        HistoryDepositRequestComponent,
        AccountDetailsComponent,
        PercentageCommissionComponent,
        BkashComponent,
        NagadComponent,
        SearchAccountSystemComponent,
        CancelRefundViewNoteComponent
    ],
    imports: [
        LayoutsModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        PaymentRoutingModule,
        NgxPaginationModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [
        BankAccountDetailsComponent,
        UpdateBalanceComponent,
        UpdateCreditLimitComponent,
        NewBalanceRequestComponent,
        SentBalanceRequestComponent,
        CashComponent,
        ChequeDdComponent,
        ETransferComponent,
        NewCreditLimitComponent,
        SentCreditLimitComponent,
        DepositRequestComponent,
        HistoryDepositRequestComponent,
        BkashComponent,
        NagadComponent
    ],
})

export class PaymentModule { }
