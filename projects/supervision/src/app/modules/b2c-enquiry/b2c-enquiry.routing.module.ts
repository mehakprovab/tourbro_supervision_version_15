import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { B2cEnquiryComponent } from './b2c-enquiry.component';
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'inquiry',
        component: B2cEnquiryComponent,
        data: {extraParameter: 'b2c-enquiry-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2cEnquiryRoutingModule { }
