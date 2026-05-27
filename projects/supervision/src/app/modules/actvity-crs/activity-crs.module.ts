import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CKEditorModule } from 'ckeditor4-angular';
import { ActivityCrsRoutingModule } from './activity-crs.rounting.module';
import { ActivityCRSComponent } from './components/activity/activity-crs.component';
import { ActivityCRSListComponent } from './components/activity/activity-crs-list/list-activity-crs.component';
import { AddActivityCRSComponent } from './components/activity/add-activity-crs/add-activity-crs.component';
import { ActivityTypeComponent } from './components/activity/activity-type/activity-type.component';
import { ActivityCountryComponent } from './components/activity/activity-country/activity-country.component';
import { AddActivityCountryComponent } from './components/activity/activity-country/activity-country-add/add-activity-country.component';
import { ListActivityCountryComponent } from './components/activity/activity-country/activity-country-list/list-activity-country.component';
import { ActivityCityComponent } from './components/activity/activity-city/activity-city.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    ActivityCrsRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    FormsModule
  ],
  declarations: [
    ActivityCRSComponent,
    ActivityCRSListComponent,
    AddActivityCRSComponent,

    ActivityTypeComponent,
    
    ActivityCountryComponent,
    AddActivityCountryComponent,
    ListActivityCountryComponent,

    ActivityCityComponent,
  ],
  exports: [
  ]
})
export class ActivityCrsModule { }
