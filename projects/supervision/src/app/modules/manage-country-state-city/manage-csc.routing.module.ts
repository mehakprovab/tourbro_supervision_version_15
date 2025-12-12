import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCountryStateCityComponent } from '../manage-country-state-city/manage-country-state-city.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'country/state/city',
        component: ManageCountryStateCityComponent,
        data: {extraParameter: 'manage-country-state-city-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCSCRoutingModule { }
