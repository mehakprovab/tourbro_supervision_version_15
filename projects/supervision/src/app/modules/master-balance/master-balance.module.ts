import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterBalanceComponent } from '../master-balance/master-balance.component';
import { MasterBalanceRoutingModule } from './master-balance.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from '../../shared/shared.module';
import { ProcessTransactionComponent, ProcessTransactionBalanceComponent} from './index'
import {
    AgentRequestComponent,
    CreditLimitRequestComponent,
    AllAgentSpecificComponent,
    UserFundComponent,
    BalanceUpdateRequestComponent,
    ListCreditsComponent
} from '../master-balance';
import { ViewImageComponent } from './agent-request/view-image/view-image.component';
import { SplitContentPipe } from './pipe/split-content.pipe';

@NgModule({
    declarations: [
        MasterBalanceComponent,
        AgentRequestComponent,
        CreditLimitRequestComponent,
        AllAgentSpecificComponent,
        UserFundComponent,
        BalanceUpdateRequestComponent,
        ListCreditsComponent,
        ProcessTransactionComponent,
        ProcessTransactionBalanceComponent,
        ViewImageComponent,
        SplitContentPipe
    ],
    imports: [
        CommonModule,
        LayoutsModule,
        SharedModule,
        MasterBalanceRoutingModule,
        Ng2SearchPipeModule,
    ],
    entryComponents: [ProcessTransactionComponent, ProcessTransactionBalanceComponent,ViewImageComponent]
})
export class MasterBalanceModule { }
