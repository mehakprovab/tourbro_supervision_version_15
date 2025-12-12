import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCountryStateCityComponent } from '../manage-country-state-city/manage-country-state-city.component';
import { ManageCSCRoutingModule } from './manage-csc.routing.module';
import { LayoutsModule } from '../../layout/layout.module';



@NgModule({
  declarations: [ManageCountryStateCityComponent],
  imports: [
    CommonModule,
    ManageCSCRoutingModule,
    LayoutsModule
  ]
})
export class ManageCountryStateCityModule { }
