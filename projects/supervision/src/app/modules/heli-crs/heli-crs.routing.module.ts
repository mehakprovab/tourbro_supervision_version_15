import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { HeliCrsListComponent } from './components/heli-crs-list/heli-crs-list.component';
import { HelipadsComponent } from './components/helipads/helipads.component';
import { HeliRoutesComponent } from './components/heli-routes/heli-routes.component';
import { HeliSchedulesComponent } from './components/heli-schedules/heli-schedules.component';
import { HeliPricingRulesComponent } from './components/heli-pricing-rules/heli-pricing-rules.component';
import { HeliTermsandconditionsComponent } from './components/heli-termsandconditions/heli-termsandconditions.component';
import { AddUpdateOperatorsListComponent } from './components/heli-crs-list/add-update-operators-list/add-update-operators-list.component';
import { AddUpdateHelipadsListComponent } from './components/helipads/add-update-helipads-list/add-update-helipads-list.component';
import { AddUpdateRoutesListComponent } from './components/heli-routes/add-update-routes-list/add-update-routes-list.component';
import { AddUpdateSchedulesListComponent } from './components/heli-schedules/add-update-schedules-list/add-update-schedules-list.component';
import { AddUpdatePricingListComponent } from './components/heli-pricing-rules/add-update-pricing-list/add-update-pricing-list.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        // canActivateChild: [AuthGuard],
        children: [
            {
                path: 'heli-crs-list',
                component: HeliCrsListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'edit-heli',
                component: AddUpdateOperatorsListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'helipads',
                component: HelipadsComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'edit-helipad',
                component: AddUpdateHelipadsListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'heli-routes',
                component: HeliRoutesComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'edit-route',
                component: AddUpdateRoutesListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'heli-schedules',
                component: HeliSchedulesComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'edit-heli-schedules',
                component: AddUpdateSchedulesListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'heli-pricing',
                component: HeliPricingRulesComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'edit-heli-pricing',
                component: AddUpdatePricingListComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },
            {
                path: 'heli-termsandconditions',
                component: HeliTermsandconditionsComponent,
                data: { extraParameter: 'heliCrsMenus' }
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeliCrsRoutingModule { }
