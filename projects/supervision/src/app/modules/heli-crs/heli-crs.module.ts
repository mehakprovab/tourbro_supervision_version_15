import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HeliCrsRoutingModule } from './heli-crs.routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CKEditorModule } from 'ckeditor4-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeliCrsListComponent } from './components/heli-crs-list/heli-crs-list.component';
import { LayoutsModule } from '../../layout/layout.module';
import { HelipadsComponent } from './components/helipads/helipads.component';
import { HeliRoutesComponent } from './components/heli-routes/heli-routes.component';
import { HeliSchedulesComponent } from './components/heli-schedules/heli-schedules.component';
import { HeliPricingRulesComponent } from './components/heli-pricing-rules/heli-pricing-rules.component';
import { HeliTermsandconditionsComponent } from './components/heli-termsandconditions/heli-termsandconditions.component';
import { NgbAccordionModule, NgbCollapseModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { OperatorsListComponent } from './components/heli-crs-list/operators-list/operators-list.component';
import { AddUpdateOperatorsListComponent } from './components/heli-crs-list/add-update-operators-list/add-update-operators-list.component';
import { PricingListComponent } from './components/heli-pricing-rules/pricing-list/pricing-list.component';
import { AddUpdatePricingListComponent } from './components/heli-pricing-rules/add-update-pricing-list/add-update-pricing-list.component';
import { RoutesListComponent } from './components/heli-routes/routes-list/routes-list.component';
import { AddUpdateRoutesListComponent } from './components/heli-routes/add-update-routes-list/add-update-routes-list.component';
import { SchedulesListComponent } from './components/heli-schedules/schedules-list/schedules-list.component';
import { AddUpdateSchedulesListComponent } from './components/heli-schedules/add-update-schedules-list/add-update-schedules-list.component';
import { HelipadsListComponent } from './components/helipads/helipads-list/helipads-list.component';
import { AddUpdateHelipadsListComponent } from './components/helipads/add-update-helipads-list/add-update-helipads-list.component';

@NgModule({
  imports: [
    CommonModule,
    HeliCrsRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutsModule,
    NgbModule,
    NgbAccordionModule,
    NgbPaginationModule,
    NgbCollapseModule,
    NgbNavModule
  ],
  declarations: [
    HeliCrsListComponent,
    HelipadsComponent,
    HeliRoutesComponent,
    HeliSchedulesComponent,
    HeliPricingRulesComponent,
    HeliTermsandconditionsComponent,
    OperatorsListComponent,
    AddUpdateOperatorsListComponent,
    PricingListComponent,
    AddUpdatePricingListComponent,
    RoutesListComponent,
    AddUpdateRoutesListComponent,
    SchedulesListComponent,
    AddUpdateSchedulesListComponent,
    HelipadsListComponent,
    AddUpdateHelipadsListComponent

    
  ],
  exports: [
  ]
})
export class HeliCrsModule { }
