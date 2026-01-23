import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CKEditorModule } from 'ckeditor4-angular';
import { TransferCrsRoutingModule } from './transfer-crs.routing.module';
import { TransferVehiclesComponent } from './components/vehicles/vehicles.component';
import { TransferVehicleAddComponent } from './components/vehicles/add-vehicle/add-vehicle.component';
import { TransferVehicleListComponent } from './components/vehicles/vehicle-list/vehicle-list.component';
import { VehicleTypeComponent } from './components/vehicles/vehicle-type/vehicle-master.component';
import { LanguageMasterComponent } from './components/vehicles/language-master/language-master.component';
import { TermsAndConditionsComponent } from './components/vehicles/termsandconditions/termsandconditions.component';
import { VehicleMasterComponent } from './components/vehicles/vehicle-master/vehicle-master.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { VenderMasterComponent } from './components/vehicles/vender-master/vender-master.component';
@NgModule({
  imports: [
    CommonModule,
    TransferCrsRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
    CKEditorModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    TransferVehicleAddComponent,
    TransferVehicleListComponent,
    TransferVehiclesComponent,
    VehicleTypeComponent,
    LanguageMasterComponent,
    TermsAndConditionsComponent,
    VehicleMasterComponent,
    VenderMasterComponent
  ],
  exports: [
  ]
})
export class TransferCrsModule { }
