import { NgModule } from '@angular/core';
import { MasterBalanceManagerRoutingModule } from './master-balance-manager-routing.module';
import {
    AgentsComponent,
    CreditLimitRequestComponent,
    BalanceRequestComponent
} from './components';
import { ReportsModule } from '../reports/reports.module';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
    declarations: [
        AgentsComponent,
        CreditLimitRequestComponent,
        BalanceRequestComponent
    ],
    imports: [
        LayoutsModule,
        ReportsModule,
        MasterBalanceManagerRoutingModule
    ]
})
export class MasterBalanceManagerModule { }
