import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { DefaultCommissionsComponent } from './default-commissions/default-commissions.component';
import { AgentCommissionsComponent } from './agent-commissions/agent-commissions.component';
import { AuthGuard } from '../../auth/auth.guard';
import { GdsCommissionsComponent } from './gds-commissions/gds-commissions.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'default',
                canActivate: [AuthGuard],
                component: DefaultCommissionsComponent,
                data: { extraParameter: 'commissionsMenus' }
            },
            {
                path: 'agents',
                canActivate: [AuthGuard],
                component: AgentCommissionsComponent,
                data: { extraParameter: 'commissionsMenus' }
            },
            {
                path: 'gds',
                canActivate: [AuthGuard],
                component: GdsCommissionsComponent,
                data: { extraParameter: 'commissionsMenus' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommissionsSupervisionRoutingModule { }
