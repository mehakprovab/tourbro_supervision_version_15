import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { ActivityCRSComponent } from './components/activity/activity-crs.component';
import { ActivityTypeComponent } from './components/activity/activity-type/activity-type.component';
import { ActivityCountryComponent } from './components/activity/activity-country/activity-country.component';
import { ActivityCityComponent } from './components/activity/activity-city/activity-city.component';
import { LanguageMasterComponent } from '../transfer-crs/components/vehicles/language-master/language-master.component';

const routes: Routes = [
    {
        path: 'activity',
        component: BaseLayoutComponent,
        // canActivateChild: [AuthGuard],
        children: [
           {
                path: 'activity-crs',
                component: ActivityCRSComponent,
                data: { extraParameter: 'activityCrsMenus' }
            },
            {
                path: 'activity-type',
                component: ActivityTypeComponent,
                data: { extraParameter: 'activityCrsMenus' }                
            },
            {
                path: 'activity-country',
                component: ActivityCountryComponent,
                data: { extraParameter: 'activityCrsMenus' }                
            },
            {
                path: 'add-activity-country',
                component: ActivityCountryComponent,
                data: { extraParameter: 'activityCrsMenus' }                
            },
            {
                path: 'activity-city',
                component: ActivityCityComponent,
                data: { extraParameter: 'activityCrsMenus' }
            },
            {
                path: 'activity-language',
                component: LanguageMasterComponent,
                data: { extraParameter: 'activityCrsMenus' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityCrsRoutingModule { }