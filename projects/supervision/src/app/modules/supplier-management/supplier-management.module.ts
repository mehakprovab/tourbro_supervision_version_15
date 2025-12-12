import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierManagementComponent } from '../supplier-management/supplier-management.component';
import { SupplierManagementRoutingModule } from './supplier-management.routing.module';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
  declarations: [SupplierManagementComponent],
  imports: [
    CommonModule,
    SupplierManagementRoutingModule,
    LayoutsModule
  ]
})
export class SupplierManagementModule { }
