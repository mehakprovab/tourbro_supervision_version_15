import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

import { WellnessCenterListComponent } from './components/wellness-center-list/wellness-center-list.component';
import { TherapyTypeComponent } from './components/therapy-type/therapy-type.component';
import { TreatmentsComponent } from './components/treatments/treatments.component';
import { HealthGoalsConditionComponent } from './components/health-goals-condition/health-goals-condition.component';
import { PackageTypeComponent } from './components/package-type/package-type.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';

const routes: Routes = [
{
 path: '',
 component: BaseLayoutComponent,
 children: [
   { path: 'wellness-center-list', component: WellnessCenterListComponent },
   { path: 'therapy-type', component: TherapyTypeComponent },
   { path: 'treatments', component: TreatmentsComponent },
   { path: 'health-goals-condition', component: HealthGoalsConditionComponent },
   { path: 'package-type', component: PackageTypeComponent },
   { path: 'meal-plan', component: MealPlanComponent },
   { path: 'facilities', component: FacilitiesComponent }
 ]
}
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class WellnessCrsRoutingModule { }