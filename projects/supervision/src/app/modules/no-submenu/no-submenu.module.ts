import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from '../../shared/shared.module';
import { NoSubmenuRoutingModule } from './no-submenu-routing.module';
import {
    BankAccountDetailsComponent,
    ListComponent,
    AddComponent,
    SeoComponent,
    EditComponent,
    AgentCallbackSupportComponent,
    TransactionLogsComponent
} from './components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LogComponent } from './components/transaction-logs/log/log.component';
import { FlightComponent, HotelComponent, CarComponent } from './components';
import { AgentBalanceComponent } from './components/agent-balance/agent-balance.component';
import { ImportPnrComponent } from './components/import-pnr/import-pnr.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { ImportPnrDetailsComponent } from './components/import-pnr/import-pnr-details/import-pnr-details.component';


@NgModule({
    declarations: [
        BankAccountDetailsComponent,
        ListComponent,
        AddComponent,
        SeoComponent,
        EditComponent,
        AgentCallbackSupportComponent,
        TransactionLogsComponent,
        LogComponent,
        FlightComponent,
        HotelComponent,
        CarComponent,
        AgentBalanceComponent,
        ImportPnrComponent,
        CreditLimitComponent,
        ImportPnrDetailsComponent
    ],
    imports: [
        SharedModule,
        NoSubmenuRoutingModule,
        BsDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        Ng2SearchPipeModule,
        ReactiveFormsModule
    ]
})
export class NoSubmenuModule { }
