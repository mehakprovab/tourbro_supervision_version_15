import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierManagementComponent } from '../supplier-management/supplier-management.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'management',
        component: SupplierManagementComponent,
        data: {extraParameter: 'supplier-Management-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierManagementRoutingModule { }
