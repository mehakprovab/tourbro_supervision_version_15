import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PagesLayoutComponent } from './pages-layout/pages-layout.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,
    PagesLayoutComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    BaseLayoutComponent,
    PagesLayoutComponent,
    SharedModule
  ]
})
export class LayoutsModule { }
