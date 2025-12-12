import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PagesLayoutComponent } from './pages-layout/pages-layout.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,
    PagesLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    BaseLayoutComponent,
    PagesLayoutComponent, 
    SharedModule
  ]
})
export class LayoutsModule { }
