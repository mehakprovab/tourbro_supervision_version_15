import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentsComponent } from './components/agents/agents.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

const routes: Routes = [
    {
        path: 'master-balance-manager',
        component: BaseLayoutComponent,
        children: [
            {
                path: 'agents',
                component: AgentsComponent,
                data: { extraParameter: 'masterBalanceManagerMenus' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterBalanceManagerRoutingModule { }
