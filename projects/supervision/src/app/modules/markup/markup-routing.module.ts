import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2cComponent, AgentsComponent } from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
    {
        path: 'markup',
        component: BaseLayoutComponent,
        children: [
            {
                path: 'b2c',
                canActivate: [AuthGuard],
                component: B2cComponent,
                data: { extraParameter: 'markupMenus' }
            },
            {
                path: 'agents',
                canActivate: [AuthGuard],
                component: AgentsComponent,
                data: { extraParameter: 'markupMenus' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarkupRoutingModule { }
