import { NgModule } from '@angular/core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
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
  RechargeComponent,
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
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchAccountSystemComponent } from './components/search-account-system/search-account-system.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ExportAsModule } from 'ngx-export-as';
import { PaymentChequeDdComponent } from './components/make-payment/components/payment-cheque-dd/payment-cheque-dd.component';
import {
  InvoiceHotelComponent,
  InvoiceFlightComponent,
  InvoiceCarComponent
} from './components/invoice-management';
import { BkashDepositComponent } from './components/make-payment/components/bkash-deposit/bkash-deposit.component';
import { NagadDepositComponent } from './components/make-payment/components/nagad-deposit/nagad-deposit.component';
import { B2bEmailVoucherComponent } from './b2b-email-voucher/b2b-email-voucher.component';
import { ImageViewComponent } from './components/make-payment/components/image-view/image-view.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { SplitPipePipe } from './components/split-pipe.pipe';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';



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
    RechargeComponent,
    DepositRequestComponent,
    HistoryDepositRequestComponent,
    AccountDetailsComponent,
    PercentageCommissionComponent,
    BkashComponent,
    NagadComponent,
    SearchAccountSystemComponent,
    CancelRefundViewNoteComponent,
    PaymentChequeDdComponent,
    InvoiceHotelComponent,
    InvoiceFlightComponent,
    InvoiceCarComponent,
    BkashDepositComponent,
    NagadDepositComponent,
    B2bEmailVoucherComponent,
    ImageViewComponent,
    PaymentFailedComponent,
    PaymentSuccessComponent,
    SplitPipePipe
  ],
  imports: [
    LayoutsModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ExportAsModule,
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
  entryComponents: [ImageViewComponent]
})

export class PaymentModule { }
