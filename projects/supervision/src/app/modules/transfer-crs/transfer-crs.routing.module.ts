import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { TransferVehiclesComponent } from './components/vehicles/vehicles.component';
import { VehicleTypeComponent } from './components/vehicles/vehicle-type/vehicle-master.component';
import { TermsAndConditionsComponent } from './components/vehicles/termsandconditions/termsandconditions.component';
import { VehicleMasterComponent } from './components/vehicles/vehicle-master/vehicle-master.component';
import { VenderMasterComponent } from './components/vehicles/vender-master/vender-master.component';

const routes: Routes = [
    {
        path: 'transfers',
        component: BaseLayoutComponent,
        // canActivateChild: [AuthGuard],
        children: [
            {
                path: 'transfer-crs-list',
                component: TransferVehiclesComponent,
                data: { extraParameter: 'transferCrsMenus' }
            },
            {
                path: 'transfer-vehicle',
                component: VehicleTypeComponent,
                data: { extraParameter: 'transferCrsMenus' }
            },
            {
                path: 'transfer-terms-conditions',
                component: TermsAndConditionsComponent,
                data: { extraParameter: 'transferCrsMenus' }
            },
            {
                path: 'transfer-vehicle-master',
                component: VehicleMasterComponent,
                data: { extraParameter: 'transferCrsMenus' }
            },
 {
                path: 'vender-master',
                component: VenderMasterComponent,
                data: { extraParameter: 'transferCrsMenus' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransferCrsRoutingModule { }