import { NgModule } from '@angular/core';
import { BankAccountDetailsComponent } from '../bank-account-details/bank-account-details.component';
import { BankAccountRoutingModule } from './bank-account-details.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { AddUpdateBankaccountComponent, AccountDetailsComponent } from './index';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        BankAccountDetailsComponent,
        AddUpdateBankaccountComponent,
        AccountDetailsComponent
    ],
    imports: [
        LayoutsModule,
        SharedModule,
        BankAccountRoutingModule,
    ]
})
export class BankAccountDetailsModule { }
